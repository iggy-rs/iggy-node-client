
import { createClient, sendCommandWithResponse } from './tcp.client.js';

import { LOGIN } from './wire/session/login.command.js';
import { GET_ME } from './wire/client/get-me.command.js';
import { GET_CLIENTS } from './wire/client/get-clients.command.js';
import { GET_CLIENT } from './wire/client/get-client.command.js';
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

  // GET_ME
  const r_getMe = await sendCommandWithResponse(s)(GET_ME.code, GET_ME.serialize());
  console.log('RESPONSE_getMe', r_getMe.toString(), GET_ME.deserialize(r_getMe));

  // GET_CLIENTS
  const r4 = await sendCommandWithResponse(s)(GET_CLIENTS.code, GET_CLIENTS.serialize());
  const ls = GET_CLIENTS.deserialize(r4) // used after;
  console.log('RESPONSE4', r4.toString(), ls);

  // GET_CLIENT #ID
  const rCli = await sendCommandWithResponse(s)(
    GET_CLIENT.code, GET_CLIENT.serialize(ls[0].clientId)
  );
  console.log('RESPONSECli', rCli.toString(), GET_CLIENTS.deserialize(rCli));

  // LOGOUT
  const rOut = await sendCommandWithResponse(s)(LOGOUT.code, LOGOUT.serialize());
  console.log('RESPONSE LOGOUT', LOGOUT.desserialize(rOut));


} catch (err) {
  console.error('FAILED!', err);
}
