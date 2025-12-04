import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { ChatSession, ChatMessage } from '../types';
import { Send, User } from 'lucide-react';

export const Chat: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [msgText, setMsgText] = useState('');

  useEffect(() => {
      if (user) {
          const allChats = storageService.getChats();
          // Filter chats where user is participant
          const myChats = allChats.filter(c => c.participants.includes(user.id));
          setSessions(myChats);
      }
  }, [user]);

  const sendMessage = () => {
      if (!msgText.trim() || !activeSession || !user) return;
      
      const newMessage: ChatMessage = {
          id: Date.now().toString(),
          senderId: user.id,
          text: msgText,
          timestamp: Date.now()
      };
      
      const updatedSession = { 
          ...activeSession, 
          messages: [...activeSession.messages, newMessage],
          lastUpdated: Date.now()
      };
      
      const allChats = storageService.getChats();
      const newChats = allChats.map(c => c.id === activeSession.id ? updatedSession : c);
      
      storageService.saveChats(newChats);
      setSessions(newChats.filter(c => c.participants.includes(user.id)));
      setActiveSession(updatedSession);
      setMsgText('');
  };

  // Mock: Create a chat for testing if none exists
  const startMockChat = () => {
      if(!user) return;
      const mockChat: ChatSession = {
          id: Date.now().toString(),
          participants: [user.id, 'mock_seller_id'],
          messages: [{id: '1', senderId: 'mock_seller_id', text: 'Olá! Posso ajudar?', timestamp: Date.now()}],
          lastUpdated: Date.now()
      };
      storageService.saveChats([...sessions, mockChat]);
      setSessions([...sessions, mockChat]);
  };

  if (!user) return <div>Faça login para ver as mensagens.</div>;

  return (
    <div className="h-[calc(100vh-140px)] md:h-[600px] flex flex-col md:flex-row bg-white rounded-lg shadow border overflow-hidden">
      {/* List */}
      <div className={`w-full md:w-1/3 border-r border-gray-200 flex flex-col ${activeSession ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b bg-gray-50">
              <h2 className="font-bold">Mensagens</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
              {sessions.length === 0 ? (
                   <div className="p-4 text-center text-gray-400">
                       <p>Nenhuma conversa.</p>
                       <button onClick={startMockChat} className="mt-2 text-brand-500 text-sm">Iniciar teste</button>
                   </div>
              ) : (
                  sessions.map(s => (
                      <div 
                        key={s.id} 
                        onClick={() => setActiveSession(s)}
                        className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${activeSession?.id === s.id ? 'bg-blue-50' : ''}`}
                      >
                          <div className="flex items-center gap-3">
                              <div className="bg-gray-200 p-2 rounded-full"><User size={20}/></div>
                              <div className="overflow-hidden">
                                  <p className="font-medium truncate">Chat #{s.id.slice(-4)}</p>
                                  <p className="text-xs text-gray-500 truncate">{s.messages[s.messages.length-1]?.text}</p>
                              </div>
                          </div>
                      </div>
                  ))
              )}
          </div>
      </div>

      {/* Chat Area */}
      <div className={`w-full md:w-2/3 flex flex-col ${!activeSession ? 'hidden md:flex' : 'flex'}`}>
          {activeSession ? (
              <>
                <div className="p-4 border-b flex items-center justify-between">
                    <button className="md:hidden text-sm text-gray-500" onClick={() => setActiveSession(null)}>Voltar</button>
                    <span className="font-bold">Conversa</span>
                    <button className="text-xs text-red-500">Denunciar</button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
                    {activeSession.messages.map(m => {
                        const isMe = m.senderId === user.id;
                        return (
                            <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${isMe ? 'bg-brand-500 text-white rounded-br-none' : 'bg-white text-gray-800 shadow-sm rounded-bl-none'}`}>
                                    {m.text}
                                    <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                                        {new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="p-3 border-t bg-white flex items-center gap-2">
                    <input 
                        type="text" 
                        value={msgText}
                        onChange={e => setMsgText(e.target.value)}
                        placeholder="Digite uma mensagem..."
                        className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-brand-500"
                        onKeyPress={e => e.key === 'Enter' && sendMessage()}
                    />
                    <button onClick={sendMessage} className="p-2 bg-brand-500 text-white rounded-full">
                        <Send size={18} />
                    </button>
                </div>
              </>
          ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50">
                  Selecione uma conversa para começar
              </div>
          )}
      </div>
    </div>
  );
};