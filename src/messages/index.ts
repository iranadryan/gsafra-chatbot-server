import { Socket } from 'socket.io';
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from 'src/types/SocketTypes';

export const startMessage = (name: string) => `
Olá, *${name}*! 👋
Sou o *assistente virtual* do GSafra.
`.trim();

export const cantRequestMessage = `
Sinto muito! 😕
Mas você não pode fazer requisições.

_Caso isso seja um erro verifique seu sistema_
`.trim();

export const clientConnectedMessage = (name: string) => `
Você está no sistema da empresa *${name}*.
`.trim();

export const selectClientMessage = (
  clients: {
    clientName: string;
    client: Socket<ClientToServerEvents, ServerToClientEvents>;
    canResponse: boolean;
  }[]
) => `
Vi que você pode solicitar dados de mais de uma empresa! 😃
Selecione uma das empresas abaixo para que possamos continuar:

${clients.map((client, index) => `
*${index + 1} - _${client.clientName}_*
`.trimStart()).join('')}
_Responda com o número referente ao que deseja_
`.trim();

export const selectRightClientMessage = (
  clients: {
    clientName: string;
    client: Socket<ClientToServerEvents, ServerToClientEvents>;
    canResponse: boolean;
  }[]
) => `
Não entendi! 😕
Selecione uma das empresas abaixo para que possamos continuar:

${clients.map((client, index) => `
*${index + 1} - _${client.clientName}_*
`.trimStart()).join('')}
_Responda com o número referente ao que deseja_
`.trim();

export const notFoundMessage = `
Desculpa, não entendi! 😕
Você poder iniciar uma nova conversar com um desses *termos*:

_- Oi_
_- Olá_
_- Inciar_
_- Início_
_- GSafra_
`.trim();
