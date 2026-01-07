import axios from 'axios';

const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL || 'http://127.0.0.1:3000/api';

class AdminChatService {
  constructor() {
    this.baseURL = CHAT_API_URL;
  }

  getToken() {
    return localStorage.getItem('adminToken');
  }

  _creatingUsers = new Set();

  async createUser(userId, username) {
    if (this._creatingUsers.has(userId)) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ status: 'success', message: 'User already being created' });
        }, 100);
      });
    }
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

  // Lấy danh sách tất cả conversations
  async getAllConversations() {
    try {
      const token = this.getToken();
      if (!token) throw new Error('No token found');
      
      const res = await axios.get(`${this.baseURL}/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(res)
      return res.data;
    } catch (error) {
      console.error('Error getting conversations:', error);
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

  // Gửi message
  async sendMessage(conversationId, content, attachments = []) {
    try {
      const token = this.getToken();
      if (!token) throw new Error('No token found');

      const formData = new FormData();
      formData.append('content', content);
      
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
}

export default new AdminChatService();