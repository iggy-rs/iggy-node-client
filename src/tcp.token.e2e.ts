
import { TcpClient } from './client/index.js';
import { login, logout, getTokens, createToken, deleteToken } from './wire/index.js';

try {
  // create socket
  const cli = TcpClient({ host: '127.0.0.1', port: 8090 });
  const s = () => Promise.resolve(cli);

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
