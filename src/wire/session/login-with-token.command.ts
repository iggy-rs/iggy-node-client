
import type { CommandResponse } from '../../client/client.type.js';
import { wrapCommand } from '../command.utils.js';

export type LoginWithToken = {
  token: string
};

export type LoginResponse = {
  userId: number
}

export const LOGIN_WITH_TOKEN = {
  code: 44,

  serialize: ({token}: LoginWithToken) => {
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

export const login = wrapCommand<LoginWithToken, LoginResponse>(LOGIN_WITH_TOKEN);
