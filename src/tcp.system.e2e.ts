
import { TcpClient } from './client/tcp.client.js';
import { login } from './wire/session/login.command.js';
import { logout } from './wire/session/logout.command.js';
import { getStats } from './wire/system/get-stats.command.js';
import { ping } from './wire/system/ping.command.js';

try {
  // create socket
  const s = TcpClient({ host: '127.0.0.1', port: 8090 });

  // PING
  const r2 = await ping(s)()
  console.log('RESPONSE PING', r2);

  // LOGIN
  const r = await login(s)({ username: 'iggy', password: 'iggy' });
  console.log('RESPONSE_login', r);

  // GET_STATS
  const r_stats = await getStats(s)();
  console.log('RESPONSE_stats', r_stats);

  // LOGOUT
  const rOut = await logout(s)();
  console.log('RESPONSE LOGOUT', rOut);

} catch (err) {
  console.error('FAILED!', err);
}
