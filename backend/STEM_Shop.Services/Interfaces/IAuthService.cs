using STEM_Shop.Services.DTOs;
using System.Threading.Tasks;

namespace STEM_Shop.Services.Interfaces
{
    public interface IAuthService
    {
        Task<ApiResponse<AuthResponse>> LoginAsync(LoginRequest request);
        Task<ApiResponse<AuthResponse>> RegisterAsync(RegisterRequest request);
        Task<ApiResponse<bool>> ForgotPasswordAsync(string email);
        Task<ApiResponse<bool>> ResetPasswordAsync(ResetPasswordRequest request);
        Task<ApiResponse<AuthResponse>> GoogleLoginAsync(GoogleLoginRequest request);
        Task<ApiResponse<bool>> ChangePasswordAsync(int userId, ChangePasswordRequest request);
    }
}