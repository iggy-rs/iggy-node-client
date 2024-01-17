
import type { CommandResponse } from '../../tcp.client.js';
import { deserializeClient } from './client.utils.js';

// GET CLIENT by id
export const GET_CLIENT = {
  code: 21,
  serialize: (id: number): Buffer => {
    const b = Buffer.alloc(4);
    b.writeUInt32LE(id);
    return b;
  },
  deserialize: (r: CommandResponse) => deserializeClient(r.data).data
};
