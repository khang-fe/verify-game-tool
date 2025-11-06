async function decryptCardForUser(
  clientPrivHex: any,
  serverPubHex: any,
  saltHex: any,
  cipher: any
) {
  const { getSharedSecret } = await import('@noble/secp256k1');
  const { hkdf } = await import('@noble/hashes/hkdf.js');
  const { sha256 } = await import('@noble/hashes/sha2.js');

  function hexToU8(hex: any) {
    return new Uint8Array(
      hex.match(/.{1,2}/g).map((b: any) => parseInt(b, 16))
    );
  }

  const clientPriv = hexToU8(clientPrivHex);
  const serverPub = hexToU8(serverPubHex);
  const salt = hexToU8(saltHex);
  const iv = hexToU8(cipher.iv);
  const enc = hexToU8(cipher.enc);
  const tag = hexToU8(cipher.tag);

  const shared = getSharedSecret(clientPriv, serverPub).slice(1); // bỏ prefix 0x04

  for (let v = 0; v < 52; v++) {
    const info = new Uint8Array([v]);
    const keyBytes = hkdf(sha256, shared, salt, info, 32);
    const keyBytesArr = new Uint8Array(keyBytes);
    const key = await crypto.subtle.importKey(
      'raw',
      keyBytesArr,
      'AES-GCM',
      false,
      ['decrypt']
    );

    const fullCipher = new Uint8Array(enc.length + tag.length);
    fullCipher.set(enc);
    fullCipher.set(tag, enc.length);

    try {
      const pt = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv, tagLength: 128 },
        key,
        fullCipher
      );

      const plain = new Uint8Array(pt);
      if (plain.length === 1 && plain[0] === v) {
        console.log('✅ success', v);
        return { cardCode: v };
      }
    } catch {
      // console.log(e);
    }
  }

  throw new Error('Failed to decrypt');
}
export { decryptCardForUser };
