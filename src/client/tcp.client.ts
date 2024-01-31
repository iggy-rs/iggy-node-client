
import { createConnection, Socket, TcpSocketConnectOpts } from 'node:net';
import type { CommandResponse, Client } from './client.type.js';
import { wrapSocket, sendCommandWithResponse } from './client.utils.js';


export const createTcpSocket = (options: TcpSocketConnectOpts): Promise<Socket> => {
  const socket = createConnection(options);
  return wrapSocket(socket);
};


export type TcpOption = TcpSocketConnectOpts;

export const TcpClient = ({ host, port, keepAlive = true }: TcpOption): Client => {
  let socket: Socket;
  return {
    sendCommand: async (code: number, payload: Buffer):Promise<CommandResponse> => {
      if (!socket)
        socket = await createTcpSocket({host, port, keepAlive});
      return sendCommandWithResponse(socket)(code, payload);
    }
  }
};

// export const createTransport = (options: TcpOption): Client => {
//   let socket: Socket;
//   return {
//     sendCommand: async (code: number, payload: Buffer):Promise<CommandResponse> => {
//       if (!socket)
//         socket = await createTcpSocket(options);
//       return sendCommandWithResponse(socket)(code, payload);
//     }
//   }
// };
