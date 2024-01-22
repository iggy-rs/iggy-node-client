
import { uint32ToBuf } from '../number.utils.js';
import { serializeHeaders, type Headers } from './header.utils.js';
import { serializeIdentifier, type Id } from '../identifier.utils.js';
import { serializePartitioning, type Partitioning } from './partitioning.utils.js';


export type CreateMessage = {
  id: string, // uuid
  headers?: Headers,
  payload: string | Buffer
};

// type Message = {
//   id: string, // uuid
//   headers: MessageHeaders
//   payload: string | Buffer,
// }

// type SendMessage = {
//   streamId: Id,
//   topicId: Id,
//   partitioning: Partitioning,
//   messages: CreateMessage[]
// }

export const serializeUUID = (id: string) => Buffer.from(id.replaceAll('-', ''), 'hex');

export const serializeMessage = (msg: CreateMessage) => {
  const { id, headers, payload } = msg;
  const bId = serializeUUID(id);
  const bHeaders = serializeHeaders(headers);
  const bPayload = 'string' === typeof payload ? Buffer.from(payload) : payload

  console.log('MSG::id', id, bId.toString('hex'));
  console.log('MSG::headers', headers, bHeaders.toString('hex'));
  console.log('MSG::payload', `"${payload}"`, bPayload.toString('hex'));

  return Buffer.concat([
    bId,
    bHeaders,
    uint32ToBuf(bPayload.length),
    bPayload
  ]);
};

export const serializeMessages = (messages: CreateMessage[]) => messages.reduce(
  (ac, c) => Buffer.concat([ac, serializeMessage(c)]),
  Buffer.alloc(0)
);

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

  console.log('SM::partitioning', partitioning, bPartitioning.toString('hex'));

  return Buffer.concat([
    streamIdentifier,
    topicIdentifier,
    bPartitioning,
    bMessages
  ]);
};
