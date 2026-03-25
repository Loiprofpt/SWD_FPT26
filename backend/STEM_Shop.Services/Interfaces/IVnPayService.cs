using Microsoft.AspNetCore.Http;
using STEM_Shop.Services.DTOs;

namespace STEM_Shop.Services.Interfaces
{
    public interface IVnPayService
    {
        Task<ApiResponse<CreateVnPayPaymentResponse>> CreatePaymentUrlAsync(int userId, CreateVnPayPaymentRequest request, HttpContext httpContext);
        ApiResponse<VnPayReturnResponse> ProcessReturn(IQueryCollection query);
    }
}
