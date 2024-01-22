
import type { CommandResponse } from '../../tcp.client.js';

// PING
export const PING = {
  code: 1,
  serialize: () => {
    return Buffer.alloc(0);
  },

  deserialize: (r: CommandResponse) => {
    return r.status === 0 && r.length === 0;
  }

};
