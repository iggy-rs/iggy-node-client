
import { createClient, sendCommandWithResponse } from './tcp.client.js';

import { PING } from './wire/system/ping.command.js';
import { LOGIN } from './wire/session/login.command.js';
import { LOGOUT } from './wire/session/logout.command.js';
import { GET_STATS } from './wire/system/get-stats.command.js';

try {
  // create socket
  const s = await createClient('127.0.0.1', 8090);
  console.log('CLI', s.readyState);

  // PING
  const r2 = await sendCommandWithResponse(s)(PING.code, PING.serialize());
  console.log('RESPONSE PING', r2, PING.deserialize(r2));

  // LOGIN
  const loginCmd = LOGIN.serialize('iggy', 'iggy');
  console.log('LOGIN', loginCmd.toString());
  const r = await sendCommandWithResponse(s)(LOGIN.code, loginCmd);
  console.log('RESPONSE_login', r, r.toString(), LOGIN.deserialize(r));

  // GET_STATS
  const r_stats = await sendCommandWithResponse(s)(GET_STATS.code, GET_STATS.serialize());
  console.log('RESPONSE_stats', r_stats.toString(), GET_STATS.deserialize(r_stats));


  // LOGOUT
  const rOut = await sendCommandWithResponse(s)(LOGOUT.code, LOGOUT.serialize());
  console.log('RESPONSE LOGOUT', LOGOUT.deserialize(rOut));


} catch (err) {
  console.error('FAILED!', err);
}
