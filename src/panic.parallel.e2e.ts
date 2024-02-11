
import { TcpClient } from './client/tcp.client.js';
import { SimpleClient } from './client/client.js';

try {
  // create socket
  const cli = await TcpClient({ host: '127.0.0.1', port: 8090 });
  const c = new SimpleClient(cli);

  // LOGIN
  const r = await c.session.login({ username: 'iggy', password: 'iggy' });
  console.log('RESPONSE_login', r);
  
  const resp  = await Promise.all([
    c.user.list(),
    c.stream.list(),
    c.user.list(),
    c.stream.list(),
    c.user.list(),
    c.stream.list(),
    c.user.list(),
    c.stream.list(),
    c.user.list(),
    c.stream.list(),
  ])

  console.log('RESP', resp);

  console.log('GETUSERS', await c.user.list());
  console.log('GETSTREAM', await c.stream.list());

  // LOGOUT
  const rOut = await c.session.logout();
  console.log('RESPONSE LOGOUT', rOut);


} catch (err) {
  console.error('FAILED!', err);
}

process.exit(0);
