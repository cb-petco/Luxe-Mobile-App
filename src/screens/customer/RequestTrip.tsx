import { useState } from 'react';
import { BookingRequest } from '../../types';
import Header from '../../components/Header';
import Input from '../../components/Input';
import Select from '../../components/Select';
import TextArea from '../../components/TextArea';
import Button from '../../components/Button';

interface RequestTripProps {
  onBack: () => void;
  onSubmit: (request: BookingRequest) => void;
}

export default function RequestTrip({ onBack, onSubmit }: RequestTripProps) {
  const [formData, setFormData] = useState<BookingRequest>({
    pickupLocation: '',
    dropoffLocation: '',
    date: '',
    time: '',
    passengerCount: 1,
    luggageCount: 0,
    vehicleType: 'executive_sedan',
    tripType: 'one_way',
    notes: '',
    customerType: 'B2C',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const vehicleOptions = [
    { value: 'sedan', label: 'Sedan' },
    { value: 'executive_sedan', label: 'Executive Sedan' },
    { value: 'suv', label: 'SUV' },
    { value: 'luxury_suv', label: 'Luxury SUV' },
    { value: 'van', label: 'Van' },
    { value: 'executive_van', label: 'Executive Van' },
  ];

  const tripTypeOptions = [
    { value: 'one_way', label: 'One Way' },
    { value: 'return', label: 'Return Trip' },
  ];

  const customerTypeOptions = [
    { value: 'B2C', label: 'Personal Booking' },
    { value: 'B2B', label: 'Business Booking' },
  ];

  const passengerOptions = Array.from({ length: 8 }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1} Passenger${i > 0 ? 's' : ''}`,
  }));

  const luggageOptions = Array.from({ length: 10 }, (_, i) => ({
    value: String(i),
    label: i === 0 ? 'No Luggage' : `${i} Item${i > 1 ? 's' : ''}`,
  }));

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="Request Trip" onBack={onBack} />

      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5 pb-24">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
          <h3 className="font-semibold text-slate-900 mb-3">Trip Details</h3>

          <Input
            label="Pickup Location"
            placeholder="Enter pickup address"
            value={formData.pickupLocation}
            onChange={e =>
              setFormData({ ...formData, pickupLocation: e.target.value })
            }
            required
          />

          <Input
            label="Dropoff Location"
            placeholder="Enter destination address"
            value={formData.dropoffLocation}
            onChange={e =>
              setFormData({ ...formData, dropoffLocation: e.target.value })
            }
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              required
            />

            <Input
              label="Time"
              type="time"
              value={formData.time}
              onChange={e => setFormData({ ...formData, time: e.target.value })}
              required
            />
          </div>

          <Select
            label="Trip Type"
            options={tripTypeOptions}
            value={formData.tripType}
            onChange={e =>
              setFormData({
                ...formData,
                tripType: e.target.value as 'one_way' | 'return',
              })
            }
            required
          />
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
          <h3 className="font-semibold text-slate-900 mb-3">
            Passengers & Luggage
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Passengers"
              options={passengerOptions}
              value={String(formData.passengerCount)}
              onChange={e =>
                setFormData({
                  ...formData,
                  passengerCount: Number(e.target.value),
                })
              }
              required
            />

            <Select
              label="Luggage"
              options={luggageOptions}
              value={String(formData.luggageCount)}
              onChange={e =>
                setFormData({
                  ...formData,
                  luggageCount: Number(e.target.value),
                })
              }
              required
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
          <h3 className="font-semibold text-slate-900 mb-3">
            Vehicle & Booking Type
          </h3>

          <Select
            label="Vehicle Type"
            options={vehicleOptions}
            value={formData.vehicleType}
            onChange={e =>
              setFormData({
                ...formData,
                vehicleType: e.target.value as any,
              })
            }
            required
          />

          <Select
            label="Booking Type"
            options={customerTypeOptions}
            value={formData.customerType}
            onChange={e =>
              setFormData({
                ...formData,
                customerType: e.target.value as 'B2C' | 'B2B',
              })
            }
            required
          />
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <TextArea
            label="Special Notes"
            placeholder="Any special requests or instructions..."
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        <Button type="submit" variant="primary" fullWidth>
          Review Booking
        </Button>
      </form>
    </div>
  );
}
