import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import ChatService from '../../services/chatService';
import { getChatSocket } from '../../services/chatSocket';
import {
  Chat as ChatIcon,
  Send as SendIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const previousMessagesLengthRef = useRef(0);
  const isUserScrollingRef = useRef(false);

  useEffect(() => {
    // Tự động tạo user trong chat system nếu chưa có
    const initAdminUser = async () => {
      const userId = localStorage.getItem('storeId');
      const username = localStorage.getItem("storeName") || "Store";

      if (!userId) {
        console.error('Cannot get userId from token');
        toast.error('Không thể xác thực. Vui lòng đăng nhập lại.');
        return;
      }

      // User đã được tạo trong chat system khi đăng ký
      fetchConversations();
    };

    initAdminUser();
  }, []);

  // Socket.io client cho trang chat của seller
  useEffect(() => {
    const token = localStorage.getItem('sellerToken');
    console.log(token);
    if (!token) return;

    const s = getChatSocket();
    if (!s) return;

    setSocket(s);

    const handleNewConversation = (conversation) => {
      if (!conversation) return;
      setConversations((prev) => {
        const id = conversation._id || conversation.id;
        const exists = prev.some((c) => (c._id || c.id) === id);

        if (exists) {
          return prev.map((c) =>
            (c._id || c.id) === id ? { ...c, ...conversation } : c
          );
        }

        return [conversation, ...prev];
      });
    };

    const handleNewMessage = (message) => {
      if (!message || !message.conversation_id) return;

      // Nếu đang mở đúng conversation thì append tin nhắn mới
      setMessages((prev) => {
        if (!selectedConversation) return prev;
        const selectedId =
          selectedConversation._id || selectedConversation.id;
        if (String(message.conversation_id) !== String(selectedId)) {
          return prev;
        }

        const exists = prev.some(
          (m) => (m._id || m.id) === (message._id || message.id)
        );
        return exists ? prev : [...prev, message];
      });

      // Cập nhật last_message + updatedAt trong danh sách conversation
      setConversations((prev) =>
        prev.map((c) => {
          const convId = String(message.conversation_id);
          const currentId = String(c._id || c.id);
          if (convId !== currentId) return c;
          return {
            ...c,
            last_message: message,
            updatedAt:
              message.sent_at || message.createdAt || new Date().toISOString(),
          };
        })
      );
    };

    s.on('new_conversation', handleNewConversation);
    s.on('new_message', handleNewMessage);

    return () => {
      s.off('new_conversation', handleNewConversation);
      s.off('new_message', handleNewMessage);
      setSocket(null);
    };
  }, [selectedConversation]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id || selectedConversation.id);
      // Auto refresh messages every 3 seconds
      const interval = setInterval(() => {
        fetchMessages(selectedConversation._id || selectedConversation.id);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedConversation]);

  useEffect(() => {
    if (messages.length > previousMessagesLengthRef.current && !isUserScrollingRef.current) {
      scrollToBottom();
    }
    previousMessagesLengthRef.current = messages.length;
  }, [messages]);

  // Theo dõi khi user scroll
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      isUserScrollingRef.current = !isAtBottom;
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [selectedConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const data = await ChatService.getAllConversations();
      setConversations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể tải danh sách cuộc trò chuyện";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const data = await ChatService.getMessages(conversationId);
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setMessages([]);
    isUserScrollingRef.current = false;
    previousMessagesLengthRef.current = 0;
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending || !selectedConversation) return;

    setSending(true);
    try {
      const conversationId = selectedConversation._id || selectedConversation.id;
      await ChatService.sendMessage(conversationId, newMessage.trim());
      setNewMessage('');
      isUserScrollingRef.current = false;
      setTimeout(() => fetchMessages(conversationId), 500);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Không thể gửi tin nhắn');
    } finally {
      setSending(false);
    }
  };

  const handleDeleteConversation = async (conversationId, e) => {
    e.stopPropagation();
    if (!window.confirm('Bạn có chắc chắn muốn xóa cuộc trò chuyện này?')) {
      return;
    }

    try {
      await ChatService.deleteConversation(conversationId);
      // Refresh conversations
      fetchConversations();
      // Clear selected if deleted
      if (selectedConversation && (selectedConversation._id === conversationId || selectedConversation.id === conversationId)) {
        setSelectedConversation(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast.error('Không thể xóa cuộc trò chuyện');
    }
  };

  const handleChatWithSystem = async () => {
    try {
      const systemUserId = 'ADMIN1766313158298';
      const conversation = await ChatService.createDirectConversation(
        systemUserId
      );
      if (!conversation) return;

      setSelectedConversation(conversation);
      setMessages([]);

      const id = conversation._id || conversation.id;
      if (id) {
        await fetchMessages(id);
      }
    } catch (error) {
      console.error('Error creating system conversation:', error);
      toast.error('Không thể mở cuộc trò chuyện với hệ thống');
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getConversationTitle = (conversation) => {
    const currentUserId = localStorage.getItem("storeId");

    if (!conversation?.participants?.length) {
      return "Cuộc trò chuyện";
    }

    const otherParticipant = conversation.participants.find(
      (p) => p.user_id !== currentUserId
    );

    if (!otherParticipant) {
      return "Cuộc trò chuyện";
    }

    if (otherParticipant.role === "ADMIN") {
      return "Hệ thống";
    }

    return otherParticipant.username || "Người dùng";
  };

  const getOtherParticipantName = (conversation) => {
    const currentUserId = localStorage.getItem("storeId");

    if (!conversation?.participants?.length) {
      return "Cuộc trò chuyện";
    }

    const otherParticipant = conversation.participants.find(
      (p) => p.user_id !== currentUserId
    );

    if (!otherParticipant) {
      return "Cuộc trò chuyện";
    }

    if (otherParticipant.role === "ADMIN") {
      return "Hệ thống";
    }

    return otherParticipant.username || "Người dùng";
  };

  const getLastMessagePreview = (conversation) => {
    if (conversation.last_message) {
      if (typeof conversation.last_message === 'object' && conversation.last_message.content) {
        const content = conversation.last_message.content;
        return content.length > 50 ? content.substring(0, 50) + '...' : content;
      }
    }
    return 'Chưa có tin nhắn';
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Danh sách conversations */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-800">Cuộc trò chuyện</h2>
            <button
              onClick={fetchConversations}
              className="p-2 hover:bg-gray-100 rounded transition"
              title="Làm mới"
            >
              <RefreshIcon style={{ fontSize: 20 }} />
            </button>
          </div>

          {/* Nút chat với hệ thống */}
          <div className="p-3 border-b border-gray-100 flex-shrink-0">
            <button
              onClick={handleChatWithSystem}
              className="w-full text-sm px-3 py-2 rounded-lg bg-[#116AD1] text-white hover:bg-[#0d5ba8] transition"
            >
              Nhắn với hệ thống
            </button>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Đang tải...</div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">Chưa có cuộc trò chuyện nào</div>
            ) : (
              conversations.map((conv) => {
                const isSelected = selectedConversation && 
                  (selectedConversation._id === conv._id || selectedConversation.id === conv.id);

                return (
                  <div
                    key={conv._id || conv.id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${
                      isSelected ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <ChatIcon style={{ fontSize: 20, color: '#116AD1' }} />
                          <h3 className="font-semibold text-gray-800 truncate">
                            {getConversationTitle(conv)}
                          </h3>
                          {conv.type === 'group' && (
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                              Nhóm
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1 truncate">
                          {getLastMessagePreview(conv)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTime(conv.updatedAt || conv.updated_at)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteConversation(conv._id || conv.id, e)}
                        className="p-1 hover:bg-red-100 rounded text-red-600 transition ml-2"
                        title="Xóa cuộc trò chuyện"
                      >
                        <DeleteIcon style={{ fontSize: 18 }} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Main Content - Messages */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedConversation ? (
            <>
              {/* Header - Cố định */}
              <div className="p-4 border-b border-gray-200 bg-[#116AD1] text-white flex-shrink-0">
                <h2 className="text-lg font-semibold">
                  {getConversationTitle(selectedConversation)}
                </h2>
                <p className="text-sm opacity-90">
                  {selectedConversation.type === 'group' 
                    ? `${selectedConversation.participants?.length || 0} thành viên`
                    : getOtherParticipantName(selectedConversation)}
                </p>
              </div>

              {/* Messages - Có scroll riêng */}
              <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
              >
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    Chưa có tin nhắn nào
                  </div>
                ) : (
                  messages.map((message) => {
                    const currentUserId = localStorage.getItem("storeId");

                    const sender = message.sender;
                    const senderUserId = sender?.user_id;
                    const senderName = sender?.username;
                    const senderRole = sender?.role;

                    const isMe = senderUserId?.endsWith(currentUserId);
                    const isAdmin = senderRole === "ADMIN";

                    return (
                      <div
                        key={message._id}
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            isMe
                              ? "bg-[#116AD1] text-white"
                              : isAdmin
                              ? "bg-gray-200 text-gray-900"
                              : "bg-white text-gray-800 border border-gray-200"
                          }`}
                        >
                          <div className="text-xs font-semibold mb-1 opacity-80">
                            {isMe ? "Bạn" : senderName}
                          </div>

                          <div className="text-sm">{message.content}</div>

                          <div className="text-xs mt-1 opacity-70">
                            {formatTime(message.sent_at || message.createdAt)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input - Cố định */}
              <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
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
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <ChatIcon style={{ fontSize: 64, color: '#ccc', marginBottom: 16 }} />
                <p>Chọn một cuộc trò chuyện để xem tin nhắn</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
