
import type { CommandResponse } from '../../tcp.client.js';
import { serializeIdentifier, type Id } from '../identifier.utils.js';
import { uint8ToBuf, uint32ToBuf } from '../number.utils.js';
import { serializePermissions, type UserPermissions } from './permissions.utils.js';

// export type CreateUser = {
//   id: number,
//   username: string,
//   password: string,
//   status: UserStatus
//   permissions: UserPermissions
// };

export enum UserStatus {
  Active = 1,
  Inactive = 2,
}

export const CREATE_USER = {
  code: 33,

  serialize: (
    username: string,
    password: string,
    status: UserStatus,
    permissions?: UserPermissions
  ) => {
    const bUsername = Buffer.from(username);
    const bPassword = Buffer.from(password);

    if (bUsername.length < 1 || bUsername.length > 255)
      throw new Error('User username should be between 1 and 255 bytes');

    if (bPassword.length < 1 || bPassword.length > 255)
      throw new Error('User password should be between 1 and 255 bytes');

    const b1 = uint8ToBuf(bUsername.length);
    const b2 = uint8ToBuf(bPassword.length);
    const bStatus = uint8ToBuf(status);

    const bPermissions = serializePermissions(permissions);

    return Buffer.concat([
      b1,
      bUsername,
      b2,
      bPassword,
      bStatus,
      bPermissions
    ]);
  },

  deserialize: (r: CommandResponse) => {
    return r.status === 0 && r.data.length === 0;
  }
};
