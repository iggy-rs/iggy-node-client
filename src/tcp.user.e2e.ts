
import { createClient, sendCommandWithResponse } from './tcp.client.js';

import { LOGIN } from './wire/session/login.command.js';
import { GET_USER } from './wire/user/get-user.command.js';
import { GET_USERS } from './wire/user/get-users.command.js';
import { LOGOUT } from './wire/session/logout.command.js';

try {
  // create socket
  const s = await createClient('127.0.0.1', 8090);
  console.log('CLI', s.readyState);

  // LOGIN
  const loginCmd = LOGIN.serialize('iggy', 'iggy');
  console.log('LOGIN', loginCmd.toString());
  const r = await sendCommandWithResponse(s)(LOGIN.code, loginCmd);
  console.log('RESPONSE_login', r, r.toString(), LOGIN.deserialize(r));

  // GET_USER #NAME
  const r10 = await sendCommandWithResponse(s)(GET_USER.code, GET_USER.serialize('iggy'));
  const u10 = GET_USER.deserialize(r10);
  console.log('RESPONSE10', u10);

  // GET_USER #ID
  const r11 = await sendCommandWithResponse(s)(GET_USER.code, GET_USER.serialize(u10.id));
  console.log('RESPONSE11', GET_USER.deserialize(r11));

  // GET_USERS
  const r12 = await sendCommandWithResponse(s)(GET_USERS.code, GET_USERS.serialize());
  console.log('RESPONSE12', GET_USERS.deserialize(r12));

  // LOGOUT
  const rOut = await sendCommandWithResponse(s)(LOGOUT.code, LOGOUT.serialize());
  console.log('RESPONSE LOGOUT', LOGOUT.desserialize(rOut));


} catch (err) {
  console.error('FAILED!', err);
}
