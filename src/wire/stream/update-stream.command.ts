
import type { CommandResponse } from '../../tcp.client.js';
import { serializeIdentifier, type Id } from '../identifier.utils.js';
import { uint8ToBuf } from '../number.utils.js';

export const UPDATE_STREAM = {
  code: 204,

  serialize: (id: Id, name: string) => {
    const bId = serializeIdentifier(id);
    const bName = Buffer.from(name);

    if (bName.length < 1 || bName.length > 255)
      throw new Error('Stream name should be between 1 and 255 bytes');


    return Buffer.concat([
      bId,
      uint8ToBuf(bName.length),
      bName
    ]);
  },

  deserialize: (r: CommandResponse) => {
    return r.status === 0 && r.data.length === 0;
  }
};
