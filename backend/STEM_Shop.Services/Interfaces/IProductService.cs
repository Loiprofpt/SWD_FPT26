using STEM_Shop.Services.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace STEM_Shop.Services.Interfaces
{
    public interface IProductService
    {
        Task<ApiResponse<List<ProductResponse>>> GetAllProductsAsync();
        Task<ApiResponse<ProductResponse>> GetProductByIdAsync(int id);
        Task<ApiResponse<ProductResponse>> CreateProductAsync(CreateProductRequest request);
        Task<ApiResponse<ProductResponse>> UpdateProductAsync(int id, UpdateProductRequest request);
        Task<ApiResponse<bool>> DeleteProductAsync(int id);
    }
}
