import { useEffect, useState } from 'react';
import { Plus, Calendar, Clock, MapPin } from 'lucide-react';
import { Trip } from '../../types';
import { tripService } from '../../services/tripService';
import { useApp } from '../../context/AppContext';
import BottomNav from '../../components/BottomNav';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

interface CustomerHomeProps {
  onNavigate: (screen: string) => void;
  onBottomNavChange: (tab: 'home' | 'history' | 'notifications' | 'profile') => void;
}

export default function CustomerHome({ onNavigate, onBottomNavChange }: CustomerHomeProps) {
  const { currentCustomerId, refreshTrigger } = useApp();
  const [upcomingTrip, setUpcomingTrip] = useState<Trip | null>(null);
  const [recentTrips, setRecentTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [currentCustomerId, refreshTrigger]);

  const loadData = async () => {
    setLoading(true);
    try {
      const trips = await tripService.getAllTrips(currentCustomerId);

      const upcoming = trips.find(
        t => ['pending', 'confirmed', 'driver_assigned'].includes(t.status)
      );
      setUpcomingTrip(upcoming || null);

      const recent = trips.filter(t => t.status === 'completed').slice(0, 3);
      setRecentTrips(recent);
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-6 pt-8 pb-8 rounded-b-3xl shadow-lg">
        <h2 className="text-white text-2xl font-bold mb-1">Welcome Back</h2>
        <p className="text-slate-300">James Anderson</p>
      </div>

      <div className="px-6 -mt-4">
        <button
          onClick={() => onNavigate('request-trip')}
          className="w-full bg-amber-600 hover:bg-amber-500 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-200 active:scale-95 shadow-lg flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Request New Trip
        </button>
      </div>

      <div className="px-6 mt-8 space-y-6">
        {upcomingTrip && (
          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">
              Upcoming Trip
            </h3>
            <div
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 active:scale-[0.98] transition-transform cursor-pointer"
              onClick={() => {
                onNavigate('trip-detail');
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <StatusBadge status={upcomingTrip.status} />
                <span className="text-xs text-slate-500">
                  #{upcomingTrip.id}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-500">Pickup</p>
                    <p className="text-slate-900 font-medium">
                      {upcomingTrip.pickupLocation}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-500">Dropoff</p>
                    <p className="text-slate-900 font-medium">
                      {upcomingTrip.dropoffLocation}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4" />
                    {new Date(upcomingTrip.scheduledDate).toLocaleDateString(
                      'en-US',
                      { month: 'short', day: 'numeric' }
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4" />
                    {upcomingTrip.scheduledTime}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-slate-900">
              Recent Trips
            </h3>
            {recentTrips.length > 0 && (
              <button
                onClick={() => onBottomNavChange('history')}
                className="text-sm text-amber-600 font-medium hover:text-amber-700"
              >
                View All
              </button>
            )}
          </div>

          {recentTrips.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-100">
              <p className="text-slate-500">No recent trips</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTrips.map(trip => (
                <div
                  key={trip.id}
                  className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 active:scale-[0.98] transition-transform cursor-pointer"
                  onClick={() => {
                    onNavigate('trip-detail');
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-medium text-slate-900">
                      {trip.pickupLocation}
                    </p>
                    <StatusBadge status={trip.status} />
                  </div>
                  <p className="text-sm text-slate-500 mb-2">
                    to {trip.dropoffLocation}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-600">
                    <span>
                      {new Date(trip.scheduledDate).toLocaleDateString()}
                    </span>
                    <span>{trip.scheduledTime}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <BottomNav active="home" onNavigate={onBottomNavChange} />
    </div>
  );
}
