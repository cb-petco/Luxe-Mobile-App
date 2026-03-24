import { createContext, useContext, useState, ReactNode } from 'react';
import { UserMode, Trip } from '../types';
import { mockCustomer, mockDrivers } from '../data/mockData';

interface AppContextType {
  userMode: UserMode | null;
  setUserMode: (mode: UserMode | null) => void;
  currentCustomerId: string;
  currentDriverId: string;
  currentTrip: Trip | null;
  setCurrentTrip: (trip: Trip | null) => void;
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userMode, setUserMode] = useState<UserMode | null>(null);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <AppContext.Provider
      value={{
        userMode,
        setUserMode,
        currentCustomerId: mockCustomer.id,
        currentDriverId: mockDrivers[0].id,
        currentTrip,
        setCurrentTrip,
        refreshTrigger,
        triggerRefresh,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
