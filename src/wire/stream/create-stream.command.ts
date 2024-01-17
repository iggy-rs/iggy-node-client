
import type { CommandResponse } from '../../tcp.client.js';

export const CREATE_STREAM = {
  code: 202,
  serialize: (id: number, name: string) => {
    const bName = Buffer.from(name);
    if (bName.length > 255)
      throw new Error('stream name should not exceed 255 chars');
    const b = Buffer.alloc(4 + 1);
    b.writeUInt32LE(id, 0);
    b.writeUInt8(bName.length, 4);
    return Buffer.concat([
      b,
      bName
    ]);
  },
  deserialize: (r: CommandResponse) => {
    // response status = 1011 seem to be alreadyExist code
    // response status 0 & empty response seem to be OK
    return r.status === 0 && r.data.length === 0;
  }
};
