
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ChevronRight, Map, Utensils, ScanLine, Star, Sparkles, Check, ArrowRight, Wallet, TrendingUp, CreditCard, ArrowLeft, Zap, Rocket } from 'lucide-react';

interface TutorialOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'help' | 'onboarding'; // Novo prop para diferenciar os modos
}

// Passos do Tutorial de AJUDA (Acesso via ? após onboarding)
const HELP_STEPS = [
  {
    icon: Sparkles,
    title: "Sua chave para a cidade",
    description: "Com o DISHpass, você tem acesso a dezenas de restaurantes diferentes com uma única assinatura. A liberdade de comer onde quiser.",
    color: "bg-brand-500",
    textColor: "text-brand-500"
  },
  {
    icon: Map,
    title: "1. Encontre",
    description: "Navegue pelo mapa e use sua localização para descobrir uma variedade incrível de opções gastronômicas onde quer que você esteja.",
    color: "bg-blue-500",
    textColor: "text-blue-500"
  },
  {
    icon: Utensils,
    title: "2. Escolha",
    description: "Uma inovação inédita: pratos classificados em 1, 2 ou 3 créditos. Uma forma fixa e previsível de consumir, sem surpresas na conta.",
    color: "bg-orange-500",
    textColor: "text-orange-500"
  },
  {
    icon: ScanLine,
    title: "3. Escaneie",
    description: "Ao chegar no restaurante e pedir, use o botão de Scanner do app para ler o QR Code do local e pagar.",
    color: "bg-green-500",
    textColor: "text-green-500"
  },
  {
    icon: Star,
    title: "4. Avalie",
    description: "Tire uma foto e avalie sua experiência. Sua opinião ajuda a comunidade a comer melhor.",
    color: "bg-purple-500",
    textColor: "text-purple-500"
  }
];

// Passos do Tutorial de ONBOARDING (Primeiro Acesso / Boas vindas) - Foco em Funil de Assinatura
const ONBOARDING_STEPS = [
  {
    icon: Rocket,
    title: "Bem-vindo ao DISHpass",
    description: "Você acaba de descobrir a maneira mais inteligente de comer nos melhores restaurantes da cidade.",
    color: "bg-brand-500",
    textColor: "text-brand-500"
  },
  {
    icon: Utensils,
    title: "O Modelo 1-2-3",
    description: "Esqueça o cardápio com preços variados. Aqui, qualquer prato custa fixamente 1, 2 ou 3 créditos. Simples e sem surpresas.",
    color: "bg-orange-500",
    textColor: "text-orange-500"
  },
  {
    icon: ScanLine,
    title: "Como Usar?",
    description: "É fácil: Escolha o restaurante no app, vá até o local e pague escaneando o QR Code com seus créditos.",
    color: "bg-blue-500",
    textColor: "text-blue-500"
  },
  {
    icon: TrendingUp,
    title: "Economia Real",
    description: "Nossos assinantes economizam até 40% em comparação a quem paga diretamente no balcão.",
    color: "bg-green-500",
    textColor: "text-green-500"
  },
  {
    icon: Zap,
    title: "Ative sua Economia", // Funil de Vendas
    description: "Para começar a usar, escolha o plano ideal para sua fome e garanta o menor preço por refeição agora mesmo.",
    color: "bg-purple-600",
    textColor: "text-purple-600"
  }
];

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ isOpen, onClose, mode = 'help' }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  // Seleciona os passos baseados no modo
  const steps = mode === 'onboarding' ? ONBOARDING_STEPS : HELP_STEPS;

  // Reset step when opening
  useEffect(() => {
    if (isOpen) setCurrentStep(0);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onClose();
      // SE for onboarding, redireciona para a página de Planos (Funil)
      if (mode === 'onboarding') {
        navigate('/credits');
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const StepIcon = steps[currentStep].icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative flex flex-col items-center text-center animate-in zoom-in-95 duration-300 overflow-hidden border border-gray-100 dark:border-gray-800">
        
        {/* Skip Button */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 font-bold text-xs uppercase tracking-wider"
        >
          Pular
        </button>

        {/* Progress Bars */}
        <div className="flex gap-1.5 absolute top-6 left-6 right-20">
           {steps.map((_, idx) => (
             <div 
               key={idx} 
               className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${idx <= currentStep ? steps[currentStep].color : 'bg-gray-100 dark:bg-gray-800'}`}
             />
           ))}
        </div>

        {/* Content Area */}
        <div className="mt-12 mb-8 flex-1 flex flex-col items-center justify-center min-h-[300px]">
           {/* Animated Icon Circle */}
           <div key={currentStep} className={`w-32 h-32 rounded-full ${steps[currentStep].color} bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center mb-8 animate-in zoom-in duration-500 relative`}>
              {/* Ripple Effect */}
              <div className={`absolute inset-0 rounded-full ${steps[currentStep].color} opacity-20 animate-ping`}></div>
              <StepIcon className={`w-14 h-14 ${steps[currentStep].textColor}`} />
           </div>

           <h3 key={`t-${currentStep}`} className="text-2xl font-black text-gray-900 dark:text-white mb-4 leading-tight animate-in slide-in-from-bottom-4 duration-500 fade-in">
             {steps[currentStep].title}
           </h3>
           <p key={`d-${currentStep}`} className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed animate-in slide-in-from-bottom-2 duration-700 fade-in">
             {steps[currentStep].description}
           </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex gap-3">
          {/* Back Button - Only shows if not first step */}
          {currentStep > 0 && (
            <button 
              onClick={handleBack}
              className="px-5 py-4 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-bold shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors active:scale-95"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}

          <button 
            onClick={handleNext}
            className={`flex-1 py-4 rounded-2xl text-white font-bold text-lg shadow-xl shadow-gray-200 dark:shadow-none flex items-center justify-center gap-2 transition-all active:scale-95 ${steps[currentStep].color} hover:brightness-110`}
          >
            {currentStep === steps.length - 1 ? (
              // Texto diferente se for Onboarding (Funil) ou Ajuda
              mode === 'onboarding' ? (
                 <>Ver Planos <ChevronRight className="w-6 h-6" /></>
              ) : (
                 <>Começar <Check className="w-6 h-6" /></>
              )
            ) : (
              <>Próximo <ArrowRight className="w-6 h-6" /></>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
