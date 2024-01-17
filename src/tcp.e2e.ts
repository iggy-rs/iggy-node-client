
import { createClient, sendCommandWithResponse } from './tcp.client.js';

import { LOGIN } from './wire/session/login.command.js';
import { LOGOUT } from './wire/session/logout.command.js';
import { CREATE_STREAM } from './wire/stream/create-stream.command.js';
import { GET_STREAM } from './wire/stream/get-stream.command.js';
import { GET_STREAMS } from './wire/stream/get-streams.command.js';
import { DELETE_STREAM } from './wire/stream/delete-stream.command.js';
import { CREATE_TOPIC } from './wire/topic/create-topic.command.js';
import { GET_TOPIC } from './wire/topic/get-topic.command.js';
import { GET_TOPICS } from './wire/topic/get-topics.command.js';
import { DELETE_TOPIC } from './wire/topic/delete-topic.command.js';
import { CREATE_PARTITION } from './wire/partition/create-partition.command.js';
import { DELETE_PARTITION } from './wire/partition/delete-partition.command.js';


try {
  // create socket
  const s = await createClient('127.0.0.1', 8090);
  console.log('CLI', s.readyState);

  // LOGIN
  const loginCmd = LOGIN.serialize('iggy', 'iggy');
  console.log('LOGIN', loginCmd.toString());
  const r = await sendCommandWithResponse(s)(LOGIN.code, loginCmd);
  console.log('RESPONSE_login', r, r.toString(), LOGIN.deserialize(r));

  // CREATE_STREAM
  const createStreamCmd = CREATE_STREAM.serialize(1, 'test-stream');
  const r_createStream = await sendCommandWithResponse(s)(
    CREATE_STREAM.code, createStreamCmd
  );
  console.log('RESPONSE_createStream', CREATE_STREAM.deserialize(r_createStream));

  // GET_STREAM #ID
  const getStreamCmd = GET_STREAM.serialize(1);
  const r7 = await sendCommandWithResponse(s)(GET_STREAM.code, getStreamCmd);
  console.log('RESPONSE7', GET_STREAM.deserialize(r7));

  // GET_STREAM #NAME
  const getStreamCmd2 = GET_STREAM.serialize('test-stream');
  const r8 = await sendCommandWithResponse(s)(GET_STREAM.code, getStreamCmd2);
  console.log('RESPONSE8', GET_STREAM.deserialize(r8));

  // GET_STREAMS
  const r9 = await sendCommandWithResponse(s)(GET_STREAMS.code, GET_STREAMS.serialize());
  console.log('RESPONSE9', GET_STREAMS.deserialize(r9));

  // CREATE_TOPIC
  const ctp = CREATE_TOPIC.serialize(
    1, 44, 'test-topic-44', 3, 0, 0, 1
  );
  const r_createTopic = await sendCommandWithResponse(s)(CREATE_TOPIC.code, ctp);
  console.log('RESPONSE_createTopic', CREATE_TOPIC.deserialize(r_createTopic));

  // GET_TOPIC
  const gtp = GET_TOPIC.serialize(1, 'test-topic-44');
  const r_getTopic = await sendCommandWithResponse(s)(GET_TOPIC.code, gtp);
  console.log('RESPONSE_getTopic', GET_TOPIC.deserialize(r_getTopic));

  // CREATE_PARTITION
  const cpa = CREATE_PARTITION.serialize(1, 'test-topic-44', 22);
  const r_createPartition = await sendCommandWithResponse(s)(CREATE_PARTITION.code, cpa);
  console.log('RESPONSE_createPartition', CREATE_PARTITION.deserialize(r_createPartition));

  // DELETE_PARTITION
  const dpa = DELETE_PARTITION.serialize(1, 'test-topic-44', 12);
  const r_deletePartition = await sendCommandWithResponse(s)(DELETE_PARTITION.code, dpa);
  console.log('RESPONSE_deletePartition', DELETE_PARTITION.deserialize(r_deletePartition));

  // GET_TOPIC AGAIN 
  const r_getTopic2 = await sendCommandWithResponse(s)(GET_TOPIC.code, gtp);
  console.log('RESPONSE_getTopic2', GET_TOPIC.deserialize(r_getTopic2));


  // GET_TOPICS 
  const gtps = GET_TOPICS.serialize('test-stream');
  const r_getTopics = await sendCommandWithResponse(s)(GET_TOPICS.code, gtps);
  console.log('RESPONSE_getTopics', GET_TOPICS.deserialize(r_getTopics));


  // // DELETE TOPIC
  // const dtp = DELETE_TOPIC.serialize(1, 'test-topic-44', 3);
  // const r_deleteTopic = await sendCommandWithResponse(s)(DELETE_TOPIC.code, dtp);
  // console.log('RESPONSE_deleteTopic', DELETE_TOPIC.deserialize(r_deleteTopic));

  // DELETE STREAM
  const dst = DELETE_STREAM.serialize(1);
  const rDelS = await sendCommandWithResponse(s)(DELETE_STREAM.code, dst);
  console.log('RESPONSEDelS', DELETE_STREAM.deserialize(rDelS));

  // LOGOUT
  const rOut = await sendCommandWithResponse(s)(LOGOUT.code, LOGOUT.serialize());
  console.log('RESPONSE LOGOUT', LOGOUT.desserialize(rOut));


} catch (err) {
  console.error('FAILED!', err);
}
