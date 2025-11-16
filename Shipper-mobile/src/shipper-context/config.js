// config.js
// Tất cả cấu hình dùng chung trong app sẽ được lưu ở đây

const config = {
  // backendUrl: 'http://10.0.2.2:5000/api',
  backendUrl: 'http://192.168.1.7:5000/api',


  appName: 'KOHI MALL',
  appVersion: '1.0.0',

  // Các key, token, limit mặc định,... có thể mở rộng
  defaultPageSize: 20,
  maxUploadSizeMB: 10,
  supportEmail: 'support@kohimall.com',
};

export default config;
