export interface Vehicle {
  id?: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  licensePlate: string;
  horsePower: number;
  kilometrage: number;
  fuelType: 'GASOLINE' | 'DIESEL' | 'ELECTRIC' | 'HYBRID';
  transmissionType: 'MANUAL' | 'AUTOMATIC';
  clientId: string;
  lastServiceDate: string;
  nextServiceDue: string;
  notes: string;
}
