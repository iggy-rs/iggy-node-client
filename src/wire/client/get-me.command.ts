
import type { CommandResponse } from '../../tcp.client.js';
import { deserializeClient } from './client.utils.js';

// GET ME
export const GET_ME = {
  code: 20,
  serialize: () => Buffer.alloc(0),
  deserialize: (r: CommandResponse) => deserializeClient(r.data).data
};

