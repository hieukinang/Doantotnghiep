// config.js
// Tất cả cấu hình dùng chung trong app sẽ được lưu ở đây

const config = {
  // backendUrl: 'http://10.0.2.2:5000/api',
  // backendUrl: 'http://172.16.12.139:5000/api',//tina4
  backendUrl: 'http://192.168.1.7:5000/api', //gianghuyen5g
  // backendUrl: 'http://10.79.183.146:5000/api', //realme 8

  // port:'10.0.2.2',
  // port:'172.16.12.139',// tina4
  port:'192.168.1.7',// gianghuyen5g
  // port: '10.79.183.146', //realme 8
  appName: 'KOHI MALL',
  appVersion: '1.0.0',

  defaultPageSize: 20,
  maxUploadSizeMB: 10,
  supportEmail: 'support@kohimall.com',
};

export default config;
