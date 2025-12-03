
export interface Plan {
  id: string; // Internal ID (e.g., 'exp_unique', 'ess_weekly')
  name: string; // e.g., "Experiência"
  frequency: 'unique' | 'weekly' | 'monthly'; // Frequencia
  credits: number; // Creditos_Inclusos
  price: number; // Preco_Venda
  costPerCredit: number; // Repasse_Credito (Internal use)
  durationDays: number; // Dias_Duracao
  renewalPlanId?: string | null; // ID of the plan it renews to (if different)
  description?: string;
  isTrial?: boolean;
  discountPercent?: number;
}

export interface Transaction {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  amount: number;
  date: string;
  type: 'purchase' | 'renewal';
}

export interface User {
  id: string;
  name: string;
  email: string;
  credits: number; // Creditos_Disponiveis
  referralCode: string;
  isRestaurantStaff: boolean;
  avatar: string;
  
  // Subscription Fields
  subscriptionStatus: 'none' | 'trial' | 'active' | 'cancelled' | 'overdue';
  currentPlanId?: string;
  nextBillingDate?: string; // ISO Date
  nextBillingAmount?: number;
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  credits: number;
  image: string;
  calories: number;
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  address: string;
  category: string;
  rating: number;
  lat: number;
  lng: number;
  menu: Dish[];
  // Novos campos para detalhes avançados
  description: string;
  openingHours: string;
  services: string[]; // Ex: ['Wi-Fi', 'Pet Friendly', 'Ar Condicionado']
}

export interface Reservation {
  id: string;
  restaurantId: string;
  restaurantName: string;
  date: string;
  time: string;
  guests: number;
  status: 'confirmed' | 'pending' | 'completed';
}

export interface Referral {
  id: string;
  name: string;
  status: 'joined' | 'pending';
  date: string;
}

export interface Review {
  id: string;
  userName: string;
  dishName: string;
  rating: number;
  text: string;
  image: string;
  date: string;
}
