
import { serializeIdentifier, type Id } from '../identifier.utils.js';
import { deserializeVoidResponse } from '../../client/client.utils.js';
import { wrapCommand } from '../command.utils.js';
import { ValueOf } from '../../type.utils.js';

export const CompressionAlgorithmKind = {
  None: 1,
  Gzip: 2
};

export type CompressionAlgorithmKind = typeof CompressionAlgorithmKind;
export type CompressionAlgorithmKindId = keyof CompressionAlgorithmKind;
export type CompressionAlgorithmKindValue = ValueOf<CompressionAlgorithmKind>;

export type CompressionAlgorithmNone = CompressionAlgorithmKind['None'];
export type CompressionAlgorithmGzip = CompressionAlgorithmKind['Gzip'];
export type CompressionAlgorithm = CompressionAlgorithmNone | CompressionAlgorithmGzip;

export type CreateTopic = {
  streamId: Id,
  topicId: number,
  name: string,
  partitionCount: number,
  compressionAlgorithm: CompressionAlgorithm,
  messageExpiry?: number,
  maxTopicSize?: number,
  replicationFactor?: number
};

export const CREATE_TOPIC = {
  code: 302,
  serialize: ({
    streamId,
    topicId,
    name,
    partitionCount,
    compressionAlgorithm = CompressionAlgorithmKind.None,
    messageExpiry = 0,
    maxTopicSize = 0,
    replicationFactor = 1
  }: CreateTopic
  ) => {
    const streamIdentifier = serializeIdentifier(streamId);
    const bName = Buffer.from(name)
  
    if (replicationFactor < 1 || replicationFactor > 255)
      throw new Error('Topic replication factor should be between 1 and 255');
    if (bName.length < 1 || bName.length > 255)
      throw new Error('Topic name should be between 1 and 255 bytes');
  
    const b = Buffer.allocUnsafe(4 + 4 + 1 + 4 + 8 + 1 + 1);
    b.writeUInt32LE(topicId, 0);
    b.writeUInt32LE(partitionCount, 4);
    b.writeUInt8(compressionAlgorithm, 8);

    b.writeUInt32LE(messageExpiry, 9); // 0 is unlimited
    b.writeBigUInt64LE(BigInt(maxTopicSize), 13); // optional, 0 is null
    b.writeUInt8(replicationFactor, 21); // must be > 0
    b.writeUInt8(bName.length, 22);
  
    return Buffer.concat([
      streamIdentifier,
      b,
      bName,
    ]);
  },
  deserialize: deserializeVoidResponse
};

export const createTopic = wrapCommand<CreateTopic, Boolean>(CREATE_TOPIC);

// export const createTopic = (cli: Client) => async (arg: CreateTopic) => {
//   return CREATE_TOPIC.deserialize(
//     await cli.sendCommand(CREATE_TOPIC.code, CREATE_TOPIC.serialize(arg))
//   );
// }
