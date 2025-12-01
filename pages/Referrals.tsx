import React, { useState } from 'react';
import { useApp } from '../context';
import { Copy, Users, CheckCircle } from 'lucide-react';
import { MOCK_REFERRALS } from '../constants';

export const Referrals: React.FC = () => {
  const { user } = useApp();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Invite Friends</h1>

      {/* Hero */}
      <div className="bg-indigo-600 rounded-2xl p-6 text-white text-center mb-8 shadow-lg shadow-indigo-500/30">
        <Users className="w-12 h-12 mx-auto mb-3 opacity-80" />
        <h2 className="text-xl font-bold mb-2">Give 20, Get 20</h2>
        <p className="text-indigo-100 text-sm mb-6">
          Invite a friend to DISHpass. They get 20 free credits, and you get 20 when they subscribe.
        </p>

        <div className="bg-white/10 backdrop-blur-sm p-1 rounded-xl flex items-center justify-between pl-4 border border-indigo-400">
          <span className="font-mono font-bold tracking-wider">{user.referralCode}</span>
          <button 
            onClick={handleCopy}
            className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* List */}
      <h3 className="font-bold text-lg mb-4 dark:text-white">Your Referrals</h3>
      <div className="space-y-3">
        {MOCK_REFERRALS.map(ref => (
          <div key={ref.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl flex items-center justify-between shadow-sm">
            <div>
              <p className="font-bold dark:text-white">{ref.name}</p>
              <p className="text-xs text-gray-500">Invited on {ref.date}</p>
            </div>
            <div className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
              ref.status === 'joined' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {ref.status === 'joined' ? <CheckCircle className="w-3 h-3" /> : null}
              <span className="capitalize">{ref.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};