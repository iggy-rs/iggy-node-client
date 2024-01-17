
import type { CommandResponse } from '../../tcp.client.js';
import type { Id } from '../identifier.utils.js';
import { serializePartitionParams } from './partition.utils.js';

export const CREATE_PARTITION = {
  code: 402,
  serialize: (streamId: Id, topicId: Id, partitionCount = 1) => {
    return serializePartitionParams(streamId, topicId, partitionCount);
  },
  deserialize: (r: CommandResponse) => {
    return r.status === 0 && r.data.length === 0;
  }
};
