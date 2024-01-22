
import type { CommandResponse } from '../../tcp.client.js';
import type { Id } from '../identifier.utils.js';
import { serializeGetOffset, type Consumer, type OffsetResponse } from './offset.utils.js';

export const GET_OFFSET = {
  code: 120,

  serialize: (
    streamId: Id,
    topicId: Id,
    consumer: Consumer,
    partitionId?: number
  ) => {
    return serializeGetOffset(streamId, topicId, consumer, partitionId);
  },

  deserialize: (r: CommandResponse): OffsetResponse => {
    const partitionId = r.data.readUInt32LE(0);
    const currentOffset = r.data.readBigUInt64LE(4);
    const storedOffset = r.data.readBigUInt64LE(12);

    return {
      partitionId,
      currentOffset,
      storedOffset
    }
  }
};
