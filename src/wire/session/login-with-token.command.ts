
import type { CommandResponse } from '../../tcp.client.js';

export const LOGIN_WITH_TOKEN = {
  code: 44,

  serialize: (token: string) => {
    const bToken = Buffer.from(token);
    if (bToken.length < 1 || bToken.length > 255)
      throw new Error('Token length should be between 1 and 255 bytes');
    const b = Buffer.alloc(1);
    b.writeUInt8(bToken.length);
    return Buffer.concat([
      b,
      bToken
    ]);
  },

  deserialize: (r: CommandResponse) => ({
    userId: r.data.readUInt32LE(0)
  })
};
