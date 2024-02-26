
import { createTcpSocket } from './client/tcp.client.js';
import { handleResponse } from './client/index.js';
import { LOGIN, logout, GET_USERS, GET_STREAMS } from './wire/index.js';

try {
  // create socket
  const s = await createTcpSocket({ host: '127.0.0.1', port: 8090 });

  // LOGIN
  const log = LOGIN.serialize({ username: 'iggy', password: 'iggy' });
  const logr = await s.sendCommand(LOGIN.code, log);
  const r = LOGIN.deserialize(logr);
  console.log('RESPONSE_login', r);

  s.on('data', (d) => console.log('=>>DATA!!', d, d.length, handleResponse(d)));
  s.on('error', (err) => console.error('=>>SOCKET ERROR!!', err));

  // TLDR: this is not officialy supported (but somehow works here)
  console.log('==> socket write CMD1',
    s.writeCommand(GET_USERS.code, GET_USERS.serialize()));
  console.log('==> socket write CMD2',
    s.writeCommand(GET_STREAMS.code, GET_STREAMS.serialize()));

  // LOGOUT
  const rOut = await logout(() => Promise.resolve(s))();
  console.log('RESPONSE LOGOUT', rOut);


} catch (err) {
  console.error('FAILED!', err);
}

process.exit(0);
