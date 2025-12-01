import { Restaurant, Review, Subscription, Referral } from './types';

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: 'r1',
    name: 'Sushi Zen',
    image: 'https://picsum.photos/800/600?random=1',
    address: '123 Ocean Drive',
    category: 'Japanese',
    rating: 4.8,
    lat: 40.7128,
    lng: -74.0060,
    menu: [
      { id: 'd1', name: 'Omakase Set', description: 'Chef selected 12pc sushi', credits: 15, image: 'https://picsum.photos/400/400?random=101', calories: 600 },
      { id: 'd2', name: 'Spicy Tuna Roll', description: 'Fresh tuna with spicy mayo', credits: 8, image: 'https://picsum.photos/400/400?random=102', calories: 350 },
    ]
  },
  {
    id: 'r2',
    name: 'Burger & Co.',
    image: 'https://picsum.photos/800/600?random=2',
    address: '456 Main St',
    category: 'American',
    rating: 4.5,
    lat: 40.7138,
    lng: -74.0070,
    menu: [
      { id: 'd3', name: 'Truffle Burger', description: 'Wagyu beef with truffle oil', credits: 12, image: 'https://picsum.photos/400/400?random=103', calories: 850 },
      { id: 'd4', name: 'Vegan Delight', description: 'Plant-based patty', credits: 10, image: 'https://picsum.photos/400/400?random=104', calories: 500 },
    ]
  },
  {
    id: 'r3',
    name: 'La Dolce Vita',
    image: 'https://picsum.photos/800/600?random=3',
    address: '789 Pasta Ln',
    category: 'Italian',
    rating: 4.9,
    lat: 40.7148,
    lng: -74.0080,
    menu: [
      { id: 'd5', name: 'Carbonara', description: 'Authentic roman style', credits: 14, image: 'https://picsum.photos/400/400?random=105', calories: 900 },
    ]
  }
];

export const MOCK_SUBSCRIPTIONS: Subscription[] = [
  { id: 's1', name: 'Trial', price: 0, creditsPerCycle: 10, isActive: false, frequency: 'weekly' },
  { id: 's2', name: 'Foodie', price: 49, creditsPerCycle: 60, isActive: true, frequency: 'monthly' },
  { id: 's3', name: 'Pro', price: 89, creditsPerCycle: 120, isActive: false, frequency: 'monthly' },
];

export const MOCK_REVIEWS: Review[] = [
  { id: 'rv1', userName: 'Alice', dishName: 'Truffle Burger', rating: 5, text: 'Absolutely insane flavor!', image: 'https://picsum.photos/200/200?random=201', date: '2h ago' },
  { id: 'rv2', userName: 'Bob', dishName: 'Omakase Set', rating: 4, text: 'Great fish quality, bit pricey credits.', image: 'https://picsum.photos/200/200?random=202', date: '5h ago' },
];

export const MOCK_REFERRALS: Referral[] = [
  { id: 'ref1', name: 'John Doe', status: 'joined', date: '2023-10-15' },
  { id: 'ref2', name: 'Jane Smith', status: 'pending', date: '2023-10-20' },
];