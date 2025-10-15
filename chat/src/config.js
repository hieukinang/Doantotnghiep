require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'change_this_secret',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/chat-app',
  cloudinary: {
    cloud_name: process.env.CLOUD_NAME || '',
    api_key: process.env.CLOUD_API_KEY || '',
    api_secret: process.env.CLOUD_API_SECRET || ''
  }
};
