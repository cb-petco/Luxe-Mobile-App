import { useEffect, useState } from 'react';
import { Trip } from '../../types';
import { tripService } from '../../services/tripService';
import { useApp } from '../../context/AppContext';
import Header from '../../components/Header';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface DriverJobsProps {
  onBack: () => void;
  onNavigate: (screen: string, tripId?: string) => void;
}

export default function DriverJobs({ onBack, onNavigate }: DriverJobsProps) {
  const { currentDriverId, refreshTrigger } = useApp();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'assigned' | 'active'>(
    'all'
  );

  useEffect(() => {
    loadTrips();
  }, [currentDriverId, refreshTrigger]);

  const loadTrips = async () => {
    setLoading(true);
    try {
      const data = await tripService.getDriverTrips(currentDriverId);
      setTrips(data);
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTrips = trips.filter(trip => {
    if (filter === 'pending') return trip.status === 'pending';
    if (filter === 'assigned')
      return ['confirmed', 'driver_assigned'].includes(trip.status);
    if (filter === 'active')
      return ['en_route', 'in_progress'].includes(trip.status);
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header title="All Jobs" onBack={onBack} />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      <Header title="All Jobs" onBack={onBack} />

      <div className="px-6 py-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { key: 'all', label: 'All' },
            { key: 'pending', label: 'Available' },
            { key: 'assigned', label: 'Assigned' },
            { key: 'active', label: 'Active' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === tab.key
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 space-y-3">
        {filteredTrips.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
            <p className="text-slate-500">No jobs found</p>
          </div>
        ) : (
          filteredTrips.map(trip => (
            <div
              key={trip.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 active:scale-[0.98] transition-transform cursor-pointer"
              onClick={() => onNavigate('driver-job-detail', trip.id)}
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
                    })}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4" />
                    {trip.scheduledTime}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
