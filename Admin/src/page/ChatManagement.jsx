import React, { useState, useEffect, useRef } from 'react';
import adminChatService from '../services/chatService';
import { toast } from "react-toastify";
import { getAdminChatSocket } from '../services/chatSocket';
import {
  Chat as ChatIcon,
  Send as SendIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  AttachFile as AttachFileIcon,
} from '@mui/icons-material';

const ChatManagement = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const conversationsContainerRef = useRef(null);
  const prevMessagesLengthRef = useRef(0);
  const isUserScrollingRef = useRef(false);

  useEffect(() => {
    const initAdminUser = async () => {
      const userId = localStorage.getItem('adminId');
      const username = localStorage.getItem('adminUsername') || 'Admin';

      if (!userId) {
        console.error('Cannot get userId from token');
        toast.error("Không thể xác thực. Vui lòng đăng nhập lại.");
        return;
      }

      fetchConversations();
    };

    initAdminUser();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    const s = getAdminChatSocket();
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
      const conversationId = selectedConversation._id || selectedConversation.id;
      prevMessagesLengthRef.current = 0;
      isUserScrollingRef.current = false;
      fetchMessages(conversationId, true);
    }
  }, [selectedConversation]);

  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current && !isUserScrollingRef.current) {
      scrollToBottom();
    }
    prevMessagesLengthRef.current = messages.length;
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
      const data = await adminChatService.getAllConversations();
      setConversations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Không thể tải danh sách cuộc trò chuyện';

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId, isInitialLoad = false) => {
    try {
      const data = await adminChatService.getMessages(conversationId);
      const newMessages = Array.isArray(data) ? data : [];

      if (isInitialLoad) {
        prevMessagesLengthRef.current = newMessages.length;
        setTimeout(() => scrollToBottom(), 100);
      }

      setMessages(newMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setMessages([]);
    setAttachments([]);
    isUserScrollingRef.current = false;
    prevMessagesLengthRef.current = 0;
  };
  
  const handleAttachmentChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(files);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (
      (!newMessage.trim() && attachments.length === 0) || sending || !selectedConversation
    )
      return;

    setSending(true);
    try {
      const conversationId =
        selectedConversation._id || selectedConversation.id;
      await adminChatService.sendMessage(
        conversationId, 
        newMessage.trim(),
        attachments
      );

      setNewMessage("");
      setAttachments([]);
      isUserScrollingRef.current = false;
      setTimeout(() => fetchMessages(conversationId, true), 500); 
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Không thể gửi tin nhắn");
    } finally {
      setSending(false);
    }
  };

  const handleDeleteConversation = async (conversationId, e) => {
    e.stopPropagation();
    if (!window.confirm("Bạn có chắc chắn muốn xóa cuộc trò chuyện này?")) {
      return;
    }

    try {
      await adminChatService.deleteConversation(conversationId);
      fetchConversations();
      if (
        selectedConversation &&
        (selectedConversation._id === conversationId ||
          selectedConversation.id === conversationId)
      ) {
        setSelectedConversation(null);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toast.error("Không thể xóa cuộc trò chuyện");
    }
  };

  // --- format time ---
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getConversationTitle = (conversation) => {
    if (conversation.type === "group") {
      return conversation.name || "Nhóm chat";
    }

    const currentUserId = localStorage.getItem('adminId');
    const otherParticipant = conversation.participants?.find(
      (p) =>
        (typeof p.user_id === "string" ? p.user_id : p.user_id?.user_id) !==
        currentUserId
    );

    if (otherParticipant) {
      const userId =
        typeof otherParticipant.user_id === "string"
          ? otherParticipant.user_id
          : otherParticipant.user_id?.user_id;
      
      const username = otherParticipant.username;

      // Kiểm tra nếu là ADMIN
      if (userId === "ADMIN" || userId?.includes("ADMIN")) {
        return "Hệ thống";
      }
      
      // Hiển thị username hoặc userId
      return username || userId || "Người dùng";
    }

    return "User";
  };

  const getLastMessagePreview = (conversation) => {
    if (conversation.last_message) {
      if (
        typeof conversation.last_message === "object" &&
        conversation.last_message.content
      ) {
        const content = conversation.last_message.content;
        return content.length > 50 ? content.substring(0, 50) + "..." : content;
      }
    }
    return "Chưa có tin nhắn";
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* ============ SIDEBAR - DANH SÁCH CONVERSATIONS ============ */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header - Cố định */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-800">
            Cuộc trò chuyện
          </h2>
          <button
            onClick={fetchConversations}
            className="p-2 hover:bg-gray-100 rounded transition"
            title="Làm mới"
          >
            <RefreshIcon style={{ fontSize: 20 }} />
          </button>
        </div>

        {/* Conversations List - CÓ SCROLL RIÊNG */}
        <div 
          ref={conversationsContainerRef}
          className="flex-1 overflow-y-auto"
          style={{
            maxHeight: 'calc(100vh - 73px)',
          }}
        >
          {loading ? (
            <div className="p-4 text-center text-gray-500">Đang tải...</div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Chưa có cuộc trò chuyện nào
            </div>
          ) : (
            conversations.map((conv) => {
              const isSelected =
                selectedConversation &&
                (selectedConversation._id === conv._id ||
                  selectedConversation.id === conv.id);

              return (
                <div
                  key={conv._id || conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${
                    isSelected
                      ? "bg-blue-50 border-l-4 border-l-blue-600"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <ChatIcon
                          style={{ fontSize: 18, color: "#116AD1" }}
                        />
                        <h3 className="font-semibold text-sm text-gray-800 truncate">
                          {getConversationTitle(conv)}
                        </h3>
                        {conv.type === "group" && (
                          <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">
                            Nhóm
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate ml-5"> 
                        {getLastMessagePreview(conv)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 ml-5">
                        {formatTime(conv.updatedAt || conv.updated_at)}
                      </p>
                    </div>
                    <button
                      onClick={(e) =>
                        handleDeleteConversation(conv._id || conv.id, e)
                      }
                      className="p-1 hover:bg-red-100 rounded text-red-600 transition ml-2"
                      title="Xóa cuộc trò chuyện"
                    >
                      <DeleteIcon style={{ fontSize: 16 }} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ============ MAIN CONTENT - MESSAGES ============ */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedConversation ? (
          <>
            {/* Header - Cố định */}
            <div className="p-4 border-b border-gray-200 bg-[#116AD1] text-white flex-shrink-0">
              <h2 className="text-lg font-semibold">
                {getConversationTitle(selectedConversation)}
              </h2>
              <p className="text-sm opacity-90">
                {selectedConversation.type === "group"
                  ? `${
                      selectedConversation.participants?.length || 0
                    } thành viên`
                  : "Cuộc trò chuyện trực tiếp"}
              </p>
            </div>

            {/* Messages - CÓ SCROLL RIÊNG */}
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
              style={{
                maxHeight: 'calc(100vh - 185px)',
              }}
            >
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  Chưa có tin nhắn nào
                </div>
              ) : (
                messages.map((message) => {
                  let senderId =
                    typeof message.sender_id === "object"
                      ? message.sender_id?.user_id
                      : message.sender_id;

                  if (!senderId && message.sender?.user_id) {
                    senderId = message.sender.user_id;
                  }

                  let senderUsername =
                    typeof message.sender_id === "object"
                      ? message.sender_id?.username
                      : undefined;

                  if (!senderUsername && message.sender?.username) {
                    senderUsername = message.sender.username;
                  }

                  const currentAdminId = localStorage.getItem('adminId');
                  const isAdmin = senderId === currentAdminId;

                  return (
                    <div
                      key={message._id || message.id}
                      className={`flex ${
                        isAdmin ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-xl px-3 py-2 ${
                          isAdmin
                            ? "bg-[#116AD1] text-white"
                            : senderId === "SYSTEM" || senderId?.includes("ADMIN")
                            ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                            : "bg-white text-gray-800 border border-gray-200"
                        }`}
                      >
                        <div className="text-xs font-semibold mb-1 opacity-80">
                          {isAdmin
                            ? "Admin"
                            : senderId === "ADMIN" || senderId?.includes("ADMIN")
                            ? "Hệ thống"
                            : senderUsername || "Người dùng"}
                        </div>
                        <div className="text-sm">{message.content}</div>
                        {message.attachments &&
                          message.attachments.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {message.attachments.map((url, idx) => (
                                <img
                                  key={idx}
                                  src={url}
                                  alt={`Attachment ${idx + 1}`}
                                  className="max-w-full h-auto rounded cursor-pointer"
                                  onClick={() => window.open(url, "_blank")}
                                />
                              ))}
                            </div>
                          )}
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
            <form
              onSubmit={sendMessage}
              className="p-4 border-t border-gray-200 bg-white flex-shrink-0"
            >
              {attachments.length > 0 && (
                <div className="mb-2 text-sm text-gray-600">
                  <strong>File đính kèm:</strong> {attachments.map(f => f.name).join(', ')}
                  <button 
                    type="button" 
                    onClick={() => setAttachments([])} 
                    className="ml-2 text-red-500 hover:text-red-700 font-bold"
                  >
                    (Xóa)
                  </button>
                </div>
              )}
              <div className="flex gap-2 items-center">
                <label className="cursor-pointer bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300 transition" title="Đính kèm file">
                  <AttachFileIcon style={{ fontSize: 20 }} />
                  <input
                    type="file"
                    multiple
                    onChange={handleAttachmentChange}
                    className="hidden"
                    disabled={sending}
                  />
                </label>

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
                  disabled={(!newMessage.trim() && attachments.length === 0) || sending}
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
              <ChatIcon
                style={{ fontSize: 64, color: "#ccc", marginBottom: 16 }}
              />
              <p>Chọn một cuộc trò chuyện để xem tin nhắn</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatManagement;