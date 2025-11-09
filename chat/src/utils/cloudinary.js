import { v2 as cloudinary } from 'cloudinary';
import { cloudinary as conf } from '../config.js';

cloudinary.config({
  cloud_name: conf.cloud_name,
  api_key: conf.api_key,
  api_secret: conf.api_secret
});

async function uploadImage(data, folder = 'chat-app', mimetype) {
  // Accept either a base64/data URL string or a Buffer + mimetype
  let payload = data;
  // If user passed a Buffer, convert to data URI with provided mimetype
  if (Buffer.isBuffer(data)) {
    const mt = mimetype || 'application/octet-stream';
    const base64 = data.toString('base64');
    payload = `data:${mt};base64,${base64}`;
  }

  // cloudinary accepts data URLs or remote/absolute URLs
  return cloudinary.uploader.upload(payload, { folder });
}

export { uploadImage };
