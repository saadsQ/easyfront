import React from 'react';
import { InventoryWithSupplier } from '../../types/inventory';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';
import { 
  X, 
  Package, 
  MapPin, 
  Building2, 
  Star, 
  Globe, 
  DollarSign,
  Calendar,
  Edit,
  Trash2,
  AlertTriangle,
  TrendingUp,
  Hash,
  BarChart3
} from 'lucide-react';

interface ViewInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryWithSupplier | null;
  onEdit: (item: InventoryWithSupplier) => void;
  onDelete: (item: InventoryWithSupplier) => void;
}

export const ViewInventoryModal: React.FC<ViewInventoryModalProps> = ({
  isOpen,
  onClose,
  item,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !item) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'OUT_OF_STOCK':
        return 'destructive';
      case 'DISCONTINUED':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OUT_OF_STOCK':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'ACTIVE':
        return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
      case 'DISCONTINUED':
        return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>;
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isLowStock = item.quantityInStock <= item.minStockLevel && item.status === 'ACTIVE';
  const marginPercentage = ((item.margin / item.purchasePrice) * 100).toFixed(1);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                <Package className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{item.partName}</h2>
                <div className="flex items-center mt-1 space-x-2">
                  <Badge
                    variant={getStatusColor(item.status)}
                    className="text-sm"
                  >
                    {getStatusIcon(item.status)}
                    <span className="ml-1">{item.status.replace('_', ' ')}</span>
                  </Badge>
                  {isLowStock && (
                    <Badge variant="destructive" className="text-sm">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Low Stock
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => onEdit(item)}
                className="flex items-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                onClick={() => onDelete(item)}
                className="flex items-center text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Part Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Part Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Part Number:</span>
                    <span className="text-sm text-gray-900 font-mono">{item.partNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Brand:</span>
                    <span className="text-sm text-gray-900">{item.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Category:</span>
                    <span className="text-sm text-gray-900">{item.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Unit:</span>
                    <span className="text-sm text-gray-900">{item.unitOfMeasure}</span>
                  </div>
                  {item.barcode && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Barcode:</span>
                      <span className="text-sm text-gray-900 font-mono">{item.barcode}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stock Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Current Stock:</span>
                    <span className="text-sm text-gray-900 font-semibold">
                      {item.quantityInStock} {item.unitOfMeasure}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Minimum Level:</span>
                    <span className="text-sm text-gray-900">{item.minStockLevel} {item.unitOfMeasure}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Location</p>
                      <p className="text-sm text-gray-900">{item.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Supplier Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Supplier Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Building2 className="w-4 h-4 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Company</p>
                      <p className="text-sm text-gray-900">{item.supplier.companyName}</p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">ICE:</span>
                    <span className="text-sm text-gray-900 font-mono">{item.supplier.ICE}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600 mr-3">Contact:</span>
                    <span className="text-sm text-gray-900">{item.supplier.contactPerson}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600 mr-3">Phone:</span>
                    <span className="text-sm text-gray-900">{item.supplier.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600 mr-3">Email:</span>
                    <span className="text-sm text-gray-900">{item.supplier.email}</span>
                  </div>
                  {item.supplierLink && (
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 text-gray-400 mr-3" />
                      <a
                        href={item.supplierLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-600 hover:text-indigo-800"
                      >
                        View Product Page
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Pricing Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Purchase Price:</span>
                    <span className="text-sm text-gray-900 font-semibold">
                      {item.purchasePrice.toFixed(2)} MAD
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Sale Price:</span>
                    <span className="text-sm text-gray-900 font-semibold">
                      {item.salePrice.toFixed(2)} MAD
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Margin:</span>
                    <span className="text-sm text-gray-900 font-semibold">
                      {item.margin.toFixed(2)} MAD ({marginPercentage}%)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Tax Rate:</span>
                    <span className="text-sm text-gray-900">
                      {(item.taxRate * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Financial Summary */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Total Stock Value:</span>
                    <span className="text-sm text-gray-900 font-semibold">
                      {(item.quantityInStock * item.purchasePrice).toFixed(2)} MAD
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Potential Revenue:</span>
                    <span className="text-sm text-gray-900 font-semibold">
                      {(item.quantityInStock * item.salePrice).toFixed(2)} MAD
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Total Margin:</span>
                    <span className="text-sm text-gray-900 font-semibold">
                      {(item.quantityInStock * item.margin).toFixed(2)} MAD
                    </span>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Created</p>
                      <p className="text-sm text-gray-900">{formatDate(item.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Last Updated</p>
                      <p className="text-sm text-gray-900">{formatDate(item.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {item.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.description}</p>
                  </div>
                </div>
              )}

              {/* Image */}
              {item.imageUrl && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Image</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <img
                      src={item.imageUrl}
                      alt={item.partName}
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 mt-8 border-t">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              onClick={() => onEdit(item)}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Item
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
