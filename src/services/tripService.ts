import { Trip, BookingRequest, TripStatus } from '../types';
import { mockTrips, mockDrivers, mockVehicles } from '../data/mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class TripService {
  private trips: Trip[] = [...mockTrips];
  private tripIdCounter = mockTrips.length + 1;

  async getAllTrips(customerId: string): Promise<Trip[]> {
    await delay(300);
    return this.trips
      .filter(trip => trip.customerId === customerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getTripById(tripId: string): Promise<Trip | null> {
    await delay(200);
    return this.trips.find(trip => trip.id === tripId) || null;
  }

  async createTrip(customerId: string, request: BookingRequest): Promise<Trip> {
    await delay(500);

    const newTrip: Trip = {
      id: `trip-${String(this.tripIdCounter).padStart(3, '0')}`,
      customerId,
      pickupLocation: request.pickupLocation,
      dropoffLocation: request.dropoffLocation,
      scheduledDate: request.date,
      scheduledTime: request.time,
      passengerCount: request.passengerCount,
      luggageCount: request.luggageCount,
      vehicleType: request.vehicleType,
      tripType: request.tripType,
      notes: request.notes,
      customerType: request.customerType,
      status: 'pending',
      estimatedFare: this.calculateEstimatedFare(request.vehicleType),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.tripIdCounter++;
    this.trips.unshift(newTrip);

    setTimeout(() => {
      this.autoAssignDriver(newTrip.id);
    }, 3000);

    return newTrip;
  }

  async updateTripStatus(tripId: string, status: TripStatus): Promise<Trip> {
    await delay(300);

    const trip = this.trips.find(t => t.id === tripId);
    if (!trip) {
      throw new Error('Trip not found');
    }

    trip.status = status;
    trip.updatedAt = new Date().toISOString();

    return trip;
  }

  async getDriverTrips(driverId: string): Promise<Trip[]> {
    await delay(300);
    return this.trips
      .filter(trip => trip.driverId === driverId || trip.status === 'pending')
      .sort((a, b) => {
        const dateA = new Date(`${a.scheduledDate}T${a.scheduledTime}`).getTime();
        const dateB = new Date(`${b.scheduledDate}T${b.scheduledTime}`).getTime();
        return dateA - dateB;
      });
  }

  async acceptJob(tripId: string, driverId: string): Promise<Trip> {
    await delay(400);

    const trip = this.trips.find(t => t.id === tripId);
    if (!trip) {
      throw new Error('Trip not found');
    }

    const driver = mockDrivers.find(d => d.id === driverId);
    if (!driver) {
      throw new Error('Driver not found');
    }

    trip.driverId = driverId;
    trip.vehicleId = driver.vehicleId;
    trip.status = 'confirmed';
    trip.updatedAt = new Date().toISOString();

    return trip;
  }

  private calculateEstimatedFare(vehicleType: string): number {
    const baseRates: Record<string, number> = {
      sedan: 75,
      executive_sedan: 125,
      suv: 95,
      luxury_suv: 150,
      van: 110,
      executive_van: 175,
    };
    return baseRates[vehicleType] || 100;
  }

  private autoAssignDriver(tripId: string) {
    const trip = this.trips.find(t => t.id === tripId);
    if (!trip || trip.status !== 'pending') return;

    const availableDriver = mockDrivers.find(d => d.available);
    if (availableDriver) {
      trip.driverId = availableDriver.id;
      trip.vehicleId = availableDriver.vehicleId;
      trip.status = 'driver_assigned';
      trip.updatedAt = new Date().toISOString();
    }
  }
}

export const tripService = new TripService();
