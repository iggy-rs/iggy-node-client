
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CREATE_TOPIC } from './create-topic.command.js';

describe('CreateTopic', () => {

  describe('serialize', () => {
    // serialize: (
    //   streamId: Id, 
    //   topicId: number, 
    //   name: string,
    //   partitionCount: number, 
    //   messageExpiry = 0,
    //   maxTopicSize = 0, 
    //   replicationFactor = 1
    // ) => { ... }

    const name = 'test-topic';

    it('serialize 1 numeric id & 1 name into buffer', () => {
      assert.deepEqual(
        CREATE_TOPIC.serialize(1, 2, name, 1, 0, 0, 1).length,
        6 + 4 + 4 + 4 + 8 + 1 + 1 + name.length
      );
    });

    it('throw on name < 1', () => {
      assert.throws(
        () => CREATE_TOPIC.serialize(1, 2, '', 1)
      );
    });

    it("throw on name > 255 bytes", () => {
      assert.throws(
        () => CREATE_TOPIC.serialize(1, 2, "YoLo".repeat(65), 1)
      );
    });

    it("throw on name > 255 bytes - utf8 version", () => {
      assert.throws(
        () => CREATE_TOPIC.serialize(1, 3, "¥Ø£Ø".repeat(33), 2)
      );
    });

    it('throw on replication_factor < 1', () => {
      assert.throws(
        () => CREATE_TOPIC.serialize(1, 2, name, 1, 0, 0, 0),
      );
    });

    it('throw on replication_factor > 255', () => {
      assert.throws(
        () => CREATE_TOPIC.serialize(1, 2, name, 1, 0, 0, 256),
      );
    });

  });
});
