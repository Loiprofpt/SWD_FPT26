using System;
using System.ComponentModel.DataAnnotations;

namespace STEM_Shop.Services.DTOs
{
    public class CreateUserRequest
    {
        [Required]
        public string FullName { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        public string PhoneNumber { get; set; }
        public int RoleId { get; set; } = 3; // Mặc định là Member
    }

    public class UpdateUserRequest
    {
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public int? RoleId { get; set; }
        public int? IsBlocked { get; set; } // 0: Active, 1: Blocked
    }

    public class UserResponse : AuthResponse
    {
        public DateTime? CreatedAt { get; set; }
        public int? IsBlocked { get; set; }
    }

    public class UserProfileResponse
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Role { get; set; }
    }

    public class UpdateProfileRequest
    {
        [Required(ErrorMessage = "Họ tên không được để trống")]
        public string FullName { get; set; }
        
        [Phone(ErrorMessage = "Số điện thoại không hợp lệ")]
        public string PhoneNumber { get; set; }
    }
}