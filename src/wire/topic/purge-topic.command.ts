
import type { CommandResponse } from '../../tcp.client.js';
import { serializeIdentifier, type Id } from '../identifier.utils.js';

export const PURGE_TOPIC = {
  code: 305,

  serialize: (streamId: Id, topicId: Id) => {
    return Buffer.concat([
      serializeIdentifier(streamId),
      serializeIdentifier(topicId),
    ]);
  },

  deserialize: (r: CommandResponse) => {
    return r.status === 0 && r.data.length === 0;
  }
};
