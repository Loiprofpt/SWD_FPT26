using Microsoft.EntityFrameworkCore;
using STEM_Shop.Data.Context;
using STEM_Shop.Data.Models;
using STEM_Shop.Services.DTOs;
using STEM_Shop.Services.Interfaces;

namespace STEM_Shop.Services.Implementations
{
    public class CartService : ICartService
    {
        private readonly STEM_Shop_DBContext _context;

        public CartService(STEM_Shop_DBContext context)
        {
            _context = context;
        }

        private async Task<Cart> GetOrCreateCartAsync(int userId)
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                cart = new Cart { UserId = userId };
                _context.Carts.Add(cart);
                await _context.SaveChangesAsync();
            }

            return cart;
        }

        public async Task<ApiResponse<CartResponse>> GetCartByUserIdAsync(int userId)
        {
            var cart = await GetOrCreateCartAsync(userId);
            
            var response = new CartResponse
            {
                CartId = cart.Id,
                UserId = cart.UserId,
                Items = cart.CartItems.Select(ci => new CartItemResponse
                {
                    Id = ci.Id,
                    ProductId = ci.ProductId,
                    ProductName = ci.Product.Name,
                    ProductImageUrl = ci.Product.ImageUrl,
                    Price = ci.Product.Price,
                    Quantity = ci.Quantity
                }).ToList()
            };

            return new ApiResponse<CartResponse>
            {
                Success = true,
                Message = "Lấy giỏ hàng thành công",
                Data = response
            };
        }

        public async Task<ApiResponse<CartItemResponse>> AddToCartAsync(int userId, AddToCartRequest request)
        {
            var product = await _context.Products.FindAsync(request.ProductId);
            if (product == null)
            {
                return new ApiResponse<CartItemResponse> { Success = false, Message = "Sản phẩm không tồn tại" };
            }

            var cart = await GetOrCreateCartAsync(userId);

            var cartItem = cart.CartItems.FirstOrDefault(ci => ci.ProductId == request.ProductId);

            if (cartItem == null)
            {
                cartItem = new CartItem
                {
                    CartId = cart.Id,
                    ProductId = request.ProductId,
                    Quantity = request.Quantity
                };
                _context.CartItems.Add(cartItem);
            }
            else
            {
                cartItem.Quantity += request.Quantity;
                _context.CartItems.Update(cartItem);
            }

            await _context.SaveChangesAsync();

            // Load product tracking
            await _context.Entry(cartItem).Reference(c => c.Product).LoadAsync();

            var responseItem = new CartItemResponse
            {
                Id = cartItem.Id,
                ProductId = cartItem.ProductId,
                ProductName = cartItem.Product.Name,
                ProductImageUrl = cartItem.Product.ImageUrl,
                Price = cartItem.Product.Price,
                Quantity = cartItem.Quantity
            };

            return new ApiResponse<CartItemResponse> { Success = true, Message = "Thêm vào giỏ hàng thành công", Data = responseItem };
        }

        public async Task<ApiResponse<CartItemResponse>> UpdateCartItemAsync(int userId, int cartItemId, int quantity)
        {
            var cart = await GetOrCreateCartAsync(userId);
            var cartItem = cart.CartItems.FirstOrDefault(ci => ci.Id == cartItemId);

            if (cartItem == null)
            {
                 return new ApiResponse<CartItemResponse> { Success = false, Message = "Sản phẩm trong giỏ hàng không tồn tại" };
            }

            cartItem.Quantity = quantity;
            _context.CartItems.Update(cartItem);
            await _context.SaveChangesAsync();

            var responseItem = new CartItemResponse
            {
                Id = cartItem.Id,
                ProductId = cartItem.ProductId,
                ProductName = cartItem.Product.Name,
                ProductImageUrl = cartItem.Product.ImageUrl,
                Price = cartItem.Product.Price,
                Quantity = cartItem.Quantity
            };

            return new ApiResponse<CartItemResponse> { Success = true, Message = "Cập nhật thành công", Data = responseItem };
        }

        public async Task<ApiResponse<bool>> RemoveFromCartAsync(int userId, int cartItemId)
        {
            var cart = await GetOrCreateCartAsync(userId);
            var cartItem = cart.CartItems.FirstOrDefault(ci => ci.Id == cartItemId);

            if (cartItem == null)
            {
                 return new ApiResponse<bool> { Success = false, Message = "Không tìm thấy" };
            }

            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();

            return new ApiResponse<bool> { Success = true, Message = "Đã xóa khỏi giỏ hàng", Data = true };
        }

        public async Task<ApiResponse<bool>> ClearCartAsync(int userId)
        {
             var cart = await GetOrCreateCartAsync(userId);
             if (cart.CartItems.Any())
             {
                 _context.CartItems.RemoveRange(cart.CartItems);
                 await _context.SaveChangesAsync();
             }

             return new ApiResponse<bool> { Success = true, Message = "Xóa giỏ hàng thành công", Data = true };
        }
    }
}
