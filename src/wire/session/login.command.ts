
import type { CommandResponse } from '../../client/client.type.js';
import type { LoginResponse } from './login.type.js';
import { wrapCommand } from '../command.utils.js';


export type LoginCredentials = {
  username: string,
  password: string
}

// LOGIN
export const LOGIN = {
  code: 38,

  serialize: ({username, password}: LoginCredentials) => {
    const bUsername = Buffer.from(username);
    const bPassword = Buffer.from(password);

    if (bUsername.length < 1 || bUsername.length > 255)
      throw new Error('Username should be between 1 and 255 bytes');
    if (bPassword.length < 1 || bPassword.length > 255)
      throw new Error('Password should be between 1 and 255 bytes');

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

export const login = wrapCommand<LoginCredentials, LoginResponse>(LOGIN);
