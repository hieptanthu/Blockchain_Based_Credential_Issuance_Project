export function stringToUint8Array(input: string): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(input);
}

export function uint8ArrayToString(input: ArrayBuffer | Uint8Array): string {
  const uint8Array =
    input instanceof Uint8Array ? input : new Uint8Array(input);
  return new TextDecoder().decode(uint8Array);
}
