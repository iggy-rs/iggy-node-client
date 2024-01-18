
import type { CommandResponse } from '../../tcp.client.js';

export const CREATE_STREAM = {
  code: 202,
  serialize: (id: number, name: string) => {
    const bName = Buffer.from(name);
    if (bName.length < 1 || bName.length > 255)
      throw new Error('Stream name should be between 1 and 255 bytes');
    const b = Buffer.alloc(4 + 1);
    b.writeUInt32LE(id, 0);
    b.writeUInt8(bName.length, 4);
    return Buffer.concat([
      b,
      bName
    ]);
  },
  deserialize: (r: CommandResponse) => {
    return r.status === 0 && r.data.length === 0;
  }
};
