
import type { CommandResponse } from '../../tcp.client.js';
import { deserializeUsers } from './user.utils.js';


// GET USERS
export const GET_USERS = {
  code: 32,
  serialize: () => {
    return Buffer.alloc(0);
    // return serializeIdentifier(id);
  },
  deserialize: (r: CommandResponse) => deserializeUsers(r.data)

};
