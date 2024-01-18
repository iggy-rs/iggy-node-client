
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CREATE_STREAM } from './create-stream.command.js';

describe('CreateStream', () => {

  describe('serialize', () => {

    it('serialize 1 numeric id & 1 name into buffer', () => {
      const name = 'test-stream';
      assert.deepEqual(
        CREATE_STREAM.serialize(1, name).length,
        4 + 1 + name.length
      );
    });

    it('throw on name < 1', () => {
      assert.throws(
        () => CREATE_STREAM.serialize(1, '')
      );
    });

    it("throw on name > 255 bytes", () => {
      assert.throws(
        () => CREATE_STREAM.serialize(1, "YoLo".repeat(65))
      );
    });

    it("throw on name > 255 bytes - utf8 version", () => {
      assert.throws(
        () => CREATE_STREAM.serialize(3, "¥Ø£Ø".repeat(33))
      );
    });

  });
});
