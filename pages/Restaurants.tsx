import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star } from 'lucide-react';
import { MOCK_RESTAURANTS } from '../constants';

const CATEGORIES = ['All', 'Japanese', 'American', 'Italian', 'Mexican', 'Vegan'];

export const Restaurants: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRestaurants = MOCK_RESTAURANTS.filter(r => {
    const matchesCategory = activeCategory === 'All' || r.category === activeCategory;
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 space-y-4">
      <div className="sticky top-0 bg-gray-50 dark:bg-gray-950 py-2 z-10 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for sushi, burgers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-gray-800 border-none rounded-2xl py-3 pl-10 pr-4 shadow-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto gap-2 no-scrollbar pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-brand-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="grid gap-6 pb-20">
        {filteredRestaurants.map(restaurant => (
          <div 
            key={restaurant.id}
            onClick={() => navigate(`/restaurant/${restaurant.id}`)}
            className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="relative h-48">
              <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-bold text-gray-900">{restaurant.rating}</span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{restaurant.name}</h3>
                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-md">
                  {restaurant.category}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-gray-500 dark:text-gray-400 text-sm">
                <MapPin className="w-4 h-4" />
                <span>{restaurant.address}</span>
              </div>
            </div>
          </div>
        ))}
        {filteredRestaurants.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No restaurants found.
          </div>
        )}
      </div>
    </div>
  );
};