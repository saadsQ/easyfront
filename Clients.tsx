import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Filter, ChevronDown } from 'lucide-react';
import { ClientCard } from './ClientCard';
import { Client } from '../../types/client';
import { ConfirmationPopup } from '../UI/ConfirmationPopup';
import { AddClientModal } from './AddClientModal';
import { EditClientModal } from './EditClientModal';
import { ViewClientModal } from './ViewClientModal';
import { ViewVehicleModal } from '../Vehicles/ViewVehicleModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { Vehicle } from '../../types/vehicle';
import apiClient from '../../utils/apiClient';

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isViewVehicleModalOpen, setIsViewVehicleModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Confirmation popup state
  const [confirmationPopup, setConfirmationPopup] = useState({
    isOpen: false,
    type: 'success' as 'success' | 'error',
    title: '',
    message: '',
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/clients');
      setClients(response.data);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  };

  // Handle client CRUD operations
  const handleAddClient = async (clientData: Omit<Client, 'id' | 'vehicleCount' | 'totalSpent' | 'lastVisit'>) => {
    try {
      const response = await apiClient.post('/clients', clientData);
      setClients(prev => [...prev, response.data]);
      setIsAddModalOpen(false);
      showConfirmation('Client added', 'The client has been successfully added.', 'success');
    } catch (err) {
      console.error('Error adding client:', err);
      showConfirmation('Error', 'Failed to add client. Please try again.', 'error');
    }
  };

  const handleUpdateClient = async (clientData: Client) => {
    try {
      const response = await apiClient.put(`/clients/${clientData.id}`, clientData);
      setClients(prev => 
        prev.map(client => client.id === clientData.id ? response.data : client)
      );
      setIsEditModalOpen(false);
      showConfirmation('Client updated', 'The client has been successfully updated.', 'success');
    } catch (err) {
      console.error('Error updating client:', err);
      showConfirmation('Error', 'Failed to update client. Please try again.', 'error');
    }
  };

  const handleDeleteClient = async () => {
    if (!selectedClient) return;
    
    try {
      setIsDeleting(true);
      await apiClient.delete(`/clients/${selectedClient.id}`);
      setClients(prev => prev.filter(client => client.id !== selectedClient.id));
      setIsDeleteModalOpen(false);
      showConfirmation('Client deleted', 'The client has been successfully deleted.', 'success');
    } catch (err) {
      console.error('Error deleting client:', err);
      showConfirmation('Error', 'Failed to delete client. Please try again.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const showConfirmation = (title: string, message: string, type: 'success' | 'error') => {
    setConfirmationPopup({
      isOpen: true,
      type,
      title,
      message,
    });
  };

  const filteredClients = useMemo(() => {
    let filtered = clients;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phoneNumber.includes(searchTerm)
      );
    }

    // Apply city filter
    if (cityFilter !== 'all') {
      filtered = filtered.filter(client => client.city === cityFilter);
    }

    return filtered;
  }, [clients, searchTerm, cityFilter]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setCityFilter('all');
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setIsEditModalOpen(true);
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setIsViewModalOpen(true);
  };

  const handleViewVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsViewVehicleModalOpen(true);
  };

  const closeConfirmationPopup = () => {
    setConfirmationPopup(prev => ({ ...prev, isOpen: false }));
  };

  const hasActiveFilters = searchTerm || cityFilter !== 'all';

  // Get unique cities for filter dropdown
  const uniqueCities = [...new Set(clients.map(client => client.city))];
  const cityOptions = [
    { value: 'all', label: 'All Cities' },
    ...uniqueCities.map(city => ({ value: city, label: city }))
  ];

  // Calculate statistics
  const totalClients = clients.length;
  const totalRevenue = clients.reduce((sum, client) => sum + client.totalSpent, 0);
  const averageSpent = totalClients > 0 ? Math.round(totalRevenue / totalClients) : 0;

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-medium mb-2">Error Loading Clients</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchClients}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filteredClients.length} {filteredClients.length === 1 ? 'client' : 'clients'} found
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Client
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Clients</dt>
                <dd className="text-lg font-medium text-gray-900">{totalClients}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                <dd className="text-lg font-medium text-gray-900">{totalRevenue.toLocaleString('fr-FR')} DHs</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Average Spent</dt>
                <dd className="text-lg font-medium text-gray-900">{averageSpent.toLocaleString('fr-FR')} DHs</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className="h-4 w-4 mr-2 text-gray-500" />
              Filter
              <ChevronDown className="ml-2 -mr-1 h-4 w-4" />
            </button>
            
            {isFilterOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-100">
                    Filter by city
                  </div>
                  {cityOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        cityFilter === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        setCityFilter(option.value);
                        setIsFilterOpen(false);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredClients.length} of {totalClients} clients
      </div>

      {/* Client Grid */}
      {filteredClients.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or add a new client.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <ClientCard 
              key={client.id|| client.phoneNumber} 
              client={client} 
              onEdit={handleEditClient} 
              onView={handleViewClient} 
              onDelete={() => {
                setSelectedClient(client);
                setIsDeleteModalOpen(true);
              }}
              isDeleting={isDeleting && selectedClient?.id === client.id}
            />
          ))}
        </div>
      )}

      {/* Add Client Modal */}
      <AddClientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddClient}
      />

      {/* Edit Client Modal */}
      {selectedClient && (
        <EditClientModal
          client={selectedClient}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleUpdateClient}
        />
      )}

      {/* View Client Modal */}
      {selectedClient && (
        <ViewClientModal
          client={selectedClient}
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          onViewVehicle={handleViewVehicle}
        />
      )}

      {/* View Vehicle Modal */}
      {selectedVehicle && (
        <ViewVehicleModal
          vehicle={selectedVehicle}
          isOpen={isViewVehicleModalOpen}
          onClose={() => {
            setIsViewVehicleModalOpen(false);
            setSelectedVehicle(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {selectedClient && (
        <DeleteConfirmationModal
          client={selectedClient}
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteClient}
          isDeleting={isDeleting}
        />
      )}

      {/* Confirmation Popup */}
      <ConfirmationPopup
        isOpen={confirmationPopup.isOpen}
        type={confirmationPopup.type}
        title={confirmationPopup.title}
        message={confirmationPopup.message}
        onClose={closeConfirmationPopup}
      />
    </div>
  );
};

export default Clients;