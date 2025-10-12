import React from 'react';
import { Supplier } from '../../types/supplier';
import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';
import { Button } from '../UI/Button';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Star,
  Eye,
  Edit,
  Trash2,
  Package,
  TrendingUp,
  ExternalLink,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface EnhancedSupplierCardProps {
  supplier: Supplier;
  onView: (supplier: Supplier) => void;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
}

export const EnhancedSupplierCard: React.FC<EnhancedSupplierCardProps> = ({
  supplier,
  onView,
  onEdit,
  onDelete,
}) => {
  const mockInventoryCount = Math.floor(Math.random() * 30) + 10;
  const mockStockAvailability = Math.floor(Math.random() * 30) + 70;
  const mockLowStockItems = Math.floor(Math.random() * 5);

  const getSupplierScore = () => {
    return Math.min(100, Math.round(supplier.rating * 20 + mockStockAvailability * 0.15));
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 75) return 'text-blue-600 bg-blue-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const supplierScore = getSupplierScore();
  const scoreColor = getScoreColor(supplierScore);
  const ratingColor = getRatingColor(supplier.rating);

  const categories = ['Engine Parts', 'Brakes', 'Suspension'];
  const randomCategories = categories.slice(0, Math.floor(Math.random() * 2) + 1);

  const initials = supplier.companyName
    .split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border border-gray-200">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="p-6 relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0 ${
              supplier.isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
            }`}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                {supplier.companyName}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={supplier.isActive ? 'success' : 'secondary'}
                  className="text-xs"
                >
                  {supplier.isActive ? (
                    <><CheckCircle2 className="w-3 h-3 mr-1" />Active</>
                  ) : (
                    <>Inactive</>
                  )}
                </Badge>
                <div className={`text-xs font-semibold px-2 py-1 rounded-md ${scoreColor}`}>
                  Score: {supplierScore}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600 group/item hover:text-blue-600 transition-colors">
            <MapPin className="w-4 h-4 mr-2 text-gray-400 group-hover/item:text-blue-500 flex-shrink-0" />
            <span className="truncate">{supplier.city}, Morocco</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 group/item hover:text-blue-600 transition-colors">
            <Phone className="w-4 h-4 mr-2 text-gray-400 group-hover/item:text-blue-500 flex-shrink-0" />
            <span className="truncate">{supplier.phone}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 group/item hover:text-blue-600 transition-colors">
            <Mail className="w-4 h-4 mr-2 text-gray-400 group-hover/item:text-blue-500 flex-shrink-0" />
            <span className="truncate">{supplier.email}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {randomCategories.map((category, index) => (
            <Badge key={index} variant="outline" className="text-xs bg-gray-50">
              {category}
            </Badge>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(supplier.rating)
                      ? 'text-yellow-400 fill-current'
                      : i < supplier.rating
                      ? 'text-yellow-400 fill-current opacity-50'
                      : 'text-gray-300 fill-current'
                  }`}
                />
              ))}
              <span className={`ml-2 text-sm font-semibold ${ratingColor}`}>
                {supplier.rating.toFixed(1)}
              </span>
            </div>
            <span className="text-xs text-gray-500">{supplier.paymentTerms}</span>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-700">
                <Package className="w-4 h-4 mr-2 text-blue-500" />
                <span className="font-medium">Inventory Items</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{mockInventoryCount}</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Stock Health</span>
                <span className="font-semibold text-gray-900">{mockStockAvailability}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    mockStockAvailability >= 80 ? 'bg-green-500' :
                    mockStockAvailability >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${mockStockAvailability}%` }}
                ></div>
              </div>
            </div>

            {mockLowStockItems > 0 && (
              <div className="flex items-center text-xs text-orange-600 bg-orange-50 rounded px-2 py-1">
                <AlertCircle className="w-3 h-3 mr-1" />
                {mockLowStockItems} items low stock
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(supplier)}
            className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(supplier)}
            className="p-2 hover:bg-gray-100"
          >
            <Edit className="w-4 h-4 text-gray-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(supplier)}
            className="p-2 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>

        {supplier.website && (
          <a
            href={supplier.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center text-xs text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Visit website
          </a>
        )}
      </div>
    </Card>
  );
};
