
import {
  boolToBuf,
  int8ToBuf,
  int16ToBuf,
  int32ToBuf,
  int64ToBuf,
  uint8ToBuf,
  uint16ToBuf,
  uint32ToBuf,
  uint64ToBuf,
  floatToBuf,
  doubleToBuf
} from '../number.utils.js';

import {
  type HeaderValueRaw,
  type HeaderValueString,
  type HeaderValueBool,
  type HeaderValueInt8,
  type HeaderValueInt16,
  type HeaderValueInt32,
  type HeaderValueInt64,
  type HeaderValueInt128,
  type HeaderValueUint8,
  type HeaderValueUint16,
  type HeaderValueUint32,
  type HeaderValueUint64,
  type HeaderValueUint128,
  type HeaderValueFloat,
  type HeaderValueDouble,
  HeaderKind
} from './header.type.js';


export type HeaderValue =
  HeaderValueRaw |
  HeaderValueString |
  HeaderValueBool |
  HeaderValueInt8 |
  HeaderValueInt16 |
  HeaderValueInt32 |
  HeaderValueInt64 |
  HeaderValueInt128 |
  HeaderValueUint8 |
  HeaderValueUint16 |
  HeaderValueUint32 |
  HeaderValueUint64 |
  HeaderValueUint128 |
  HeaderValueFloat |
  HeaderValueDouble;

export type Headers = Record<string, HeaderValue>;


type BinaryHeaderValue = {
  kind: HeaderKind,
  value: Buffer
}

export const serializeHeaderValue = (header: HeaderValue) => {
  const { kind, value } = header;
  switch (kind) {
    case HeaderKind.Raw: return value;
    case HeaderKind.String: return Buffer.from(value);
    case HeaderKind.Bool: return boolToBuf(value);
    case HeaderKind.Int8: return int8ToBuf(value);
    case HeaderKind.Int16: return int16ToBuf(value);
    case HeaderKind.Int32: return int32ToBuf(value);
    case HeaderKind.Int64: return int64ToBuf(value);
    case HeaderKind.Int128: return value;
    case HeaderKind.Uint8: return uint8ToBuf(value);
    case HeaderKind.Uint16: return uint16ToBuf(value);
    case HeaderKind.Uint32: return uint32ToBuf(value);
    case HeaderKind.Uint64: return uint64ToBuf(value);
    case HeaderKind.Uint128: return value;
    case HeaderKind.Float: return floatToBuf(value);
    case HeaderKind.Double: return doubleToBuf(value);
  }
};


export const serializeHeader = (key: string, v: BinaryHeaderValue) => {
  const bKey = Buffer.from(key)
  const b1 = uint32ToBuf(bKey.length);

  const b2 = Buffer.alloc(5);
  b2.writeUInt8(v.kind);
  b2.writeUInt32LE(v.value.length, 1);
  
  return Buffer.concat([
    b1,
    bKey,
    b2,
    v.value
  ]);
};

export const EMPTY_HEADERS = uint32ToBuf(0);

const createHeaderValue = (header: HeaderValue): BinaryHeaderValue => ({
  kind: header.kind,
  value: serializeHeaderValue(header)
});

export const serializeHeaders = (headers?: Headers) => {
  if (!headers)
    return EMPTY_HEADERS;
  const b = Object.keys(headers).reduce(
    (ac: Buffer, c: string) => Buffer.concat([
      ac, serializeHeader(c, createHeaderValue(headers[c]))]),
    Buffer.alloc(0)
  );
  return Buffer.concat([uint32ToBuf(b.length), b]);
};

// deserialize ...

export type ParsedHeaderValue = boolean | string | number | bigint | Buffer;

export type ParsedHeader = {
  kind: string,
  value: ParsedHeaderValue
}

type HeaderWithKey = ParsedHeader & { key: string };

export type HeadersMap = Record<string, ParsedHeader>;

type ParsedHeaderDeserialized = {
  bytesRead: number,
  data: HeaderWithKey
}

export const mapHeaderKind = (k: number): string => {
  if (!(k in HeaderKind))
    throw new Error(`unknow header kind: ${k}`);
  return HeaderKind[k];
}

export const deserializeHeaderValue =
  (kind: HeaderKind, value: Buffer): ParsedHeaderValue => {
    switch (kind) {
      case HeaderKind.Int128:
      case HeaderKind.Uint128:
      case HeaderKind.Raw: return value;
      case HeaderKind.String: return value.toString();
      case HeaderKind.Int8: return value.readInt8();
      case HeaderKind.Int16: return value.readInt16LE();
      case HeaderKind.Int32: return value.readInt32LE();
      case HeaderKind.Int64: return value.readBigInt64LE();
      case HeaderKind.Uint8: return value.readUint8();
      case HeaderKind.Uint16: return value.readUint16LE();
      case HeaderKind.Uint32: return value.readUInt32LE();
      case HeaderKind.Uint64: return value.readBigUInt64LE();
      case HeaderKind.Bool: return value.readUInt8() === 1;
      case HeaderKind.Float: return value.readFloatLE();
      case HeaderKind.Double: return value.readDoubleLE();
    }
  };

export const deserializeHeader = (p: Buffer, pos = 0): ParsedHeaderDeserialized => {
  const keyLength = p.readUInt32LE(pos);
  const key = p.subarray(pos + 4, pos + 4 + keyLength).toString();
  pos += keyLength;
  const rawKind = p.readUInt8(pos + 4);
  const kind = mapHeaderKind(rawKind);
  const valueLength = p.readUInt32LE(pos + 5);
  const value = deserializeHeaderValue(rawKind, p.subarray(pos + 9, pos + 9 + valueLength));

  return {
    bytesRead: 4 + 4 + 1 + keyLength + valueLength,
    data: {
      key,
      kind,
      value
    }
  };
}

export const deserializeHeaders = (p: Buffer, pos = 0) => {
  const headers: HeadersMap = {};
  const len = p.length;
  while (pos < len) {
    const { bytesRead, data: { kind, key, value } } = deserializeHeader(p, pos);
    headers[key] = { kind, value };
    pos += bytesRead;
  }
  return headers;
}


// export type InputHeaderValue = boolean | number | string | bigint | Buffer;
// export type InputHeaders = Record<string, InputHeaderValue>;

// const isFloat = (n: number) => n % 1 !== 0;

// export const createHeaderValueFloat = (v: number): HeaderValue =>
//   ({ kind: HeaderKind.Float, value: floatToBuf(v) });

// export const createHeaderValueDouble = (v: number): HeaderValue =>
//   ({ kind: HeaderKind.Double, value: doubleToBuf(v) });

// export const createHeaderValueInt32 = (v: number): HeaderValue =>
//   ({ kind: HeaderKind.Int32, value: int32ToBuf(v) });

// export const createHeaderValueInt64 = (v: bigint): HeaderValue =>
//   ({ kind: HeaderKind.Int64, value: int64ToBuf(v) });

// export const createHeaderValueUInt32 = (v: number): HeaderValue =>
//   ({ kind: HeaderKind.Uint32, value: uint32ToBuf(v) });

// export const createHeaderValueUInt64 = (v: bigint): HeaderValue =>
//   ({ kind: HeaderKind.Uint64, value: uint64ToBuf(v) });

// export const createHeaderValueBool = (v: boolean): HeaderValue =>
//   ({ kind: HeaderKind.Bool, value: boolToBuf(v) });

// export const createHeaderValueBuffer = (v: Buffer): HeaderValue =>
//   ({ kind: HeaderKind.Raw, value: v });

// export const createHeaderValueString = (v: string): HeaderValue =>
//   ({ kind: HeaderKind.String, value: Buffer.from(v) });


// // guess wire type from js type ?
// const guessHeaderValue = (v: InputHeaderValue): HeaderValue => {
//   if (typeof v === 'number') {
//     if (isFloat(v))
//       return createHeaderValueFloat(v);
//     else
//       return createHeaderValueInt32(v); // BAD KARMA
//   }
//   if (typeof v === 'bigint') {
//     return createHeaderValueInt64(v); // BAD KARMA
//   }
//   if (typeof v === 'boolean')
//     return createHeaderValueBool(v);
//   if (typeof v === 'string')
//     return createHeaderValueString(v);
//   if (v instanceof Buffer)
//     return createHeaderValueBuffer(v);

//   throw new Error(`unable to serialize headers param ${v} - ${typeof v}`)
// }
