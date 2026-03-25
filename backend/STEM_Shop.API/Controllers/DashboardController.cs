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
            var totalOrders = await _context.Orders.CountAsync();

            var totalRevenue = await _context.Orders
                .Where(o => o.Status == "Done")
                .SumAsync(o => (int?)o.TotalAmount) ?? 0;

            var topProducts = await _context.OrderDetails
                .GroupBy(od => od.ProductId)
                .Select(g => new
                {
                    ProductId = g.Key,
                    TotalSold = g.Sum(x => x.Quantity)
                })
                .OrderByDescending(x => x.TotalSold)
                .Take(5)
                .ToListAsync();

            var revenueByDate = await _context.Orders
    .Where(o => o.Status == "Done" && o.OrderDate != null)
    .GroupBy(o => o.OrderDate.Value.Date)
    .Select(g => new
    {
        Date = g.Key,
        Revenue = g.Sum(x => x.TotalAmount)
    })
    .OrderBy(x => x.Date)
    .ToListAsync();

            return Ok(new
            {
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue,
                topProducts,
                revenueByDate
            });
        }
    }
}