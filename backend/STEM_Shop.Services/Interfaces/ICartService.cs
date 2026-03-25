using STEM_Shop.Services.DTOs;

namespace STEM_Shop.Services.Interfaces
{
    public interface ICartService
    {
        Task<ApiResponse<CartResponse>> GetCartByUserIdAsync(int userId);
        Task<ApiResponse<CartItemResponse>> AddToCartAsync(int userId, AddToCartRequest request);
        Task<ApiResponse<CartItemResponse>> UpdateCartItemAsync(int userId, int cartItemId, int quantity);
        Task<ApiResponse<bool>> RemoveFromCartAsync(int userId, int cartItemId);
        Task<ApiResponse<bool>> ClearCartAsync(int userId);
    }
}
