using Microsoft.EntityFrameworkCore;
using STEM_Shop.Data.Context;
using STEM_Shop.Data.Models;
using STEM_Shop.Services.DTOs;
using STEM_Shop.Services.Interfaces;

namespace STEM_Shop.Services.Implementations
{
    public class OrderService : IOrderService
    {
        private readonly STEM_Shop_DBContext _context;

        public OrderService(STEM_Shop_DBContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse<OrderResponse>> CreateOrderFromCartAsync(int userId, CreateOrderFromCartRequest request)
        {
            // Sử dụng Transaction để đảm bảo an toàn dữ liệu kho
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var cart = await _context.Carts
                    .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Product)
                    .FirstOrDefaultAsync(c => c.UserId == userId);

                if (cart == null || cart.CartItems.Count == 0)
                {
                    return new ApiResponse<OrderResponse> { Success = false, Message = "Giỏ hàng trống" };
                }

                // 1. Tạo đối tượng Order trước
                var order = new Order
                {
                    UserId = userId,
                    Address = request.Address,
                    Status = "Pending",
                    OrderDate = DateTime.Now,
                    TotalAmount = 0 // Sẽ tính toán sau khi check kho
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                int totalCalculated = 0;

                // 2. Duyệt từng sản phẩm để kiểm tra và trừ kho
                foreach (var item in cart.CartItems)
                {
                    var product = item.Product;
                    if (product == null) throw new Exception("Sản phẩm không tồn tại.");

                    // Kiểm tra tổng tồn kho trước
                    if (product.StockQuantity < item.Quantity)
                    {
                        throw new Exception($"Sản phẩm '{product.Name}' không đủ số lượng trong tổng kho (Còn {product.StockQuantity}).");
                    }

                    // A. Trừ tổng tồn kho ở bảng Product
                    product.StockQuantity -= item.Quantity;

                    // B. Trừ tồn kho tại các Warehouse (nếu có bản ghi)
                    var warehouseStocks = await _context.WarehouseStocks
                        .Where(ws => ws.ProductId == item.ProductId && (ws.Quantity ?? 0) > 0)
                        .OrderByDescending(ws => ws.Quantity)
                        .ToListAsync();

                    if (warehouseStocks.Any())
                    {
                        int remainingToFulfill = item.Quantity;
                        foreach (var ws in warehouseStocks)
                        {
                            if (remainingToFulfill <= 0) break;

                            int deductAmount = Math.Min(ws.Quantity ?? 0, remainingToFulfill);
                            ws.Quantity = (ws.Quantity ?? 0) - deductAmount;
                            remainingToFulfill -= deductAmount;

                            _context.InventoryLogs.Add(new InventoryLog
                            {
                                ProductId = item.ProductId,
                                WarehouseId = ws.WarehouseId,
                                Type = "OUT",
                                Quantity = deductAmount,
                                LogDate = DateTime.Now,
                                Note = $"Xuất kho cho đơn hàng #{order.Id}"
                            });
                        }
                    }

                    // C. Tạo OrderDetail
                    var detail = new OrderDetail
                    {
                        OrderId = order.Id,
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        Price = product.Price
                    };
                    _context.OrderDetails.Add(detail);

                    totalCalculated += (product.Price * item.Quantity);
                }

                // 3. Cập nhật lại tổng tiền thực tế và xóa giỏ hàng
                order.TotalAmount = totalCalculated;
                _context.CartItems.RemoveRange(cart.CartItems);

                await _context.SaveChangesAsync();

                // Xác nhận hoàn tất giao dịch
                await transaction.CommitAsync();

                return await GetOrderByIdAsync(order.Id, userId);
            }
            catch (Exception ex)
            {
                // Nếu có bất kỳ lỗi nào (hết hàng giữa chừng), hoàn tác toàn bộ
                await transaction.RollbackAsync();
                return new ApiResponse<OrderResponse> { Success = false, Message = ex.Message };
            }
        }

        public async Task<ApiResponse<OrderResponse>> CancelMyOrderAsync(int userId, int orderId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var order = await _context.Orders
                    .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                    .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

                if (order == null) return new ApiResponse<OrderResponse> { Success = false, Message = "Không tìm thấy đơn hàng" };

                if (IsShippingStarted(order.Status))
                    return new ApiResponse<OrderResponse> { Success = false, Message = "Đơn đang giao, không thể hủy." };

                if (order.Status == "Cancelled")
                    return new ApiResponse<OrderResponse> { Success = false, Message = "Đơn đã hủy trước đó." };

                // LOGIC HOÀN KHO: Khi hủy đơn, phải trả lại hàng cho kho
                foreach (var detail in order.OrderDetails)
                {
                    if (detail.ProductId.HasValue)
                    {
                        // 1. Cộng lại vào tổng kho
                        var product = await _context.Products.FindAsync(detail.ProductId);
                        if (product != null) product.StockQuantity += detail.Quantity ?? 0;

                        // 2. Cộng lại vào kho gần nhất (hoặc kho ban đầu nếu bạn lưu WarehouseId vào OrderDetail)
                        // Ở đây ta cộng vào kho đầu tiên tìm thấy của sản phẩm đó
                        var ws = await _context.WarehouseStocks.FirstOrDefaultAsync(x => x.ProductId == detail.ProductId);
                        if (ws != null)
                        {
                            ws.Quantity += detail.Quantity ?? 0;

                            // Ghi Log hoàn kho (Nhập lại - IN)
                            _context.InventoryLogs.Add(new InventoryLog
                            {
                                ProductId = detail.ProductId,
                                WarehouseId = ws.WarehouseId,
                                Type = "IN",
                                Quantity = detail.Quantity,
                                LogDate = DateTime.Now,
                                Note = $"Hoàn kho từ việc hủy đơn hàng #{order.Id}"
                            });
                        }
                    }
                }

                order.Status = "Cancelled";
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return new ApiResponse<OrderResponse> { Success = true, Message = "Hủy đơn và hoàn kho thành công", Data = MapToOrderResponse(order) };
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return new ApiResponse<OrderResponse> { Success = false, Message = ex.Message };
            }
        }

        public async Task<ApiResponse<List<OrderResponse>>> GetMyOrdersAsync(int userId)
        {
            try
            {
                var orders = await _context.Orders
                    .Where(o => o.UserId == userId)
                    .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                    .OrderByDescending(o => o.OrderDate)
                    .ToListAsync();

                return new ApiResponse<List<OrderResponse>> { Success = true, Data = orders.Select(MapToOrderResponse).ToList() };
            }
            catch (Exception ex) { return new ApiResponse<List<OrderResponse>> { Success = false, Message = ex.Message }; }
        }

        public async Task<ApiResponse<List<OrderResponse>>> GetAllOrdersAsync()
        {
            try
            {
                var orders = await _context.Orders
                    .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                    .OrderByDescending(o => o.OrderDate)
                    .ToListAsync();

                return new ApiResponse<List<OrderResponse>> { Success = true, Data = orders.Select(MapToOrderResponse).ToList() };
            }
            catch (Exception ex) { return new ApiResponse<List<OrderResponse>> { Success = false, Message = ex.Message }; }
        }

        public async Task<ApiResponse<OrderResponse>> UpdateOrderAsync(int orderId, UpdateOrderRequest request)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var order = await _context.Orders
                    .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                    .FirstOrDefaultAsync(o => o.Id == orderId);

                if (order == null) return new ApiResponse<OrderResponse> { Success = false, Message = "Không tìm thấy" };

                if (!string.IsNullOrWhiteSpace(request.Address)) order.Address = request.Address;

                // Nếu Admin chuyển trạng thái sang Cancelled → hoàn kho
                if (!string.IsNullOrWhiteSpace(request.Status))
                {
                    bool isCancelling = request.Status == "Cancelled" && order.Status != "Cancelled";

                    order.Status = request.Status;

                    if (isCancelling)
                    {
                        foreach (var detail in order.OrderDetails)
                        {
                            if (detail.ProductId.HasValue)
                            {
                                var product = await _context.Products.FindAsync(detail.ProductId);
                                if (product != null) product.StockQuantity += detail.Quantity ?? 0;

                                var ws = await _context.WarehouseStocks.FirstOrDefaultAsync(x => x.ProductId == detail.ProductId);
                                if (ws != null)
                                {
                                    ws.Quantity = (ws.Quantity ?? 0) + (detail.Quantity ?? 0);
                                    _context.InventoryLogs.Add(new InventoryLog
                                    {
                                        ProductId = detail.ProductId,
                                        WarehouseId = ws.WarehouseId,
                                        Type = "IN",
                                        Quantity = detail.Quantity,
                                        LogDate = DateTime.Now,
                                        Note = $"Admin hoàn kho - hủy đơn #{order.Id}"
                                    });
                                }
                            }
                        }
                    }
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return new ApiResponse<OrderResponse> { Success = true, Data = MapToOrderResponse(order) };
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return new ApiResponse<OrderResponse> { Success = false, Message = ex.Message };
            }
        }

        public async Task<ApiResponse<OrderResponse>> UpdateMyOrderAsync(int userId, int orderId, UpdateMyOrderRequest request)
        {
            // Tương tự Create, nếu thay đổi số lượng ở đây bạn cũng phải xử lý cộng/trừ kho 
            // Nhưng để đơn giản cho đồ án, thường ta chỉ cho phép sửa địa chỉ.
            try
            {
                var order = await _context.Orders.Include(o => o.OrderDetails).FirstOrDefaultAsync(x => x.Id == orderId && x.UserId == userId);
                if (order == null || IsShippingStarted(order.Status)) return new ApiResponse<OrderResponse> { Success = false, Message = "Không thể sửa" };

                if (!string.IsNullOrWhiteSpace(request.Address)) order.Address = request.Address;

                await _context.SaveChangesAsync();
                return new ApiResponse<OrderResponse> { Success = true, Data = MapToOrderResponse(order) };
            }
            catch (Exception ex) { return new ApiResponse<OrderResponse> { Success = false, Message = ex.Message }; }
        }

        public async Task<ApiResponse<bool>> DeleteOrderAsync(int orderId)
        {
            try
            {
                var order = await _context.Orders.Include(o => o.OrderDetails).FirstOrDefaultAsync(o => o.Id == orderId);
                if (order == null) return new ApiResponse<bool> { Success = false };

                _context.OrderDetails.RemoveRange(order.OrderDetails);
                _context.Orders.Remove(order);
                await _context.SaveChangesAsync();
                return new ApiResponse<bool> { Success = true, Data = true };
            }
            catch (Exception ex) { return new ApiResponse<bool> { Success = false, Message = ex.Message }; }
        }

        private async Task<ApiResponse<OrderResponse>> GetOrderByIdAsync(int orderId, int? userId = null)
        {
            var query = _context.Orders.Include(o => o.OrderDetails).ThenInclude(od => od.Product).AsQueryable();
            if (userId.HasValue) query = query.Where(o => o.UserId == userId.Value);
            var order = await query.FirstOrDefaultAsync(o => o.Id == orderId);
            if (order == null) return new ApiResponse<OrderResponse> { Success = false, Message = "Không tìm thấy" };
            return new ApiResponse<OrderResponse> { Success = true, Data = MapToOrderResponse(order) };
        }

        private static bool IsShippingStarted(string? status)
        {
            if (string.IsNullOrWhiteSpace(status)) return false;
            string[] shippingStatuses = { "Shipping", "Shipped", "Delivered", "Completed" };
            return shippingStatuses.Contains(status, StringComparer.OrdinalIgnoreCase);
        }

        private static OrderResponse MapToOrderResponse(Order order)
        {
            return new OrderResponse
            {
                Id = order.Id,
                UserId = order.UserId ?? 0,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount ?? 0,
                Address = order.Address ?? "",
                Status = order.Status ?? "",
                Items = order.OrderDetails.Select(od => new OrderItemResponse
                {
                    OrderDetailId = od.Id,
                    ProductId = od.ProductId ?? 0,
                    ProductName = od.Product?.Name ?? "",
                    Price = od.Price ?? 0,
                    Quantity = od.Quantity ?? 0
                }).ToList()
            };
        }

        private Task<ApiResponse<OrderResponse>> GetOrderByIdAsync(int orderId, int userId)
            => GetOrderByIdAsync(orderId, (int?)userId);
    }
}