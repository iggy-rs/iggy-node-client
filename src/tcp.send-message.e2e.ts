
import { createClient, sendCommandWithResponse } from './tcp.client.js';
import { v7 } from './wire/uuid.utils.js';

import { LOGIN } from './wire/session/login.command.js';
import { SEND_MESSAGES } from './wire/message/send-messages.command.js';
import { POLL_MESSAGES } from './wire/message/poll-messages.command.js';
import { CREATE_TOPIC } from './wire/topic/create-topic.command.js';
import { PURGE_TOPIC } from './wire/topic/purge-topic.command.js';
import { CREATE_STREAM } from './wire/stream/create-stream.command.js';
import { PURGE_STREAM } from './wire/stream/purge-stream.command.js';
import { GET_OFFSET } from './wire/offset/get-offset.command.js';
import { STORE_OFFSET } from './wire/offset/store-offset.command.js';
import { LOGOUT } from './wire/session/logout.command.js';


try {
  // create socket
  const s = await createClient('127.0.0.1', 8090);
  console.log('CLI', s.readyState);

  // LOGIN
  const loginCmd = LOGIN.serialize('iggy', 'iggy');
  console.log('LOGIN', loginCmd.toString());
  const r = await sendCommandWithResponse(s)(LOGIN.code, loginCmd);
  console.log('RESPONSE_login', r, r.toString(), LOGIN.deserialize(r));


  const streamId = 101;
  const topicId = 'test-topic-sm';
  const partitionId = 1;

  // // CREATE_STREAM
  // const createStreamCmd = CREATE_STREAM.serialize(streamId, 'test-send-message');
  // const r_createStream = await sendCommandWithResponse(s)(
  //   CREATE_STREAM.code, createStreamCmd
  // );
  // console.log('RESPONSE_createStream', CREATE_STREAM.deserialize(r_createStream));

  // // CREATE_TOPIC
  // const ctp = CREATE_TOPIC.serialize(
  //   streamId, 1, topicId, 3, 0, 0, 1
  // );
  // const r_createTopic = await sendCommandWithResponse(s)(CREATE_TOPIC.code, ctp);
  // console.log('RESPONSE_createTopic', CREATE_TOPIC.deserialize(r_createTopic));

  // SEND MESSAGES
  const cmdSm = SEND_MESSAGES.serialize(
    streamId, topicId,
    [{ id: v7(), payload: 'yolo msg' }]
  );
  const rSend = await sendCommandWithResponse(s)(SEND_MESSAGES.code, cmdSm);
  console.log('RESPONSE SEND_MESSAGE', SEND_MESSAGES.deserialize(rSend));

  // POLL MESSAGE
  const pollStrat = { kind: 5, value: 0n };
  const cmdPol = POLL_MESSAGES.serialize(
    streamId, topicId, { kind: 1, id: 1 }, 1, pollStrat, 2, false
  );
  const rPoll = await sendCommandWithResponse(s)(POLL_MESSAGES.code, cmdPol);
  console.log('RESPONSE POLL_MESSAGE', POLL_MESSAGES.deserialize(rPoll));

  // // GET OFFSET
  // const gof = GET_OFFSET.serialize(streamId, topicId, { kind: 1, id: 1 }, partitionId);
  // const rOff = await sendCommandWithResponse(s)(GET_OFFSET.code, gof);
  // console.log('RESPONSE GET_OFFSET', GET_OFFSET.deserialize(rOff));

  // // STORE OFFSET
  // const sof = STORE_OFFSET.serialize(
  //   streamId, topicId, { kind: 1, id: 1 }, partitionId, 1n
  // );
  // const rsOff = await sendCommandWithResponse(s)(STORE_OFFSET.code, sof);
  // console.log('RESPONSE STORE_OFFSET', STORE_OFFSET.deserialize(rsOff));

  // PURGE TOPIC
  const ptp = PURGE_TOPIC.serialize(streamId, topicId);
  const r_purgeTopic = await sendCommandWithResponse(s)(PURGE_TOPIC.code, ptp);
  console.log('RESPONSE_purgeTopic', PURGE_TOPIC.deserialize(r_purgeTopic));

  // PURGE STREAM
  const pst = PURGE_STREAM.serialize(streamId);
  const r_purgeStream = await sendCommandWithResponse(s)(PURGE_STREAM.code, pst);
  console.log('RESPONSE_purgeStream', PURGE_STREAM.deserialize(r_purgeStream));


  // LOGOUT
  const rOut = await sendCommandWithResponse(s)(LOGOUT.code, LOGOUT.serialize());
  console.log('RESPONSE LOGOUT', LOGOUT.deserialize(rOut));


} catch (err) {
  console.error('FAILED!', err);
}
