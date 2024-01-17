

import type { CommandResponse } from '../../tcp.client.js';
import { deserializeTokens } from './token.utils.js';

export const GET_TOKENS = {
  code: 41,

  serialize: (): Buffer => Buffer.alloc(0),

  deserialize: (r: CommandResponse) => deserializeTokens(r.data)
};
