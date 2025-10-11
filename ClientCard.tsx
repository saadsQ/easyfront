import React from 'react';
import { useState, useEffect } from 'react';
import { Card } from '../UI/Card';
import { Badge } from '../UI/Badge';
import { Button } from '../UI/Button';
import { Client } from '../../types/client';
import { Vehicle } from '../../types/vehicle';
import { User, Phone, MapPin, Car, DollarSign, Calendar, Eye, Edit3, Trash2, FileText } from 'lucide-react';
import apiClient from '../../utils/apiClient';

interface ClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
  onView: (client: Client) => void;
  onDelete: (client: Client) => void;
  isDeleting?: boolean;
}

export const ClientCard: React.FC<ClientCardProps> = ({ 
  client, 
  onEdit, 
  onView, 
  onDelete,
  isDeleting = false
}) => {
  const [vehicleCount, setVehicleCount] = useState(0);

  useEffect(() => {
    fetchClientVehicleCount();
  }, [client.id]);

  const fetchClientVehicleCount = async () => {
    try {
      const response = await apiClient.get(`/vehicules/client/${client.id}`);
      setVehicleCount(response.data.length);
    } catch (error) {
      console.error('Error fetching client vehicles:', error);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card hover className="group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-full group-hover:bg-blue-100 transition-colors">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">
              {client.firstName} {client.lastName}
            </h3>
            <p className="text-sm text-slate-600">{client.email}</p>
          </div>
        </div>
        <Badge variant="success">Active</Badge>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Phone className="h-4 w-4" />
          <span>{client.phoneNumber}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <MapPin className="h-4 w-4" />
          <span>{client.city}, {client.country}</span>
        </div>
        {client.notes && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <FileText className="h-4 w-4" />
            <span className="truncate">{client.notes}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-slate-50 rounded-lg">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
            <Car className="h-4 w-4" />
          </div>
          <p className="text-lg font-semibold text-slate-900">{vehicleCount}</p>
          <p className="text-xs text-slate-600">Vehicles</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-emerald-600 mb-1">
            <DollarSign className="h-4 w-4" />
          </div>
          <p className="text-lg font-semibold text-slate-900">{client.totalSpent} DHs</p>
          <p className="text-xs text-slate-600">Total Spent</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-amber-600 mb-1">
            <Calendar className="h-4 w-4" />
          </div>
          <p className="text-sm font-semibold text-slate-900">
            {formatDate(client.lastVisit)}
          </p>
          <p className="text-xs text-slate-600">Last Visit</p>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Member since</p>
            <p className="text-sm font-medium text-slate-700">
              {formatDate(client.registrationDate)}
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              icon={Eye} 
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                onView(client);
              }}
            >
              View
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              icon={Edit3} 
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                onEdit(client);
              }}
            >
              Edit
            </Button>
            {onDelete && (
              <Button 
                variant="ghost" 
                size="sm" 
                icon={Trash2}
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  onDelete(client);
                }}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};