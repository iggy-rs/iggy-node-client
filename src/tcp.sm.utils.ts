
import { v7 } from './wire/uuid.utils.js';
import { sendMessages, Partitioning, HeaderValue } from './wire/index.js';


import { ClientProvider } from './client/client.type.js';
import { Id } from './wire/identifier.utils.js';

const h0 = { 'foo': HeaderValue.Int32(42), 'bar': HeaderValue.Uint8(123) };
const h1 = { 'x-header-string-1': HeaderValue.String('incredible') };
const h2 = { 'x-header-bool': HeaderValue.Bool(false) };


const messages = [
  { payload: 'content with header', headers: h0 },
  { payload: 'content solo' },
  { payload: 'yolo msg' },
  { payload: 'yolo msg 2' },
  { payload: 'this is fuu', headers: h1 },
  { payload: 'this is bar', headers: h2 },
  { payload: 'yolo msg 3' },
  { payload: 'fuu again', headers: h1 },
  { payload: 'damnit', headers: h0 },
  { payload: 'yolo msg 4', Headers: h2 },
];

const someContent = () => messages[Math.floor(Math.random() * messages.length)]

const generateMessages = (count = 1) => {
  return [...Array(count)].map(e => ({ id: v7(), ...someContent() }));
}


export const sendSomeMessages = (s: ClientProvider) =>
  async (streamId: Id, topicId: Id, partition: Partitioning) => {

    const rSend = await sendMessages(s)({
      topicId, streamId, messages: generateMessages(50), partition
      // topicId, streamId, messages, partition
    });
    console.log('RESPONSE SEND_SOME_MESSAGE', rSend);
    return rSend;
  };
