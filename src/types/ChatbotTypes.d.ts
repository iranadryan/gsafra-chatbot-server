import { Socket } from 'socket.io';

export interface IConversation {
  number: string;
  name: string;
  client: Socket<ClientToServerEvents, ServerToClientEvents> | null;
  clientsResponse: {
    clientName: string;
    client: Socket<ClientToServerEvents, ServerToClientEvents>;
    canResponse: boolean;
  }[];
}

interface IWebhookBody {
  pushName: string;
  key: {
    remoteJid: string;
  };
  message: {
    conversation: string;
  };
}
