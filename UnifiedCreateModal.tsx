import React, { useState, useEffect } from 'react';
import { X, User, Car, CheckCircle, ArrowRight } from 'lucide-react';
import { Client } from '../../types/client';
import { Vehicle } from '../../types/vehicle';
import apiClient from '../../utils/apiClient';

interface UnifiedCreateModalProps {
  isOpen: boolean;
  type: 'client' | 'vehicle' | 'both';
  onClose: () => void;
  onSuccess: () => void;
  clients: Client[];
  preSelectedClientId?: string;
}

export const UnifiedCreateModal: React.FC<UnifiedCreateModalProps> = ({
  isOpen,
  type,
  onClose,
  onSuccess,
  clients,
  preSelectedClientId
}) => {
  const [step, setStep] = useState<'client' | 'vehicle' | 'complete'>('client');
  const [createdClientId, setCreatedClientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [clientData, setClientData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    streetAddress: '',
    city: '',
    postalCode: '',
    country: '',
    notes: '',
  });

  const [vehicleData, setVehicleData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    vin: '',
    horsePower: 0,
    kilometrage: 0,
    fuelType: 'GASOLINE' as Vehicle['fuelType'],
    transmissionType: 'MANUAL' as Vehicle['transmissionType'],
    clientId: preSelectedClientId || '',
    lastServiceDate: '',
    nextServiceDue: '',
    notes: '',
  });

  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [vehicleErrors, setVehicleErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (type === 'both') {
        setStep('client');
      } else if (type === 'client') {
        setStep('client');
      } else {
        setStep('vehicle');
      }
      setCreatedClientId(null);
      setError(null);
      if (preSelectedClientId) {
        setVehicleData(prev => ({ ...prev, clientId: preSelectedClientId }));
      }
    }
  }, [isOpen, type, preSelectedClientId]);

  if (!isOpen) return null;

  const validateClientForm = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!clientData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!clientData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!clientData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(clientData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!clientData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!clientData.streetAddress.trim()) newErrors.streetAddress = 'Street address is required';
    if (!clientData.city.trim()) newErrors.city = 'City is required';
    if (!clientData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!clientData.country.trim()) newErrors.country = 'Country is required';

    setClientErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateVehicleForm = () => {
    const newErrors: Record<string, string> = {};

    if (!vehicleData.make.trim()) newErrors.make = 'Make is required';
    if (!vehicleData.model.trim()) newErrors.model = 'Model is required';
    if (vehicleData.year < 1900 || vehicleData.year > new Date().getFullYear() + 1) {
      newErrors.year = 'Please enter a valid year';
    }
    if (!vehicleData.licensePlate.trim()) newErrors.licensePlate = 'License plate is required';
    if (!vehicleData.vin.trim()) newErrors.vin = 'VIN is required';
    if (vehicleData.vin.length !== 17) newErrors.vin = 'VIN must be 17 characters';
    if (vehicleData.horsePower <= 0) newErrors.horsePower = 'Horse power must be greater than 0';
    if (vehicleData.kilometrage < 0) newErrors.kilometrage = 'Kilometrage cannot be negative';
    if (!vehicleData.clientId.trim()) newErrors.clientId = 'Please select a client';
    if (!vehicleData.lastServiceDate) newErrors.lastServiceDate = 'Last service date is required';
    if (!vehicleData.nextServiceDue) newErrors.nextServiceDue = 'Next service due date is required';

    setVehicleErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClientSubmit = async () => {
    if (!validateClientForm()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post('/clients', {
        ...clientData,
        registrationDate: new Date().toISOString(),
      });
      const newClientId = response.data.id;
      setCreatedClientId(newClientId);
      setVehicleData(prev => ({ ...prev, clientId: newClientId }));

      if (type === 'both') {
        setStep('vehicle');
      } else {
        setStep('complete');
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create client');
    } finally {
      setLoading(false);
    }
  };

  const handleVehicleSubmit = async () => {
    if (!validateVehicleForm()) return;

    setLoading(true);
    setError(null);

    try {
      await apiClient.post('/vehicules', vehicleData);
      setStep('complete');
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create vehicle');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setClientData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      streetAddress: '',
      city: '',
      postalCode: '',
      country: '',
      notes: '',
    });
    setVehicleData({
      make: '',
      model: '',
      year: new Date().getFullYear(),
      licensePlate: '',
      vin: '',
      horsePower: 0,
      kilometrage: 0,
      fuelType: 'GASOLINE',
      transmissionType: 'MANUAL',
      clientId: '',
      lastServiceDate: '',
      nextServiceDue: '',
      notes: '',
    });
    setClientErrors({});
    setVehicleErrors({});
    setStep('client');
    setCreatedClientId(null);
    setError(null);
    onClose();
  };

  const renderClientForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={clientData.firstName}
            onChange={(e) => setClientData({ ...clientData, firstName: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg ${clientErrors.firstName ? 'border-red-500' : 'border-gray-300'}`}
          />
          {clientErrors.firstName && <p className="text-red-500 text-sm mt-1">{clientErrors.firstName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={clientData.lastName}
            onChange={(e) => setClientData({ ...clientData, lastName: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg ${clientErrors.lastName ? 'border-red-500' : 'border-gray-300'}`}
          />
          {clientErrors.lastName && <p className="text-red-500 text-sm mt-1">{clientErrors.lastName}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={clientData.email}
          onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
          className={`w-full px-3 py-2 border rounded-lg ${clientErrors.email ? 'border-red-500' : 'border-gray-300'}`}
        />
        {clientErrors.email && <p className="text-red-500 text-sm mt-1">{clientErrors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          value={clientData.phoneNumber}
          onChange={(e) => setClientData({ ...clientData, phoneNumber: e.target.value })}
          className={`w-full px-3 py-2 border rounded-lg ${clientErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
        />
        {clientErrors.phoneNumber && <p className="text-red-500 text-sm mt-1">{clientErrors.phoneNumber}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Street Address <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={clientData.streetAddress}
          onChange={(e) => setClientData({ ...clientData, streetAddress: e.target.value })}
          className={`w-full px-3 py-2 border rounded-lg ${clientErrors.streetAddress ? 'border-red-500' : 'border-gray-300'}`}
        />
        {clientErrors.streetAddress && <p className="text-red-500 text-sm mt-1">{clientErrors.streetAddress}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={clientData.city}
            onChange={(e) => setClientData({ ...clientData, city: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg ${clientErrors.city ? 'border-red-500' : 'border-gray-300'}`}
          />
          {clientErrors.city && <p className="text-red-500 text-sm mt-1">{clientErrors.city}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Postal Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={clientData.postalCode}
            onChange={(e) => setClientData({ ...clientData, postalCode: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg ${clientErrors.postalCode ? 'border-red-500' : 'border-gray-300'}`}
          />
          {clientErrors.postalCode && <p className="text-red-500 text-sm mt-1">{clientErrors.postalCode}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Country <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={clientData.country}
          onChange={(e) => setClientData({ ...clientData, country: e.target.value })}
          className={`w-full px-3 py-2 border rounded-lg ${clientErrors.country ? 'border-red-500' : 'border-gray-300'}`}
        />
        {clientErrors.country && <p className="text-red-500 text-sm mt-1">{clientErrors.country}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          rows={3}
          value={clientData.notes}
          onChange={(e) => setClientData({ ...clientData, notes: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>
    </div>
  );

  const renderVehicleForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Client <span className="text-red-500">*</span>
        </label>
        <select
          value={vehicleData.clientId}
          onChange={(e) => setVehicleData({ ...vehicleData, clientId: e.target.value })}
          disabled={!!createdClientId || !!preSelectedClientId}
          className={`w-full px-3 py-2 border rounded-lg ${vehicleErrors.clientId ? 'border-red-500' : 'border-gray-300'}`}
        >
          <option value="">Select a client...</option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>
              {client.firstName} {client.lastName} - {client.email}
            </option>
          ))}
        </select>
        {vehicleErrors.clientId && <p className="text-red-500 text-sm mt-1">{vehicleErrors.clientId}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Make <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={vehicleData.make}
            onChange={(e) => setVehicleData({ ...vehicleData, make: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg ${vehicleErrors.make ? 'border-red-500' : 'border-gray-300'}`}
          />
          {vehicleErrors.make && <p className="text-red-500 text-sm mt-1">{vehicleErrors.make}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Model <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={vehicleData.model}
            onChange={(e) => setVehicleData({ ...vehicleData, model: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg ${vehicleErrors.model ? 'border-red-500' : 'border-gray-300'}`}
          />
          {vehicleErrors.model && <p className="text-red-500 text-sm mt-1">{vehicleErrors.model}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={vehicleData.year}
            onChange={(e) => setVehicleData({ ...vehicleData, year: parseInt(e.target.value) || 0 })}
            className={`w-full px-3 py-2 border rounded-lg ${vehicleErrors.year ? 'border-red-500' : 'border-gray-300'}`}
          />
          {vehicleErrors.year && <p className="text-red-500 text-sm mt-1">{vehicleErrors.year}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            License Plate <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={vehicleData.licensePlate}
            onChange={(e) => setVehicleData({ ...vehicleData, licensePlate: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg ${vehicleErrors.licensePlate ? 'border-red-500' : 'border-gray-300'}`}
          />
          {vehicleErrors.licensePlate && <p className="text-red-500 text-sm mt-1">{vehicleErrors.licensePlate}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          VIN <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          maxLength={17}
          value={vehicleData.vin}
          onChange={(e) => setVehicleData({ ...vehicleData, vin: e.target.value })}
          className={`w-full px-3 py-2 border rounded-lg font-mono ${vehicleErrors.vin ? 'border-red-500' : 'border-gray-300'}`}
        />
        {vehicleErrors.vin && <p className="text-red-500 text-sm mt-1">{vehicleErrors.vin}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Horse Power <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={vehicleData.horsePower}
            onChange={(e) => setVehicleData({ ...vehicleData, horsePower: parseInt(e.target.value) || 0 })}
            className={`w-full px-3 py-2 border rounded-lg ${vehicleErrors.horsePower ? 'border-red-500' : 'border-gray-300'}`}
          />
          {vehicleErrors.horsePower && <p className="text-red-500 text-sm mt-1">{vehicleErrors.horsePower}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kilometrage <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={vehicleData.kilometrage}
            onChange={(e) => setVehicleData({ ...vehicleData, kilometrage: parseInt(e.target.value) || 0 })}
            className={`w-full px-3 py-2 border rounded-lg ${vehicleErrors.kilometrage ? 'border-red-500' : 'border-gray-300'}`}
          />
          {vehicleErrors.kilometrage && <p className="text-red-500 text-sm mt-1">{vehicleErrors.kilometrage}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fuel Type <span className="text-red-500">*</span>
          </label>
          <select
            value={vehicleData.fuelType}
            onChange={(e) => setVehicleData({ ...vehicleData, fuelType: e.target.value as Vehicle['fuelType'] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="GASOLINE">Gasoline</option>
            <option value="DIESEL">Diesel</option>
            <option value="ELECTRIC">Electric</option>
            <option value="HYBRID">Hybrid</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transmission <span className="text-red-500">*</span>
          </label>
          <select
            value={vehicleData.transmissionType}
            onChange={(e) => setVehicleData({ ...vehicleData, transmissionType: e.target.value as Vehicle['transmissionType'] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="MANUAL">Manual</option>
            <option value="AUTOMATIC">Automatic</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Service Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={vehicleData.lastServiceDate}
            onChange={(e) => setVehicleData({ ...vehicleData, lastServiceDate: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg ${vehicleErrors.lastServiceDate ? 'border-red-500' : 'border-gray-300'}`}
          />
          {vehicleErrors.lastServiceDate && <p className="text-red-500 text-sm mt-1">{vehicleErrors.lastServiceDate}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Next Service Due <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={vehicleData.nextServiceDue}
            onChange={(e) => setVehicleData({ ...vehicleData, nextServiceDue: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg ${vehicleErrors.nextServiceDue ? 'border-red-500' : 'border-gray-300'}`}
          />
          {vehicleErrors.nextServiceDue && <p className="text-red-500 text-sm mt-1">{vehicleErrors.nextServiceDue}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          rows={3}
          value={vehicleData.notes}
          onChange={(e) => setVehicleData({ ...vehicleData, notes: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Success!</h3>
      <p className="text-gray-600">
        {type === 'both' ? 'Client and vehicle created successfully' :
         type === 'client' ? 'Client created successfully' :
         'Vehicle created successfully'}
      </p>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${step === 'client' ? 'bg-blue-100' : 'bg-green-100'}`}>
              {step === 'client' ? (
                <User className={`w-6 h-6 ${step === 'client' ? 'text-blue-600' : 'text-green-600'}`} />
              ) : step === 'vehicle' ? (
                <Car className="w-6 h-6 text-green-600" />
              ) : (
                <CheckCircle className="w-6 h-6 text-green-600" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {step === 'client' ? 'Add Client' : step === 'vehicle' ? 'Add Vehicle' : 'Complete'}
              </h2>
              {type === 'both' && step !== 'complete' && (
                <p className="text-sm text-gray-600">
                  Step {step === 'client' ? '1' : '2'} of 2
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {step === 'client' && renderClientForm()}
          {step === 'vehicle' && renderVehicleForm()}
          {step === 'complete' && renderCompleteStep()}
        </div>

        {step !== 'complete' && (
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
            <button
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            {step === 'client' ? (
              <button
                onClick={handleClientSubmit}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Creating...' : type === 'both' ? (
                  <>
                    Next: Add Vehicle <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  'Create Client'
                )}
              </button>
            ) : (
              <button
                onClick={handleVehicleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Vehicle'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
