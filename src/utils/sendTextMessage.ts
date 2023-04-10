import axios from 'axios';

export async function sendTextMessage(number: string, message: string) {
  await axios({
    method: 'post',
    url: 'http://44.203.115.176:3333/message/text?key=gsafra_server',
    data: {
      id: number,
      message: message,
    }
  });
}
