/**
 * @param {Token[]} tokens All tokens
 * @param {number} tokenPosition
 */
const findMatchingOpenBraceOffset = (tokens, tokenPosition) => {
  let offset = 1;
  let openedBraces = 0;
  while (!(tokens[tokenPosition + offset] === ']' && openedBraces === 0)) {
    if (tokens[tokenPosition + offset] === '[') openedBraces++;
    if (tokens[tokenPosition + offset] === ']') openedBraces--;
    offset++;
  }
  return offset;
};

/**
 * @param {Token[]} tokens
 * @param {number} offset The position of the opening brace
 */
const findMatchingCloseBraceOffset = (tokens, tokenPosition) => {
  let offset = 1;
  let openedBraces = 0;
  while (!(tokens[tokenPosition + offset] === ']' && openedBraces === 0)) {
    if (tokens[tokenPosition + offset] === '[') openedBraces++;
    if (tokens[tokenPosition + offset] === ']') openedBraces--;
    offset++;
  }
  return offset;
};
