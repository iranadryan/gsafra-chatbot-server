import express from 'express';
import http from 'node:http';
import { Server, Socket } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents } from './types/SocketTypes';
import { conversations, redirectMessagesWorkFlow } from './redirectMessagesWorkflow';

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server);
export type socketServerType = typeof io;

let clients: Socket<ClientToServerEvents, ServerToClientEvents>[] = [];

io.on('connection', (socket) => {
  console.log(`A new client connected: ${socket.id}`);
  clients.push(socket);

  socket.on('newUserResponse', (body) => {
    const conversationIndex = conversations.findIndex(
      (conversation) => conversation.number === body.number
    );

    conversations[conversationIndex].clientsResponse.push({
      canResponse: body.canResponse,
      clientName: body.clientName,
      client: socket,
    });
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    clients = clients.filter((client) => client !== socket);
  });
});

app.use(express.json());
app.post('/hook', async (request, response) => {
  console.log(`New ${request.body.type} arrived from webhook`);

  if (request.body.type === 'message') {
    await redirectMessagesWorkFlow({
      body: request.body.body,
      socketServer: io,
      clients
    });
  }

  return response.sendStatus(200);
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
