
export const toDate = (n: bigint): Date => new Date(Number(n / BigInt(1000)));
