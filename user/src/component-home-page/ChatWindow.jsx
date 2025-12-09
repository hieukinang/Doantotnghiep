import React, { useState, useEffect, useRef, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import chatService from '../services/chatService';
import { getChatSocket } from '../services/chatSocket';
import { Chat as ChatIcon, Close as CloseIcon, Send as SendIcon, AttachFile as AttachIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

const ChatWindow = ({ conversationId, otherUser, onClose, isSystemChat = false }) => {
  const { clientToken } = useContext(ShopContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const currentUserId = chatService.getUserIdFromToken();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Socket realtime messages
  useEffect(() => {
    if (!clientToken || !conversationId) return;

    const s = getChatSocket();
    if (!s) return;

    setSocket(s);

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
  }, [clientToken, conversationId]);

  useEffect(() => {
    if (conversationId && clientToken) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
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

  // 📌 Khi chọn file
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  // 📌 Gửi tin nhắn + file
  const sendMessage = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && selectedFiles.length === 0) || sending) return;

    setSending(true);

    try {
      const message = await chatService.sendMessage(
        conversationId,
        newMessage.trim(),
        selectedFiles
      );

      setNewMessage('');
      setSelectedFiles([]);
      fileInputRef.current.value = '';

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

  if (!conversationId) return null;

  return (
    <div className="fixed bottom-0 right-0 w-80 h-[400px] bg-white shadow-2xl rounded-t-lg flex flex-col z-50 border border-gray-200">

      {/* HEADER */}
      <div className="bg-[#116AD1] text-white p-3 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            {isSystemChat ? (
              <ChatIcon className="text-[#116AD1]" style={{ fontSize: 20 }} />
            ) : (
              <img
                src={otherUser?.image || 'https://i.pravatar.cc/100'}
                alt={otherUser?.username || 'User'}
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
          </div>

          <div>
            <div className="font-semibold text-sm">
              {isSystemChat ? 'Hệ thống' : otherUser?.username || 'Người dùng'}
            </div>
            <div className="text-[10px] opacity-90">Đang hoạt động</div>
          </div>
        </div>

        <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-1 transition">
          <CloseIcon style={{ fontSize: 20 }} />
        </button>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
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

                  {/* HIỂN THỊ FILE GỬI */}
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
          
          {/* ICON CHỌN FILE */}
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            <AttachIcon />
          </button>

          {/* FILE INPUT ẨN */}
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          {/* INPUT */}
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
            disabled={sending}
          />

          {/* SEND BUTTON */}
          <button
            type="submit"
            disabled={(!newMessage.trim() && selectedFiles.length === 0) || sending}
            className="bg-[#116AD1] text-white px-3 py-2 rounded-lg hover:bg-[#0d5ba8] disabled:opacity-50"
          >
            <SendIcon style={{ fontSize: 18 }} />
          </button>
        </div>

        {/* PREVIEW FILE ĐÃ CHỌN */}
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

export default ChatWindow;
