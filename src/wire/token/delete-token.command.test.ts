
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { DELETE_TOKEN } from './delete-token.command.js';

describe('DeleteToken', () => {

  describe('serialize', () => {

    const name = 'test-token';

    it('serialize 1 name into buffer', () => {

      assert.deepEqual(
        DELETE_TOKEN.serialize(name).length,
        1 + name.length
      );
    });

    it('throw on name < 1', () => {
      assert.throws(
        () => DELETE_TOKEN.serialize('')
      );
    });

    it("throw on name > 255 bytes", () => {
      assert.throws(
        () => DELETE_TOKEN.serialize("YoLo".repeat(65))
      );
    });

    it("throw on name > 255 bytes - utf8 version", () => {
      assert.throws(
        () => DELETE_TOKEN.serialize("¥Ø£Ø".repeat(33))
      );
    });

  });
});
