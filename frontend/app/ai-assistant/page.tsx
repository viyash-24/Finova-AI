'use client';

import { useState, useRef, useEffect } from 'react';
import TopHeader from '@/components/TopHeader';
import { useAuth } from '@clerk/nextjs';
import { apiFetch } from '@/lib/apiFetch';

interface Message {
  sender: 'ai' | 'user';
  text: string;
  isHtml?: boolean;
}

export default function AIAssistantPage() {
  const { getToken } = useAuth();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: "Hello! I'm Finova AI — your personal finance advisor. I have access to your income, expenses, goals, bills, and financial history.\n\nI can help you:\n• 📊 Analyze your spending patterns\n• 💰 Create savings plans\n• 📈 Suggest investment opportunities\n• 🧾 Track bill reminders\n• 🚀 Grow your income\n\nWhat would you like to explore today?"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-resize input textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      if (inputText === '') {
        textareaRef.current.style.height = '44px';
      }
    }
  }, [inputText]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    // Add user message
    const userMsg: Message = { sender: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const res = await apiFetch(getToken, 'http://localhost:8000/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ query: trimmed, context: {} }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, { sender: 'ai', text: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { sender: 'ai', text: "Sorry, I ran into an issue communicating with the AI service." }]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { sender: 'ai', text: "Sorry, I can't connect to the backend agent right now. Make sure the backend server is running." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputText);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50/20 via-slate-50 to-white">
      <TopHeader />
      <div className="flex-1 flex flex-col relative h-[calc(100vh-64px)]">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-8 pb-44">
          <div className="max-w-[800px] mx-auto space-y-6">
            
            {/* Today marker */}
            <div className="flex justify-center">
              <span className="text-[11px] font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">
                Today
              </span>
            </div>

            {/* Message History */}
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 max-w-[85%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm ${
                  m.sender === 'ai' 
                    ? 'bg-gradient-to-br from-sky-500 to-blue-600 text-white' 
                    : 'bg-sky-100 text-sky-700 text-[11px] font-bold'
                }`}>
                  {m.sender === 'ai' ? (
                    <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                  ) : (
                    'AK'
                  )}
                </div>
                <div className={`rounded-2xl p-4 shadow-[0_5px_15px_rgba(59,130,246,0.02)] ${
                  m.sender === 'ai' 
                    ? 'bg-white rounded-tl-none border border-slate-100/80 text-slate-700' 
                    : 'bg-sky-500 rounded-tr-none text-white'
                }`}>
                  {/* Format basic markdown bolding simple replacements */}
                  <p className="text-[14px] leading-relaxed font-medium whitespace-pre-line"
                     dangerouslySetInnerHTML={{
                       __html: m.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                     }}
                  />
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-3 items-center opacity-70 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-sky-500 text-[14px]">auto_awesome</span>
                </div>
                <div className="flex gap-1.5 bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-slate-100/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-slate-50 via-slate-50 to-transparent pt-8 pb-6 px-8">
          <div className="max-w-[800px] mx-auto">
            {/* Suggestion Chips */}
            <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar">
              {[
                { icon: 'monitoring',    label: 'Analyze my spending' },
                { icon: 'savings',       label: 'Create a savings plan' },
                { icon: 'trending_up',   label: 'Investment opportunities' },
                { icon: 'receipt_long',  label: 'Show my upcoming bills' },
                { icon: 'payments',      label: 'How can I grow my income?' },
              ].map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => handleSend(chip.label)}
                  className="flex items-center gap-1.5 bg-white border border-slate-100 hover:border-sky-500 hover:bg-sky-50/20 hover:text-sky-600 transition-all rounded-full px-4 py-2 text-[13px] font-bold text-slate-500 whitespace-nowrap shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-sky-500">{chip.icon}</span>
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Input Box */}
            <div className="bg-white border border-slate-100 shadow-xl rounded-2xl p-2 flex items-end gap-2 focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-500/5 transition-all">
              <button className="p-2 text-slate-400 hover:text-sky-500 transition-colors rounded-xl hover:bg-slate-50 flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]">attach_file</span>
              </button>
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-none resize-none py-2 text-[14px] text-slate-700 placeholder:text-slate-400 max-h-32 focus:outline-none font-medium"
                placeholder="Ask Finova anything about your finances..."
                rows={1}
                style={{ minHeight: '44px' }}
              />
              <div className="flex items-center gap-1.5 flex-shrink-0 mb-0.5 mr-0.5">
                <button className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-sky-500 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">mic</span>
                </button>
                <button
                  onClick={() => handleSend(inputText)}
                  className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition-colors shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
