import React, { useState } from 'react';
import { Supplier } from '../../types/supplier';
import { Button } from '../UI/Button';
import { Badge } from '../UI/Badge';
import {
  X,
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Edit,
  Trash2,
  Package,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle2,
  BarChart3,
  FileText,
  MessageSquare,
  Calendar,
  ExternalLink
} from 'lucide-react';

interface SupplierDetailPanelProps {
  supplier: Supplier | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
}

export const SupplierDetailPanel: React.FC<SupplierDetailPanelProps> = ({
  supplier,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'performance' | 'contacts'>('overview');

  if (!supplier) return null;

  const mockInventoryItems = [
    {
      id: '1',
      partName: 'Brake Pad Front',
      partNumber: 'BP-FRONT-001',
      category: 'Brakes',
      quantityInStock: 25,
      minStockLevel: 10,
      status: 'ACTIVE',
      purchasePrice: 450,
      salePrice: 650,
    },
    {
      id: '2',
      partName: 'Oil Filter',
      partNumber: 'FIL-OIL-002',
      category: 'Engine',
      quantityInStock: 50,
      minStockLevel: 20,
      status: 'ACTIVE',
      purchasePrice: 85,
      salePrice: 120,
    },
    {
      id: '3',
      partName: 'Spark Plug Set',
      partNumber: 'SPARK-PLUG-004',
      category: 'Engine',
      quantityInStock: 15,
      minStockLevel: 8,
      status: 'ACTIVE',
      purchasePrice: 180,
      salePrice: 250,
    },
    {
      id: '4',
      partName: 'Air Filter',
      partNumber: 'AIR-FILTER-005',
      category: 'Engine',
      quantityInStock: 5,
      minStockLevel: 15,
      status: 'LOW_STOCK',
      purchasePrice: 95,
      salePrice: 140,
    },
  ];

  const mockPerformanceData = {
    totalOrders: 127,
    onTimeDelivery: 94,
    avgDeliveryTime: 3.2,
    totalSpend: 145780,
    lastOrderDate: '2025-10-05',
    nextOrderDate: '2025-10-20',
    qualityRating: 4.5,
  };

  const mockContacts = [
    {
      id: '1',
      name: supplier.contactPerson,
      role: 'Sales Manager',
      phone: supplier.phone,
      email: supplier.email,
      isPrimary: true,
    },
    {
      id: '2',
      name: 'Karim Hassan',
      role: 'Account Manager',
      phone: '+212 5 22 34 56 78',
      email: 'karim@' + supplier.email.split('@')[1],
      isPrimary: false,
    },
  ];

  const totalInventoryValue = mockInventoryItems.reduce(
    (sum, item) => sum + item.quantityInStock * item.purchasePrice,
    0
  );

  const lowStockItems = mockInventoryItems.filter(item => item.quantityInStock <= item.minStockLevel);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed right-0 top-0 h-full w-[600px] bg-white shadow-2xl transform transition-transform duration-300 z-50 overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3 flex-1">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold ${
                  supplier.isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {supplier.companyName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{supplier.companyName}</h2>
                  <div className="flex items-center gap-2">
                    <Badge variant={supplier.isActive ? 'success' : 'secondary'} className="text-xs">
                      {supplier.isActive ? (
                        <><CheckCircle2 className="w-3 h-3 mr-1" />Active</>
                      ) : (
                        <>Inactive</>
                      )}
                    </Badge>
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
                      <span className="ml-1 text-sm font-semibold text-gray-700">
                        {supplier.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => onEdit(supplier)}
                variant="outline"
                size="sm"
                className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                onClick={() => onDelete(supplier)}
                variant="outline"
                size="sm"
                className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          <div className="flex border-t border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'inventory'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Package className="w-4 h-4 inline mr-2" />
              Inventory
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'performance'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Performance
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'contacts'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Contacts
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Company Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Building2 className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">ICE</p>
                      <p className="text-sm font-medium text-gray-900">{supplier.ICE}</p>
                    </div>
                  </div>
                  {supplier.IF && (
                    <div className="flex items-start">
                      <Building2 className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-600">IF</p>
                        <p className="text-sm font-medium text-gray-900">{supplier.IF}</p>
                      </div>
                    </div>
                  )}
                  {supplier.RC && (
                    <div className="flex items-start">
                      <Building2 className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-600">RC</p>
                        <p className="text-sm font-medium text-gray-900">{supplier.RC}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-600">Address</p>
                      <p className="text-sm font-medium text-gray-900">{supplier.address}</p>
                      <p className="text-sm text-gray-700">{supplier.city}, {supplier.country}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Contact Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-gray-400 mr-3" />
                    <a href={`tel:${supplier.phone}`} className="text-sm text-blue-600 hover:underline">
                      {supplier.phone}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-gray-400 mr-3" />
                    <a href={`mailto:${supplier.email}`} className="text-sm text-blue-600 hover:underline">
                      {supplier.email}
                    </a>
                  </div>
                  {supplier.website && (
                    <div className="flex items-center">
                      <Globe className="w-5 h-5 text-gray-400 mr-3" />
                      <a
                        href={supplier.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        {supplier.website}
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Payment Terms</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-900">{supplier.paymentTerms}</span>
                  </div>
                  <Badge variant="outline">{supplier.currency}</Badge>
                </div>
              </div>

              {supplier.notes && (
                <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-yellow-600" />
                    Notes
                  </h3>
                  <p className="text-sm text-gray-700">{supplier.notes}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <Package className="w-8 h-8 text-blue-600 mb-2" />
                  <p className="text-xs text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900">{mockInventoryItems.length}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <DollarSign className="w-8 h-8 text-green-600 mb-2" />
                  <p className="text-xs text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">{totalInventoryValue.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">MAD</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                  <AlertCircle className="w-8 h-8 text-orange-600 mb-2" />
                  <p className="text-xs text-gray-600">Low Stock</p>
                  <p className="text-2xl font-bold text-gray-900">{lowStockItems.length}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Inventory Items</h3>
                <div className="space-y-3">
                  {mockInventoryItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900">{item.partName}</h4>
                          <p className="text-xs text-gray-500">{item.partNumber}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <span className="text-gray-600">Stock: </span>
                          <span className={`font-semibold ${
                            item.quantityInStock <= item.minStockLevel ? 'text-orange-600' : 'text-green-600'
                          }`}>
                            {item.quantityInStock}
                          </span>
                          <span className="text-gray-500"> / Min: {item.minStockLevel}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-600">
                            <span className="font-semibold">{item.purchasePrice} MAD</span>
                          </div>
                        </div>
                      </div>
                      {item.status === 'LOW_STOCK' && (
                        <div className="mt-2 flex items-center text-xs text-orange-600 bg-orange-50 rounded px-2 py-1">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Reorder needed
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Package className="w-4 h-4 mr-2" />
                View All Inventory
              </Button>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{mockPerformanceData.totalOrders}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600">On-Time Delivery</p>
                      <p className="text-2xl font-bold text-gray-900">{mockPerformanceData.onTimeDelivery}%</p>
                    </div>
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600">Avg Delivery</p>
                      <p className="text-2xl font-bold text-gray-900">{mockPerformanceData.avgDeliveryTime}</p>
                      <p className="text-xs text-gray-500">days</p>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-600" />
                  </div>
                </div>
                <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600">Total Spend</p>
                      <p className="text-2xl font-bold text-gray-900">{mockPerformanceData.totalSpend.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">MAD</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-teal-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Order Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-xs text-gray-600">Last Order</p>
                        <p className="text-sm font-medium text-gray-900">{mockPerformanceData.lastOrderDate}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-blue-400 mr-3" />
                      <div>
                        <p className="text-xs text-gray-600">Next Order</p>
                        <p className="text-sm font-medium text-blue-600">{mockPerformanceData.nextOrderDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Quality Rating</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < Math.floor(mockPerformanceData.qualityRating)
                            ? 'text-yellow-400 fill-current'
                            : i < mockPerformanceData.qualityRating
                            ? 'text-yellow-400 fill-current opacity-50'
                            : 'text-gray-300 fill-current'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{mockPerformanceData.qualityRating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="space-y-4">
              {mockContacts.map((contact) => (
                <div key={contact.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                        {contact.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">{contact.name}</h4>
                        <p className="text-xs text-gray-600">{contact.role}</p>
                        {contact.isPrimary && (
                          <Badge variant="success" className="text-xs mt-1">Primary Contact</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 pl-15">
                    <div className="flex items-center text-sm">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                        {contact.phone}
                      </a>
                    </div>
                    <div className="flex items-center text-sm">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                        {contact.email}
                      </a>
                    </div>
                  </div>
                </div>
              ))}

              <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50">
                <Plus className="w-4 h-4 mr-2" />
                Add Contact
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
