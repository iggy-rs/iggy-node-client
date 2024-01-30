
import type { CommandResponse } from '../../client/client.type.js';
import { wrapCommand } from '../command.utils.js';

export type Stats = {
  processId: number,
  cpuUsage: number,
  memoryUsage: bigint,
  totalMemory: bigint,
  availableMemory: bigint,
  runTime: bigint,
  startTime: bigint,
  readBytes: bigint,
  writtenBytes: bigint,
  messagesSizeBytes: bigint,
  streamsCount: number,
  topicsCount: number,
  partitionsCount: number,
  segmentsCount: number,
  messagesCount: bigint,
  clientsCount: number,
  consumersGroupsCount: number,
  hostname: string,
  osName: string,
  osVersion: string,
  kernelVersion: string
}


export const GET_STATS = {
  code: 10,
  serialize: () => Buffer.alloc(0),
  deserialize: (r: CommandResponse): Stats => {

    const processId = r.data.readUInt32LE(0);
    const cpuUsage = r.data.readFloatLE(4);
    const memoryUsage = r.data.readBigUInt64LE(8);
    const totalMemory = r.data.readBigUInt64LE(16);
    const availableMemory = r.data.readBigUInt64LE(24);
    const runTime = r.data.readBigUInt64LE(32);
    const startTime = r.data.readBigUInt64LE(40);
    const readBytes = r.data.readBigUInt64LE(48);
    const writtenBytes = r.data.readBigUInt64LE(56);
    const messagesSizeBytes = r.data.readBigUInt64LE(64);
    const streamsCount = r.data.readUInt32LE(72);
    const topicsCount = r.data.readUInt32LE(76);
    const partitionsCount = r.data.readUInt32LE(80);
    const segmentsCount = r.data.readUInt32LE(84);
    const messagesCount = r.data.readBigUInt64LE(88);
    const clientsCount = r.data.readUInt32LE(96);
    const consumersGroupsCount = r.data.readUInt32LE(100);

    let position = 100 + 4;
    const hostnameLength = r.data.readUInt32LE(position);
    const hostname = r.data.subarray(
      position + 4,
      position + 4 + hostnameLength
    ).toString();
    position += 4 + hostnameLength;

    const osNameLength = r.data.readUInt32LE(position);
    const osName = r.data.subarray(
      position + 4,
      position + 4 + osNameLength
    ).toString();
    position += 4 + osNameLength;

    const osVersionLength = r.data.readUInt32LE(position);
    const osVersion = r.data.subarray(
      position + 4,
      position + 4 + osVersionLength
    ).toString();
    position += 4 + osVersionLength;

    const kernelVersionLength = r.data.readUInt32LE(position);
    const kernelVersion = r.data.subarray(
      position + 4,
      position + 4 + kernelVersionLength
    ).toString();

    return {
      processId,
      cpuUsage,
      memoryUsage,
      totalMemory,
      availableMemory,
      runTime,
      startTime,
      readBytes,
      writtenBytes,
      messagesSizeBytes,
      streamsCount,
      topicsCount,
      partitionsCount,
      segmentsCount,
      messagesCount,
      clientsCount,
      consumersGroupsCount,
      hostname,
      osName,
      osVersion,
      kernelVersion
    };
  }
};

export const getStats = wrapCommand<void, Stats>(GET_STATS);
