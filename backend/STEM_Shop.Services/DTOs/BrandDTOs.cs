namespace STEM_Shop.Services.DTOs
{
    public class BrandResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    public class CreateBrandRequest
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    public class UpdateBrandRequest
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}
