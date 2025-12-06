
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, MapPin, Clock, Wifi, Dog, QrCode, Navigation, Info, Car, Music, X } from 'lucide-react';
import { MOCK_RESTAURANTS } from '../constants';
import { useApp } from '../context';
import { ReviewGallery } from '../components/ReviewComponents';

const checkIsOpen = (hoursStr: string) => {
  if (!hoursStr) return false;
  
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  const intervals = hoursStr.split(',').map(s => s.trim());
  
  return intervals.some(interval => {
    const parts = interval.split('-').map(s => s.trim());
    if (parts.length !== 2) return false;
    
    const [startStr, endStr] = parts;
    const parseMinutes = (t: string) => {
       const [h, m] = t.split(':').map(Number);
       return h * 60 + (m || 0);
    };
    
    const start = parseMinutes(startStr);
    const end = parseMinutes(endStr);
    
    if (end < start) { 
       return currentMinutes >= start || currentMinutes <= end;
    }
    return currentMinutes >= start && currentMinutes <= end;
  });
};

// Helper para cor do badge de crédito
const getCreditColorClass = (credits: number) => {
  if (credits === 1) return 'bg-emerald-500 shadow-emerald-500/20';
  if (credits === 2) return 'bg-blue-600 shadow-blue-600/20';
  return 'bg-purple-600 shadow-purple-600/20';
};

export const RestaurantDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const restaurant = MOCK_RESTAURANTS.find(r => r.id === id);
  const { user, getRestaurantRating, openScanner } = useApp();

  const [selectedDish, setSelectedDish] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [showReviewsGallery, setShowReviewsGallery] = useState(false);

  if (!restaurant) return <div>Restaurant not found</div>;

  const isOpen = checkIsOpen(restaurant.openingHours);
  
  // Nota dinâmica baseada nas avaliações
  const dynamicRating = getRestaurantRating(restaurant.id);

  const handleRedeem = (dishId: string) => {
    // Abre o scanner real via contexto para fluxo completo
    // Se fosse apenas simulação visual: setSelectedDish(dishId); setShowQR(true);
    openScanner('redeem', restaurant.id, dishId);
  };

  const getServiceIcon = (service: string) => {
    const s = service.toLowerCase();
    if (s.includes('wifi') || s.includes('wi-fi')) return <Wifi className="w-4 h-4" />;
    if (s.includes('pet') || s.includes('dog')) return <Dog className="w-4 h-4" />;
    if (s.includes('estacionamento') || s.includes('valet')) return <Car className="w-4 h-4" />;
    if (s.includes('música') || s.includes('som')) return <Music className="w-4 h-4" />;
    return <Info className="w-4 h-4" />;
  };

  const openGoogleMaps = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${restaurant.lat},${restaurant.lng}`, '_blank');
  };

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen pb-20">
      
      {/* 1. Header Image */}
      <div className="relative h-72">
        <img 
          src={restaurant.image} 
          className={`w-full h-full object-cover brightness-[0.65] ${!isOpen ? 'grayscale-[0.5]' : ''}`} 
          alt="Restaurant Cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-white dark:to-gray-950" />
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-5 left-5 bg-white/30 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/50 border border-white/20 shadow-lg"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>
      </div>

      {/* 2. Main Content Sheet */}
      <div className="-mt-10 bg-white dark:bg-gray-950 rounded-t-[2.5rem] relative z-10 px-6 pt-10 pb-12 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        
        {/* Title & Rating */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1 pr-4">
             <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight mb-2">
               {restaurant.name}
             </h1>
             <div className="flex items-center gap-2">
                <span className="bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-sm font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  {restaurant.category}
                </span>
                <span className={`${isOpen ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'} text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5`}>
                   {isOpen ? (
                     <>
                       <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div> Aberto
                     </>
                   ) : (
                     'Fechado'
                   )}
                </span>
             </div>
          </div>
          
          {/* RATING BUTTON - Abre Galeria */}
          <button 
             onClick={() => setShowReviewsGallery(true)}
             className="flex flex-col items-center bg-yellow-50 dark:bg-yellow-900/20 px-3 py-2 rounded-xl border border-yellow-100 dark:border-yellow-900/50 flex-shrink-0 active:scale-95 transition-transform"
          >
            <div className="flex items-center gap-1.5">
               <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
               <span className="text-2xl font-bold text-yellow-700 dark:text-yellow-500">{dynamicRating}</span>
            </div>
            <span className="text-xs text-yellow-600/70 dark:text-yellow-600 font-bold mt-1 underline">Ver fotos</span>
          </button>
        </div>
        
        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-8">
          {restaurant.description || "Uma experiência gastronômica única esperando por você."}
        </p>

        {/* --- COMPACT INFO CARD --- */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 mb-10 border border-gray-100 dark:border-gray-800 space-y-5">
           <div className="flex items-start gap-3 border-b border-gray-200 dark:border-gray-800 pb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">
                 <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1">
                 <p className="text-xs text-gray-400 font-bold uppercase mb-1">Endereço</p>
                 <p className="text-base font-bold text-gray-800 dark:text-gray-200 leading-tight">
                    {restaurant.address}
                 </p>
                 <button onClick={openGoogleMaps} className="text-brand-500 text-sm font-bold mt-1.5 flex items-center gap-1">
                    Ver no mapa <Navigation className="w-3 h-3" />
                 </button>
              </div>
           </div>

           <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 flex-shrink-0 mt-0.5">
                 <Clock className="w-5 h-5" />
              </div>
              <div className="flex-1">
                 <p className="text-xs text-gray-400 font-bold uppercase mb-1">Funcionamento</p>
                 <div className="flex items-center flex-wrap gap-2">
                    <p className="text-base font-bold text-gray-800 dark:text-gray-200 leading-tight">
                        {restaurant.openingHours || "12:00 - 23:00"}
                    </p>
                 </div>
                 
                 {/* Services Tags Inline */}
                 {restaurant.services && restaurant.services.length > 0 && (
                   <div className="flex flex-wrap gap-2 mt-3">
                      {restaurant.services.map((service, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 bg-white dark:bg-gray-800 px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                           <span className="text-gray-500 dark:text-gray-400">{getServiceIcon(service)}</span>
                           <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{service}</span>
                        </div>
                      ))}
                   </div>
                 )}
              </div>
           </div>
        </div>

        {/* Menu Section */}
        <div>
          <div className="flex justify-between items-end mb-6 sticky top-0 bg-white dark:bg-gray-950 z-20 py-4">
             <h2 className="font-extrabold text-3xl text-gray-900 dark:text-white">Cardápio</h2>
             <span className="text-sm font-bold text-brand-500 bg-brand-50 dark:bg-brand-900/20 px-3 py-1 rounded-full">
                {restaurant.menu.length} opções
             </span>
          </div>

          <div className="space-y-6">
            {restaurant.menu.map(dish => (
              <div key={dish.id} className="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-lg shadow-gray-200/50 dark:shadow-none flex flex-col sm:flex-row gap-5 relative overflow-hidden group">
                {/* Image */}
                <div className="w-full sm:w-32 h-48 sm:h-32 flex-shrink-0 relative">
                  <img src={dish.image} className="w-full h-full object-cover rounded-2xl shadow-sm" alt={dish.name} />
                  
                  {/* Credit Badge Overlay on Image - DYNAMIC COLOR */}
                  <div className={`absolute top-2 right-2 ${getCreditColorClass(dish.credits)} text-white rounded-xl px-3 py-1.5 shadow-lg min-w-[3.5rem] flex flex-col items-center justify-center`}>
                      <span className="text-xl font-black leading-none">{dish.credits}</span>
                      <span className="text-[9px] font-bold uppercase opacity-90 leading-none mt-0.5">cr</span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-xl leading-tight mb-2 pr-2">{dish.name}</h3>
                    <p className="text-base text-gray-500 line-clamp-3 leading-relaxed mb-4">{dish.description}</p>
                  </div>
                  
                  {/* Action Button */}
                  <button 
                    onClick={() => handleRedeem(dish.id)}
                    className="w-full bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 text-base font-bold py-4 rounded-xl flex items-center justify-center gap-2.5 transition-colors shadow-md"
                  >
                    <QrCode className="w-5 h-5" />
                    Gerar Voucher
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* QR Code Modal (Visual - usado se não abrir scanner direto) */}
      {showQR && selectedDish && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[2rem] p-8 text-center animate-in zoom-in-95 relative shadow-2xl">
             <button 
               onClick={() => setShowQR(false)} 
               className="absolute top-5 right-5 w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900"
             >
               <X className="w-6 h-6" />
             </button>
             
             <h3 className="text-2xl font-bold mb-2 dark:text-white">Apresente ao Caixa</h3>
             <p className="text-base text-gray-500 mb-8">Validação para: <span className="font-bold text-gray-800 dark:text-gray-200">{restaurant.menu.find(d => d.id === selectedDish)?.name}</span></p>
             
             <div className="bg-white p-5 rounded-3xl shadow-inner border border-gray-100 inline-block mx-auto mb-8">
               <img 
                 src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${JSON.stringify({ userId: user.id, restaurantId: restaurant.id, dishId: selectedDish })}`} 
                 alt="QR Code" 
                 className="w-56 h-56 mix-blend-multiply"
               />
             </div>
          </div>
        </div>
      )}

      {/* Galeria de Reviews */}
      <ReviewGallery 
        restaurantId={restaurant.id}
        isOpen={showReviewsGallery}
        onClose={() => setShowReviewsGallery(false)}
      />

    </div>
  );
};
