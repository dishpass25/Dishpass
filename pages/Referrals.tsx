
import React, { useState } from 'react';
import { useApp } from '../context';
import { Copy, Users, CheckCircle, Share2, Gift, Check, Mail, MessageCircle, UserPlus, Plus, TrendingUp } from 'lucide-react';

export const Referrals: React.FC = () => {
  const { user } = useApp();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: 'whatsapp' | 'email') => {
    const text = `Use meu código ${user.referralCode} para ganhar créditos no DISHpass!`;
    
    if (platform === 'whatsapp') {
      // Verifica se é dispositivo móvel para usar o esquema nativo (whatsapp://)
      // Isso prioriza a abertura do aplicativo padrão instalado em vez de abrir uma aba no navegador.
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (isMobile) {
        // Tenta abrir direto no app via Deep Link
        window.location.href = `whatsapp://send?text=${encodeURIComponent(text)}`;
      } else {
        // Fallback para Web/Desktop
        window.open(`https://web.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
      }
    } else {
      window.open(`mailto:?subject=Convite DISHpass&body=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 relative">
      
      {/* 1. Header com Imagem */}
      <div className="relative h-64 w-full">
        <img 
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
          alt="Friends Eating" 
          className="w-full h-full object-cover brightness-[0.65]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-gray-50 dark:to-gray-950" />
        
        <div className="absolute top-12 left-0 right-0 text-center px-6">
           <h1 className="text-5xl sm:text-7xl font-black text-white mb-2 shadow-black/20 drop-shadow-xl tracking-tighter">INDICAÇÕES</h1>
           <p className="text-white/90 text-lg font-medium">Convide amigos e ganhe créditos.</p>
        </div>
      </div>

      <div className="px-6 relative z-10 -mt-20">
        
        {/* 2. Card Principal (Código) */}
        <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 shadow-xl text-center mb-6">
           <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
              <Gift className="w-7 h-7" />
           </div>
           <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Seu Código de Convite</h2>
           <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
             Compartilhe este código. Quando seu amigo fizer a primeira assinatura, vocês dois ganham!
           </p>
           
           <button 
             onClick={handleCopy}
             className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl py-4 flex items-center justify-center gap-3 relative overflow-hidden group hover:border-brand-300 transition-colors"
           >
              <span className="text-3xl font-mono font-bold text-gray-800 dark:text-gray-200 tracking-wider">
                {user.referralCode}
              </span>
              <div className="bg-white dark:bg-gray-700 p-2 rounded-full shadow-sm">
                 {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
              </div>
           </button>
           {copied && <p className="text-green-500 text-xs font-bold mt-2">Copiado!</p>}
        </div>

        {/* 3. Como Funciona */}
        <div className="mb-8">
           <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
             <TrendingUp className="w-5 h-5 text-brand-500" />
             Como Funciona
           </h3>
           <div className="space-y-4">
              <div className="flex gap-4">
                 <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-sm">1</div>
                    <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-800 my-1"></div>
                 </div>
                 <div className="pb-4">
                    <h4 className="font-bold text-gray-900 dark:text-white text-base">Envie o convite</h4>
                    <p className="text-sm text-gray-500">Compartilhe seu código com amigos que amam comer bem.</p>
                 </div>
              </div>
              <div className="flex gap-4">
                 <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-sm">2</div>
                    <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-800 my-1"></div>
                 </div>
                 <div className="pb-4">
                    <h4 className="font-bold text-gray-900 dark:text-white text-base">Amigo assina</h4>
                    <p className="text-sm text-gray-500">Seu amigo cria uma conta e assina qualquer plano.</p>
                 </div>
              </div>
              <div className="flex gap-4">
                 <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-sm">
                       <Gift className="w-4 h-4" />
                    </div>
                 </div>
                 <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-base">Vocês ganham!</h4>
                    <p className="text-sm text-gray-500">20 créditos para você e 10 para seu amigo automaticamente.</p>
                 </div>
              </div>
           </div>
        </div>

        {/* 4. Botões de Compartilhamento */}
        <div className="grid grid-cols-2 gap-3 mb-8">
           <button 
             onClick={() => handleShare('whatsapp')}
             className="bg-[#25D366] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:brightness-95 transition-all text-sm"
           >
              <MessageCircle className="w-5 h-5" /> WhatsApp
           </button>
           <button 
             onClick={() => handleShare('email')}
             className="bg-gray-800 dark:bg-gray-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-gray-700 transition-all text-sm"
           >
              <Mail className="w-5 h-5" /> Email
           </button>
        </div>

      </div>
    </div>
  );
};
