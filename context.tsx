import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Reservation, Subscription } from './types';
import { MOCK_SUBSCRIPTIONS } from './constants';

interface AppContextType {
  user: User;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  toggleStaffMode: () => void;
  reservations: Reservation[];
  addReservation: (res: Reservation) => void;
  subscriptions: Subscription[];
  deductCredits: (amount: number) => boolean;
  addCredits: (amount: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_USER: User = {
  id: 'u1',
  name: 'Alex Johnson',
  email: 'alex@dishpass.com',
  credits: 125,
  referralCode: 'ALEX2024',
  isRestaurantStaff: false,
  avatar: 'https://picsum.photos/100/100?random=50'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [subscriptions] = useState<Subscription[]>(MOCK_SUBSCRIPTIONS);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleStaffMode = () => {
    setUser(prev => ({ ...prev, isRestaurantStaff: !prev.isRestaurantStaff }));
  };

  const addReservation = (res: Reservation) => {
    setReservations(prev => [...prev, res]);
  };

  const deductCredits = (amount: number) => {
    if (user.credits >= amount) {
      setUser(prev => ({ ...prev, credits: prev.credits - amount }));
      return true;
    }
    return false;
  };

  const addCredits = (amount: number) => {
    setUser(prev => ({ ...prev, credits: prev.credits + amount }));
  };

  return (
    <AppContext.Provider value={{
      user,
      theme,
      toggleTheme,
      toggleStaffMode,
      reservations,
      addReservation,
      subscriptions,
      deductCredits,
      addCredits
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};