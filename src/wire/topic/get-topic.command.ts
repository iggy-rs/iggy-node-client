
import type { CommandResponse } from '../../tcp.client.js';
import { serializeIdentifier } from '../identifier.utils.js';
import { deserializeTopic } from './topic.utils.js';

type id = number | string;

export const GET_TOPIC = {
  code: 300,

  serialize: (streamId: id, topicId: id) => {
    return Buffer.concat([
      serializeIdentifier(streamId),
      serializeIdentifier(topicId)
    ]);
  },

  deserialize: (r: CommandResponse) => {
    return deserializeTopic(r.data).data;
  }
};
