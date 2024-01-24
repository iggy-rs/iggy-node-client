
import type { CommandResponse } from '../../tcp.client.js';
import { serializeIdentifier, type Id } from '../identifier.utils.js';
import { uint32ToBuf } from '../number.utils.js';

export const DELETE_TOPIC = {
  code: 303,

  serialize: (streamId: Id, topicId: Id, partitionsCount: number) => {
    return Buffer.concat([
      serializeIdentifier(streamId),
      serializeIdentifier(topicId),
      uint32ToBuf(partitionsCount)
    ]);
  },

  deserialize: (r: CommandResponse) => {
    return r.status === 0 && r.data.length === 0;
  }
};
