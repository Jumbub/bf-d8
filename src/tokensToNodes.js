/** @typedef {{
 *     whileNotZero?: Node[];
 *     move?: number;
 *     add?: number;
 *     offset?: number
 * }} NodeInfo
 */

/**
 * @param {Token[]} tokens
 * @returns {NodeInfo}
 *
 * Assumes valid program.
 */
const tokensToNodes = tokens =>
  tokens.reduce(
    (allTokenArrays, token) => {
      switch (token) {
        case '[':
          return [...allTokenArrays, []];

        case ']':
          const loop = {
            whileNotZero: allTokenArrays.at(-1),
            offset: 0,
          };
          return [...allTokenArrays.slice(0, -2), [...allTokenArrays.at(-2), loop]];

        default:
          const operation = {
            '>': { move: 1 },
            '<': { move: -1 },
            '+': { add: 1, offset: 0 },
            '-': { add: -1, offset: 0 },
            '.': { output: true, offset: 0 },
            ',': { input: true, offset: 0 },
          }[token];
          return [...allTokenArrays.slice(0, -1), [...allTokenArrays.at(-1), operation]];
      }
    },
    [[]],
  )[0];
