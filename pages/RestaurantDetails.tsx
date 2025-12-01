import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, MapPin, Clock, Users, CalendarCheck, X } from 'lucide-react';
import { MOCK_RESTAURANTS } from '../constants';
import { useApp } from '../context';
import { Reservation } from '../types';

export const RestaurantDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const restaurant = MOCK_RESTAURANTS.find(r => r.id === id);
  const { user, addReservation, deductCredits } = useApp();

  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<string | null>(null);
  const [reservationForm, setReservationForm] = useState({ date: '', time: '', guests: 2 });
  const [showQR, setShowQR] = useState(false);

  if (!restaurant) return <div>Restaurant not found</div>;

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRes: Reservation = {
      id: Math.random().toString(36).substr(2, 9),
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      ...reservationForm,
      status: 'pending'
    };
    addReservation(newRes);
    setIsReservationOpen(false);
    alert('Reservation requested!');
  };

  const handleRedeem = (dishId: string, cost: number) => {
    if (user.credits < cost) {
      alert("Not enough credits!");
      return;
    }
    // In a real app, we wouldn't deduct until scan, but for UX flow:
    setSelectedDish(dishId);
    setShowQR(true);
  };

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen pb-20">
      {/* Header Image */}
      <div className="relative h-64">
        <img src={restaurant.image} className="w-full h-full object-cover" alt="Cover" />
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white/30 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/50"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="p-5 -mt-6 bg-white dark:bg-gray-950 rounded-t-3xl relative z-10">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{restaurant.name}</h1>
          <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/30 px-2 py-1 rounded-lg">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-bold text-yellow-700 dark:text-yellow-500">{restaurant.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mb-6">
          <MapPin className="w-4 h-4" />
          {restaurant.address}
        </div>

        <button 
          onClick={() => setIsReservationOpen(true)}
          className="w-full bg-gray-900 dark:bg-gray-800 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 mb-8"
        >
          <CalendarCheck className="w-5 h-5" />
          Book a Table
        </button>

        <h2 className="font-bold text-xl mb-4 dark:text-white">Menu</h2>
        <div className="space-y-4">
          {restaurant.menu.map(dish => (
            <div key={dish.id} className="flex gap-4 border-b border-gray-100 dark:border-gray-800 pb-4 last:border-0">
              <img src={dish.image} className="w-24 h-24 rounded-xl object-cover" alt={dish.name} />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{dish.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{dish.description}</p>
                </div>
                <div className="flex justify-between items-end mt-2">
                  <span className="text-brand-600 font-bold">{dish.credits} Credits</span>
                  <button 
                    onClick={() => handleRedeem(dish.id, dish.credits)}
                    className="bg-brand-500 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-brand-600"
                  >
                    Redeem
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reservation Modal */}
      {isReservationOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-2xl p-6 animate-in zoom-in-95">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-bold dark:text-white">Reserve Table</h3>
              <button onClick={() => setIsReservationOpen(false)}><X className="w-6 h-6 dark:text-white" /></button>
            </div>
            <form onSubmit={handleReservationSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Date</label>
                <input required type="date" className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white" 
                  value={reservationForm.date} onChange={e => setReservationForm({...reservationForm, date: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Time</label>
                  <input required type="time" className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white" 
                    value={reservationForm.time} onChange={e => setReservationForm({...reservationForm, time: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Guests</label>
                  <input required type="number" min="1" max="10" className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white" 
                    value={reservationForm.guests} onChange={e => setReservationForm({...reservationForm, guests: parseInt(e.target.value)})} />
                </div>
              </div>
              <button type="submit" className="w-full bg-brand-500 text-white py-3 rounded-xl font-bold mt-4">Confirm Request</button>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQR && selectedDish && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-xs rounded-2xl p-6 text-center animate-in zoom-in-95">
             <button onClick={() => setShowQR(false)} className="absolute top-4 right-4 text-gray-500"><X /></button>
             <h3 className="text-xl font-bold mb-2 dark:text-white">Show to Staff</h3>
             <p className="text-sm text-gray-500 mb-6">Scan to redeem {restaurant.menu.find(d => d.id === selectedDish)?.name}</p>
             <div className="bg-white p-4 rounded-xl inline-block mx-auto mb-4">
               <img 
                 src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${JSON.stringify({ userId: user.id, restaurantId: restaurant.id, dishId: selectedDish })}`} 
                 alt="QR Code" 
                 className="w-48 h-48"
               />
             </div>
             <p className="text-xs text-gray-400">Valid for 15 minutes</p>
          </div>
        </div>
      )}
    </div>
  );
};