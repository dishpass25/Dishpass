import React from 'react';
import { useApp } from '../context';
import { Check, Zap } from 'lucide-react';

export const Credits: React.FC = () => {
  const { user, subscriptions, addCredits } = useApp();

  return (
    <div className="p-4 min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Wallet & Plans</h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm mb-8 text-center">
        <p className="text-gray-500 dark:text-gray-400 mb-2">Current Balance</p>
        <div className="text-5xl font-black text-brand-500 mb-2">{user.credits}</div>
        <div className="text-sm bg-green-100 text-green-700 inline-block px-3 py-1 rounded-full font-medium">
          Saved $45.00 this month
        </div>
      </div>

      <h2 className="text-lg font-bold mb-4 dark:text-white">Subscription Plans</h2>
      <div className="space-y-4">
        {subscriptions.map(plan => (
          <div 
            key={plan.id}
            className={`relative p-5 rounded-2xl border-2 transition-all ${
              plan.isActive 
                ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/10' 
                : 'border-transparent bg-white dark:bg-gray-900 shadow-sm'
            }`}
          >
            {plan.isActive && (
              <div className="absolute top-0 right-0 bg-brand-500 text-white text-xs px-3 py-1 rounded-bl-xl rounded-tr-lg font-bold">
                ACTIVE
              </div>
            )}
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-lg dark:text-white">{plan.name}</h3>
              <span className="text-xl font-bold dark:text-white">${plan.price}<span className="text-sm font-normal text-gray-500">/{plan.frequency === 'weekly' ? 'wk' : 'mo'}</span></span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm mb-4">
              <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span>{plan.creditsPerCycle} credits per cycle</span>
            </div>
            <button 
              onClick={() => !plan.isActive && addCredits(plan.creditsPerCycle)} // Mock action
              className={`w-full py-2 rounded-xl font-bold text-sm ${
                plan.isActive 
                  ? 'bg-brand-100 text-brand-700 cursor-default' 
                  : 'bg-gray-900 dark:bg-gray-700 text-white'
              }`}
            >
              {plan.isActive ? 'Current Plan' : 'Upgrade'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};