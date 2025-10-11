import React, { useState } from 'react';
import { X, User, Phone, MapPin, Calendar, DollarSign, Car, Edit, Trash2, Plus } from 'lucide-react';
import { Client } from '../../types/client';
import { Vehicle } from '../../types/vehicle';
import { Badge } from '../UI/Badge';
import apiClient from '../../utils/apiClient';

interface ClientDetailPanelProps {
  client: Client;
  vehicles: Vehicle[];
  onClose: () => void;
  onRefresh: () => void;
  onAddVehicle: () => void;
}

export const ClientDetailPanel: React.FC<ClientDetailPanelProps> = ({
  client,
  vehicles,
  onClose,
  onRefresh,
  onAddVehicle
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedClient, setEditedClient] = useState<Client>(client);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingVehicleId, setDeletingVehicleId] = useState<string | null>(null);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const handleSaveEdit = async () => {
    try {
      await apiClient.put(`/clients/${client.id}`, editedClient);
      setIsEditing(false);
      onRefresh();
    } catch (err) {
      console.error('Error updating client:', err);
    }
  };

  const handleDeleteClient = async () => {
    if (!confirm(`Are you sure you want to delete ${client.firstName} ${client.lastName}? This action cannot be undone.`)) {
      return;
    }

    try {
      setIsDeleting(true);
      await apiClient.delete(`/clients/${client.id}`);
      onClose();
      onRefresh();
    } catch (err) {
      console.error('Error deleting client:', err);
      alert('Failed to delete client. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) {
      return;
    }

    try {
      setDeletingVehicleId(vehicleId);
      await apiClient.delete(`/vehicules/${vehicleId}`);
      onRefresh();
    } catch (err) {
      console.error('Error deleting vehicle:', err);
      alert('Failed to delete vehicle. Please try again.');
    } finally {
      setDeletingVehicleId(null);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {client.firstName} {client.lastName}
            </h2>
            <Badge variant="success">Active Client</Badge>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedClient(client);
                    }}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      value={editedClient.firstName}
                      onChange={(e) => setEditedClient({ ...editedClient, firstName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={editedClient.lastName}
                      onChange={(e) => setEditedClient({ ...editedClient, lastName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editedClient.email}
                    onChange={(e) => setEditedClient({ ...editedClient, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editedClient.phoneNumber}
                    onChange={(e) => setEditedClient({ ...editedClient, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Phone Number</p>
                    <p className="font-medium text-gray-900">{client.phoneNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="font-medium text-gray-900">{client.streetAddress}</p>
                    <p className="text-sm text-gray-600">{client.city}, {client.postalCode}</p>
                    <p className="text-sm text-gray-600">{client.country}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Total Spent</span>
                </div>
                <p className="text-2xl font-bold text-green-900">{client.totalSpent} DHs</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">Last Visit</span>
                </div>
                <p className="text-lg font-bold text-blue-900">{formatDate(client.lastVisit)}</p>
              </div>
            </div>
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Member Since</p>
              <p className="font-medium text-gray-900">{formatDate(client.registrationDate)}</p>
            </div>
          </div>

          {client.notes && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes</h3>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-700">{client.notes}</p>
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Vehicles ({vehicles.length})
                </h3>
              </div>
              <button
                onClick={onAddVehicle}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Vehicle
              </button>
            </div>

            {vehicles.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Car className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-3">No vehicles registered</p>
                <button
                  onClick={onAddVehicle}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add First Vehicle
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Car className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">{vehicle.licensePlate}</p>
                          <div className="flex gap-3 mt-2 text-xs text-gray-500">
                            <span className="capitalize">{vehicle.fuelType.toLowerCase()}</span>
                            <span>•</span>
                            <span className="capitalize">{vehicle.transmissionType.toLowerCase()}</span>
                            <span>•</span>
                            <span>{vehicle.kilometrage.toLocaleString()} km</span>
                          </div>
                          {vehicle.notes && (
                            <p className="text-sm text-gray-600 mt-2">{vehicle.notes}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteVehicle(vehicle.id!)}
                        disabled={deletingVehicleId === vehicle.id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6">
            <button
              onClick={handleDeleteClient}
              disabled={isDeleting}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              {isDeleting ? 'Deleting...' : 'Delete Client'}
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              This will permanently delete the client and all associated data
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
