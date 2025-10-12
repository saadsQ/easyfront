import React, { useState, useEffect } from 'react';
import { InventoryWithSupplier, UpdateInventoryRequest, UnitOfMeasure, InventoryStatus } from '../../types/inventory';
import { Supplier } from '../../types/supplier';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import { X, Package } from 'lucide-react';

interface EditInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: UpdateInventoryRequest) => void;
  item: InventoryWithSupplier | null;
  suppliers: Supplier[];
}

export const EditInventoryModal: React.FC<EditInventoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  item,
  suppliers,
}) => {
  const [formData, setFormData] = useState<UpdateInventoryRequest>({
    id: '',
    partNumber: '',
    partName: '',
    category: '',
    brand: '',
    description: '',
    supplierId: '',
    supplierLink: '',
    barcode: '',
    unitOfMeasure: 'piece',
    quantityInStock: 0,
    minStockLevel: 0,
    purchasePrice: 0,
    salePrice: 0,
    taxRate: 0.20,
    location: '',
    status: 'ACTIVE',
    imageUrl: '',
  });

  const [errors, setErrors] = useState<Partial<UpdateInventoryRequest>>({});

  // Populate form when item changes
  useEffect(() => {
    if (item) {
      setFormData({
        id: item.id,
        partNumber: item.partNumber,
        partName: item.partName,
        category: item.category,
        brand: item.brand,
        description: item.description,
        supplierId: item.supplierId,
        supplierLink: item.supplierLink || '',
        barcode: item.barcode || '',
        unitOfMeasure: item.unitOfMeasure,
        quantityInStock: item.quantityInStock,
        minStockLevel: item.minStockLevel,
        purchasePrice: item.purchasePrice,
        salePrice: item.salePrice,
        taxRate: item.taxRate,
        location: item.location,
        status: item.status,
        imageUrl: item.imageUrl || '',
      });
      setErrors({});
    }
  }, [item]);

  const handleInputChange = (field: keyof UpdateInventoryRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<UpdateInventoryRequest> = {};

    if (!formData.partNumber?.trim()) {
      newErrors.partNumber = 'Part number is required';
    }
    if (!formData.partName?.trim()) {
      newErrors.partName = 'Part name is required';
    }
    if (!formData.category?.trim()) {
      newErrors.category = 'Category is required';
    }
    if (!formData.brand?.trim()) {
      newErrors.brand = 'Brand is required';
    }
    if (!formData.supplierId) {
      newErrors.supplierId = 'Supplier is required';
    }
    if (formData.quantityInStock && formData.quantityInStock < 0) {
      newErrors.quantityInStock = 'Quantity cannot be negative';
    }
    if (formData.minStockLevel && formData.minStockLevel < 0) {
      newErrors.minStockLevel = 'Minimum stock level cannot be negative';
    }
    if (formData.purchasePrice && formData.purchasePrice <= 0) {
      newErrors.purchasePrice = 'Purchase price must be greater than 0';
    }
    if (formData.salePrice && formData.salePrice <= 0) {
      newErrors.salePrice = 'Sale price must be greater than 0';
    }
    if (formData.salePrice && formData.purchasePrice && formData.salePrice <= formData.purchasePrice) {
      newErrors.salePrice = 'Sale price must be greater than purchase price';
    }
    if (!formData.location?.trim()) {
      newErrors.location = 'Location is required';
    }
    if (formData.taxRate && (formData.taxRate < 0 || formData.taxRate > 1)) {
      newErrors.taxRate = 'Tax rate must be between 0 and 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                <Package className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Edit Inventory Item</h2>
                <p className="text-sm text-gray-600">Update part information and stock details</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Part Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Part Number *
                </label>
                <input
                  type="text"
                  value={formData.partNumber || ''}
                  onChange={(e) => handleInputChange('partNumber', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.partNumber ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., BP-FRONT-001"
                />
                {errors.partNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.partNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Part Name *
                </label>
                <input
                  type="text"
                  value={formData.partName || ''}
                  onChange={(e) => handleInputChange('partName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.partName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Brake Pad Front"
                />
                {errors.partName && (
                  <p className="mt-1 text-sm text-red-600">{errors.partName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <input
                  type="text"
                  value={formData.category || ''}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.category ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Brakes, Engine, Suspension"
                />
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand *
                </label>
                <input
                  type="text"
                  value={formData.brand || ''}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.brand ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Brembo, Mann-Filter"
                />
                {errors.brand && (
                  <p className="mt-1 text-sm text-red-600">{errors.brand}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Detailed description of the part..."
              />
            </div>

            {/* Supplier and Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supplier *
                </label>
                <select
                  value={formData.supplierId || ''}
                  onChange={(e) => handleInputChange('supplierId', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.supplierId ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a supplier</option>
                  {suppliers.map(supplier => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.companyName} ({supplier.ICE})
                    </option>
                  ))}
                </select>
                {errors.supplierId && (
                  <p className="mt-1 text-sm text-red-600">{errors.supplierId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supplier Link
                </label>
                <input
                  type="url"
                  value={formData.supplierLink || ''}
                  onChange={(e) => handleInputChange('supplierLink', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://supplier.com/product"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Barcode/QR Code
                </label>
                <input
                  type="text"
                  value={formData.barcode || ''}
                  onChange={(e) => handleInputChange('barcode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Optional barcode"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl || ''}
                  onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            {/* Stock Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit of Measure
                </label>
                <select
                  value={formData.unitOfMeasure || 'piece'}
                  onChange={(e) => handleInputChange('unitOfMeasure', e.target.value as UnitOfMeasure)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="piece">Piece</option>
                  <option value="liter">Liter</option>
                  <option value="set">Set</option>
                  <option value="kg">Kilogram</option>
                  <option value="meter">Meter</option>
                  <option value="box">Box</option>
                  <option value="pack">Pack</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity in Stock
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.quantityInStock || 0}
                  onChange={(e) => handleInputChange('quantityInStock', parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.quantityInStock ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.quantityInStock && (
                  <p className="mt-1 text-sm text-red-600">{errors.quantityInStock}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Stock Level
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.minStockLevel || 0}
                  onChange={(e) => handleInputChange('minStockLevel', parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.minStockLevel ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.minStockLevel && (
                  <p className="mt-1 text-sm text-red-600">{errors.minStockLevel}</p>
                )}
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Price (MAD) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.purchasePrice || 0}
                  onChange={(e) => handleInputChange('purchasePrice', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.purchasePrice ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.purchasePrice && (
                  <p className="mt-1 text-sm text-red-600">{errors.purchasePrice}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sale Price (MAD) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.salePrice || 0}
                  onChange={(e) => handleInputChange('salePrice', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.salePrice ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.salePrice && (
                  <p className="mt-1 text-sm text-red-600">{errors.salePrice}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Rate (0-1)
                </label>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={formData.taxRate || 0.20}
                  onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.taxRate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.taxRate && (
                  <p className="mt-1 text-sm text-red-600">{errors.taxRate}</p>
                )}
              </div>
            </div>

            {/* Location and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.location ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., A-1-B, Shelf 3"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status || 'ACTIVE'}
                  onChange={(e) => handleInputChange('status', e.target.value as InventoryStatus)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="OUT_OF_STOCK">Out of Stock</option>
                  <option value="DISCONTINUED">Discontinued</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Update Item
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};
