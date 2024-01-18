
import { toDate } from '../serialize.utils.js';

export type BaseUser = {
  id: number,
  createdAt: Date,
  status: string,
  userName: string
};

type BaseUserDeserialized = {
  bytesRead: number,
  data: BaseUser
};

export type User = BaseUser & { permissions: UserPermissions | null };

const statusString = (t: number): string => {
  switch (t.toString()) {
    case '1': return 'Active';
    case '2': return 'Inactive';
    default: return `unknown_status_${t}`;
    // default: throw new Error(`unknown_status_${t}`);
  }
}

const toBool = (u: number) => u === 1;

export const deserializeBaseUser = (p: Buffer, pos = 0): BaseUserDeserialized => {

  if (p.length < pos + 14)
    throw new Error('deserializeUser:: failed to map response payload');

  const id = p.readUInt32LE(pos);
  const createdAt = toDate(p.readBigUInt64LE(pos + 4))
  const status = statusString(p.readUInt8(pos + 12));
  const userNameLength = p.readUInt8(pos + 13);
  const userName = p.subarray(pos + 14, pos + 14 + userNameLength).toString();

  return {
    bytesRead: 14 + userNameLength,
    data: {
      id,
      createdAt,
      status,
      userName,
    }
  }
};

export const deserializeUser = (p: Buffer, pos = 0): User => {
  const { bytesRead, data } = deserializeBaseUser(p, pos);
  const hasPerm = toBool(p.readUInt8(pos));
  let permissions = null;
  if (hasPerm) {
    pos += bytesRead + 1;
    const permLength = p.readUInt32LE(pos);
    const permBuffer = p.subarray(pos + 4, pos + 4 + permLength);
    permissions = deserializePermissions(permBuffer, 0);
  }

  return { ...data, permissions };
};

export type GlobalPermissions = {
  ManageServers: boolean,
  ReadServers: boolean,
  ManageUsers: boolean,
  ReadUsers: boolean,
  ManageStreams: boolean,
  ReadStreams: boolean,
  ManageTopics: boolean,
  ReadTopics: boolean,
  PollMessages: boolean,
  SendMessages: boolean
};

type GlobalPermissionsDeserialized = {
  bytesRead: number,
  data: GlobalPermissions
};

export const deserializeGlobalPermissions =
  (p: Buffer, pos = 0): GlobalPermissionsDeserialized => {
    return {
      bytesRead: 10,
      data: {
        ManageServers: toBool(p.readUInt8(pos)),
        ReadServers: toBool(p.readUInt8(pos + 1)),
        ManageUsers: toBool(p.readUInt8(pos + 2)),
        ReadUsers: toBool(p.readUInt8(pos + 3)),
        ManageStreams: toBool(p.readUInt8(pos + 4)),
        ReadStreams: toBool(p.readUInt8(pos + 5)),
        ManageTopics: toBool(p.readUInt8(pos + 6)),
        ReadTopics: toBool(p.readUInt8(pos + 7)),
        PollMessages: toBool(p.readUInt8(pos + 8)),
        SendMessages: toBool(p.readUInt8(pos + 9)),
      }
    };
  };

export type TopicPermissions = {
  manage: boolean,
  read: boolean,
  pollMessages: boolean,
  sendMessages: boolean
}

export type TopicPerms = {
  topicId: number,
  permissions: TopicPermissions
}

type TopicPermissionsDeserialized = { bytesRead: number } & TopicPerms;

export const deserializeTopicPermissions =
  (p: Buffer, pos = 0): TopicPermissionsDeserialized => {
    const topicId = p.readUInt32LE(pos);
    const permissions = {
      manage: toBool(p.readUInt8(pos + 4)),
      read: toBool(p.readUInt8(pos + 5)),
      pollMessages: toBool(p.readUInt8(pos + 6)),
      sendMessages: toBool(p.readUInt8(pos + 7)),
    };

    return {
      bytesRead: 8,
      topicId,
      permissions
    }

  };

export type StreamPermissions = {
  manageStream: boolean,
  readStream: boolean,
  manageTopics: boolean,
  readTopics: boolean,
  pollMessages: boolean,
  sendMessages: boolean,
};

export type StreamPerms = {
  streamId: number,
  permissions: StreamPermissions,
  topics: TopicPerms[]
}

type StreamPermissionsDeserialized = { bytesRead: number } & StreamPerms;

export const deserializeStreamPermissions =
  (p: Buffer, pos = 0): StreamPermissionsDeserialized => {
    const start = pos;
    const streamId = p.readUInt32LE(pos);
    const permissions = {
      manageStream: toBool(p.readUInt8(pos + 4)),
      readStream: toBool(p.readUInt8(pos + 5)),
      manageTopics: toBool(p.readUInt8(pos + 6)),
      readTopics: toBool(p.readUInt8(pos + 7)),
      pollMessages: toBool(p.readUInt8(pos + 8)),
      sendMessages: toBool(p.readUInt8(pos + 9)),
    }

    pos += 10;

    const topics = [];
    const hasTopics = toBool(p.readUInt8(pos));

    if (hasTopics) {
      let read = true;
      pos += 1;
      while (read) {
        const { bytesRead, topicId, permissions } = deserializeTopicPermissions(p, pos);
        pos += bytesRead;
        topics.push({ topicId, permissions });

        if (p.readUInt8(pos) === 0)
          read = false; // break
      }
    }

    return {
      bytesRead: pos - start,
      streamId,
      permissions,
      topics
    }
  };


export type UserPermissions = {
  global: GlobalPermissions,
  streams: StreamPerms[]
}

export const deserializePermissions = (p: Buffer, pos = 0): UserPermissions => {
  const { bytesRead, data } = deserializeGlobalPermissions(p, pos);
  pos += bytesRead;

  const streams = [];
  const hasStream = toBool(p.readUInt8(pos));
  if (hasStream) {
    let readStream = true;
    pos += 1;
    while (readStream) {
      const {
        bytesRead, streamId, permissions, topics
      } = deserializeStreamPermissions(p, pos);
      streams.push({ streamId, permissions, topics });
      pos += bytesRead;
      if (p.readUInt8(pos) === 0)
        readStream = false; // break
    }
  }
  return {
    global: data,
    streams
  }
};

export const deserializeUsers = (p: Buffer, pos = 0): BaseUser[] => {
  const users = [];
  const end = p.length;
  while (pos < end) {
    const { bytesRead, data } = deserializeBaseUser(p, pos);
    users.push(data);
    pos += bytesRead;
  }
  return users;
};
