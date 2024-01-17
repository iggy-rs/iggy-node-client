
import type { CommandResponse } from '../../tcp.client.js';
import type { Id } from '../identifier.utils.js';
import { serializePartitionParams } from './partition.utils.js';


export const DELETE_PARTITION = {
  code: 403,
  serialize: (
    streamId: Id,
    topicId: Id,
    partitionCount: number,
  ) => {
    return serializePartitionParams(streamId, topicId, partitionCount);
  },
  deserialize: (r: CommandResponse) => {
    return r.status === 0 && r.data.length === 0;
  }
};
