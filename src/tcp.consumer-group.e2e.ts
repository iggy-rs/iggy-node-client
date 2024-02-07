
import { TcpClient } from './client/tcp.client.js';
import { login } from './wire/session/login.command.js';
import { logout } from './wire/session/logout.command.js';
import { createGroup } from './wire/consumer-group/create-group.command.js';
import { joinGroup } from './wire/consumer-group/join-group.command.js';
import { getGroup } from './wire/consumer-group/get-group.command.js';
import { getGroups } from './wire/consumer-group/get-groups.command.js';
import { leaveGroup } from './wire/consumer-group/leave-group.command.js';
import { deleteGroup } from './wire/consumer-group/delete-group.command.js';
import { createTopic } from './wire/topic/create-topic.command.js';
import { deleteTopic } from './wire/topic/delete-topic.command.js';
import { purgeTopic } from './wire/topic/purge-topic.command.js';
import { createStream } from './wire/stream/create-stream.command.js';
import { deleteStream } from './wire/stream/delete-stream.command.js';
import { sendSomeMessages } from './tcp.sm.utils.js';
import { ConsumerKind } from './wire/offset/offset.utils.js';
import { PollingStrategy } from './wire/message/poll.utils.js';
import { pollMessages } from './wire/message/poll-messages.command.js';
import { Partitioning } from './wire/message/partitioning.utils.js';
// import { getStats } from './wire/system/get-stats.command.js';

try {
  // create socket
  const s = TcpClient({ host: '127.0.0.1', port: 8090 });

  // LOGIN
  const r = await login(s)({ username: 'iggy', password: 'iggy' });
  console.log('RESPONSE_login', r);


  const streamId = 1;
  const topicId = 'test-topic-cg';

  const stream = {
    name: 'test-stream-cg',
    streamId
  };

  // // CREATE_STREAM
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

  // // CREATE_TOPIC
  // const r_createTopic = await createTopic(s)(topic1);
  // console.log('RESPONSE_createTopic', r_createTopic);

  const groupId = 3;
  const name = 'cg-2';
  const group = { streamId, topicId, groupId, name };

  // // CREATE GROUP
  // const cg = await createGroup(s)(group)
  // console.log('RESPONSE_createGroup', cg);

  // GET GROUP
  const gg = await getGroup(s)({streamId, topicId, groupId});
  console.log('RESPONSE_getGroup', gg);

  const sr = await sendSomeMessages(s)(streamId, topicId, Partitioning.Balanced);

  // JOIN GROUP
  const jg = await joinGroup(s)({streamId, topicId, groupId});
  console.log('RESPONSE_joinGroup', jg);


  // POLL MESSAGE
  const pollReq = {
    streamId,
    topicId,
    consumer: { kind: ConsumerKind.Group, id: groupId },
    partitionId: 0,
    pollingStrategy: PollingStrategy.Last,
    count: 20,
    autocommit: true
  };

  const rPoll = await pollMessages(s)(pollReq);
  console.log('RESPONSE POLL_MESSAGE', rPoll);
  const { messages, ...resp } = rPoll;
  const m = messages.map(
    m => ({ id: m.id, headers: m.headers, payload: m.payload.toString() })
  );
  console.log('RESPONSE POLL_MESSAGE', resp, JSON.stringify(m, null, 2));

  
    // GET GROUPS
  const lg = await getGroups(s)({streamId, topicId});
  console.log('RESPONSE_getGroups', lg);

  // LEAVE GROUP
  const leave = await leaveGroup(s)({streamId, topicId, groupId});
  console.log('RESPONSE_leaveGroups', leave);
  

  
  // LOGOUT
  const rOut = await logout(s)();
  console.log('RESPONSE LOGOUT', rOut);

} catch (err) {
  console.error('FAILED!', err);
}

process.exit(0);

