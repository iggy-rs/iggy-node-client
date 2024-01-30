
import type { CommandResponse } from './client.type.js';
import { translateCommandCode } from '../wire/command.code.js';


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
