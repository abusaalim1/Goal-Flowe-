import React, { useState } from 'react';
import { MessageSquare, X, Sparkles, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { suggestNextTask, generateMotivation, getProductivityInsights } from '../../services/aiService';

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: "Hi! I'm your offline AI assistant. How can I help you with your goals today?" }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { goals, settings } = useStore();

  if (!settings.aiEnabled) return null;

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsProcessing(true);

    // Simple offline AI logic based on user input
    setTimeout(async () => {
      let aiResponse = "I'm not sure how to help with that. Try asking for 'insights', 'motivation', or 'next task'.";
      
      const lowerInput = userMsg.toLowerCase();
      
      if (lowerInput.includes('insight') || lowerInput.includes('progress')) {
        const insights = getProductivityInsights(goals);
        aiResponse = insights.length > 0 ? insights.join('\n\n') : "You don't have enough data for insights yet. Keep tracking your goals!";
      } else if (lowerInput.includes('motivat') || lowerInput.includes('stuck')) {
        const activeGoals = goals.filter(g => g.status === 'active');
        if (activeGoals.length > 0) {
          aiResponse = await generateMotivation(activeGoals[0]);
        } else {
          aiResponse = "You don't have any active goals right now. Why not create one?";
        }
      } else if (lowerInput.includes('next') || lowerInput.includes('task') || lowerInput.includes('what to do')) {
        const activeGoals = goals.filter(g => g.status === 'active');
        let foundTask = false;
        
        for (const goal of activeGoals) {
          const task = await suggestNextTask(goal);
          if (task) {
            aiResponse = `I suggest you work on: "${task.title}" from your goal "${goal.title}".`;
            foundTask = true;
            break;
          }
        }
        
        if (!foundTask) {
          aiResponse = "You don't have any pending sub-tasks across your active goals. Great job!";
        }
      }
      
      setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] text-white shadow-lg hover:scale-105 transition-transform"
      >
        <Sparkles className="h-6 w-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-2xl border border-[var(--color-border-soft)] bg-white shadow-2xl sm:w-[400px]"
          >
            <div className="flex items-center justify-between bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-600" />
                <h3 className="font-bold text-[var(--color-text-dark)]">GoalFlow AI</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-800">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                      msg.role === 'user'
                        ? 'bg-[var(--color-text-dark)] text-white rounded-br-sm'
                        : 'bg-white border border-[var(--color-border-soft)] text-[var(--color-text-dark)] rounded-bl-sm shadow-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-white border border-[var(--color-border-soft)] rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-[var(--color-border-soft)] bg-white p-3">
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 focus-within:border-[var(--color-secondary)] focus-within:ring-1 focus-within:ring-[var(--color-secondary)]">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask for insights or next tasks..."
                  className="flex-1 bg-transparent text-sm outline-none text-[var(--color-text-dark)]"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isProcessing}
                  className="text-[var(--color-accent)] disabled:opacity-50"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
