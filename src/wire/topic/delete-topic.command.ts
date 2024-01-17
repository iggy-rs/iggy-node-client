
import type { CommandResponse } from '../../tcp.client.js';
import { serializeIdentifier, type Id } from '../identifier.utils.js';

export const DELETE_TOPIC = {
  code: 303,

  serialize: (streamId: Id, topicId: Id, partitionsCount: number) => {
    const b = Buffer.alloc(4);
    b.writeUInt32LE(partitionsCount);
    return Buffer.concat([
      serializeIdentifier(streamId),
      serializeIdentifier(topicId),
      b
    ]);
  },

  deserialize: (r: CommandResponse) => {
    return r.status === 0 && r.data.length === 0;
  }
};
