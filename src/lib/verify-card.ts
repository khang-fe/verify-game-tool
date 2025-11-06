import { StandardMerkleTree } from '@openzeppelin/merkle-tree';

function to0x32(hex: string) {
  let h = String(hex);
  if (h.startsWith('0x')) h = h.slice(2);
  if (h.length !== 64)
    throw new Error(`cardHash must be 32 bytes hex, got len=${h.length}`);
  return '0x' + h;
}

/**
 * Verify 1 lá bài theo tuple [index, cardHash]
 * @param {number} index       globalIndex sau khi xào (0..51)
 * @param {string} cardHashHex hex 32 bytes KHÔNG '0x' (SHA256(gameId||code||salt))
 * @param {string[]} proof     mảng 0x-hex 32B (tree.getProof(insertIndex))
 * @param {string} root        0x-hex 32B (tree.root)
 */
export function verifyCardByIndex(
  index: number,
  cardHashHex: string,
  proof: string[],
  root: string
) {
  const value = [BigInt(index), to0x32(cardHashHex)];
  return StandardMerkleTree.verify(root, ['uint256', 'bytes32'], value, proof);
}

export function getLeafsFromDeck(deck: any[]) {
  return deck.map((card, index) => [
    BigInt(index),
    to0x32(card.cardInfo.cardValue),
  ]);
}

export function getLeafsFromDeckHex(deck: any[]) {
  return deck.map((card, index) => [
    index.toString(16).padStart(64, '0'),
    card.cardInfo.cardValue,
  ]);
}

export function getLeavesFromCardhash(index: number, cardHashHex: string) {
  const leaves = [BigInt(index), to0x32(cardHashHex)];
  return leaves;
}

export function getMerkleTreeFromDeck(deck: any[]) {
  const leaves = getLeafsFromDeck(deck);
  return StandardMerkleTree.of(leaves, ['uint256', 'bytes32']);
}

// let k = verifyCardByIndex(
//   0,
//   `94930376e19adc780a029b7937dfa510c3725e857fa444fba361953b6b6dce61`,
//   [
//     '0x3d4fea83a76c8f8dc596a1feb8590049bf9e0e29723bd8160b0720a2d93c5c48',
//     '0x72b4fbc5de630267f81a520217f0891cc3f1c031d68b57eb7a5650680073d820',
//     '0xdba1a227918e0dfcee06068189f5ece1147ca849c517ae7bb21c86de36b3c5a6',
//     '0x585ecff118bb468ccb431ef12279efe25edcb087258184119bc969f77495d2e6',
//     '0x278103b5b8312e466c9136d5375a452c773c0b16030175d12a8f5e0e0acc108e',
//     '0x97a2d14e54a86fb887c880b012af69c4badd2cf5d947dae330265b2ffe19a124',
//   ],
//   `0x05b8b355899bf6b43975875f24714a0391058b0f498b5328d49a75fa74353914`
// );
// console.log(k);
