
import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context';
import { useNavigate } from 'react-router-dom';
import { Utensils, QrCode, Gift, ChevronRight, Star, HelpCircle, Wallet, MapPin, RefreshCw } from 'lucide-react';
import { MOCK_RESTAURANTS } from '../constants';

const HERO_PHRASES = [
  "Hora de experimentar",
  "Descubra novos sabores",
  "O que vamos comer hoje?",
  "Seus pratos favoritos aqui",
  "Viva a experiência gastronômica",
  "Sabor que cabe no bolso"
];

// Helper para calcular distância (Haversine)
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI/180)
}

export const Home: React.FC = () => {
  const { user, openScanner, userLocation, requestUserLocation } = useApp();
  const navigate = useNavigate();
  
  // State for rotating phrases
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [fadeProp, setFadeProp] = useState('opacity-100');
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // Start fade out
      setFadeProp('opacity-0');
      
      setTimeout(() => {
        // Change text and fade in
        setPhraseIndex((prev) => (prev + 1) % HERO_PHRASES.length);
        setFadeProp('opacity-100');
      }, 500); // Wait for fade out to finish (500ms matches duration-500)

    }, 10000); // 10 seconds total cycle

    return () => clearInterval(interval);
  }, []);

  const handleLocationClick = async () => {
    setIsLocating(true);
    await requestUserLocation();
    setTimeout(() => setIsLocating(false), 1000);
  };

  // Calcular pratos mais próximos ou destaques
  const displayedDishes = useMemo(() => {
    let restaurantsWithDistance = MOCK_RESTAURANTS.map(r => ({
      ...r,
      distance: userLocation 
        ? getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, r.lat, r.lng)
        : 0
    }));

    // Se tiver localização, ordena por distância
    if (userLocation) {
      restaurantsWithDistance.sort((a, b) => a.distance - b.distance);
    }

    // Achatar a lista de pratos
    return restaurantsWithDistance.flatMap(r => 
      r.menu.map(dish => ({
        ...dish,
        restaurantName: r.name,
        restaurantRating: r.rating,
        distance: r.distance
      }))
    ).slice(0, 6); // Pegar os top 6
  }, [userLocation]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      
      {/* --- HERO SECTION --- */}
      <div className="relative h-[280px] w-full">
        {/* Background Image */}
        <img 
          src="https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
          alt="Food Background" 
          className="w-full h-full object-cover brightness-[0.65]"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-gray-50 dark:to-gray-950" />

        {/* Content Layer */}
        <div className="absolute inset-0 flex flex-col p-6 pt-12">
          
          {/* Top Bar */}
          <div className="flex justify-between items-start mb-4">
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
                <h2 className={`text-2xl font-bold text-white transition-opacity duration-500 ${fadeProp}`}>
                  {HERO_PHRASES[phraseIndex]}
                </h2>
             </div>
          </div>
        </div>
      </div>

      {/* --- ACTION CARDS (Negative Margin) --- */}
      <div className="-mt-24 px-5 relative z-10">
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

          {/* Green Card: Credits/QR - Open Scanner Modal */}
          <button 
            onClick={() => openScanner('redeem')}
            className="bg-green-600 hover:bg-green-700 text-white rounded-2xl p-4 h-36 flex flex-col justify-between shadow-lg shadow-green-500/20 transition-transform active:scale-95 text-left group"
          >
            <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Usar<br/>Créditos</h3>
              <p className="text-xs text-green-100 mt-1 opacity-90">Escaneie e aproveite</p>
            </div>
          </button>
        </div>
      </div>

      {/* --- REFERRAL BANNER (Compact Blue) --- */}
      <div className="px-5 mt-4">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden flex items-center justify-between">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>

          <div className="relative z-10 flex-1 mr-2">
            <div className="flex items-center gap-2 mb-1">
               <div className="bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Gift className="w-4 h-4" />
               </div>
               <h3 className="text-lg font-bold">Indique e Ganhe!</h3>
            </div>
            <p className="text-blue-50 text-xs leading-tight">
              Ganhe créditos bônus indicando.
            </p>
          </div>
          
          <button 
            onClick={() => navigate('/referrals')}
            className="relative z-10 bg-white text-blue-600 px-4 py-2 rounded-lg font-bold text-xs shadow-sm hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            Convidar
          </button>
        </div>
      </div>

      {/* --- NEAREST DISHES --- */}
      <div className="mt-8 pb-4">
        <div className="px-5 flex justify-between items-end mb-4">
          <div>
             <h3 className="text-lg font-extrabold text-gray-900 dark:text-white uppercase tracking-wider mb-1">
               O Que Tem Próximo
             </h3>
             <button 
               onClick={handleLocationClick} 
               disabled={isLocating}
               className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400 text-xs font-bold hover:underline disabled:opacity-50"
             >
               {isLocating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <MapPin className="w-3 h-3" />}
               {userLocation ? 'Atualizar Localização' : 'Ativar Localização'}
             </button>
          </div>
          <button 
            onClick={() => navigate('/restaurants')}
            className="text-sm font-medium text-gray-500 flex items-center hover:text-brand-500 transition-colors mb-1"
          >
            Ver todos <ChevronRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>

        <div className="flex overflow-x-auto gap-4 px-5 pb-6 no-scrollbar snap-x">
          {displayedDishes.map((dish, idx) => (
            <div 
              key={`${dish.id}-${idx}`}
              onClick={() => navigate('/restaurants')} 
              className="min-w-[160px] w-[160px] bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 snap-center overflow-hidden flex flex-col relative"
            >
              <div className="h-28 w-full relative">
                 <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                 
                 {/* Distance Badge */}
                 <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <MapPin className="w-3 h-3 text-orange-400" />
                    <span className="text-[10px] text-white font-bold">
                       {userLocation ? `${dish.distance.toFixed(1)} km` : '? km'}
                    </span>
                 </div>
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
