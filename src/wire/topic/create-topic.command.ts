
import type { CommandResponse } from '../../tcp.client.js';
import { serializeIdentifier, type Id } from '../identifier.utils.js';

// export type CreateTopic = {
//   streamId: number | string,
//   topicId: number,
//   name: string,
//   partitionCount: number,
//   messageExpiry: number
// };


export const CREATE_TOPIC = {
  code: 302,

  serialize: (
    streamId: Id, topicId: number, name: string,
    partitionCount: number, messageExpiry = 0,
    maxTopicSize = 0, replicationFactor = 1
  ) => {
    const streamIdentifier = serializeIdentifier(streamId);
    const bName = Buffer.from(name)

    if (replicationFactor < 1 || replicationFactor > 255)
      throw new Error('Topic replication factor should be between 1 and 255');
    if (bName.length < 1 || bName.length > 255)
      throw new Error('Topic name should be between 1 and 255 bytes');

    const b = Buffer.allocUnsafe(4 + 4 + 4 + 8 + 1 + 1);
    b.writeUInt32LE(topicId, 0);
    b.writeUInt32LE(partitionCount, 4);
    b.writeUInt32LE(messageExpiry, 8); // 0 is unlimited ???
    b.writeBigUInt64LE(BigInt(maxTopicSize), 12); // optional, 0 is null
    b.writeUInt8(replicationFactor, 20); // must be > 0
    b.writeUInt8(bName.length, 21);

    return Buffer.concat([
      streamIdentifier,
      b,
      bName,
    ]);
  },

  deserialize: (r: CommandResponse) => {
    return r.status === 0 && r.data.length === 0;
  }
};
