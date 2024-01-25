
import { createClient, sendCommandWithResponse } from './tcp.client.js';

import { LOGIN } from './wire/session/login.command.js';
import { LOGOUT } from './wire/session/logout.command.js';
import { CREATE_STREAM } from './wire/stream/create-stream.command.js';
import { UPDATE_STREAM } from './wire/stream/update-stream.command.js';
import { GET_STREAM } from './wire/stream/get-stream.command.js';
import { GET_STREAMS } from './wire/stream/get-streams.command.js';
import { DELETE_STREAM } from './wire/stream/delete-stream.command.js';
import { CREATE_TOPIC } from './wire/topic/create-topic.command.js';
import { UPDATE_TOPIC } from './wire/topic/update-topic.command.js';
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

  const streamName = 'test-stream';
  const streamId = 1;

  // CREATE_STREAM
  const createStreamCmd = CREATE_STREAM.serialize(streamId, streamName);
  const r_createStream = await sendCommandWithResponse(s)(
    CREATE_STREAM.code, createStreamCmd
  );
  console.log('RESPONSE_createStream', CREATE_STREAM.deserialize(r_createStream));

  // GET_STREAM #ID
  const getStreamCmd = GET_STREAM.serialize(streamId);
  const r7 = await sendCommandWithResponse(s)(GET_STREAM.code, getStreamCmd);
  console.log('RESPONSE7', GET_STREAM.deserialize(r7));

  // GET_STREAM #NAME
  const getStreamCmd2 = GET_STREAM.serialize(streamName);
  const r8 = await sendCommandWithResponse(s)(GET_STREAM.code, getStreamCmd2);
  console.log('RESPONSE8', GET_STREAM.deserialize(r8));

  // UPDATE_STREAM
  const updateStreamCmd = UPDATE_STREAM.serialize(streamId, 'updatedStreamName');
  const r_updateStream = await sendCommandWithResponse(s)(
    UPDATE_STREAM.code, updateStreamCmd
  );
  console.log('RESPONSE_updateStream', UPDATE_STREAM.deserialize(r_updateStream));

  // GET_STREAMS
  const r9 = await sendCommandWithResponse(s)(GET_STREAMS.code, GET_STREAMS.serialize());
  console.log('RESPONSE9', GET_STREAMS.deserialize(r9));

  // CREATE_TOPIC
  const ctp = CREATE_TOPIC.serialize(
    streamId, 44, 'test-topic-44', 3, 0, 0, 1
  );
  const r_createTopic = await sendCommandWithResponse(s)(CREATE_TOPIC.code, ctp);
  console.log('RESPONSE_createTopic', CREATE_TOPIC.deserialize(r_createTopic));

  // GET_TOPIC
  const gtp = GET_TOPIC.serialize(streamId, 'test-topic-44');
  const r_getTopic = await sendCommandWithResponse(s)(GET_TOPIC.code, gtp);
  const t2 = GET_TOPIC.deserialize(r_getTopic);
  console.log('RESPONSE_getTopic', t2);

  // UPDATE_TOPIC
  const utp = UPDATE_TOPIC.serialize(
    streamId, 44, 'test-topic-44', 42
  );
  const r_updateTopic = await sendCommandWithResponse(s)(UPDATE_TOPIC.code, utp);
  console.log('RESPONSE_updateTopic', UPDATE_TOPIC.deserialize(r_updateTopic));

  // CREATE_PARTITION
  const cpa = CREATE_PARTITION.serialize(streamId, t2.id, 22);
  const r_createPartition = await sendCommandWithResponse(s)(CREATE_PARTITION.code, cpa);
  console.log('RESPONSE_createPartition', CREATE_PARTITION.deserialize(r_createPartition));

  // DELETE_PARTITION
  const dpa = DELETE_PARTITION.serialize(streamId, t2.id, 19);
  const r_deletePartition = await sendCommandWithResponse(s)(DELETE_PARTITION.code, dpa);
  console.log('RESPONSE_deletePartition', DELETE_PARTITION.deserialize(r_deletePartition));

  // GET_TOPIC AGAIN 
  const r_getTopic2 = await sendCommandWithResponse(s)(GET_TOPIC.code, gtp);
  console.log('RESPONSE_getTopic2', GET_TOPIC.deserialize(r_getTopic2));

  // GET_TOPICS 
  const gtps = GET_TOPICS.serialize(streamId);
  const r_getTopics = await sendCommandWithResponse(s)(GET_TOPICS.code, gtps);
  console.log('RESPONSE_getTopics', GET_TOPICS.deserialize(r_getTopics));

  // DELETE TOPIC
  const dtp = DELETE_TOPIC.serialize(streamId, t2.id, 3);
  const r_deleteTopic = await sendCommandWithResponse(s)(DELETE_TOPIC.code, dtp);
  console.log('RESPONSE_deleteTopic', DELETE_TOPIC.deserialize(r_deleteTopic));

  // DELETE STREAM
  const dst = DELETE_STREAM.serialize(streamId);
  const rDelS = await sendCommandWithResponse(s)(DELETE_STREAM.code, dst);
  console.log('RESPONSEDelS', DELETE_STREAM.deserialize(rDelS));

  // LOGOUT
  const rOut = await sendCommandWithResponse(s)(LOGOUT.code, LOGOUT.serialize());
  console.log('RESPONSE LOGOUT', LOGOUT.deserialize(rOut));


} catch (err) {
  console.error('FAILED!', err);
}
