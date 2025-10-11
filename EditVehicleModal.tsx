import React, { useState, useEffect } from 'react';
import { X, Car, Save } from 'lucide-react';
import { Vehicle } from '../../types/vehicle';

interface EditVehicleModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (vehicle: Vehicle) => void;
}

export const EditVehicleModal: React.FC<EditVehicleModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    vin: '',
    horsePower: 0,
    kilometrage: 0,
    fuelType: 'GASOLINE' as Vehicle['fuelType'],
    transmissionType: 'MANUAL' as Vehicle['transmissionType'],
    clientId: '',
    lastServiceDate: '',
    nextServiceDue: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (vehicle && isOpen) {
      setFormData({
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        licensePlate: vehicle.licensePlate,
        vin: vehicle.vin,
        horsePower: vehicle.horsePower,
        kilometrage: vehicle.kilometrage,
        fuelType: vehicle.fuelType,
        transmissionType: vehicle.transmissionType,
        clientId: vehicle.clientId,
        lastServiceDate: vehicle.lastServiceDate,
        nextServiceDue: vehicle.nextServiceDue,
        notes: vehicle.notes,
      });
      setErrors({});
    }
  }, [vehicle, isOpen]);

  if (!isOpen || !vehicle) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.make.trim()) newErrors.make = 'Make is required';
    if (!formData.model.trim()) newErrors.model = 'Model is required';
    if (formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = 'Please enter a valid year';
    }
    if (!formData.licensePlate.trim()) newErrors.licensePlate = 'License plate is required';
    if (!formData.vin.trim()) newErrors.vin = 'VIN is required';
    if (formData.vin.length !== 17) newErrors.vin = 'VIN must be 17 characters';
    if (formData.horsePower <= 0) newErrors.horsePower = 'Horse power must be greater than 0';
    if (formData.kilometrage < 0) newErrors.kilometrage = 'Kilometrage cannot be negative';
    if (!formData.clientId) newErrors.clientId = 'Client ID is required';
    if (!formData.lastServiceDate) newErrors.lastServiceDate = 'Last service date is required';
    if (!formData.nextServiceDue) newErrors.nextServiceDue = 'Next service due date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const updatedVehicle: Vehicle = {
        ...vehicle,
        ...formData,
      };
      onSave(updatedVehicle);
      handleClose();
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'horsePower' || name === 'kilometrage' 
        ? parseInt(value) || 0 
        : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Car className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Vehicle</h2>
              <p className="text-gray-600 mt-1">{vehicle.year} {vehicle.make} {vehicle.model}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Basic Information
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Make *
                </label>
                <input
                  type="text"
                  name="make"
                  value={formData.make}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.make ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Toyota, BMW, Ford"
                />
                {errors.make && <p className="text-red-500 text-sm mt-1">{errors.make}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model *
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.model ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Camry, X5, F-150"
                />
                {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year *
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.year ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  License Plate *
                </label>
                <input
                  type="text"
                  name="licensePlate"
                  value={formData.licensePlate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.licensePlate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., ABC-123"
                />
                {errors.licensePlate && <p className="text-red-500 text-sm mt-1">{errors.licensePlate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client ID *
                </label>
                <input
                  type="text"
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.clientId ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Client identifier"
                />
                {errors.clientId && <p className="text-red-500 text-sm mt-1">{errors.clientId}</p>}
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Technical Specifications
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  VIN *
                </label>
                <input
                  type="text"
                  name="vin"
                  value={formData.vin}
                  onChange={handleInputChange}
                  maxLength={17}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono ${
                    errors.vin ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="17-character VIN"
                />
                {errors.vin && <p className="text-red-500 text-sm mt-1">{errors.vin}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horse Power *
                </label>
                <input
                  type="number"
                  name="horsePower"
                  value={formData.horsePower}
                  onChange={handleInputChange}
                  min="1"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.horsePower ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 200"
                />
                {errors.horsePower && <p className="text-red-500 text-sm mt-1">{errors.horsePower}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kilometrage *
                </label>
                <input
                  type="number"
                  name="kilometrage"
                  value={formData.kilometrage}
                  onChange={handleInputChange}
                  min="0"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.kilometrage ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 50000"
                />
                {errors.kilometrage && <p className="text-red-500 text-sm mt-1">{errors.kilometrage}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuel Type *
                </label>
                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="GASOLINE">Gasoline</option>
                  <option value="DIESEL">Diesel</option>
                  <option value="ELECTRIC">Electric</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transmission Type *
                </label>
                <select
                  name="transmissionType"
                  value={formData.transmissionType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="MANUAL">Manual</option>
                  <option value="AUTOMATIC">Automatic</option>
                </select>
              </div>
            </div>

            {/* Service Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Service Information
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Service Date *
                </label>
                <input
                  type="date"
                  name="lastServiceDate"
                  value={formData.lastServiceDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.lastServiceDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.lastServiceDate && <p className="text-red-500 text-sm mt-1">{errors.lastServiceDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Next Service Due *
                </label>
                <input
                  type="date"
                  name="nextServiceDue"
                  value={formData.nextServiceDue}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.nextServiceDue ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.nextServiceDue && <p className="text-red-500 text-sm mt-1">{errors.nextServiceDue}</p>}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Additional Notes
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any additional notes about the vehicle..."
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200 flex-shrink-0">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Update Vehicle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};