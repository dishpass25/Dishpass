import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Map, Star, MapPin, Plus, X, Navigation, Minus } from 'lucide-react';
import { MOCK_RESTAURANTS } from '../constants';

const CATEGORIES = ['Todos', 'Brasileira', 'Italiana', 'Japonesa', 'Mexicana', 'Lanches'];
const CREDIT_FILTERS = ['Todos', '1 Crédito', '2 Créditos', '3 Créditos', '+4 Créditos'];

export const Restaurants: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [activeCredit, setActiveCredit] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Map States
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedMapRestaurantId, setSelectedMapRestaurantId] = useState<string | null>(null);

  // Filtering Logic
  const filteredRestaurants = MOCK_RESTAURANTS.filter(r => {
    // Category Filter
    const matchesCategory = activeCategory === 'Todos' || r.category === activeCategory || (activeCategory === 'Brasileira' && r.category === 'Brazilian') || (activeCategory === 'Lanches' && r.category === 'American');
    
    // Search Filter
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Credit Filter (Simple Logic based on first item in menu for demo)
    const minDishCredits = Math.min(...r.menu.map(d => d.credits));
    let matchesCredit = true;
    if (activeCredit === '1 Crédito') matchesCredit = minDishCredits === 1;
    if (activeCredit === '2 Créditos') matchesCredit = minDishCredits === 2;
    if (activeCredit === '3 Créditos') matchesCredit = minDishCredits === 3;
    if (activeCredit === '+4 Créditos') matchesCredit = minDishCredits >= 4;

    return matchesCategory && matchesSearch && matchesCredit;
  });

  const selectedMapRestaurant = MOCK_RESTAURANTS.find(r => r.id === selectedMapRestaurantId);

  return (
    <div className="min-h-screen bg-brand-50/30 dark:bg-gray-950 pb-24">
      
      {/* Header Hero Area */}
      <div className="relative h-48 bg-gray-900 rounded-b-[2rem] overflow-hidden shadow-lg mb-6">
        <img 
          src="https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
          alt="Header" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent" />
        
        <div className="absolute bottom-6 left-4 right-4 space-y-4">
          <h1 className="text-3xl font-bold text-white drop-shadow-md">Restaurantes</h1>
          
          <div className="flex gap-3">
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl flex items-center px-4 py-3 shadow-sm backdrop-blur-sm bg-opacity-95">
              <Search className="w-5 h-5 text-gray-400 mr-2" />
              <input 
                type="text"
                placeholder="Pesquisar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 w-full text-sm font-medium"
              />
            </div>
            <button 
              onClick={() => setIsMapOpen(true)}
              className="bg-white dark:bg-gray-800 px-5 rounded-xl flex items-center gap-2 shadow-sm text-gray-700 dark:text-white font-medium text-sm backdrop-blur-sm bg-opacity-95 active:scale-95 transition-transform"
            >
              <Map className="w-5 h-5" />
              Mapa
            </button>
          </div>
        </div>
      </div>

      {/* Filters Container */}
      <div className="px-4 space-y-5">
        
        {/* Categories */}
        <div className="space-y-2">
          <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-wider ml-1">Categorias</h3>
          <div className="flex overflow-x-auto gap-2 no-scrollbar pb-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-sm ${
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
        <div className="space-y-2">
          <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-wider ml-1">Créditos</h3>
          <div className="flex overflow-x-auto gap-2 no-scrollbar pb-1">
            {CREDIT_FILTERS.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveCredit(filter)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-sm ${
                  activeCredit === filter
                    ? 'bg-brand-500 text-white shadow-brand-500/30'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <p className="text-gray-500 text-sm ml-1">
          {filteredRestaurants.length} restaurantes encontrados
        </p>

        {/* Restaurant Cards */}
        <div className="space-y-6">
          {filteredRestaurants.map(restaurant => (
            <div 
              key={restaurant.id}
              onClick={() => navigate(`/restaurant/${restaurant.id}`)}
              className="group bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              {/* Image Section */}
              <div className="relative h-56">
                <img 
                  src={restaurant.image} 
                  alt={restaurant.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                
                {/* Rating Badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-bold text-gray-900">{restaurant.rating}</span>
                </div>

                {/* Title inside image */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white mb-1 leading-tight">{restaurant.name}</h3>
                  <div className="flex items-center gap-2 text-white/90 text-sm">
                     <span className="bg-white/20 px-2 py-0.5 rounded text-xs backdrop-blur-md">{restaurant.category}</span>
                     <span>•</span>
                     <span className="font-medium">$$$</span>
                  </div>
                </div>
              </div>

              {/* Footer Section */}
              <div className="p-4 flex justify-between items-center relative">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                  <MapPin className="w-5 h-5 text-brand-500" />
                  <span className="line-clamp-1">{restaurant.address}</span>
                </div>
                
                {/* Action Button (Visual only) */}
                <div className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center shadow-lg shadow-brand-500/40 text-white transform group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
          
          {filteredRestaurants.length === 0 && (
            <div className="text-center py-10 bg-white dark:bg-gray-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
              <p className="text-gray-400 font-medium">Nenhum restaurante encontrado.</p>
              <button onClick={() => {setActiveCategory('Todos'); setSearchTerm('')}} className="mt-2 text-brand-500 text-sm font-bold">Limpar Filtros</button>
            </div>
          )}
        </div>
      </div>

      {/* MAP MODAL */}
      {isMapOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-200">
          <div 
            className="bg-gray-100 dark:bg-gray-900 w-full h-[92vh] sm:h-[80vh] sm:max-w-2xl sm:rounded-3xl rounded-t-3xl relative overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Map Header */}
            <div className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-start pointer-events-none">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm pointer-events-auto">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-brand-500" />
                  <div>
                    <h2 className="font-bold text-gray-900 dark:text-white text-sm leading-tight">Mapa de Restaurantes</h2>
                    <p className="text-[10px] text-gray-500">{filteredRestaurants.length} restaurantes encontrados</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsMapOpen(false)} 
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-2 rounded-full shadow-sm text-gray-500 hover:text-gray-900 dark:hover:text-white pointer-events-auto"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Map Area (Simulated) */}
            <div className="flex-1 relative bg-[#e5e7eb] overflow-hidden" onClick={() => setSelectedMapRestaurantId(null)}>
              {/* Map Background Tile (Static representation of a map) */}
              <div 
                className="absolute inset-0 opacity-80"
                style={{
                  backgroundImage: `url('https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/13/2411/3078.png')`, // Example tile pattern
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'grayscale(0.2)'
                }}
              />
              
              {/* Zoom Controls */}
              <div className="absolute top-24 left-4 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden z-10">
                <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700"><Plus className="w-4 h-4 text-gray-600 dark:text-gray-300" /></button>
                <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700"><Minus className="w-4 h-4 text-gray-600 dark:text-gray-300" /></button>
              </div>

              {/* Attribution */}
              <div className="absolute bottom-1 right-1 bg-white/50 px-1 text-[8px] text-gray-600 z-0">
                 Leaflet | © OpenStreetMap
              </div>

              {/* Restaurant Pins */}
              {filteredRestaurants.map((r, index) => {
                // Determine a pseudo-random position for demo purposes based on index
                // In a real app, convert lat/lng to pixels
                const top = 30 + (index * 15) + (Math.sin(index) * 10); 
                const left = 20 + (index * 20) + (Math.cos(index) * 10);
                
                const isSelected = selectedMapRestaurantId === r.id;

                return (
                  <button
                    key={r.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMapRestaurantId(r.id);
                    }}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-10 group"
                    style={{ top: `${top}%`, left: `${left}%` }}
                  >
                    {/* Tooltip Label */}
                    <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md whitespace-nowrap transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      {r.name}
                    </div>

                    {/* Pin Icon */}
                    <div className={`relative flex items-center justify-center transition-transform ${isSelected ? 'scale-125' : 'hover:scale-110'}`}>
                       <div className={`w-10 h-10 rounded-full border-2 border-white dark:border-gray-900 shadow-lg flex items-center justify-center overflow-hidden bg-brand-500`}>
                          <img src={r.image} alt="marker" className="w-full h-full object-cover opacity-80" />
                       </div>
                       {isSelected && (
                         <div className="absolute -bottom-1 w-2 h-2 bg-brand-500 rotate-45 border-r border-b border-white dark:border-gray-900"></div>
                       )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Restaurant Card Overlay */}
            {selectedMapRestaurant && (
              <div className="absolute bottom-6 left-4 right-4 z-30 animate-in slide-in-from-bottom-5">
                <div 
                  onClick={() => navigate(`/restaurant/${selectedMapRestaurant.id}`)}
                  className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl flex items-center gap-4 cursor-pointer active:scale-95 transition-transform"
                >
                  <img src={selectedMapRestaurant.image} className="w-16 h-16 rounded-xl object-cover" alt={selectedMapRestaurant.name} />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-900 dark:text-white">{selectedMapRestaurant.name}</h3>
                      <div className="flex items-center gap-1 text-xs font-bold text-yellow-600 bg-yellow-100 px-1.5 py-0.5 rounded">
                        <Star className="w-3 h-3 fill-yellow-600" />
                        {selectedMapRestaurant.rating}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{selectedMapRestaurant.category}</p>
                    <div className="flex items-center gap-1 text-xs text-brand-500 font-bold">
                      <span>Ver Cardápio</span>
                      <Navigation className="w-3 h-3" />
                    </div>
                  </div>
                  <button className="bg-brand-500 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
                     <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};