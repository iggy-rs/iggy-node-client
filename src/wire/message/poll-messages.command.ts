
import type { Id } from '../identifier.utils.js';
import type { CommandResponse } from '../../tcp.client.js';
import type { Consumer } from '../offset/offset.utils.js';
import {
  serializePollMessages,
  deserializePollMessages,
  type PollingStrategy
} from './poll.utils.js';


export const POLL_MESSAGES = {
  code: 100,

  serialize: (
    streamId: Id,
    topicId: Id,
    consumer: Consumer,
    partitionId: number,
    pollingStrategy: PollingStrategy,
    count: number,
    autocommit: boolean,
  ) => {
    return serializePollMessages(
      streamId, topicId, consumer, partitionId, pollingStrategy, count, autocommit
    );
  },

  deserialize: (r: CommandResponse) => {
    return deserializePollMessages(r.data);
  }
};
