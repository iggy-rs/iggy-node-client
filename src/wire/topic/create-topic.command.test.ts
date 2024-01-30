
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CREATE_TOPIC } from './create-topic.command.js';

describe('CreateTopic', () => {

  describe('serialize', () => {

    const t1 = {
      streamId: 1,
      topicId: 2,
      name: 'test-topic',
      partitionCount: 1,
      messageExpiry: 0,
      maxTopicSize: 0,
      replicationFactor: 1
    };

    it('serialize 1 numeric id & 1 name into buffer', () => {
      assert.deepEqual(
        CREATE_TOPIC.serialize(t1).length,
        6 + 4 + 4 + 4 + 8 + 1 + 1 + t1.name.length
      );
    });

    it('throw on name < 1', () => {
      const t = { ...t1, name: '' };
      assert.throws(
        () => CREATE_TOPIC.serialize(t)
      );
    });

    it("throw on name > 255 bytes", () => {
      const t = { ...t1, name: "YoLo".repeat(65)};
      assert.throws(
        () => CREATE_TOPIC.serialize(t)
      );
    });

    it("throw on name > 255 bytes - utf8 version", () => {
      const t = { ...t1, name: "¥Ø£Ø".repeat(33) };
      assert.throws(
        () => CREATE_TOPIC.serialize(t)
      );
    });

    it('throw on replication_factor < 1', () => {
      const t = { ...t1, replicationFactor: 0 };
      assert.throws(
        () => CREATE_TOPIC.serialize(t),
      );
    });

    it('throw on replication_factor > 255', () => {
      const t = { ...t1, replicationFactor: 257 };
      assert.throws(
        () => CREATE_TOPIC.serialize(t),
      );
    });

  });
});
