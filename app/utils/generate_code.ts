import { randomInt } from 'crypto'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const DIGITS = '0123456789'

export function generateCode(): string {
  let letters = ''
  let numbers = ''

  for (let i = 0; i < 3; i++) {
    letters += ALPHABET[randomInt(0, ALPHABET.length)]
  }

  for (let i = 0; i < 4; i++) {
    numbers += DIGITS[randomInt(0, DIGITS.length)]
  }

  return `${letters}-${numbers}`
}
