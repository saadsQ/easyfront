import React from 'react';
import { X, Calendar, Settings, FileText, Hash, User, MapPin, Car, Eye } from 'lucide-react';
import { Client } from '../../types/client';
import { Vehicle } from '../../types/vehicle';
import { useState, useEffect } from 'react';
import apiClient from '../../utils/apiClient';

interface ViewClientModalProps {
  client: Client;
  isOpen: boolean;
  onClose: () => void;
  onViewVehicle?: (vehicle: Vehicle) => void;
}

export const ViewClientModal: React.FC<ViewClientModalProps> = ({
  client,
  isOpen,
  onClose,
  onViewVehicle,
}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);

  useEffect(() => {
    if (isOpen && client.id) {
      fetchClientVehicles();
    }
  }, [isOpen, client.id]);

  const fetchClientVehicles = async () => {
    try {
      setLoadingVehicles(true);
      const response = await apiClient.get(`/vehicules/client/${client.id}`);
      setVehicles(response.data);
    } catch (error) {
      console.error('Error fetching client vehicles:', error);
    } finally {
      setLoadingVehicles(false);
    }
  };

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {client.firstName} {client.lastName}
            </h2>
            <p className="text-gray-600 mt-1">Client Details</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Basic Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Phone Number</span>
                  <span className="font-medium text-gray-900">{client.phoneNumber}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium text-gray-900">{client.email}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">CIN</span>
                  <span className="font-medium text-gray-900">{client.phoneNumber}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Registration Date</span>
                  <span className="font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                    {client.registrationDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-600" />
                Additional Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    Address
                  </span>
                  <span className="font-mono text-sm text-gray-900 bg-gray-100 px-2 py-1 rounded">
                    {client.streetAddress}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    City
                  </span>
                  <span className="font-medium text-gray-900">{client.city}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Postal Code</span>
                  <span className="font-medium text-gray-900">
                    {client.postalCode}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Country
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium capitalize">
                    {client.country}
                  </span>
                </div>
                
              </div>
            </div>

            {/* Service Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                Service Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Total Spent</span>
                  <span className="font-medium text-gray-900">
                    {client.totalSpent}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Last Repairs</span>
                  <span className="font-medium text-orange-600">
                    {client.totalSpent}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Notes
              </h3>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">
                  {client.notes || 'No notes available for this client.'}
                </p>
              </div>
            </div>

            {/* Client Vehicles */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Car className="w-5 h-5 text-blue-600" />
                Client Vehicles ({vehicles.length})
              </h3>
              
              {loadingVehicles ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : vehicles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vehicles.map((vehicle) => (
                    <div key={vehicle.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </h4>
                          <p className="text-sm text-gray-600">{vehicle.licensePlate}</p>
                        </div>
                        {onViewVehicle && (
                          <button
                            onClick={() => onViewVehicle(vehicle)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                            title="View Vehicle Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fuel Type:</span>
                          <span className="font-medium capitalize">{vehicle.fuelType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Kilometrage:</span>
                          <span className="font-medium">{vehicle.kilometrage.toLocaleString()} km</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Service:</span>
                          <span className="font-medium">{formatDate(vehicle.lastServiceDate)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Car className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No vehicles registered for this client</p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center gap-3 p-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Total vehicles: {vehicles.length}
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};