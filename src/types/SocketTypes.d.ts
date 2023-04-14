export interface ServerToClientEvents {
  newUser: (number: string) => void;
  newMessage: (body: {
    name: string;
    number: string;
    message: string;
  }) => void;
}

export interface ClientToServerEvents {
  testCommunication: (message: string) => void;
  newUserResponse: (body: {
    canResponse: boolean;
    number: string;
    clientName: string;
  }) => void;
  removeUser: (number: string) => void;
}
