
import { toDate } from '../serialize.utils.js';
import { deserializePermissions, type UserPermissions } from './permissions.utils.js';

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

export enum UserStatus {
  Active = 1,
  Inactive = 2,
};

const statusString = (t: number): string => {
  switch (t.toString()) {
    case '1': return 'Active';
    case '2': return 'Inactive';
    default: return `unknown_status_${t}`;
    // default: throw new Error(`unknown_status_${t}`);
  }
}

export const deserializeBaseUser = (p: Buffer, pos = 0): BaseUserDeserialized => {
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
  pos += bytesRead;
  const hasPerm = 1 === p.readUInt8(pos);

  let permissions = null;
  if (hasPerm) {
    pos += 1;
    const permLength = p.readUInt32LE(pos);
    const permBuffer = p.subarray(pos + 4, pos + 4 + permLength);
    permissions = deserializePermissions(permBuffer, 0);
  }

  return { ...data, permissions };
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
