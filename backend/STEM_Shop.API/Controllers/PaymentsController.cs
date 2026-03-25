using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using STEM_Shop.Data.Context;
using STEM_Shop.Services.DTOs;
using STEM_Shop.Services.Interfaces;

namespace STEM_Shop.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly IVnPayService _vnPayService;
        private readonly STEM_Shop_DBContext _context;

        public PaymentsController(IVnPayService vnPayService, STEM_Shop_DBContext context)
        {
            _vnPayService = vnPayService;
            _context = context;
        }

        private int GetUserId()
        {
            var idClaim = User.FindFirst("id")?.Value;
            if (int.TryParse(idClaim, out var userId))
            {
                return userId;
            }
            throw new UnauthorizedAccessException("Không thể xác thực thông tin ID người dùng.");
        }

        [HttpPost("vnpay/create-url")]
        [Authorize]
        public async Task<IActionResult> CreateVnPayUrl([FromBody] CreateVnPayPaymentRequest request)
        {
            try
            {
                var userId = GetUserId();
                var result = await _vnPayService.CreatePaymentUrlAsync(userId, request, HttpContext);
                if (!result.Success) return BadRequest(result);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<CreateVnPayPaymentResponse> { Success = false, Message = ex.Message });
            }
        }

        [HttpGet("vnpay/return")]
        [AllowAnonymous]
        public async Task<IActionResult> VnPayReturn()
        {
            try
            {
                var result = _vnPayService.ProcessReturn(Request.Query);
                if (!result.Success || result.Data?.OrderId == null)
                {
                    return Ok(result);
                }

                // Update order + latest pending transaction
                var order = await _context.Orders.FindAsync(result.Data.OrderId.Value);
                if (order != null)
                {
                    if (result.Data.RspCode == "00")
                    {
                        order.Status = "Paid";
                    }
                    else
                    {
                        order.Status = "PaymentFailed";
                    }
                    _context.Orders.Update(order);
                }

                var tx = _context.Transactions
                    .Where(t => t.OrderId == result.Data.OrderId.Value && t.PaymentMethod == "VNPAY")
                    .OrderByDescending(t => t.TransactionDate)
                    .FirstOrDefault();

                if (tx != null)
                {
                    tx.Status = result.Data.RspCode == "00" ? "Success" : "Failed";
                    _context.Transactions.Update(tx);
                }

                await _context.SaveChangesAsync();

                var frontendReturnUrl = HttpContext.RequestServices.GetService<IConfiguration>()?["VnPay:FrontendReturnUrl"];
                if (!string.IsNullOrWhiteSpace(frontendReturnUrl))
                {
                    var redirectUrl =
                        $"{frontendReturnUrl}?orderId={result.Data.OrderId.Value}" +
                        $"&code={Uri.EscapeDataString(result.Data.RspCode ?? string.Empty)}" +
                        $"&message={Uri.EscapeDataString(result.Data.Message ?? string.Empty)}";
                    return Redirect(redirectUrl);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<VnPayReturnResponse> { Success = false, Message = ex.Message });
            }
        }
    }
}
