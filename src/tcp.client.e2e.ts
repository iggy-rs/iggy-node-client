
import { TcpClient } from './client/tcp.client.js';
import { login } from './wire/session/login.command.js';
import { getMe } from './wire/client/get-me.command.js';
import { getClients } from './wire/client/get-clients.command.js';
import { getClient } from './wire/client/get-client.command.js';
import { logout } from './wire/session/logout.command.js';

try {
  // create socket
  const s = TcpClient({ host: '127.0.0.1', port: 8090 });

  // LOGIN
  const r = await login(s)({ username: 'iggy', password: 'iggy' });
  console.log('RESPONSE_login', r);

  // GET_ME
  const r_getMe = await getMe(s)();
  console.log('RESPONSE_getMe', r_getMe);

  // GET_CLIENTS
  const ls = await getClients(s)();
  console.log('RESPONSE4', ls);

  // GET_CLIENT #ID
  const rCli = await getClient(s)({ clientId: ls[0].clientId });
  console.log('RESPONSECli', rCli);

  // LOGOUT
  const rOut = await logout(s)();
  console.log('RESPONSE LOGOUT', rOut);


} catch (err) {
  console.error('FAILED!', err);
}
