
import { createClient, sendCommandWithResponse } from './tcp.client.js';

import { LOGIN } from './wire/session/login.command.js';
import { GET_USER } from './wire/user/get-user.command.js';
import { CREATE_USER } from './wire/user/create-user.command.js';
import { CHANGE_PASSWORD } from './wire/user/change-password.command.js';
import { UPDATE_USER } from './wire/user/update-user.command.js';
import { UPDATE_PERMISSIONS } from './wire/user/update-permissions.command.js';
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

  // const dsp = serializePermissions(permissions);
  // const rsp = deserializePermissions(dsp);
  // console.log(JSON.stringify(rsp, null, 2));

  // CREATE_USER
  const createUserCmd = CREATE_USER.serialize(username, password, status, permissions);
  const rCreateUser = await sendCommandWithResponse(s)(CREATE_USER.code, createUserCmd);
  console.log('RESPONSE_createUser', CREATE_USER.deserialize(rCreateUser));

  // GET_USERS
  const r12 = await sendCommandWithResponse(s)(GET_USERS.code, GET_USERS.serialize());
  console.log('RESPONSE12', GET_USERS.deserialize(r12));

  // GET_USER #NAME
  const guCmd = GET_USER.serialize(username);
  const rGUsr = await sendCommandWithResponse(s)(GET_USER.code, guCmd);
  const uGUsr = GET_USER.deserialize(rGUsr);
  console.log('RESPONSE GetUser/name', uGUsr);

  // GET_USER #ID
  const r11 = await sendCommandWithResponse(s)(GET_USER.code, GET_USER.serialize(uGUsr.id));
  console.log('RESPONSE  GetUser/id', GET_USER.deserialize(r11));

  // UPDATE_USER
  const updateUserCmd = UPDATE_USER.serialize(uGUsr.id, 'usernameUpdated', 2);
  const rUpdateUser = await sendCommandWithResponse(s)(UPDATE_USER.code, updateUserCmd);
  console.log('RESPONSE_updateUser', UPDATE_USER.deserialize(rUpdateUser));

  // CHANGE_PASSWORD
  const changePasswordCmd = CHANGE_PASSWORD.serialize(uGUsr.id, password, 'h4x0r42');
  const rChangePassword = await sendCommandWithResponse(s)(
    CHANGE_PASSWORD.code, changePasswordCmd
  );
  console.log('RESPONSE_changePassword', CHANGE_PASSWORD.deserialize(rChangePassword));

  // UPDATE_PERMISSIONS
  const perms2 = { ...permissions };
  perms2.global.ManageServers = true;
  const updatePermissionsCmd = UPDATE_PERMISSIONS.serialize(uGUsr.id, perms2);
  const rUpdatePermissions = await sendCommandWithResponse(s)(
    UPDATE_PERMISSIONS.code, updatePermissionsCmd
  );
  console.log('RESPONSE_updatePerms', UPDATE_PERMISSIONS.deserialize(rUpdatePermissions));

  // GET_USER #ID 2
  const rgu = await sendCommandWithResponse(s)(GET_USER.code, GET_USER.serialize(uGUsr.id));
  console.log('RESPONSE  GetUser/id', GET_USER.deserialize(rgu));

  // DELETE_USER #ID
  const r13 = await sendCommandWithResponse(s)(
    DELETE_USER.code, DELETE_USER.serialize(uGUsr.id)
  );
  console.log('RESPONSE deleteUser/id', DELETE_USER.deserialize(r13));

  // LOGOUT
  const rOut = await sendCommandWithResponse(s)(LOGOUT.code, LOGOUT.serialize());
  console.log('RESPONSE LOGOUT', LOGOUT.deserialize(rOut));


} catch (err) {
  console.error('FAILED!', err);
}
