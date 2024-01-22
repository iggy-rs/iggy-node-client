
import type { CommandResponse } from '../../tcp.client.js';
import { serializeIdentifier, type Id } from '../identifier.utils.js';
import { deserializeConsumerGroup } from './group.utils.js';

export const GET_GROUP = {
  code: 600,

  serialize: (streamId: Id, topicId: Id, groupId: Id) => {
    return Buffer.concat([
      serializeIdentifier(streamId),
      serializeIdentifier(topicId),
      serializeIdentifier(groupId)
    ]);
  },

  deserialize: (r: CommandResponse) => {
    return deserializeConsumerGroup(r.data);
  }
};
