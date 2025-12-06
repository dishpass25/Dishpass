
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Loader2 } from 'lucide-react';
import { getAIResponse } from '../services/ai';
import { useApp } from '../context';

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'ai';
  text: string;
}

export const AIChat: React.FC<AIChatProps> = ({ isOpen, onClose }) => {
  const { user } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: `Hi ${user.name.split(' ')[0]}! I'm your DISHpass assistant. Hungry? Ask me anything!` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const context = `User has ${user.credits} credits. Is Staff: ${user.isRestaurantStaff}.`;
    const aiText = await getAIResponse(userMsg, context);

    setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md h-[650px] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in">
        
        {/* Header */}
        <div className="bg-brand-500 p-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-4">
            <Bot className="w-10 h-10" />
            <h3 className="font-bold text-2xl">DISHpass AI</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-brand-600 rounded-full">
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 dark:bg-gray-800">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-5 rounded-2xl text-base leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-brand-500 text-white rounded-br-none' 
                  : 'bg-white dark:bg-gray-700 dark:text-gray-100 rounded-bl-none shadow-sm'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-700 p-5 rounded-2xl rounded-bl-none shadow-sm">
                <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-5 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about food..."
            className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-full px-6 py-4 focus:outline-none focus:ring-2 focus:ring-brand-500 text-base"
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="p-4 bg-brand-500 text-white rounded-full hover:bg-brand-600 disabled:opacity-50"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
