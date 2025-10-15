# Chat backend

Simple realtime chat backend using Express, MongoDB and Socket.IO.

Features implemented in scaffold:
- Register / Login with JWT
- User profile update and avatar upload (Cloudinary)
- Conversations (direct / group), join requests, admin approval
- Messages storage and realtime delivery via Socket.IO
- Presence (online/offline) broadcast

Quick start

1. Copy `.env.example` to `.env` and fill values (MongoDB URI, JWT secret, Cloudinary keys).
2. Install dependencies: npm install
3. Run: npm run dev

Socket.IO clients should connect with auth token in handshake: { auth: { token: 'Bearer <token>' } }
