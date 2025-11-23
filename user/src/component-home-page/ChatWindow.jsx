import React, { useState, useEffect, useRef, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import chatService from '../services/chatService';
import { Chat as ChatIcon, Close as CloseIcon, Send as SendIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

const ChatWindow = ({ conversationId, otherUser, onClose, isSystemChat = false }) => {
  const { clientToken } = useContext(ShopContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const currentUserId = chatService.getUserIdFromToken();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (conversationId && clientToken) {
      fetchMessages();
      // Poll for new messages every 2 seconds
      const interval = setInterval(fetchMessages, 2000);
      return () => clearInterval(interval);
    }
  }, [conversationId, clientToken]);

  const fetchMessages = async () => {
    if (!conversationId || !clientToken) return;
    
    try {
      const data = await chatService.getMessages(conversationId);
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending || !conversationId) return;

    setSending(true);
    try {
      const message = await chatService.sendMessage(conversationId, newMessage.trim());
      setNewMessage('');
      // Add new message to list immediately
      setMessages(prev => [...prev, message]);
      // Refresh messages to get latest
      setTimeout(fetchMessages, 500);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Không thể gửi tin nhắn. Vui lòng thử lại!');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isMyMessage = (message) => {
    if (!message.sender_id) return false;
    const senderId = typeof message.sender_id === 'object' 
      ? message.sender_id.user_id 
      : message.sender_id;
    return senderId === currentUserId;
  };

  if (!conversationId) return null;

  return (
    <div className="fixed bottom-0 right-0 w-96 h-[600px] bg-white shadow-2xl rounded-t-lg flex flex-col z-50 border border-gray-200">
      {/* Header */}
      <div className="bg-[#116AD1] text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            {isSystemChat ? (
              <ChatIcon className="text-[#116AD1]" style={{ fontSize: 24 }} />
            ) : (
              <img 
                src={otherUser?.image || 'https://i.pravatar.cc/100'} 
                alt={otherUser?.username || 'User'}
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
          </div>
          <div>
            <div className="font-semibold">
              {isSystemChat ? 'Hệ thống' : (otherUser?.username || 'Người dùng')}
            </div>
            <div className="text-xs opacity-90">Đang hoạt động</div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-white/20 rounded-full p-1 transition"
        >
          <CloseIcon style={{ fontSize: 24 }} />
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
      >
        {loading ? (
          <div className="text-center text-gray-500 mt-8">Đang tải...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
          </div>
        ) : (
          messages.map((message) => {
            const isMine = isMyMessage(message);
            return (
              <div
                key={message._id || message.id}
                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-4 py-2 ${
                    isMine
                      ? 'bg-[#116AD1] text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  <div className="text-sm">{message.content}</div>
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.attachments.map((url, idx) => (
                        <img 
                          key={idx} 
                          src={url} 
                          alt={`Attachment ${idx + 1}`}
                          className="max-w-full h-auto rounded"
                        />
                      ))}
                    </div>
                  )}
                  <div
                    className={`text-xs mt-1 ${
                      isMine ? 'text-white/70' : 'text-gray-500'
                    }`}
                  >
                    {formatTime(message.sent_at || message.createdAt)}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#116AD1]"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="bg-[#116AD1] text-white px-4 py-2 rounded-lg hover:bg-[#0d5ba8] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <SendIcon style={{ fontSize: 20 }} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;

