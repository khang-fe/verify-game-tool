declare module '@noble/secp256k1' {
  export function getSharedSecret(
    privateKey: any,
    publicKey: any,
    isCompressed?: boolean
  ): any;
  export function getPublicKey(privateKey: any, isCompressed?: boolean): any;
}

declare module '@noble/hashes/hkdf' {
  export function hkdf(
    hashFn: any,
    ikm: any,
    salt: any,
    info: any,
    length: number
  ): Uint8Array;
}

declare module '@noble/hashes/sha256' {
  const sha256: any;
  export { sha256 };
}

// Support explicit .js entry imports used in bundlers
declare module '@noble/hashes/hkdf.js' {
  export { hkdf } from '@noble/hashes/hkdf';
}

declare module '@noble/hashes/sha256.js' {
  export { sha256 } from '@noble/hashes/sha256';
}
