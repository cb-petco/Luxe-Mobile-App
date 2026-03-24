import { useEffect, useState } from 'react';
import { Driver } from '../../types';
import { driverService } from '../../services/driverService';
import { useApp } from '../../context/AppContext';
import Header from '../../components/Header';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Clock, Calendar, CheckCircle2 } from 'lucide-react';

interface DriverAvailabilityProps {
  onBack: () => void;
}

export default function DriverAvailability({ onBack }: DriverAvailabilityProps) {
  const { currentDriverId, triggerRefresh } = useApp();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadDriver();
  }, [currentDriverId]);

  const loadDriver = async () => {
    setLoading(true);
    try {
      const data = await driverService.getDriverById(currentDriverId);
      setDriver(data);
    } catch (error) {
      console.error('Error loading driver:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async () => {
    if (!driver) return;

    setUpdating(true);
    try {
      await driverService.updateAvailability(driver.id, !driver.available);
      await loadDriver();
      triggerRefresh();
    } catch (error) {
      console.error('Error updating availability:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header title="Availability" onBack={onBack} />
        <LoadingSpinner />
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header title="Availability" onBack={onBack} />
        <div className="px-6 py-12 text-center">
          <p className="text-slate-500">Driver not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      <Header title="Availability" onBack={onBack} />

      <div className="px-6 py-6 space-y-6">
        <div
          className={`rounded-2xl p-6 shadow-sm border-2 ${
            driver.available
              ? 'bg-green-50 border-green-200'
              : 'bg-slate-100 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {driver.available ? (
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              ) : (
                <Clock className="w-8 h-8 text-slate-400" />
              )}
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {driver.available ? 'Available' : 'Unavailable'}
                </h3>
                <p className="text-sm text-slate-600">
                  {driver.available
                    ? 'You can receive new job assignments'
                    : 'You will not receive new job assignments'}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleToggleAvailability}
            disabled={updating}
            className={`w-full px-6 py-3 rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 ${
              driver.available
                ? 'bg-slate-700 hover:bg-slate-800 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {updating
              ? 'Updating...'
              : driver.available
              ? 'Mark as Unavailable'
              : 'Mark as Available'}
          </button>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-900 mb-4">
            Availability Tips
          </h3>

          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-amber-600 text-xs font-bold">1</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  Turn on availability during your working hours
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  This ensures you receive job assignments when you're ready to
                  work
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-amber-600 text-xs font-bold">2</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  Turn off during breaks
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  Prevent new assignments when you're taking a break or done for
                  the day
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-amber-600 text-xs font-bold">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  Complete existing trips first
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  Your availability status doesn't affect trips you've already
                  accepted
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-100 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-slate-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-900 mb-1">
                Schedule Management
              </p>
              <p className="text-sm text-slate-600">
                Advanced scheduling features coming soon. Contact dispatch to
                manage your schedule in advance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
