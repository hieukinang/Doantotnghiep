import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import ChatWindow from './ChatWindow';
import chatService from '../services/chatService';
import { getChatSocket } from '../services/chatSocket';
import { 
  Chat as ChatIcon, 
  Close as CloseIcon, 
  SupportAgent as SystemIcon,
  Person as PersonIcon,
  AttachFile as AttachIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const ChatBox = () => {
  const { clientToken, clientUsername, sellerToken } = useContext(ShopContext);
  const location = useLocation();
  
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeTab, setActiveTab] = useState('system'); // 'system' hoặc conversation._id
  const [systemConversationId, setSystemConversationId] = useState(null);
  const [loading, setLoading] = useState(false);

  const isSellerPage = location.pathname.startsWith('/seller');
  const currentToken = isSellerPage ? (sellerToken || clientToken) : (clientToken || sellerToken);
  const currentUsername = isSellerPage 
    ? (localStorage.getItem('storeName') || 'Store') 
    : (clientUsername || 'User');
  // Seller dùng storeId, Client dùng userId
  const currentUserId = isSellerPage 
    ? localStorage.getItem('storeId') 
    : localStorage.getItem('userId');

  // Set token khi thay đổi
  useEffect(() => {
    if (currentToken) {
      chatService.setToken(currentToken);
    } else {
      chatService.clearToken();
    }
  }, [currentToken]);

  // Load conversations khi mở chat
  useEffect(() => {
    if (isOpen && currentToken) {
      fetchConversations();
      createSystemConversation();
    }
  }, [isOpen, currentToken]);

  // Auto refresh conversations mỗi 10s khi đang mở
  useEffect(() => {
    if (!isOpen || !currentToken) return;
    
    const interval = setInterval(fetchConversations, 10000);
    return () => clearInterval(interval);
  }, [isOpen, currentToken]);

  const fetchConversations = async () => {
    try {
      const data = await chatService.getAllConversations();
      const convList = Array.isArray(data) ? data : [];
      
      // Lọc bỏ conversation với SYSTEM (vì đã có tab riêng)
      const systemUserId = "ADMIN1766313158298";
      const filtered = convList.filter(conv => {
        const participants = conv.participants || [];
        // Kiểm tra xem conversation này có phải là với SYSTEM không
        const isSystemConv = participants.some(p => p.user_id === systemUserId);
        return !isSystemConv;
      });
      
      setConversations(filtered);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const createSystemConversation = async () => {
    if (systemConversationId) return;
    
    setLoading(true);
    try {
      const systemUserId = "ADMIN1765353220494";
      const conversation = await chatService.createDirectConversation(systemUserId);
      setSystemConversationId(conversation._id || conversation.id);
    } catch (error) {
      console.error('Error creating system conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (!currentToken) {
      toast.warning('Vui lòng đăng nhập để sử dụng tính năng chat!');
      return;
    }
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleCloseTab = (e, convId) => {
    e.stopPropagation();
    // Nếu đang ở tab này, chuyển về tab system
    if (activeTab === convId) {
      setActiveTab('system');
    }
    // Xóa conversation khỏi danh sách hiển thị (không xóa trên server)
    setConversations(prev => prev.filter(c => (c._id || c.id) !== convId));
  };

  // Lấy thông tin người chat cùng (không phải mình)
  const getOtherParticipant = useCallback((conversation) => {
    if (!conversation?.participants) return null;
    return conversation.participants.find(p => p.user_id !== currentUserId);
  }, [currentUserId]);

  // Lấy conversation đang active
  const getActiveConversation = () => {
    if (activeTab === 'system') {
      return {
        id: systemConversationId,
        isSystem: true,
        otherUser: { user_id: 'SYSTEM', username: 'Hệ thống', image: null }
      };
    }
    
    const conv = conversations.find(c => (c._id || c.id) === activeTab);
    if (!conv) return null;
    
    const otherUser = getOtherParticipant(conv);
    return {
      id: conv._id || conv.id,
      isSystem: false,
      otherUser: otherUser || { user_id: '', username: 'Người dùng', image: null }
    };
  };

  const activeConv = getActiveConversation();

  if (!currentToken) return null;

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={handleToggle}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#116AD1] text-white rounded-full shadow-lg hover:bg-[#0d5ba8] transition-all flex items-center justify-center z-40"
        title="Chat"
      >
        <ChatIcon style={{ fontSize: 28 }} />
        {/* Badge hiển thị số conversations */}
        {conversations.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {conversations.length}
          </span>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 w-96 h-[500px] bg-white shadow-2xl rounded-t-lg flex flex-col z-50 border border-gray-200">
          
          {/* HEADER với nút đóng */}
          <div className="bg-[#116AD1] text-white p-3 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChatIcon style={{ fontSize: 24 }} />
              <span className="font-semibold">Tin nhắn</span>
            </div>
            <button 
              onClick={handleClose} 
              className="text-white hover:bg-white/20 rounded-full p-1 transition"
            >
              <CloseIcon style={{ fontSize: 20 }} />
            </button>
          </div>

          {/* TABS */}
          <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
            {/* Tab Hệ thống (luôn cố định) */}
            <button
              onClick={() => setActiveTab('system')}
              className={`flex items-center gap-1 px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                activeTab === 'system'
                  ? 'border-[#116AD1] text-[#116AD1] bg-white'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <SystemIcon style={{ fontSize: 18 }} />
              <span>Hệ thống</span>
            </button>

            {/* Các tab conversation khác */}
            {conversations.map((conv) => {
              const convId = conv._id || conv.id;
              const otherUser = getOtherParticipant(conv);
              const displayName = otherUser?.username || 'Người dùng';
              
              return (
                <button
                  key={convId}
                  onClick={() => setActiveTab(convId)}
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition group relative ${
                    activeTab === convId
                      ? 'border-[#116AD1] text-[#116AD1] bg-white'
                      : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {otherUser?.image ? (
                    <img 
                      src={otherUser.image} 
                      alt={displayName}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  ) : (
                    <PersonIcon style={{ fontSize: 18 }} />
                  )}
                  <span className="max-w-[80px] truncate">{displayName}</span>
                  
                  {/* Nút đóng tab */}
                  <span
                    onClick={(e) => handleCloseTab(e, convId)}
                    className="ml-1 opacity-0 group-hover:opacity-100 hover:bg-gray-300 rounded-full p-0.5 transition"
                  >
                    <CloseIcon style={{ fontSize: 14 }} />
                  </span>
                </button>
              );
            })}
          </div>

          {/* CHAT CONTENT */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {loading ? (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Đang tải...
              </div>
            ) : activeConv ? (
              <ChatWindowInline
                conversationId={activeConv.id}
                otherUser={activeConv.otherUser}
                isSystemChat={activeConv.isSystem}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Chọn một cuộc trò chuyện
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

// Component ChatWindow inline (không có header và close button riêng)
const ChatWindowInline = ({ conversationId, otherUser, isSystemChat = false }) => {
  const { clientToken, sellerToken } = useContext(ShopContext);
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [sending, setSending] = useState(false);
  const messagesEndRef = React.useRef(null);
  const fileInputRef = React.useRef(null);
  
  // Seller dùng storeId, Client dùng userId
  const isSellerPage = location.pathname.startsWith('/seller');
  const currentUserId = isSellerPage 
    ? localStorage.getItem('storeId') 
    : localStorage.getItem('userId');
  const currentToken = isSellerPage ? (sellerToken || clientToken) : (clientToken || sellerToken);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Socket realtime messages
  useEffect(() => {
    if (!currentToken || !conversationId) return;

    const s = getChatSocket();
    if (!s) return;

    const handleNewMessage = (message) => {
      if (!message?.conversation_id) return;
      if (String(message.conversation_id) !== String(conversationId)) return;

      setMessages((prev) => {
        const exists = prev.some((m) => (m._id || m.id) === (message._id || message.id));
        return exists ? prev : [...prev, message];
      });
    };

    s.on('new_message', handleNewMessage);

    return () => {
      s.off('new_message', handleNewMessage);
    };
  }, [currentToken, conversationId]);

  useEffect(() => {
    if (conversationId && currentToken) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [conversationId, currentToken]);

  const fetchMessages = async () => {
    if (!conversationId) return;

    try {
      const data = await chatService.getMessages(conversationId);
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && selectedFiles.length === 0) || sending || !conversationId) return;

    setSending(true);

    try {
      const message = await chatService.sendMessage(
        conversationId,
        newMessage.trim(),
        selectedFiles
      );

      setNewMessage('');
      setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = '';

      setMessages((prev) => [...prev, message]);
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
    let senderId = null;

    if (message.sender_id) {
      senderId =
        typeof message.sender_id === 'object'
          ? message.sender_id.user_id
          : message.sender_id;
    } else if (message.sender?.user_id) {
      senderId = message.sender.user_id;
    }

    return senderId === currentUserId;
  };

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Đang tạo cuộc trò chuyện...
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header nhỏ hiển thị người chat */}
      <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-[#116AD1] flex items-center justify-center">
          {isSystemChat ? (
            <ChatIcon className="text-white" style={{ fontSize: 18 }} />
          ) : otherUser?.image ? (
            <img
              src={otherUser.image}
              alt={otherUser?.username || 'User'}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <PersonIcon className="text-white" style={{ fontSize: 18 }} />
          )}
        </div>
        <div>
          <div className="font-medium text-sm text-gray-800">
            {isSystemChat ? 'Hệ thống' : otherUser?.username || 'Người dùng'}
          </div>
          <div className="text-xs text-green-500">Đang hoạt động</div>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8 text-sm">
            Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
          </div>
        ) : (
          messages.map((message) => {
            const isMine = isMyMessage(message);
            return (
              <div key={message._id || message.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] rounded-lg px-3 py-2 ${
                    isMine ? 'bg-[#116AD1] text-white' : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  <div className="text-sm">{message.content}</div>

                  {message.attachments?.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.attachments.map((url, idx) => (
                        <img key={idx} src={url} alt="" className="max-w-full h-auto rounded" />
                      ))}
                    </div>
                  )}

                  <div className={`text-[10px] mt-1 ${isMine ? 'text-white/70' : 'text-gray-500'}`}>
                    {formatTime(message.sent_at || message.createdAt)}
                  </div>
                </div>
              </div>
            );
          })
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT + FILE */}
      <form onSubmit={sendMessage} className="p-3 border-t border-gray-200 bg-white">
        <div className="flex gap-2 items-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            <AttachIcon />
          </button>

          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
            disabled={sending}
          />

          <button
            type="submit"
            disabled={(!newMessage.trim() && selectedFiles.length === 0) || sending}
            className="bg-[#116AD1] text-white px-3 py-2 rounded-lg hover:bg-[#0d5ba8] disabled:opacity-50"
          >
            <SendIcon style={{ fontSize: 18 }} />
          </button>
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-2 text-xs text-gray-700">
            <b>File đã chọn:</b>
            <ul className="list-disc ml-4">
              {selectedFiles.map((file, idx) => (
                <li key={idx}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
};

export default ChatBox;
