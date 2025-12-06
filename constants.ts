
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
  {
    id: 'ess_monthly_trial',
    name: 'Essencial Mensal (Oferta)',
    frequency: 'monthly',
    credits: 24,
    price: 499.80,
    costPerCredit: 19.00,
    durationDays: 30,
    renewalPlanId: 'ess_monthly_std', 
    description: '15% OFF no 1º mês. Depois 10% OFF.',
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
    renewalPlanId: 'equi_monthly_std', 
    description: '15% OFF no 1º mês. Depois 10% OFF.',
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
    renewalPlanId: 'conv_monthly_std', 
    description: '15% OFF no 1º mês. Depois 10% OFF.',
    isTrial: true,
    discountPercent: 15
  },
];

export const MOCK_RESTAURANTS: Restaurant[] = [
  // --- CURITIBA, PR ---
  {
    id: 'r_cwb_1',
    name: 'Madalosso',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    address: 'Av. Manoel Ribas, 5875 - Santa Felicidade, Curitiba - PR',
    category: 'Italiana',
    rating: 4.8,
    lat: -25.4026,
    lng: -49.3245,
    description: 'O maior restaurante das Américas, servindo a tradicional comida italiana com rodízio de massas e frango.',
    openingHours: '11:30 - 23:00',
    services: ['Wi-Fi', 'Estacionamento', 'Área Kids', 'Acessibilidade', 'Carta de Vinhos'],
    menu: [
      { id: 'd_cwb_1', name: 'Rodízio Italiano', description: 'Massas, frango e polenta frita à vontade.', credits: 3, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=400&q=80', calories: 1200 },
      { id: 'd_cwb_1b', name: 'Polenta Frita Crocante', description: 'Porção generosa da tradicional polenta frita de Santa Felicidade.', credits: 1, image: 'https://images.unsplash.com/photo-1619684617152-16eb164627d2?auto=format&fit=crop&w=400&q=80', calories: 450 },
      { id: 'd_cwb_1c', name: 'Lasanha na Manteiga', description: 'Lasanha clássica servida na manteiga dourada.', credits: 2, image: 'https://images.unsplash.com/photo-1574868233972-1e663c8e284f?auto=format&fit=crop&w=400&q=80', calories: 800 },
      { id: 'd_cwb_1d', name: 'Risoto de Frango', description: 'Arroz arbóreo cremoso com cubos de frango e açafrão.', credits: 2, image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80', calories: 600 },
      { id: 'd_cwb_1e', name: 'Gnocchi ao Sugo', description: 'Nhoque artesanal de batata com molho de tomate caseiro.', credits: 2, image: 'https://images.unsplash.com/photo-1546549010-413bc4f41967?auto=format&fit=crop&w=400&q=80', calories: 550 },
      { id: 'd_cwb_1f', name: 'Frango a Passarinho', description: 'Frango frito crocante temperado com alho e salsinha.', credits: 2, image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=400&q=80', calories: 700 },
      { id: 'd_cwb_1g', name: 'Salada Radicchio', description: 'Salada fresca de radicchio com bacon crocante.', credits: 1, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80', calories: 200 },
      { id: 'd_cwb_1h', name: 'Spaghetti Alho e Óleo', description: 'Massa simples e deliciosa com alho dourado e azeite.', credits: 1, image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=400&q=80', calories: 450 },
      { id: 'd_cwb_1i', name: 'Tiramisu Clássico', description: 'Sobremesa italiana com café e queijo mascarpone.', credits: 2, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=400&q=80', calories: 400 },
      { id: 'd_cwb_1j', name: 'Vinho Tinto da Casa', description: 'Taça de vinho tinto colonial suave.', credits: 1, image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=400&q=80', calories: 150 },
      // Novos Pratos
      { id: 'd_cwb_1k', name: 'Rondelli de Presunto', description: 'Massa enrolada recheada com presunto e queijo ao molho branco.', credits: 2, image: 'https://images.unsplash.com/photo-1587206668283-c21d974993c3?auto=format&fit=crop&w=400&q=80', calories: 750 },
      { id: 'd_cwb_1l', name: 'Sopa de Capeletti', description: 'Caldo reconfortante com capeletti de carne.', credits: 1, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=400&q=80', calories: 300 },
      { id: 'd_cwb_1m', name: 'Frango Prensado', description: 'Peito de frango grelhado e prensado com ervas finas.', credits: 2, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=400&q=80', calories: 500 },
      { id: 'd_cwb_1n', name: 'Salada de Maionese', description: 'Clássica salada de batata com maionese caseira.', credits: 1, image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&w=400&q=80', calories: 400 },
      { id: 'd_cwb_1o', name: 'Sagu de Vinho', description: 'Sobremesa tradicional do sul com creme de baunilha.', credits: 1, image: 'https://images.unsplash.com/photo-1588610363991-817f7396a54f?auto=format&fit=crop&w=400&q=80', calories: 250 },
    ]
  },
  {
    id: 'r_cwb_2',
    name: 'Bar do Alemão',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    address: 'R. Dr. Claudino dos Santos, 63 - Largo da Ordem, Curitiba - PR',
    category: 'Alemã',
    rating: 4.7,
    lat: -25.4284,
    lng: -49.2733,
    description: 'Tradicional bar alemão no coração histórico de Curitiba, famoso pelo Submarino e Carne de Onça.',
    openingHours: '11:00 - 01:00',
    services: ['Música ao Vivo', 'Pet Friendly'],
    menu: [
      { id: 'd_cwb_2', name: 'Carne de Onça', description: 'Tradicional petisco curitibano (Carne crua temperada).', credits: 2, image: 'https://images.unsplash.com/photo-1599351479261-12c8a162239c?auto=format&fit=crop&w=400&q=80', calories: 400 },
      { id: 'd_cwb_3', name: 'Submarino', description: 'Chopp com uma dose de steinhäger dentro.', credits: 1, image: 'https://images.unsplash.com/photo-1616951237198-c11649983944?auto=format&fit=crop&w=400&q=80', calories: 250 },
      { id: 'd_cwb_2c', name: 'Eisbein (Joelho de Porco)', description: 'Joelho de porco pururuca com chucrute e batatas.', credits: 3, image: 'https://images.unsplash.com/photo-1626075677993-979929875e53?auto=format&fit=crop&w=400&q=80', calories: 1200 },
    ]
  },
  {
    id: 'r_cwb_3',
    name: 'Terrazza 40',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    address: 'R. Padre Anchieta, 1287 - Bigorrilho, Curitiba - PR',
    category: 'Internacional',
    rating: 4.9,
    lat: -25.4297,
    lng: -49.2957,
    description: 'Restaurante panorâmico giratório com vista 360º da cidade e gastronomia internacional refinada.',
    openingHours: '19:00 - 00:00',
    services: ['Vista Panorâmica', 'Wi-Fi', 'Adega'],
    menu: [
      { id: 'd_cwb_4', name: 'Bife de Chorizo Premium', description: 'Corte nobre argentino com vista panorâmica.', credits: 3, image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=400&q=80', calories: 850 },
    ]
  },

  // --- PONTA GROSSA, PR ---
  {
    id: 'r_pg_1',
    name: 'Churrascaria Lugano',
    image: 'https://images.unsplash.com/photo-1592686092916-613b762585fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    address: 'Av. Visc. de Mauá, 1100 - Oficinas, Ponta Grossa - PR',
    category: 'Brasileira',
    rating: 4.6,
    lat: -25.1100,
    lng: -50.1500,
    description: 'Churrasco gaúcho de qualidade em ambiente familiar.',
    openingHours: '11:00 - 15:00',
    services: ['Estacionamento', 'Ar Condicionado'],
    menu: [
      { id: 'd_pg_1', name: 'Rodízio Completo', description: 'Carnes nobres selecionadas e buffet livre.', credits: 3, image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=400&q=80', calories: 1500 },
    ]
  },
  {
    id: 'r_pg_2',
    name: 'Elite Burguer',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    address: 'R. Balduíno Taques, 450 - Centro, Ponta Grossa - PR',
    category: 'Lanches',
    rating: 4.5,
    lat: -25.0945,
    lng: -50.1633,
    description: 'Hambúrgueres artesanais grelhados na brasa.',
    openingHours: '18:00 - 23:00',
    services: ['Delivery', 'Wi-Fi'],
    menu: [
      { id: 'd_pg_2', name: 'X-Elite Duplo', description: 'Hambúrguer duplo artesanal, cheddar e bacon.', credits: 2, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80', calories: 900 },
    ]
  },

  // --- CAMPO LARGO, PR ---
  {
    id: 'r_cl_1',
    name: 'Dom Antonio Trattoria',
    image: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    address: 'R. Xavier da Silva, 1100 - Centro, Campo Largo - PR',
    category: 'Italiana',
    rating: 4.7,
    lat: -25.4592,
    lng: -49.5268,
    description: 'Massas artesanais e molhos caseiros em um ambiente acolhedor.',
    openingHours: '11:30 - 14:30',
    services: ['Wi-Fi', 'Pet Friendly'],
    menu: [
      { id: 'd_cl_1', name: 'Lasanha Bolonhesa', description: 'Receita da nonna com massa fresca.', credits: 2, image: 'https://images.unsplash.com/photo-1574868233972-1e663c8e284f?auto=format&fit=crop&w=400&q=80', calories: 700 },
    ]
  },
  {
    id: 'r_cl_2',
    name: 'Café Colonial da Serra',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    address: 'Rod. do Café, km 120 - Campo Largo - PR',
    category: 'Cafés',
    rating: 4.8,
    lat: -25.4400,
    lng: -49.5100,
    description: 'Café colonial completo com delícias da região serrana.',
    openingHours: '15:00 - 20:00',
    services: ['Estacionamento', 'Vista Panorâmica'],
    menu: [
      { id: 'd_cl_2', name: 'Buffet Colonial Livre', description: 'Bolos, tortas, salgados, queijos e cafés.', credits: 3, image: 'https://images.unsplash.com/photo-1488477184557-088151f43b17?auto=format&fit=crop&w=400&q=80', calories: 600 },
    ]
  },

  // --- SÃO PAULO, SP ---
  {
    id: 'r_sp_1',
    name: 'A Casa do Porco',
    image: 'https://images.unsplash.com/photo-1460306855393-0410f61241c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    address: 'R. Araújo, 124 - República, São Paulo - SP',
    category: 'Brasileira',
    rating: 4.9,
    lat: -23.5432,
    lng: -46.6450,
    description: 'Alta gastronomia caipira focada em carne suína. Eleito um dos melhores do mundo.',
    openingHours: '12:00 - 23:00',
    services: ['Wi-Fi', 'Acessibilidade'],
    menu: [
      { id: 'd_sp_1', name: 'Menu Degustação Suíno', description: 'Experiência completa do chef.', credits: 3, image: 'https://images.unsplash.com/photo-1624726175512-19c9746903ce?auto=format&fit=crop&w=400&q=80', calories: 1100 },
    ]
  },
  {
    id: 'r_sp_2',
    name: 'Fasano',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    address: 'R. Vitório Fasano, 88 - Jardins, São Paulo - SP',
    category: 'Italiana',
    rating: 5.0,
    lat: -23.5630,
    lng: -46.6690,
    description: 'Sofisticação e tradição italiana em um dos endereços mais nobres de SP.',
    openingHours: '19:00 - 01:00',
    services: ['Valet', 'Adega'],
    menu: [
      { id: 'd_sp_2', name: 'Ossobuco com Polenta', description: 'Clássico da alta gastronomia italiana.', credits: 3, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80', calories: 950 },
    ]
  },
  {
    id: 'r_sp_3',
    name: 'Maní',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    address: 'R. Joaquim Antunes, 210 - Pinheiros, São Paulo - SP',
    category: 'Brasileira',
    rating: 4.8,
    lat: -23.5670,
    lng: -46.6800,
    description: 'Cozinha autoral com raízes brasileiras e técnicas contemporâneas.',
    openingHours: '12:00 - 15:00, 19:30 - 23:30',
    services: ['Wi-Fi', 'Área Externa'],
    menu: [
      { id: 'd_sp_3', name: 'Menu Degustação', description: 'Cozinha brasileira contemporânea em 5 tempos.', credits: 3, image: 'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?auto=format&fit=crop&w=400&q=80', calories: 700 },
      { id: 'd_sp_3b', name: 'Moqueca de Peixe', description: 'Moqueca capixaba com peixe fresco, arroz e pirão', credits: 3, image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=400&q=80', calories: 600 },
      { id: 'd_sp_3c', name: 'Picanha na Brasa', description: 'Picanha grelhada com arroz, vinagrete e batata assada', credits: 3, image: 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?auto=format&fit=crop&w=400&q=80', calories: 900 },
    ]
  },
  {
    id: 'r_sp_4',
    name: 'Mocotó',
    image: 'https://images.unsplash.com/photo-1614088921102-39c4a5c54326?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    address: 'Av. Nossa Sra. do Loreto, 1100 - Vila Medeiros, São Paulo - SP',
    category: 'Nordestina',
    rating: 4.8,
    lat: -23.4750,
    lng: -46.5800,
    description: 'Culinária sertaneja premiada e acessível.',
    openingHours: '12:00 - 23:00',
    services: ['Wi-Fi', 'Acessibilidade', 'Área Kids'],
    menu: [
      { id: 'd_sp_4', name: 'Dadinhos de Tapioca', description: 'O original, com geleia de pimenta.', credits: 1, image: 'https://images.unsplash.com/photo-1513442542250-854d436a73f2?auto=format&fit=crop&w=400&q=80', calories: 300 },
      { id: 'd_sp_4b', name: 'Baião de Dois', description: 'Arroz, feijão de corda, queijo coalho e carne seca', credits: 2, image: 'https://images.unsplash.com/photo-1626509653298-639433fce224?auto=format&fit=crop&w=400&q=80', calories: 800 },
      { id: 'd_sp_4c', name: 'Escondidinho de Carne Seca', description: 'Cremoso purê de mandioca com recheio de carne seca.', credits: 2, image: 'https://images.unsplash.com/photo-1548943487-a2e4e43b485c?auto=format&fit=crop&w=400&q=80', calories: 650 },
      { id: 'd_sp_4d', name: 'Torresmo Crocante', description: 'Porção de torresmo sequinho e crocante.', credits: 1, image: 'https://images.unsplash.com/photo-1606757303023-e40df5244510?auto=format&fit=crop&w=400&q=80', calories: 500 },
      { id: 'd_sp_4e', name: 'Mocotó Completo', description: 'Caldo rico de mocotó servido com pão artesanal.', credits: 2, image: 'https://images.unsplash.com/photo-1574484284008-86d47dc6b5d3?auto=format&fit=crop&w=400&q=80', calories: 550 },
      { id: 'd_sp_4f', name: 'Costelinha de Porco', description: 'Costelinha suína assada lentamente com melaço de cana.', credits: 3, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80', calories: 900 },
      { id: 'd_sp_4g', name: 'Feijão de Corda', description: 'Porção extra de feijão de corda temperado.', credits: 1, image: 'https://images.unsplash.com/photo-1551326844-f459e292fd79?auto=format&fit=crop&w=400&q=80', calories: 300 },
      { id: 'd_sp_4h', name: 'Pudim de Tapioca', description: 'Sobremesa cremosa com calda de caramelo e coco.', credits: 1, image: 'https://images.unsplash.com/photo-1514843319620-4f042827c481?auto=format&fit=crop&w=400&q=80', calories: 350 },
      { id: 'd_sp_4i', name: 'Caipirinha de Três Limões', description: 'Drink refrescante com cachaça artesanal e mix de limões.', credits: 2, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80', calories: 200 },
      // Novos Pratos
      { id: 'd_sp_4j', name: 'Carne de Sol na Nata', description: 'Carne de sol desfiada servida com nata fresca.', credits: 2, image: 'https://images.unsplash.com/photo-1604908177453-7462950a6a3b?auto=format&fit=crop&w=400&q=80', calories: 600 },
      { id: 'd_sp_4k', name: 'Cuscuz Nordestino', description: 'Cuscuz de milho com manteiga de garrafa e queijo.', credits: 1, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=400&q=80', calories: 400 },
      { id: 'd_sp_4l', name: 'Bolo de Rolo', description: 'Fatia de bolo de rolo tradicional de goiabada.', credits: 1, image: 'https://images.unsplash.com/photo-1598155523122-38423bb4d6c1?auto=format&fit=crop&w=400&q=80', calories: 350 },
    ]
  },
  {
    id: 'r_sp_5',
    name: 'Cantina Bella Vista',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    address: 'Av. Paulista, 1578 - Bela Vista, São Paulo - SP',
    category: 'Italiana',
    rating: 4.9,
    lat: -23.5615,
    lng: -46.6559,
    description: 'Autêntica comida italiana com massas artesanais e vinhos selecionados.',
    openingHours: '12:00 - 23:00',
    services: ['Wi-Fi', 'Pet Friendly'],
    menu: [
       { id: 'd_sp_5a', name: 'Prato Feito Tradicional', description: 'Arroz, feijão, bife acebolado, batata frita e salada', credits: 1, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=400&q=80', calories: 650 },
       { id: 'd_sp_5b', name: 'Macarrão ao Molho Vermelho', description: 'Macarrão penne com molho de tomate caseiro e queijo ralado', credits: 1, image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=400&q=80', calories: 500 },
       { id: 'd_sp_5c', name: 'Frango Grelhado com Legumes', description: 'Peito de frango grelhado com mix de legumes', credits: 1, image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=400&q=80', calories: 400 },
    ]
  }
];

export const MOCK_REVIEWS: Review[] = [
  { id: 'rv1', restaurantId: 'r_cwb_1', userName: 'Maria Silva', dishName: 'Rodízio Italiano', rating: 5, text: 'Simplesmente incrível! A polenta frita é de outro mundo.', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&q=80', date: 'Há 2 dias' },
  { id: 'rv2', restaurantId: 'r_cwb_2', userName: 'João Souza', dishName: 'Carne de Onça', rating: 4, text: 'Muito saborosa, mas achei a porção pequena para dividir.', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=400&q=80', date: 'Há 5 dias' },
  { id: 'rv3', restaurantId: 'r_cwb_1', userName: 'Ana Paula', rating: 5, text: 'Melhor lugar de Santa Felicidade.', date: 'Há 1 semana' }, // Sem foto
];

export const MOCK_REFERRALS: Referral[] = [
  { id: 'ref1', name: 'Ana Clara', status: 'joined', date: '12/10/2023' },
  { id: 'ref2', name: 'Pedro Henrique', status: 'pending', date: '14/10/2023' },
];
