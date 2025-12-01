import React from 'react';
import { useApp } from '../context';
import { Zap, AlertTriangle, Check, Shield, CalendarClock, TrendingUp } from 'lucide-react';
import { Plan } from '../types';

export const Credits: React.FC = () => {
  const { user, plans, buyPlan, cancelSubscription } = useApp();

  // Helper to format currency
  const fmt = (val: number) => `R$ ${val.toFixed(2)}`;

  // Find specific plans for the funnel
  const experiencePlan = plans.find(p => p.id === 'exp_unique');
  
  // Filter plans for the upsell list (Monthly Trials)
  const upsellPlans = plans.filter(p => ['ess_monthly_trial', 'equi_monthly_trial', 'conv_monthly_trial'].includes(p.id));

  // State Logic
  const hasNoPlan = user.subscriptionStatus === 'none' || user.subscriptionStatus === 'cancelled';
  const isTrial = user.subscriptionStatus === 'trial'; // Experience Plan
  const isActive = user.subscriptionStatus === 'active';
  const currentPlan = plans.find(p => p.id === user.currentPlanId);

  // --- VIEW 1: FUNNEL START (No Plan) ---
  if (hasNoPlan) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 flex flex-col items-center justify-center text-center">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl max-w-md w-full border border-gray-100 dark:border-gray-800">
          <div className="w-20 h-20 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap className="w-10 h-10 text-brand-500" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Comece sua Experiência</h1>
          <p className="text-gray-500 mb-8">Descubra os melhores restaurantes da cidade com nosso plano de entrada.</p>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 mb-8 text-left">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-lg dark:text-white">{experiencePlan?.name}</span>
              <span className="text-2xl font-bold text-brand-600">{fmt(experiencePlan?.price || 0)}</span>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Check className="w-5 h-5 text-green-500" /> {experiencePlan?.credits} Créditos
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Check className="w-5 h-5 text-green-500" /> Validade de {experiencePlan?.durationDays} dias
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Check className="w-5 h-5 text-green-500" /> Sem compromisso (Trial)
              </li>
            </ul>
            <button 
              onClick={() => experiencePlan && buyPlan(experiencePlan.id)}
              className="w-full bg-brand-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/30"
            >
              Ativar Experiência
            </button>
            <p className="text-xs text-gray-400 text-center mt-4">
              Renova automaticamente para Essencial Semanal após 7 dias.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW 2: DASHBOARD (Active/Trial) ---
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 relative">
      {/* Header */}
      <div className="relative h-64 bg-gray-900 overflow-hidden rounded-b-[2.5rem] shadow-lg">
        <img 
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
          alt="Dining" 
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
        <div className="absolute bottom-28 left-6 right-6 flex justify-between items-end">
          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
              isTrial ? 'bg-yellow-500 text-yellow-950' : 'bg-green-500 text-white'
            }`}>
              {isTrial ? 'Período de Experiência' : 'Assinante VIP'}
            </span>
            <h1 className="text-3xl font-bold text-white">{currentPlan?.name}</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-5 -mt-20 relative z-10 space-y-6">
        
        {/* Balance Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl shadow-black/5 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1 uppercase tracking-wide">Saldo Disponível</p>
          <div className="text-7xl font-bold text-brand-600 dark:text-brand-500 mb-1 leading-none">{user.credits}</div>
          <p className="text-gray-400 text-sm font-medium">créditos</p>
          
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-4">
            <div className="text-left">
               <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                 <CalendarClock className="w-3 h-3" /> Próxima Cobrança
               </p>
               {user.nextBillingDate ? (
                 <>
                   <p className="text-sm font-bold text-gray-900 dark:text-white">
                     {new Date(user.nextBillingDate).toLocaleDateString()}
                   </p>
                   <p className="text-xs text-gray-400">{fmt(user.nextBillingAmount || 0)}</p>
                 </>
               ) : (
                 <p className="text-sm font-bold text-gray-900 dark:text-white">Cancelado</p>
               )}
            </div>
            <div className="text-left border-l border-gray-100 dark:border-gray-700 pl-4">
               <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                 <TrendingUp className="w-3 h-3" /> Status
               </p>
               <p className={`text-sm font-bold capitalize ${isTrial ? 'text-yellow-600' : 'text-green-600'}`}>
                 {user.subscriptionStatus === 'trial' ? 'Trial (Renova auto)' : user.subscriptionStatus}
               </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
            {isTrial && (
              <button 
                onClick={cancelSubscription}
                className="flex-1 bg-white dark:bg-gray-800 text-red-500 py-3 rounded-xl font-bold text-sm shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-900/10"
              >
                Cancelar Renovação
              </button>
            )}
            <button className="flex-1 bg-gray-900 dark:bg-gray-700 text-white py-3 rounded-xl font-bold text-sm shadow-sm">
              Histórico
            </button>
        </div>

        {/* UPSELL SECTION (Workflow 3.3) */}
        {(isTrial || currentPlan?.frequency === 'weekly') && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-brand-500" />
              <h2 className="font-bold text-lg text-gray-900 dark:text-white">Ofertas de Upgrade</h2>
            </div>
            
            {upsellPlans.map(plan => (
              <div key={plan.id} className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-xl">
                  {plan.discountPercent}% OFF
                </div>
                
                <h3 className="font-bold text-lg mb-1">{plan.name.replace('(Oferta)', '')}</h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-2xl font-bold">{fmt(plan.price)}</span>
                  <span className="text-indigo-200 line-through text-sm">
                    {/* Calculate original price roughly based on discount */}
                    {fmt(plan.price / (1 - (plan.discountPercent! / 100)))}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-indigo-100 text-sm mb-4">
                  <span className="bg-white/20 px-2 py-1 rounded-md">{plan.credits} créditos</span>
                  <span>Mensal</span>
                </div>

                <button 
                  onClick={() => buyPlan(plan.id)}
                  className="w-full bg-white text-indigo-600 py-3 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors"
                >
                  Migrar com Desconto
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};