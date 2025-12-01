import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Utensils, Wallet, Users, User as UserIcon, Plus, MapPin, Bot, ScanLine, Bell } from 'lucide-react';
import { AIChat } from './AIChat';
import { useApp } from '../context';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const { user } = useApp();
  const navigate = useNavigate();

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/restaurants', icon: Utensils, label: 'Comer' },
    { to: '/credits', icon: Wallet, label: 'Créditos' },
    { to: '/community', icon: Users, label: 'Social' },
    { to: '/profile', icon: UserIcon, label: 'Perfil' },
  ];

  const handleFabAction = (action: () => void) => {
    action();
    setIsFabOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <main className="flex-1">{children}</main>

      {/* Backdrop Overlay */}
      {isFabOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 animate-in fade-in"
          onClick={() => setIsFabOpen(false)}
        />
      )}

      {/* Centered Menu Items (Visible when Open) */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none ${isFabOpen ? 'pointer-events-auto' : ''}`}>
        
        {/* Wrapper for the Cross Layout */}
        <div className="relative">
            
            {/* Center: Scanner */}
             <div 
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 transition-all duration-300 ease-out ${
                isFabOpen ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
              }`}
            >
              <button 
                onClick={() => handleFabAction(() => navigate('/scanner'))}
                className="w-20 h-20 bg-green-500 hover:bg-green-400 text-white rounded-full shadow-2xl flex items-center justify-center transition-transform active:scale-95 border-4 border-gray-50 dark:border-gray-900"
              >
                <ScanLine className="w-8 h-8" />
              </button>
              <span className="bg-white text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-md whitespace-nowrap">Escanear QR</span>
            </div>

            {/* Top: Map */}
            <div 
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 flex flex-col-reverse items-center gap-2 transition-all duration-300 ease-out delay-75 ${
                isFabOpen ? '-translate-y-32 opacity-100 scale-100' : '-translate-y-1/2 opacity-0 scale-50'
              }`}
            >
              <button 
                onClick={() => handleFabAction(() => { /* Mock Map */ alert('Mapa aberto!'); })}
                className="w-14 h-14 bg-sky-500 hover:bg-sky-400 text-white rounded-full shadow-xl flex items-center justify-center transition-transform active:scale-95 ring-4 ring-gray-50/50"
              >
                <MapPin className="w-6 h-6" />
              </button>
              <span className="bg-white text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-md whitespace-nowrap">Mapa</span>
            </div>

            {/* Left: Notifications */}
            <div 
              className={`absolute top-1/2 left-1/2 transform -translate-y-1/2 flex flex-col items-center gap-2 transition-all duration-300 ease-out delay-100 ${
                isFabOpen ? '-translate-x-32 opacity-100 scale-100' : '-translate-x-1/2 opacity-0 scale-50'
              }`}
            >
               <button 
                onClick={() => handleFabAction(() => alert('Sem novas notificações'))}
                className="w-14 h-14 bg-orange-500 hover:bg-orange-400 text-white rounded-full shadow-xl flex items-center justify-center transition-transform active:scale-95 ring-4 ring-gray-50/50"
              >
                <Bell className="w-6 h-6" />
              </button>
              <span className="bg-white text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-md whitespace-nowrap">Notificações</span>
            </div>

            {/* Right: Assistant */}
            <div 
              className={`absolute top-1/2 left-1/2 transform -translate-y-1/2 flex flex-col items-center gap-2 transition-all duration-300 ease-out delay-150 ${
                isFabOpen ? 'translate-x-32 opacity-100 scale-100' : '-translate-x-1/2 opacity-0 scale-50'
              }`}
            >
               <button 
                onClick={() => handleFabAction(() => setIsAiOpen(true))}
                className="w-14 h-14 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-full shadow-xl flex items-center justify-center transition-transform active:scale-95 ring-4 ring-gray-50/50"
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
          className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white transition-all duration-300 ${
            isFabOpen ? 'bg-gray-600 rotate-45' : 'bg-brand-500 hover:bg-brand-600'
          }`}
        >
          <Plus className="w-7 h-7" />
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
    </div>
  );
};