using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using STEM_Shop.Services.DTOs;
using STEM_Shop.Services.Interfaces;
using System.Security.Claims;

namespace STEM_Shop.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Chỉ có user đăng nhập mới có giỏ hàng
    public class CartsController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartsController(ICartService cartService)
        {
            _cartService = cartService;
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

        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            try
            {
                var userId = GetUserId();
                var result = await _cartService.GetCartByUserIdAsync(userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<CartResponse> { Success = false, Message = ex.Message });
            }
        }

        [HttpPost("items")]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartRequest request)
        {
            try
            {
                var userId = GetUserId();
                var result = await _cartService.AddToCartAsync(userId, request);
                if (!result.Success) return BadRequest(result);
                return Ok(result);
            }
             catch (Exception ex)
            {
                return BadRequest(new ApiResponse<CartItemResponse> { Success = false, Message = ex.Message });
            }
        }

        [HttpPut("items/{cartItemId}")]
        public async Task<IActionResult> UpdateCartItem(int cartItemId, [FromBody] UpdateCartItemRequest request)
        {
            try
            {
                var userId = GetUserId();
                var result = await _cartService.UpdateCartItemAsync(userId, cartItemId, request.Quantity);
                if (!result.Success) return BadRequest(result);
                return Ok(result);
            }
            catch (Exception ex)
            {
                 return BadRequest(new ApiResponse<CartItemResponse> { Success = false, Message = ex.Message });
            }
        }

        [HttpDelete("items/{cartItemId}")]
        public async Task<IActionResult> RemoveFromCart(int cartItemId)
        {
            try
            {
                var userId = GetUserId();
                var result = await _cartService.RemoveFromCartAsync(userId, cartItemId);
                if (!result.Success) return BadRequest(result);
                return Ok(result);
            }
            catch (Exception ex)
            {
                 return BadRequest(new ApiResponse<bool> { Success = false, Message = ex.Message });
            }
        }

        [HttpDelete]
        public async Task<IActionResult> ClearCart()
        {
            try
            {
                var userId = GetUserId();
                var result = await _cartService.ClearCartAsync(userId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                 return BadRequest(new ApiResponse<bool> { Success = false, Message = ex.Message });
            }
        }
    }
}
