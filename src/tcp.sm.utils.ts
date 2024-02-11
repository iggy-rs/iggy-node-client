
import { v7 } from './wire/uuid.utils.js';
import { sendMessages } from './wire/message/send-messages.command.js';
import { HeaderValue } from './wire/message/header.type.js';
import { Partitioning } from './wire/message/partitioning.utils.js';
import { ClientProvider } from './client/client.type.js';
import { Id } from './wire/identifier.utils.js';

const h0 = { 'foo': HeaderValue.Int32(42), 'bar': HeaderValue.Uint8(123) };
const h1 = { 'x-header-string-1': HeaderValue.String('incredible') };
const h2 = { 'x-header-bool': HeaderValue.Bool(false) };


const messages = [
  { id: v7(), payload: 'content with header', headers: h0 },
  { id: v7(), payload: 'content solo' },
  { id: v7(), payload: 'yolo msg' },
  { id: v7(), payload: 'yolo msg 2' },
  { id: v7(), payload: 'this is fuu', headers: h1 },
  { id: v7(), payload: 'this is bar', headers: h2 },
  { id: v7(), payload: 'yolo msg 3' },
  { id: v7(), payload: 'fuu again', headers: h1 },
  { id: v7(), payload: 'damnit', headers: h0 },
  { id: v7(), payload: 'yolo msg 4', Headers: h2 },
];


export const sendSomeMessages = (s: ClientProvider) =>
  async (streamId: Id, topicId: Id, partition = Partitioning.Balanced) => {

    // SEND MESSAGES
    const rSend = await sendMessages(s)({
      topicId, streamId, messages, partition
    });
    console.log('RESPONSE SEND_SOME_MESSAGE', rSend);
    return rSend;
  };
