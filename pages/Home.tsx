import React from 'react';
import { useApp } from '../context';
import { useNavigate } from 'react-router-dom';
import { Utensils, QrCode, Gift, ChevronRight, Star, HelpCircle, Wallet } from 'lucide-react';
import { MOCK_RESTAURANTS } from '../constants';

export const Home: React.FC = () => {
  const { user } = useApp();
  const navigate = useNavigate();

  // Achatar a lista de pratos para exibir nos destaques
  const featuredDishes = MOCK_RESTAURANTS.flatMap(r => 
    r.menu.map(dish => ({
      ...dish,
      restaurantName: r.name,
      restaurantRating: r.rating
    }))
  ).slice(0, 5); // Pegar apenas os primeiros 5 para demo

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      
      {/* --- HERO SECTION --- */}
      <div className="relative h-[340px] w-full">
        {/* Background Image */}
        <img 
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
          alt="Food Background" 
          className="w-full h-full object-cover brightness-[0.6]"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-gray-50 dark:to-gray-950" />

        {/* Content Layer */}
        <div className="absolute inset-0 flex flex-col p-6 pt-12">
          
          {/* Top Bar */}
          <div className="flex justify-between items-start mb-12">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">Olá,</p>
              <h1 className="text-3xl font-bold text-white leading-tight">{user.name}</h1>
            </div>

            <div className="flex gap-3">
              {/* Credits Pill */}
              <button 
                onClick={() => navigate('/credits')}
                className="bg-black/30 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 flex items-center gap-2 text-white hover:bg-black/40 transition-colors"
              >
                <Wallet className="w-4 h-4" />
                <span className="font-bold">{user.credits}</span>
              </button>
              
              {/* Help Icon */}
              <button className="bg-black/30 backdrop-blur-md border border-white/20 rounded-full p-2 text-white hover:bg-black/40 transition-colors">
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Hero Title */}
          <div className="mt-auto pb-20">
             <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🍕</span>
                <h2 className="text-2xl font-bold text-white">Hora de experimentar</h2>
             </div>
          </div>
        </div>
      </div>

      {/* --- ACTION CARDS (Negative Margin) --- */}
      <div className="-mt-16 px-5 relative z-10">
        <div className="grid grid-cols-2 gap-4">
          
          {/* Orange Card: Restaurants */}
          <button 
            onClick={() => navigate('/restaurants')}
            className="bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-2xl p-4 h-36 flex flex-col justify-between shadow-lg shadow-orange-500/20 transition-transform active:scale-95 text-left group"
          >
            <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Explorar<br/>Restaurantes</h3>
              <p className="text-xs text-orange-100 mt-1 opacity-90">Descubra novos sabores</p>
            </div>
          </button>

          {/* Purple Card: Credits/QR */}
          <button 
            onClick={() => navigate('/credits')}
            className="bg-[#d946ef] hover:bg-[#c026d3] text-white rounded-2xl p-4 h-36 flex flex-col justify-between shadow-lg shadow-fuchsia-500/20 transition-transform active:scale-95 text-left group"
          >
            <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Usar<br/>Créditos</h3>
              <p className="text-xs text-fuchsia-100 mt-1 opacity-90">Escaneie e aproveite</p>
            </div>
          </button>
        </div>

        {/* Carousel Dots (Decorative) */}
        <div className="flex justify-center gap-2 mt-6 mb-2">
           <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600"></div>
           <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
           <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
           <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
        </div>
      </div>

      {/* --- REFERRAL BANNER --- */}
      <div className="px-5 mt-6">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>

          <div className="relative z-10">
            <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
               <Gift className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-1">Indique e Ganhe!</h3>
            <p className="text-purple-100 text-sm mb-4 max-w-[80%]">
              Convide amigos e ganhe créditos bônus para cada indicação
            </p>
            <button 
              onClick={() => navigate('/referrals')}
              className="bg-white text-purple-600 px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-gray-50 transition-colors"
            >
              Começar Agora
            </button>
          </div>
        </div>
      </div>

      {/* --- FEATURED DISHES --- */}
      <div className="mt-8 pb-4">
        <div className="px-5 flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Pratos em Destaque</h3>
          <button 
            onClick={() => navigate('/restaurants')}
            className="text-sm font-medium text-gray-500 flex items-center hover:text-brand-500 transition-colors"
          >
            Ver todos <ChevronRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>

        <div className="flex overflow-x-auto gap-4 px-5 pb-6 no-scrollbar snap-x">
          {featuredDishes.map((dish, idx) => (
            <div 
              key={`${dish.id}-${idx}`}
              onClick={() => navigate('/restaurants')} // In a real app, go to dish details
              className="min-w-[160px] w-[160px] bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 snap-center overflow-hidden flex flex-col"
            >
              <div className="h-28 w-full relative">
                 <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="p-3 flex-1 flex flex-col">
                <h4 className="font-bold text-gray-900 dark:text-white text-sm leading-tight mb-1 line-clamp-2">
                  {dish.name}
                </h4>
                <p className="text-xs text-gray-500 mb-3 truncate">{dish.restaurantName}</p>
                
                <div className="mt-auto flex items-center justify-between">
                   <div className="bg-brand-500 text-white text-[10px] font-bold px-2 py-1 rounded-md">
                     {dish.credits} {dish.credits === 1 ? 'crédito' : 'créditos'}
                   </div>
                   <div className="flex items-center gap-0.5 text-xs font-bold text-orange-500">
                      <Star className="w-3 h-3 fill-orange-500" />
                      {dish.restaurantRating}
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
