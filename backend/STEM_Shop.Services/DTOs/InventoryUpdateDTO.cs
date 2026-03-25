using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace STEM_Shop.Services.DTOs
{
    public class InventoryUpdateDTO
    {
        public int ProductId { get; set; }
        public int WarehouseId { get; set; }
        public int Quantity { get; set; }
        public string Type { get; set; } 
        public string Note { get; set; }
    }
}
