import React from 'react';
import { Supplier } from '../../types/supplier';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';
import { 
  X, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  Globe, 
  CreditCard,
  Calendar,
  Edit,
  Trash2
} from 'lucide-react';

interface ViewSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier | null;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
}

export const ViewSupplierModal: React.FC<ViewSupplierModalProps> = ({
  isOpen,
  onClose,
  supplier,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !supplier) return null;

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                <Building2 className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{supplier.companyName}</h2>
                <div className="flex items-center mt-1">
                  <Badge
                    variant={supplier.isActive ? 'success' : 'secondary'}
                    className="text-sm"
                  >
                    {supplier.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => onEdit(supplier)}
                className="flex items-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                onClick={() => onDelete(supplier)}
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
              {/* Company Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">ICE:</span>
                    <span className="text-sm text-gray-900 font-mono">{supplier.ICE}</span>
                  </div>
                  {supplier.IF && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">IF:</span>
                      <span className="text-sm text-gray-900 font-mono">{supplier.IF}</span>
                    </div>
                  )}
                  {supplier.RC && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">RC:</span>
                      <span className="text-sm text-gray-900 font-mono">{supplier.RC}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Country:</span>
                    <span className="text-sm text-gray-900">{supplier.country}</span>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-900">{supplier.address}</p>
                    <p className="text-sm text-gray-600">{supplier.city}, {supplier.country}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-900">{supplier.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-900">{supplier.email}</span>
                  </div>
                  {supplier.website && (
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 text-gray-400 mr-3" />
                      <a
                        href={supplier.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-600 hover:text-indigo-800"
                      >
                        {supplier.website}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600 mr-3">Contact Person:</span>
                    <span className="text-sm text-gray-900">{supplier.contactPerson}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Business Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Payment Terms:</span>
                    <span className="text-sm text-gray-900">{supplier.paymentTerms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Currency:</span>
                    <Badge variant="outline" className="text-xs">
                      {supplier.currency}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Rating:</span>
                    <div className="flex items-center">
                      {renderStars(supplier.rating)}
                      <span className="ml-2 text-sm text-gray-900">({supplier.rating})</span>
                    </div>
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
                      <p className="text-sm text-gray-900">{formatDate(supplier.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Last Updated</p>
                      <p className="text-sm text-gray-900">{formatDate(supplier.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {supplier.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{supplier.notes}</p>
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
              onClick={() => onEdit(supplier)}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Supplier
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
