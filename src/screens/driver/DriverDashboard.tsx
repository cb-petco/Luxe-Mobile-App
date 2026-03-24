import { useEffect, useState } from 'react';
import { Trip, Driver } from '../../types';
import { tripService } from '../../services/tripService';
import { driverService } from '../../services/driverService';
import { useApp } from '../../context/AppContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import { Calendar, Clock, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

interface DriverDashboardProps {
  onNavigate: (screen: string, tripId?: string) => void;
}

export default function DriverDashboard({ onNavigate }: DriverDashboardProps) {
  const { currentDriverId, refreshTrigger } = useApp();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [currentDriverId, refreshTrigger]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [driverData, tripsData] = await Promise.all([
        driverService.getDriverById(currentDriverId),
        tripService.getDriverTrips(currentDriverId),
      ]);

      setDriver(driverData);
      setTrips(tripsData);
    } catch (error) {
      console.error('Error loading driver data:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeTrip = trips.find(t =>
    ['en_route', 'in_progress'].includes(t.status)
  );

  const todayTrips = trips.filter(t => {
    const tripDate = new Date(t.scheduledDate).toDateString();
    const today = new Date().toDateString();
    return tripDate === today && ['confirmed', 'driver_assigned'].includes(t.status);
  });

  const pendingTrips = trips.filter(t => t.status === 'pending');

  const completedToday = trips.filter(t => {
    const tripDate = new Date(t.scheduledDate).toDateString();
    const today = new Date().toDateString();
    return tripDate === today && t.status === 'completed';
  }).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-6 pt-8 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-white text-2xl font-bold mb-1">
              Welcome, {driver?.name.split(' ')[0]}
            </h2>
            <p className="text-slate-300">Driver Dashboard</p>
          </div>
          <button
            onClick={() => onNavigate('driver-availability')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              driver?.available
                ? 'bg-green-500 text-white'
                : 'bg-slate-600 text-slate-200'
            }`}
          >
            {driver?.available ? 'Available' : 'Unavailable'}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{todayTrips.length}</p>
            <p className="text-slate-300 text-xs mt-1">Scheduled</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{completedToday}</p>
            <p className="text-slate-300 text-xs mt-1">Completed</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{pendingTrips.length}</p>
            <p className="text-slate-300 text-xs mt-1">Pending</p>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6 space-y-6">
        {activeTrip && (
          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              Active Trip
            </h3>
            <div
              className="bg-gradient-to-br from-amber-600 to-amber-500 rounded-2xl p-5 shadow-lg text-white cursor-pointer active:scale-[0.98] transition-transform"
              onClick={() => onNavigate('driver-job-detail', activeTrip.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                  {activeTrip.status === 'en_route' ? 'En Route' : 'In Progress'}
                </span>
                <span className="text-xs opacity-90">#{activeTrip.id}</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 opacity-90" />
                  <div className="flex-1">
                    <p className="text-sm opacity-90">Pickup</p>
                    <p className="font-medium">{activeTrip.pickupLocation}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 opacity-90" />
                  <div className="flex-1">
                    <p className="text-sm opacity-90">Dropoff</p>
                    <p className="font-medium">{activeTrip.dropoffLocation}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-slate-900">
              Today's Schedule
            </h3>
            <button
              onClick={() => onNavigate('driver-jobs')}
              className="text-sm text-amber-600 font-medium hover:text-amber-700"
            >
              View All
            </button>
          </div>

          {todayTrips.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-100">
              <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No trips scheduled for today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayTrips.map(trip => (
                <div
                  key={trip.id}
                  className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 active:scale-[0.98] transition-transform cursor-pointer"
                  onClick={() => onNavigate('driver-job-detail', trip.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <StatusBadge status={trip.status} />
                    <span className="text-xs text-slate-500">
                      {trip.scheduledTime}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                      <p className="text-sm text-slate-900 font-medium">
                        {trip.pickupLocation}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                      <p className="text-sm text-slate-600">
                        {trip.dropoffLocation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {pendingTrips.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">
              Available Jobs
            </h3>
            <div className="space-y-3">
              {pendingTrips.slice(0, 2).map(trip => (
                <div
                  key={trip.id}
                  className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 active:scale-[0.98] transition-transform cursor-pointer"
                  onClick={() => onNavigate('driver-job-detail', trip.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <StatusBadge status={trip.status} />
                    <span className="text-xs text-slate-500">#{trip.id}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(trip.scheduledDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {trip.scheduledTime}
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                      <p className="text-sm text-slate-900 font-medium">
                        {trip.pickupLocation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
