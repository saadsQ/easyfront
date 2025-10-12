import React from 'react';
import { InventoryWithSupplier } from '../../types/inventory';
import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';
import { Button } from '../UI/Button';
import { 
  Package, 
  MapPin, 
  Building2, 
  Eye, 
  Edit, 
  Trash2,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Hash
} from 'lucide-react';

interface InventoryCardProps {
  item: InventoryWithSupplier;
  onView: (item: InventoryWithSupplier) => void;
  onEdit: (item: InventoryWithSupplier) => void;
  onDelete: (item: InventoryWithSupplier) => void;
}

export const InventoryCard: React.FC<InventoryCardProps> = ({
  item,
  onView,
  onEdit,
  onDelete,
}) => {
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

  const isLowStock = item.quantityInStock <= item.minStockLevel && item.status === 'ACTIVE';

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
            <Package className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {item.partName}
            </h3>
            <div className="flex items-center mt-1 space-x-2">
              <Badge
                variant={getStatusColor(item.status)}
                className="text-xs"
              >
                {getStatusIcon(item.status)}
                <span className="ml-1">{item.status.replace('_', ' ')}</span>
              </Badge>
              {isLowStock && (
                <Badge variant="destructive" className="text-xs">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Low Stock
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(item)}
            className="p-2 hover:bg-gray-100"
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(item)}
            className="p-2 hover:bg-gray-100"
          >
            <Edit className="w-4 h-4 text-gray-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(item)}
            className="p-2 hover:bg-red-100"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      </div>

      {/* Part Information */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-600">
            <Hash className="w-4 h-4 inline mr-1" />
            <span className="font-medium">Part #:</span> {item.partNumber}
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">Brand:</span> {item.brand}
          </div>
        </div>
        <div className="text-sm text-gray-600 mb-2">
          <span className="font-medium">Category:</span> {item.category}
        </div>
        {item.description && (
          <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
        )}
      </div>

      {/* Stock Information */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <Package className="w-4 h-4 mr-2 text-gray-400" />
            <span>Stock: {item.quantityInStock} {item.unitOfMeasure}</span>
          </div>
          <div className="text-sm text-gray-600">
            Min: {item.minStockLevel}
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
          <span>Location: {item.location}</span>
        </div>
      </div>

      {/* Pricing */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
            <span>Purchase: {item.purchasePrice.toFixed(2)} MAD</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <TrendingUp className="w-4 h-4 mr-2 text-gray-400" />
            <span>Sale: {item.salePrice.toFixed(2)} MAD</span>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-medium">Margin:</span> {item.margin.toFixed(2)} MAD ({((item.margin / item.purchasePrice) * 100).toFixed(1)}%)
        </div>
      </div>

      {/* Supplier Information */}
      <div className="border-t pt-3">
        <div className="flex items-center text-sm text-gray-600 mb-1">
          <Building2 className="w-4 h-4 mr-2 text-gray-400" />
          <span className="font-medium">Supplier:</span>
        </div>
        <div className="text-sm text-gray-900 ml-6">
          {item.supplier.companyName}
        </div>
        <div className="text-xs text-gray-500 ml-6">
          ICE: {item.supplier.ICE}
        </div>
      </div>
    </Card>
  );
};
