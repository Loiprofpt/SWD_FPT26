using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using STEM_Shop.Data.Context;

namespace STEM_Shop.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly STEM_Shop_DBContext _context;

        public DashboardController(STEM_Shop_DBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetDashboard()
        {
            var totalUsers = await _context.Users.CountAsync();
            var totalProducts = await _context.Products.CountAsync();
            var totalCategories = await _context.Categories.CountAsync();
            var totalBrands = await _context.Brands.CountAsync();
            var totalOrders = await _context.Orders.CountAsync();

            return Ok(new
            {
                totalUsers,
                totalProducts,
                totalCategories,
                totalBrands,
                totalOrders
            });
        }
    }
}