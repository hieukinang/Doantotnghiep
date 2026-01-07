import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import ChatWindow from './ChatWindow';
import chatService from '../services/chatService';
import { Chat as ChatIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

const SystemChatBox = () => {
  const { clientToken, clientUsername, sellerToken } = useContext(ShopContext);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(false);

  const isSellerPage = location.pathname.startsWith('/seller');

  const currentToken = isSellerPage ? (sellerToken || clientToken) : (clientToken || sellerToken);
  const currentUsername = isSellerPage ? (localStorage.getItem('storeName') || 'Store') : (clientUsername || 'User');

  useEffect(() => {

    if (currentToken){
      chatService.setToken(currentToken);
    } else {
      chatService.clearToken();
    }
  }, [currentToken, currentUsername, isOpen]);

  useEffect(() => {
    if (isOpen && !conversationId && currentToken) {
      createSystemConversation();
    }
  }, [isOpen, conversationId, currentToken]);

  const createSystemConversation = async () => {
    if (!currentToken) {
      toast.warning('Vui lòng đăng nhập để sử dụng tính năng chat!');
      setIsOpen(false);
      return;
    }

    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error('Không thể lấy thông tin user');
      }
      const systemUserId = "ADMIN1766313158298";
      const conversation = await chatService.createDirectConversation(
        systemUserId
      );
      setConversationId(conversation._id || conversation.id);
    } catch (error) {
      console.error('Error creating system conversation:', error);
      toast.error('Không thể tạo cuộc trò chuyện. Vui lòng thử lại!');
      setIsOpen(false);
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

  if (!currentToken) return null;

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={handleToggle}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#116AD1] text-white rounded-full shadow-lg hover:bg-[#0d5ba8] transition-all flex items-center justify-center z-40"
        title="Chat với hệ thống"
      >
        <ChatIcon style={{ fontSize: 28 }} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <ChatWindow
          conversationId={conversationId}
          otherUser={{ user_id: 'SYSTEM', username: 'Hệ thống', image: null }}
          onClose={handleClose}
          isSystemChat={true}
        />
      )}
    </>
  );
};

export default SystemChatBox;

