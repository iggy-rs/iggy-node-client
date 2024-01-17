
import type { CommandResponse } from '../../tcp.client.js';
import { serializeIdentifier, type Id } from '../identifier.utils.js';
import { deserializeToStream } from './stream.utils.js';


export const GET_STREAM = {
  code: 200,

  serialize: (id: Id) => {
    return serializeIdentifier(id);
  },

  deserialize: (r: CommandResponse) => {
    return deserializeToStream(r.data, 0).data
  }
}
