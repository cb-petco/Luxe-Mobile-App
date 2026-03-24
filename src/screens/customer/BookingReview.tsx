import { useState } from 'react';
import { BookingRequest } from '../../types';
import Header from '../../components/Header';
import Button from '../../components/Button';
import { Calendar, Clock, MapPin, Users, Briefcase, Car } from 'lucide-react';

interface BookingReviewProps {
  booking: BookingRequest;
  onBack: () => void;
  onConfirm: () => void;
}

export default function BookingReview({
  booking,
  onBack,
  onConfirm,
}: BookingReviewProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  const formatVehicleType = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const estimatedFare = () => {
    const baseRates: Record<string, number> = {
      sedan: 75,
      executive_sedan: 125,
      suv: 95,
      luxury_suv: 150,
      van: 110,
      executive_van: 175,
    };
    return baseRates[booking.vehicleType] || 100;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="Review Booking" onBack={onBack} />

      <div className="px-6 py-6 space-y-5 pb-24">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-slate-300 text-sm mb-2">Estimated Fare</p>
          <p className="text-4xl font-bold">${estimatedFare()}</p>
          <p className="text-slate-300 text-sm mt-2">
            Final price confirmed after completion
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
          <h3 className="font-semibold text-slate-900 mb-3">Trip Details</h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-slate-500">Pickup</p>
                <p className="text-slate-900 font-medium">
                  {booking.pickupLocation}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-slate-500">Dropoff</p>
                <p className="text-slate-900 font-medium">
                  {booking.dropoffLocation}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Date</p>
                  <p className="text-sm font-medium text-slate-900">
                    {new Date(booking.date).toLocaleDateString('en-US', {
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
                    {booking.time}
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
                {formatVehicleType(booking.vehicleType)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600">
                <Users className="w-5 h-5" />
                <span className="text-sm">Passengers</span>
              </div>
              <span className="text-sm font-medium text-slate-900">
                {booking.passengerCount}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600">
                <Briefcase className="w-5 h-5" />
                <span className="text-sm">Luggage</span>
              </div>
              <span className="text-sm font-medium text-slate-900">
                {booking.luggageCount} item{booking.luggageCount !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Trip Type</span>
              <span className="text-sm font-medium text-slate-900">
                {booking.tripType === 'one_way' ? 'One Way' : 'Return Trip'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Booking Type</span>
              <span className="text-sm font-medium text-slate-900">
                {booking.customerType === 'B2C' ? 'Personal' : 'Business'}
              </span>
            </div>
          </div>

          {booking.notes && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-500 mb-1">Special Notes</p>
              <p className="text-sm text-slate-900">{booking.notes}</p>
            </div>
          )}
        </div>

        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
          <p className="text-sm text-amber-900">
            A driver will be assigned shortly after your booking is confirmed. You
            will receive a notification once confirmed.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            variant="primary"
            fullWidth
            onClick={handleConfirm}
            loading={loading}
          >
            Confirm Booking
          </Button>
          <Button variant="outline" fullWidth onClick={onBack}>
            Edit Details
          </Button>
        </div>
      </div>
    </div>
  );
}
