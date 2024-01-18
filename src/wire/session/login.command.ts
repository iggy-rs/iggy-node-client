
import type { CommandResponse } from '../../tcp.client.js';

// LOGIN
export const LOGIN = {
  code: 38,

  serialize: (username: string, password: string) => {
    const bUsername = Buffer.from(username);
    const bPassword = Buffer.from(password);

    if (bUsername.length < 1 || bUsername.length > 255)
      throw new Error('username should not exceed 255 chars');
    if (bPassword.length < 1 || bPassword.length > 255)
      throw new Error('password name should not exceed 255 chars');

    const l1 = Buffer.alloc(1);
    const l2 = Buffer.alloc(1);
    l1.writeUInt8(bUsername.length);
    l2.writeUInt8(bPassword.length);

    return Buffer.concat([
      l1,
      bUsername,
      l2,
      bPassword
    ])
  },

  deserialize: (r: CommandResponse) => ({
    userId: r.data.readUInt32LE(0)
  })

};
