
import { TcpClient } from './client/tcp.client.js';
import { login } from './wire/session/login.command.js';
import { logout } from './wire/session/logout.command.js';
import { createStream } from './wire/stream/create-stream.command.js';
import { updateStream } from './wire/stream/update-stream.command.js';
import { getStream } from './wire/stream/get-stream.command.js';
import { getStreams } from './wire/stream/get-streams.command.js';
import { deleteStream } from './wire/stream/delete-stream.command.js';
import { createTopic } from './wire/topic/create-topic.command.js';
import { updateTopic } from './wire/topic/update-topic.command.js';
import { getTopic } from './wire/topic/get-topic.command.js';
import { getTopics } from './wire/topic/get-topics.command.js';
import { deleteTopic } from './wire/topic/delete-topic.command.js';
import { createPartition } from './wire/partition/create-partition.command.js';
import { deletePartition } from './wire/partition/delete-partition.command.js';


try {
  // create socket
  const s = TcpClient({ host: '127.0.0.1', port: 8090 });

  // LOGIN
  const r = await login(s)({ username: 'iggy', password: 'iggy' });
  console.log('RESPONSE_login', r);

  const stream = {
    name: 'test-stream',
    streamId: 1
  };

  // CREATE_STREAM
  const r_createStream = await createStream(s)(stream);
  console.log('RESPONSE_createStream', r_createStream);

  // GET_STREAM #ID
  const r7 = await getStream(s)({ streamId: stream.streamId });
  console.log('RESPONSE7', r7);

  // GET_STREAM #NAME
  const r8 = await getStream(s)({ streamId: stream.name });
  console.log('RESPONSE8', r8);

  // UPDATE_STREAM
  const r_updateStream = await updateStream(s)({
    streamId: stream.streamId, name: 'updatedStreamName'
  });
  console.log('RESPONSE_updateStream', r_updateStream);

  // GET_STREAMS
  const r9 = await getStreams(s)();
  console.log('RESPONSE9', r9);

  const topic1 = {
    streamId: stream.streamId,
    topicId: 44,
    name: 'topic-name-44',
    partitionCount: 3,
    messageExpiry: 0,
    maxTopicSize: 0,
    replicationFactor: 1
  };

  // CREATE_TOPIC
  const r_createTopic = await createTopic(s)(topic1);
  console.log('RESPONSE_createTopic', r_createTopic);

  // GET_TOPIC
  const t2 = await getTopic(s)({ streamId: topic1.streamId, topicId: topic1.name });
  console.log('RESPONSE_getTopic', t2);

  // UPDATE_TOPIC
  const r_updateTopic = await updateTopic(s)({
    streamId: topic1.streamId, topicId: topic1.topicId, name: topic1.name, messageExpiry: 42
  });
  console.log('RESPONSE_updateTopic', r_updateTopic);

  // CREATE_PARTITION
  const r_createPartition = await createPartition(s)({
    streamId: topic1.streamId, topicId: t2.id, partitionCount: 22
  });
  console.log('RESPONSE_createPartition', r_createPartition);

  // DELETE_PARTITION
  const r_deletePartition = await deletePartition(s)({
    streamId: topic1.streamId, topicId: t2.id, partitionCount: 19
  });
  console.log('RESPONSE_deletePartition', r_deletePartition);

  // GET_TOPIC AGAIN
  const r_getTopic2 = await getTopic(s)({ streamId: topic1.streamId, topicId: topic1.name });
  console.log('RESPONSE_getTopic2', r_getTopic2);

  // GET_TOPICS
  const r_getTopics = await getTopics(s)({ streamId: topic1.streamId });
  console.log('RESPONSE_getTopics', r_getTopics);

  // DELETE TOPIC
  const r_deleteTopic = await deleteTopic(s)({
    streamId: topic1.streamId, topicId: t2.id, partitionsCount: 3
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
