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

                var invalidItem = cart.CartItems.FirstOrDefault(ci => ci.Product == null);
                if (invalidItem != null)
                {
                    return new ApiResponse<OrderResponse> { Success = false, Message = "Có sản phẩm trong giỏ hàng không tồn tại" };
                }

                var total = cart.CartItems.Sum(ci => ci.Product.Price * ci.Quantity);

                var order = new Order
                {
                    UserId = userId,
                    Address = request.Address,
                    Status = "Pending",
                    OrderDate = DateTime.Now,
                    TotalAmount = total
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                var details = cart.CartItems.Select(ci => new OrderDetail
                {
                    OrderId = order.Id,
                    ProductId = ci.ProductId,
                    Quantity = ci.Quantity,
                    Price = ci.Product.Price
                }).ToList();

                _context.OrderDetails.AddRange(details);

                _context.CartItems.RemoveRange(cart.CartItems);

                await _context.SaveChangesAsync();

                return await GetOrderByIdAsync(order.Id, userId);
            }
            catch (Exception ex)
            {
                return new ApiResponse<OrderResponse> { Success = false, Message = ex.Message };
            }
        }

        public async Task<ApiResponse<OrderResponse>> CancelMyOrderAsync(int userId, int orderId)
        {
            try
            {
                var order = await _context.Orders
                    .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                    .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

                if (order == null)
                {
                    return new ApiResponse<OrderResponse> { Success = false, Message = "Không tìm thấy đơn hàng" };
                }

                if (IsShippingStarted(order.Status))
                {
                    return new ApiResponse<OrderResponse>
                    {
                        Success = false,
                        Message = "Không thể hủy đơn hàng khi đơn hàng đã bắt đầu giao."
                    };
                }

                if (string.Equals(order.Status, "Cancelled", StringComparison.OrdinalIgnoreCase))
                {
                    return new ApiResponse<OrderResponse>
                    {
                        Success = false,
                        Message = "Đơn hàng đã được hủy trước đó."
                    };
                }

                order.Status = "Cancelled";
                _context.Orders.Update(order);
                await _context.SaveChangesAsync();

                return new ApiResponse<OrderResponse>
                {
                    Success = true,
                    Message = "Hủy đơn hàng thành công",
                    Data = MapToOrderResponse(order)
                };
            }
            catch (Exception ex)
            {
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

                var dtos = orders.Select(MapToOrderResponse).ToList();

                return new ApiResponse<List<OrderResponse>> { Success = true, Message = "Lấy danh sách đơn hàng thành công", Data = dtos };
            }
            catch (Exception ex)
            {
                return new ApiResponse<List<OrderResponse>> { Success = false, Message = ex.Message };
            }
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

                var dtos = orders.Select(MapToOrderResponse).ToList();

                return new ApiResponse<List<OrderResponse>>
                {
                    Success = true,
                    Message = "Lấy danh sách đơn hàng thành công",
                    Data = dtos
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse<List<OrderResponse>> { Success = false, Message = ex.Message };
            }
        }

        public async Task<ApiResponse<OrderResponse>> UpdateOrderAsync(int orderId, UpdateOrderRequest request)
        {
            try
            {
                var order = await _context.Orders
                    .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                    .FirstOrDefaultAsync(o => o.Id == orderId);

                if (order == null)
                {
                    return new ApiResponse<OrderResponse> { Success = false, Message = "Không tìm thấy đơn hàng" };
                }

                if (IsShippingStarted(order.Status) && !string.IsNullOrWhiteSpace(request.Address))
                {
                    return new ApiResponse<OrderResponse>
                    {
                        Success = false,
                        Message = "Không thể cập nhật địa chỉ khi đơn hàng đã bắt đầu giao."
                    };
                }

                if (!string.IsNullOrWhiteSpace(request.Address))
                {
                    order.Address = request.Address;
                }

                if (!string.IsNullOrWhiteSpace(request.Status))
                {
                    order.Status = request.Status;
                }

                _context.Orders.Update(order);
                await _context.SaveChangesAsync();

                return new ApiResponse<OrderResponse>
                {
                    Success = true,
                    Message = "Cập nhật đơn hàng thành công",
                    Data = MapToOrderResponse(order)
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse<OrderResponse> { Success = false, Message = ex.Message };
            }
        }

        public async Task<ApiResponse<OrderResponse>> UpdateMyOrderAsync(int userId, int orderId, UpdateMyOrderRequest request)
        {
            try
            {
                var order = await _context.Orders
                    .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                    .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

                if (order == null)
                {
                    return new ApiResponse<OrderResponse> { Success = false, Message = "Không tìm thấy đơn hàng" };
                }

                if (IsShippingStarted(order.Status))
                {
                    return new ApiResponse<OrderResponse>
                    {
                        Success = false,
                        Message = "Không thể cập nhật đơn hàng khi đơn hàng đã bắt đầu giao."
                    };
                }

                if (!string.IsNullOrWhiteSpace(request.Address))
                {
                    order.Address = request.Address;
                }

                if (request.Items != null && request.Items.Count > 0)
                {
                    foreach (var item in request.Items)
                    {
                        if (item.Quantity <= 0)
                        {
                            return new ApiResponse<OrderResponse>
                            {
                                Success = false,
                                Message = "Số lượng phải lớn hơn 0."
                            };
                        }

                        var detail = order.OrderDetails.FirstOrDefault(d => d.Id == item.OrderDetailId);
                        if (detail == null)
                        {
                            return new ApiResponse<OrderResponse>
                            {
                                Success = false,
                                Message = $"Không tìm thấy sản phẩm trong đơn hàng (OrderDetailId={item.OrderDetailId})."
                            };
                        }

                        detail.Quantity = item.Quantity;
                        _context.OrderDetails.Update(detail);
                    }
                }

                order.TotalAmount = order.OrderDetails.Sum(d => (d.Price ?? 0) * (d.Quantity ?? 0));
                _context.Orders.Update(order);
                await _context.SaveChangesAsync();

                return new ApiResponse<OrderResponse>
                {
                    Success = true,
                    Message = "Cập nhật đơn hàng thành công",
                    Data = MapToOrderResponse(order)
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse<OrderResponse> { Success = false, Message = ex.Message };
            }
        }

        private static bool IsShippingStarted(string? status)
        {
            if (string.IsNullOrWhiteSpace(status)) return false;
            status = status.Trim();
            return status.Equals("Shipping", StringComparison.OrdinalIgnoreCase)
                || status.Equals("Shipped", StringComparison.OrdinalIgnoreCase)
                || status.Equals("Delivered", StringComparison.OrdinalIgnoreCase)
                || status.Equals("Completed", StringComparison.OrdinalIgnoreCase);
        }

        public async Task<ApiResponse<bool>> DeleteOrderAsync(int orderId)
        {
            try
            {
                var order = await _context.Orders
                    .Include(o => o.OrderDetails)
                    .FirstOrDefaultAsync(o => o.Id == orderId);

                if (order == null)
                {
                    return new ApiResponse<bool> { Success = false, Message = "Không tìm thấy đơn hàng" };
                }

                if (order.OrderDetails.Any())
                {
                    _context.OrderDetails.RemoveRange(order.OrderDetails);
                }

                _context.Orders.Remove(order);
                await _context.SaveChangesAsync();

                return new ApiResponse<bool> { Success = true, Message = "Xóa đơn hàng thành công", Data = true };
            }
            catch (DbUpdateException)
            {
                return new ApiResponse<bool>
                {
                    Success = false,
                    Message = "Không thể xóa đơn hàng vì đang có dữ liệu liên quan."
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse<bool> { Success = false, Message = ex.Message };
            }
        }

        private async Task<ApiResponse<OrderResponse>> GetOrderByIdAsync(int orderId, int? userId = null)
        {
            var query = _context.Orders
                .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Product)
                .AsQueryable();

            if (userId.HasValue)
            {
                query = query.Where(o => o.UserId == userId.Value);
            }

            var order = await query.FirstOrDefaultAsync(o => o.Id == orderId);

            if (order == null)
            {
                return new ApiResponse<OrderResponse> { Success = false, Message = "Không tìm thấy đơn hàng" };
            }

            return new ApiResponse<OrderResponse> { Success = true, Message = "Lấy đơn hàng thành công", Data = MapToOrderResponse(order) };
        }

        private static OrderResponse MapToOrderResponse(Order order)
        {
            return new OrderResponse
            {
                Id = order.Id,
                UserId = order.UserId ?? 0,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount ?? 0,
                Address = order.Address ?? string.Empty,
                Status = order.Status ?? string.Empty,
                Items = order.OrderDetails.Select(od => new OrderItemResponse
                {
                    OrderDetailId = od.Id,
                    ProductId = od.ProductId ?? 0,
                    ProductName = od.Product?.Name ?? string.Empty,
                    Price = od.Price ?? 0,
                    Quantity = od.Quantity ?? 0
                }).ToList()
            };
        }

        private Task<ApiResponse<OrderResponse>> GetOrderByIdAsync(int orderId, int userId)
            => GetOrderByIdAsync(orderId, (int?)userId);
    }
}
