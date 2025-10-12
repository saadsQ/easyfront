import React, { useState, useEffect } from 'react';
import { Supplier } from '../../types/supplier';
import { EnhancedSupplierCard } from './EnhancedSupplierCard';
import { SupplierDetailPanel } from './SupplierDetailPanel';
import { AddSupplierModal } from './AddSupplierModal';
import { EditSupplierModal } from './EditSupplierModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { Button } from '../UI/Button';
import { SearchInput } from '../UI/SearchInput';
import { Badge } from '../UI/Badge';
import {
  Plus,
  Building2,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  Package,
  AlertCircle,
  Award,
  MapPin,
  Mail
} from 'lucide-react';

export const SuppliersDashboard: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [filterCity, setFilterCity] = useState<string>('all');
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
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
      {
        id: '3',
        companyName: 'ElectroAuto Fes',
        ICE: '555555555555555',
        RC: 'RC67890',
        address: '789 Boulevard Zerktouni',
        city: 'Fes',
        country: 'Morocco',
        contactPerson: 'Omar Tazi',
        phone: '+212 5 35 55 44 33',
        email: 'omar@electroauto-fes.ma',
        paymentTerms: 'Net 15',
        currency: 'MAD',
        rating: 3.8,
        notes: 'Electrical components specialist',
        createdAt: '2024-02-01T09:15:00Z',
        updatedAt: '2024-02-01T09:15:00Z',
        isActive: false,
      },
    ];

    setSuppliers(mockSuppliers);
    setFilteredSuppliers(mockSuppliers);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let filtered = suppliers;

    if (searchTerm) {
      filtered = filtered.filter(supplier =>
        supplier.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.ICE.includes(searchTerm)
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(supplier =>
        filterStatus === 'active' ? supplier.isActive : !supplier.isActive
      );
    }

    if (filterCity !== 'all') {
      filtered = filtered.filter(supplier => supplier.city === filterCity);
    }

    setFilteredSuppliers(filtered);
  }, [suppliers, searchTerm, filterStatus, filterCity]);

  const handleAddSupplier = (supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSupplier: Supplier = {
      ...supplier,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSuppliers(prev => [...prev, newSupplier]);
    setIsAddModalOpen(false);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setSuppliers(prev =>
      prev.map(s => s.id === supplier.id ? { ...supplier, updatedAt: new Date().toISOString() } : s)
    );
    setIsEditModalOpen(false);
    setSelectedSupplier(null);
  };

  const handleDeleteSupplier = (id: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
    setIsDeleteModalOpen(false);
    setSelectedSupplier(null);
    setIsPanelOpen(false);
  };

  const handleViewSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsPanelOpen(true);
  };

  const handleEditClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsDeleteModalOpen(true);
  };

  const activeSuppliers = suppliers.filter(s => s.isActive).length;
  const inactiveSuppliers = suppliers.filter(s => !s.isActive).length;
  const avgRating = suppliers.length > 0
    ? suppliers.reduce((acc, s) => acc + s.rating, 0) / suppliers.length
    : 0;

  const mockInventoryLinked = 47;
  const mockPendingOrders = 8;
  const mockTotalInventoryValue = 185400;

  const cities = [...new Set(suppliers.map(s => s.city))];

  const getRatingTrend = () => {
    const trend = 0.2;
    return trend > 0 ? { icon: TrendingUp, color: 'text-green-600', value: `+${trend.toFixed(1)}` } :
           { icon: TrendingDown, color: 'text-red-600', value: trend.toFixed(1) };
  };

  const ratingTrend = getRatingTrend();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className={`flex-1 transition-all duration-300 ${isPanelOpen ? 'mr-[600px]' : ''}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Suppliers</h1>
              <p className="text-gray-600 mt-1">Manage suppliers, track inventory connections, and monitor performance</p>
            </div>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Supplier
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Suppliers</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{suppliers.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">{activeSuppliers}</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <div className="flex items-center mt-1">
                    <p className="text-3xl font-bold text-gray-900">{avgRating.toFixed(1)}</p>
                    <div className={`ml-2 flex items-center ${ratingTrend.color}`}>
                      <ratingTrend.icon className="w-4 h-4" />
                      <span className="text-xs font-medium ml-1">{ratingTrend.value}</span>
                    </div>
                  </div>
                </div>
                <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inventory Linked</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{mockInventoryLinked}</p>
                  <p className="text-xs text-gray-500 mt-1">{mockTotalInventoryValue.toLocaleString()} MAD</p>
                </div>
                <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-teal-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                  <p className="text-3xl font-bold text-orange-600 mt-1">{mockPendingOrders}</p>
                </div>
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cities</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{cities.length}</p>
                </div>
                <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-slate-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <SearchInput
                  placeholder="Search suppliers by name, contact, city, or ICE..."
                  value={searchTerm}
                  onChange={setSearchTerm}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <select
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Cities</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <Button variant="outline" className="flex items-center border-gray-300 hover:bg-gray-50">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
                <Button variant="outline" className="flex items-center border-gray-300 hover:bg-gray-50">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {filteredSuppliers.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No suppliers found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ? 'Try adjusting your search criteria' : 'Get started by adding your first supplier'}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Supplier
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSuppliers.map((supplier) => (
                <EnhancedSupplierCard
                  key={supplier.id}
                  supplier={supplier}
                  onView={handleViewSupplier}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <SupplierDetailPanel
        supplier={selectedSupplier}
        isOpen={isPanelOpen}
        onClose={() => {
          setIsPanelOpen(false);
          setSelectedSupplier(null);
        }}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      <AddSupplierModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddSupplier}
      />

      <EditSupplierModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedSupplier(null);
        }}
        onSave={handleEditSupplier}
        supplier={selectedSupplier}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedSupplier(null);
        }}
        onConfirm={() => selectedSupplier && handleDeleteSupplier(selectedSupplier.id)}
        title="Delete Supplier"
        message={`Are you sure you want to delete "${selectedSupplier?.companyName}"? This action cannot be undone.`}
      />
    </div>
  );
};
