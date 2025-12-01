import React from 'react';
import { MOCK_REVIEWS } from '../constants';
import { Star, MessageCircle, Heart } from 'lucide-react';

export const Community: React.FC = () => {
  return (
    <div className="p-4 min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Foodie Feed</h1>
      
      <div className="grid gap-6">
        {MOCK_REVIEWS.map(post => (
          <div key={post.id} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center font-bold text-brand-600">
                {post.userName[0]}
              </div>
              <div>
                <p className="font-bold text-sm dark:text-white">{post.userName}</p>
                <p className="text-xs text-gray-500">{post.date}</p>
              </div>
            </div>
            
            <img src={post.image} className="w-full h-64 object-cover" alt="Food" />
            
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold dark:text-white">{post.dishName}</h3>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < post.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{post.text}</p>
              
              <div className="flex gap-4 border-t border-gray-100 dark:border-gray-800 pt-3">
                <button className="flex items-center gap-1 text-gray-500 text-sm hover:text-red-500">
                  <Heart className="w-4 h-4" /> Like
                </button>
                <button className="flex items-center gap-1 text-gray-500 text-sm hover:text-blue-500">
                  <MessageCircle className="w-4 h-4" /> Comment
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};