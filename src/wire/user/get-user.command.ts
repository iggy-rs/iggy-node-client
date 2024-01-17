
import { serializeIdentifier } from '../identifier.utils.js';
import type { CommandResponse } from '../../tcp.client.js';
import { deserializeUser } from './user.utils.js';


// GET USER by id
export const GET_USER = {
  code: 31,
  serialize: (id: string | number) => {
    return serializeIdentifier(id);
  },
  deserialize: (r: CommandResponse) => deserializeUser(r.data)

};
