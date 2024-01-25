
import type { CommandResponse } from '../../tcp.client.js';
import { uint8ToBuf, uint32ToBuf, boolToBuf } from '../number.utils.js';
import { serializeIdentifier, type Id } from '../identifier.utils.js';
import { serializePermissions, type UserPermissions } from './permissions.utils.js';

// export type UpdatePermissions = {
//   id: number,
//   permissions: UserPermissions
// };

export const UPDATE_PERMISSIONS = {
  code: 36,

  serialize: (
    id: Id,
    permissions?: UserPermissions
  ) => {

    const bPermissions = serializePermissions(permissions);

    return Buffer.concat([
      serializeIdentifier(id),
      boolToBuf(!!permissions),
      uint32ToBuf(bPermissions.length),
      bPermissions
    ]);
  },

  deserialize: (r: CommandResponse) => {
    return r.status === 0 && r.data.length === 0;
  }
};
