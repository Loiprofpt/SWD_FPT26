using STEM_Shop.Services.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace STEM_Shop.Services.Interfaces
{
    public interface IWarehouseService
    {
        Task<IEnumerable<StockReportDTO>> GetLowStockAlertAsync(int threshold);
        Task<bool> UpdateInventoryAsync(InventoryUpdateDTO model);
        Task<object> GetStockDistributionAsync(int productId);
    }
}
