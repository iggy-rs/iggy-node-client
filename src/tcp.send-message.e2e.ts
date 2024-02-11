
import { v7 } from './wire/uuid.utils.js';
import { TcpClient } from './client/tcp.client.js';

import { login } from './wire/session/login.command.js';
import { logout } from './wire/session/logout.command.js';
import { sendMessages, type SendMessages } from './wire/message/send-messages.command.js';
import { pollMessages } from './wire/message/poll-messages.command.js';
import { createTopic } from './wire/topic/create-topic.command.js';
import { deleteTopic } from './wire/topic/delete-topic.command.js';
import { purgeTopic } from './wire/topic/purge-topic.command.js';
import { createStream } from './wire/stream/create-stream.command.js';
import { deleteStream } from './wire/stream/delete-stream.command.js';
import { purgeStream } from './wire/stream/purge-stream.command.js';
import { getOffset } from './wire/offset/get-offset.command.js';
import { storeOffset } from './wire/offset/store-offset.command.js';
import { HeaderValue } from './wire/message/header.type.js';
import { ConsumerKind } from './wire/offset/offset.utils.js';
import { Partitioning } from './wire/message/partitioning.utils.js';
import { PollingStrategy } from './wire/message/poll.utils.js';


try {
  // create socket
  const cli = TcpClient({ host: '127.0.0.1', port: 8090 });
  const s = () => Promise.resolve(cli);

  // LOGIN
  const r = await login(s)({ username: 'iggy', password: 'iggy' });
  console.log('RESPONSE_login', r);

  const streamId = 101;
  const topicId = 'test-topic-sm';
  const partitionId = 1;

  const stream = {
    name: 'test-stream',
    streamId
  };

  // CREATE_STREAM
  // const r_createStream = await createStream(s)(stream);
  // console.log('RESPONSE_createStream', r_createStream);

  const topic1 = {
    streamId,
    topicId: 44,
    name: topicId,
    partitionCount: 3,
    messageExpiry: 0,
    maxTopicSize: 0,
    replicationFactor: 1
  };

  // CREATE_TOPIC
  // const r_createTopic = await createTopic(s)(topic1);
  // console.log('RESPONSE_createTopic', r_createTopic);

  const h0 = { 'foo': HeaderValue.Int32(42), 'bar': HeaderValue.Uint8(123) };
  const h1 = { 'x-header-string-1': HeaderValue.String('incredible') };
  const h2 = { 'x-header-bool': HeaderValue.Bool(false) };

  const msg = {
    streamId,
    topicId,
    messages: [
      { id: v7(), payload: 'content', headers: h0 },
      { id: v7(), payload: 'content' },
      { id: v7(), payload: 'yolo msg' },
      { id: v7(), payload: 'yolo msg 2' },
      { id: v7(), payload: 'this is fuu', headers: h1 },
      { id: v7(), payload: 'this is bar', headers: h2 },
    ],
    partition: Partitioning.PartitionId(1)
    // partition: Partitioning.Balanced
  };

  // SEND MESSAGES
  const rSend = await sendMessages(s)(msg);
  console.log('RESPONSE SEND_MESSAGE', rSend);

  // POLL MESSAGE
  const pollReq = {
    streamId,
    topicId,
    consumer: { kind: ConsumerKind.Single, id: 12 },
    partitionId,
    pollingStrategy: PollingStrategy.Last,
    count: 10,
    autocommit: false
  };

  const rPoll = await pollMessages(s)(pollReq);
  const { messages, ...resp } = rPoll;
  const m = messages.map(
    m => ({ id: m.id, headers: m.headers, payload: m.payload.toString() })
  );
  console.log('RESPONSE POLL_MESSAGE', rPoll);
  console.log('RESPONSE POLL_MESSAGE', resp, JSON.stringify(m, null, 2));

  // GET OFFSET
  const rOff = await getOffset(s)({
    streamId, topicId, consumer: { kind: 1, id: 1 }, partitionId
  });
  console.log('RESPONSE GET_OFFSET', rOff);

  // // STORE OFFSET
  // const rsOff = await storeOffset(s)({
  //   streamId, topicId, consumer: { kind: 1, id: 1 }, partitionId, offset: 1n
  // });
  // console.log('RESPONSE STORE_OFFSET', rsOff);

  // PURGE TOPIC
  const r_purgeTopic = await purgeTopic(s)({ streamId, topicId });
  console.log('RESPONSE_purgeTopic', r_purgeTopic);

  // // PURGE STREAM
  // const r_purgeStream = await purgeStream(s)({ streamId });
  // console.log('RESPONSE_purgeStream', r_purgeStream);

  // // DELETE TOPIC
  // const r_deleteTopic = await deleteTopic(s)({
  //   streamId, topicId, partitionsCount: topic1.partitionCount
  // });
  // console.log('RESPONSE_deleteTopic', r_deleteTopic);

  // DELETE STREAM
  // const rDelS = await deleteStream(s)({ streamId: stream.streamId });
  // console.log('RESPONSEDelS', rDelS);

  // LOGOUT
  const rOut = await logout(s)();
  console.log('RESPONSE LOGOUT', rOut);

} catch (err) {
  console.error('FAILED!', err);
}

process.exit(0);
