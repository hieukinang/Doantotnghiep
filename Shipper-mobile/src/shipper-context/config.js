// config.js
// Tất cả cấu hình dùng chung trong app sẽ được lưu ở đây

const config = {
  // backendUrl: 'http://10.0.2.2:5000/api',
  // backendUrl: 'http://172.16.12.139:5000/api',//tina4
  backendUrl: 'http://10.38.2.146:5000/api', //gianghuyen5g
  // backendUrl: 'http://10.155.67.146:5000/api', //realme 8
  // backendUrl: 'https://unatoned-dwain-dipolar.ngrok-free.dev/api', // ngrok tunnel

  // port:'10.0.2.2',
  // port:'172.16.12.139',// tina4
  port:'10.38.2.146',// gianghuyen5g
  // port: '10.155.67.146', //realme 8
  // port: 'unatoned-dwain-dipolar.ngrok-free.dev', // ngrok tunnel
  appName: 'KOHI MALL',
  appVersion: '1.0.0',

  defaultPageSize: 20,
  maxUploadSizeMB: 10,
  supportEmail: 'support@kohimall.com',
};

export default config;
