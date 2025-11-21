import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,   // ⚡ đổi sang port bạn muốn
    host: true,   // (tùy chọn) cho phép truy cập từ mạng LAN
  },
})