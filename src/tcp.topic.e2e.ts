import { TcpClient } from './client/index.js';

import {
  login, logout,
  createTopic, createStream, deleteStream
} from './wire/index.js';



try {

  // create socket
  const cli = TcpClient({ host: '127.0.0.1', port: 8090 });
  const s = () => Promise.resolve(cli);

  const streamId = 1;
  const topicId = 3;

  // LOGIN
  const r = await login(s)({ username: 'iggy', password: 'iggy' });
  console.log('RESPONSE_login', r);

  // CREATE_STREAM
  const r_createStream = await createStream(s)({ streamId, name: 'test-topic-12' });
  console.log('RESPONSE_createStream', r_createStream);

  await createTopic(s)({
    streamId,
    topicId,
    name: 'test-topic-fuu',
    partitionCount: 0,
    compressionAlgorithm: 1,
    messageExpiry: 0,
    maxTopicSize: 0,
    replicationFactor: 1
  });

  // DELETE STREAM
  const rDelS = await deleteStream(s)({ streamId });
  console.log('RESPONSEDelS', rDelS);

  // LOGOUT
  const rOut = await logout(s)();
  console.log('RESPONSE LOGOUT', rOut);

} catch (err) {
  console.error('FAILED!', err);
}

process.exit(0);
