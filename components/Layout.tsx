
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Utensils, Wallet, Users, User as UserIcon, Plus, MapPin, Bot, ScanLine, Bell, X, Gift, AlertCircle } from 'lucide-react';
import { AIChat } from './AIChat';
import { useApp } from '../context';
import { ScannerModal } from '../pages/Scanner'; // Importando o modal

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { openScanner } = useApp(); // Usando openScanner do contexto
  const navigate = useNavigate();

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/restaurants', icon: Utensils, label: 'Comer' },
    { to: '/credits', icon: Wallet, label: 'Créditos' },
    { to: '/community', icon: Users, label: 'Comunidade' },
    { to: '/profile', icon: UserIcon, label: 'Perfil' },
  ];

  const handleFabAction = (action: () => void) => {
    action();
    setIsFabOpen(false);
  };

  const handleScannerClick = () => {
    // Abre o Modal de Scanner via Contexto com a mesma funcionalidade da Home (Redeem)
    openScanner('redeem');
  };

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <main className="flex-1">{children}</main>

      {/* Global Scanner Modal */}
      <ScannerModal />

      {/* Backdrop Overlay */}
      {isFabOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 animate-in fade-in"
          onClick={() => setIsFabOpen(false)}
        />
      )}

      {/* Menu Overlay Container - Aligned closer to bottom */}
      <div className={`fixed inset-0 z-50 flex items-end justify-center pb-36 pointer-events-none ${isFabOpen ? 'pointer-events-auto' : ''}`}>
        
        {/* Wrapper for the Cross Layout relative to the bottom center */}
        <div className="relative w-full flex items-center justify-center">
            
            {/* Center Bottom: Scanner (BIG) - Anchor Point 0 */}
             <div 
              className={`absolute flex flex-col items-center gap-2 transition-all duration-300 ease-out z-30 ${
                isFabOpen ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
              }`}
            >
              <button 
                onClick={() => handleFabAction(handleScannerClick)}
                className="w-20 h-20 bg-green-500 hover:bg-green-400 text-white rounded-full shadow-2xl flex items-center justify-center transition-transform active:scale-95 border-4 border-white dark:border-gray-900"
              >
                <ScanLine className="w-9 h-9" />
              </button>
              <span className="bg-white text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-md whitespace-nowrap">Escanear QR</span>
            </div>

            {/* Top: Map (BIG) - Positioned High */}
            <div 
              className={`absolute flex flex-col items-center gap-2 transition-all duration-300 ease-out delay-75 z-20 ${
                isFabOpen ? '-translate-y-32 opacity-100 scale-100' : 'translate-y-0 opacity-0 scale-50'
              }`}
            >
              <button 
                onClick={() => handleFabAction(() => navigate('/restaurants?map=true'))}
                className="w-20 h-20 bg-sky-500 hover:bg-sky-400 text-white rounded-full shadow-xl flex items-center justify-center transition-transform active:scale-95 border-4 border-white dark:border-gray-900"
              >
                <MapPin className="w-8 h-8" />
              </button>
              <span className="bg-white text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-md whitespace-nowrap">Mapa</span>
            </div>

            {/* Left Middle: Notifications (SMALLER) - Vertically Centered between Map and Scanner */}
            <div 
              className={`absolute flex flex-col items-center gap-2 transition-all duration-300 ease-out delay-100 z-10 ${
                isFabOpen ? '-translate-x-24 -translate-y-16 opacity-100 scale-100' : 'translate-x-0 translate-y-0 opacity-0 scale-50'
              }`}
            >
               <button 
                onClick={() => handleFabAction(() => setIsNotificationsOpen(true))}
                className="w-14 h-14 bg-orange-500 hover:bg-orange-400 text-white rounded-full shadow-xl flex items-center justify-center transition-transform active:scale-95 border-4 border-white dark:border-gray-900"
              >
                <Bell className="w-6 h-6" />
              </button>
              <span className="bg-white text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-md whitespace-nowrap">Notificações</span>
            </div>

            {/* Right Middle: Assistant (SMALLER) - Vertically Centered between Map and Scanner */}
            <div 
              className={`absolute flex flex-col items-center gap-2 transition-all duration-300 ease-out delay-150 z-10 ${
                isFabOpen ? 'translate-x-24 -translate-y-16 opacity-100 scale-100' : 'translate-x-0 translate-y-0 opacity-0 scale-50'
              }`}
            >
               <button 
                onClick={() => handleFabAction(() => setIsAiOpen(true))}
                className="w-14 h-14 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-full shadow-xl flex items-center justify-center transition-transform active:scale-95 border-4 border-white dark:border-gray-900"
              >
                <Bot className="w-6 h-6" />
              </button>
              <span className="bg-white text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-md whitespace-nowrap">Assistente</span>
            </div>

        </div>
      </div>

      {/* Floating Action Trigger (Bottom Right) */}
      <div className="fixed bottom-24 right-5 z-50">
        <button
          onClick={() => setIsFabOpen(!isFabOpen)}
          className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white transition-all duration-300 border-2 border-white dark:border-gray-800 ${
            isFabOpen ? 'bg-red-500 rotate-45' : 'bg-brand-500 hover:bg-brand-600'
          }`}
        >
          <Plus className="w-8 h-8" />
        </button>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-2 z-30 pb-safe">
        <ul className="flex justify-between items-center max-w-lg mx-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) => `flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
                  isActive ? 'text-brand-500' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-[10px] font-medium">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* AI Chat Modal */}
      <AIChat isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />

      {/* Notifications Modal */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
           <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-2xl p-5 shadow-2xl animate-in zoom-in-95">
             <div className="flex justify-between items-center mb-5">
               <h3 className="font-bold text-lg dark:text-white flex items-center gap-2">
                 <Bell className="w-5 h-5 text-brand-500" /> Notificações
               </h3>
               <button onClick={() => setIsNotificationsOpen(false)} className="bg-gray-100 dark:bg-gray-800 p-1 rounded-full text-gray-500">
                 <X className="w-5 h-5" />
               </button>
             </div>
             
             <div className="space-y-4">
                {/* Mock Notification 1 */}
                <div className="flex gap-3 items-start border-b border-gray-100 dark:border-gray-800 pb-3">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full text-blue-600 flex-shrink-0">
                      <Gift size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-bold dark:text-white leading-tight mb-1">Bem-vindo ao DISHpass!</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Você ganhou acesso ao plano Experiência. Aproveite seus créditos.</p>
                    </div>
                </div>

                {/* Mock Notification 2 */}
                <div className="flex gap-3 items-start border-b border-gray-100 dark:border-gray-800 pb-3">
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full text-green-600 flex-shrink-0">
                      <Utensils size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-bold dark:text-white leading-tight mb-1">Novo Restaurante</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">O "Sabor da Terra" agora aceita reservas pelo app.</p>
                    </div>
                </div>
                
                {/* Mock Notification 3 */}
                <div className="flex gap-3 items-start">
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full text-yellow-600 flex-shrink-0">
                      <AlertCircle size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-bold dark:text-white leading-tight mb-1">Dica de Economia</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Convide amigos e ganhe 20 créditos bônus para cada assinatura.</p>
                    </div>
                </div>
             </div>
             
             <button 
               onClick={() => setIsNotificationsOpen(false)} 
               className="w-full mt-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-sm rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700"
             >
               Fechar
             </button>
           </div>
        </div>
      )}
    </div>
  );
};
