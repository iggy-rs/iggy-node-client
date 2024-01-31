
import { Socket } from 'node:net';
import type { CommandResponse } from './client.type.js';
import { translateCommandCode } from '../wire/command.code.js';
import { responseError } from '../wire/error.utils.js';


export const handleResponse = (r: Buffer) => {
  const status = r.readUint32LE(0);
  const length = r.readUint32LE(4);
  console.log('<== handleResponse', { status, length });
  return {
    status, length, data: r.subarray(8)
  }};

export const deserializeVoidResponse = 
  (r: CommandResponse): Boolean => r.status === 0 && r.data.length === 0;

const COMMAND_LENGTH = 4;

export const serializeCommand = (command: number, payload: Buffer) => {
  const payloadSize = payload.length + COMMAND_LENGTH;
  const head = Buffer.allocUnsafe(8);

  head.writeUint32LE(payloadSize, 0);
  head.writeUint32LE(command, 4);

  console.log(
    '==> CMD', command,
    translateCommandCode(command),
    head.subarray(4, 8).toString('hex'),
    'LENGTH', payloadSize,
    head.subarray(0, 4).toString('hex')
  );

  return Buffer.concat([head, payload]);
}


export const wrapSocket = (socket: Socket) => new Promise<Socket>((resolve, reject) => {
  socket.on('error', (err: unknown) => {
    console.error('SOCKET ERROR', err)
    reject(err);
  });
  socket.once('connect', () => {
    console.log('socket.connect event !');
    resolve(socket);
  });
  socket.on('close', (e) => { console.error('#CLOSE', e); reject(e); });
  socket.on('end', () => { console.error('#END'); reject(); });
});


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


// enum TransportType {
//   TCP = 'tcp',
//   // TLS = 'tls',
//   // QUIC = 'quic'
// }

// type ClientConfig = {
//   transport: TransportType
//   host: string,
//   port: number
// }

// export const transportClient = (config: ClientConfig): Client => {
//   const {transport} = config;
// };
