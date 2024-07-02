
import { consumerStream, groupConsumerStream } from './stream/consumer-stream.js';
import { PollingStrategy, ConsumerKind, Partitioning } from './wire/index.js';

import { Client } from './client/index.js';
import { sendSomeMessages } from './tcp.sm.utils.js';

try {

  const credentials = { username: 'iggy', password: 'iggy' };
  const opt = {
    transport: 'TCP' as const,
    options: { port: 8090, host: '127.0.0.1' },
    credentials
  };

  const streamId = 1;
  const topicId = 'test-topic-cg';
  // const part = 1;
  const groupId = 12;
  
  // send some messages
  const c = new Client(opt);
  const r = await c.session.login({ username: 'iggy', password: 'iggy' });
  console.log('RESPONSE_login', r);
    
  // await c.topic.create({
  //   streamId ,topicId: 123, name: topicId, partitionCount: 3, compressionAlgorithm: 1
  // });
  // await c.topic.purge({streamId ,topicId});
  
  // console.log(
  //   'OFFSET',
  //   await c.offset.get({streamId, topicId, consumer:{id: groupId, kind: 2 as const}, partitionId: 1})
  // );
  
  // await c.offset.store({streamId, topicId, consumer:{id: groupId, kind: 2 as const}, partitionId: 0, offset: 0n});
  
  await sendSomeMessages(c.clientProvider)(
    streamId, topicId, Partitioning.MessageKey('k-1')
  );
  await sendSomeMessages(c.clientProvider)(
    streamId, topicId, Partitioning.MessageKey('k-2')
  );
  await sendSomeMessages(c.clientProvider)(
    streamId, topicId, Partitioning.MessageKey('k-3')
  );
  await sendSomeMessages(c.clientProvider)(
    streamId, topicId, Partitioning.MessageKey('k-4')
  );
  await sendSomeMessages(c.clientProvider)(
    streamId, topicId, Partitioning.MessageKey('k-5')
  );
  await sendSomeMessages(c.clientProvider)(
    streamId, topicId, Partitioning.MessageKey('k-2')
  );

  // // POLL MESSAGE
  // const pollReq = {
  //   streamId,
  //   topicId,
  //   consumer: { kind: ConsumerKind.Single, id: 1 },
  //   partitionId: part,
  //   pollingStrategy: PollingStrategy.First,
  //   count: 100,
  //   autocommit: true
  // };

  // // readable stream
  // const pollStream = consumerStream(opt);
  // const s = await pollStream(pollReq, 1000);

    // POLL MESSAGE
  const pollReq = {
    groupId,
    streamId,
    topicId,
    // partitionId: part,
    pollingStrategy: PollingStrategy.Next,
    count: 100,
    interval: 1000
    // autocommit: true
  };

  // readable stream
  const pollStream = groupConsumerStream(opt);
  const s = await pollStream(pollReq);

  s.on('data', (d) => {
    console.log('=>>DATA::', d.partitionId, d.currentOffset, d.messageCount, d.messages)
  });
  s.on('error', (err) => console.error('=>>Stream ERROR::', err));

  
} catch(err) {
  console.error(err);
}

// process.exit(0);
