
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Utensils, Wallet, Users, User as UserIcon, Plus, MapPin, Bot, ScanLine, Bell, X, Gift, AlertCircle, CheckCircle, Info, Trash2 } from 'lucide-react';
import { AIChat } from './AIChat';
import { useApp } from '../context';
import { ScannerModal } from '../pages/Scanner'; // Importando o modal

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { openScanner, notifications, markNotificationsAsRead, clearNotifications } = useApp(); // Usando contexto extendido
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

  const handleOpenNotifications = () => {
    setIsNotificationsOpen(true);
    // Mark as read when opening (optional, could be done on close)
    markNotificationsAsRead();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
        case 'success': return <CheckCircle size={20} />;
        case 'error': return <AlertCircle size={20} />;
        case 'warning': return <AlertCircle size={20} />;
        default: return <Info size={20} />;
    }
  };

  const getNotificationColor = (type: string) => {
      switch (type) {
          case 'success': return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
          case 'error': return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
          case 'warning': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400';
          default: return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
      }
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

      {/* Floating Action Menu (Vertical Stack on Right) */}
      <div className={`fixed bottom-40 right-5 z-50 flex flex-col items-end gap-3 transition-all duration-300 ${isFabOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        
        {/* Assistant */}
        <div className="flex items-center gap-3">
           <span className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap animate-in slide-in-from-right-4 fade-in duration-300">Assistente</span>
           <button 
            onClick={() => handleFabAction(() => setIsAiOpen(true))}
            className="w-12 h-12 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-full shadow-lg flex items-center justify-center transition-transform active:scale-95"
          >
            <Bot className="w-6 h-6" />
          </button>
        </div>

        {/* Notifications */}
        <div className="flex items-center gap-3">
           <span className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap animate-in slide-in-from-right-4 fade-in duration-300 delay-75">Notificações</span>
           <button 
            onClick={() => handleFabAction(handleOpenNotifications)}
            className="w-12 h-12 bg-orange-500 hover:bg-orange-400 text-white rounded-full shadow-lg flex items-center justify-center transition-transform active:scale-95 relative"
          >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Map */}
        <div className="flex items-center gap-3">
           <span className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap animate-in slide-in-from-right-4 fade-in duration-300 delay-100">Mapa</span>
           <button 
            onClick={() => handleFabAction(() => navigate('/restaurants?map=true'))}
            className="w-12 h-12 bg-sky-500 hover:bg-sky-400 text-white rounded-full shadow-lg flex items-center justify-center transition-transform active:scale-95"
          >
            <MapPin className="w-6 h-6" />
          </button>
        </div>

        {/* Scanner */}
        <div className="flex items-center gap-3">
           <span className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap animate-in slide-in-from-right-4 fade-in duration-300 delay-150">Escanear QR</span>
           <button 
            onClick={() => handleFabAction(handleScannerClick)}
            className="w-12 h-12 bg-green-500 hover:bg-green-400 text-white rounded-full shadow-lg flex items-center justify-center transition-transform active:scale-95"
          >
            <ScanLine className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Floating Action Trigger (Bottom Right) */}
      <div className="fixed bottom-24 right-5 z-50">
        <button
          onClick={() => setIsFabOpen(!isFabOpen)}
          className={`w-16 h-16 rounded-full shadow-xl flex items-center justify-center text-white transition-all duration-300 border-2 border-white dark:border-gray-800 relative ${
            isFabOpen ? 'bg-red-500 rotate-45' : 'bg-brand-500 hover:bg-brand-600'
          }`}
        >
          <Plus className="w-9 h-9" />
          {!isFabOpen && unreadCount > 0 && (
             <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
          )}
        </button>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-3 z-30 pb-safe">
        <ul className="flex justify-between items-center max-w-lg mx-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) => `flex flex-col items-center gap-1.5 p-2 rounded-xl transition-colors ${
                  isActive ? 'text-brand-500' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-[10px] font-bold">{label}</span>
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
           <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[2rem] p-6 shadow-2xl animate-in zoom-in-95 h-[70vh] flex flex-col">
             <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-lg dark:text-white flex items-center gap-2">
                 <Bell className="w-5 h-5 text-brand-500" /> Notificações
               </h3>
               <div className="flex gap-2">
                 {notifications.length > 0 && (
                   <button onClick={clearNotifications} title="Limpar tudo" className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full text-gray-500 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                   </button>
                 )}
                 <button onClick={() => setIsNotificationsOpen(false)} className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full text-gray-500">
                   <X className="w-4 h-4" />
                 </button>
               </div>
             </div>
             
             <div className="space-y-4 overflow-y-auto flex-1 pr-1">
                {notifications.length > 0 ? (
                  notifications.map(notif => (
                    <div key={notif.id} className="flex gap-4 items-start border-b border-gray-100 dark:border-gray-800 pb-4 last:border-0 animate-in slide-in-from-right-2">
                        <div className={`${getNotificationColor(notif.type)} p-2 rounded-full flex-shrink-0`}>
                          {getNotificationIcon(notif.type)}
                        </div>
                        <div>
                            <p className="text-sm font-bold dark:text-white leading-tight mb-1">{notif.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{notif.message}</p>
                            <p className="text-[10px] text-gray-400 mt-1">{new Date(notif.date).toLocaleDateString()} - {new Date(notif.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                     <Bell className="w-12 h-12 mb-3 opacity-20" />
                     <p className="text-sm font-medium">Sem notificações no momento.</p>
                  </div>
                )}
             </div>
             
             <button 
               onClick={() => setIsNotificationsOpen(false)} 
               className="w-full mt-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-sm rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700"
             >
               Fechar
             </button>
           </div>
        </div>
      )}
    </div>
  );
};
