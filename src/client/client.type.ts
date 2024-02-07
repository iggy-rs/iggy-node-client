
export type CommandResponse = {
  status: number,
  length: number,
  data: Buffer
};

// export type ClientState = {
//   isAuthenticated: boolean,
//   token?: string
// };

export type RawClient = {
  sendCommand: (code: number, payload: Buffer) => Promise<CommandResponse>,
}
