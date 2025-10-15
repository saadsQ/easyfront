export type InventoryStatus = 'ACTIVE' | 'OUT_OF_STOCK' | 'DISCONTINUED';
export type UnitOfMeasure = 'piece' | 'liter' | 'set' | 'kg' | 'meter' | 'box' | 'pack';

export interface Inventory {
  id: string;
  partNumber: string; // Manufacturer or internal reference code
  partName: string; // Common name of the part
  category: string; // e.g., Engine, Suspension, Electrical, Tires
  brand: string; // Part brand or manufacturer
  description: string; // Optional long description
  supplierId: string; // Reference to supplier providing the part
  supplierLink?: string; // Direct link to supplier's product page or catalog
  barcode?: string; // Optional for scanning
  unitOfMeasure: UnitOfMeasure; // e.g., piece, liter, set
  quantityInStock: number; // Current stock quantity
  minStockLevel: number; // Minimum stock before alert/reorder
  purchasePrice: number; // Gross cost price per unit
  salePrice: number; // Retail or customer price per unit
  taxRate: number; // e.g., 0.20 for 20% VAT
  margin: number; // Computed: salePrice - purchasePrice
  location: string; // Physical location in storage (Aisle/Shelf)
  status: InventoryStatus;
  imageUrl?: string; // Product or part image
  createdAt: string;
  updatedAt: string;
}

export interface CreateInventoryRequest {
  partNumber: string;
  partName: string;
  category: string;
  brand: string;
  description: string;
  supplierId: string;
  supplierLink?: string;
  barcode?: string;
  unitOfMeasure: UnitOfMeasure;
  quantityInStock: number;
  minStockLevel: number;
  purchasePrice: number;
  salePrice: number;
  taxRate: number;
  location: string;
  status: InventoryStatus;
  imageUrl?: string;
}

export interface UpdateInventoryRequest extends Partial<CreateInventoryRequest> {
  id: string;
}

// Helper interface for inventory with supplier details
export interface InventoryWithSupplier extends Inventory {
  supplier: {
    id: string;
    companyName: string;
    ICE: string;
    contactPerson: string;
    phone: string;
    email: string;
  };
}
