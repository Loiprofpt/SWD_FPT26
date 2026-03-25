using STEM_Shop.Services.DTOs;

namespace STEM_Shop.Services.Interfaces
{
    public interface IOrderService
    {
        Task<ApiResponse<OrderResponse>> CreateOrderFromCartAsync(int userId, CreateOrderFromCartRequest request);
        Task<ApiResponse<List<OrderResponse>>> GetMyOrdersAsync(int userId);

        Task<ApiResponse<List<OrderResponse>>> GetAllOrdersAsync();
        Task<ApiResponse<OrderResponse>> UpdateMyOrderAsync(int userId, int orderId, UpdateMyOrderRequest request);
        Task<ApiResponse<OrderResponse>> CancelMyOrderAsync(int userId, int orderId);
        Task<ApiResponse<OrderResponse>> UpdateOrderAsync(int orderId, UpdateOrderRequest request);
        Task<ApiResponse<bool>> DeleteOrderAsync(int orderId);
    }
}
