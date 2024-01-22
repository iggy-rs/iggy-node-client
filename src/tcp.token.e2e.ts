
import { createClient, sendCommandWithResponse } from './tcp.client.js';

import { LOGIN } from './wire/session/login.command.js';
// import { LOGIN_WITH_TOKEN } from './wire/session/login-with-token.command.js';
import { GET_TOKENS } from './wire/token/get-tokens.command.js';
import { CREATE_TOKEN } from './wire/token/create-token.command.js';
import { DELETE_TOKEN } from './wire/token/delete-token.command.js';
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

  // CREATE_TOKEN
  const ptk = CREATE_TOKEN.serialize('yolo-token-test', 1800);
  const r_createToken = await sendCommandWithResponse(s)(CREATE_TOKEN.code, ptk);
  console.log('RESPONSE_createToken', CREATE_TOKEN.deserialize(r_createToken));

  // GET_TOKENS
  const r14 = await sendCommandWithResponse(s)(GET_TOKENS.code, GET_TOKENS.serialize());
  console.log('RESPONSE14', GET_TOKENS.deserialize(r14));

  // DELETE TOKEN
  const dtk = DELETE_TOKEN.serialize('yolo-token-test');
  const r_deleteToken = await sendCommandWithResponse(s)(DELETE_TOKEN.code, dtk);
  console.log('RESPONSE_deleteToken', DELETE_TOKEN.deserialize(r_deleteToken));

  // LOGOUT
  const rOut = await sendCommandWithResponse(s)(LOGOUT.code, LOGOUT.serialize());
  console.log('RESPONSE LOGOUT', LOGOUT.deserialize(rOut));


} catch (err) {
  console.error('FAILED!', err);
}
