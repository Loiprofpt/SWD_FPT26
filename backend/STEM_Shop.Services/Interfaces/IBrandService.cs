using STEM_Shop.Services.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace STEM_Shop.Services.Interfaces
{
    public interface IBrandService
    {
        Task<ApiResponse<List<BrandResponse>>> GetAllBrandsAsync();
        Task<ApiResponse<BrandResponse>> GetBrandByIdAsync(int id);
        Task<ApiResponse<BrandResponse>> CreateBrandAsync(CreateBrandRequest request);
        Task<ApiResponse<BrandResponse>> UpdateBrandAsync(int id, UpdateBrandRequest request);
        Task<ApiResponse<bool>> DeleteBrandAsync(int id);
    }
}
