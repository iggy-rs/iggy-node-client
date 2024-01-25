
import type { CommandResponse } from '../../tcp.client.js';
import { serializeIdentifier, type Id } from '../identifier.utils.js';

// export type CreateTopic = {
//   streamId: number | string,
//   topicId: number,
//   name: string,
//   partitionCount: number,
//   messageExpiry: number
// };

export const UPDATE_TOPIC = {
  code: 304,

  serialize: (
    streamId: Id,
    topicId: Id,
    name: string,
    messageExpiry = 0,
    maxTopicSize = 0,
    replicationFactor = 1,

  ) => {
    const streamIdentifier = serializeIdentifier(streamId);
    const topicIdentifier = serializeIdentifier(topicId);
    const bName = Buffer.from(name)

    if (bName.length < 1 || bName.length > 255)
      throw new Error('Topic name should be between 1 and 255 bytes');

    const b = Buffer.allocUnsafe(4 + 8 + 1 + 1);
    b.writeUInt32LE(messageExpiry, 0); // 0 is unlimited ???
    b.writeBigUInt64LE(BigInt(maxTopicSize), 4); // optional, 0 is null
    b.writeUInt8(replicationFactor, 12); // must be > 0
    b.writeUInt8(bName.length, 13);

    return Buffer.concat([
      streamIdentifier,
      topicIdentifier,
      b,
      bName,
    ]);
  },

  deserialize: (r: CommandResponse) => {
    return r.status === 0 && r.data.length === 0;
  }
};
