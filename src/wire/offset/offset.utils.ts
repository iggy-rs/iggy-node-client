
import { serializeIdentifier, type Id } from '../identifier.utils.js';

export enum ConsumerKind {
  Single = 1,
  Group = 2
}

export type Consumer = {
  kind: ConsumerKind,
  id: Id
}

export type OffsetResponse = {
  partitionId: number,
  currentOffset: bigint,
  storedOffset: bigint
};

export const serializeGetOffset = (
  streamId: Id,
  topicId: Id,
  consumer: Consumer,
  partitionId?: number
) => {

  if (consumer.kind === ConsumerKind.Single && (!partitionId || partitionId < 1))
    throw new Error('getOffset error: partitionId must be > 0 for single consumer kind');

  const streamIdentifier = serializeIdentifier(streamId);
  const topicIdentifier = serializeIdentifier(topicId);
  const consumerIdentifier = serializeIdentifier(consumer.id);

  const b1 = Buffer.alloc(1);
  b1.writeUInt8(consumer.kind);

  const b2 = Buffer.alloc(4);
  b2.writeUInt32LE(partitionId || 0);

  return Buffer.concat([
    b1,
    consumerIdentifier,
    streamIdentifier,
    topicIdentifier,
    b2
  ]);
};

export const serializeStoreOffset = (
  streamId: Id,
  topicId: Id,
  consumer: Consumer,
  partitionId: number,
  offset: bigint
) => {
  const b = Buffer.alloc(8);
  b.writeBigUInt64LE(offset, 0);

  return Buffer.concat([
    serializeGetOffset(streamId, topicId, consumer, partitionId),
    b
  ]);
}

