
import type { CommandResponse } from '../../tcp.client.js';
import { deserializeClient } from './client.utils.js';

export const GET_CLIENTS = {
  code: 22,
  serialize: () => Buffer.alloc(0),
  deserialize: (r: CommandResponse) => {
    const payloadSize = r.data.length;
    const clients = [];
    let pos = 0;
    while (pos < payloadSize) {
      const { bytesRead, data } = deserializeClient(r.data, pos)
      clients.push(data);
      pos += bytesRead;
    }
    return clients;
  }
};