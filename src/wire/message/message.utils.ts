
import Debug from 'debug';
import { uint32ToBuf } from '../number.utils.js';
import { serializeHeaders, type Headers } from './header.utils.js';
import { serializeIdentifier, type Id } from '../identifier.utils.js';
import { serializePartitioning, type Partitioning } from './partitioning.utils.js';
import { parse as parseUUID } from '../uuid.utils.js';

const debug = Debug('iggy:client');

// export type MessageId = 0 | 0n | string; // uuid
export type MessageId = number | bigint | string; // uuid

export type CreateMessage = {
  id?: MessageId, 
  headers?: Headers,
  payload: string | Buffer
};

export const serializeMessageId = (id?: MessageId) => {
  if(id === undefined || id === 0 || id === 0n) {
    return Buffer.alloc(16, 0);
  }

  if('string' !== typeof id)
    throw new Error(`invalid message id: '${id}' (use uuid string or 0)`)
  
  try {
    const uuid = parseUUID(id);
    return Buffer.from(uuid.toHex(), 'hex');
  } catch (err) {
    throw new Error(`invalid message id: '${id}' (use uuid string or 0)`, { cause: err })
  }
}

export const serializeMessage = (msg: CreateMessage) => {
  const { id, headers, payload } = msg;
  const bId = serializeMessageId(id);
  const bHeaders = serializeHeaders(headers);
  const bPayload = 'string' === typeof payload ? Buffer.from(payload) : payload
  const bLen = uint32ToBuf(bPayload.length);
  
  const r = Buffer.concat([
    bId,
    bHeaders, // size included
    bLen,
    bPayload
  ]);

  debug(
    'id', bId.length, bId.toString('hex'),
    'headers', bHeaders.length, bHeaders.toString('hex'),
    'binLength', bLen.length, bLen.toString('hex'),
    'payload', bPayload.length, bPayload.toString('hex'),
  );
  
  return r;
};

export const serializeMessages = (messages: CreateMessage[]) =>
  Buffer.concat(messages.map(c => serializeMessage(c)));

export const serializeSendMessages = (
  streamId: Id,
  topicId: Id,
  messages: CreateMessage[],
  partitioning?: Partitioning,
) => {
  const streamIdentifier = serializeIdentifier(streamId);
  const topicIdentifier = serializeIdentifier(topicId);
  const bPartitioning = serializePartitioning(partitioning);
  const bMessages = serializeMessages(messages);

  return Buffer.concat([
    streamIdentifier,
    topicIdentifier,
    bPartitioning,
    bMessages
  ]);
};
