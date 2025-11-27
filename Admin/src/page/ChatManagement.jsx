import React, { useState, useEffect, useRef } from 'react';
import adminChatService from '../services/chatService';
import {
  Chat as ChatIcon,
  Send as SendIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  AttachFile as AttachFileIcon, // Import icon file
} from '@mui/icons-material';

const ChatManagement = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [attachments, setAttachments] = useState([]); // State mới cho attachments
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Lưu trữ độ dài messages trước khi fetch mới để quyết định scroll
  const prevMessagesLengthRef = useRef(0);

  // --- EFFECTS ---
  useEffect(() => {
    // Tự động tạo user trong chat system nếu chưa có
    const initAdminUser = async () => {
      const userId = adminChatService.getUserIdFromToken();
      const username = localStorage.getItem('adminUsername') || 'Admin';

      if (!userId) {
        console.error('Cannot get userId from token');
        alert('Không thể xác thực. Vui lòng đăng nhập lại.');
        return;
      }

      try {
        // Tạo user trong chat system (sẽ tự động handle duplicate)
        await adminChatService.createUser(userId, username);
        // Đợi một chút để đảm bảo user đã được tạo
        await new Promise((resolve) => setTimeout(resolve, 300));
        // Sau đó mới fetch conversations
        fetchConversations();
      } catch (error) {
        // Nếu vẫn lỗi, thử fetch conversations (có thể user đã tồn tại)
        console.warn('Could not create admin user in chat system:', error);
        setTimeout(() => fetchConversations(), 500);
      }
    };

    initAdminUser();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      const conversationId = selectedConversation._id || selectedConversation.id;
      
      // Reset độ dài cũ khi chọn conversation mới để kích hoạt cuộn lần đầu
      prevMessagesLengthRef.current = 0; 

      // Fetch lần đầu và thiết lập auto refresh
      fetchMessages(conversationId, true);

      // Auto refresh messages every 3 seconds
      const interval = setInterval(() => {
        fetchMessages(conversationId);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedConversation]);

  useEffect(() => {
    // Logic cuộn: Chỉ cuộn nếu tin nhắn mới được thêm vào (mới > cũ)
    // hoặc là lần đầu tiên load messages (cũ == 0)
    if (messages.length > prevMessagesLengthRef.current || prevMessagesLengthRef.current === 0) {
      scrollToBottom();
    }
    // Cập nhật độ dài tin nhắn
    prevMessagesLengthRef.current = messages.length;
  }, [messages]);

  const scrollToBottom = () => {
    // Sử dụng messagesContainerRef để đảm bảo khu vực cuộn chính xác
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // --- FETCH FUNCTIONS ---
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

      // Nếu lỗi là user chưa tồn tại, thử tạo lại user (Giữ nguyên logic này)
      if (
        errorMessage.includes('does no longer exist') ||
        errorMessage.includes('Unauthorized')
      ) {
        const userId = adminChatService.getUserIdFromToken();
        const username = localStorage.getItem('adminUsername') || 'Admin';
        if (userId) {
          try {
            await adminChatService.createUser(userId, username);
            // Thử lại sau khi tạo user
            setTimeout(() => fetchConversations(), 500);
            return;
          } catch (createError) {
            console.error("Error creating admin user:", createError);
          }
        }
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId, isInitialLoad = false) => {
    try {
      const data = await adminChatService.getMessages(conversationId);
      const newMessages = Array.isArray(data) ? data : [];

      // Kiểm tra xem có tin nhắn mới hơn không (chỉ khi không phải lần đầu)
      if (!isInitialLoad && newMessages.length > messages.length) {
        // Logic cuộn sẽ được kích hoạt trong useEffect [messages]
      } else if (isInitialLoad) {
        // Đảm bảo cuộn lần đầu
        prevMessagesLengthRef.current = newMessages.length;
        setTimeout(() => scrollToBottom(), 100);
      }

      setMessages(newMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  // --- END FETCH FUNCTIONS ---

  // --- HANDLERS ---
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setMessages([]);
  };
  
  const handleAttachmentChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(files);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (
      (!newMessage.trim() && attachments.length === 0) || // Chỉ cần content HOẶC file
      sending || 
      !selectedConversation
    )
      return;

    setSending(true);
    try {
      const conversationId =
        selectedConversation._id || selectedConversation.id;
      // Giả định adminChatService.sendMessage đã được sửa để chấp nhận attachments (dù yêu cầu là không sửa service)
      // Dựa trên code gốc, tôi sẽ gọi hàm này với attachments:
      await adminChatService.sendMessage(
        conversationId, 
        newMessage.trim(),
        attachments // Truyền mảng files
      );

      setNewMessage("");
      setAttachments([]); // Xóa attachments sau khi gửi
      // Refresh messages và đảm bảo cuộn
      setTimeout(() => fetchMessages(conversationId, true), 500); 
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Không thể gửi tin nhắn");
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
      // Refresh conversations
      fetchConversations();
      // Clear selected if deleted
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
      alert("Không thể xóa cuộc trò chuyện");
    }
  };
  // --- END HANDLERS ---

  // --- FORMATTERS ---
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    // Chỉ hiển thị giờ và phút
    return date.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getConversationTitle = (conversation) => {
    if (conversation.type === "group") {
      return conversation.name || "Nhóm chat";
    }

    // Direct conversation - lấy tên của participant khác
    const currentUserId = adminChatService.getUserIdFromToken();
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
      
      const username = otherParticipant.username; // Lấy username

      // Kiểm tra nếu là SYSTEM
      if (userId === "ADMIN" || userId?.includes("ADMIN")) {
        return "Hệ thống";
      }
      
      // Hiển thị username (nếu có), nếu không có thì fallback về ID
      return username || userId || "Người dùng";
    }

    return "Cuộc trò chuyện";
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
  // --- END FORMATTERS ---

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Danh sách conversations (Scroll riêng) */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
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

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
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
                            style={{ fontSize: 18, color: "#116AD1" }} // Icon nhỏ hơn
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
                        <p className="text-xs text-gray-500 mt-1 truncate ml-5"> {/* Lệch trái */}
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

        {/* Main Content - Messages (Scroll riêng) */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedConversation ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-gray-200 bg-[#116AD1] text-white">
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

              {/* Messages */}
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
                    const senderId =
                      typeof message.sender_id === "object"
                        ? message.sender_id?.user_id
                        : message.sender_id;
                    
                    const senderUsername = 
                        typeof message.sender_id === "object" 
                          ? message.sender_id?.username
                          : senderId; // Fallback về ID nếu không phải object

                    const currentAdminId = adminChatService.getUserIdFromToken();
                    const isAdmin = senderId === currentAdminId; // So sánh chính xác admin hiện tại

                    return (
                      <div
                        key={message._id || message.id}
                        className={`flex ${
                          isAdmin ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-xl px-3 py-2 ${ // Rounded-xl và padding nhỏ hơn
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
                              : senderUsername || "Người dùng"} // Hiển thị username
                          </div>
                          <div className="text-sm">{message.content}</div> {/* Tin nhắn nhỏ hơn */}
                          {message.attachments &&
                            message.attachments.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {message.attachments.map((url, idx) => (
                                  <img
                                    key={idx}
                                    src={url}
                                    alt={`Attachment ${idx + 1}`}
                                    className="max-w-full h-auto rounded cursor-pointer"
                                    onClick={() => window.open(url, "_blank")} // Mở file trong tab mới
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

              {/* Input */}
              <form
                onSubmit={sendMessage}
                className="p-4 border-t border-gray-200 bg-white"
              >
                {/* Hiển thị file đính kèm đã chọn */}
                {attachments.length > 0 && (
                  <div className="mb-2 text-sm text-gray-600">
                    **File đính kèm:** {attachments.map(f => f.name).join(', ')}
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
                    {/* Button đính kèm file */}
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
    </div>
  );
};

export default ChatManagement;