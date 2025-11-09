import 'dotenv/config';

export const port = process.env.PORT || 8080;
export const jwtSecret = process.env.JWT_SECRET || 'change_this_secret';
export const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/chat-app';
export const cloudinary = {
  cloud_name: process.env.CLOUD_NAME || '',
  api_key: process.env.CLOUD_API_KEY || '',
  api_secret: process.env.CLOUD_API_SECRET || ''
};
