
import type { CommandResponse, Client } from './client.type.js';
import { createConnection, Socket } from 'node:net';
import { wrapSocket, sendCommandWithResponse } from './client.utils.js';


export const createTcpSocket = (
  host: string, port: number, keepAlive = true
): Promise<Socket> => {
  const socket = createConnection(port, host);
  socket.setKeepAlive(keepAlive);
  return wrapSocket(socket);
};


export type TcpOption = {
  host: string,
  port: number,
  keepAlive?: boolean
};


export const TcpClient = ({ host, port, keepAlive = true }: TcpOption): Client => {
  let socket: Socket;
  return {
    sendCommand: async (code: number, payload: Buffer):Promise<CommandResponse> => {
      if (!socket)
        socket = await createTcpSocket(host, port, keepAlive);
      return sendCommandWithResponse(socket)(code, payload);
    }
  }
};
