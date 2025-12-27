// axiosInstance.js
// Axios instance với header bypass ngrok warning page

import axios from 'axios';
import config from './config';

const axiosInstance = axios.create({
  baseURL: config.backendUrl,
  headers: {
    'ngrok-skip-browser-warning': 'true',
  },
});

export default axiosInstance;
