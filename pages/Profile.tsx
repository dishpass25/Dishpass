
import React from 'react';
import { useApp } from '../context';
import { 
  Moon, Sun, LogOut, Settings, History, 
  CreditCard, Share2, HelpCircle, ChevronRight, 
  Utensils, TrendingUp, Wallet, ShieldCheck 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Profile: React.FC = () => {
  const { user, theme, toggleTheme, toggleStaffMode } = useApp();
  const navigate = useNavigate();

  // Mock data para estatísticas visuais (conforme vídeo)
  const stats = [
    { 
      label: 'Refeições', 
      value: '0', 
      icon: Utensils, 
      bg: 'bg-orange-50 dark:bg-orange-900/20', 
      text: 'text-orange-500' 
    },
    { 
      label: 'Economia', 
      value: 'R$ 0', 
      icon: TrendingUp, 
      bg: 'bg-green-50 dark:bg-green-900/20', 
      text: 'text-green-500' 
    },
    { 
      label: 'Créditos', 
      value: user.credits, 
      icon: Wallet, 
      bg: 'bg-purple-50 dark:bg-purple-900/20', 
      text: 'text-purple-500' 
    },
  ];

  const menuItems = [
    { 
      icon: Settings, 
      label: 'Preferências', 
      sub: 'Dieta, alergias e categorias',
      action: () => {} 
    },
    { 
      icon: History, 
      label: 'Histórico de Pagamentos', 
      sub: 'Ver transações anteriores',
      action: () => {} // navigate('/history')
    },
    { 
      icon: CreditCard, 
      label: 'Meus Créditos', 
      sub: 'Gerenciar saldo',
      action: () => navigate('/credits') 
    },
    { 
      icon: Share2, 
      label: 'Indicações', 
      sub: 'Convide amigos',
      action: () => navigate('/referrals') 
    },
    { 
      icon: HelpCircle, 
      label: 'Ajuda', 
      sub: 'Central de suporte',
      action: () => navigate('/community') 
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-28">
      
      {/* 1. Header Imersivo */}
      <div className="relative h-72 bg-gray-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
          alt="Profile Cover" 
          className="absolute inset-0 w-full h-full object-cover brightness-[0.65]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-gray-50 dark:to-gray-950" />
        
        <div className="absolute top-14 left-6 right-6">
           <div className="flex justify-between items-start">
              <div>
                <h1 className="text-6xl sm:text-8xl font-black text-white mb-2 tracking-tighter drop-shadow-xl">Meu Perfil</h1>
                <p className="text-gray-300 text-lg font-medium">Gerencie sua conta e preferências</p>
              </div>
           </div>
        </div>
      </div>

      {/* 2. Card de Usuário Flutuante */}
      <div className="px-6 relative -mt-24 z-10">
        <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 shadow-xl shadow-black/5 flex items-center gap-5">
          <div className="relative">
             <img 
               src={user.avatar} 
               alt={user.name} 
               className="w-24 h-24 rounded-2xl object-cover border-4 border-white dark:border-gray-800 shadow-md" 
             />
             <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-2 border-white dark:border-gray-900"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white truncate mb-1">{user.name}</h2>
            <p className="text-base text-gray-500 truncate">{user.email}</p>
          </div>
        </div>

        {/* 3. Estatísticas (Refeições, Economia, Créditos) */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-900 rounded-2xl p-5 flex flex-col items-center justify-center shadow-sm border border-gray-100 dark:border-gray-800">
               <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${stat.bg} ${stat.text}`}>
                 <stat.icon className="w-6 h-6" />
               </div>
               <span className="text-2xl font-bold text-gray-900 dark:text-white leading-none mb-1">{stat.value}</span>
               <span className="text-xs text-gray-500 uppercase tracking-wide font-bold">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* 4. Modo Escuro Card */}
        <div className="mt-6 bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between">
           <div className="flex items-center gap-5">
              <div className="bg-orange-50 dark:bg-gray-800 p-3 rounded-full">
                {theme === 'light' ? <Sun className="w-6 h-6 text-orange-500" /> : <Moon className="w-6 h-6 text-gray-400" />}
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white text-lg">Modo Escuro</p>
                <p className="text-sm text-gray-500">{theme === 'dark' ? 'Ativado' : 'Desativado'}</p>
              </div>
           </div>
           
           <button 
             onClick={toggleTheme}
             className={`w-16 h-9 rounded-full p-1 transition-colors duration-300 ${theme === 'dark' ? 'bg-orange-500' : 'bg-gray-200'}`}
           >
             <div className={`bg-white w-7 h-7 rounded-full shadow-md transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-7' : ''}`} />
           </button>
        </div>

        {/* 5. Menu List */}
        <div className="mt-6 space-y-4">
           {menuItems.map((item, idx) => (
             <button 
               key={idx}
               onClick={item.action}
               className="w-full bg-white dark:bg-gray-900 rounded-2xl p-5 flex items-center justify-between shadow-sm border border-gray-100 dark:border-gray-800 active:scale-[0.98] transition-transform"
             >
                <div className="flex items-center gap-5">
                   <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl text-gray-600 dark:text-gray-400">
                      <item.icon className="w-6 h-6" />
                   </div>
                   <div className="text-left">
                      <p className="font-bold text-gray-900 dark:text-white text-lg">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.sub}</p>
                   </div>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-300" />
             </button>
           ))}
           
           {/* Item Extra: Modo Staff (Demo) */}
           <button 
               onClick={toggleStaffMode}
               className="w-full bg-white dark:bg-gray-900 rounded-2xl p-5 flex items-center justify-between shadow-sm border border-gray-100 dark:border-gray-800 active:scale-[0.98] transition-transform"
             >
                <div className="flex items-center gap-5">
                   <div className={`p-3 rounded-xl ${user.isRestaurantStaff ? 'bg-green-100 text-green-600' : 'bg-gray-50 text-gray-600'}`}>
                      <ShieldCheck className="w-6 h-6" />
                   </div>
                   <div className="text-left">
                      <p className="font-bold text-gray-900 dark:text-white text-lg">Modo Staff (Demo)</p>
                      <p className="text-sm text-gray-500">{user.isRestaurantStaff ? 'Ativado' : 'Toque para ativar'}</p>
                   </div>
                </div>
                
                <div className={`w-4 h-4 rounded-full ${user.isRestaurantStaff ? 'bg-green-500' : 'bg-gray-300'}`} />
             </button>
        </div>

        {/* Rodapé */}
        <div className="mt-10 mb-8">
           <div className="flex justify-between text-base text-gray-400 px-6 mb-6 font-medium">
              <span>Termos de Serviço</span>
              <span>Política de Cancelamento</span>
           </div>
           
           <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 transition-colors text-lg">
              <LogOut className="w-6 h-6" />
              Sair da Conta
           </button>
           
           <p className="text-center text-sm text-gray-400 mt-8 font-medium">DISHpass v1.0.0</p>
        </div>

      </div>
    </div>
  );
};
