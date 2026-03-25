namespace STEM_Shop.Services.DTOs
{
    public class CartItemResponse
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string? ProductImageUrl { get; set; }
        public int Price { get; set; }
        public int Quantity { get; set; }
        public int TotalPrice => Price * Quantity;
    }

    public class CartResponse
    {
        public int CartId { get; set; }
        public int UserId { get; set; }
        public List<CartItemResponse> Items { get; set; } = new List<CartItemResponse>();
        public int TotalCartPrice => Items.Sum(i => i.TotalPrice);
    }

    public class AddToCartRequest
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }

    public class UpdateCartItemRequest
    {
        public int Quantity { get; set; }
    }
}
