export interface ServerToClientEvents {
  newUser: (number: string) => void;
  newMessage: (body: {
    name: string;
    number: string;
    message: string;
  }) => void;
}

export interface ClientToServerEvents {
  newUserResponse: (body: {
    canResponse: boolean;
    number: string;
    clientName: string;
  }) => void;
  removeUser: (number: string) => void;
}
