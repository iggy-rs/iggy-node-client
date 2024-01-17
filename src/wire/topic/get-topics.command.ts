
import type { CommandResponse } from '../../tcp.client.js';
import { serializeIdentifier, type Id } from '../identifier.utils.js';
import { deserializeTopics } from './topic.utils.js';

export const GET_TOPICS = {
  code: 301,

  serialize: (streamId: Id) => {
    return serializeIdentifier(streamId);
  },

  deserialize: (r: CommandResponse) => {
    return deserializeTopics(r.data);
  }
};
