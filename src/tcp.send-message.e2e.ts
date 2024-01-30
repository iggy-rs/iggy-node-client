
import { v7 } from './wire/uuid.utils.js';
import { TcpClient } from './client/tcp.client.js';

import { login } from './wire/session/login.command.js';
import { logout } from './wire/session/logout.command.js';
import { sendMessages } from './wire/message/send-messages.command.js';
import { pollMessages } from './wire/message/poll-messages.command.js';
import { createTopic } from './wire/topic/create-topic.command.js';
import { deleteTopic } from './wire/topic/delete-topic.command.js';
import { purgeTopic } from './wire/topic/purge-topic.command.js';
import { createStream } from './wire/stream/create-stream.command.js';
import { deleteStream } from './wire/stream/delete-stream.command.js';
import { purgeStream } from './wire/stream/purge-stream.command.js';
import { getOffset } from './wire/offset/get-offset.command.js';
import { storeOffset } from './wire/offset/store-offset.command.js';


try {
  // create socket
  const s = TcpClient({ host: '127.0.0.1', port: 8090 });

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
  const r_createStream = await createStream(s)(stream);
  console.log('RESPONSE_createStream', r_createStream);

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
  const r_createTopic = await createTopic(s)(topic1);
  console.log('RESPONSE_createTopic', r_createTopic);

  const msg = {
    streamId,
    topicId,
    messages: [{ id: v7(), payload: 'yolo msg' }]
  };

  // SEND MESSAGES
  const rSend = await sendMessages(s)(msg);
  console.log('RESPONSE SEND_MESSAGE', rSend);

  // POLL MESSAGE
  const pollStrat = { kind: 5, value: 0n };
  const pollReq = {
    streamId,
    topicId,
    consumer: { kind: 1, id: 1 },
    partitionId,
    pollingStrategy: pollStrat,
    count: 2,
    autocommit: false
  };

  const rPoll = await pollMessages(s)(pollReq);
  console.log('RESPONSE POLL_MESSAGE', rPoll);

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

  // PURGE STREAM
  const r_purgeStream = await purgeStream(s)({ streamId });
  console.log('RESPONSE_purgeStream', r_purgeStream);

  // DELETE TOPIC
  const r_deleteTopic = await deleteTopic(s)({
    streamId, topicId, partitionsCount: topic1.partitionCount
  });
  console.log('RESPONSE_deleteTopic', r_deleteTopic);

  // DELETE STREAM
  const rDelS = await deleteStream(s)({ streamId: stream.streamId });
  console.log('RESPONSEDelS', rDelS);

  // LOGOUT
  const rOut = await logout(s)();
  console.log('RESPONSE LOGOUT', rOut);

} catch (err) {
  console.error('FAILED!', err);
}
