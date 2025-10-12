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
  Globe,
  CreditCard
} from 'lucide-react';

interface SupplierCardProps {
  supplier: Supplier;
  onView: (supplier: Supplier) => void;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
}

export const SupplierCard: React.FC<SupplierCardProps> = ({
  supplier,
  onView,
  onEdit,
  onDelete,
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : i < rating
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
            <Building2 className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {supplier.companyName}
            </h3>
            <div className="flex items-center mt-1">
              <Badge
                variant={supplier.isActive ? 'success' : 'secondary'}
                className="text-xs"
              >
                {supplier.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(supplier)}
            className="p-2 hover:bg-gray-100"
          >
            <Eye className="w-4 h-4 text-gray-600" />
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
            className="p-2 hover:bg-red-100"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      </div>

      {/* ICE and Rating */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-medium">ICE:</span> {supplier.ICE}
          </div>
          <div className="flex items-center">
            {renderStars(supplier.rating)}
            <span className="ml-1 text-sm text-gray-600">({supplier.rating})</span>
          </div>
        </div>
        {supplier.IF && (
          <div className="text-sm text-gray-600 mt-1">
            <span className="font-medium">IF:</span> {supplier.IF}
          </div>
        )}
        {supplier.RC && (
          <div className="text-sm text-gray-600 mt-1">
            <span className="font-medium">RC:</span> {supplier.RC}
          </div>
        )}
      </div>

      {/* Contact Information */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
          <span>{supplier.address}, {supplier.city}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="w-4 h-4 mr-2 text-gray-400" />
          <span>{supplier.phone}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="w-4 h-4 mr-2 text-gray-400" />
          <span className="truncate">{supplier.email}</span>
        </div>
        {supplier.website && (
          <div className="flex items-center text-sm text-gray-600">
            <Globe className="w-4 h-4 mr-2 text-gray-400" />
            <span className="truncate">{supplier.website}</span>
          </div>
        )}
      </div>

      {/* Payment Terms */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
          <span>{supplier.paymentTerms}</span>
        </div>
        <Badge variant="outline" className="text-xs">
          {supplier.currency}
        </Badge>
      </div>

      {/* Contact Person */}
      <div className="border-t pt-3">
        <div className="text-sm text-gray-600">
          <span className="font-medium">Contact:</span> {supplier.contactPerson}
        </div>
        {supplier.notes && (
          <div className="text-sm text-gray-500 mt-2 line-clamp-2">
            {supplier.notes}
          </div>
        )}
      </div>
    </Card>
  );
};
