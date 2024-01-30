
import { createConnection, Socket } from 'node:net';
import { serializeCommand } from './client.utils.js';
import type { CommandResponse, Client } from './client.type.js';
import { responseError } from '../wire/error.utils.js';


export const createClient = (
  host: string, port: number, keepAlive = true
): Promise<Socket> => {
  const socket = createConnection(port, host);
  socket.setKeepAlive(keepAlive);

  return new Promise((resolve, reject) => {
    socket.on('error', (err: unknown) => {
      console.error('SOCKET ERROR', err)
      reject(err);
    });
    socket.once('connect', () => {
      console.log('connected event !');
      resolve(socket);
    });
    socket.on('close', (e) => { console.error('#CLOSE', e); reject(e); });
    socket.on('end', () => { console.error('#END'); reject(); });
  });
};

export const sendCommandWithResponse = (s: Socket) =>
  (command: number, payload: Buffer): Promise<CommandResponse> => {

    const cmd = serializeCommand(command, payload);
    console.log(
      '==> sending cmd', command, cmd.toString('hex')
    );
    console.log('==> socket write', s.write(cmd));

    return new Promise((resolve, reject) => {
      const dataCb = (d: Buffer, l: number) => {
        console.log('<== #DATA', d, l);
        const r = handleResponse(d);
        s.removeListener('error', errCb);
        if (r.status !== 0) {
          return reject(responseError(command, r.status));
        }
        return resolve(r);
      };
      const errCb = (err: unknown) => {
        s.removeListener('data', dataCb);
        reject(err);
      };
      s.once('data', dataCb)
      s.once('error', errCb);
    });
  };

export const handleResponse = (r: Buffer) => {
  const status = r.readUint32LE(0);
  const length = r.readUint32LE(4);
  console.log('<== handleResponse', { status, length });
  return {
    status, length, data: r.subarray(8)
  }
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
        socket = await createClient(host, port, keepAlive);
      return sendCommandWithResponse(socket)(code, payload);
    }
  }
};
