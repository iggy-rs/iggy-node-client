
import { Readable, pipeline, PassThrough } from "node:stream";
import type { ClientConfig, RawClient } from "../client/client.type.js";
import type { Id } from '../wire/identifier.utils.js';
import { SimpleClient, rawClientGetter } from "../client/client.js";
import { type PollMessages, POLL_MESSAGES } from "../wire/message/poll-messages.command.js";
import { PollingStrategy, ConsumerKind, CommandAPI } from "../wire/index.js";


const wait = (interval: number, cb?: () => void): Promise<void> =>
  new Promise((resolve, reject) => {
    setTimeout(() => resolve(cb ? cb() : undefined), interval)
  });

async function* genAutoCommitedPoll(
  c: CommandAPI,
  poll: PollMessages,
  interval = 1000
) {
  const state: Map<string, number> = new Map();

  while (true) {
    const r = await c.message.poll(poll);
    yield r;

    const k = `${r.partitionId}`;
    let part = state.get(k) || 0;    
    part = r.messageCount;
    state.set(k, part);

    if (Array.from(state).every(([, last]) => last === 0)) {
      console.log('WAIT');
      await wait(interval);
    }
  }
};

async function* genPoll(
  c: RawClient,
  poll: PollMessages,
) {
  const pl = POLL_MESSAGES.serialize(poll);
  yield await c.sendCommand(POLL_MESSAGES.code, pl, false);
};



export const consumerStream = (config: ClientConfig) => async (
  poll: PollMessages,
  interval: 1000
): Promise<Readable> => {
  const c = await rawClientGetter(config);
  // const s = new SimpleClient(c);
  if (!c.isAuthenticated)
    await c.authenticate(config.credentials);
  const ps = Readable.from(genPoll(c, poll), { objectMode: true });
  
  return pipeline(
    ps,
    // c.getReadStream(),
    // handleResponseTransform(),
    // deserializePollMessagesTransform(),
    new PassThrough({ objectMode: true }),
    (err) => console.error('pipeline error', err)
  );
};

type ConsumerGroupStreamRequest = {
  groupId: number,
  streamId: Id,
  topicId: Id,
  pollingStrategy: PollingStrategy,
  count: number,
  interval: number
}

export const groupConsumerStream = (config: ClientConfig) => async ({
  groupId,
  streamId,
  topicId,
  pollingStrategy,
  count,
  interval = 1000
}: ConsumerGroupStreamRequest): Promise<Readable> => {
  const c = await rawClientGetter(config);
  const s = new SimpleClient(c);
  if (!c.isAuthenticated)
    await c.authenticate(config.credentials);

  try {
    await s.group.get({ streamId, topicId, groupId })
  } catch (err) {
    await s.group.create({ streamId, topicId, groupId, name: `auto-${groupId}` })
  }
  
  await s.group.join({ streamId, topicId, groupId });

  const poll = {
    streamId,
    topicId,
    consumer: { kind: ConsumerKind.Group, id: groupId },
    partitionId: 0,
    pollingStrategy,
    count,
    autocommit: true
  }
  const ps = Readable.from(genAutoCommitedPoll(s, poll, interval), { objectMode: true });
  return ps;
};

