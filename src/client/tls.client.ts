
import { connect, ConnectionOptions } from 'node:tls';
import type { CommandResponse, RawClient } from './client.type.js';
import { wrapSocket, CommandResponseStream } from './client.utils.js';

export const createTlsSocket = (
  port: number, options: ConnectionOptions
): Promise<CommandResponseStream> => {
  const socket = connect(port, options);
  socket.setEncoding('utf8');
  return wrapSocket(socket);
}

export type TlsOption = { port: number } & ConnectionOptions;

export const TlsClient = ({ port, ...options }: TlsOption): Promise<RawClient> => {
  return createTlsSocket(port, options);
};
