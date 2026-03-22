using Google.Apis.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using STEM_Shop.Data.Context;
using STEM_Shop.Data.Models;
using STEM_Shop.Services.DTOs;
using STEM_Shop.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace STEM_Shop.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly STEM_Shop_DBContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public AuthService(STEM_Shop_DBContext context, IConfiguration configuration, IEmailService emailService)
        {
            _context = context;
            _configuration = configuration;
            _emailService = emailService;
        }

        public async Task<ApiResponse<AuthResponse>> LoginAsync(LoginRequest request)
        {
            var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Email == request.Email);
            
            // Kiểm tra mật khẩu (Lưu ý: Thực tế nên dùng BCrypt để hash password)
            if (user == null || user.Password != request.Password) 
            {
                return new ApiResponse<AuthResponse> { Success = false, Message = "Email hoặc mật khẩu không đúng" };
            }

            if (user.IsBlocked == 1)
            {
                return new ApiResponse<AuthResponse> { Success = false, Message = "Tài khoản đã bị khóa" };
            }

            var token = GenerateJwtToken(user);

            return new ApiResponse<AuthResponse>
            {
                Success = true,
                Message = "Đăng nhập thành công",
                Data = new AuthResponse
                {
                    UserId = user.Id,
                    Email = user.Email,
                    FullName = user.FullName,
                    Token = token,
                    Role = user.Role?.RoleName
                }
            };
        }

        public async Task<ApiResponse<AuthResponse>> RegisterAsync(RegisterRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return new ApiResponse<AuthResponse> { Success = false, Message = "Email đã tồn tại" };
            }

            var newUser = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                Password = request.Password, 
                PhoneNumber = request.PhoneNumber,
                RoleId = 3, // Mặc định là Member
                CreatedAt = DateTime.Now,
                IsBlocked = 0
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();
            await _context.Entry(newUser).Reference(u => u.Role).LoadAsync();

            var token = GenerateJwtToken(newUser);

            return new ApiResponse<AuthResponse>
            {
                Success = true,
                Message = "Đăng ký thành công",
                Data = new AuthResponse
                {
                    UserId = newUser.Id,
                    Email = newUser.Email,
                    FullName = newUser.FullName,
                    Token = token,
                    Role = newUser.Role?.RoleName
                }
            };
        }

        public async Task<ApiResponse<bool>> ForgotPasswordAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null) return new ApiResponse<bool> { Success = false, Message = "Email không tồn tại trong hệ thống" };

            // Tạo Token reset password (JWT ngắn hạn 15 phút)
            var resetToken = GenerateJwtToken(user, isResetToken: true);

            // Lấy đường dẫn Frontend từ cấu hình
            var frontendUrl = _configuration["AppSettings:FrontendUrl"] ?? "http://localhost:3000";
            string resetLink = $"{frontendUrl}/reset-password?email={email}&token={resetToken}";
            
            string emailBody = $"<h3>Yêu cầu đặt lại mật khẩu</h3><p>Bấm vào link sau để đặt lại mật khẩu của bạn:</p><a href='{resetLink}'>Đặt lại mật khẩu</a><br/><p>Link hết hạn sau 15 phút.</p>";
            
            await _emailService.SendEmailAsync(email, "STEM Shop - Quên mật khẩu", emailBody);

            return new ApiResponse<bool> 
            { 
                Success = true, 
                Message = "Email hướng dẫn đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư đến.", 
                Data = true 
            };
        }

        public async Task<ApiResponse<bool>> ResetPasswordAsync(ResetPasswordRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null) return new ApiResponse<bool> { Success = false, Message = "Người dùng không tồn tại" };

            // Validate Token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "SecretKeyDayLaKhoaBiMatCuaSTEMShop2024");

            try
            {
                tokenHandler.ValidateToken(request.Token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var purpose = jwtToken.Claims.First(x => x.Type == "purpose").Value;

                if (purpose != "reset_password")
                {
                    return new ApiResponse<bool> { Success = false, Message = "Token không hợp lệ" };
                }
            }
            catch
            {
                return new ApiResponse<bool> { Success = false, Message = "Token hết hạn hoặc không hợp lệ" };
            }

            // Cập nhật mật khẩu mới
            user.Password = request.NewPassword;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return new ApiResponse<bool> { Success = true, Message = "Đổi mật khẩu thành công", Data = true };
        }

        public async Task<ApiResponse<AuthResponse>> GoogleLoginAsync(GoogleLoginRequest request)
        {
            try
            {
                // Validate token từ Google
                var payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken);
                
                var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Email == payload.Email);

                if (user == null)
                {
                    // Nếu chưa có user, tự động đăng ký
                    user = new User
                    {
                        Email = payload.Email,
                        FullName = payload.Name,
                        Password = Guid.NewGuid().ToString(), // Mật khẩu ngẫu nhiên
                        RoleId = 3, // Member
                        CreatedAt = DateTime.Now,
                        IsBlocked = 0,
                        // ImageUrl = payload.Picture // Nếu model User có trường ảnh
                    };
                    _context.Users.Add(user);
                    await _context.SaveChangesAsync();
                    await _context.Entry(user).Reference(u => u.Role).LoadAsync();
                }
                else if (user.IsBlocked == 1)
                {
                    return new ApiResponse<AuthResponse> { Success = false, Message = "Tài khoản đã bị khóa" };
                }

                var token = GenerateJwtToken(user);

                return new ApiResponse<AuthResponse>
                {
                    Success = true,
                    Message = "Đăng nhập Google thành công",
                    Data = new AuthResponse
                    {
                        UserId = user.Id,
                        Email = user.Email,
                        FullName = user.FullName,
                        Token = token,
                        Role = user.Role?.RoleName
                    }
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse<AuthResponse> { Success = false, Message = "Token Google không hợp lệ: " + ex.Message };
            }
        }

        private string GenerateJwtToken(User user, bool isResetToken = false)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("id", user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role?.RoleName ?? "Member"),
                new Claim("purpose", isResetToken ? "reset_password" : "access_token")
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "SecretKeyDayLaKhoaBiMatCuaSTEMShop2024"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expiry = isResetToken ? DateTime.Now.AddMinutes(15) : DateTime.Now.AddDays(1);

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"] ?? "STEM_Shop",
                _configuration["Jwt:Audience"] ?? "STEM_Shop_User",
                claims,
                expires: expiry,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}