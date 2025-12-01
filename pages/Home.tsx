import React from 'react';
import { useApp } from '../context';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronRight, Calendar, Star, TrendingUp } from 'lucide-react';
import { MOCK_REVIEWS } from '../constants';

export const Home: React.FC = () => {
  const { user, reservations } = useApp();
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <header className="flex justify-between items-center mt-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hi, {user.name.split(' ')[0]} 👋</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Ready to eat?</p>
        </div>
        <img src={user.avatar} alt="Profile" className="w-10 h-10 rounded-full border-2 border-brand-500" />
      </header>

      {/* Credit Card */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-500 rounded-2xl p-6 text-white shadow-lg shadow-brand-500/30">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-brand-100 text-sm font-medium">Available Credits</p>
            <h2 className="text-4xl font-bold mt-1">{user.credits}</h2>
          </div>
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/credits')} className="flex-1 bg-white text-brand-600 py-2.5 rounded-xl font-bold text-sm hover:bg-brand-50 transition-colors">
            Top Up
          </button>
          <button onClick={() => navigate('/restaurants')} className="flex-1 bg-brand-700/50 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-brand-700/70 transition-colors backdrop-blur-sm">
            Use Now
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => navigate('/restaurants')} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm flex flex-col gap-3 hover:scale-[1.02] transition-transform">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <Star className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-gray-900 dark:text-white">Find Food</h3>
            <p className="text-xs text-gray-500">Discover places</p>
          </div>
        </button>
        <button onClick={() => navigate('/referrals')} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm flex flex-col gap-3 hover:scale-[1.02] transition-transform">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <Plus className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-gray-900 dark:text-white">Invite Friends</h3>
            <p className="text-xs text-gray-500">Get +20 credits</p>
          </div>
        </button>
      </div>

      {/* Upcoming Reservations */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-lg dark:text-white">Upcoming Reservations</h2>
          <button className="text-brand-500 text-sm font-medium">View All</button>
        </div>
        
        {reservations.length === 0 ? (
           <div className="bg-white dark:bg-gray-800 p-4 rounded-xl text-center text-gray-500 text-sm">
             No reservations yet.
           </div>
        ) : (
          reservations.slice(0, 2).map((res) => (
            <div key={res.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm flex items-center gap-4">
              <div className="bg-brand-100 dark:bg-brand-900/20 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-brand-600 font-bold text-center leading-none text-xs">
                {new Date(res.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white">{res.restaurantName}</h3>
                <p className="text-xs text-gray-500">{res.time} • {res.guests} Guests</p>
              </div>
              <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full capitalize">
                {res.status}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Community Highlights */}
      <div className="space-y-3 pb-8">
        <h2 className="font-bold text-lg dark:text-white">Community Favorites</h2>
        <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
          {MOCK_REVIEWS.map(review => (
            <div key={review.id} className="min-w-[200px] bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-gray-200" />
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{review.userName}</span>
              </div>
              <img src={review.image} className="w-full h-24 object-cover rounded-lg mb-2" alt={review.dishName} />
              <h4 className="font-bold text-sm truncate dark:text-white">{review.dishName}</h4>
              <p className="text-xs text-gray-500 truncate">"{review.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};