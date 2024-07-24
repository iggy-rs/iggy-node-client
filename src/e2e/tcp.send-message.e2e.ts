
import { after, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Client } from '../client/client.js';
import { v7 } from '../wire/uuid.utils.js';
import {
  ConsumerKind, PollingStrategy, Partitioning, HeaderValue
} from '../wire/index.js';

describe('e2e -> message', async () => {

  const c = new Client({
    transport: 'TCP',
    options: { port: 8090, host: '127.0.0.1' },
    credentials: { username: 'iggy', password: 'iggy' }
  });

  const streamId = 934;
  const topicId = 832;
  const partitionId = 1;

  const stream = {
    streamId,
    name: 'e2e-send-message-stream'
  };

  const topic = {
    streamId,
    topicId,
    name: 'e2e-send-message-topic',
    partitionCount: 1,
    compressionAlgorithm: 1
  };

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
    partition: Partitioning.PartitionId(partitionId)
  };

  await c.stream.create(stream);
  await c.topic.create(topic);

  it('e2e -> message::send', async () => {
    assert.ok(await c.message.send(msg));
  });

  it('e2e -> message::poll/last', async () => {
    const pollReq = {
      streamId,
      topicId,
      consumer: { kind: ConsumerKind.Single, id: 12 },
      partitionId,
      pollingStrategy: PollingStrategy.Last,
      count: 10,
      autocommit: false
    };
    const { messages, ...resp } = await c.message.poll(pollReq);
    assert.equal(messages.length, resp.messageCount);
    assert.equal(messages.length, msg.messages.length)
  });

  it('e2e -> message::poll/first', async () => {
    const pollReq = {
      streamId,
      topicId,
      consumer: { kind: ConsumerKind.Single, id: 12 },
      partitionId,
      pollingStrategy: PollingStrategy.First,
      count: 10,
      autocommit: false
    };
    const { messages, ...resp } = await c.message.poll(pollReq);
    assert.equal(messages.length, resp.messageCount);
    assert.equal(messages.length, msg.messages.length)
  });

  it('e2e -> message::poll/next', async () => {
    const pollReq = {
      streamId,
      topicId,
      consumer: { kind: ConsumerKind.Single, id: 12 },
      partitionId,
      pollingStrategy: PollingStrategy.Next,
      count: 10,
      autocommit: false
    };
    const { messages, ...resp } = await c.message.poll(pollReq);
    assert.equal(messages.length, resp.messageCount);
    assert.equal(messages.length, msg.messages.length)
  });

  // it('e2e -> message::poll/next+commit', async () => {
  //   const pollReq = {
  //     streamId,
  //     topicId,
  //     consumer: { kind: ConsumerKind.Single, id: 12 },
  //     partitionId,
  //     pollingStrategy: PollingStrategy.Next,
  //     count: 10,
  //     autocommit: true
  //   };
  //   const { messages, ...resp } = await c.message.poll(pollReq);
  //   assert.equal(messages.length, resp.messageCount);
  //   assert.equal(messages.length, msg.messages.length)
  //   const r2 = await c.message.poll(pollReq);
  //   console.log(r2);
  //   assert.equal(resp.messageCount, 0);
  //   assert.equal(messages.length, 6)
  // });
  
  it('e2e -> message::cleanup', async () => {
    assert.ok(await c.stream.delete(stream));
    assert.ok(await c.session.logout());
  });

  after(() => {
    c.destroy();
  });
});
