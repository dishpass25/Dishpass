
import React, { useState } from 'react';
import { Camera, Plus, MessageSquare, Heart, Share2, Instagram } from 'lucide-react';
import { useApp } from '../context';

export const Community: React.FC = () => {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState<'feed' | 'my-posts'>('feed');

  return (
    <div className="min-h-screen bg-gray-900 pb-24 relative overflow-hidden">
      
      {/* 1. Header Imersivo */}
      <div className="relative h-64 w-full">
        <img 
          src="https://images.unsplash.com/photo-1511690656952-34342d2c7135?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
          alt="Community Header" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900" />
        
        <div className="absolute bottom-6 left-6 right-6">
           <h1 className="text-4xl font-bold text-white mb-1 tracking-tight">Comunidade</h1>
           <p className="text-gray-300 text-sm font-medium">Compartilhe suas experiências</p>
        </div>

        {/* Botão de Adicionar (Topo Direito) */}
        <div className="absolute top-6 right-6">
           <button className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20">
              <Plus className="w-6 h-6" />
           </button>
        </div>
      </div>

      {/* 2. Conteúdo Principal */}
      <div className="px-5 space-y-6 relative z-10 -mt-4">
        
        {/* Banner Instagram */}
        <div className="bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
           
           <div className="flex items-start gap-4 relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30 flex-shrink-0">
                 <Camera className="w-6 h-6 text-white" />
              </div>
              <div>
                 <h3 className="font-bold text-lg leading-tight mb-1">Compartilhe no Instagram!</h3>
                 <p className="text-purple-100 text-xs mb-3 leading-relaxed">
                   Marque suas fotos com #dishpass e apareça aqui na comunidade.
                 </p>
                 <div className="flex gap-2">
                    <span className="bg-black/20 text-xs font-bold px-2 py-1 rounded-lg backdrop-blur-sm">#dishpass</span>
                    <span className="bg-black/20 text-xs font-bold px-2 py-1 rounded-lg backdrop-blur-sm">#dishpassexperience</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Input de Criação (Fake) */}
        <div className="bg-gray-800 rounded-3xl p-4 flex items-center gap-3 border border-gray-700 shadow-lg">
           <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg">
              {user.avatar ? <img src={user.avatar} className="w-full h-full rounded-full object-cover" /> : user.name[0]}
           </div>
           <div className="flex-1">
              <p className="text-gray-400 text-sm">Compartilhe sua experiência...</p>
           </div>
           <MessageSquare className="w-5 h-5 text-gray-500" />
        </div>

        {/* Empty State / Feed Placeholder */}
        <div className="h-64 bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-700 flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-600">
               <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className="text-white font-bold text-lg mb-1">Nenhum post ainda</h3>
            <p className="text-gray-500 text-sm">Seja o primeiro a compartilhar sua experiência gastronômica!</p>
        </div>

      </div>

      {/* Botão Flutuante (FAB) */}
      <div className="fixed bottom-24 right-5 z-20">
         <button className="w-16 h-16 bg-orange-500 hover:bg-orange-600 rounded-full shadow-lg shadow-orange-500/30 flex items-center justify-center text-white transition-transform active:scale-95">
            <Plus className="w-8 h-8" />
         </button>
      </div>

    </div>
  );
};
