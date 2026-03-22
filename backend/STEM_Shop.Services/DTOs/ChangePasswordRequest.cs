using System.ComponentModel.DataAnnotations;

namespace STEM_Shop.Services.DTOs
{
    public class ChangePasswordRequest
    {
        [Required(ErrorMessage = "Mật khẩu cũ là bắt buộc")]
        public string OldPassword { get; set; }

        [Required(ErrorMessage = "Mật khẩu mới là bắt buộc")]
        [MinLength(6, ErrorMessage = "Mật khẩu phải có ít nhất 6 ký tự")]
        public string NewPassword { get; set; }
    }
}