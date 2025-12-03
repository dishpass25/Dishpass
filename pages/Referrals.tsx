
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
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
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
          className="w-full h-full object-cover brightness-[0.6]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-gray-50 dark:to-gray-950" />
        
        <div className="absolute top-10 left-0 right-0 text-center px-4">
           <h1 className="text-3xl font-bold text-white mb-1 shadow-black/20 drop-shadow-lg">INDICAÇÕES</h1>
           <p className="text-white/90 text-sm font-medium">Convide amigos e ganhe créditos</p>
        </div>
      </div>

      {/* 2. Conteúdo Principal (Sobreposto - Margem Negativa) */}
      <div className="px-5 -mt-24 relative z-10 space-y-6">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
           <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 flex flex-col items-center justify-center shadow-lg py-4">
              <Users className="w-6 h-6 text-orange-500 mb-1" />
              <span className="text-xl font-bold text-gray-900 dark:text-white leading-none">0</span>
              <span className="text-[10px] text-gray-500 mt-1">Indicações</span>
           </div>
           <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 flex flex-col items-center justify-center shadow-lg py-4">
              <CheckCircle className="w-6 h-6 text-green-500 mb-1" />
              <span className="text-xl font-bold text-gray-900 dark:text-white leading-none">0</span>
              <span className="text-[10px] text-gray-500 mt-1">Ativos</span>
           </div>
           <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 flex flex-col items-center justify-center shadow-lg py-4">
              <Gift className="w-6 h-6 text-purple-500 mb-1" />
              <span className="text-xl font-bold text-gray-900 dark:text-white leading-none">0</span>
              <span className="text-[10px] text-gray-500 mt-1">Bônus</span>
           </div>
        </div>

        {/* Card do Código */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md border border-gray-100 dark:border-gray-700 text-center">
           <div className="flex items-center justify-center gap-2 mb-4 text-orange-600 dark:text-orange-400 font-bold text-sm">
              <Gift className="w-4 h-4" />
              <span>Seu Código de Indicação</span>
           </div>
           
           <div className="bg-gray-100 dark:bg-gray-700/50 rounded-xl p-3 flex items-center justify-between mb-6 border border-gray-200 dark:border-gray-600">
              <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-wider flex-1 text-center pl-8">
                {user.referralCode}
              </span>
              <button 
                onClick={handleCopy}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
              >
                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              </button>
           </div>

           <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleShare('whatsapp')}
                className="bg-[#25D366] hover:bg-[#128C7E] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 transition-colors"
              >
                <MessageCircle className="w-5 h-5" /> WhatsApp
              </button>
              <button 
                onClick={() => handleShare('email')}
                className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <Mail className="w-5 h-5" /> E-mail
              </button>
           </div>
        </div>

        {/* Como Funciona */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
           <h3 className="font-bold text-gray-900 dark:text-white mb-6">Como Funciona</h3>
           
           <div className="space-y-6 relative">
              {/* Linha conectora */}
              <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-100 dark:bg-gray-700"></div>

              <div className="flex gap-4 relative">
                 <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-sm z-10 ring-4 ring-white dark:ring-gray-800">1</div>
                 <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">Compartilhe seu código</h4>
                    <p className="text-xs text-gray-500 mt-1">Envie seu código para amigos e familiares</p>
                 </div>
              </div>

              <div className="flex gap-4 relative">
                 <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-sm z-10 ring-4 ring-white dark:ring-gray-800">2</div>
                 <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">Eles se cadastram</h4>
                    <p className="text-xs text-gray-500 mt-1">Usando seu código no primeiro acesso</p>
                 </div>
              </div>

              <div className="flex gap-4 relative">
                 <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-sm z-10 ring-4 ring-white dark:ring-gray-800">3</div>
                 <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">Ganhem créditos!</h4>
                    <p className="text-xs text-gray-500 mt-1">Vocês dois ganham 5 créditos bônus</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Benefícios */}
        <div className="bg-purple-50 dark:bg-purple-900/10 rounded-3xl p-6 border border-purple-100 dark:border-purple-900/30">
           <div className="flex items-center gap-2 mb-4 text-purple-700 dark:text-purple-400 font-bold">
              <TrendingUp className="w-5 h-5" />
              <h3>Benefícios do Programa</h3>
           </div>
           
           <ul className="space-y-3">
              {[
                "Você ganha 5 créditos para cada amigo que se cadastrar",
                "Seu amigo também ganha 5 créditos de boas-vindas",
                "Sem limite de indicações",
                "Créditos válidos por 90 dias"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                   <div className="mt-0.5 bg-green-100 dark:bg-green-900/30 p-0.5 rounded-full">
                      <Check className="w-3 h-3 text-green-600" />
                   </div>
                   <p className="text-xs text-gray-600 dark:text-gray-300 font-medium leading-tight">{item}</p>
                </li>
              ))}
           </ul>
        </div>

        {/* Empty State / Lista */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 text-center shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center">
           <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 text-gray-400">
              <Users className="w-8 h-8" />
           </div>
           <p className="text-gray-900 dark:text-white font-medium mb-1">Você ainda não indicou ninguém</p>
           <p className="text-xs text-gray-500">Comece a compartilhar seu código agora!</p>
        </div>

      </div>

      {/* FAB Button */}
      <div className="fixed bottom-24 right-5 z-20">
         <button className="w-14 h-14 bg-[#ea580c] hover:bg-[#c2410c] rounded-full shadow-xl flex items-center justify-center text-white transition-transform active:scale-95">
            <Plus className="w-8 h-8" />
         </button>
      </div>

    </div>
  );
};
