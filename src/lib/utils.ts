import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// SHA-256 hashing function
export async function sha256(message: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export const STATIC_DECK = [
  // Co (♥) 0..12
  { code: 0, rank: 'A', suit: 'Co' },
  { code: 1, rank: '2', suit: 'Co' },
  { code: 2, rank: '3', suit: 'Co' },
  { code: 3, rank: '4', suit: 'Co' },
  { code: 4, rank: '5', suit: 'Co' },
  { code: 5, rank: '6', suit: 'Co' },
  { code: 6, rank: '7', suit: 'Co' },
  { code: 7, rank: '8', suit: 'Co' },
  { code: 8, rank: '9', suit: 'Co' },
  { code: 9, rank: '10', suit: 'Co' },
  { code: 10, rank: 'J', suit: 'Co' },
  { code: 11, rank: 'Q', suit: 'Co' },
  { code: 12, rank: 'K', suit: 'Co' },

  // Ro (♦) 13..25
  { code: 13, rank: 'A', suit: 'Ro' },
  { code: 14, rank: '2', suit: 'Ro' },
  { code: 15, rank: '3', suit: 'Ro' },
  { code: 16, rank: '4', suit: 'Ro' },
  { code: 17, rank: '5', suit: 'Ro' },
  { code: 18, rank: '6', suit: 'Ro' },
  { code: 19, rank: '7', suit: 'Ro' },
  { code: 20, rank: '8', suit: 'Ro' },
  { code: 21, rank: '9', suit: 'Ro' },
  { code: 22, rank: '10', suit: 'Ro' },
  { code: 23, rank: 'J', suit: 'Ro' },
  { code: 24, rank: 'Q', suit: 'Ro' },
  { code: 25, rank: 'K', suit: 'Ro' },

  // Chuon (♣) 26..38
  { code: 26, rank: 'A', suit: 'Chuon' },
  { code: 27, rank: '2', suit: 'Chuon' },
  { code: 28, rank: '3', suit: 'Chuon' },
  { code: 29, rank: '4', suit: 'Chuon' },
  { code: 30, rank: '5', suit: 'Chuon' },
  { code: 31, rank: '6', suit: 'Chuon' },
  { code: 32, rank: '7', suit: 'Chuon' },
  { code: 33, rank: '8', suit: 'Chuon' },
  { code: 34, rank: '9', suit: 'Chuon' },
  { code: 35, rank: '10', suit: 'Chuon' },
  { code: 36, rank: 'J', suit: 'Chuon' },
  { code: 37, rank: 'Q', suit: 'Chuon' },
  { code: 38, rank: 'K', suit: 'Chuon' },

  // Bich (♠) 39..51
  { code: 39, rank: 'A', suit: 'Bich' },
  { code: 40, rank: '2', suit: 'Bich' },
  { code: 41, rank: '3', suit: 'Bich' },
  { code: 42, rank: '4', suit: 'Bich' },
  { code: 43, rank: '5', suit: 'Bich' },
  { code: 44, rank: '6', suit: 'Bich' },
  { code: 45, rank: '7', suit: 'Bich' },
  { code: 46, rank: '8', suit: 'Bich' },
  { code: 47, rank: '9', suit: 'Bich' },
  { code: 48, rank: '10', suit: 'Bich' },
  { code: 49, rank: 'J', suit: 'Bich' },
  { code: 50, rank: 'Q', suit: 'Bich' },
  { code: 51, rank: 'K', suit: 'Bich' },
];

export const STATIC_DECK_WITH_CARDCODE = {
  0: { rank: 'A', suit: 'Co', image: 'images/cards/Co_A.svg' },
  1: { rank: '2', suit: 'Co', image: 'images/cards/Co_2.svg' },
  2: { rank: '3', suit: 'Co', image: 'images/cards/Co_3.svg' },
  3: { rank: '4', suit: 'Co', image: 'images/cards/Co_4.svg' },
  4: { rank: '5', suit: 'Co', image: 'images/cards/Co_5.svg' },
  5: { rank: '6', suit: 'Co', image: 'images/cards/Co_6.svg' },
  6: { rank: '7', suit: 'Co', image: 'images/cards/Co_7.svg' },
  7: { rank: '8', suit: 'Co', image: 'images/cards/Co_8.svg' },
  8: { rank: '9', suit: 'Co', image: 'images/cards/Co_9.svg' },
  9: { rank: '10', suit: 'Co', image: 'images/cards/Co_10.svg' },
  10: { rank: 'J', suit: 'Co', image: 'images/cards/Co_J.svg' },
  11: { rank: 'Q', suit: 'Co', image: 'images/cards/Co_Q.svg' },
  12: { rank: 'K', suit: 'Co', image: 'images/cards/Co_K.svg' },
  13: { rank: 'A', suit: 'Ro', image: 'images/cards/Ro_A.svg' },
  14: { rank: '2', suit: 'Ro', image: 'images/cards/Ro_2.svg' },
  15: { rank: '3', suit: 'Ro', image: 'images/cards/Ro_3.svg' },
  16: { rank: '4', suit: 'Ro', image: 'images/cards/Ro_4.svg' },
  17: { rank: '5', suit: 'Ro', image: 'images/cards/Ro_5.svg' },
  18: { rank: '6', suit: 'Ro', image: 'images/cards/Ro_6.svg' },
  19: { rank: '7', suit: 'Ro', image: 'images/cards/Ro_7.svg' },
  20: { rank: '8', suit: 'Ro', image: 'images/cards/Ro_8.svg' },
  21: { rank: '9', suit: 'Ro', image: 'images/cards/Ro_9.svg' },
  22: { rank: '10', suit: 'Ro', image: 'images/cards/Ro_10.svg' },
  23: { rank: 'J', suit: 'Ro', image: 'images/cards/Ro_J.svg' },
  24: { rank: 'Q', suit: 'Ro', image: 'images/cards/Ro_Q.svg' },
  25: { rank: 'K', suit: 'Ro', image: 'images/cards/Ro_K.svg' },
  26: { rank: 'A', suit: 'Chuon', image: 'images/cards/Chuon_A.svg' },
  27: { rank: '2', suit: 'Chuon', image: 'images/cards/Chuon_2.svg' },
  28: { rank: '3', suit: 'Chuon', image: 'images/cards/Chuon_3.svg' },
  29: { rank: '4', suit: 'Chuon', image: 'images/cards/Chuon_4.svg' },
  30: { rank: '5', suit: 'Chuon', image: 'images/cards/Chuon_5.svg' },
  31: { rank: '6', suit: 'Chuon', image: 'images/cards/Chuon_6.svg' },
  32: { rank: '7', suit: 'Chuon', image: 'images/cards/Chuon_7.svg' },
  33: { rank: '8', suit: 'Chuon', image: 'images/cards/Chuon_8.svg' },
  34: { rank: '9', suit: 'Chuon', image: 'images/cards/Chuon_9.svg' },
  35: { rank: '10', suit: 'Chuon', image: 'images/cards/Chuon_10.svg' },
  36: { rank: 'J', suit: 'Chuon', image: 'images/cards/Chuon_J.svg' },
  37: { rank: 'Q', suit: 'Chuon', image: 'images/cards/Chuon_Q.svg' },
  38: { rank: 'K', suit: 'Chuon', image: 'images/cards/Chuon_K.svg' },
  39: { rank: 'A', suit: 'Bich', image: 'images/cards/Bich_A.svg' },
  40: { rank: '2', suit: 'Bich', image: 'images/cards/Bich_2.svg' },
  41: { rank: '3', suit: 'Bich', image: 'images/cards/Bich_3.svg' },
  42: { rank: '4', suit: 'Bich', image: 'images/cards/Bich_4.svg' },
  43: { rank: '5', suit: 'Bich', image: 'images/cards/Bich_5.svg' },
  44: { rank: '6', suit: 'Bich', image: 'images/cards/Bich_6.svg' },
  45: { rank: '7', suit: 'Bich', image: 'images/cards/Bich_7.svg' },
  46: { rank: '8', suit: 'Bich', image: 'images/cards/Bich_8.svg' },
  47: { rank: '9', suit: 'Bich', image: 'images/cards/Bich_9.svg' },
  48: { rank: '10', suit: 'Bich', image: 'images/cards/Bich_10.svg' },
  49: { rank: 'J', suit: 'Bich', image: 'images/cards/Bich_J.svg' },
  50: { rank: 'Q', suit: 'Bich', image: 'images/cards/Bich_Q.svg' },
  51: { rank: 'K', suit: 'Bich', image: 'images/cards/Bich_K.svg' },
};
