
import type { CommandResponse } from '../../client/client.type.js';
import { serializeIdentifier, type Id } from '../identifier.utils.js';
import { deserializeConsumerGroups } from './group.utils.js';

export const GET_GROUPS = {
  code: 601,

  serialize: (streamId: Id, topicId: Id) => {
    return Buffer.concat([
      serializeIdentifier(streamId),
      serializeIdentifier(topicId),
    ]);
  },

  deserialize: (r: CommandResponse) => {
    return deserializeConsumerGroups(r.data);
  }
};
