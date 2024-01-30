
import { serializeIdentifier, type Id } from '../identifier.utils.js';
import { deserializeVoidResponse } from '../../client/client.utils.js';
import { wrapCommand } from '../command.utils.js';


export type UpdateTopic = {
  streamId: Id,
  topicId: Id,
  name: string,
  messageExpiry?: number,
  maxTopicSize?: number,
  replicationFactor?: number,
};

export const UPDATE_TOPIC = {
  code: 304,

  serialize: ({
    streamId,
    topicId,
    name,
    messageExpiry = 0,
    maxTopicSize = 0,
    replicationFactor = 1,
  }: UpdateTopic) => {
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

  deserialize: deserializeVoidResponse
};

export const updateTopic = wrapCommand<UpdateTopic, Boolean>(UPDATE_TOPIC);
