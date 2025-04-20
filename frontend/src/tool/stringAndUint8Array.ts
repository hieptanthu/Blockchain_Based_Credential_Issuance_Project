export function stringToUint8Array(input: string): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(input);
}

export function uint8ArrayToString(input: Uint8Array): string {
  const decoder = new TextDecoder();
  return decoder.decode(input);
}
