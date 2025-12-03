
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Reservation, Plan, Transaction } from './types';
import { PLANS } from './constants';

interface AppContextType {
  user: User;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  toggleStaffMode: () => void;
  reservations: Reservation[];
  addReservation: (res: Reservation) => void;
  
  // New Workflow Methods
  plans: Plan[];
  buyPlan: (planId: string) => void;
  cancelSubscription: () => void;
  deductCredits: (amount: number) => boolean;
  addCredits: (amount: number) => void;
  transactions: Transaction[];

  // Scanner Control
  scanner: { isOpen: boolean; type: 'redeem' | 'validate' };
  openScanner: (type: 'redeem' | 'validate') => void;
  closeScanner: () => void;

  // Geolocation
  userLocation: { lat: number; lng: number } | null;
  requestUserLocation: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial user state adjusted for the "Funnel" demo (No plan initially)
const INITIAL_USER: User = {
  id: 'u1',
  name: 'Alex Johnson',
  email: 'alex@dishpass.com',
  credits: 0, 
  referralCode: 'ALEX2024',
  isRestaurantStaff: false,
  avatar: 'https://picsum.photos/100/100?random=50',
  subscriptionStatus: 'none',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  // Theme Logic with System Detection & Persistence
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // 1. Check LocalStorage
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('dishpass-theme');
      if (savedTheme) return savedTheme as 'light' | 'dark';

      // 2. Check System Preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });
  
  // Scanner State
  const [scanner, setScanner] = useState<{ isOpen: boolean; type: 'redeem' | 'validate' }>({ 
    isOpen: false, 
    type: 'redeem' 
  });

  // Apply Theme Effect
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('dishpass-theme', theme);
  }, [theme]);

  // Listen for System Changes (if no manual override is set)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't manually set a preference in this session's logic
      // OR you can decide to always respect system if "Auto" mode existed. 
      // Here we prioritize checking if LS is empty implies "Auto" behavior.
      if (!localStorage.getItem('dishpass-theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    // Initial location request
    requestUserLocation();

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleStaffMode = () => {
    setUser(prev => ({ ...prev, isRestaurantStaff: !prev.isRestaurantStaff }));
  };

  const addReservation = (res: Reservation) => {
    setReservations(prev => [...prev, res]);
  };

  // 3.1 & 3.2 Workflow: Buy Plan (Initial or Upsell)
  const buyPlan = (planId: string) => {
    const plan = PLANS.find(p => p.id === planId);
    if (!plan) return;

    // Calculate Next Billing Date
    const nextBilling = new Date();
    nextBilling.setDate(nextBilling.getDate() + plan.durationDays);

    // Determine Status (Trial vs Active)
    const newStatus = plan.id === 'exp_unique' ? 'trial' : 'active';

    // Find the renewal plan for the *next* cycle to set the correct next billing amount
    const renewalPlanId = plan.renewalPlanId || plan.id;
    const renewalPlan = PLANS.find(p => p.id === renewalPlanId);

    setUser(prev => ({
      ...prev,
      credits: prev.credits + plan.credits, // 2. Allocation of Credits
      currentPlanId: plan.id,
      subscriptionStatus: newStatus,
      nextBillingDate: nextBilling.toISOString(), // 3. Set Date
      nextBillingAmount: renewalPlan ? renewalPlan.price : plan.price,
    }));

    // 4. Register Transaction
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      planId: plan.id,
      planName: plan.name,
      amount: plan.price,
      date: new Date().toISOString(),
      type: 'purchase'
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  // 3.2 Cancellation
  const cancelSubscription = () => {
    setUser(prev => ({
      ...prev,
      subscriptionStatus: 'cancelled',
      nextBillingDate: undefined,
      nextBillingAmount: undefined,
    }));
  };

  // 3.4 Workflow: Consumo de Crédito
  const deductCredits = (amount: number) => {
    if (user.credits >= amount) {
      setUser(prev => ({ ...prev, credits: prev.credits - amount }));
      return true;
    }
    return false;
  };

  // Helper for admin/debug
  const addCredits = (amount: number) => {
    setUser(prev => ({ ...prev, credits: prev.credits + amount }));
  };

  // Scanner Actions
  const openScanner = (type: 'redeem' | 'validate') => {
    setScanner({ isOpen: true, type });
  };
  
  const closeScanner = () => {
    setScanner(prev => ({ ...prev, isOpen: false }));
  };

  // Geolocation Service
  const requestUserLocation = async () => {
    if ('geolocation' in navigator) {
      return new Promise<void>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setUserLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude
              });
              resolve();
            },
            (error) => {
              console.log("Error getting location", error);
              resolve(); // Resolve anyway to stop loading spinners
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
          );
      });
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      theme,
      toggleTheme,
      toggleStaffMode,
      reservations,
      addReservation,
      plans: PLANS,
      buyPlan,
      cancelSubscription,
      deductCredits,
      addCredits,
      transactions,
      scanner,
      openScanner,
      closeScanner,
      userLocation,
      requestUserLocation
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
