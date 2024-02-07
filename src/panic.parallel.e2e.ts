
import { TcpClient } from './client/tcp.client.js';
import { login } from './wire/session/login.command.js';
import { logout } from './wire/session/logout.command.js';
import { getStreams } from './wire/stream/get-streams.command.js';
import { getUsers } from './wire/user/get-users.command.js';

try {
  // create socket
  const s = TcpClient({ host: '127.0.0.1', port: 8090 });

  // LOGIN
  const r = await login(s)({ username: 'iggy', password: 'iggy' });
  console.log('RESPONSE_login', r);

  const resp  = await Promise.all([
    getUsers(s)(),
    getStreams(s)(),
    getUsers(s)(),
    getStreams(s)(),
    getUsers(s)(),
    getStreams(s)(),
    getUsers(s)(),
    getStreams(s)(),
  ])

  console.log('RESP', resp);

  console.log('GETUSERS', await getUsers(s)());
  console.log('GETSTREAM', await getStreams(s)());

  // LOGOUT
  const rOut = await logout(s)();
  console.log('RESPONSE LOGOUT', rOut);


} catch (err) {
  console.error('FAILED!', err);
}

process.exit(0);
