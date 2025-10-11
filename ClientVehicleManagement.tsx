import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Users, Car, DollarSign, ChevronRight, ChevronDown, Filter, X } from 'lucide-react';
import { Client } from '../../types/client';
import { Vehicle } from '../../types/vehicle';
import apiClient from '../../utils/apiClient';
import { UnifiedCreateModal } from './UnifiedCreateModal';
import { ClientDetailPanel } from './ClientDetailPanel';
import { ConfirmationPopup } from '../UI/ConfirmationPopup';

interface ExpandedClients {
  [clientId: string]: boolean;
}

const ClientVehicleManagement: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'clients-only' | 'no-vehicles' | 'by-city'>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [expandedClients, setExpandedClients] = useState<ExpandedClients>({});
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalType, setCreateModalType] = useState<'client' | 'vehicle' | 'both'>('both');

  const [confirmationPopup, setConfirmationPopup] = useState({
    isOpen: false,
    type: 'success' as 'success' | 'error',
    title: '',
    message: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [clientsResponse, vehiclesResponse] = await Promise.all([
        apiClient.get('/clients'),
        apiClient.get('/vehicules')
      ]);
      setClients(clientsResponse.data);
      setVehicles(vehiclesResponse.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const getClientVehicles = (clientId: string) => {
    return vehicles.filter(v => v.clientId === clientId);
  };

  const filteredData = useMemo(() => {
    let filtered = clients.map(client => ({
      client,
      vehicles: getClientVehicles(client.id)
    }));

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(({ client, vehicles }) => {
        const clientMatch =
          client.firstName.toLowerCase().includes(term) ||
          client.lastName.toLowerCase().includes(term) ||
          client.email.toLowerCase().includes(term) ||
          client.phoneNumber.includes(term);

        const vehicleMatch = vehicles.some(v =>
          v.make.toLowerCase().includes(term) ||
          v.model.toLowerCase().includes(term) ||
          v.licensePlate.toLowerCase().includes(term) ||
          v.vin.toLowerCase().includes(term)
        );

        return clientMatch || vehicleMatch;
      });
    }

    if (filterType === 'no-vehicles') {
      filtered = filtered.filter(({ vehicles }) => vehicles.length === 0);
    }

    if (filterType === 'by-city' && selectedCity !== 'all') {
      filtered = filtered.filter(({ client }) => client.city === selectedCity);
    }

    return filtered;
  }, [clients, vehicles, searchTerm, filterType, selectedCity]);

  const toggleClientExpansion = (clientId: string) => {
    setExpandedClients(prev => ({
      ...prev,
      [clientId]: !prev[clientId]
    }));
  };

  const handleOpenCreate = (type: 'client' | 'vehicle' | 'both') => {
    setCreateModalType(type);
    setIsCreateModalOpen(true);
  };

  const handleCreateSuccess = async () => {
    await fetchData();
    setIsCreateModalOpen(false);
    showConfirmation('Success', 'Created successfully!', 'success');
  };

  const showConfirmation = (title: string, message: string, type: 'success' | 'error') => {
    setConfirmationPopup({ isOpen: true, type, title, message });
  };

  const uniqueCities = [...new Set(clients.map(c => c.city))].sort();

  const stats = {
    totalClients: clients.length,
    totalVehicles: vehicles.length,
    avgVehiclesPerClient: clients.length > 0 ? (vehicles.length / clients.length).toFixed(1) : '0',
    totalRevenue: clients.reduce((sum, c) => sum + c.totalSpent, 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-medium mb-2">Error Loading Data</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Client & Vehicle Management</h1>
            <p className="text-sm text-gray-500 mt-1">Unified view of clients and their vehicles</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleOpenCreate('client')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Client
            </button>
            <button
              onClick={() => handleOpenCreate('vehicle')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Vehicle
            </button>
            <button
              onClick={() => handleOpenCreate('both')}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Client + Vehicle
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">Total Clients</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">{stats.totalClients}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <Car className="w-5 h-5" />
              <span className="text-sm font-medium">Total Vehicles</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{stats.totalVehicles}</p>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-amber-600 mb-1">
              <Car className="w-5 h-5" />
              <span className="text-sm font-medium">Avg Vehicles/Client</span>
            </div>
            <p className="text-2xl font-bold text-amber-900">{stats.avgVehiclesPerClient}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-slate-600 mb-1">
              <DollarSign className="w-5 h-5" />
              <span className="text-sm font-medium">Total Revenue</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stats.totalRevenue.toLocaleString()} DHs</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search clients by name, email, phone or vehicles by make, model, plate..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Clients</option>
            <option value="no-vehicles">Clients with No Vehicles</option>
            <option value="by-city">Filter by City</option>
          </select>
          {filterType === 'by-city' && (
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Cities</option>
              {uniqueCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className={`${selectedClient ? 'w-1/2' : 'w-full'} overflow-y-auto p-6 transition-all duration-300`}>
          <div className="text-sm text-gray-600 mb-4">
            Showing {filteredData.length} of {clients.length} clients
          </div>

          {filteredData.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredData.map(({ client, vehicles }) => (
                <div key={client.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div
                    className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedClient(client)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleClientExpansion(client.id);
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        {expandedClients[client.id] ? (
                          <ChevronDown className="w-4 h-4 text-gray-600" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {client.firstName} {client.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{client.email}</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Car className="w-4 h-4" />
                            <span className="font-semibold">{vehicles.length}</span>
                          </div>
                          <p className="text-xs text-gray-500">Vehicles</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-gray-900">{client.totalSpent} DHs</p>
                          <p className="text-xs text-gray-500">Total Spent</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {expandedClients[client.id] && vehicles.length > 0 && (
                    <div className="border-t border-gray-200 bg-gray-50 p-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Vehicles ({vehicles.length})</h4>
                      <div className="space-y-2">
                        {vehicles.map(vehicle => (
                          <div key={vehicle.id} className="bg-white p-3 rounded border border-gray-200 flex items-center gap-3">
                            <Car className="w-4 h-4 text-gray-400" />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">
                                {vehicle.year} {vehicle.make} {vehicle.model}
                              </p>
                              <p className="text-sm text-gray-600">{vehicle.licensePlate}</p>
                            </div>
                            <div className="text-sm text-gray-600">
                              <span className="capitalize">{vehicle.fuelType.toLowerCase()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {expandedClients[client.id] && vehicles.length === 0 && (
                    <div className="border-t border-gray-200 bg-gray-50 p-4 text-center">
                      <p className="text-sm text-gray-600">No vehicles registered for this client</p>
                      <button
                        onClick={() => handleOpenCreate('vehicle')}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Add a vehicle
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedClient && (
          <div className="w-1/2 border-l border-gray-200 bg-white overflow-y-auto">
            <ClientDetailPanel
              client={selectedClient}
              vehicles={getClientVehicles(selectedClient.id)}
              onClose={() => setSelectedClient(null)}
              onRefresh={fetchData}
              onAddVehicle={() => handleOpenCreate('vehicle')}
            />
          </div>
        )}
      </div>

      <UnifiedCreateModal
        isOpen={isCreateModalOpen}
        type={createModalType}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
        clients={clients}
        preSelectedClientId={selectedClient?.id}
      />

      <ConfirmationPopup
        isOpen={confirmationPopup.isOpen}
        type={confirmationPopup.type}
        title={confirmationPopup.title}
        message={confirmationPopup.message}
        onClose={() => setConfirmationPopup(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default ClientVehicleManagement;
