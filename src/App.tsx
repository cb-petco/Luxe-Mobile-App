import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { BookingRequest } from './types';
import { tripService } from './services/tripService';
import { notificationService } from './services/notificationService';

import Welcome from './screens/Welcome';
import CustomerHome from './screens/customer/CustomerHome';
import RequestTrip from './screens/customer/RequestTrip';
import BookingReview from './screens/customer/BookingReview';
import TripStatus from './screens/customer/TripStatus';
import TripHistory from './screens/customer/TripHistory';
import TripDetail from './screens/customer/TripDetail';
import Notifications from './screens/customer/Notifications';
import Profile from './screens/customer/Profile';

import DriverDashboard from './screens/driver/DriverDashboard';
import DriverJobs from './screens/driver/DriverJobs';
import DriverJobDetail from './screens/driver/DriverJobDetail';
import DriverAvailability from './screens/driver/DriverAvailability';
import DriverNotifications from './screens/driver/DriverNotifications';

type CustomerScreen =
  | 'home'
  | 'request-trip'
  | 'booking-review'
  | 'trip-status'
  | 'trip-history'
  | 'trip-detail'
  | 'notifications'
  | 'profile';

type DriverScreen =
  | 'dashboard'
  | 'driver-jobs'
  | 'driver-job-detail'
  | 'driver-availability'
  | 'driver-notifications';

function AppContent() {
  const { userMode, currentCustomerId, triggerRefresh } = useApp();
  const [customerScreen, setCustomerScreen] = useState<CustomerScreen>('home');
  const [driverScreen, setDriverScreen] = useState<DriverScreen>('dashboard');
  const [bookingRequest, setBookingRequest] = useState<BookingRequest | null>(null);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  const handleRequestTripSubmit = (request: BookingRequest) => {
    setBookingRequest(request);
    setCustomerScreen('booking-review');
  };

  const handleBookingConfirm = async () => {
    if (!bookingRequest) return;

    try {
      const trip = await tripService.createTrip(currentCustomerId, bookingRequest);

      await notificationService.createNotification(
        currentCustomerId,
        'booking_confirmed',
        'Booking Confirmed',
        `Your trip on ${new Date(bookingRequest.date).toLocaleDateString()} at ${bookingRequest.time} has been submitted.`,
        trip.id
      );

      setSelectedTripId(trip.id);
      setBookingRequest(null);
      setCustomerScreen('trip-status');
      triggerRefresh();
    } catch (error) {
      console.error('Error creating trip:', error);
    }
  };

  const handleCustomerNavigate = (screen: string, tripId?: string) => {
    if (tripId) {
      setSelectedTripId(tripId);
    }
    setCustomerScreen(screen as CustomerScreen);
  };

  const handleDriverNavigate = (screen: string, tripId?: string) => {
    if (tripId) {
      setSelectedTripId(tripId);
    }
    setDriverScreen(screen as DriverScreen);
  };

  const handleBottomNavChange = (tab: 'home' | 'history' | 'notifications' | 'profile') => {
    const screenMap: Record<typeof tab, CustomerScreen> = {
      home: 'home',
      history: 'trip-history',
      notifications: 'notifications',
      profile: 'profile',
    };
    setCustomerScreen(screenMap[tab]);
  };

  if (!userMode) {
    return <Welcome />;
  }

  if (userMode === 'customer') {
    switch (customerScreen) {
      case 'home':
        return (
          <CustomerHome
            onNavigate={handleCustomerNavigate}
            onBottomNavChange={handleBottomNavChange}
          />
        );

      case 'request-trip':
        return (
          <RequestTrip
            onBack={() => setCustomerScreen('home')}
            onSubmit={handleRequestTripSubmit}
          />
        );

      case 'booking-review':
        return bookingRequest ? (
          <BookingReview
            booking={bookingRequest}
            onBack={() => setCustomerScreen('request-trip')}
            onConfirm={handleBookingConfirm}
          />
        ) : (
          <CustomerHome
            onNavigate={handleCustomerNavigate}
            onBottomNavChange={handleBottomNavChange}
          />
        );

      case 'trip-status':
        return selectedTripId ? (
          <TripStatus
            tripId={selectedTripId}
            onBack={() => setCustomerScreen('home')}
          />
        ) : (
          <CustomerHome
            onNavigate={handleCustomerNavigate}
            onBottomNavChange={handleBottomNavChange}
          />
        );

      case 'trip-history':
        return (
          <TripHistory
            onNavigate={handleCustomerNavigate}
            onBottomNavChange={handleBottomNavChange}
          />
        );

      case 'trip-detail':
        return selectedTripId ? (
          <TripDetail
            tripId={selectedTripId}
            onBack={() => setCustomerScreen('trip-history')}
          />
        ) : (
          <CustomerHome
            onNavigate={handleCustomerNavigate}
            onBottomNavChange={handleBottomNavChange}
          />
        );

      case 'notifications':
        return <Notifications onBottomNavChange={handleBottomNavChange} />;

      case 'profile':
        return <Profile onBottomNavChange={handleBottomNavChange} />;

      default:
        return (
          <CustomerHome
            onNavigate={handleCustomerNavigate}
            onBottomNavChange={handleBottomNavChange}
          />
        );
    }
  }

  if (userMode === 'driver') {
    switch (driverScreen) {
      case 'dashboard':
        return <DriverDashboard onNavigate={handleDriverNavigate} />;

      case 'driver-jobs':
        return (
          <DriverJobs
            onBack={() => setDriverScreen('dashboard')}
            onNavigate={handleDriverNavigate}
          />
        );

      case 'driver-job-detail':
        return selectedTripId ? (
          <DriverJobDetail
            tripId={selectedTripId}
            onBack={() => setDriverScreen('driver-jobs')}
          />
        ) : (
          <DriverDashboard onNavigate={handleDriverNavigate} />
        );

      case 'driver-availability':
        return (
          <DriverAvailability onBack={() => setDriverScreen('dashboard')} />
        );

      case 'driver-notifications':
        return (
          <DriverNotifications onBack={() => setDriverScreen('dashboard')} />
        );

      default:
        return <DriverDashboard onNavigate={handleDriverNavigate} />;
    }
  }

  return <Welcome />;
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
