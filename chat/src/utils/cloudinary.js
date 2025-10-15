const cloudinary = require('cloudinary').v2;
const { cloudinary: conf } = require('../config');

cloudinary.config({
  cloud_name: conf.cloud_name,
  api_key: conf.api_key,
  api_secret: conf.api_secret
});

async function uploadImage(base64) {
  // expects a base64 string or data URL
  return cloudinary.uploader.upload(base64, { folder: 'chat-app' });
}

module.exports = { uploadImage };
