
import type { CommandResponse } from '../../tcp.client.js';
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
    permissions: UserPermissions
  ) => {

    const bId = serializeIdentifier(id);
    const bPermissions = serializePermissions(permissions);

    return Buffer.concat([
      bId,
      bPermissions
    ]);
  },

  deserialize: (r: CommandResponse) => {
    return r.status === 0 && r.data.length === 0;
  }
};
