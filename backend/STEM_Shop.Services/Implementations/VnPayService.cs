using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using STEM_Shop.Data.Context;
using STEM_Shop.Data.Models;
using STEM_Shop.Services.DTOs;
using STEM_Shop.Services.Interfaces;
using STEM_Shop.Services.Utils;
using System.Globalization;
using System.Net;
using System.Security.Cryptography;
using System.Text;

namespace STEM_Shop.Services.Implementations
{
    public class VnPayService : IVnPayService
    {
        private readonly STEM_Shop_DBContext _context;
        private readonly IConfiguration _configuration;

        public VnPayService(STEM_Shop_DBContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<ApiResponse<CreateVnPayPaymentResponse>> CreatePaymentUrlAsync(int userId, CreateVnPayPaymentRequest request, HttpContext httpContext)
        {
            try
            {
                var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == request.OrderId && o.UserId == userId);
                if (order == null)
                {
                    return new ApiResponse<CreateVnPayPaymentResponse> { Success = false, Message = "Không tìm thấy đơn hàng" };
                }

                if (order.TotalAmount == null || order.TotalAmount <= 0)
                {
                    return new ApiResponse<CreateVnPayPaymentResponse> { Success = false, Message = "Đơn hàng không hợp lệ" };
                }

                if (order.TotalAmount < 5000)
                {
                    return new ApiResponse<CreateVnPayPaymentResponse>
                    {
                        Success = false,
                        Message = "Số tiền thanh toán tối thiểu là 5.000 VND"
                    };
                }

                if (string.Equals(order.Status, "Paid", StringComparison.OrdinalIgnoreCase))
                {
                    return new ApiResponse<CreateVnPayPaymentResponse> { Success = false, Message = "Đơn hàng đã thanh toán" };
                }

                var baseUrl = _configuration["VnPay:Url"];
                var returnUrl = _configuration["VnPay:ReturnUrl"];
                var tmnCode = _configuration["VnPay:TmnCode"];
                var hashSecret = _configuration["VnPay:HashSecret"]?.Trim();

                if (string.IsNullOrWhiteSpace(baseUrl) || string.IsNullOrWhiteSpace(returnUrl) || string.IsNullOrWhiteSpace(tmnCode) || string.IsNullOrWhiteSpace(hashSecret))
                {
                    return new ApiResponse<CreateVnPayPaymentResponse> { Success = false, Message = "Thiếu cấu hình VNPAY" };
                }

                var now = GetVnTimeNow();
                var txnRef = $"{order.Id}_{now:yyyyMMddHHmmss}";

                // VNPay expects amount in VND * 100
                long amount = (long)order.TotalAmount.Value * 100L;

                if (amount >= 100_000_000_000L)
                {
                    return new ApiResponse<CreateVnPayPaymentResponse>
                    {
                        Success = false,
                        Message = "Số tiền thanh toán phải nhỏ hơn 1 tỷ VND"
                    };
                }

                var ipAddr = GetIpAddress(httpContext);

                if (string.IsNullOrWhiteSpace(returnUrl))
                {
                    var host = httpContext.Request.Host.Value;
                    var scheme = httpContext.Request.Scheme;
                    returnUrl = $"{scheme}://{host}/api/payments/vnpay/return";
                }

                var payLib = new VnPayLibrary();
                payLib.AddRequestData("vnp_Version", "2.1.0");
                payLib.AddRequestData("vnp_Command", "pay");
                payLib.AddRequestData("vnp_TmnCode", tmnCode);
                payLib.AddRequestData("vnp_Amount", amount.ToString(CultureInfo.InvariantCulture));
                payLib.AddRequestData("vnp_CurrCode", "VND");
                payLib.AddRequestData("vnp_TxnRef", txnRef);
                payLib.AddRequestData("vnp_OrderInfo", $"ThanhToanDonHang_{order.Id}");
                payLib.AddRequestData("vnp_OrderType", "other");
                payLib.AddRequestData("vnp_Locale", "vn");
                payLib.AddRequestData("vnp_ReturnUrl", returnUrl);
                payLib.AddRequestData("vnp_IpAddr", ipAddr);
                payLib.AddRequestData("vnp_CreateDate", now.ToString("yyyyMMddHHmmss"));

                var paymentUrl = payLib.CreateRequestUrl(baseUrl, hashSecret);

                var transaction = new Transaction
                {
                    OrderId = order.Id,
                    PaymentMethod = "VNPAY",
                    Status = "Pending",
                    TransactionDate = now
                };

                _context.Transactions.Add(transaction);
                await _context.SaveChangesAsync();

                return new ApiResponse<CreateVnPayPaymentResponse>
                {
                    Success = true,
                    Message = "Tạo link thanh toán thành công",
                    Data = new CreateVnPayPaymentResponse { PaymentUrl = paymentUrl }
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse<CreateVnPayPaymentResponse> { Success = false, Message = ex.Message };
            }
        }

        public ApiResponse<VnPayReturnResponse> ProcessReturn(IQueryCollection query)
        {
            try
            {
                var hashSecret = _configuration["VnPay:HashSecret"]?.Trim();
                if (string.IsNullOrWhiteSpace(hashSecret))
                {
                    return new ApiResponse<VnPayReturnResponse> { Success = false, Message = "Thiếu cấu hình VNPAY" };
                }

                var payLib = new VnPayLibrary();
                payLib.LoadFromQuery(query);

                var receivedHash = query["vnp_SecureHash"].ToString();
                var isValidSignature = payLib.ValidateSignature(receivedHash, hashSecret);

                if (!isValidSignature)
                {
                    return new ApiResponse<VnPayReturnResponse>
                    {
                        Success = false,
                        Message = "Chữ ký không hợp lệ",
                        Data = new VnPayReturnResponse { RspCode = "97", Message = "Invalid signature" }
                    };
                }

                var rspCode = query["vnp_ResponseCode"].ToString();
                var txnRef = query["vnp_TxnRef"].ToString();
                var transactionNo = query["vnp_TransactionNo"].ToString();

                int? orderId = null;
                if (!string.IsNullOrWhiteSpace(txnRef))
                {
                    var parts = txnRef.Split('_');
                    if (parts.Length > 0 && int.TryParse(parts[0], out var parsedOrderId))
                    {
                        orderId = parsedOrderId;
                    }
                }

                var data = new VnPayReturnResponse
                {
                    RspCode = rspCode,
                    Message = rspCode == "00" ? "Thanh toán thành công" : "Thanh toán thất bại",
                    OrderId = orderId,
                    TransactionNo = transactionNo,
                    BankCode = query["vnp_BankCode"].ToString(),
                    PayDate = query["vnp_PayDate"].ToString(),
                    Amount = query["vnp_Amount"].ToString()
                };

                return new ApiResponse<VnPayReturnResponse> { Success = true, Message = "OK", Data = data };
            }
            catch (Exception ex)
            {
                return new ApiResponse<VnPayReturnResponse> { Success = false, Message = ex.Message };
            }
        }

        private static DateTime GetVnTimeNow()
        {
            try
            {
                var tz = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
                return TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, tz);
            }
            catch
            {
                return DateTime.Now;
            }
        }

        private static string GetIpAddress(HttpContext context)
        {
            var ip = context.Connection.RemoteIpAddress?.ToString();
            if (string.Equals(ip, "::1", StringComparison.OrdinalIgnoreCase) || string.IsNullOrWhiteSpace(ip))
            {
                return "127.0.0.1";
            }
            return ip;
        }
    }
}