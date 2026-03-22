using System.ComponentModel.DataAnnotations;

namespace STEM_Shop.Services.DTOs
{
    // Class dùng chung cho phản hồi API
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public T Data { get; set; }
    }

    // Class trả về khi đăng nhập thành công
    public class AuthResponse
    {
        public int UserId { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string Token { get; set; }
        public string Role { get; set; }
    }

    public class LoginRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }

    public class RegisterRequest
    {
        [Required]
        public string FullName { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        public string PhoneNumber { get; set; }
    }
    
    public class ForgotPasswordRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }

    public class GoogleLoginRequest
    {
        [Required]
        public string IdToken { get; set; }
    }

    public class ResetPasswordRequest
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string Token { get; set; } // Token nhận được từ email
        [Required]
        public string NewPassword { get; set; }
    }
}