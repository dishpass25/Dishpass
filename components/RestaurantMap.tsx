import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { X, Navigation, Star, MapPin, Plus, Loader2, Minus, Compass, LocateFixed } from 'lucide-react';
import { Restaurant } from '../types';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context';

// --- Sub-componentes de Controle ---

// CORREÇÃO MAPA CINZA: Força o Leaflet a recalcular o tamanho após a animação do modal
const MapInvalidator = () => {
  const map = useMap();
  useEffect(() => {
    // Tenta invalidar imediatamente e depois de um tempo para garantir
    map.invalidateSize();
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 400); 
    return () => clearTimeout(timer);
  }, [map]);
  return null;
};

// Controla o movimento do mapa (FlyTo)
const MapController = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    if (map) {
      map.flyTo(center, zoom, { duration: 1.5, easeLinearity: 0.25 });
    }
  }, [center, zoom, map]);
  return null;
};

// Botões de Zoom Customizados (Flutuantes à Esquerda)
const CustomZoomControl = () => {
  const map = useMap();
  return (
    <div className="absolute top-1/2 left-4 -translate-y-1/2 z-[400] flex flex-col gap-3 pointer-events-auto">
      <button 
        onClick={(e) => { e.stopPropagation(); map.zoomIn(); }}
        className="bg-white text-gray-700 w-11 h-11 rounded-full shadow-xl flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-transform border border-gray-100"
      >
        <Plus className="w-5 h-5" />
      </button>
      <button 
        onClick={(e) => { e.stopPropagation(); map.zoomOut(); }}
        className="bg-white text-gray-700 w-11 h-11 rounded-full shadow-xl flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-transform border border-gray-100"
      >
        <Minus className="w-5 h-5" />
      </button>
    </div>
  );
};

// Botão de Bússola/Navegação (Flutuante à Direita)
const CompassControl = ({ onLocate }: { onLocate: () => void }) => {
    return (
      <div className="absolute top-24 right-4 z-[400] flex flex-col gap-3 pointer-events-auto">
        {/* Bússola Decorativa */}
        <div className="bg-white w-11 h-11 rounded-full shadow-xl flex items-center justify-center border border-gray-100">
          <Compass className="w-6 h-6 text-orange-500" />
        </div>
        
        {/* Botão de Localização GPS */}
        <button 
          onClick={(e) => { e.stopPropagation(); onLocate(); }}
          className="bg-white w-11 h-11 rounded-full shadow-xl flex items-center justify-center border border-gray-100 hover:bg-gray-50 active:scale-95 transition-transform"
        >
           <LocateFixed className="w-6 h-6 text-blue-500" />
        </button>
      </div>
    );
};

interface RestaurantMapProps {
  restaurants: Restaurant[];
  onClose: () => void;
}

export const RestaurantMap: React.FC<RestaurantMapProps> = ({ restaurants, onClose }) => {
  const navigate = useNavigate();
  const { userLocation, requestUserLocation } = useApp();
  const [activeRestaurantId, setActiveRestaurantId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<{[key: string]: L.Marker | null}>({});

  // Centro padrão entre PR e SP
  const defaultCenter: [number, number] = [-24.5, -48.0];
  const [viewState, setViewState] = useState({ center: defaultCenter, zoom: 8 });

  // Simula loading inicial dos tiles
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Focar em um restaurante específico
  const handleSelectRestaurant = (id: string, lat: number, lng: number) => {
    setActiveRestaurantId(id);
    setViewState({ center: [lat, lng], zoom: 16 }); // Zoom mais próximo
    
    // Abrir o popup do marcador automaticamente
    const marker = markerRefs.current[id];
    if (marker) {
      marker.openPopup();
    }

    // Rolar o carrossel inferior para o card selecionado
    const card = document.getElementById(`card-${id}`);
    if (card && scrollContainerRef.current) {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  // Função para centralizar no usuário
  const handleLocateMe = async () => {
    if (!userLocation) {
      await requestUserLocation();
    }
    
    // Tenta obter localização imediata
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            setViewState({ center: [pos.coords.latitude, pos.coords.longitude], zoom: 14 });
        }, 
        () => alert("Ative o GPS para usar este recurso.")
    );
  };

  // Criar ícone HTML personalizado com a foto
  const createCustomIcon = (image: string, isActive: boolean) => {
    const size = isActive ? 60 : 45; 
    const borderColor = isActive ? 'border-[#ea580c]' : 'border-white'; // Laranja quando ativo
    const zIndex = isActive ? 1000 : 100;

    return L.divIcon({
      className: 'custom-pin-marker',
      html: `
        <div class="relative transition-all duration-300 group" style="z-index: ${zIndex}">
          <div class="w-[${size}px] h-[${size}px] rounded-full border-[3px] ${borderColor} shadow-2xl overflow-hidden bg-white box-content relative z-20">
            <img src="${image}" class="w-full h-full object-cover" />
          </div>
          ${isActive ? `<div class="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-[#ea580c] filter drop-shadow-sm z-10"></div>` : ''}
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size + 5],
      popupAnchor: [0, -size - 5]
    });
  };

  // Ícone de Localização do Usuário (Ponto Azul)
  const userLocationIcon = L.divIcon({
      className: 'user-location-marker',
      html: `
        <div class="relative">
           <div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md z-20 relative"></div>
           <div class="w-10 h-10 bg-blue-500/30 rounded-full absolute -top-3 -left-3 animate-ping opacity-75 z-10"></div>
        </div>
      `,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
  });

  const openGoogleMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      
      {/* Container Principal do Modal */}
      <div className="bg-white dark:bg-gray-900 w-full max-w-sm h-[650px] max-h-[85vh] rounded-[2.5rem] overflow-hidden shadow-2xl relative flex flex-col animate-in zoom-in-95 duration-300 ring-4 ring-white/10">
        
        {/* Cabeçalho Fixo */}
        <div className="absolute top-0 left-0 right-0 z-[500] p-4 pointer-events-none">
          <div className="flex justify-between items-start">
             {/* Badge de Título */}
             <div className="bg-white/95 backdrop-blur-md shadow-lg rounded-full pl-2 pr-4 py-1.5 pointer-events-auto border border-gray-100 flex items-center gap-2">
                <div className="bg-orange-100 p-1.5 rounded-full">
                   <MapPin className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                   <h2 className="font-bold text-sm text-gray-900 leading-none">Mapa</h2>
                   <p className="text-[10px] text-gray-500 font-medium">{restaurants.length} locais</p>
                </div>
             </div>
             
             {/* Botão Fechar */}
             <button 
               onClick={onClose}
               className="bg-white/95 backdrop-blur-md w-10 h-10 flex items-center justify-center rounded-full shadow-lg text-gray-500 hover:text-red-500 pointer-events-auto active:scale-95 transition-transform border border-gray-100"
             >
               <X className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-[1000] flex flex-col items-center justify-center bg-gray-100">
            <Loader2 className="w-12 h-12 text-brand-500 animate-spin mb-3" />
            <p className="text-sm font-bold text-gray-500">Carregando mapa...</p>
          </div>
        )}

        {/* Mapa Leaflet */}
        <div className="flex-1 w-full relative bg-[#e5e7eb]">
          {/* Só renderiza se tiver window (client-side) */}
          {typeof window !== 'undefined' && (
            <MapContainer 
                center={defaultCenter} 
                zoom={viewState.zoom} 
                style={{ height: '100%', width: '100%' }}
                zoomControl={false} // Desativar padrão para usar custom
                attributionControl={false}
            >
                {/* CORREÇÃO MAPA CINZA */}
                <MapInvalidator />

                {/* Camada do Google Maps (Roadmap) */}
                <TileLayer
                  url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                  attribution='&copy; Google Maps'
                  maxZoom={20}
                />
                
                <MapController center={viewState.center} zoom={viewState.zoom} />
                <CustomZoomControl />
                <CompassControl onLocate={handleLocateMe} />

                {/* Marcador do Usuário */}
                {userLocation && (
                    <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon} />
                )}

                {restaurants.map(restaurant => (
                <Marker 
                    key={restaurant.id}
                    position={[restaurant.lat, restaurant.lng]}
                    icon={createCustomIcon(restaurant.image, activeRestaurantId === restaurant.id)}
                    ref={(el) => { if (el) markerRefs.current[restaurant.id] = el; }}
                    eventHandlers={{
                        click: () => handleSelectRestaurant(restaurant.id, restaurant.lat, restaurant.lng)
                    }}
                >
                    <Popup className="custom-popup-google" closeButton={false} minWidth={200} maxWidth={200} offset={[0, -10]}>
                        <div className="text-center p-1 font-sans">
                            <h3 className="font-bold text-gray-900 text-sm mb-0.5 leading-tight">{restaurant.name}</h3>
                            <p className="text-[10px] text-gray-500 mb-2 truncate px-1">{restaurant.address}</p>
                            
                            {/* BOTÃO LARANJA IGUAL AO VÍDEO */}
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openGoogleMaps(restaurant.lat, restaurant.lng);
                                }}
                                className="w-full bg-[#ea580c] hover:bg-orange-700 text-white font-bold text-[11px] py-2 rounded-lg flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform"
                            >
                                <Navigation className="w-3 h-3 text-white" />
                                Como Chegar
                            </button>
                        </div>
                    </Popup>
                </Marker>
                ))}
            </MapContainer>
          )}
        </div>

        {/* Carrossel Inferior (Cards) */}
        <div className="absolute bottom-0 left-0 right-0 z-[500] pb-6 pt-12 px-4 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none">
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-4 no-scrollbar snap-x pointer-events-auto pb-2"
          >
            {restaurants.map(restaurant => (
              <div 
                key={restaurant.id}
                id={`card-${restaurant.id}`}
                onClick={() => handleSelectRestaurant(restaurant.id, restaurant.lat, restaurant.lng)}
                className={`min-w-[280px] bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-2xl snap-center transition-all cursor-pointer flex items-center gap-3 relative border-2 ${
                  activeRestaurantId === restaurant.id ? 'border-brand-500 scale-105' : 'border-white dark:border-gray-700'
                }`}
              >
                <img src={restaurant.image} className="w-16 h-16 rounded-xl object-cover bg-gray-200 shadow-sm" alt={restaurant.name} />
                
                <div className="flex-1 min-w-0 pr-8">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate">{restaurant.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                     <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                     <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{restaurant.rating}</span>
                     <span className="text-gray-300 text-xs mx-1">•</span>
                     <span className="text-xs text-gray-500 truncate">{restaurant.category}</span>
                  </div>
                </div>

                {/* Botão Flutuante no Card */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/restaurant/${restaurant.id}`);
                  }}
                  className="absolute -right-2 top-1/2 -translate-y-1/2 bg-brand-500 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg shadow-orange-500/40 hover:bg-brand-600 active:scale-90 transition-transform border-2 border-white"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
            ))}
            <div className="min-w-[10px]"></div>
          </div>
        </div>

      </div>
      
      {/* Estilos Globais para o Popup do Leaflet */}
      <style>{`
        .custom-popup-google .leaflet-popup-content-wrapper {
          border-radius: 16px;
          padding: 0;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3);
          overflow: hidden;
        }
        .custom-popup-google .leaflet-popup-content {
          margin: 12px;
          width: 200px !important;
          line-height: 1.4;
        }
        .custom-popup-google .leaflet-popup-tip {
          background: white;
          width: 12px;
          height: 12px;
          margin-top: -6px;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3);
        }
        .custom-popup-google a.leaflet-popup-close-button {
          display: none;
        }
      `}</style>
    </div>
  );
};