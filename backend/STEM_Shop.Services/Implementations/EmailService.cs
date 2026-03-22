using Microsoft.Extensions.Configuration;
using STEM_Shop.Services.Interfaces;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace STEM_Shop.Services.Implementations
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string message)
        {
            var emailSettings = _configuration.GetSection("EmailSettings");

            var mail = "your-email@gmail.com"; 
            var pw = "your-app-password";

            var client = new SmtpClient(emailSettings["Host"], int.Parse(emailSettings["Port"] ?? "587"))
            {
                EnableSsl = true,
                Credentials = new NetworkCredential(emailSettings["Email"], emailSettings["Password"])
            };

            var mailMessage = new MailMessage(from: emailSettings["Email"], to: toEmail, subject, message);
            mailMessage.IsBodyHtml = true;

            await client.SendMailAsync(mailMessage);
        }
    }
}