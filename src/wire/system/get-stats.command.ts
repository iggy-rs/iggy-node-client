
import type { CommandResponse } from '../../tcp.client.js';

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
  partitionCount: number,
  messagesCount: bigint,
  clientsCount: number,
  consumerGroupsCount: number,
  hostname: string,
  osName: string,
  osVersion: string,
  kernelVersion: string
}

const statsPos = {
  processIDPos: 0,
  cpuUsagePos: 4,
  memoryUsagePos: 8,
  totalMemoryPos: 16,
  availableMemoryPos: 24,
  runTimePos: 32,
  startTimePos: 40,
  readBytesPos: 48,
  writtenBytesPos: 56,
  messagesSizeBytesPos: 64,
  streamsCountPos: 72,
  topicsCountPos: 76,
  partitionsCountPos: 80,
  segmentsCountPos: 84,
  messagesCountPos: 88,
  clientsCountPos: 96,
  consumerGroupsCountPos: 100
};

export const GET_STATS = {
  code: 10,
  serialize: () => Buffer.alloc(0),
  deserialize: (r: CommandResponse): Stats => {

    const processId = r.data.readUInt32LE(statsPos.processIDPos);
    const cpuUsage = r.data.readFloatLE(statsPos.cpuUsagePos);
    const memoryUsage = r.data.readBigUInt64LE(statsPos.memoryUsagePos);
    const totalMemory = r.data.readBigUInt64LE(statsPos.totalMemoryPos);
    const availableMemory = r.data.readBigUInt64LE(statsPos.availableMemoryPos);
    const runTime = r.data.readBigUInt64LE(statsPos.runTimePos);
    const startTime = r.data.readBigUInt64LE(statsPos.startTimePos);
    const readBytes = r.data.readBigUInt64LE(statsPos.readBytesPos);
    const writtenBytes = r.data.readBigUInt64LE(statsPos.writtenBytesPos);
    const messagesSizeBytes = r.data.readBigUInt64LE(statsPos.messagesSizeBytesPos);
    const streamsCount = r.data.readUInt32LE(statsPos.streamsCountPos);
    const topicsCount = r.data.readUInt32LE(statsPos.topicsCountPos);
    const partitionCount = r.data.readUInt32LE(statsPos.partitionsCountPos);
    const messagesCount = r.data.readBigUInt64LE(statsPos.messagesCountPos);
    const clientsCount = r.data.readUInt32LE(statsPos.clientsCountPos);
    const consumerGroupsCount = r.data.readUInt32LE(statsPos.consumerGroupsCountPos);

    let position = statsPos.consumerGroupsCountPos + 4;
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
      partitionCount,
      messagesCount,
      clientsCount,
      consumerGroupsCount,
      hostname,
      osName,
      osVersion,
      kernelVersion
    };
  }
};
