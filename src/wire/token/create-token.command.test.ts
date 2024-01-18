
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CREATE_TOKEN } from './create-token.command.js';

describe('CreateToken', () => {

  describe('serialize', () => {

    const name = 'test-token';
    const expiry = 1234;

    it('serialize 1 name & 1 uint32 into buffer', () => {

      assert.deepEqual(
        CREATE_TOKEN.serialize(name, expiry).length,
        4 + 1 + name.length
      );
    });

    it('throw on name < 1', () => {
      assert.throws(
        () => CREATE_TOKEN.serialize('', expiry)
      );
    });

    it("throw on name > 255 bytes", () => {
      assert.throws(
        () => CREATE_TOKEN.serialize("YoLo".repeat(65), expiry)
      );
    });

    it("throw on name > 255 bytes - utf8 version", () => {
      assert.throws(
        () => CREATE_TOKEN.serialize("¥Ø£Ø".repeat(33), expiry)
      );
    });

  });
});
