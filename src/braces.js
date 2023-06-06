/**
 * @param {Token[]} tokens
 * @param {number} tokenPosition
 * @param {(-1|1)} direction
 */
const findMatchingBraceOffset = (tokens, tokenPosition, direction) => {
  const matchingBrace = direction === 1 ? ']' : '[';
  const openingBrace = direction === 1 ? '[' : ']';

  let offset = direction;
  let openedBraces = 0;
  while (!(tokens[tokenPosition + offset] === matchingBrace && openedBraces === 0)) {
    if (tokens[tokenPosition + offset] === openingBrace) openedBraces++;
    if (tokens[tokenPosition + offset] === matchingBrace) openedBraces--;
    offset += direction;
  }
  return offset;
};

/**
 * @param {Token[]} tokens
 * @param {number} tokenPosition
 */
const findMatchingCloseBraceOffset = (tokens, tokenPosition) => findMatchingBraceOffset(tokens, tokenPosition, 1);

/**
 * @param {Token[]} tokens
 * @param {number} tokenPosition
 */
const findMatchingOpenBraceOffset = (tokens, tokenPosition) => findMatchingBraceOffset(tokens, tokenPosition, -1);
