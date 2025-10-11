import React from 'react';
import { X, Calendar, Fuel, Settings, FileText, Hash, Car, Gauge, User, Eye } from 'lucide-react';
import { Vehicle } from '../../types/vehicle';
import { Client } from '../../types/client';
import { useState, useEffect } from 'react';
import apiClient from '../../utils/apiClient';

interface ViewVehicleModalProps {
  vehicle: Vehicle;
  isOpen: boolean;
  onClose: () => void;
  onViewClient?: (client: Client) => void;
}

export const ViewVehicleModal: React.FC<ViewVehicleModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  onViewClient,
}) => {
  const [client, setClient] = useState<Client | null>(null);
  const [loadingClient, setLoadingClient] = useState(false);

  useEffect(() => {
    if (isOpen && vehicle.clientId) {
      fetchVehicleClient();
    }
  }, [isOpen, vehicle.clientId]);

  const fetchVehicleClient = async () => {
    try {
      setLoadingClient(true);
      const response = await apiClient.get(`/clients/${vehicle.clientId}`);
      setClient(response.data || null);
    } catch (error) {
      console.error('Error fetching vehicle client:', error);
    } finally {
      setLoadingClient(false);
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

  const getFuelTypeColor = (fuelType: string) => {
    switch (fuelType) {
      case 'ELECTRIC':
        return 'bg-green-100 text-green-800';
      case 'HYBRID':
        return 'bg-blue-100 text-blue-800';
      case 'DIESEL':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-orange-100 text-orange-800';
    }
  };

  const getTransmissionColor = (transmission: string) => {
    return transmission === 'automatic' 
      ? 'bg-purple-100 text-purple-800' 
      : 'bg-indigo-100 text-indigo-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h2>
            <p className="text-gray-600 mt-1">Vehicle Details</p>
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
                <Car className="w-5 h-5 text-blue-600" />
                Basic Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Make</span>
                  <span className="font-medium text-gray-900">{vehicle.make}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Model</span>
                  <span className="font-medium text-gray-900">{vehicle.model}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Year</span>
                  <span className="font-medium text-gray-900">{vehicle.year}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">License Plate</span>
                  <span className="font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                    {vehicle.licensePlate}
                  </span>
                </div>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-600" />
                Technical Specifications
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    VIN
                  </span>
                  <span className="font-mono text-sm text-gray-900 bg-gray-100 px-2 py-1 rounded">
                    {vehicle.vin}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Gauge className="w-4 h-4" />
                    Horse Power
                  </span>
                  <span className="font-medium text-gray-900">{vehicle.horsePower} HP</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Kilometrage</span>
                  <span className="font-medium text-gray-900">
                    {vehicle.kilometrage.toLocaleString()} km
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Fuel className="w-4 h-4" />
                    Fuel Type
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getFuelTypeColor(vehicle.fuelType)}`}>
                    {vehicle.fuelType}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Transmission</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getTransmissionColor(vehicle.transmissionType)}`}>
                    {vehicle.transmissionType}
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
                  <span className="text-gray-600">Last Service Date</span>
                  <span className="font-medium text-gray-900">
                    {formatDate(vehicle.lastServiceDate)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Next Service Due</span>
                  <span className="font-medium text-orange-600">
                    {formatDate(vehicle.nextServiceDue)}
                  </span>
                </div>
              </div>
            </div>

            {/* Client Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-green-600" />
                Vehicle Owner
              </h3>
              
              {loadingClient ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                </div>
              ) : client ? (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-green-900">
                        {client.firstName} {client.lastName}
                      </h4>
                      <p className="text-sm text-green-700">{client.email}</p>
                    </div>
                    {onViewClient && (
                      <button
                        onClick={() => onViewClient(client)}
                        className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                        title="View Client Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-600">Phone:</span>
                      <span className="font-medium text-green-900">{client.phoneNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-600">City:</span>
                      <span className="font-medium text-green-900">{client.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-600">Registration:</span>
                      <span className="font-medium text-green-900">{formatDate(client.registrationDate)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 bg-gray-50 rounded-lg">
                  <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">Client information not found</p>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Notes
              </h3>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">
                  {vehicle.notes || 'No notes available for this vehicle.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center gap-3 p-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {client ? `Owner: ${client.firstName} ${client.lastName}` : 'Loading owner...'}
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