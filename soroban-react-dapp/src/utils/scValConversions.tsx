
import type * as SorobanClient from 'soroban-client';

export function scvalToString(value: SorobanClient.xdr.ScVal): string | undefined {
    return value.value()?.toString();
  }
  