import React from 'react';
import { useState, useEffect } from 'react';
import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';
import { Button } from '../UI/Button';
import { Vehicle } from '../../types/vehicle';
import { Client } from '../../types/client';
import { Car, Calendar, User, Eye, Edit, Gauge, Fuel, Settings, Trash2 } from 'lucide-react';
import apiClient from '../../utils/apiClient';

interface VehicleCardProps {
  vehicle: Vehicle;
  onView: (vehicle: Vehicle) => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete?: (vehicle: Vehicle) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onView, onEdit, onDelete }) => {
  const [clientName, setClientName] = useState('Loading...');

  useEffect(() => {
    fetchClientName();
  }, [vehicle.clientId]);

  const fetchClientName = async () => {
    try {
      const response = await apiClient.get(`/clients/${vehicle.clientId}`);
      if (response.data) {
        setClientName(`${response.data.firstName} ${response.data.lastName}`);
      } else {
        setClientName('Unknown Client');
      }
    } catch (error) {
      console.error('Error fetching client:', error);
      setClientName('Error loading');
    }
  };

  const getStatusBadge = () => {
    // Default to 'active' if status is not provided
    const status = vehicle.status || 'active';
    const variants = {
      active: 'success',
      'in-service': 'info',
      maintenance: 'warning',
      inactive: 'default'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || 'default'}>
      {status.replace('-', ' ')}
    </Badge>;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(vehicle);
    }
  };

  return (
    <Card hover className="group">
      {/* Header with car icon and status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-100 transition-colors">
            <Car className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-sm text-slate-600">{vehicle.licensePlate}</p>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {/* Vehicle details section */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar className="h-4 w-4" />
          <span>Last Service: {formatDate(vehicle.lastServiceDate)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Gauge className="h-4 w-4" />
          <span>{vehicle.kilometrage.toLocaleString()} mi</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Fuel className="h-4 w-4" />
          <span className="capitalize">{vehicle.fuelType}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Settings className="h-4 w-4" />
          <span className="capitalize">{vehicle.transmissionType}</span>
        </div>
      </div>

      {/* Notes section */}
      {vehicle.notes && (
        <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-xs font-medium text-slate-500 mb-1">Notes</p>
          <p className="text-sm text-slate-900 line-clamp-2">{vehicle.notes}</p>
        </div>
      )}

      {/* Footer with owner and action buttons */}
      <div className="pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-100 text-slate-600 rounded-full">
              <User className="h-3 w-3" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Client ID</p>
              <p className="text-sm font-medium text-slate-900">{clientName}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" icon={Eye} onClick={() => onView(vehicle)}>
              View
            </Button>
            <Button variant="outline" size="sm" icon={Edit} onClick={() => onEdit(vehicle)}>
              Edit
            </Button>
            {onDelete && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VehicleCard;