
import { TcpClient } from './client/index.js';
import { login, getMe, getClients, getClient, logout } from './wire/index.js';

try {
  // create socket 
  const cli = TcpClient({ host: '127.0.0.1', port: 8090 });
  const s = () => Promise.resolve(cli);

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
