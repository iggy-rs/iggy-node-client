
import type { CommandResponse } from '../../tcp.client.js';

export const DELETE_TOKEN = {
  code: 43,

  serialize: (name: string): Buffer => {
    const bName = Buffer.from(name);
    if (bName.length < 1 || bName.length > 255)
      throw new Error('Token name should be between 1 and 255 bytes');
    const b = Buffer.alloc(1);
    b.writeUInt8(bName.length);
    return Buffer.concat([
      b,
      bName
    ]);
  },

  deserialize: (r: CommandResponse) => {
    return r.status === 0 && r.data.length === 0;
  }
};
