// Chat.jsx - Chat en jeu
import { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../lib/store';

export default function Chat({ collapsed = false, onToggle }) {
  const [msg, setMsg] = useState('');
  const { chatMessages, sendChat, username } = useGameStore();
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!msg.trim()) return;
    sendChat(msg);
    setMsg('');
  };

  if (collapsed) {
    return (
      <button onClick={onToggle} className="panel p-2 rounded-xl flex items-center gap-2 text-xs font-body text-ancient-sand hover:text-gold-400 transition-colors">
        💬 Chat ({chatMessages.length})
      </button>
    );
  }

  return (
    <div className="panel flex flex-col" style={{ height: 200 }}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-gold-800/30">
        <span className="text-xs font-display text-gold-400 tracking-wider">💬 CHAT</span>
        {onToggle && (
          <button onClick={onToggle} className="text-ancient-stone text-xs hover:text-ancient-sand">✕</button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 custom-scroll">
        {chatMessages.length === 0 ? (
          <p className="text-ancient-stone text-xs font-body text-center py-4">Pas encore de messages...</p>
        ) : (
          chatMessages.map((m, i) => (
            <div key={i} className="text-xs font-body">
              <span className="font-bold" style={{ color: m.username === username ? '#fde047' : '#c8a96e' }}>
                {m.username}
              </span>
              <span className="text-ancient-stone mx-1">{m.time}</span>
              <span style={{ color: '#f5e6c8' }}>{m.message}</span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-2 px-3 py-2 border-t border-gold-800/30">
        <input
          type="text"
          value={msg}
          onChange={e => setMsg(e.target.value)}
          placeholder="Envoyer un message..."
          maxLength={80}
          className="flex-1 bg-black/30 rounded px-2 py-1 text-xs font-body text-parchment placeholder-ancient-stone focus:outline-none focus:ring-1 focus:ring-gold-600/30"
          style={{ color: '#f5e6c8' }}
        />
        <button type="submit" className="btn-gold px-3 py-1 rounded text-xs">→</button>
      </form>
    </div>
  );
}
