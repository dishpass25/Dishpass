
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Map, Star, MapPin, Navigation, Loader2, Clock, X } from 'lucide-react';
import { MOCK_RESTAURANTS } from '../constants';
import { RestaurantMap } from '../components/RestaurantMap';
import { useApp } from '../context';
import { ReviewGallery } from '../components/ReviewComponents';

const CATEGORIES = ['Todos', 'Brasileira', 'Italiana', 'Japonesa', 'Mexicana', 'Lanches'];
const CREDIT_FILTERS = ['Todos', '1 Crédito', '2 Créditos', '3 Créditos'];

// Função auxiliar para calcular distância (Haversine)
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  var R = 6371; // Raio da terra em km
  var dLat = deg2rad(lat2-lat1);
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distância em km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI/180)
}

// Helper para cor do texto de crédito
const getCreditTextColorClass = (credits: number) => {
  if (credits === 1) return 'text-emerald-500';
  if (credits === 2) return 'text-blue-600';
  return 'text-purple-600';
};

// Função para verificar se está aberto agora
const checkIsOpen = (hoursStr: string) => {
  if (!hoursStr) return false;
  
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  // Suporta múltiplos intervalos separados por vírgula (ex: "12:00 - 15:00, 19:00 - 23:00")
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
    
    // Caso cruze a meia-noite (ex: 18:00 - 01:00)
    if (end < start) { 
       return currentMinutes >= start || currentMinutes <= end;
    }
    // Caso normal (ex: 10:00 - 22:00)
    return currentMinutes >= start && currentMinutes <= end;
  });
};

export const Restaurants: React.FC = () => {
  const navigate = useNavigate();
  const { userLocation, requestUserLocation, getRestaurantRating } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const isMapOpen = searchParams.get('map') === 'true';

  const [activeCategory, setActiveCategory] = useState('Todos');
  const [activeCredit, setActiveCredit] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false); // Estado para controlar visibilidade da busca
  const [isLocating, setIsLocating] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now()); // State para forçar re-render a cada minuto
  
  // State para controle da galeria na lista
  const [selectedGalleryRestaurant, setSelectedGalleryRestaurant] = useState<string | null>(null);

  // Atualiza o relógio interno a cada minuto para manter o status Aberto/Fechado atualizado
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Tenta obter a localização ao montar a tela para ordenar
  useEffect(() => {
    requestUserLocation();
  }, []);

  const handleEnableLocation = async () => {
    setIsLocating(true);
    await requestUserLocation();
    setTimeout(() => setIsLocating(false), 500);
  };
  
  // Prepara e Ordena os Restaurantes
  const sortedRestaurants = useMemo(() => {
    const data = MOCK_RESTAURANTS.map(r => {
        let distance = undefined;
        if (userLocation) {
            distance = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, r.lat, r.lng);
        }
        return { ...r, distance };
    });

    if (userLocation) {
        data.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }
    
    return data;
  }, [userLocation]);
  
  // Lógica de Filtragem
  const filteredRestaurants = sortedRestaurants.filter(r => {
    const matchesCategory = activeCategory === 'Todos' || r.category === activeCategory || (activeCategory === 'Brasileira' && r.category === 'Brazilian') || (activeCategory === 'Lanches' && r.category === 'American');
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const minDishCredits = Math.min(...r.menu.map(d => d.credits));
    let matchesCredit = true;
    if (activeCredit === '1 Crédito') matchesCredit = minDishCredits === 1;
    if (activeCredit === '2 Créditos') matchesCredit = minDishCredits === 2;
    if (activeCredit === '3 Créditos') matchesCredit = minDishCredits === 3;

    return matchesCategory && matchesSearch && matchesCredit;
  });

  return (
    <div className="min-h-screen bg-brand-50/30 dark:bg-gray-950 pb-24">
      
      {/* Header Hero Area - Updated to match Home/Profile style */}
      <div className="relative h-72 w-full overflow-hidden mb-2">
        <img 
          src="https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
          alt="Header" 
          className="absolute inset-0 w-full h-full object-cover brightness-[0.60]"
        />
        {/* Gradient blends to bg-brand-50/30 (light mode) and bg-gray-950 (dark mode) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-brand-50/30 dark:to-gray-950" />
        
        <div className="absolute bottom-8 left-6 right-6 space-y-4">
          <div className="flex justify-between items-end">
            <h1 className="text-5xl sm:text-7xl font-black text-white drop-shadow-xl tracking-tighter leading-none">Restaurantes</h1>
            
            {/* Botão/Badge de Localização */}
            {userLocation ? (
                <div className="text-white/80 text-xs font-medium flex items-center gap-1 mb-1 bg-black/30 px-2 py-1 rounded-lg backdrop-blur-sm border border-white/10">
                    <Navigation className="w-3 h-3 text-brand-500" />
                    Ordenado por proximidade
                </div>
            ) : (
                <button 
                  onClick={handleEnableLocation}
                  disabled={isLocating}
                  className="text-white text-xs font-bold flex items-center gap-1.5 mb-1 bg-brand-600/90 hover:bg-brand-500 px-3 py-1.5 rounded-lg backdrop-blur-sm shadow-lg transition-colors border border-white/10 active:scale-95"
                >
                    {isLocating ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin text-white" />
                        Localizando...
                      </>
                    ) : (
                      <>
                        <MapPin className="w-3 h-3 text-white" />
                        Ativar localização
                      </>
                    )}
                </button>
            )}
          </div>
          
          <div className="flex gap-2 h-12">
            {isSearchOpen ? (
              // Barra de Pesquisa Aberta (Expandida)
              <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl flex items-center px-4 py-2 shadow-xl backdrop-blur-sm bg-opacity-95 animate-in slide-in-from-right-10 duration-300">
                <Search className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
                <input 
                  autoFocus
                  type="text"
                  placeholder="Buscar restaurante..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 w-full text-base font-medium"
                />
                <button 
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchTerm('');
                  }}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              // Modo Padrão: Botão de Pesquisa Pequeno + Botão Mapa Grande
              <>
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="bg-white dark:bg-gray-800 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg text-gray-700 dark:text-white backdrop-blur-sm bg-opacity-95 active:scale-95 transition-transform hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700"
                >
                  <Search className="w-5 h-5" />
                </button>

                <button 
                  onClick={() => setSearchParams({ map: 'true' })}
                  className="flex-1 bg-white dark:bg-gray-800 px-5 rounded-xl flex items-center justify-center gap-2 shadow-lg text-gray-700 dark:text-white font-medium text-base backdrop-blur-sm bg-opacity-95 active:scale-95 transition-transform hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700"
                >
                  <Map className="w-5 h-5" />
                  Ver no Mapa
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Filters Container */}
      <div className="px-6 space-y-6">
        
        {/* Categories */}
        <div className="space-y-3">
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider ml-1">Categorias</h3>
          <div className="flex overflow-x-auto gap-3 no-scrollbar pb-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all shadow-sm ${
                  activeCategory === cat
                    ? 'bg-brand-500 text-white shadow-brand-500/30'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Credits Filter */}
        <div className="space-y-3">
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider ml-1">Créditos</h3>
          <div className="flex overflow-x-auto gap-3 no-scrollbar pb-1">
            {CREDIT_FILTERS.map(filter => {
              // Lógica de cores para os botões de filtro
              let activeClass = 'bg-brand-500 text-white shadow-brand-500/30';
              if (filter === '1 Crédito') activeClass = 'bg-emerald-500 text-white shadow-emerald-500/30';
              if (filter === '2 Créditos') activeClass = 'bg-blue-600 text-white shadow-blue-600/30';
              if (filter === '3 Créditos') activeClass = 'bg-purple-600 text-white shadow-purple-600/30';

              return (
                <button
                  key={filter}
                  onClick={() => setActiveCredit(filter)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all shadow-sm ${
                    activeCredit === filter
                      ? activeClass
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        <p className="text-gray-500 text-base ml-1 font-medium">
          {filteredRestaurants.length} restaurantes encontrados
        </p>

        {/* Restaurant Cards */}
        <div className="space-y-6">
          {filteredRestaurants.map(restaurant => {
            const minCredits = Math.min(...restaurant.menu.map(d => d.credits));
            const isOpen = checkIsOpen(restaurant.openingHours);
            const dynamicRating = getRestaurantRating(restaurant.id);
            const creditTextColor = getCreditTextColorClass(minCredits);

            return (
              <div 
                key={restaurant.id}
                onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                className="group bg-white dark:bg-gray-900 rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-800"
              >
                {/* Image Section */}
                <div className="relative h-48">
                  <img 
                    src={restaurant.image} 
                    alt={restaurant.name} 
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${!isOpen ? 'grayscale-[0.5]' : ''}`}
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                  
                  {/* Category & Status Badges */}
                  <div className="absolute top-4 left-4 z-20 flex flex-col items-start gap-2">
                     <span className="bg-brand-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg uppercase tracking-wider">
                        {restaurant.category}
                     </span>
                     
                     {/* Status Pill */}
                     <span className={`${isOpen ? 'bg-green-500' : 'bg-red-500'} text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-lg uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md bg-opacity-90`}>
                        {isOpen ? (
                          <>
                             <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div> Aberto
                          </>
                        ) : (
                          <>Fechado</>
                        )}
                     </span>
                  </div>
                  
                  {/* Rating Badge - CLICKABLE FOR GALLERY */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Impede navegação para a página de detalhes
                      setSelectedGalleryRestaurant(restaurant.id);
                    }}
                    className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg active:scale-95 transition-transform hover:bg-white"
                  >
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-base font-bold text-gray-900">{dynamicRating}</span>
                  </button>

                  {/* Title inside image */}
                  <div className="absolute bottom-5 left-5 right-5 z-20">
                    <h3 className="text-3xl font-bold text-white mb-1 leading-tight shadow-black/50 drop-shadow-md">{restaurant.name}</h3>
                  </div>
                </div>

                {/* Footer Section */}
                <div className="p-5 flex justify-between items-center relative bg-white dark:bg-gray-900">
                  
                  <div className="flex flex-col gap-0.5">
                    {restaurant.distance !== undefined ? (
                      <div className="flex items-center gap-1.5 text-gray-900 dark:text-white">
                        <Navigation className="w-5 h-5 text-brand-500 fill-brand-500" />
                        <span className="font-black text-lg">{restaurant.distance.toFixed(1)} km</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <MapPin className="w-5 h-5" />
                        <span className="font-bold text-sm">-- km</span>
                      </div>
                    )}
                    <span className="text-xs text-gray-400 font-medium line-clamp-1 max-w-[150px]">
                        {restaurant.address} 
                    </span>
                  </div>
                  
                  <div className="flex flex-col items-end pl-4 border-l border-gray-100 dark:border-gray-800">
                     <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">A partir de</span>
                     <div className="flex items-baseline gap-1">
                        <span className={`text-3xl font-black ${creditTextColor} leading-none`}>{minCredits}</span>
                        <span className={`text-xs font-bold ${creditTextColor} uppercase`}>créditos</span>
                     </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {filteredRestaurants.length === 0 && (
            <div className="text-center py-10 bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
              <p className="text-gray-400 font-medium text-lg">Nenhum restaurante encontrado.</p>
              <button onClick={() => {setActiveCategory('Todos'); setSearchTerm('')}} className="mt-3 text-brand-500 text-base font-bold">Limpar Filtros</button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Mapa Global */}
      {isMapOpen && (
        <RestaurantMap 
          restaurants={filteredRestaurants} 
          onClose={() => {
            searchParams.delete('map');
            setSearchParams(searchParams);
          }} 
        />
      )}

      {/* Galeria de Reviews (Acessível da Lista) */}
      <ReviewGallery 
        restaurantId={selectedGalleryRestaurant || ''}
        isOpen={!!selectedGalleryRestaurant}
        onClose={() => setSelectedGalleryRestaurant(null)}
      />
    </div>
  );
};
