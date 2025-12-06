
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Reservation, Plan, Transaction, PaymentMethod, Review, Notification } from './types';
import { PLANS, MOCK_REVIEWS, MOCK_RESTAURANTS } from './constants';

interface AppContextType {
  user: User;
  completeOnboarding: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  toggleStaffMode: () => void;
  reservations: Reservation[];
  addReservation: (res: Reservation) => void;
  
  // New Workflow Methods
  plans: Plan[];
  buyPlan: (planId: string, paymentMethod: PaymentMethod) => void;
  cancelSubscription: () => void;
  applyRetentionOffer: () => void;
  deductCredits: (amount: number) => boolean;
  addCredits: (amount: number, price: number, paymentMethod: PaymentMethod) => void;
  transactions: Transaction[];

  // Notifications
  notifications: Notification[];
  addNotification: (title: string, message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  markNotificationsAsRead: () => void;
  clearNotifications: () => void;

  // Reviews & Community
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date' | 'userName' | 'userAvatar'>) => void;
  getRestaurantRating: (restaurantId: string) => number;
  reportReview: (reviewId: string) => void; 

  // Scanner Control
  scanner: { isOpen: boolean; type: 'redeem' | 'validate'; dishId?: string; restaurantId?: string };
  openScanner: (type: 'redeem' | 'validate', restaurantId?: string, dishId?: string) => void;
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
  credits: 5, // Dando alguns créditos iniciais para facilitar testes
  referralCode: 'ALEX2024',
  isRestaurantStaff: false,
  avatar: 'https://picsum.photos/100/100?random=50',
  subscriptionStatus: 'none',
  hasSeenOnboarding: false,
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    // Tenta recuperar estado do onboarding
    if (typeof window !== 'undefined') {
        const hasSeen = localStorage.getItem('dishpass-onboarding') === 'true';
        return { ...INITIAL_USER, hasSeenOnboarding: hasSeen };
    }
    return INITIAL_USER;
  });

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  // Notifications State with Persistence
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dishpass-notifications');
      if (saved) return JSON.parse(saved);
    }
    return [
      {
        id: 'welcome_msg',
        title: 'Bem-vindo ao DISHpass!',
        message: 'Você ganhou acesso ao plano Experiência. Aproveite seus créditos.',
        type: 'info',
        date: new Date().toISOString(),
        read: false
      }
    ];
  });

  // Save notifications
  useEffect(() => {
    localStorage.setItem('dishpass-notifications', JSON.stringify(notifications));
  }, [notifications]);

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
  const [scanner, setScanner] = useState<{ isOpen: boolean; type: 'redeem' | 'validate'; dishId?: string; restaurantId?: string }>({ 
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

  // Listen for System Changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('dishpass-theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    requestUserLocation();

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleStaffMode = () => {
    setUser(prev => ({ ...prev, isRestaurantStaff: !prev.isRestaurantStaff }));
  };

  const completeOnboarding = () => {
    setUser(prev => ({ ...prev, hasSeenOnboarding: true }));
    localStorage.setItem('dishpass-onboarding', 'true');
  };

  const addReservation = (res: Reservation) => {
    setReservations(prev => [...prev, res]);
    addNotification('Reserva Confirmada', `Sua reserva em ${res.restaurantName} foi realizada.`, 'success');
  };

  // --- NOTIFICATION HELPERS ---
  const addNotification = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      message,
      type,
      date: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // 3.1 & 3.2 Workflow: Buy Plan (Initial or Upsell)
  const buyPlan = (planId: string, paymentMethod: PaymentMethod) => {
    const plan = PLANS.find(p => p.id === planId);
    if (!plan) return;

    const isNewSubscription = user.subscriptionStatus === 'none' || user.subscriptionStatus === 'cancelled';

    // Se for assinatura nova, define data de hoje + duração.
    // Se for troca de plano, MANTÉM a data de renovação atual (ciclo vigente).
    let nextBillingDate = user.nextBillingDate;
    
    if (isNewSubscription) {
        const d = new Date();
        d.setDate(d.getDate() + plan.durationDays);
        nextBillingDate = d.toISOString();
    }

    // Determine Status
    const newStatus = plan.id === 'exp_unique' ? 'trial' : 'active';
    const renewalPlanId = plan.renewalPlanId || plan.id;
    const renewalPlan = PLANS.find(p => p.id === renewalPlanId);

    setUser(prev => ({
      ...prev,
      credits: isNewSubscription ? prev.credits + plan.credits : prev.credits, 
      currentPlanId: plan.id,
      subscriptionStatus: newStatus,
      nextBillingDate: nextBillingDate,
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
      type: 'purchase',
      paymentMethod
    };
    setTransactions(prev => [newTx, ...prev]);

    // TRIGGER NOTIFICATION
    if (isNewSubscription) {
      addNotification('Plano Ativado!', `Você assinou o plano ${plan.name} com sucesso. ${plan.credits} créditos adicionados.`, 'success');
    } else {
      addNotification('Troca de Plano', `Seu plano foi atualizado para ${plan.name}.`, 'success');
    }
  };

  const cancelSubscription = () => {
    setUser(prev => ({
      ...prev,
      subscriptionStatus: 'cancelled',
      nextBillingDate: undefined,
      nextBillingAmount: undefined,
    }));
    addNotification('Assinatura Cancelada', 'Sua assinatura foi cancelada. Sentiremos sua falta.', 'warning');
  };

  const applyRetentionOffer = () => {
    if (user.nextBillingAmount) {
        setUser(prev => ({
            ...prev,
            nextBillingAmount: prev.nextBillingAmount ? prev.nextBillingAmount * 0.7 : undefined // 30% OFF
        }));
        addNotification('Oferta Aplicada!', 'Desconto de 30% aplicado na próxima renovação.', 'success');
    }
  };

  const deductCredits = (amount: number) => {
    if (user.credits >= amount) {
      setUser(prev => ({ ...prev, credits: prev.credits - amount }));
      addNotification('Crédito Utilizado', `Você usou ${amount} crédito(s). Bom apetite!`, 'success');
      return true;
    }
    addNotification('Saldo Insuficiente', 'Você não possui créditos suficientes para esta operação.', 'error');
    return false;
  };

  const addCredits = (amount: number, price: number, paymentMethod: PaymentMethod) => {
    setUser(prev => ({ ...prev, credits: prev.credits + amount }));
    
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      planName: `Pacote Avulso (${amount} un)`,
      amount: price,
      date: new Date().toISOString(),
      type: 'credits_refill',
      paymentMethod
    };
    setTransactions(prev => [newTx, ...prev]);
    addNotification('Créditos Adicionados', `Compra de ${amount} créditos realizada com sucesso.`, 'success');
  };

  // --- REVIEWS LOGIC ---

  const addReview = (reviewData: Omit<Review, 'id' | 'date' | 'userName' | 'userAvatar'>) => {
     const newReview: Review = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString(), // "Agora"
        userName: user.name,
        userAvatar: user.avatar,
        ...reviewData,
     };
     setReviews(prev => [newReview, ...prev]);
     addNotification('Avaliação Publicada', 'Obrigado por compartilhar sua experiência com a comunidade!', 'success');
  };

  // Calcula a média ponderada do restaurante (Mock Base + Reviews Reais)
  const getRestaurantRating = (restaurantId: string) => {
     const restaurant = MOCK_RESTAURANTS.find(r => r.id === restaurantId);
     const restaurantReviews = reviews.filter(r => r.restaurantId === restaurantId && !r.isHidden);
     
     if (!restaurant) return 0;
     
     // Se não tem reviews novas, usa a do mock
     if (restaurantReviews.length === 0) return restaurant.rating;

     const totalStars = restaurantReviews.reduce((acc, curr) => acc + curr.rating, 0);
     const avgReviews = totalStars / restaurantReviews.length;
     
     // Média simples entre a nota original (histórica) e as novas (recentes)
     // Num sistema real, seria tudo recalculado do zero.
     return parseFloat(((restaurant.rating + avgReviews) / 2).toFixed(1));
  };

  // Admin Policy: Hide review
  const reportReview = (reviewId: string) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, isHidden: true } : r));
  };

  // Scanner Actions
  const openScanner = (type: 'redeem' | 'validate', restaurantId?: string, dishId?: string) => {
    setScanner({ isOpen: true, type, restaurantId, dishId });
  };
  
  const closeScanner = () => {
    setScanner(prev => ({ ...prev, isOpen: false, restaurantId: undefined, dishId: undefined }));
  };

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
              resolve(); 
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
          );
      });
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      completeOnboarding,
      theme,
      toggleTheme,
      toggleStaffMode,
      reservations,
      addReservation,
      plans: PLANS,
      buyPlan,
      cancelSubscription,
      applyRetentionOffer,
      deductCredits,
      addCredits,
      transactions,
      notifications,
      addNotification,
      markNotificationsAsRead,
      clearNotifications,
      reviews,
      addReview,
      getRestaurantRating,
      reportReview,
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
