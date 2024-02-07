
import { createConnection, TcpSocketConnectOpts } from 'node:net';
import type { CommandResponse, RawClient } from './client.type.js';
import { wrapSocket, CommandResponseStream } from './client.utils.js';

export const createTcpSocket =
  (options: TcpSocketConnectOpts): Promise<CommandResponseStream> => {
    const socket = createConnection(options);
    return wrapSocket(socket);
  };


export type TcpOption = TcpSocketConnectOpts;

export const TcpClient = ({ host, port, keepAlive = true }: TcpOption): RawClient => {
  let socket: CommandResponseStream;
  return {
    sendCommand: async (code: number, payload: Buffer):Promise<CommandResponse> => {
      if (!socket)
        socket = await createTcpSocket({host, port, keepAlive});
      return socket.sendCommand(code, payload);
    }
  }
};

