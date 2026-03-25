namespace STEM_Shop.Services.DTOs
{
    public class CreateOrderFromCartRequest
    {
        public string Address { get; set; } = string.Empty;
    }

    public class UpdateOrderRequest
    {
        public string? Address { get; set; }
        public string? Status { get; set; }
    }

    public class UpdateMyOrderRequest
    {
        public string? Address { get; set; }
        public List<UpdateOrderItemQuantityRequest> Items { get; set; } = new();
    }

    public class UpdateOrderItemQuantityRequest
    {
        public int OrderDetailId { get; set; }
        public int Quantity { get; set; }
    }

    public class OrderItemResponse
    {
        public int OrderDetailId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int Price { get; set; }
        public int Quantity { get; set; }
        public int TotalPrice => Price * Quantity;
    }

    public class OrderResponse
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public DateTime? OrderDate { get; set; }
        public int TotalAmount { get; set; }
        public string Address { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public List<OrderItemResponse> Items { get; set; } = new();
    }
}
