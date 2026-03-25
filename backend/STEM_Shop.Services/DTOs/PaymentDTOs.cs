namespace STEM_Shop.Services.DTOs
{
    public class CreateVnPayPaymentRequest
    {
        public int OrderId { get; set; }
    }

    public class CreateVnPayPaymentResponse
    {
        public string PaymentUrl { get; set; } = string.Empty;
    }

    public class VnPayReturnResponse
    {
        public string? RspCode { get; set; }
        public string? Message { get; set; }
        public int? OrderId { get; set; }
        public string? TransactionNo { get; set; }
        public string? BankCode { get; set; }
        public string? PayDate { get; set; }
        public string? Amount { get; set; }
    }
}
