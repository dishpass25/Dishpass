
import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context';
import { useNavigate } from 'react-router-dom';
import { Utensils, QrCode, Gift, ChevronRight, Star, HelpCircle, Wallet, MapPin, RefreshCw, Info, Store, Navigation, X } from 'lucide-react';
import { MOCK_RESTAURANTS } from '../constants';
import { TutorialOverlay } from '../components/TutorialOverlay';

const HERO_DATA = [
  { text: "O que será que vou comer hoje?", emoji: "🤔" },
  { text: "E se eu provasse algo diferente?", emoji: "🌎" },
  { text: "Acho que mereço algo especial...", emoji: "✨" },
  { text: "Talvez aquele japonês fresco?", emoji: "🍣" },
  { text: "Uma massa italiana cairia bem...", emoji: "🍝" },
  { text: "Pensando naquele hambúrguer...", emoji: "🍔" },
  { text: "Como comer bem e economizar?", emoji: "💸" },
  { text: "Um café agora seria perfeito...", emoji: "☕" },
  { text: "Onde será minha próxima descoberta?", emoji: "🔍" },
  { text: "Imaginando o jantar com a galera...", emoji: "👯" },
  { text: "Hoje é dia de conforto ou aventura?", emoji: "🤷‍♂️" },
  { text: "Será que tem novidade por perto?", emoji: "📍" },
  { text: "Bateu aquela vontade de doce...", emoji: "🍰" },
  { text: "Um drink para relaxar cairia bem.", emoji: "🍹" },
  { text: "Saudade daquela comida caseira...", emoji: "🥘" }
];

// Fallback image constant
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";

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

// Helper para cor do badge de crédito
const getCreditColorClass = (credits: number) => {
  if (credits === 1) return 'bg-emerald-500 shadow-emerald-500/30';
  if (credits === 2) return 'bg-blue-600 shadow-blue-600/30';
  return 'bg-purple-600 shadow-purple-600/30';
};

// --- SUB-COMPONENT: DISH ACTION MODAL ---
interface DishActionModalProps {
  dish: any;
  onClose: () => void;
  onNavigateRestaurant: () => void;
  onRedeem: () => void;
  onNavigateGPS: () => void;
}

const DishActionModal: React.FC<DishActionModalProps> = ({ dish, onClose, onNavigateRestaurant, onRedeem, onNavigateGPS }) => {
  if (!dish) return null;

  const creditColor = getCreditColorClass(dish.credits);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="absolute inset-0" 
        onClick={onClose} 
      />
      <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl relative z-10 animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300">
        
        {/* Header Image */}
        <div className="relative h-48 w-full">
           <img 
             src={dish.image} 
             onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
             alt={dish.name} 
             className="w-full h-full object-cover" 
           />
           <button 
             onClick={onClose}
             className="absolute top-4 right-4 bg-black/40 text-white p-2 rounded-full backdrop-blur-md hover:bg-black/60"
           >
             <X className="w-5 h-5" />
           </button>
           <div className="absolute bottom-4 left-4">
              <span className={`${creditColor} text-white text-xs font-bold px-3 py-1 rounded-lg shadow-lg`}>
                {dish.credits} Créditos
              </span>
           </div>
        </div>

        <div className="p-6">
           <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 leading-tight">{dish.name}</h3>
           <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 flex items-center gap-2">
              <Store className="w-3.5 h-3.5" />
              {dish.restaurantName} 
              <span className="text-gray-300">•</span> 
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {dish.distance?.toFixed(1)} km</span>
           </p>

           <div className="space-y-3">
              <button 
                onClick={onNavigateRestaurant}
                className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                 <Store className="w-5 h-5 text-gray-500" />
                 Ver Restaurante
              </button>

              <button 
                onClick={onRedeem}
                className="w-full bg-brand-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20"
              >
                 <QrCode className="w-5 h-5" />
                 Gerar Voucher (QR)
              </button>

              <button 
                onClick={onNavigateGPS}
                className="w-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
              >
                 <Navigation className="w-5 h-5" />
                 Como Chegar (GPS)
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};


export const Home: React.FC = () => {
  const { user, openScanner, userLocation, requestUserLocation, completeOnboarding } = useApp();
  const navigate = useNavigate();
  
  // State for rotating phrases
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeProp, setFadeProp] = useState('opacity-100');
  const [isLocating, setIsLocating] = useState(false);
  
  // State for Tutorial
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [tutorialMode, setTutorialMode] = useState<'help' | 'onboarding'>('help');

  // State for Dish Actions Modal
  const [selectedDish, setSelectedDish] = useState<any>(null);

  const handleCloseTutorial = () => {
    setIsTutorialOpen(false);
    // Se estava no modo onboarding, marca como concluído no contexto/localStorage
    if (tutorialMode === 'onboarding') {
        completeOnboarding();
    }
  };

  const openIntro = () => {
    setTutorialMode('onboarding');
    setIsTutorialOpen(true);
  };

  const openHowTo = () => {
    setTutorialMode('help');
    setIsTutorialOpen(true);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Start fade out
      setFadeProp('opacity-0');
      
      setTimeout(() => {
        // Change text and fade in
        setCurrentIndex((prev) => (prev + 1) % HERO_DATA.length);
        setFadeProp('opacity-100');
      }, 500); // Wait for fade out to finish (500ms matches duration-500)

    }, 8000); // 8 seconds total cycle

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

    // Achatar a lista de pratos e manter referência ao restaurante pai
    return restaurantsWithDistance.flatMap(r => 
      r.menu.map(dish => ({
        ...dish,
        restaurantId: r.id,
        restaurantName: r.name,
        restaurantRating: r.rating,
        restaurantLat: r.lat,
        restaurantLng: r.lng,
        distance: r.distance
      }))
    ).slice(0, 6); // Pegar os top 6
  }, [userLocation]);

  const currentHero = HERO_DATA[currentIndex];

  const hasSubscription = user.subscriptionStatus !== 'none';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-6"> {/* Reduced padding bottom */}
      
      {/* --- HERO SECTION --- */}
      <div className="relative h-[300px] w-full">
        <img 
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
          alt="Banquete DISHpass" 
          className="w-full h-full object-cover brightness-[0.50]"
        />
        
        {/* Overlay Gradient - Darker for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/30 to-gray-50 dark:to-gray-950" />

        {/* Content Layer */}
        <div className="absolute inset-0 flex flex-col p-6 pt-12">
          
          {/* Top Bar */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/90 text-2xl font-bold italic tracking-wider ml-1 -mb-2 drop-shadow-md">Meu</p>
              <h1 className="font-black text-white tracking-tighter leading-none drop-shadow-xl flex items-baseline">
                <span className="text-7xl sm:text-8xl">DISH</span>
                <span className="text-brand-500 text-4xl sm:text-5xl ml-1 drop-shadow-lg">pass</span>
              </h1>
            </div>

            <div className="flex flex-col gap-2 items-end">
              {/* Credits Pill */}
              <button 
                onClick={() => navigate('/credits')}
                className="bg-black/30 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 flex items-center gap-2 text-white hover:bg-black/40 transition-colors mb-1"
              >
                <Wallet className="w-4 h-4" />
                <span className="font-bold text-lg">{user.credits}</span>
              </button>
              
              {/* BOTÃO 1: O QUE É (Texto) - Abre Onboarding */}
              <div className="relative group">
                <button 
                  onClick={openIntro}
                  className="bg-black/20 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 text-white text-[10px] font-bold uppercase hover:bg-black/30 transition-colors"
                >
                  o que é DISHpass
                </button>
                
                {/* TOOLTIP: Apenas para novos usuários (sem assinatura) */}
                {!user.hasSeenOnboarding && !hasSubscription && (
                    <div className="absolute top-full right-0 mt-2 w-28 bg-brand-500 text-white text-[9px] font-extrabold p-2 rounded-lg shadow-xl animate-bounce z-10 text-center uppercase tracking-wide border border-white/20 after:content-[''] after:absolute after:bottom-full after:right-3 after:border-4 after:border-transparent after:border-b-brand-500">
                      CONHEÇA O DISHPASS AQUI
                    </div>
                )}
              </div>

              {/* BOTÃO 2: COMO USAR (Texto) - Abre Ajuda Prática */}
              <div className="relative group">
                <button 
                  onClick={openHowTo}
                  className="bg-black/20 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 text-white text-[10px] font-bold uppercase hover:bg-black/30 transition-colors"
                >
                  como usar
                </button>
                
                {/* TOOLTIP: Apenas para assinantes que ainda não viram o tutorial */}
                {!user.hasSeenOnboarding && hasSubscription && (
                    <div className="absolute top-full right-0 mt-2 w-24 bg-blue-500 text-white text-[9px] font-extrabold p-2 rounded-lg shadow-xl animate-bounce z-10 text-center uppercase tracking-wide border border-white/20 after:content-[''] after:absolute after:bottom-full after:right-3 after:border-4 after:border-transparent after:border-b-blue-500">
                      COMEÇAR
                    </div>
                )}
              </div>

            </div>
          </div>

          {/* Hero Title (Frases de Ação) - Centered */}
          <div className="flex-1 w-full flex items-start justify-center pt-8">
             <div className={`w-full max-w-2xl px-4 py-2 flex items-center justify-center gap-1 transition-opacity duration-500 ${fadeProp} bg-gradient-to-r from-transparent via-black/40 to-transparent backdrop-blur-[1px] rounded-full`}>
                <span className="text-3xl sm:text-4xl filter drop-shadow-lg animate-in zoom-in spin-in-12 duration-500 leading-none">
                  {currentHero.emoji}
                </span>
                <h2 className="text-xl sm:text-3xl font-bold text-white leading-tight text-center drop-shadow-xl pb-1">
                  {currentHero.text}
                </h2>
             </div>
          </div>
        </div>
      </div>

      {/* --- ACTION CARDS (Negative Margin) --- */}
      <div className="-mt-20 px-6 relative z-10">
        <div className="grid grid-cols-2 gap-4">
          
          {/* Orange Card: Restaurants */}
          <button 
            onClick={() => navigate('/restaurants')}
            className="bg-orange-500/80 dark:bg-orange-600/60 backdrop-blur-xl hover:bg-orange-500/90 border border-white/20 text-white rounded-[2rem] p-5 h-36 flex flex-col justify-between shadow-xl shadow-orange-500/20 transition-all active:scale-95 text-left group"
          >
            <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md group-hover:bg-white/30 transition-colors">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Explorar<br/>Locais</h3>
              <p className="text-xs text-orange-50 mt-1 opacity-90 font-medium">Novos sabores</p>
            </div>
          </button>

          {/* Green Card: Credits/QR - Open Scanner Modal */}
          <button 
            onClick={() => openScanner('redeem')}
            className="bg-emerald-600/80 dark:bg-emerald-600/60 backdrop-blur-xl hover:bg-emerald-600/90 border border-white/20 text-white rounded-[2rem] p-5 h-36 flex flex-col justify-between shadow-xl shadow-green-500/20 transition-all active:scale-95 text-left group"
          >
            <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md group-hover:bg-white/30 transition-colors">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Usar<br/>Créditos</h3>
              <p className="text-xs text-emerald-50 mt-1 opacity-90 font-medium">Escanear QR</p>
            </div>
          </button>
        </div>
      </div>

      {/* --- REFERRAL BANNER (Compact Blue - Styled like Action Cards) --- */}
      <div className="px-6 mt-8">
        <div className="bg-blue-600/80 dark:bg-blue-600/60 backdrop-blur-xl border border-white/20 rounded-[2rem] p-6 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden flex items-center justify-between group">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl group-hover:bg-white/30 transition-colors"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

          <div className="relative z-10 flex-1 mr-4">
            <div className="flex items-center gap-3 mb-1">
               <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform">
                  <Gift className="w-5 h-5" />
               </div>
               <div>
                  <h3 className="text-lg font-bold leading-tight">Indique e Ganhe</h3>
                  <p className="text-blue-50 text-xs font-medium opacity-90">
                    Ganhe créditos bônus.
                  </p>
               </div>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/referrals')}
            className="relative z-10 bg-white/20 hover:bg-white/30 border border-white/40 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-sm backdrop-blur-sm transition-all active:scale-95 whitespace-nowrap"
          >
            Convidar
          </button>
        </div>
      </div>

      {/* --- NEAREST DISHES --- */}
      <div className="mt-8 pb-8">
        <div className="px-6 flex justify-between items-end mb-4">
          <div>
             <h3 className="text-xl font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
               Pratos da Região
             </h3>
             <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1" onClick={handleLocationClick}>
                <MapPin className="w-3.5 h-3.5" />
                {userLocation ? (
                  <span>Próximo a você</span>
                ) : (
                  <span>Localização aproximada</span>
                )}
                <button 
                  onClick={(e) => { e.stopPropagation(); handleLocationClick(); }}
                  className={`ml-1 p-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${isLocating ? 'animate-spin' : ''}`}
                >
                  <RefreshCw className="w-3.5 h-3.5 text-brand-500" />
                </button>
             </div>
          </div>
          <button onClick={() => navigate('/restaurants')} className="text-brand-500 font-bold text-sm flex items-center hover:text-brand-600 mb-1">
            Ver Todos <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex overflow-x-auto gap-4 px-6 pb-4 no-scrollbar snap-x">
          {displayedDishes.map((dish, idx) => (
             <div 
               key={`${dish.id}-${idx}`}
               onClick={() => setSelectedDish(dish)} // Open Action Modal instead of navigating
               className="min-w-[240px] bg-white dark:bg-gray-900 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 snap-center active:scale-[0.98] transition-transform flex flex-col justify-between cursor-pointer"
             >
                <div>
                  <div className="relative h-32 rounded-2xl overflow-hidden mb-3">
                    <img 
                      src={dish.image} 
                      onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                      className="w-full h-full object-cover" 
                      alt={dish.name} 
                    />
                    <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-bold text-gray-900">{dish.restaurantRating}</span>
                    </div>
                    <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Navigation className="w-3 h-3" />
                        {dish.distance > 0 ? `${dish.distance.toFixed(1)} km` : '...'}
                    </div>
                  </div>
                  
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg truncate mb-1 leading-tight">{dish.name}</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-xs truncate mb-3">{dish.restaurantName}</p>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                   {/* EVIDENCED CREDIT PILL - DYNAMIC COLOR */}
                   <div className={`${getCreditColorClass(dish.credits)} text-white px-3 py-2 rounded-xl shadow-md flex items-baseline gap-1.5 transition-colors`}>
                     <span className="text-xl font-black leading-none">{dish.credits}</span>
                     <span className="text-[10px] font-bold uppercase opacity-90 leading-none">créditos</span>
                   </div>
                   
                   <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                      <ChevronRight className="w-4 h-4" />
                   </div>
                </div>
             </div>
          ))}
        </div>
      </div>

      {/* DISH ACTIONS MODAL */}
      <DishActionModal 
        dish={selectedDish} 
        onClose={() => setSelectedDish(null)}
        onNavigateRestaurant={() => {
           setSelectedDish(null);
           navigate(`/restaurant/${selectedDish.restaurantId}`);
        }}
        onRedeem={() => {
           setSelectedDish(null);
           openScanner('redeem', selectedDish.restaurantId, selectedDish.id);
        }}
        onNavigateGPS={() => {
           if(selectedDish) {
              window.open(`https://www.google.com/maps/search/?api=1&query=${selectedDish.restaurantLat},${selectedDish.restaurantLng}`, '_blank');
           }
        }}
      />

      {/* TUTORIAL MODAL */}
      <TutorialOverlay isOpen={isTutorialOpen} onClose={handleCloseTutorial} mode={tutorialMode} />
    </div>
  );
};
