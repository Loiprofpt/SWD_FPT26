using Microsoft.AspNetCore.Mvc;
using STEM_Shop.Services.DTOs;
using STEM_Shop.Services.Interfaces;
using System.Threading.Tasks;

namespace STEM_Shop.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var result = await _authService.LoginAsync(request);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var result = await _authService.RegisterAsync(request);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        /// <summary>
        /// Gửi yêu cầu quên mật khẩu (Gửi mail kèm link).
        /// </summary>
        /// <remarks>
        /// API này sẽ gửi một email chứa đường dẫn đặt lại mật khẩu đến email người dùng.
        /// <br/>
        /// Đường dẫn trong email có dạng: <code>{frontendUrl}/reset-password?email=...&amp;token=...</code>
        /// </remarks>
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var result = await _authService.ForgotPasswordAsync(request.Email);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        /// <summary>
        /// Đặt lại mật khẩu mới (Sử dụng Token từ email).
        /// </summary>
        /// <remarks>
        /// <b>Quy trình cho Frontend:</b>
        /// <ol>
        /// <li>User bấm link trong email -> Web mở ra trang Reset Password.</li>
        /// <li>Frontend lấy <code>email</code> và <code>token</code> từ URL param.</li>
        /// <li>User nhập mật khẩu mới -> Gọi API này để cập nhật.</li>
        /// </ol>
        /// </remarks>
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            var result = await _authService.ResetPasswordAsync(request);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
        {
            var result = await _authService.GoogleLoginAsync(request);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }
    }
}