import React, { useState, useEffect } from 'react';
import { Supplier } from '../../types/supplier';
import { EnhancedSupplierCard } from './EnhancedSupplierCard';
import { SupplierPerformance } from './SupplierPerformance';
import { SuppliersDashboard } from './SuppliersDashboard';
import { SupplierDetailPanel } from './SupplierDetailPanel';
import { AddSupplierModal } from './AddSupplierModal';
import { EditSupplierModal } from './EditSupplierModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { Button } from '../UI/Button';
import { SearchInput } from '../UI/SearchInput';
import {
  Plus,
  Building2,
  Filter,
  Download,
  BarChart3,
  Grid3X3,
  LayoutDashboard,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

type ViewMode = 'dashboard' | 'cards' | 'performance';

export const EnhancedSuppliers: React.FC = () => {
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
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');

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
      {
        id: '4',
        companyName: 'BrakeMaster Casablanca',
        ICE: '111111111111111',
        IF: 'IF111111111',
        RC: 'RC11111',
        address: '321 Boulevard Zerktouni',
        city: 'Casablanca',
        country: 'Morocco',
        contactPerson: 'Youssef Alami',
        phone: '+212 5 22 98 76 54',
        email: 'youssef@brakemaster.ma',
        website: 'https://brakemaster.ma',
        paymentTerms: 'Net 45',
        currency: 'MAD',
        rating: 4.7,
        notes: 'Premium brake systems and components',
        createdAt: '2024-02-10T11:20:00Z',
        updatedAt: '2024-02-10T11:20:00Z',
        isActive: true,
      },
      {
        id: '5',
        companyName: 'TirePro Marrakech',
        ICE: '222222222222222',
        address: '654 Avenue Mohammed VI',
        city: 'Marrakech',
        country: 'Morocco',
        contactPerson: 'Aicha Bennani',
        phone: '+212 5 24 45 67 89',
        email: 'aicha@tirepro.ma',
        paymentTerms: 'Net 30',
        currency: 'MAD',
        rating: 4.0,
        notes: 'Tires and wheel accessories',
        createdAt: '2024-02-15T16:45:00Z',
        updatedAt: '2024-02-15T16:45:00Z',
        isActive: true,
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

  const handleAddSupplier = (supplier: any) => {
    const newSupplier: Supplier = {
      ...supplier,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    };
    setSuppliers(prev => [...prev, newSupplier]);
    setIsAddModalOpen(false);
  };

  const handleEditSupplier = (supplier: any) => {
    setSuppliers(prev =>
      prev.map(s => s.id === supplier.id ? { ...s, ...supplier, updatedAt: new Date().toISOString() } : s)
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

  const cities = [...new Set(suppliers.map(s => s.city))];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const renderViewModeContent = () => {
    switch (viewMode) {
      case 'dashboard':
        return (
          <SuppliersDashboard />
        );
      
      case 'cards':
        return (
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
        );
      
      case 'performance':
        return (
          <div className="space-y-6">
            {filteredSuppliers.map((supplier) => (
              <div key={supplier.id} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                      supplier.isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {supplier.companyName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{supplier.companyName}</h3>
                      <p className="text-sm text-gray-600">{supplier.city}, Morocco</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewSupplier(supplier)}
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(supplier)}
                      className="border-gray-200 text-gray-600 hover:bg-gray-50"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(supplier)}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
                <SupplierPerformance
                  supplierId={supplier.id}
                  supplierName={supplier.companyName}
                />
              </div>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full">
      <div className={`flex-1 transition-all duration-300 ${isPanelOpen ? 'mr-[600px]' : ''}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Enhanced Suppliers</h1>
              <p className="text-gray-600 mt-1">Advanced supplier management with performance analytics and insights</p>
            </div>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Supplier
            </Button>
          </div>

          {/* View Mode Tabs */}
          <div className="bg-white rounded-xl border border-gray-200 p-2 mb-6">
            <div className="flex space-x-1">
              <button
                onClick={() => setViewMode('dashboard')}
                className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'cards'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                Cards View
              </button>
              <button
                onClick={() => setViewMode('performance')}
                className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'performance'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Performance
              </button>
            </div>
          </div>

          {/* Filters and Search - Only show for cards and performance views */}
          {viewMode !== 'dashboard' && (
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
          )}

          {/* Content based on view mode */}
          {filteredSuppliers.length === 0 && viewMode !== 'dashboard' ? (
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
            renderViewModeContent()
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
