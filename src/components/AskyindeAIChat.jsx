import React, { useState, useEffect } from 'react';
import { X, Maximize2, Minimize2, Send, MessageSquare, Plus } from 'lucide-react';

import { supabase } from '../services/supabase';

const AskyindeAIChat = ({ onClose, oceanColor, mode, setMode }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I am your flight assistant Askyinde. How can I help you?", isAi: true }
  ]);

  const [currentSessionId, setCurrentSessionId] = useState(null);
  
  // === НОВЫЕ ФУНКЦИИ ДЛЯ ИСТОРИИ ТЕМ ===
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setSessions(data);
    if (error) console.error("Ошибка загрузки тем:", error);
  };

  const loadSession = async (sessionId) => {
    setCurrentSessionId(sessionId);
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (data) {
      const loadedMessages = [
        { id: 1, text: "Hi! I am your flight assistant Askyinde. How can I help you?", isAi: true },
        ...data.map(msg => ({
          id: msg.id,
          text: msg.message_text,
          isAi: msg.is_ai
        }))
      ];
      setMessages(loadedMessages);
    }
  };

  const startNewChat = () => {
    setCurrentSessionId(null);
    setMessages([
      { id: 1, text: "Hi! I am your flight assistant Askyinde. How can I help you?", isAi: true }
    ]);
  };
  // === КОНЕЦ НОВЫХ ФУНКЦИЙ ===


  // Твоя функция отправки (с одной добавленной строчкой)
  const handleSend = async () => {
    console.log("--- Отправка через Edge Function ---");
    if (!input.trim()) return;

    const userText = input;
    const userMessage = { id: Date.now(), text: userText, isAi: false };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setInput('');

    try {
      // ОПРЕДЕЛЯЕМ ИСТОРИЮ: Если сессии еще нет, отправляем [], чтобы облако сгенерировало title!
      const payloadMessages = currentSessionId
        ? updatedMessages
            .filter(m => m.id !== 1)
            .map(m => ({
              role: m.isAi ? 'assistant' : 'user',
              content: m.text
            }))
        : [];

      // 1. Вызов Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('aviation-chat', {
        body: {
          prompt: userText,
          messages: payloadMessages
        }
      });

      if (error) throw error;

      if (data && data.reply) {
        setMessages(prev => [...prev, { id: Date.now(), text: data.reply, isAi: true }]);
      }

      let sessionId = currentSessionId;

      if (!sessionId) {
        const { data: newSession, error: sessionErr } = await supabase
          .from('chat_sessions')
          .insert([{ title: data.title || 'Новый диалог' }])
          .select()
          .single();
        
        if (sessionErr) {
          console.error("ОШИБКА СОЗДАНИЯ СЕССИИ БД:", sessionErr);
        } else if (newSession) {
          sessionId = newSession.id;
          setCurrentSessionId(sessionId);
          
          // ВОТ ТА САМАЯ НОВАЯ СТРОЧКА:
          fetchSessions(); 
        }
      }

      if (sessionId && data.reply) {
        const { error: msgErr } = await supabase.from('chat_messages').insert([
          { session_id: sessionId, message_text: userText, is_ai: false },
          { session_id: sessionId, message_text: data.reply, is_ai: true }
        ]);
        
        if (msgErr) console.error("ОШИБКА СОХРАНЕНИЯ СООБЩЕНИЙ:", msgErr);
      }

    } catch (err) {
      console.error("Критический сбой:", err);
      setMessages(prev => [...prev, { id: Date.now(), text: `Ошибка: ${err.message}`, isAi: true }]);
    }
  };
    
  return (
  <div 
    className={`fixed right-8 bg-white shadow-2xl flex rounded-[24px] overflow-hidden transition-all duration-500 ease-in-out z-50 border border-gray-100 animate-rise-up ${
      mode === 'expanded' ? 'w-[850px] h-[600px] bottom-6' : 'w-[320px] h-[450px] bottom-6'
    }`}
  >
      {/* ЛЕВАЯ ПАНЕЛЬ (История тем) - Видна только в режиме expanded */}
      {mode === 'expanded' && (
        <div className="w-[300px] border-r bg-[#F8F9FA] flex flex-col animate-in slide-in-from-left duration-300 p-4">
          
          {/* Кнопка "Новый чат" теперь работает! */}
          <button 
            onClick={startNewChat}
            className="w-full text-white bg-white border border-gray-100 py-3 px-4 rounded-2xl shadow-sm flex items-center gap-3 text-[14px] font-bold transition-all active:scale-95 hover:bg-gray-50 mb-6"
            style={{ color: oceanColor }}
          >
            <Plus size={18} />
            New chat
          </button>

          {/* Заголовок истории */}
          <div className="flex flex-col gap-2 flex-1 overflow-hidden">
            <span className="text-[14px] text-[#0A4A5E] font-bold uppercase tracking-wider pl-[5px] mb-2">
              Search History
            </span>
            
            {/* СПИСОК ТЕМ ИЗ БАЗЫ ДАННЫХ */}
            <div className="flex flex-col gap-2 overflow-y-auto pr-1">
              {sessions.map(session => (
                <div 
                  key={session.id}
                  onClick={() => loadSession(session.id)}
                  className={`p-4 rounded-2xl shadow-sm cursor-pointer transition-all border text-[14px] font-medium text-[#0A4A5E] ${
                    currentSessionId === session.id 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'bg-white border-transparent hover:border-blue-100 hover:bg-blue-50'
                  }`}
                >
                  {session.title}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ПРАВАЯ ПАНЕЛЬ (Само окно чата) */}
      <div className="flex-1 flex flex-col h-full bg-white">
        {/* Шапка чата */}
        <div className="p-4 text-white flex justify-between items-center shadow-md" style={{ backgroundColor: oceanColor }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="font-bold text-[14px]">Askyinde AI Assistant</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMode(mode === 'compact' ? 'expanded' : 'compact')}
              className="hover:scale-110 transition-transform opacity-80 hover:opacity-100"
            >
              {mode === 'compact' ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
            </button>
            <button onClick={onClose} className="hover:scale-110 transition-transform text-[18px]">✕</button>
          </div>
        </div>

        {/* Окно сообщений */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isAi ? 'justify-start' : 'justify-end'}`}>
              <div 
                className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.isAi ? 'bg-white text-gray-800 rounded-tl-none shadow-sm' : 'text-white rounded-tr-none shadow-md'
                }`}
                style={!msg.isAi ? { backgroundColor: oceanColor } : {}}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Поле ввода */}
        <div className="p-3 border-t bg-white flex gap-2 items-center">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me something..." 
            className="flex-1 outline-none text-[13px] p-3 bg-gray-100 rounded-xl border border-transparent focus:border-blue-200 transition-all"
          />
          <button 
            onClick={handleSend}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-transform active:scale-90 shadow-lg"
            style={{ backgroundColor: oceanColor }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AskyindeAIChat;