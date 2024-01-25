
import type { CommandResponse } from '../../tcp.client.js';
import { serializeIdentifier, type Id } from '../identifier.utils.js';

// export type ChangePassword = {
//   id: number,
//   currentPassword: string,
//   newPassword: string,
// };


export const CHANGE_PASSWORD = {
  code: 37,

  serialize: (
    id: Id,
    currentPassword: string,
    newPassword: string,
  ) => {

    const bId = serializeIdentifier(id);
    const bCur = Buffer.from(currentPassword);
    const bNew = Buffer.from(newPassword);

    if (bCur.length < 1 || bCur.length > 255)
      throw new Error('User password should be between 1 and 255 bytes (current)');

    if (bNew.length < 1 || bNew.length > 255)
      throw new Error('User password should be between 1 and 255 bytes (new)');

    return Buffer.concat([
      bId,
      bCur,
      bNew
    ]);
  },

  deserialize: (r: CommandResponse) => {
    return r.status === 0 && r.data.length === 0;
  }
};
