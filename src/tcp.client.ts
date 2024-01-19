
import { createConnection, Socket } from 'node:net';
import { responseError } from './wire/error.utils.js';
import { translateCommandCode } from './wire/command.code.js';

// interface IggyClient {
//   socket: Socket
// }

const COMMAND_LENGTH = 4;
// const REQUEST_INITIAL_BYTES_LENGTH = 4;

export type CommandResponse = {
  status: number,
  length: number,
  data: Buffer
};

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

    const payloadSize = payload.length + COMMAND_LENGTH;
    const head = Buffer.alloc(8);

    head.writeUint32LE(payloadSize, 0);
    head.writeUint32LE(command, 4);

    console.log(
      '==> CMD', head.readInt32LE(4),
      translateCommandCode(command),
      'LENGTH', head.readInt32LE(0));

    const cmd = Buffer.concat([head, payload]);
    console.log('==> sending cmd', command, cmd /**, cmd.toString()*/);
    console.log('==> socket write', s.write(cmd));

    console.log('==> full cmd', cmd.toString('hex'));

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
