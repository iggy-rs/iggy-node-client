
import type { CommandResponse } from '../../tcp.client.js';
import { deserializeCreateToken } from './token.utils.js';

export const CREATE_TOKEN = {
  code: 42,

  serialize: (name: string, expiry = 600): Buffer => {
    const bName = Buffer.from(name);
    if (bName.length > 255)
      throw new Error('Token name should not exceed 255 chars');
    const b1 = Buffer.alloc(1);
    b1.writeUInt8(bName.length);
    const b2 = Buffer.alloc(4);
    b2.writeUInt32LE(expiry);
    return Buffer.concat([
      b1,
      bName,
      b2
    ]);
  },

  deserialize: (r: CommandResponse) => deserializeCreateToken(r.data).data
};

