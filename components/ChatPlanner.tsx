'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  ChevronDown,
} from 'lucide-react';
import { EventPlan } from '@/lib/schemas';

interface ChatPlannerProps {
  plan: EventPlan;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function ChatPlanner({ plan }: ChatPlannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm your dedicated EventCraft AI assistant for "${plan.intake.eventTitle}". Ask me anything about tailoring your budget, scheduling vendors, or negotiating quotes!`,
    },
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const completedCount = plan.timeline.tasks.filter((t) => t.completed).length;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const messageIdRef = useRef(1);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isStreaming) return;

    messageIdRef.current += 1;
    const userMsgId = `user-${messageIdRef.current}`;
    const userMessage: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsStreaming(true);

    messageIdRef.current += 1;
    const assistantMsgId = `assistant-${messageIdRef.current}`;
    setMessages((prev) => [
      ...prev,
      { id: assistantMsgId, role: 'assistant', content: '' },
    ]);

    try {
      const response = await fetch('/api/plan/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          planContext: {
            eventType: plan.intake.eventType,
            eventTitle: plan.intake.eventTitle,
            totalBudget: plan.budget.totalBudget,
            currency: plan.budget.currency,
            guestCount: plan.intake.guestCount,
            location: plan.intake.location,
            themeVibe: plan.intake.themeVibe,
            completedTasksCount: completedCount,
            totalTasksCount: plan.timeline.tasks.length,
          },
          history: messages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to get streaming response');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        if (chunk) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId ? { ...msg, content: msg.content + chunk } : msg
            )
          );
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                content:
                  'I apologize, but I ran into a connection issue. Please try asking again in a moment.',
              }
            : msg
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const sampleQuestions = [
    'How can I shave 10% off catering?',
    'What should I confirm 2 weeks before?',
    'Any DIY decor suggestions for this theme?',
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50 print:hidden">
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-xl hover:shadow-2xl hover:scale-105 transition-all focus:outline-none focus:ring-4 focus:ring-amber-300 cursor-pointer"
          aria-label="Open Ask the Planner chat assistant"
        >
          <Sparkles className="w-5 h-5 text-stone-950" aria-hidden="true" />
          <span>Ask the Planner</span>
          <span className="w-2.5 h-2.5 rounded-full bg-stone-900 animate-pulse" />
        </button>
      )}

      {isOpen && (
        <div
          role="dialog"
          aria-labelledby="chat-planner-title"
          aria-modal="false"
          className="w-[90vw] sm:w-[400px] h-[520px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Header */}
          <div className="bg-stone-900 text-stone-100 p-3.5 px-4 flex items-center justify-between border-b border-stone-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <h3 id="chat-planner-title" className="text-sm font-bold text-white">
                  Ask the Planner
                </h3>
                <p className="text-[11px] text-stone-400">
                  Grounded in your {plan.intake.eventType} plan
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
              aria-label="Close chat window"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Messages scroll area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-stone-50/50 text-xs sm:text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" aria-hidden="true" />
                  </div>
                )}

                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-amber-500 text-stone-950 font-medium rounded-tr-xs'
                      : 'bg-white border border-stone-200 text-stone-800 shadow-xs rounded-tl-xs whitespace-pre-wrap'
                  }`}
                >
                  {msg.content || (
                    <span className="flex items-center gap-1.5 text-stone-400 italic">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                      Thinking...
                    </span>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-stone-300 text-stone-700 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" aria-hidden="true" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts */}
          <div className="p-2 bg-stone-100/70 border-t border-stone-200 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <span className="text-stone-500 font-semibold px-1 shrink-0">Try:</span>
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(q)}
                disabled={isStreaming}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white hover:bg-amber-50 border border-stone-200 text-stone-700 transition-colors focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
          >
            <label htmlFor="chat-input-field" className="sr-only">
              Ask your event planner a question
            </label>
            <input
              id="chat-input-field"
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about budget, timeline, vendors..."
              disabled={isStreaming}
              className="flex-1 px-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-900 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isStreaming}
              className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
              aria-label="Send question"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
