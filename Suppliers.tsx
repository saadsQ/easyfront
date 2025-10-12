import React, { useState, useEffect } from 'react';
import { Supplier } from '../../types/supplier';
import { SupplierCard } from './SupplierCard';
import { AddSupplierModal } from './AddSupplierModal';
import { EditSupplierModal } from './EditSupplierModal';
import { ViewSupplierModal } from './ViewSupplierModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { Button } from '../UI/Button';
import { SearchInput } from '../UI/SearchInput';
import { Badge } from '../UI/Badge';
import { Plus, Building2, Filter, Download } from 'lucide-react';

export const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // Mock data for demonstration
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

  // Filter suppliers based on search term and status
  useEffect(() => {
    let filtered = suppliers;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(supplier =>
        supplier.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.ICE.includes(searchTerm)
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(supplier =>
        filterStatus === 'active' ? supplier.isActive : !supplier.isActive
      );
    }

    setFilteredSuppliers(filtered);
  }, [suppliers, searchTerm, filterStatus]);

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
  };

  const handleViewSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsViewModalOpen(true);
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
          <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
          <p className="text-gray-600">Manage your Moroccan suppliers and partners</p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Building2 className="w-8 h-8 text-indigo-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Suppliers</p>
              <p className="text-2xl font-bold text-gray-900">{suppliers.length}</p>
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
              <p className="text-2xl font-bold text-gray-900">{activeSuppliers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Inactive</p>
              <p className="text-2xl font-bold text-gray-900">{inactiveSuppliers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {(suppliers.reduce((acc, s) => acc + s.rating, 0) / suppliers.length || 0).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchInput
              placeholder="Search suppliers by name, contact, city, or ICE..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
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

      {/* Suppliers Grid */}
      {filteredSuppliers.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No suppliers found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Try adjusting your search criteria' : 'Get started by adding your first supplier'}
          </p>
          {!searchTerm && (
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Supplier
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.map((supplier) => (
            <SupplierCard
              key={supplier.id}
              supplier={supplier}
              onView={handleViewSupplier}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Modals */}
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

      <ViewSupplierModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedSupplier(null);
        }}
        supplier={selectedSupplier}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
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
