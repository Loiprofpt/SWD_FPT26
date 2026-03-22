using System.Threading.Tasks;

namespace STEM_Shop.Services.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string message);
    }
}