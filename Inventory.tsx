import React, { useState, useEffect } from 'react';
import { Inventory, InventoryWithSupplier } from '../../types/inventory';
import { Supplier } from '../../types/supplier';
import { InventoryCard } from './InventoryCard';
import { AddInventoryModal } from './AddInventoryModal';
import { EditInventoryModal } from './EditInventoryModal';
import { ViewInventoryModal } from './ViewInventoryModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { Button } from '../UI/Button';
import { SearchInput } from '../UI/SearchInput';
import { Badge } from '../UI/Badge';
import { 
  Plus, 
  Package, 
  Filter, 
  Download, 
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryWithSupplier[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryWithSupplier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryWithSupplier | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'out_of_stock' | 'discontinued'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Mock suppliers for demonstration
  const mockSuppliers: Supplier[] = [
    {
      id: '1',
      companyName: 'AutoParts Maroc SARL',
      ICE: '123456789012345',
      IF: 'IF123456789',
      RC: 'RC12345',
      address: '123 Avenue Mohammed V',
      city: 'Casablanca',
      country: 'Morocco',
      contactPerson: 'Ahmed Benali',
      phone: '+212 5 22 12 34 56',
      email: 'contact@autoparts-maroc.ma',
      website: 'https://autoparts-maroc.ma',
      paymentTerms: 'Net 30',
      currency: 'MAD',
      rating: 4.5,
      notes: 'Reliable supplier for engine parts',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      isActive: true,
    },
    {
      id: '2',
      companyName: 'Mecanique Rabat',
      ICE: '987654321098765',
      address: '456 Rue Hassan II',
      city: 'Rabat',
      country: 'Morocco',
      contactPerson: 'Fatima Zahra',
      phone: '+212 5 37 98 76 54',
      email: 'info@mecanique-rabat.ma',
      paymentTerms: 'Advance',
      currency: 'MAD',
      rating: 4.2,
      notes: 'Specialized in suspension systems',
      createdAt: '2024-01-20T14:30:00Z',
      updatedAt: '2024-01-20T14:30:00Z',
      isActive: true,
    },
  ];

  // Mock inventory data for demonstration
  useEffect(() => {
    const mockInventory: InventoryWithSupplier[] = [
      {
        id: '1',
        partNumber: 'BP-FRONT-001',
        partName: 'Brake Pad Front',
        category: 'Brakes',
        brand: 'Brembo',
        description: 'High-performance front brake pads for passenger vehicles',
        supplierId: '1',
        supplierLink: 'https://autoparts-maroc.ma/brake-pads',
        barcode: '123456789012',
        unitOfMeasure: 'set',
        quantityInStock: 25,
        minStockLevel: 10,
        purchasePrice: 450.00,
        salePrice: 650.00,
        taxRate: 0.20,
        margin: 200.00,
        location: 'A-1-B',
        status: 'ACTIVE',
        imageUrl: 'https://via.placeholder.com/200x200?text=Brake+Pad',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        supplier: {
          id: '1',
          companyName: 'AutoParts Maroc SARL',
          ICE: '123456789012345',
          contactPerson: 'Ahmed Benali',
          phone: '+212 5 22 12 34 56',
          email: 'contact@autoparts-maroc.ma',
        },
      },
      {
        id: '2',
        partNumber: 'FIL-OIL-002',
        partName: 'Oil Filter',
        category: 'Engine',
        brand: 'Mann-Filter',
        description: 'Standard oil filter for 1.6L engines',
        supplierId: '1',
        unitOfMeasure: 'piece',
        quantityInStock: 50,
        minStockLevel: 20,
        purchasePrice: 85.00,
        salePrice: 120.00,
        taxRate: 0.20,
        margin: 35.00,
        location: 'B-2-A',
        status: 'ACTIVE',
        createdAt: '2024-01-20T14:30:00Z',
        updatedAt: '2024-01-20T14:30:00Z',
        supplier: {
          id: '1',
          companyName: 'AutoParts Maroc SARL',
          ICE: '123456789012345',
          contactPerson: 'Ahmed Benali',
          phone: '+212 5 22 12 34 56',
          email: 'contact@autoparts-maroc.ma',
        },
      },
      {
        id: '3',
        partNumber: 'SHOCK-REAR-003',
        partName: 'Rear Shock Absorber',
        category: 'Suspension',
        brand: 'Bilstein',
        description: 'Heavy-duty rear shock absorber for SUVs',
        supplierId: '2',
        unitOfMeasure: 'piece',
        quantityInStock: 0,
        minStockLevel: 5,
        purchasePrice: 1200.00,
        salePrice: 1800.00,
        taxRate: 0.20,
        margin: 600.00,
        location: 'C-3-B',
        status: 'OUT_OF_STOCK',
        createdAt: '2024-02-01T09:15:00Z',
        updatedAt: '2024-02-01T09:15:00Z',
        supplier: {
          id: '2',
          companyName: 'Mecanique Rabat',
          ICE: '987654321098765',
          contactPerson: 'Fatima Zahra',
          phone: '+212 5 37 98 76 54',
          email: 'info@mecanique-rabat.ma',
        },
      },
      {
        id: '4',
        partNumber: 'SPARK-PLUG-004',
        partName: 'Spark Plug Set',
        category: 'Engine',
        brand: 'NGK',
        description: 'Iridium spark plugs for high-performance engines',
        supplierId: '1',
        unitOfMeasure: 'set',
        quantityInStock: 15,
        minStockLevel: 8,
        purchasePrice: 180.00,
        salePrice: 250.00,
        taxRate: 0.20,
        margin: 70.00,
        location: 'A-2-C',
        status: 'ACTIVE',
        createdAt: '2024-02-05T11:20:00Z',
        updatedAt: '2024-02-05T11:20:00Z',
        supplier: {
          id: '1',
          companyName: 'AutoParts Maroc SARL',
          ICE: '123456789012345',
          contactPerson: 'Ahmed Benali',
          phone: '+212 5 22 12 34 56',
          email: 'contact@autoparts-maroc.ma',
        },
      },
    ];

    setInventory(mockInventory);
    setFilteredInventory(mockInventory);
    setIsLoading(false);
  }, []);

  // Filter inventory based on search term, status, and category
  useEffect(() => {
    let filtered = inventory;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => item.status === filterStatus.toUpperCase());
    }

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(item => item.category === filterCategory);
    }

    setFilteredInventory(filtered);
  }, [inventory, searchTerm, filterStatus, filterCategory]);

  const handleAddItem = (item: Omit<Inventory, 'id' | 'createdAt' | 'updatedAt' | 'margin'>) => {
    const supplier = mockSuppliers.find(s => s.id === item.supplierId);
    if (!supplier) return;

    const newItem: InventoryWithSupplier = {
      ...item,
      id: Date.now().toString(),
      margin: item.salePrice - item.purchasePrice,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      supplier: {
        id: supplier.id,
        companyName: supplier.companyName,
        ICE: supplier.ICE,
        contactPerson: supplier.contactPerson,
        phone: supplier.phone,
        email: supplier.email,
      },
    };
    setInventory(prev => [...prev, newItem]);
    setIsAddModalOpen(false);
  };

  const handleEditItem = (item: InventoryWithSupplier) => {
    setInventory(prev =>
      prev.map(i => i.id === item.id ? { ...item, updatedAt: new Date().toISOString() } : i)
    );
    setIsEditModalOpen(false);
    setSelectedItem(null);
  };

  const handleDeleteItem = (id: string) => {
    setInventory(prev => prev.filter(i => i.id !== id));
    setIsDeleteModalOpen(false);
    setSelectedItem(null);
  };

  const handleViewItem = (item: InventoryWithSupplier) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (item: InventoryWithSupplier) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (item: InventoryWithSupplier) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  // Calculate statistics
  const totalItems = inventory.length;
  const activeItems = inventory.filter(i => i.status === 'ACTIVE').length;
  const outOfStockItems = inventory.filter(i => i.status === 'OUT_OF_STOCK').length;
  const lowStockItems = inventory.filter(i => i.quantityInStock <= i.minStockLevel && i.status === 'ACTIVE').length;
  const totalValue = inventory.reduce((sum, item) => sum + (item.quantityInStock * item.purchasePrice), 0);
  const categories = [...new Set(inventory.map(item => item.category))];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-600">Manage parts, materials, and stock levels</p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-indigo-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{activeItems}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900">{outOfStockItems}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <TrendingDown className="w-8 h-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockItems}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">{totalValue.toLocaleString()} MAD</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchInput
              placeholder="Search by part name, number, brand, category, or supplier..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'out_of_stock' | 'discontinued')}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="discontinued">Discontinued</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <Button variant="outline" className="flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" className="flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Inventory Grid */}
      {filteredInventory.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No inventory items found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Try adjusting your search criteria' : 'Get started by adding your first inventory item'}
          </p>
          {!searchTerm && (
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInventory.map((item) => (
            <InventoryCard
              key={item.id}
              item={item}
              onView={handleViewItem}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <AddInventoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddItem}
        suppliers={mockSuppliers}
      />

      <EditInventoryModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedItem(null);
        }}
        onSave={handleEditItem}
        item={selectedItem}
        suppliers={mockSuppliers}
      />

      <ViewInventoryModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedItem(null);
        }}
        onConfirm={() => selectedItem && handleDeleteItem(selectedItem.id)}
        title="Delete Inventory Item"
        message={`Are you sure you want to delete "${selectedItem?.partName}"? This action cannot be undone.`}
      />
    </div>
  );
};
