export type UserMode = 'customer' | 'driver';

export type TripStatus =
  | 'pending'
  | 'confirmed'
  | 'driver_assigned'
  | 'en_route'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type CustomerType = 'B2C' | 'B2B';

export type TripType = 'one_way' | 'return';

export type VehicleType =
  | 'sedan'
  | 'executive_sedan'
  | 'suv'
  | 'luxury_suv'
  | 'van'
  | 'executive_van';

export type NotificationType =
  | 'booking_confirmed'
  | 'driver_assigned'
  | 'trip_started'
  | 'trip_completed'
  | 'trip_updated'
  | 'new_job_assigned';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  customerType: CustomerType;
  companyName?: string;
  preferredVehicleType?: VehicleType;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicleId: string;
  available: boolean;
  rating: number;
}

export interface Vehicle {
  id: string;
  type: VehicleType;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  capacity: number;
}

export interface BookingRequest {
  pickupLocation: string;
  dropoffLocation: string;
  date: string;
  time: string;
  passengerCount: number;
  luggageCount: number;
  vehicleType: VehicleType;
  tripType: TripType;
  notes?: string;
  customerType: CustomerType;
}

export interface Trip {
  id: string;
  customerId: string;
  driverId?: string;
  vehicleId?: string;
  pickupLocation: string;
  dropoffLocation: string;
  scheduledDate: string;
  scheduledTime: string;
  passengerCount: number;
  luggageCount: number;
  vehicleType: VehicleType;
  tripType: TripType;
  notes?: string;
  customerType: CustomerType;
  status: TripStatus;
  estimatedFare?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  tripId?: string;
  createdAt: string;
}
