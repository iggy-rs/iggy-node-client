
import { createClient, sendCommandWithResponse } from './tcp.client.js';

import { LOGIN } from './wire/session/login.command.js';
import { GET_USER } from './wire/user/get-user.command.js';
import { CREATE_USER } from './wire/user/create-user.command.js';
import { CHANGE_PASSWORD } from './wire/user/change-password.command.js';
import { DELETE_USER } from './wire/user/delete-user.command.js';
import { GET_USERS } from './wire/user/get-users.command.js';
import { LOGOUT } from './wire/session/logout.command.js';

import {
  serializePermissions, deserializePermissions
} from './wire/user/permissions.utils.js';

try {
  // create socket
  const s = await createClient('127.0.0.1', 8090);
  console.log('CLI', s.readyState);

  // LOGIN
  const loginCmd = LOGIN.serialize('iggy', 'iggy');
  console.log('LOGIN', loginCmd.toString());
  const r = await sendCommandWithResponse(s)(LOGIN.code, loginCmd);
  console.log('RESPONSE_login', r, r.toString(), LOGIN.deserialize(r));

  const username = 'test-user';
  const password = 'test-pwd123$!';
  const status = 1; // Active;
  const permissions = {
    global: {
      ManageServers: false,
      ReadServers: false,
      ManageUsers: true,
      ReadUsers: true,
      ManageStreams: true,
      ReadStreams: true,
      ManageTopics: true,
      ReadTopics: true,
      PollMessages: true,
      SendMessages: true
    },
    streams: []
  };

  const dsp = serializePermissions(permissions);
  const rsp = deserializePermissions(dsp);
  console.log(JSON.stringify(rsp, null, 2));

  // // CREATE_USER
  // const createUserCmd = CREATE_USER.serialize(username, password, status, permissions);
  // const rCreateUser = await sendCommandWithResponse(s)(CREATE_USER.code, createUserCmd);
  // console.log('RESPONSE_createUser', CREATE_USER.deserialize(rCreateUser));

  // GET_USER #NAME
  const guCmd = GET_USER.serialize(username);
  const rGUsr = await sendCommandWithResponse(s)(GET_USER.code, guCmd);
  const uGUsr = GET_USER.deserialize(rGUsr);
  console.log('RESPONSE GetUser/name', uGUsr);

  // GET_USER #ID
  const r11 = await sendCommandWithResponse(s)(GET_USER.code, GET_USER.serialize(6));
  console.log('RESPONSE  GetUser/id', GET_USER.deserialize(r11));

  // GET_USERS
  const r12 = await sendCommandWithResponse(s)(GET_USERS.code, GET_USERS.serialize());
  console.log('RESPONSE12', GET_USERS.deserialize(r12));

  // // DELETE_USER #ID
  // const r13 = await sendCommandWithResponse(s)(
  //   DELETE_USER.code, DELETE_USER.serialize(uGUsr.id)
  // );
  // console.log('RESPONSE deleteUser/id', DELETE_USER.deserialize(r13));

  // LOGOUT
  const rOut = await sendCommandWithResponse(s)(LOGOUT.code, LOGOUT.serialize());
  console.log('RESPONSE LOGOUT', LOGOUT.deserialize(rOut));


} catch (err) {
  console.error('FAILED!', err);
}
