
import type { CommandResponse } from '../../tcp.client.js';
import { serializeIdentifier, type Id } from '../identifier.utils.js';
import { deserializeTopic } from './topic.utils.js';


export const GET_TOPIC = {
  code: 300,

  serialize: (streamId: Id, topicId: Id) => {
    return Buffer.concat([
      serializeIdentifier(streamId),
      serializeIdentifier(topicId)
    ]);
  },

  deserialize: (r: CommandResponse) => {
    return deserializeTopic(r.data).data;
  }
};
