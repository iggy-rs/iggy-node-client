
import type { CommandResponse } from '../../tcp.client.js';
import { type Id } from '../identifier.utils.js';
import { serializeStoreOffset, type Consumer } from './offset.utils.js';

export const STORE_OFFSET = {
  code: 121,

  serialize: (
    streamId: Id,
    topicId: Id,
    consumer: Consumer,
    partitionId: number,
    offset: bigint
  ) => {
    return serializeStoreOffset(
      streamId, topicId, consumer, partitionId, offset
    );
  },

  deserialize: (r: CommandResponse) => {
    return r.status === 0 && r.length === 0;
  }
};
