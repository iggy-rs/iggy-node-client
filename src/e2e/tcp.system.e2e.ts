
import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Client, SimpleClient, SingleClient } from '../client/client.js';

describe('e2e -> system', async () => {

  const c = new SingleClient({
    transport: 'TCP',
    options: { port: 8090, host: '127.0.0.1' },
    credentials: { username: 'iggy', password: 'iggy' }
  });

  // console.log(await c.session.login({ username: 'iggy', password: 'iggy' }));
  // console.log(await c.system.getStats());
  
  // PING
  it('e2e -> system::ping', async () => {
    assert.equal(await c.system.ping(), true);
  });

  // LOGIN
  await it('e2e -> system::login', async () => {
    assert.deepEqual(
      await c.session.login({ username: 'iggy', password: 'iggy' }),
      { userId: 1 }
    )
  });

  // GET_STATS
  await it('e2e -> system::getStat', async () => {
    assert.deepEqual(
      Object.keys(await c.system.getStats()),
      [
        'processId', 'cpuUsage', 'totalCpuUsage', 'memoryUsage', 'totalMemory',
        'availableMemory', 'runTime', 'startTime', 'readBytes', 'writtenBytes',
        'messagesSizeBytes', 'streamsCount', 'topicsCount', 'partitionsCount',
        'segmentsCount', 'messagesCount', 'clientsCount', 'consumersGroupsCount',
        'hostname', 'osName', 'osVersion', 'kernelVersion'
      ]
    );
  });

  // LOGOUT
  await it('e2e -> system::logout', async () => {
    assert.equal(await c.session.logout(), true);
  });

  // after(() => {
  //   c.destroy();
  // });

});
