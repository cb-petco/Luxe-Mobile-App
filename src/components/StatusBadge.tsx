import { TripStatus } from '../types';

interface StatusBadgeProps {
  status: TripStatus;
}

const statusConfig: Record<
  TripStatus,
  { label: string; bgColor: string; textColor: string }
> = {
  pending: {
    label: 'Pending',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-800',
  },
  confirmed: {
    label: 'Confirmed',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
  },
  driver_assigned: {
    label: 'Driver Assigned',
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-800',
  },
  en_route: {
    label: 'En Route',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
  },
  in_progress: {
    label: 'In Progress',
    bgColor: 'bg-teal-100',
    textColor: 'text-teal-800',
  },
  completed: {
    label: 'Completed',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
  },
  cancelled: {
    label: 'Cancelled',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}
    >
      {config.label}
    </span>
  );
}
