
export type CommandResponse = {
  status: number,
  length: number,
  data: Buffer
};

export type Client = {
  sendCommand: (code: number, payload: Buffer) => Promise<CommandResponse>
}
