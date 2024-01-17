
import type { CommandResponse } from '../../tcp.client.js';
import { serializeIdentifier, type Id } from '../identifier.utils.js';

export const DELETE_STREAM = {
  code: 203,

  serialize: (streamId: Id) => {
    return serializeIdentifier(streamId);
  },

  deserialize: (r: CommandResponse) => {
    return r.status === 0 && r.data.length === 0;
  }
};
