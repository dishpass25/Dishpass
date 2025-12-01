import React from 'react';
import { useApp } from '../context';
import { Moon, Sun, LogOut, ShieldCheck, CreditCard } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, theme, toggleTheme, toggleStaffMode } = useApp();

  return (
    <div className="p-4 min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Profile</h1>

      <div className="flex items-center gap-4 mb-8">
        <img src={user.avatar} className="w-20 h-20 rounded-full border-4 border-white shadow-lg" alt="Avatar" />
        <div>
          <h2 className="text-xl font-bold dark:text-white">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm">
          <button onClick={toggleTheme} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              {theme === 'light' ? <Moon className="w-5 h-5 text-gray-600" /> : <Sun className="w-5 h-5 text-gray-400" />}
              <span className="dark:text-white">Dark Mode</span>
            </div>
            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-brand-500' : 'bg-gray-300'}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-sm transition-transform ${theme === 'dark' ? 'translate-x-4' : ''}`} />
            </div>
          </button>

          <div className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800">
             <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div className="text-left">
                <p className="dark:text-white">Staff Mode (Demo)</p>
                <p className="text-xs text-gray-400">Enable Scanner access</p>
              </div>
            </div>
            <button 
              onClick={toggleStaffMode}
              className={`w-10 h-6 rounded-full p-1 transition-colors ${user.isRestaurantStaff ? 'bg-purple-600' : 'bg-gray-300'}`}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-sm transition-transform ${user.isRestaurantStaff ? 'translate-x-4' : ''}`} />
            </button>
          </div>
          
           <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 text-red-500">
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};