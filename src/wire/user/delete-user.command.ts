
import type { CommandResponse } from '../../tcp.client.js';
import { serializeIdentifier, type Id } from '../identifier.utils.js';

export const DELETE_USER = {
  code: 303,

  serialize: (userId: Id) => {
    return serializeIdentifier(userId);
  },

  deserialize: (r: CommandResponse) => {
    return r.status === 0 && r.data.length === 0;
  }
};
