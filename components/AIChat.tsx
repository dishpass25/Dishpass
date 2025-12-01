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
      <div className="bg-white dark:bg-gray-900 w-full max-w-md h-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in">
        
        {/* Header */}
        <div className="bg-brand-500 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6" />
            <h3 className="font-bold">DISHpass AI</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-brand-600 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
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
              <div className="bg-white dark:bg-gray-700 p-3 rounded-2xl rounded-bl-none shadow-sm">
                <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about food..."
            className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="p-2 bg-brand-500 text-white rounded-full hover:bg-brand-600 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};