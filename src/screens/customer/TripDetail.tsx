import { useEffect, useState } from 'react';
import { Trip, Driver, Vehicle } from '../../types';
import { tripService } from '../../services/tripService';
import { driverService } from '../../services/driverService';
import { vehicleService } from '../../services/vehicleService';
import Header from '../../components/Header';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Briefcase,
  Car,
  Phone,
  Mail,
  CheckCircle2,
} from 'lucide-react';

interface TripDetailProps {
  tripId: string;
  onBack: () => void;
}

export default function TripDetail({ tripId, onBack }: TripDetailProps) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [tripId]);

  const loadData = async () => {
    try {
      const tripData = await tripService.getTripById(tripId);
      if (tripData) {
        setTrip(tripData);

        if (tripData.driverId) {
          const driverData = await driverService.getDriverById(tripData.driverId);
          setDriver(driverData);
        }

        if (tripData.vehicleId) {
          const vehicleData = await vehicleService.getVehicleById(
            tripData.vehicleId
          );
          setVehicle(vehicleData);
        }
      }
    } catch (error) {
      console.error('Error loading trip details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatVehicleType = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header title="Trip Details" onBack={onBack} />
        <LoadingSpinner />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header title="Trip Details" onBack={onBack} />
        <div className="px-6 py-12 text-center">
          <p className="text-slate-500">Trip not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <Header title="Trip Details" onBack={onBack} />

      <div className="px-6 py-6 space-y-5">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-slate-500 mb-1">Booking Reference</p>
              <p className="text-lg font-semibold text-slate-900">
                {trip.id.toUpperCase()}
              </p>
            </div>
            <StatusBadge status={trip.status} />
          </div>

          <div className="space-y-4 mt-6">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-slate-500">Pickup</p>
                <p className="text-slate-900 font-medium">{trip.pickupLocation}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-slate-500">Dropoff</p>
                <p className="text-slate-900 font-medium">
                  {trip.dropoffLocation}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Date</p>
                  <p className="text-sm font-medium text-slate-900">
                    {new Date(trip.scheduledDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Time</p>
                  <p className="text-sm font-medium text-slate-900">
                    {trip.scheduledTime}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-900 mb-4">
            Booking Information
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600">
                <Car className="w-5 h-5" />
                <span className="text-sm">Vehicle Type</span>
              </div>
              <span className="text-sm font-medium text-slate-900">
                {formatVehicleType(trip.vehicleType)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600">
                <Users className="w-5 h-5" />
                <span className="text-sm">Passengers</span>
              </div>
              <span className="text-sm font-medium text-slate-900">
                {trip.passengerCount}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600">
                <Briefcase className="w-5 h-5" />
                <span className="text-sm">Luggage</span>
              </div>
              <span className="text-sm font-medium text-slate-900">
                {trip.luggageCount} item{trip.luggageCount !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Trip Type</span>
              <span className="text-sm font-medium text-slate-900">
                {trip.tripType === 'one_way' ? 'One Way' : 'Return Trip'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Booking Type</span>
              <span className="text-sm font-medium text-slate-900">
                {trip.customerType === 'B2C' ? 'Personal' : 'Business'}
              </span>
            </div>
          </div>

          {trip.notes && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-500 mb-1">Special Notes</p>
              <p className="text-sm text-slate-900">{trip.notes}</p>
            </div>
          )}
        </div>

        {driver && vehicle && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-900 mb-4">
              Driver & Vehicle
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">Driver</p>
                <p className="text-slate-900 font-medium">{driver.name}</p>
                <div className="flex items-center gap-4 mt-2">
                  <a
                    href={`tel:${driver.phone}`}
                    className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700"
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </a>
                  <a
                    href={`mailto:${driver.email}`}
                    className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </a>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-500 mb-1">Vehicle</p>
                <p className="text-slate-900 font-medium">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  {vehicle.color} • {vehicle.licensePlate}
                </p>
              </div>
            </div>
          </div>
        )}

        {trip.estimatedFare && (
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white shadow-lg">
            <p className="text-slate-300 text-sm mb-2">
              {trip.status === 'completed' ? 'Final Fare' : 'Estimated Fare'}
            </p>
            <p className="text-3xl font-bold">${trip.estimatedFare}</p>
            {trip.status === 'completed' && (
              <div className="flex items-center gap-2 mt-3 text-green-400">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm">Paid</span>
              </div>
            )}
          </div>
        )}

        <div className="bg-slate-100 rounded-2xl p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Booked on</span>
            <span className="text-slate-900 font-medium">
              {new Date(trip.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
