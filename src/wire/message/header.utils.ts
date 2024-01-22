
import {
  boolToBuf,
  int32ToBuf,
  int64ToBuf,
  uint32ToBuf,
  uint64ToBuf,
  floatToBuf,
  doubleToBuf
} from '../number.utils.js';

import {
  type HeaderValueRaw,
  type HeaderValueString,
  type HeaderValueBool,
  type HeaderValueInt32,
  type HeaderValueInt64,
  type HeaderValueInt128,
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
  HeaderValueInt32 |
  HeaderValueInt64 |
  HeaderValueInt128 |
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
    case HeaderKind.Int32: return int32ToBuf(value);
    case HeaderKind.Int64: return int64ToBuf(value);
    case HeaderKind.Int128: return value;
    case HeaderKind.Uint32: return uint32ToBuf(value);
    case HeaderKind.Uint64: return uint64ToBuf(value);
    case HeaderKind.Uint128: return value;
    case HeaderKind.Float: return floatToBuf(value);
    case HeaderKind.Double: return doubleToBuf(value);
  }
};

const createHeaderValue = (header: HeaderValue): BinaryHeaderValue => ({
  kind: header.kind,
  value: serializeHeaderValue(header)
});

export const serializeHeader = (key: string, v: BinaryHeaderValue) => {
  const bKey = Buffer.from(key)

  const b1 = Buffer.alloc(4);
  b1.writeUInt32LE(bKey.length);

  const b2 = Buffer.alloc(5);
  b2.writeUInt8(v.kind);
  b2.writeUInt8(v.value.length);

  return Buffer.concat([
    b1,
    bKey,
    b2,
    v.value
  ]);
};

export const EMPTY_HEADERS = uint32ToBuf(0);

export const serializeHeaders = (headers?: Headers) => {
  if (!headers)
    return EMPTY_HEADERS;
  return Object.keys(headers).reduce(
    (ac: Buffer, c: string) => Buffer.concat([
      ac, serializeHeader(c, createHeaderValue(headers[c]))]),
    Buffer.alloc(0)
  );
};



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
