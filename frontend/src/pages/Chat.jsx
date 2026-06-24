import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiSend, FiArrowLeft } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import SEO from '../components/SEO';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { messageAPI, userAPI } from '../services/api';

const Chat = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const { socket, sendMessage, isOnline } = useSocket();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messageAPI.getConversations()
      .then(({ data }) => setConversations(data.conversations))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (userId) {
      userAPI.getUser(userId).then(({ data }) => setActiveUser(data.user));
      messageAPI.getMessages(userId).then(({ data }) => setMessages(data.messages));
    }
  }, [userId]);

  useEffect(() => {
    if (!socket) return;

    const handleReceive = (msg) => {
      if (msg.sender._id === userId || msg.receiver._id === userId) {
        setMessages((prev) => [...prev, msg]);
      }
      messageAPI.getConversations().then(({ data }) => setConversations(data.conversations));
    };

    socket.on('message:receive', handleReceive);
    socket.on('message:sent', handleReceive);
    return () => {
      socket.off('message:receive', handleReceive);
      socket.off('message:sent', handleReceive);
    };
  }, [socket, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !userId) return;
    sendMessage(userId, newMessage.trim());
    setNewMessage('');
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <>
      <SEO title="Messages" />
      <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-6xl">
        {/* Conversations sidebar */}
        <div className="hidden w-80 border-r border-gray-200 dark:border-gray-800 md:block">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="font-bold">Messages</h2>
          </div>
          <div className="overflow-y-auto">
            {conversations.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">No conversations yet</p>
            ) : (
              conversations.map((conv) => (
                <Link
                  key={conv.conversationId}
                  to={`/chat/${conv.otherUser._id}`}
                  className={`flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 ${userId === conv.otherUser._id ? 'bg-primary-50 dark:bg-primary-900/10' : ''}`}
                >
                  <div className="relative">
                    <img src={conv.otherUser.avatar?.url || `https://ui-avatars.com/api/?name=${conv.otherUser.name}`} alt="" className="h-10 w-10 rounded-full" />
                    {isOnline(conv.otherUser._id) && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{conv.otherUser.name}</p>
                    <p className="text-xs text-gray-500 truncate">{conv.lastMessage.content}</p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] text-white">{conv.unreadCount}</span>
                  )}
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex flex-1 flex-col">
          {userId && activeUser ? (
            <>
              <div className="flex items-center gap-3 border-b border-gray-200 p-4 dark:border-gray-800">
                <Link to="/chat" className="md:hidden"><FiArrowLeft /></Link>
                <img src={activeUser.avatar?.url || `https://ui-avatars.com/api/?name=${activeUser.name}`} alt="" className="h-10 w-10 rounded-full" />
                <div>
                  <p className="font-semibold">{activeUser.name}</p>
                  <p className="text-xs text-gray-500">{isOnline(activeUser._id) ? 'Online' : 'Offline'}</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                  const isMine = msg.sender._id === user._id || msg.sender === user._id;
                  return (
                    <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${isMine ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>
                        <p className="text-sm">{msg.content}</p>
                        <p className={`mt-1 text-[10px] ${isMine ? 'text-primary-200' : 'text-gray-400'}`}>
                          {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSend} className="border-t border-gray-200 p-4 dark:border-gray-800">
                <div className="flex gap-2">
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900"
                  />
                  <button type="submit" className="rounded-xl bg-primary-600 p-2.5 text-white hover:bg-primary-700">
                    <FiSend className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <EmptyState title="Select a conversation" description="Choose a conversation from the sidebar or visit a user's profile to start chatting." />
          )}
        </div>
      </div>
    </>
  );
};

export default Chat;
