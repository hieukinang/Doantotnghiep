import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import ChatWindow from './ChatWindow';
import chatService from '../services/chatService';
import { toast } from 'react-toastify';

const MessageButton = ({ userId, userType, userName, userImage }) => {
  const { clientToken, clientUsername } = useContext(ShopContext);
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!clientToken) {
      toast.warning('Vui lòng đăng nhập để nhắn tin!');
      return;
    }

    if (!userId) {
      toast.error('Thông tin người dùng không hợp lệ!');
      return;
    }

    setLoading(true);
    try {
      const currentUserId = chatService.getUserIdFromToken();
      if (!currentUserId) {
        throw new Error('Không thể lấy thông tin user');
      }

      // Tạo user trong chat system nếu chưa có
      try {
        await chatService.createUser(currentUserId, clientUsername || 'User');
      } catch (e) {
        // User có thể đã tồn tại, ignore
      }

      chatService.createUser(currentUserId, clientUsername || 'User').catch(() => {
      });
      // Tạo hoặc lấy conversation
      const conversation = await chatService.createDirectConversation(userId);
      setConversationId(conversation._id || conversation.id);
      setIsOpen(true);
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast.error('Không thể tạo cuộc trò chuyện. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={loading}
        className="px-4 py-2 bg-[#116AD1] text-white rounded-lg hover:bg-[#0d5ba8] transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Đang tải...' : 'Nhắn tin'}
      </button>

      {isOpen && conversationId && (
        <ChatWindow
          conversationId={conversationId}
          otherUser={{ user_id: userId, username: userName, image: userImage }}
          onClose={handleClose}
          isSystemChat={false}
        />
      )}
    </>
  );
};

export default MessageButton;

