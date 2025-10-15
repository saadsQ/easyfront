export interface Supplier {
  id: string;
  companyName: string;
  ICE: string; // Identifiant Commun de l'Entreprise
  IF?: string; // Identifiant Fiscal (optional)
  RC?: string; // Registre du Commerce (optional)
  address: string;
  city: string;
  country: string; // Defaults to "Morocco" but scalable
  contactPerson: string;
  phone: string;
  email: string;
  website?: string; // Optional website URL
  paymentTerms: string; // e.g., "Net 30", "Advance", etc.
  currency: 'MAD' | 'USD' | 'EUR' | 'GBP' | 'CAD'; // Moroccan Dirham, US Dollar, Euro, etc.
  rating: number; // Internal performance or reliability rating (1-5)
  notes: string; // Free notes for internal comments
  createdAt: string;
  updatedAt: string;
  isActive: boolean; // Soft delete / status flag
}

export interface CreateSupplierRequest {
  companyName: string;
  ICE: string;
  IF?: string;
  RC?: string;
  address: string;
  city: string;
  country: string;
  contactPerson: string;
  phone: string;
  email: string;
  website?: string;
  paymentTerms: string;
  currency: 'MAD' | 'USD' | 'EUR' | 'GBP' | 'CAD';
  rating: number;
  notes: string;
}

export interface UpdateSupplierRequest extends Partial<CreateSupplierRequest> {
  id: string;
}
