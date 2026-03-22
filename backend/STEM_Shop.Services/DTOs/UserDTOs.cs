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
}