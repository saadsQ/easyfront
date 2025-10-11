import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, LayoutGrid, List } from 'lucide-react';
import { Vehicle } from '../../types/vehicle';
import VehicleCard from './VehicleCard';
import { AddVehicleModal } from './AddVehicleModal';
import { ViewVehicleModal } from './ViewVehicleModal';
import { EditVehicleModal } from './EditVehicleModal';
import { ViewClientModal } from '../Clients/ViewClientModal';
import { ConfirmationPopup } from '../UI/ConfirmationPopup';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { Client } from '../../types/client';
import apiClient from '../../utils/apiClient';

const Vehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewClientModalOpen, setIsViewClientModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Confirmation popup state
  const [confirmationPopup, setConfirmationPopup] = useState({
    isOpen: false,
    type: 'success' as 'success' | 'error',
    title: '',
    message: '',
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    vehicle: null as Vehicle | null,
    isLoading: false,
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/vehicules');
      setVehicles(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || vehicle.fuelType === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleView = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsViewModalOpen(true);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsEditModalOpen(true);
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setIsViewClientModalOpen(true);
  };

  const handleSaveEdit = async (updatedVehicle: Vehicle) => {
    try {
      await apiClient.put(`/vehicules/${updatedVehicle.id}`, updatedVehicle);
      await fetchVehicles();
      setConfirmationPopup({
        isOpen: true,
        type: 'success',
        title: 'Success',
        message: 'Vehicle updated successfully!',
      });
    } catch (err) {
      setConfirmationPopup({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: err instanceof Error ? err.message : 'Failed to update vehicle',
      });
    }
  };

  const handleDelete = async (vehicle: Vehicle) => {
    try {
      await apiClient.delete(`/vehicules/${vehicle.id}`);
      await fetchVehicles();
      setConfirmationPopup({
        isOpen: true,
        type: 'success',
        title: 'Success',
        message: 'Vehicle deleted successfully!',
      });
    } catch (err) {
      setConfirmationPopup({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: err instanceof Error ? err.message : 'Failed to delete vehicle',
      });
    }
  };

  const handleAddVehicle = async (vehicleData: Omit<Vehicle, 'id'>) => {
    try {
      const response = await apiClient.post('/vehicules', vehicleData);
      await fetchVehicles();
      setConfirmationPopup({
        isOpen: true,
        type: 'success',
        title: 'Success',
        message: 'Vehicle added successfully!',
      });
    } catch (err) {
      setConfirmationPopup({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: err instanceof Error ? err.message : 'Failed to add vehicle',
      });
    }
  };

  const closeConfirmationPopup = () => {
    setConfirmationPopup(prev => ({ ...prev, isOpen: false }));
  };

  const handleDeleteClick = (vehicle: Vehicle) => {
    setDeleteModal({
      isOpen: true,
      vehicle,
      isLoading: false,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.vehicle) return;

    setDeleteModal(prev => ({ ...prev, isLoading: true }));

    try {
      await apiClient.delete(`/vehicules/${deleteModal.vehicle.id}`);
      await fetchVehicles();
      setDeleteModal({
        isOpen: false,
        vehicle: null,
        isLoading: false,
      });
      setConfirmationPopup({
        isOpen: true,
        type: 'success',
        title: 'Success',
        message: 'Vehicle deleted successfully!',
      });
    } catch (err) {
      setDeleteModal({
        isOpen: false,
        vehicle: null,
        isLoading: false,
      });
      setConfirmationPopup({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: err instanceof Error ? err.message : 'Failed to delete vehicle',
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({
      isOpen: false,
      vehicle: null,
      isLoading: false,
    });
  };

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
          <h3 className="text-red-800 font-medium mb-2">Error Loading Vehicles</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchVehicles}
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicles</h1>
          <p className="text-gray-600">Manage your fleet of {vehicles.length} vehicles</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Vehicle
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search vehicles by make, model, or license plate..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Fuels types</option>
            <option value="GASOLINE">Gasoline</option>
            <option value="DIESEL">Diesel</option>
            <option value="HYBRID">Hybrid</option>
            <option value="ELECTRIC">Electric</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredVehicles.length} of {vehicles.length} vehicles
      </div>

      {/* Vehicles Grid */}
      {filteredVehicles.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or add a new vehicle.</p>
        </div>
      ) : (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id || vehicle.vin}
              vehicle={vehicle}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <AddVehicleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddVehicle}
      />

      {selectedVehicle && (
        <ViewVehicleModal
          vehicle={selectedVehicle}
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedVehicle(null);
          }}
          onViewClient={handleViewClient}
        />
      )}

      {/* View Client Modal */}
      {selectedClient && (
        <ViewClientModal
          client={selectedClient}
          isOpen={isViewClientModalOpen}
          onClose={() => {
            setIsViewClientModalOpen(false);
            setSelectedClient(null);
          }}
        />
      )}

      {selectedVehicle && (
        <EditVehicleModal
          vehicle={selectedVehicle}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedVehicle(null);
          }}
          onSave={handleSaveEdit}
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        vehicle={deleteModal.vehicle}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteModal.isLoading}
      />

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

export default Vehicles;