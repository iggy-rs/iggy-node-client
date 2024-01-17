
import type { CommandResponse } from '../../tcp.client.js';

// LOGOUT
export const LOGOUT = {
  code: 39,
  serialize: () => {
    return Buffer.alloc(0);
  },

  desserialize: (r: CommandResponse) => {
    return r.status === 0 && r.length === 0;
  }

};
