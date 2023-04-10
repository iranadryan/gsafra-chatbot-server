import { Socket } from 'socket.io';
import { initTerms } from './config/chatbot';
import { sendTextMessage } from './utils/sendTextMessage';
import { delay } from './utils/delay';
import { socketServerType } from '.';
import { IConversation, IWebhookBody } from './types/ChatbotTypes';
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from './types/SocketTypes';
import {
  cantRequestMessage,
  clientConnectedMessage,
  notFoundMessage,
  selectClientMessage,
  selectRightClientMessage,
  startMessage,
} from './messages';

interface IRedirectMessagesWorkFlowArgs {
  body: IWebhookBody;
  socketServer: socketServerType;
  clients: Socket<ClientToServerEvents, ServerToClientEvents>[];
}

export const conversations: IConversation[] = [];

export async function redirectMessagesWorkFlow({
  body,
  clients,
  socketServer,
}: IRedirectMessagesWorkFlowArgs) {
  const number = body.key.remoteJid.split('@')[0];
  const name = body.pushName;
  const message = body.message.conversation.trim().toLocaleLowerCase();

  let conversationIndex = conversations.findIndex(
    (conversation) => conversation.number === number
  );

  // User is starting a new conversation
  if (initTerms.includes(message)) {
    await sendTextMessage(number, startMessage(name));

    // Already exists a conversation for this number
    if (conversationIndex === -1) {
      const newLength = conversations.push({
        name,
        number,
        client: null,
        clientsResponse: [],
      });

      conversationIndex = newLength - 1;
    } else {
      conversations[conversationIndex] = {
        name,
        number,
        client: null,
        clientsResponse: [],
      };
    }

    socketServer.emit('newUser', number);

    // Waiting for all clients response
    while (
      conversations[conversationIndex].clientsResponse.length !== clients.length
    ) {
      await delay(50);
    }

    const clientsThatCanResponse = conversations[
      conversationIndex
    ].clientsResponse.filter((client) => client.canResponse);

    conversations[conversationIndex].clientsResponse = clientsThatCanResponse;

    if (clientsThatCanResponse.length === 0) {
      return await sendTextMessage(number, cantRequestMessage);
    }

    if (clientsThatCanResponse.length === 1) {
      conversations[conversationIndex].client =
        clientsThatCanResponse[0].client;

      await sendTextMessage(
        number,
        clientConnectedMessage(clientsThatCanResponse[0].clientName)
      );

      const client = conversations[conversationIndex].client;

      if (client) {
        return client.emit('newMessage', {
          number,
          name,
          message,
        });
      }
    }

    if (clientsThatCanResponse.length > 1) {
      return await sendTextMessage(
        number,
        selectClientMessage(clientsThatCanResponse)
      );
    }
  }

  // Conversation does exists but the client was not selected yet
  if (conversationIndex !== -1 && !conversations[conversationIndex].client) {
    const selectedClient = conversations[conversationIndex]
      .clientsResponse[Number(message) - 1];

    // The selected client is invalid
    if (!selectedClient) {
      return await sendTextMessage(
        number,
        selectRightClientMessage(
          conversations[conversationIndex].clientsResponse
        )
      );
    }

    conversations[conversationIndex].client = selectedClient.client;

    await sendTextMessage(
      number,
      clientConnectedMessage(selectedClient.clientName)
    );

    const client = conversations[conversationIndex].client;

    if (client) {
      return client.emit('newMessage', {
        number,
        name,
        message: 'oi',
      });
    }
  }

  // Conversation does exists and has a client
  if (conversationIndex !== -1) {
    const client = conversations[conversationIndex].client;

    if (client) {
      return client.emit('newMessage', {
        number,
        name,
        message,
      });
    }
  }

  // Conversation doesn't exists and the user isn't starting a new one
  if (conversationIndex === -1) {
    return await sendTextMessage(number, notFoundMessage);
  }
}
