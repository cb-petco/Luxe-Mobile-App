import { useEffect, useState } from 'react';
import { Trip, Vehicle } from '../../types';
import { tripService } from '../../services/tripService';
import { vehicleService } from '../../services/vehicleService';
import { useApp } from '../../context/AppContext';
import Header from '../../components/Header';
import StatusBadge from '../../components/StatusBadge';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Briefcase,
  Car,
  Phone,
} from 'lucide-react';

interface DriverJobDetailProps {
  tripId: string;
  onBack: () => void;
}

export default function DriverJobDetail({ tripId, onBack }: DriverJobDetailProps) {
  const { currentDriverId, triggerRefresh } = useApp();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [tripId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const tripData = await tripService.getTripById(tripId);
      if (tripData) {
        setTrip(tripData);

        if (tripData.vehicleId) {
          const vehicleData = await vehicleService.getVehicleById(
            tripData.vehicleId
          );
          setVehicle(vehicleData);
        }
      }
    } catch (error) {
      console.error('Error loading job details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptJob = async () => {
    if (!trip) return;
    setActionLoading(true);
    try {
      await tripService.acceptJob(trip.id, currentDriverId);
      await loadData();
      triggerRefresh();
    } catch (error) {
      console.error('Error accepting job:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: any) => {
    if (!trip) return;
    setActionLoading(true);
    try {
      await tripService.updateTripStatus(trip.id, newStatus);
      await loadData();
      triggerRefresh();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const renderActions = () => {
    if (!trip) return null;

    switch (trip.status) {
      case 'pending':
        return (
          <Button
            variant="primary"
            fullWidth
            onClick={handleAcceptJob}
            loading={actionLoading}
          >
            Accept Job
          </Button>
        );

      case 'confirmed':
      case 'driver_assigned':
        return (
          <Button
            variant="primary"
            fullWidth
            onClick={() => handleUpdateStatus('en_route')}
            loading={actionLoading}
          >
            Start En Route
          </Button>
        );

      case 'en_route':
        return (
          <Button
            variant="primary"
            fullWidth
            onClick={() => handleUpdateStatus('in_progress')}
            loading={actionLoading}
          >
            Start Trip
          </Button>
        );

      case 'in_progress':
        return (
          <Button
            variant="secondary"
            fullWidth
            onClick={() => handleUpdateStatus('completed')}
            loading={actionLoading}
          >
            Complete Trip
          </Button>
        );

      case 'completed':
        return (
          <div className="bg-green-50 rounded-xl p-4 border border-green-200 text-center">
            <p className="text-green-900 font-medium">Trip Completed</p>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header title="Job Details" onBack={onBack} />
        <LoadingSpinner />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header title="Job Details" onBack={onBack} />
        <div className="px-6 py-12 text-center">
          <p className="text-slate-500">Job not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <Header title="Job Details" onBack={onBack} />

      <div className="px-6 py-6 space-y-5">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-start justify-between mb-4">
            <StatusBadge status={trip.status} />
            <span className="text-xs text-slate-500">#{trip.id}</span>
          </div>

          <div className="space-y-4 mt-6">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-slate-500">Pickup Location</p>
                <p className="text-slate-900 font-medium">{trip.pickupLocation}</p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(trip.pickupLocation)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-amber-600 hover:text-amber-700 mt-1 inline-block"
                >
                  Open in Maps
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-slate-500">Dropoff Location</p>
                <p className="text-slate-900 font-medium">
                  {trip.dropoffLocation}
                </p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(trip.dropoffLocation)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-amber-600 hover:text-amber-700 mt-1 inline-block"
                >
                  Open in Maps
                </a>
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
          <h3 className="font-semibold text-slate-900 mb-4">Trip Information</h3>

          <div className="space-y-3">
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
          </div>

          {trip.notes && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-500 mb-1">Special Notes</p>
              <p className="text-sm text-slate-900">{trip.notes}</p>
            </div>
          )}
        </div>

        {vehicle && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-900 mb-4">
              Assigned Vehicle
            </h3>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-slate-600" />
              </div>
              <div className="flex-1">
                <p className="text-slate-900 font-medium">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </p>
                <p className="text-sm text-slate-600">
                  {vehicle.color} • {vehicle.licensePlate}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-900 mb-4">
            Customer Contact
          </h3>

          <div className="flex items-center gap-3">
            <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-900 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
              <Phone className="w-5 h-5" />
              Call Customer
            </button>
          </div>
        </div>

        {trip.estimatedFare && (
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white shadow-lg">
            <p className="text-slate-300 text-sm mb-2">Estimated Fare</p>
            <p className="text-3xl font-bold">${trip.estimatedFare}</p>
          </div>
        )}

        {renderActions()}
      </div>
    </div>
  );
}
