import express from 'express';
import http from 'http';
import { String as RtString, Record as RtRecord } from 'runtypes';
import { Server } from 'socket.io';
// import { v4 } from 'uuid';
import cors from 'cors';
import { verify as JwtVerify } from 'jsonwebtoken';
// import chatEvent from './chatEvents.types';
// import Message from './api/message/message.model';
import usersRouter from './api/user/user.routes';
import loginRouter from './api/login/login.routes';
import { errorHandler } from './middleware';
import { CORS_ORIGIN, PORT, SECRET_JWT_KEY } from './config';
import requestRouter from './api/request/request.routes';
import messageRouter from './api/message/message.routes';
import Connection from './connection';

const app = express();

// Pre-route middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/requests', requestRouter);
app.use('/api/messages', messageRouter);

// Post-router middleware
app.use(errorHandler);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: `${CORS_ORIGIN}`,
  },
});

// Socketio middleware
io.use((socket, next) => {
  try {
    const { token } = RtRecord({ token: RtString }).check(socket.handshake.auth);
    JwtVerify(token, SECRET_JWT_KEY);
    next();
  } catch (error) {
    next(new Error('not authorized'));
  }
});

// Socketio event handling
io.on('connection', (socket) => {
  const connection = new Connection(io, socket);
  console.log(`user connected: ${connection.socket.id}`);
});

const main = () => {
  server.listen(Number(PORT), () => {
    console.log(`listening on :${PORT}`);
  });
};

export default { main, app };
