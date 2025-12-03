
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, MapPin, Clock, Wifi, Dog, QrCode, Navigation, Info, Car, Music } from 'lucide-react';
import { MOCK_RESTAURANTS } from '../constants';
import { useApp } from '../context';
import { X } from 'lucide-react';

export const RestaurantDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const restaurant = MOCK_RESTAURANTS.find(r => r.id === id);
  const { user } = useApp();

  const [selectedDish, setSelectedDish] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);

  if (!restaurant) return <div>Restaurant not found</div>;

  const handleRedeem = (dishId: string) => {
    setSelectedDish(dishId);
    setShowQR(true);
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
      
      {/* 1. Header Image (Expanded) */}
      <div className="relative h-72">
        <img 
          src={restaurant.image} 
          className="w-full h-full object-cover" 
          alt="Restaurant Cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 bg-white/30 backdrop-blur-md p-2.5 rounded-full text-white hover:bg-white/50 border border-white/20 shadow-lg"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      {/* 2. Main Content Sheet */}
      <div className="-mt-10 bg-white dark:bg-gray-950 rounded-t-[2.5rem] relative z-10 px-6 pt-8 pb-10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        
        {/* Title & Rating */}
        <div className="flex justify-between items-start mb-2">
          <div>
             <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight mb-2">
               {restaurant.name}
             </h1>
             <span className="bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
               {restaurant.category}
             </span>
          </div>
          <div className="flex flex-col items-center bg-yellow-50 dark:bg-yellow-900/20 px-3 py-2 rounded-xl border border-yellow-100 dark:border-yellow-900/50">
            <div className="flex items-center gap-1">
               <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
               <span className="text-xl font-bold text-yellow-700 dark:text-yellow-500">{restaurant.rating}</span>
            </div>
            <span className="text-[10px] text-yellow-600/70 dark:text-yellow-600 font-medium">Avaliação</span>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6 mt-4">
          {restaurant.description || "Uma experiência gastronômica única esperando por você."}
        </p>

        {/* Info Cards Grid (Address & Hours) */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
             <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 mb-2">
               <MapPin className="w-4 h-4" />
             </div>
             <p className="text-xs text-gray-400 font-bold uppercase mb-1">Endereço</p>
             <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 line-clamp-3">
               {restaurant.address}
             </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
             <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 mb-2">
               <Clock className="w-4 h-4" />
             </div>
             <p className="text-xs text-gray-400 font-bold uppercase mb-1">Horário</p>
             <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
               {restaurant.openingHours || "12:00 - 23:00"}
             </p>
          </div>
        </div>

        {/* Services */}
        {restaurant.services && restaurant.services.length > 0 && (
          <div className="mb-8">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3">Serviços</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {restaurant.services.map((service, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 rounded-xl border border-gray-100 dark:border-gray-700 whitespace-nowrap">
                  <span className="text-gray-500 dark:text-gray-400">{getServiceIcon(service)}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{service}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Menu Section */}
        <div>
          <div className="flex justify-between items-end mb-4">
             <h2 className="font-bold text-2xl text-gray-900 dark:text-white">Cardápio</h2>
             <div className="flex gap-2">
                <span className="text-xs font-semibold text-gray-400">Econômico (1cr)</span>
                <span className="text-xs font-semibold text-gray-900 dark:text-white border-b-2 border-brand-500">Padrão (2cr)</span>
                <span className="text-xs font-semibold text-gray-400">Premium (3cr)</span>
             </div>
          </div>

          <div className="space-y-4">
            {restaurant.menu.map(dish => (
              <div key={dish.id} className="bg-white dark:bg-gray-900 rounded-2xl p-3 border border-gray-100 dark:border-gray-800 shadow-sm flex gap-4">
                {/* Image */}
                <div className="w-24 h-24 flex-shrink-0">
                  <img src={dish.image} className="w-full h-full object-cover rounded-xl" alt={dish.name} />
                </div>
                
                {/* Content */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                       <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight mb-1">{dish.name}</h3>
                       <div className="bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap ml-2">
                         {dish.credits} crédito{dish.credits > 1 ? 's' : ''}
                       </div>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{dish.description}</p>
                  </div>
                  
                  {/* Action Button */}
                  <button 
                    onClick={() => handleRedeem(dish.id)}
                    className="mt-3 w-full bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <QrCode className="w-3 h-3" />
                    Gerar QR
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Location Footer */}
        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
           <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Localização</h3>
           <p className="text-sm text-gray-500 mb-4">{restaurant.address}</p>
           <button 
             onClick={openGoogleMaps}
             className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
           >
             <Navigation className="w-4 h-4" />
             Abrir no Google Maps
           </button>
        </div>

      </div>

      {/* QR Code Modal */}
      {showQR && selectedDish && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-gray-900 w-full max-w-xs rounded-3xl p-6 text-center animate-in zoom-in-95 relative shadow-2xl">
             <button 
               onClick={() => setShowQR(false)} 
               className="absolute top-4 right-4 w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900"
             >
               <X className="w-5 h-5" />
             </button>
             
             <h3 className="text-xl font-bold mb-1 dark:text-white">Apresente ao Caixa</h3>
             <p className="text-xs text-gray-500 mb-6">Validação para: <span className="font-bold text-gray-700 dark:text-gray-300">{restaurant.menu.find(d => d.id === selectedDish)?.name}</span></p>
             
             <div className="bg-white p-4 rounded-2xl shadow-inner border border-gray-100 inline-block mx-auto mb-6">
               <img 
                 src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${JSON.stringify({ userId: user.id, restaurantId: restaurant.id, dishId: selectedDish })}`} 
                 alt="QR Code" 
                 className="w-48 h-48 mix-blend-multiply"
               />
             </div>
             
             <div className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-lg text-xs font-bold inline-block">
               Válido por 15 minutos
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
