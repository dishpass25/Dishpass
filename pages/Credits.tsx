
import React, { useState } from 'react';
import { useApp } from '../context';
import { Zap, Check, Shield, CalendarClock, History, ScanLine, Lock, PlusCircle, CreditCard, Banknote, Loader2, X, ChevronRight, ShieldAlert, Gift, Frown, ThumbsUp, PartyPopper } from 'lucide-react';
import { Plan, PaymentMethod } from '../types';
import { useNavigate } from 'react-router-dom';

export const Credits: React.FC = () => {
  const { user, plans, buyPlan, cancelSubscription, applyRetentionOffer, addCredits, addNotification } = useApp();
  const navigate = useNavigate();

  // Helper to format currency
  const fmt = (val: number) => `R$ ${val.toFixed(2).replace('.', ',')}`;

  // Find specific plans for the funnel
  const experiencePlan = plans.find(p => p.id === 'exp_unique');
  
  // State Logic
  const isFirstAccess = user.subscriptionStatus === 'none';
  const isTrial = user.subscriptionStatus === 'trial'; 
  const isActive = user.subscriptionStatus === 'active';
  const isCancelled = user.subscriptionStatus === 'cancelled';
  const isActiveOrTrial = isTrial || isActive;
  
  const currentPlan = plans.find(p => p.id === user.currentPlanId);

  // --- LOGIC: Calculate Credit Value based on Active Plan ---
  const currentCreditValue = currentPlan 
    ? (currentPlan.price / currentPlan.credits) 
    : 24.50; 

  // --- LOGIC: Upgrade Options Split ---
  const availableUpgradePlans = isTrial
    ? plans.filter(p => 
        (p.frequency === 'weekly') || 
        ['ess_monthly_trial', 'equi_monthly_trial', 'conv_monthly_trial'].includes(p.id)
      )
    : plans.filter(p => 
        p.id !== 'exp_unique' && 
        !p.isTrial
      );

  const weeklyUpgrades = availableUpgradePlans.filter(p => p.frequency === 'weekly');
  const monthlyUpgrades = availableUpgradePlans.filter(p => p.frequency === 'monthly');

  // --- PAYMENT MODAL STATE ---
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    type: 'plan' | 'credits';
    data: any; // Plan object or { credits: number, price: number }
  }>({ isOpen: false, type: 'plan', data: null });

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- CANCELLATION FUNNEL STATE ---
  const [cancelStep, setCancelStep] = useState<'none' | 'warning' | 'offer' | 'reason'>('none');
  const [cancelReason, setCancelReason] = useState<string>('');

  // --- HANDLERS ---

  const openPlanModal = (plan: Plan) => {
    setPaymentModal({
        isOpen: true,
        type: 'plan',
        data: plan
    });
    setSelectedMethod('credit_card'); // Default for plans
  };

  const openCreditsModal = (credits: number, price: number) => {
    setPaymentModal({
        isOpen: true,
        type: 'credits',
        data: { credits, price }
    });
    setSelectedMethod('pix'); // Default for credits
  };

  const handleConfirmPayment = () => {
    if (!selectedMethod || !paymentModal.data) return;
    
    setIsProcessing(true);

    // Simulation of payment delay with Random Failure
    setTimeout(() => {
        // Simular falha de pagamento em 20% dos casos para demonstrar notificação de erro
        const shouldFail = Math.random() < 0.2;

        if (shouldFail) {
             addNotification(
                'Falha no Pagamento', 
                `Não foi possível processar a compra de ${fmt(paymentModal.data.price)}. Verifique seu cartão ou tente outro método.`, 
                'error'
             );
             alert("Ops! Pagamento recusado (Simulação). Verifique suas notificações.");
        } else {
             // SUCESSO
             if (paymentModal.type === 'plan') {
                buyPlan(paymentModal.data.id, selectedMethod);
                // A notificação de sucesso já é disparada dentro de buyPlan no Context
                if (isActiveOrTrial) {
                    alert(`Mudança agendada! Seu plano mudará para ${paymentModal.data.name}.`);
                } else {
                    alert(`Assinatura realizada! Bem-vindo ao plano ${paymentModal.data.name}.`);
                }
            } else {
                addCredits(paymentModal.data.credits, paymentModal.data.price, selectedMethod);
                // A notificação de sucesso já é disparada dentro de addCredits no Context
                alert(`${paymentModal.data.credits} créditos adicionados com sucesso!`);
            }
        }
        
        setIsProcessing(false);
        setPaymentModal({ ...paymentModal, isOpen: false });
    }, 1500);
  };

  // Funil de Cancelamento
  const handleStartCancel = () => setCancelStep('warning');
  const handleProceedToOffer = () => setCancelStep('offer');
  const handleProceedToReason = () => setCancelStep('reason');
  const handleAcceptOffer = () => {
    applyRetentionOffer();
    // Notificação disparada no context
    alert("Oferta aplicada! Você ganhou 30% OFF na próxima renovação.");
    setCancelStep('none');
  };
  const handleConfirmCancel = () => {
    cancelSubscription();
    // Notificação disparada no context
    setCancelStep('none');
    alert("Sua assinatura foi cancelada. Sentiremos sua falta!");
  };

  // Render Helper for Plan Cards
  const renderPlanCard = (plan: Plan) => {
    const isAutoRenewalTarget = isTrial && plan.id === 'ess_weekly';
    const isCurrentPlan = user.currentPlanId === plan.id;

    let borderClass = 'border-gray-100 dark:border-gray-800';
    let ringClass = '';
    
    if (isAutoRenewalTarget) {
        borderClass = 'border-brand-500';
        ringClass = 'ring-2 ring-brand-500 ring-offset-2 ring-offset-gray-50 dark:ring-offset-gray-950';
    } else if (isCurrentPlan) {
        borderClass = 'border-green-500';
        ringClass = 'ring-2 ring-green-500 ring-offset-2 ring-offset-gray-50 dark:ring-offset-gray-950';
    }

    return (
      <div key={plan.id} className={`min-w-[280px] bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border snap-center relative overflow-hidden flex flex-col justify-between h-full ${borderClass} ${ringClass}`}>
          {(plan.discountPercent || 0) > 0 && !isCurrentPlan && (
            <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10">
               {plan.id.includes('monthly_trial') ? `-${plan.discountPercent}% (1º Mês)` : `-${plan.discountPercent}% OFF`}
            </div>
          )}
          
          {isCurrentPlan && (
            <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10 flex items-center gap-1">
               <Check className="w-3 h-3" /> ATUAL
            </div>
          )}
          
          <div>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white leading-tight mb-2">{plan.name}</h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">{plan.description}</p>
            
            <div className="mb-6">
                <div className="flex items-baseline gap-1.5">
                    <span className="text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">{plan.credits}</span>
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">créditos</span>
                </div>
                
                <div className="flex items-baseline gap-1 mt-3 text-gray-400">
                    <span className="text-sm font-medium">por</span>
                    <span className="text-3xl font-black text-gray-800 dark:text-gray-100">{fmt(plan.price)}</span>
                    <span className="text-xs font-medium">/ {plan.frequency === 'weekly' ? 'sem' : 'mês'}</span>
                </div>
            </div>
            
            <div className="space-y-2 mb-6">
               {/* Exibir informação de renovação APENAS se for o plano atual ou o programado */}
               {(isCurrentPlan || isAutoRenewalTarget) && (
                   <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                       <div className="flex items-start gap-2">
                          <CalendarClock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                              <p className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-wide">Renovação Programada</p>
                              <p className="text-xs text-gray-500 leading-relaxed mt-1">
                                 Cobrança automática de <strong>{fmt(plan.price)}</strong> a cada {plan.frequency === 'weekly' ? 'semana' : 'mês'}.
                              </p>
                              <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                                 <Shield className="w-3 h-3" /> Cancele quando quiser
                              </p>
                          </div>
                       </div>
                   </div>
               )}
               
               {plan.id.includes('monthly_trial') && !isCurrentPlan && (
                 <div className="mt-2 bg-red-50 dark:bg-red-900/20 p-2.5 rounded-lg">
                   <p className="text-[10px] text-red-600 dark:text-red-300 font-medium leading-tight">
                     *15% OFF no 1º mês, depois renova com 10% de desconto padrão.
                   </p>
                 </div>
               )}
            </div>
          </div>
          
          {isCurrentPlan ? (
             <div className="w-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl py-3 px-2 flex flex-col items-center justify-center text-center gap-1">
               <div className="flex items-center gap-1.5 text-green-700 dark:text-green-400 font-bold text-sm">
                  <Check className="w-4 h-4" />
                  <span>Plano em Vigência</span>
               </div>
               <p className="text-[10px] text-green-700/80 dark:text-green-400/80 font-medium leading-tight">
                 Próxima renovação: {user.nextBillingDate ? new Date(user.nextBillingDate).toLocaleDateString() : 'Em breve'}
               </p>
            </div>
          ) : isAutoRenewalTarget ? (
            <div className="w-full bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-xl py-3 px-2 flex flex-col items-center justify-center text-center gap-1">
               <div className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-bold text-sm">
                  <Lock className="w-4 h-4" />
                  <span>Já Programado</span>
               </div>
               <p className="text-[10px] text-brand-600/80 dark:text-brand-400/80 font-medium leading-tight">
                 Será ativado automaticamente após os 7 dias de experiência.
               </p>
            </div>
          ) : (
            <button 
              onClick={() => openPlanModal(plan)}
              className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3.5 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-base"
            >
              {isActiveOrTrial ? 'Mudar para este' : 'Assinar Agora'}
            </button>
          )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      
      {/* --- HEADER SECTION --- */}
      {!isFirstAccess ? (
        <div className="bg-white dark:bg-gray-900 px-6 pt-12 pb-6 rounded-b-[2rem] shadow-sm mb-6">
            <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-6xl sm:text-8xl font-black text-gray-900 dark:text-white tracking-tighter leading-none mb-1">Créditos</h1>
                <p className="text-sm text-gray-500 font-medium mt-1 ml-1">Gerencie sua assinatura</p>
            </div>
            
            <div className="flex gap-2">
                <button className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <History className="w-5 h-5" />
                </button>
            </div>
            </div>

            <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-brand-600 dark:to-brand-500 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            
            <div className="relative z-10 flex justify-between items-end mb-4">
                <div>
                    <p className="text-gray-300 text-sm font-medium mb-1">Saldo Disponível</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-bold tracking-tight">{user.credits}</span>
                        <span className="text-lg text-gray-400">créditos</span>
                    </div>
                </div>
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                    <Zap className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                </div>
            </div>

            <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-4 gap-2">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                        <ScanLine className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-300">Como usar</p>
                        <p className="text-xs font-medium text-white">Escaneie o QR no local</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-300">Valor do Crédito</p>
                    <p className="text-xs font-medium text-white">
                        {fmt(currentCreditValue)} / un
                    </p>
                </div>
            </div>
            </div>
        </div>
      ) : (
        <div className="pt-12 px-6 pb-2">
            <h1 className="text-5xl font-black text-gray-900 dark:text-white leading-none tracking-tighter">Comece sua<br/>jornada agora</h1>
        </div>
      )}

      {/* --- CREDITS PURCHASE SECTION --- */}
      {!isFirstAccess && (
        <div className="px-6 mb-8">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-brand-500" />
              Créditos Avulsos
              {!isActiveOrTrial && <span className="text-[10px] bg-gray-200 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full">Exclusivo Assinantes</span>}
            </h3>
            
            {isActiveOrTrial ? (
              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => openCreditsModal(1, 24.00)} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl flex flex-col items-center justify-center shadow-sm active:scale-95 transition-transform">
                    <span className="text-2xl font-black text-gray-900 dark:text-white">1</span>
                    <span className="text-sm font-bold text-gray-400 uppercase">crédito</span>
                    <span className="mt-2 text-sm font-bold text-brand-600">{fmt(24.00)}</span>
                </button>
                <button onClick={() => openCreditsModal(3, 72.00)} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl flex flex-col items-center justify-center shadow-sm active:scale-95 transition-transform relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-green-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-bl-lg">POPULAR</div>
                    <span className="text-2xl font-black text-gray-900 dark:text-white">3</span>
                    <span className="text-sm font-bold text-gray-400 uppercase">créditos</span>
                    <span className="mt-2 text-sm font-bold text-brand-600">{fmt(72.00)}</span>
                </button>
                <button onClick={() => openCreditsModal(6, 144.00)} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl flex flex-col items-center justify-center shadow-sm active:scale-95 transition-transform">
                    <span className="text-2xl font-black text-gray-900 dark:text-white">6</span>
                    <span className="text-sm font-bold text-gray-400 uppercase">créditos</span>
                    <span className="mt-2 text-sm font-bold text-brand-600">{fmt(144.00)}</span>
                </button>
              </div>
            ) : (
              <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-6 text-center border-2 border-dashed border-gray-200 dark:border-gray-800">
                 <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                   <Lock className="w-5 h-5 text-gray-400" />
                 </div>
                 <h4 className="text-gray-900 dark:text-white font-bold text-sm mb-1">Compra Bloqueada</h4>
                 <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[200px] mx-auto">
                   Assine um plano para ter acesso à compra de créditos avulsos com desconto.
                 </p>
              </div>
            )}
            
            {isActiveOrTrial && <p className="text-center text-xs text-gray-400 mt-2">Validade de 7 dias para créditos avulsos. (~2% OFF sobre o valor base)</p>}
        </div>
      )}

      {/* --- FUNNEL: EXPERIENCE PLAN (Only for First Access) --- */}
      {isFirstAccess && experiencePlan && (
        <div className="px-6 mb-8">
           <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-xl border border-brand-100 dark:border-brand-900/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 bg-brand-500 text-white font-bold text-xs px-4 py-1.5 rounded-bl-2xl z-20">
                 OFERTA ÚNICA
              </div>
              
              <div className="relative z-10">
                 <div className="flex justify-between items-start mb-2">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">Plano<br/>Experiência</h2>
                    <div className="bg-brand-50 dark:bg-brand-900/20 px-3 py-2 rounded-xl border border-brand-100 dark:border-brand-800 flex flex-col items-center shadow-sm">
                        <span className="text-2xl font-black text-brand-600 dark:text-brand-400 leading-none">{experiencePlan.credits}</span>
                        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">créditos</span>
                    </div>
                 </div>

                 <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-gray-400 text-sm line-through">de {fmt(73.50)}</span>
                    <span className="text-brand-600 dark:text-brand-500 text-lg font-bold">por</span>
                    <span className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">{fmt(experiencePlan.price)}</span>
                 </div>

                 <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 mb-8 space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-full">
                         <Check className="w-4 h-4 text-green-600" />
                       </div>
                       <p className="text-sm font-medium text-gray-700 dark:text-gray-300"><strong>3 Créditos</strong> para usar agora</p>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-full">
                         <Check className="w-4 h-4 text-green-600" />
                       </div>
                       <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Acesso a <strong>VÁRIOS</strong> restaurantes</p>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-full">
                         <Check className="w-4 h-4 text-green-600" />
                       </div>
                       <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Sem compromisso de fidelidade</p>
                    </div>
                 </div>

                 <button 
                   onClick={() => openPlanModal(experiencePlan)}
                   className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-brand-500/30 text-lg flex items-center justify-center gap-2 transition-all active:scale-95"
                 >
                    Quero Experimentar <ChevronRight className="w-5 h-5" />
                 </button>
                 
                 <p className="text-center text-[10px] text-gray-400 mt-4 leading-tight max-w-xs mx-auto">
                    Após 7 dias, renovação automática para o plano Essencial Semanal (6 créditos por {fmt(147.00)}/sem). Cancele a qualquer momento.
                 </p>
              </div>
           </div>
        </div>
      )}

      {/* --- UPSELL LISTS (For Active/Trial Users) --- */}
      {!isFirstAccess && (
        <div className="space-y-8 px-6 pb-6">
           {/* Weekly Plans */}
           <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 pl-2">Planos Semanais</h3>
              <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x">
                 {weeklyUpgrades.map(plan => renderPlanCard(plan))}
              </div>
           </div>

           {/* Monthly Plans */}
           <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 pl-2">Ofertas Mensais</h3>
              <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x">
                 {monthlyUpgrades.map(plan => renderPlanCard(plan))}
              </div>
           </div>
        </div>
      )}

      {/* --- DISCREET CANCEL BUTTON --- */}
      {!isFirstAccess && !isCancelled && (
        <div className="flex justify-center pb-8 pt-4">
           <button 
             onClick={handleStartCancel}
             className="text-gray-400 text-xs font-medium hover:text-red-500 transition-colors border-b border-transparent hover:border-red-500 pb-0.5"
           >
             Cancelar Assinatura
           </button>
        </div>
      )}

      {/* --- CANCEL FUNNEL MODAL --- */}
      {cancelStep !== 'none' && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
           <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 relative overflow-hidden">
             
             {/* Step 1: Warning / Loss Aversion */}
             {cancelStep === 'warning' && (
                <div className="text-center">
                    <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShieldAlert className="w-10 h-10 text-orange-600 dark:text-orange-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Tem certeza?</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                       Ao cancelar, você perderá acesso aos seus <strong>{user.credits} créditos</strong> restantes e às tarifas exclusivas de assinante.
                    </p>
                    
                    <div className="space-y-3">
                       <button 
                          onClick={() => setCancelStep('none')} 
                          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-500/30"
                       >
                          Manter meu plano
                       </button>
                       <button 
                          onClick={handleProceedToOffer} 
                          className="w-full bg-transparent text-gray-400 font-bold py-3 text-sm hover:text-gray-600 dark:hover:text-gray-200"
                       >
                          Continuar cancelamento
                       </button>
                    </div>
                </div>
             )}

             {/* Step 2: The Offer */}
             {cancelStep === 'offer' && (
                <div className="text-center">
                    <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                        <Gift className="w-10 h-10 text-purple-600 dark:text-purple-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Espere! Temos um presente.</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                       Não queremos te perder. Que tal <strong>30% de DESCONTO</strong> na sua próxima renovação para continuar conosco?
                    </p>
                    
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl mb-6 border border-purple-100 dark:border-purple-800">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-gray-500">Próxima Fatura:</span>
                            <span className="text-sm font-bold text-gray-400 line-through">{fmt(user.nextBillingAmount || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                            <span className="text-base font-bold text-purple-600 dark:text-purple-400">Com Desconto:</span>
                            <span className="text-2xl font-black text-purple-600 dark:text-purple-400">{fmt((user.nextBillingAmount || 0) * 0.7)}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                       <button 
                          onClick={handleAcceptOffer} 
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
                       >
                          <PartyPopper className="w-5 h-5" />
                          Aceitar Oferta
                       </button>
                       <button 
                          onClick={handleProceedToReason} 
                          className="w-full bg-transparent text-gray-400 font-bold py-3 text-sm hover:text-gray-600 dark:hover:text-gray-200"
                       >
                          Não, quero cancelar
                       </button>
                    </div>
                </div>
             )}

             {/* Step 3: Reason / Final */}
             {cancelStep === 'reason' && (
                <div>
                   <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                         <Frown className="w-5 h-5 text-gray-500" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">Por que você está saindo?</h3>
                   </div>

                   <div className="space-y-2 mb-8">
                      {['Muito caro', 'Não uso o suficiente', 'Não gostei dos restaurantes', 'Outro motivo'].map((reason) => (
                         <button
                            key={reason}
                            onClick={() => setCancelReason(reason)}
                            className={`w-full text-left p-3 rounded-xl border font-medium transition-all ${
                               cancelReason === reason 
                               ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300' 
                               : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                         >
                            {reason}
                         </button>
                      ))}
                   </div>

                   <button 
                      onClick={handleConfirmCancel}
                      disabled={!cancelReason}
                      className="w-full bg-red-50 disabled:bg-gray-100 dark:bg-red-900/20 dark:disabled:bg-gray-800 text-red-600 disabled:text-gray-400 font-bold py-4 rounded-xl mb-3 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                   >
                      Confirmar Cancelamento
                   </button>
                   <button 
                      onClick={() => setCancelStep('none')} 
                      className="w-full text-center text-gray-500 font-bold text-sm"
                   >
                      Voltar
                   </button>
                </div>
             )}

           </div>
        </div>
      )}

      {/* --- PAYMENT MODAL --- */}
      {paymentModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in">
           <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-[2rem] sm:rounded-[2rem] p-6 shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95">
              
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    {paymentModal.type === 'plan' ? <CreditCard className="w-6 h-6 text-brand-500" /> : <PlusCircle className="w-6 h-6 text-brand-500" />}
                    {paymentModal.type === 'plan' ? 'Confirmar Assinatura' : 'Comprar Créditos'}
                 </h3>
                 <button onClick={() => setPaymentModal({ ...paymentModal, isOpen: false })} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500">
                    <X className="w-5 h-5" />
                 </button>
              </div>

              {/* Summary */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl mb-6 flex justify-between items-center">
                 <div>
                    <p className="text-sm text-gray-500 font-medium">{paymentModal.type === 'plan' ? paymentModal.data.name : `${paymentModal.data.credits} Créditos Avulsos`}</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">{fmt(paymentModal.data.price)}</p>
                 </div>
                 {paymentModal.type === 'plan' && isActiveOrTrial && (
                    <div className="text-right">
                        <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-1 rounded-md">AGENDAMENTO</span>
                        <p className="text-[10px] text-gray-400 mt-1 max-w-[100px] leading-tight">Cobrança na próxima renovação</p>
                    </div>
                 )}
              </div>

              {/* Methods */}
              <div className="space-y-3 mb-8">
                 <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">Forma de Pagamento</p>
                 
                 {paymentModal.type === 'credits' && (
                    <button 
                        onClick={() => setSelectedMethod('pix')}
                        className={`w-full p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                            selectedMethod === 'pix' 
                            ? 'border-brand-500 dark:border-brand-500 bg-brand-50 dark:bg-brand-900/20 ring-1 ring-brand-500' 
                            : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                    >
                        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">PIX</div>
                        <span className="font-bold text-gray-900 dark:text-white">PIX (Instantâneo)</span>
                    </button>
                 )}

                 <button 
                    onClick={() => setSelectedMethod('credit_card')}
                    className={`w-full p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                        selectedMethod === 'credit_card' 
                        ? 'border-brand-500 dark:border-brand-500 bg-brand-50 dark:bg-brand-900/20 ring-1 ring-brand-500' 
                        : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                 >
                    <CreditCard className="w-6 h-6 text-gray-900 dark:text-white" />
                    <span className="font-bold text-gray-900 dark:text-white">Cartão de Crédito</span>
                 </button>

                 <button 
                    onClick={() => setSelectedMethod('debit_card')}
                    className={`w-full p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                        selectedMethod === 'debit_card' 
                        ? 'border-brand-500 dark:border-brand-500 bg-brand-50 dark:bg-brand-900/20 ring-1 ring-brand-500' 
                        : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                 >
                    <Banknote className="w-6 h-6 text-gray-900 dark:text-white" />
                    <span className="font-bold text-gray-900 dark:text-white">Cartão de Débito</span>
                 </button>
              </div>

              <button 
                onClick={handleConfirmPayment}
                disabled={isProcessing || !selectedMethod}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-lg"
              >
                {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Confirmar Pagamento'}
              </button>

           </div>
        </div>
      )}

    </div>
  );
};
