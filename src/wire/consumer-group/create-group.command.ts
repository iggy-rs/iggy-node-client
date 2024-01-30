
import { serializeIdentifier, type Id } from '../identifier.utils.js';
import { deserializeVoidResponse } from '../../client/client.utils.js';
import { wrapCommand } from '../command.utils.js';

export type CreateGroup = {
  streamId: Id,
  topicId: Id,
  groupId: number,
  name: string,
};

export const CREATE_GROUP = {
  code: 602,

  serialize: ({streamId, topicId, groupId, name}:CreateGroup) => {
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

  deserialize: deserializeVoidResponse
};

export const createGroup = wrapCommand<CreateGroup, Boolean>(CREATE_GROUP);
