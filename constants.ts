import { Restaurant, Review, Referral, Plan } from './types';

// 2. Definição dos Planos (Dados Iniciais)
export const PLANS: Plan[] = [
  // --- Nível 1: Experiência ---
  {
    id: 'exp_unique',
    name: 'Experiência',
    frequency: 'unique',
    credits: 3,
    price: 69.00,
    costPerCredit: 19.00,
    durationDays: 7,
    renewalPlanId: 'ess_weekly', // Renews to Essential Weekly
    description: 'Experimente a liberdade. Sem compromisso.',
    isTrial: true,
    discountPercent: 0
  },

  // --- Nível 2: Semanal (Padrão) ---
  {
    id: 'ess_weekly',
    name: 'Essencial Semanal',
    frequency: 'weekly',
    credits: 6,
    price: 147.00,
    costPerCredit: 19.00,
    durationDays: 7,
    renewalPlanId: 'ess_weekly', // Self-renew
    description: 'Para quem gosta de rotina.',
    isTrial: false,
    discountPercent: 0
  },
  {
    id: 'equi_weekly',
    name: 'Equilíbrio Semanal',
    frequency: 'weekly',
    credits: 12,
    price: 279.30,
    costPerCredit: 19.00,
    durationDays: 7,
    renewalPlanId: 'equi_weekly',
    description: 'O dobro de sabor.',
    isTrial: false,
    discountPercent: 5
  },
  {
    id: 'conv_weekly',
    name: 'Conveniência Semanal',
    frequency: 'weekly',
    credits: 18,
    price: 410.07,
    costPerCredit: 19.00,
    durationDays: 7,
    renewalPlanId: 'conv_weekly',
    description: 'Máxima conveniência.',
    isTrial: false,
    discountPercent: 7
  },

  // --- Nível 3: Mensal (Padrão) ---
  {
    id: 'ess_monthly_std',
    name: 'Essencial Mensal (Padrão)',
    frequency: 'monthly',
    credits: 24,
    price: 529.20,
    costPerCredit: 19.00,
    durationDays: 30,
    renewalPlanId: 'ess_monthly_std',
    description: 'Nosso plano mais popular.',
    isTrial: false,
    discountPercent: 10
  },
  {
    id: 'equi_monthly_std',
    name: 'Equilíbrio Mensal (Padrão)',
    frequency: 'monthly',
    credits: 48,
    price: 1058.40,
    costPerCredit: 19.00,
    durationDays: 30,
    renewalPlanId: 'equi_monthly_std',
    description: 'Para casais ou foodies.',
    isTrial: false,
    discountPercent: 10
  },
  {
    id: 'conv_monthly_std',
    name: 'Conveniência Mensal (Padrão)',
    frequency: 'monthly',
    credits: 72,
    price: 1587.60,
    costPerCredit: 19.00,
    durationDays: 30,
    renewalPlanId: 'conv_monthly_std',
    description: 'A experiência completa.',
    isTrial: false,
    discountPercent: 10
  },

  // --- Nível 3b: Mensal (Trial/Upsell) ---
  // Estes são usados quando o usuário faz upgrade do Semanal -> Mensal (1º mês com desconto)
  {
    id: 'ess_monthly_trial',
    name: 'Essencial Mensal (Oferta)',
    frequency: 'monthly',
    credits: 24,
    price: 499.80,
    costPerCredit: 19.00,
    durationDays: 30,
    renewalPlanId: 'ess_monthly_std', // Renew to Standard Price next month
    description: 'Oferta especial de upgrade.',
    isTrial: true,
    discountPercent: 15
  },
  {
    id: 'equi_monthly_trial',
    name: 'Equilíbrio Mensal (Oferta)',
    frequency: 'monthly',
    credits: 48,
    price: 999.60,
    costPerCredit: 19.00,
    durationDays: 30,
    renewalPlanId: 'equi_monthly_std', // Renew to Standard Price next month
    description: 'Oferta especial de upgrade.',
    isTrial: true,
    discountPercent: 15
  },
  {
    id: 'conv_monthly_trial',
    name: 'Conveniência Mensal (Oferta)',
    frequency: 'monthly',
    credits: 72,
    price: 1499.40,
    costPerCredit: 19.00,
    durationDays: 30,
    renewalPlanId: 'conv_monthly_std', // Renew to Standard Price next month
    description: 'Oferta especial de upgrade.',
    isTrial: true,
    discountPercent: 15
  },
];

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

export const MOCK_REVIEWS: Review[] = [
  { id: 'rv1', userName: 'Alice', dishName: 'Truffle Burger', rating: 5, text: 'Absolutely insane flavor!', image: 'https://picsum.photos/200/200?random=201', date: '2h ago' },
  { id: 'rv2', userName: 'Bob', dishName: 'Omakase Set', rating: 4, text: 'Great fish quality, bit pricey credits.', image: 'https://picsum.photos/200/200?random=202', date: '5h ago' },
];

export const MOCK_REFERRALS: Referral[] = [
  { id: 'ref1', name: 'John Doe', status: 'joined', date: '2023-10-15' },
  { id: 'ref2', name: 'Jane Smith', status: 'pending', date: '2023-10-20' },
];