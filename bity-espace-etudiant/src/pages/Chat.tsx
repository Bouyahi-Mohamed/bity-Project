import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Home, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getUser } from '@/src/lib/api';
import { cn } from '@/src/lib/utils';

// ---------------------------------------------------------------------------
// TODO: All data here is MOCK. In the future:
//   - conversations  → GET /api/messages/conversations
//   - messages       → GET /api/messages/:conversationId
//   - send message   → POST /api/messages
// ---------------------------------------------------------------------------

interface Message {
  id: string;
  senderId: string;
  text: string;
  time: string;
  read: boolean;
}

interface Conversation {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  propertyTitle: string;
  propertyId: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: Message[];
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    ownerId: '6a1556a964f47245a2adcad0',
    ownerName: 'Nourdine Ben Salem',
    ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
    propertyTitle: 'S+3 Colocation Féminine El Menzah 5',
    propertyId: '6a842c331127f2b75aa49b79',
    lastMessage: 'Bonjour, la chambre est toujours disponible !',
    lastTime: '10:32',
    unread: 2,
    messages: [
      { id: 'm1', senderId: 'me', text: 'Bonjour, je suis intéressée par la chambre disponible dans votre colocation.', time: '10:15', read: true },
      { id: 'm2', senderId: 'owner-1', text: 'Bonjour, la chambre est toujours disponible !', time: '10:32', read: false },
      { id: 'm3', senderId: 'owner-1', text: 'Pouvez-vous me préciser votre université et votre année d\'étude ?', time: '10:33', read: false },
    ],
  },
  {
    id: 'conv-2',
    ownerId: 'owner-2',
    ownerName: 'Karim Mansour',
    ownerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100',
    propertyTitle: 'Studio meublé Lac 2 — 55m²',
    propertyId: 'property-2',
    lastMessage: 'Merci pour votre intérêt.',
    lastTime: 'Hier',
    unread: 0,
    messages: [
      { id: 'm4', senderId: 'me', text: 'Bonjour, est-ce que le studio est encore disponible ?', time: 'Hier 18:00', read: true },
      { id: 'm5', senderId: 'owner-2', text: 'Merci pour votre intérêt.', time: 'Hier 19:00', read: true },
      { id: 'm6', senderId: 'owner-2', text: 'Le studio est disponible à partir du 1er septembre.', time: 'Hier 19:01', read: true },
    ],
  },
];

export default function ChatPage() {
  const { ownerId, propertyId } = useParams<{ ownerId?: string; propertyId?: string }>();
  const navigate = useNavigate();
  const user = getUser();
  const [conversations, setConversations] = React.useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = React.useState<string | null>(null);
  const [input, setInput] = React.useState('');
  const [search, setSearch] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const isMobile = window.innerWidth < 768;

  // If coming from a property page, auto-select or create the conversation
  React.useEffect(() => {
    if (ownerId && propertyId) {
      const existing = conversations.find(c => c.ownerId === ownerId || c.propertyId === propertyId);
      if (existing) {
        setActiveConvId(existing.id);
        // Mark as read & update with exact IDs from URL
        setConversations(prev => prev.map(c =>
          c.id === existing.id ? { ...c, ownerId: ownerId || c.ownerId, propertyId: propertyId || c.propertyId, unread: 0, messages: c.messages.map(m => ({ ...m, read: true })) } : c
        ));
      } else {
        // TODO: create a real conversation via POST /api/messages
        // For now, open a stub conversation from the first mock
        setActiveConvId(conversations[0].id);
      }
    } else if (conversations.length > 0 && !isMobile) {
      setActiveConvId(conversations[0].id);
    }
  }, [ownerId, propertyId]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConvId, conversations]);

  const activeConv = conversations.find(c => c.id === activeConvId) ?? null;

  const handleSend = () => {
    if (!input.trim() || !activeConvId) return;
    const newMsg: Message = {
      id: `m-${Date.now()}`,
      senderId: 'me',
      text: input.trim(),
      time: new Date().toLocaleTimeString('fr-TN', { hour: '2-digit', minute: '2-digit' }),
      read: true,
    };
    setConversations(prev => prev.map(c =>
      c.id === activeConvId
        ? { ...c, messages: [...c.messages, newMsg], lastMessage: newMsg.text, lastTime: newMsg.time }
        : c
    ));
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const filtered = conversations.filter(c =>
    c.ownerName.toLowerCase().includes(search.toLowerCase()) ||
    c.propertyTitle.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

  const avatarUrl = user?.avatar
    ? (user.avatar.startsWith('http') ? user.avatar : `http://localhost:5000${user.avatar}`)
    : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100';

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden bg-background">
      {/* ── Sidebar ── */}
      <div className={cn(
        'flex-shrink-0 w-full md:w-80 border-r border-outline-variant/20 bg-surface-container-lowest flex flex-col',
        activeConvId && isMobile && 'hidden'
      )}>
        {/* Sidebar header */}
        <div className="p-5 border-b border-outline-variant/15">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-display font-bold text-xl text-primary flex items-center gap-2">
              Messages
              {totalUnread > 0 && (
                <span className="bg-secondary text-on-secondary text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {totalUnread}
                </span>
              )}
            </h1>
          </div>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
            <input
              type="text"
              placeholder="Rechercher une conversation..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-surface-container pl-9 pr-4 py-2.5 rounded-xl text-sm text-primary placeholder:text-outline font-medium border border-outline-variant/20 focus:outline-none focus:border-secondary/50 transition-colors"
            />
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto divide-y divide-outline-variant/10">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-on-surface-variant text-sm font-medium">Aucune conversation</div>
          ) : (
            filtered.map(conv => (
              <button
                key={conv.id}
                onClick={() => {
                  setActiveConvId(conv.id);
                  setConversations(prev => prev.map(c =>
                    c.id === conv.id ? { ...c, unread: 0, messages: c.messages.map(m => ({ ...m, read: true })) } : c
                  ));
                }}
                className={cn(
                  'w-full text-left px-5 py-4 hover:bg-surface-container transition-colors flex items-start gap-3',
                  activeConvId === conv.id && 'bg-surface-container border-l-2 border-secondary'
                )}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <img src={conv.ownerAvatar} alt={conv.ownerName} className="w-11 h-11 rounded-full object-cover" />
                  {conv.unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-secondary rounded-full border-2 border-surface-container-lowest text-[9px] text-on-secondary font-bold flex items-center justify-center">
                      {conv.unread}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className={cn('text-sm font-bold truncate', conv.unread > 0 ? 'text-primary' : 'text-on-surface-variant')}>
                      {conv.ownerName}
                    </span>
                    <span className="text-[10px] text-outline font-medium flex-shrink-0">{conv.lastTime}</span>
                  </div>
                  <p className="text-xs text-outline font-medium truncate flex items-center gap-1">
                    <Home className="w-3 h-3 flex-shrink-0" />
                    {conv.propertyTitle}
                  </p>
                  <p className={cn('text-xs truncate mt-0.5', conv.unread > 0 ? 'text-primary font-bold' : 'text-outline font-medium')}>
                    {conv.lastMessage}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* ── Message Thread ── */}
      <div className={cn(
        'flex-1 flex flex-col overflow-hidden',
        !activeConvId && isMobile && 'hidden'
      )}>
        {activeConv ? (
          <>
            {/* Thread header */}
            <div className="flex-shrink-0 px-6 py-4 border-b border-outline-variant/15 bg-surface-container-lowest flex items-center gap-4">
              {/* Mobile back button */}
              <button
                onClick={() => setActiveConvId(null)}
                className="md:hidden p-1.5 rounded-full hover:bg-surface-container transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-secondary" />
              </button>

              {/* Owner avatar with link to profile */}
              <button
                onClick={() => navigate(`/owner/${activeConv.ownerId}`)}
                className="cursor-pointer active:scale-95 transition-transform flex-shrink-0"
                title={`Voir le profil de ${activeConv.ownerName}`}
              >
                <img 
                  src={activeConv.ownerAvatar} 
                  alt={activeConv.ownerName} 
                  className="w-10 h-10 rounded-full object-cover shadow-sm hover:ring-2 hover:ring-secondary/50 transition-all" 
                />
              </button>

              <div className="flex-1 min-w-0">
                <button
                  onClick={() => navigate(`/owner/${activeConv.ownerId}`)}
                  className="font-bold text-sm text-primary truncate hover:text-secondary hover:underline transition-colors block text-left"
                >
                  {activeConv.ownerName}
                </button>
                <button
                  onClick={() => navigate(`/property/${activeConv.propertyId}`)}
                  className="text-xs text-secondary hover:underline font-medium truncate flex items-center gap-1"
                >
                  <Home className="w-3 h-3" />
                  {activeConv.propertyTitle}
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
              <AnimatePresence initial={false}>
                {activeConv.messages.map(msg => {
                  const isMe = msg.senderId === 'me';
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18 }}
                      className={cn('flex items-end gap-2', isMe ? 'justify-end' : 'justify-start')}
                    >
                      {!isMe && (
                        <button
                          onClick={() => navigate(`/owner/${activeConv.ownerId}`)}
                          className="cursor-pointer active:scale-95 transition-transform flex-shrink-0"
                          title={`Voir le profil de ${activeConv.ownerName}`}
                        >
                          <img 
                            src={activeConv.ownerAvatar} 
                            alt="" 
                            className="w-7 h-7 rounded-full object-cover mb-1 hover:ring-2 hover:ring-secondary/40 transition-all" 
                          />
                        </button>
                      )}
                      <div className={cn(
                        'max-w-[70%] px-4 py-2.5 rounded-2xl text-sm font-medium shadow-sm',
                        isMe
                          ? 'bg-secondary text-on-secondary rounded-br-md'
                          : 'bg-surface-container-lowest border border-outline-variant/20 text-primary rounded-bl-md'
                      )}>
                        <p className="leading-relaxed">{msg.text}</p>
                        <p className={cn('text-[10px] mt-1 font-normal', isMe ? 'text-on-secondary/70 text-right' : 'text-outline text-right')}>
                          {msg.time}
                        </p>
                      </div>
                      {isMe && (
                        <button
                          onClick={() => navigate('/profile')}
                          className="cursor-pointer active:scale-95 transition-transform flex-shrink-0"
                          title="Mon profil"
                        >
                          <img 
                            src={avatarUrl} 
                            alt="Moi" 
                            className="w-7 h-7 rounded-full object-cover mb-1 hover:ring-2 hover:ring-secondary/40 transition-all" 
                          />
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex-shrink-0 px-6 py-4 border-t border-outline-variant/15 bg-surface-container-lowest">
              <div className="flex items-end gap-3">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Écrire un message..."
                  rows={1}
                  className="flex-1 resize-none bg-surface-container border border-outline-variant/20 rounded-xl px-4 py-3 text-sm text-primary placeholder:text-outline font-medium focus:outline-none focus:border-secondary/50 transition-colors max-h-32 overflow-y-auto"
                  style={{ minHeight: '46px' }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="flex-shrink-0 w-11 h-11 bg-secondary text-on-secondary rounded-xl flex items-center justify-center shadow hover:bg-secondary/90 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-outline font-medium mt-2 text-center">Appuyez sur Entrée pour envoyer</p>
            </div>
          </>
        ) : (
          // Empty state (desktop)
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 text-on-surface-variant p-12">
            <div className="w-16 h-16 bg-surface-container rounded-2xl flex items-center justify-center">
              <Send className="w-7 h-7 text-secondary" />
            </div>
            <div>
              <p className="font-bold text-primary text-lg">Vos messages</p>
              <p className="text-sm font-medium mt-1">Sélectionnez une conversation pour commencer à discuter</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
