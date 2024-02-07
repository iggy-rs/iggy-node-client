
import { TcpClient } from './client/tcp.client.js';
import { login } from './wire/session/login.command.js';
import { logout } from './wire/session/logout.command.js';
// import { LOGIN_WITH_TOKEN } from './wire/session/login-with-token.command.js';
import { getTokens } from './wire/token/get-tokens.command.js';
import { createToken } from './wire/token/create-token.command.js';
import { deleteToken } from './wire/token/delete-token.command.js';

try {
  // create socket
  const s = TcpClient({ host: '127.0.0.1', port: 8090 });

  // LOGIN
  const r = await login(s)({ username: 'iggy', password: 'iggy' });
  console.log('RESPONSE_login', r);

  // CREATE_TOKEN
  const r_createToken = await createToken(s)({ name: 'yolo-token-test', expiry: 1800 });
  console.log('RESPONSE_createToken', r_createToken);

  // GET_TOKENS
  const r14 = await getTokens(s)();
  // const r14 = await sendCommandWithResponse(s)(GET_TOKENS.code, GET_TOKENS.serialize());
  console.log('RESPONSE14', r14);

  // DELETE TOKEN
  const r_deleteToken = await deleteToken(s)({ name: 'yolo-token-test' });
  console.log('RESPONSE_deleteToken', r_deleteToken);

  // LOGOUT
  const rOut = await logout(s)();
  console.log('RESPONSE LOGOUT', rOut);


} catch (err) {
  console.error('FAILED!', err);
}

process.exit(0);
