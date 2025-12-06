
import React, { useState } from 'react';
import { Camera, Plus, MessageSquare, Heart, Share2, Instagram, Flag, Star } from 'lucide-react';
import { useApp } from '../context';

export const Community: React.FC = () => {
  const { user, reviews, reportReview } = useApp();
  
  // Filtrar apenas reviews com imagens e que NÃO estão ocultas (Moderação)
  const feedReviews = reviews.filter(r => r.image && !r.isHidden);

  return (
    <div className="min-h-screen bg-gray-900 pb-24 relative overflow-hidden">
      
      {/* 1. Header Imersivo */}
      <div className="relative h-64 w-full">
        <img 
          src="https://images.unsplash.com/photo-1511690656952-34342d2c7135?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
          alt="Community Header" 
          className="w-full h-full object-cover brightness-[0.65]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-gray-900" />
        
        <div className="absolute bottom-6 left-6 right-6">
           <h1 className="text-5xl sm:text-7xl font-black text-white mb-2 tracking-tighter drop-shadow-xl">Comunidade</h1>
           <p className="text-gray-300 text-lg font-medium">Compartilhe suas experiências</p>
        </div>
      </div>

      {/* 2. Conteúdo Principal */}
      <div className="px-6 space-y-6 relative z-10 -mt-6">
        
        {/* Banner Instagram */}
        <div className="bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-8 -mt-8 blur-2xl"></div>
           
           <div className="flex items-start gap-4 relative z-10">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/30 flex-shrink-0">
                 <Camera className="w-7 h-7 text-white" />
              </div>
              <div>
                 <h3 className="font-bold text-xl leading-tight mb-2">Compartilhe no Instagram!</h3>
                 <p className="text-purple-100 text-base mb-4 leading-relaxed font-medium">
                   Marque suas fotos com #dishpass e apareça aqui na comunidade.
                 </p>
                 <div className="flex gap-3 flex-wrap">
                    <span className="bg-black/20 text-sm font-bold px-4 py-1.5 rounded-lg backdrop-blur-sm">#dishpass</span>
                 </div>
              </div>
           </div>
        </div>

        {/* FEED DE REVIEWS */}
        <div className="space-y-6">
           {feedReviews.length > 0 ? (
               feedReviews.map(review => (
                   <div key={review.id} className="bg-gray-800 rounded-3xl overflow-hidden shadow-lg border border-gray-700">
                       {/* Header do Post */}
                       <div className="p-4 flex items-center justify-between">
                           <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                                   <img src={review.userAvatar || `https://ui-avatars.com/api/?name=${review.userName}&background=random`} className="w-full h-full object-cover" />
                               </div>
                               <div>
                                   <p className="text-white font-bold text-sm">{review.userName}</p>
                                   <div className="flex items-center gap-1">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                          <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`} />
                                      ))}
                                   </div>
                               </div>
                           </div>
                           <button 
                             onClick={() => {
                                 if(confirm("Deseja reportar este conteúdo para a administração?")) {
                                     reportReview(review.id);
                                     alert("Conteúdo reportado e ocultado preventivamente.");
                                 }
                             }}
                             className="text-gray-500 hover:text-red-500"
                           >
                               <Flag className="w-4 h-4" />
                           </button>
                       </div>

                       {/* Imagem */}
                       <div className="relative aspect-square">
                           <img src={review.image} className="w-full h-full object-cover" alt="Review Photo" />
                           {review.dishName && (
                               <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                                   {review.dishName}
                               </div>
                           )}
                       </div>

                       {/* Caption */}
                       {review.text && (
                           <div className="p-4 pt-3">
                               <p className="text-gray-300 text-sm leading-relaxed">
                                   <span className="font-bold text-white mr-2">{review.userName}</span>
                                   {review.text}
                               </p>
                           </div>
                       )}

                       {/* Actions (Fake) */}
                       <div className="px-4 pb-4 flex gap-4">
                           <button className="flex items-center gap-1.5 text-gray-400 hover:text-red-500 transition-colors">
                               <Heart className="w-6 h-6" />
                           </button>
                           <button className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors">
                               <Share2 className="w-6 h-6" />
                           </button>
                       </div>
                   </div>
               ))
           ) : (
               /* Empty State */
                <div className="h-72 bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-700 flex flex-col items-center justify-center text-center p-8">
                    <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-600">
                    <MessageSquare className="w-10 h-10" />
                    </div>
                    <h3 className="text-white font-bold text-xl mb-2">Nenhum post ainda</h3>
                    <p className="text-gray-500 text-base">Seja o primeiro a compartilhar sua experiência com foto!</p>
                </div>
           )}
        </div>

      </div>

    </div>
  );
};
