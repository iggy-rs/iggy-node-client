
import { createClient, sendCommandWithResponse } from './tcp.client.js';
import { v7 } from './wire/uuid.utils.js';

import { LOGIN } from './wire/session/login.command.js';
import { SEND_MESSAGE } from './wire/message/send-message.command.js';
import { CREATE_TOPIC } from './wire/topic/create-topic.command.js';
import { CREATE_STREAM } from './wire/stream/create-stream.command.js';
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

  // SEND MESSAGE
  const cmdSm = SEND_MESSAGE.serialize(
    streamId, topicId,
    [{ id: v7(), payload: 'yolo msg' }]
  );
  const r1 = await sendCommandWithResponse(s)(SEND_MESSAGE.code, cmdSm);
  console.log('RESPONSE SEND_MESSAGE', SEND_MESSAGE.deserialize(r1));

  // GET OFFSET
  const gof = GET_OFFSET.serialize(streamId, topicId, { kind: 1, id: 1 }, partitionId);
  const rOff = await sendCommandWithResponse(s)(GET_OFFSET.code, gof);
  console.log('RESPONSE GET_OFFSET', GET_OFFSET.deserialize(rOff));

  // STORE OFFSET
  const sof = STORE_OFFSET.serialize(
    streamId, topicId, { kind: 1, id: 1 }, partitionId, 1n
  );
  const rsOff = await sendCommandWithResponse(s)(STORE_OFFSET.code, sof);
  console.log('RESPONSE STORE_OFFSET', STORE_OFFSET.deserialize(rsOff));


  // LOGOUT
  const rOut = await sendCommandWithResponse(s)(LOGOUT.code, LOGOUT.serialize());
  console.log('RESPONSE LOGOUT', LOGOUT.deserialize(rOut));


} catch (err) {
  console.error('FAILED!', err);
}
