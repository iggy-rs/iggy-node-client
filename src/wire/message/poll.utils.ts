
import { type Id } from '../identifier.utils.js';
import { deserializeUUID, toDate } from '../serialize.utils.js';
import { serializeGetOffset, type Consumer } from '../offset/offset.utils.js';
import { deserializeHeaders, type HeadersMap } from './header.utils.js';

export enum PollingStrategyKind {
  Offset = 1,
  Timestamp = 2,
  First = 3,
  Last = 4,
  Next = 5
}

export type OffsetPollingStrategy = {
  kind: PollingStrategyKind.Offset,
  value: bigint
}

export type TimestampPollingStrategy = {
  kind: PollingStrategyKind.Timestamp,
  value: bigint
}

export type FirstPollingStrategy = {
  kind: PollingStrategyKind.First,
  value: 0n
}

export type LastPollingStrategy = {
  kind: PollingStrategyKind.Last,
  value: 0n
}

export type NextPollingStrategy = {
  kind: PollingStrategyKind.Next,
  value: 0n
}

export type PollingStrategy =
  OffsetPollingStrategy |
  TimestampPollingStrategy |
  FirstPollingStrategy |
  LastPollingStrategy |
  NextPollingStrategy;


export const serializePollMessages = (
  streamId: Id,
  topicId: Id,
  consumer: Consumer,
  partitionId: number,              // default to 1
  pollingStrategy: PollingStrategy, // default to OffsetPollingStrategy
  count = 10,
  autocommit = false,
) => {
  const b = Buffer.allocUnsafe(14);
  b.writeUInt8(pollingStrategy.kind, 0);
  b.writeBigUInt64LE(pollingStrategy.value, 1);
  b.writeUInt32LE(count, 9);
  b.writeUInt8(!!autocommit ? 1 : 0, 13);

  return Buffer.concat([
    serializeGetOffset(streamId, topicId, consumer, partitionId),
    b
  ]);
};

export enum MessageState {
  Available = 1,
  Unavailable = 10,
  Poisoned = 20,
  MarkedForDeletion = 30
};


export const mapMessageState = (s: number): string => {
  if (!(s in MessageState))
    throw new Error(`unknow MessageState: ${s}`);
  return MessageState[s];
}

export type PollMessage = {
  id: string,
  state: string,
  timestamp: Date,
  offset: bigint,
  headers: HeadersMap,
  payload: Buffer,
  checksum: number,
};

export const deserializePollMessages = (r: Buffer, pos = 0) => {
  const len = r.length;
  const partitionId = r.readUInt32LE(pos);
  const currentOffset = r.readBigUInt64LE(pos + 4);
  const messageCount = r.readUInt32LE(pos + 12);

  const messages: PollMessage[] = [];
  pos += 16;

  if (pos >= len) {
    console.log('WARN !!! deserializePollMessage::short-exit', pos, len);
    return {
      partitionId,
      currentOffset,
      messageCount,
      messages
    }
  }

  while (pos < len) {
    const offset = r.readBigUInt64LE(pos);
    const state = mapMessageState(r.readUInt8(pos + 8));
    const timestamp = toDate(r.readBigUInt64LE(pos + 9));
    const id = deserializeUUID(r.subarray(pos + 17, pos + 17 + 16));
    const checksum = r.readUInt32LE(pos + 33);
    const headersLength = r.readUInt32LE(pos + 37);
    const headers = deserializeHeaders(r.subarray(pos + 41, pos + 41 + headersLength));
    pos += headersLength;
    const messageLength = r.readUInt32LE(pos + 41)
    const payload = r.subarray(pos + 45, pos + 45 + messageLength);
    pos += 45 + messageLength;
    messages.push({
      id,
      state,
      timestamp,
      offset,
      headers,
      payload,
      checksum
    });
  }

  return {
    partitionId,
    currentOffset,
    messageCount,
    messages
  }
};
