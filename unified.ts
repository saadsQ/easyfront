import { Client } from './client';
import { Vehicle } from './vehicle';

export interface ClientWithVehicles extends Client {
  vehicles: Vehicle[];
  totalVehicles: number;
  activeVehicles: number;
  maintenanceDue: number;
  totalValue: number;
}

export interface VehicleWithClient extends Vehicle {
  client: Client;
  serviceHistory: ServiceRecord[];
  nextServiceDue: boolean;
  maintenanceCost: number;
}

export interface ServiceRecord {
  id: string;
  vehicleId: string;
  serviceDate: string;
  serviceType: string;
  description: string;
  cost: number;
  mileage: number;
  nextServiceDue: string;
  notes: string;
}

export type ViewMode = 'clients' | 'vehicles' | 'unified';
export type DisplayMode = 'grid' | 'list';

export interface UnifiedStats {
  totalClients: number;
  totalVehicles: number;
  clientsWithVehicles: number;
  maintenanceDue: number;
  averageVehiclesPerClient: number;
  totalMaintenanceCost: number;
}

export interface FilterOptions {
  searchTerm: string;
  cityFilter: string;
  fuelFilter: string;
  statusFilter: string;
  dateRange?: {
    start: string;
    end: string;
  };
}
