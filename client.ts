export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
  registrationDate: string;
  notes: string;
  
  // Keep these additional fields
  vehicleCount: number;
  totalSpent: number;
  lastVisit: string;
}
