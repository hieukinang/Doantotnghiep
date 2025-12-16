import axios from 'axios';

// Base URL cho chat API - có thể cần điều chỉnh theo cấu hình của bạn
const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL || 'http://127.0.0.1:3000/api';

class ChatService {
  constructor() {
    this.baseURL = CHAT_API_URL;
    this._currentToken = null; // Token tùy chỉnh (nếu có)
  }

  setToken(token) {
    this._currentToken = token;
  }

  clearToken() {
    this._currentToken = null;
  }

  getToken(){
    return localStorage.getItem('clientToken');
  }

  // Cache để tránh tạo user nhiều lần
  _creatingUsers = new Set();

  // Tạo user trong chat system (nếu chưa có)
  async createUser(userId, username) {
    // Nếu đang trong quá trình tạo user này, đợi
    if (this._creatingUsers.has(userId)) {
      // Đợi một chút rồi return (user đang được tạo)
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ status: 'success', message: 'User already being created' });
        }, 100);
      });
    }

    // Đánh dấu đang tạo
    this._creatingUsers.add(userId);

    try {
      const res = await axios.post(`${this.baseURL}/users/create`, {
        user_id: userId,
        username: username
      });
      return res.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || '';
      if (error.response?.status === 400 || 
          error.response?.status === 409 ||
          errorMessage.includes('duplicate') ||
          errorMessage.includes('E11000') ||
          errorMessage.includes('already exists')) {
        return { status: 'success', message: 'User already exists' };
      }
      console.warn('Error creating user in chat system (non-critical):', errorMessage);
      return { status: 'success', message: 'User creation attempted' };
    } finally {
      setTimeout(() => {
        this._creatingUsers.delete(userId);
      }, 1000);
    }
  }

  // Tạo direct conversation (chuẩn hoá trả về object conversation thuần)
  async createDirectConversation(userId) {
    try {
      const token = this.getToken();
      if (!token) throw new Error('No token found');

      const res = await axios.post(
        `${this.baseURL}/conversations/direct?userId=${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = res.data;

      if (data && data.conversation) {
        return data.conversation;
      }
      // Fallback nếu backend trả thẳng conversation
      return data;
    } catch (error) {
      console.error('Error creating direct conversation:', error);
      throw error;
    }
  }

  // Lấy danh sách conversations
  async getAllConversations() {
    try {
      const isSeller = window.location.href.includes("/seller");

      const token = isSeller
        ? localStorage.getItem("sellerToken")
        : localStorage.getItem("clientToken");
        if (!token) throw new Error('No token found');
      
      const res = await axios.get(`${this.baseURL}/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (error) {
      console.error('Error getting conversations:', error);
      throw error;
    }
  }


  // Gửi message
  async sendMessage(conversationId, content, attachments = []) {
    try {
      const token = this.getToken();
      if (!token) throw new Error('No token found');

      const formData = new FormData();
      formData.append('content', content);
      
      // Thêm attachments nếu có
      if (attachments && attachments.length > 0) {
        attachments.forEach((file) => {
          formData.append('attachments', file);
        });
      }

      const res = await axios.post(
        `${this.baseURL}/messages/${conversationId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return res.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Lấy messages của conversation
  async getMessages(conversationId) {
    try {
      const token = this.getToken();
      if (!token) throw new Error('No token found');
      
      const res = await axios.get(`${this.baseURL}/messages/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  }

  // Xóa conversation
  async deleteConversation(conversationId) {
    try {
      const token = this.getToken();
      if (!token) throw new Error('No token found');
      
      const res = await axios.delete(`${this.baseURL}/conversations/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  }

  // Tạo group chat
  async createGroupChat(name, code) {
    try {
      const token = this.getToken();
      if (!token) throw new Error('No token found');
      
      const res = await axios.post(
        `${this.baseURL}/conversations/group?name=${encodeURIComponent(name)}${code ? `&code=${encodeURIComponent(code)}` : ''}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return res.data;
    } catch (error) {
      console.error('Error creating group chat:', error);
      throw error;
    }
  }

  // Request join group
  async requestJoinGroup(conversationId) {
    try {
      const token = this.getToken();
      if (!token) throw new Error('No token found');
      
      const res = await axios.post(
        `${this.baseURL}/conversations/${conversationId}/request`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return res.data;
    } catch (error) {
      console.error('Error requesting to join group:', error);
      throw error;
    }
  }

  // Admin approve request
  async approveRequest(conversationId, userId) {
    try {
      const token = this.getToken();
      if (!token) throw new Error('No token found');
      
      const res = await axios.post(
        `${this.baseURL}/conversations/${conversationId}/approve`,
        { userId },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return res.data;
    } catch (error) {
      console.error('Error approving request:', error);
      throw error;
    }
  }
}

export default new ChatService();

