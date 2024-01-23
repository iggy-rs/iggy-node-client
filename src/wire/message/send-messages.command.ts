
import type { CommandResponse } from '../../tcp.client.js';
import { type Id } from '../identifier.utils.js';
import { serializeSendMessages, type CreateMessage } from './message.utils.js';
import type { Partitioning } from './partitioning.utils.js';


export const SEND_MESSAGES = {
  code: 101,

  serialize: (
    streamId: Id,
    topicId: Id,
    messages: CreateMessage[],
    partition?: Partitioning,
  ) => {
    return serializeSendMessages(streamId, topicId, messages, partition);
  },

  deserialize: (r: CommandResponse) => {
    return r.status === 0 && r.data.length === 0;
  }
};
