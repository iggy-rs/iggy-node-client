
import type { CommandResponse } from '../../tcp.client.js';
import { serializeIdentifier, type Id } from '../identifier.utils.js';

export const CREATE_GROUP = {
  code: 602,

  serialize: (
    streamId: Id,
    topicId: Id,
    groupId: number,
    name: string,
  ) => {
    const bName = Buffer.from(name);
    const b = Buffer.allocUnsafe(5);
    b.writeUInt32LE(groupId);
    b.writeUInt8(bName.length);

    return Buffer.concat([
      serializeIdentifier(streamId),
      serializeIdentifier(topicId),
      b,
      bName
    ]);
  },

  deserialize: (r: CommandResponse) => {
    return r.status === 0 && r.length === 0;
  }
};
