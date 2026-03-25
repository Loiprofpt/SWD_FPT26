using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using STEM_Shop.Services.DTOs;
using STEM_Shop.Services.Interfaces;
using System.Security.Claims;

namespace STEM_Shop.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        private int GetUserId()
        {
            var idClaim = User.FindFirstValue("id") ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (int.TryParse(idClaim, out int userId))
            {
                return userId;
            }
            throw new UnauthorizedAccessException("Không thể xác thực thông tin ID người dùng.");
        }

        [HttpPost("from-cart")]
        public async Task<IActionResult> CreateOrderFromCart([FromBody] CreateOrderFromCartRequest request)
        {
            try
            {
                var userId = GetUserId();
                var result = await _orderService.CreateOrderFromCartAsync(userId, request);
                if (!result.Success) return BadRequest(result);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<OrderResponse> { Success = false, Message = ex.Message });
            }
        }

        [HttpPost("my/{orderId}/cancel")]
        public async Task<IActionResult> CancelMyOrder(int orderId)
        {
            try
            {
                var userId = GetUserId();
                var result = await _orderService.CancelMyOrderAsync(userId, orderId);
                if (!result.Success) return BadRequest(result);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<OrderResponse> { Success = false, Message = ex.Message });
            }
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMyOrders()
        {
            try
            {
                var userId = GetUserId();
                var result = await _orderService.GetMyOrdersAsync(userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<List<OrderResponse>> { Success = false, Message = ex.Message });
            }
        }

        [HttpPut("my/{orderId}")]
        public async Task<IActionResult> UpdateMyOrder(int orderId, [FromBody] UpdateMyOrderRequest request)
        {
            try
            {
                var userId = GetUserId();
                var result = await _orderService.UpdateMyOrderAsync(userId, orderId, request);
                if (!result.Success) return BadRequest(result);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<OrderResponse> { Success = false, Message = ex.Message });
            }
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> GetAllOrders()
        {
            try
            {
                var result = await _orderService.GetAllOrdersAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<List<OrderResponse>> { Success = false, Message = ex.Message });
            }
        }

        [HttpPut("{orderId}")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> UpdateOrder(int orderId, [FromBody] UpdateOrderRequest request)
        {
            try
            {
                var result = await _orderService.UpdateOrderAsync(orderId, request);
                if (!result.Success) return NotFound(result);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<OrderResponse> { Success = false, Message = ex.Message });
            }
        }

        [HttpDelete("{orderId}")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> DeleteOrder(int orderId)
        {
            try
            {
                var result = await _orderService.DeleteOrderAsync(orderId);
                if (!result.Success) return BadRequest(result);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<bool> { Success = false, Message = ex.Message });
            }
        }
    }
}
