
import { TcpClient } from './client/index.js';

import {
  login, logout,
  getUser, getUsers,
  createUser, changePassword, updateUser, updatePermissions, deleteUser,
} from './wire/index.js';


try {
  // create socket
  const cli = TcpClient({ host: '127.0.0.1', port: 8090 });
  const s = () => Promise.resolve(cli);

  // LOGIN
  const r = await login(s)({ username: 'iggy', password: 'iggy' });
  console.log('RESPONSE_login', r);

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

  const cUser = { username, password, status, permissions };

  // CREATE_USER
  const rCreateUser = await createUser(s)(cUser);
  console.log('RESPONSE_createUser', rCreateUser);

  // GET_USERS
  const r12 = await getUsers(s)();
  console.log('RESPONSE getUsers', r12);

  // GET_USER #NAME
  const uGUsr = await getUser(s)({ userId: username });
  console.log('RESPONSE GetUser/name', uGUsr);

  // GET_USER #ID
  const r11 = await getUser(s)({ userId: uGUsr.id });
  console.log('RESPONSE GetUser/id', r11);

  // UPDATE_USER
  const rUpdateUser = await updateUser(s)({
    userId: uGUsr.id, username: 'usernameUpdated', status: 2
  });
  console.log('RESPONSE_updateUser', rUpdateUser);

  // CHANGE_PASSWORD
  const rChangePassword = await changePassword(s)({
    userId: uGUsr.id, currentPassword: password, newPassword: 'h4x0r42'
  });
  console.log('RESPONSE_changePassword', rChangePassword);

  // UPDATE_PERMISSIONS
  const perms2 = { ...permissions };
  perms2.global.ManageServers = true;
  const rUpdatePermissions = await updatePermissions(s)({
    userId: uGUsr.id, permissions: perms2
  });
  console.log('RESPONSE_updatePerms', rUpdatePermissions);

  // GET_USER #ID 2
  const rgu = await getUser(s)({ userId: uGUsr.id });
  console.log('RESPONSE  GetUser/id', rgu);

  // DELETE_USER #ID
  const r13 = await deleteUser(s)({ userId: uGUsr.id })
  console.log('RESPONSE deleteUser/id', r13);

  // LOGOUT
  const rOut = await logout(s)();
  console.log('RESPONSE LOGOUT', rOut);

} catch (err) {
  console.error('FAILED!', err);
}

process.exit(0);
