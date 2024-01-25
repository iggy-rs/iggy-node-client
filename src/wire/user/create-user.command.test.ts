
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CREATE_USER } from './create-user.command.js';

describe('CreateUser', () => {

  describe('serialize', () => {
    // serialize: (
    //   userusername: string,
    //   password: string,
    //   status: UserStatus,
    //   permissions?: UserPermissions
    // ) => {

    const username = 'test-user';
    const password = 'test-pwd';
    const status = 1; // Active;
    const perms = undefined; // @TODO

    it('serialize username, password, status, permissions into buffer', () => {
      assert.deepEqual(
        CREATE_USER.serialize(username, password, status, perms).length,
        1 + username.length + 1 + password.length + 1 + 1 + 4 + 1
      );
    });

    it('throw on username < 1', () => {
      assert.throws(
        () => CREATE_USER.serialize('', password, status, perms)
      );
    });

    it('throw on username > 255 bytes', () => {
      assert.throws(
        () => CREATE_USER.serialize('YoLo'.repeat(65), password, status, perms)
      );
    });

    it('throw on username > 255 bytes - utf8 version', () => {
      assert.throws(
        () => CREATE_USER.serialize('¥Ø£Ø'.repeat(33), password, status, perms)
      );
    });

    it('throw on password < 1', () => {
      assert.throws(
        () => CREATE_USER.serialize('', password, status, perms)
      );
    });

    it('throw on password > 255 bytes', () => {
      assert.throws(
        () => CREATE_USER.serialize(username, 'YoLo'.repeat(65), status, perms)
      );
    });

    it('throw on password > 255 bytes - utf8 version', () => {
      assert.throws(
        () => CREATE_USER.serialize(username, '¥Ø£Ø'.repeat(33), status, perms)
      );
    });

  });
});
