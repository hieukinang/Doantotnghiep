import http from 'http';
import app from './app.js';
import { initSocket } from './socket.js';
import { port } from './config.js';

const server = http.createServer(app);

initSocket(server);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
