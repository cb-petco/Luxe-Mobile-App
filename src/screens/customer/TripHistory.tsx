import { useEffect, useState } from 'react';
import { Trip } from '../../types';
import { tripService } from '../../services/tripService';
import { useApp } from '../../context/AppContext';
import BottomNav from '../../components/BottomNav';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface TripHistoryProps {
  onNavigate: (screen: string, tripId?: string) => void;
  onBottomNavChange: (tab: 'home' | 'history' | 'notifications' | 'profile') => void;
}

export default function TripHistory({ onNavigate, onBottomNavChange }: TripHistoryProps) {
  const { currentCustomerId, refreshTrigger } = useApp();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrips();
  }, [currentCustomerId, refreshTrigger]);

  const loadTrips = async () => {
    setLoading(true);
    try {
      const data = await tripService.getAllTrips(currentCustomerId);
      setTrips(data);
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="px-6 pt-8 pb-6">
          <h1 className="text-2xl font-bold text-slate-900">Trip History</h1>
        </div>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="px-6 pt-8 pb-6">
        <h1 className="text-2xl font-bold text-slate-900">Trip History</h1>
        <p className="text-slate-600 mt-1">{trips.length} total trips</p>
      </div>

      <div className="px-6 space-y-3 pb-8">
        {trips.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
            <p className="text-slate-500">No trips yet</p>
          </div>
        ) : (
          trips.map(trip => (
            <div
              key={trip.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 active:scale-[0.98] transition-transform cursor-pointer"
              onClick={() => onNavigate('trip-detail', trip.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <StatusBadge status={trip.status} />
                <span className="text-xs text-slate-500">#{trip.id}</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-500">Pickup</p>
                    <p className="text-slate-900 font-medium">
                      {trip.pickupLocation}
                    </p>
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

                <div className="flex items-center gap-6 pt-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4" />
                    {new Date(trip.scheduledDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4" />
                    {trip.scheduledTime}
                  </div>
                </div>

                {trip.estimatedFare && (
                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-sm text-slate-900 font-semibold">
                      ${trip.estimatedFare}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav active="history" onNavigate={onBottomNavChange} />
    </div>
  );
}
