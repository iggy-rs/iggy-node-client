
import { createConnection, TcpSocketConnectOpts } from 'node:net';
import type { RawClient } from './client.type.js';
import { wrapSocket, CommandResponseStream } from './client.socket.js';

export const createTcpSocket =
  (options: TcpSocketConnectOpts): Promise<CommandResponseStream> => {
    const socket = createConnection(options);
    return wrapSocket(socket);
  };


export type TcpOption = TcpSocketConnectOpts;

export const TcpClient = ({ host, port, keepAlive = true }: TcpOption): Promise<RawClient> =>
  createTcpSocket({ host, port, keepAlive });
