import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, Utensils, Wallet, Users, User as UserIcon, Plus, Map, Bot, ScanLine, X } from 'lucide-react';
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

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <main className="flex-1">{children}</main>

      {/* Floating Action Button & Menu */}
      <div className="fixed bottom-24 right-4 flex flex-col items-end gap-3 z-40">
        {isFabOpen && (
          <>
            {user.isRestaurantStaff && (
               <button 
               onClick={() => { navigate('/scanner'); setIsFabOpen(false); }}
               className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg animate-in slide-in-from-bottom-2"
             >
               <span>Scanner</span>
               <ScanLine className="w-5 h-5" />
             </button>
            )}
            <button 
              onClick={() => { /* Mock Map */ alert('Map feature coming soon!'); setIsFabOpen(false); }}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg animate-in slide-in-from-bottom-2 delay-75"
            >
              <span>Mapa</span>
              <Map className="w-5 h-5" />
            </button>
            <button 
              onClick={() => { setIsAiOpen(true); setIsFabOpen(false); }}
              className="flex items-center gap-2 bg-brand-500 text-white px-4 py-2 rounded-full shadow-lg animate-in slide-in-from-bottom-2 delay-100"
            >
              <span>Chef IA</span>
              <Bot className="w-5 h-5" />
            </button>
          </>
        )}
        <button
          onClick={() => setIsFabOpen(!isFabOpen)}
          className={`p-4 rounded-full shadow-xl transition-transform duration-200 ${
            isFabOpen ? 'bg-gray-800 rotate-45' : 'bg-brand-500'
          } text-white`}
        >
          {isFabOpen ? <Plus className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
        </button>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-2 z-30">
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