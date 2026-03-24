import { useEffect, useState } from 'react';
import { Trip, Driver, Vehicle } from '../../types';
import { tripService } from '../../services/tripService';
import { driverService } from '../../services/driverService';
import { vehicleService } from '../../services/vehicleService';
import { useApp } from '../../context/AppContext';
import Header from '../../components/Header';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import Button from '../../components/Button';
import { Calendar, Clock, MapPin, Phone, Mail, CheckCircle2 } from 'lucide-react';

interface TripStatusProps {
  tripId: string;
  onBack: () => void;
}

export default function TripStatus({ tripId, onBack }: TripStatusProps) {
  const { refreshTrigger } = useApp();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, [tripId, refreshTrigger]);

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
      console.error('Error loading trip status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusTimeline = () => {
    const statuses = [
      { key: 'pending', label: 'Pending' },
      { key: 'confirmed', label: 'Confirmed' },
      { key: 'driver_assigned', label: 'Driver Assigned' },
      { key: 'en_route', label: 'En Route' },
      { key: 'in_progress', label: 'In Progress' },
      { key: 'completed', label: 'Completed' },
    ];

    const currentIndex = statuses.findIndex(s => s.key === trip?.status);

    return statuses.map((status, index) => ({
      ...status,
      completed: index <= currentIndex,
      current: index === currentIndex,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header title="Trip Status" onBack={onBack} />
        <LoadingSpinner />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header title="Trip Status" onBack={onBack} />
        <div className="px-6 py-12 text-center">
          <p className="text-slate-500">Trip not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <Header title="Trip Status" onBack={onBack} />

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

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-900 mb-4">Status Timeline</h3>

          <div className="space-y-3">
            {getStatusTimeline().map((status, index) => (
              <div key={status.key} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      status.completed
                        ? 'bg-green-500'
                        : status.current
                        ? 'bg-amber-500'
                        : 'bg-slate-200'
                    }`}
                  >
                    {status.completed && (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    )}
                  </div>
                  {index < getStatusTimeline().length - 1 && (
                    <div
                      className={`w-0.5 h-6 mt-1 ${
                        status.completed ? 'bg-green-500' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p
                    className={`font-medium ${
                      status.current
                        ? 'text-slate-900'
                        : status.completed
                        ? 'text-slate-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {status.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {trip.estimatedFare && (
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white shadow-lg">
            <p className="text-slate-300 text-sm mb-2">Estimated Fare</p>
            <p className="text-3xl font-bold">${trip.estimatedFare}</p>
          </div>
        )}

        {['pending', 'confirmed'].includes(trip.status) && (
          <Button variant="outline" fullWidth>
            Cancel Booking
          </Button>
        )}
      </div>
    </div>
  );
}
