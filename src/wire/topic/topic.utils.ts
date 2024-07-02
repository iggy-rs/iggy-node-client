
import { toDate } from '../serialize.utils.js';

export type BaseTopic = {
  id: number
  name: string,
  createdAt: Date,
  partitionsCount: number
  messageExpiry: bigint,
  maxTopicSize: bigint,
  replicationFactor: number
  sizeBytes: bigint,
  messagesCount: bigint,
};

export type Partition = {
  id: number,
  createdAt: Date,
  segmentsCount: number,
  currentOffset: bigint,
  sizeBytes: bigint,
  messagesCount: bigint
};

export type Topic = BaseTopic & { partitions: Partition[] };

type Serialized = { bytesRead: number };

type PartitionSerialized = { data: Partition } & Serialized;

type BaseTopicSerialized = { data: BaseTopic } & Serialized;

type TopicSerialized = { data: Topic } & Serialized;

export const deserializeBaseTopic = (p: Buffer, pos = 0): BaseTopicSerialized => {

  const id = p.readUInt32LE(pos);
  const createdAt = toDate(p.readBigUint64LE(pos + 4));
  const partitionsCount = p.readUInt32LE(pos + 12);
  const messageExpiry = p.readBigUInt64LE(pos + 16);
  const maxTopicSize = p.readBigUInt64LE(pos + 24);
  const replicationFactor = p.readUInt8(pos + 32);
  const sizeBytes = p.readBigUInt64LE(pos + 33);
  const messagesCount = p.readBigUInt64LE(pos + 41);

  const nameLength = p.readUInt8(pos + 49);
  const name = p.subarray(pos + 50, pos + 50 + nameLength).toString();

  return {
    bytesRead: 4 + 8 + 4 + 8 + 8 + 1 + 8 + 8 + 1 + nameLength,
    data: {
      id,
      name,
      createdAt,
      partitionsCount,
      maxTopicSize,
      replicationFactor,
      messageExpiry,
      messagesCount,
      sizeBytes,
    }
  }
};

export const deserializePartition = (p: Buffer, pos = 0): PartitionSerialized => {
  return {
    bytesRead: 4 + 8 + 4 + 8 + 8 + 8,
    data: {
      id: p.readUInt32LE(pos),
      createdAt: toDate(p.readBigUint64LE(pos + 4)),
      segmentsCount: p.readUInt32LE(pos + 12),
      currentOffset: p.readBigUint64LE(pos + 16),
      sizeBytes: p.readBigUint64LE(pos + 24),
      messagesCount: p.readBigUint64LE(pos + 24),
    }
  }
};


export const deserializeTopic = (p: Buffer, pos = 0): TopicSerialized => {
  const start = pos;
  const { bytesRead, data } = deserializeBaseTopic(p, pos);
  pos += bytesRead;
  const partitions = [];
  const end = p.length;
  while (pos < end) {
    const { bytesRead, data } = deserializePartition(p, pos);
    partitions.push(data);
    pos += bytesRead;
  }
  return { bytesRead: pos - start, data: { ...data, partitions } };
};


export const deserializeTopics = (p: Buffer, pos = 0): Topic[] => {
  const topics = [];
  const len = p.length;
  while (pos < len) {
    const { bytesRead, data } = deserializeTopic(p, pos);
    topics.push(data);
    pos += bytesRead;
  }
  return topics;
};
