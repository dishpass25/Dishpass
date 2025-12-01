export interface User {
  id: string;
  name: string;
  email: string;
  credits: number;
  referralCode: string;
  isRestaurantStaff: boolean;
  avatar: string;
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

export interface Subscription {
  id: string;
  name: string;
  price: number;
  creditsPerCycle: number;
  isActive: boolean;
  frequency: 'weekly' | 'monthly';
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