import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (_req, res) => {
  res.send('<h1>hello world</h1>');
});

io.on('connection', (socket) => {
  console.log('a user connected: ', socket.id);
});

server.listen(3001, () => {
  console.log('listening on *:3001');
});
