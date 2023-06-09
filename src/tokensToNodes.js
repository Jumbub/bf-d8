/** @typedef {{
 *     nodes?: Node[];
 *     move?: number;
 *     add?: number;
 *     set?: number;
 *     offset?: number
 * }} NodeInfo
 */

/**
 * @param {Token[]} tokens
 * @returns {Node}
 *
 * Assumes valid program.
 */
const tokensToNodes = tokens =>
  tokens.reduce(
    (allGroups, token) => {
      switch (token) {
        case '[':
          return [...allGroups, []];

        case ']':
          const loop = {
            whileNotZero: allGroups.pop(),
            offset: 0,
          };

          const newCurrentGroup = allGroups.pop();
          return [...allGroups, [...newCurrentGroup, loop]];

        default:
          const operation =
            token === '>'
              ? { move: 1 }
              : token === '<'
              ? { move: -1 }
              : token === '+'
              ? { add: 1, offset: 0 }
              : token === '-'
              ? { add: -1, offset: 0 }
              : token === '.'
              ? { output: true, offset: 0 }
              : token === ','
              ? { input: true, offset: 0 }
              : 'IMPOSSIBLE';
          const currentGroup = allGroups.pop();
          return [...allGroups, [...currentGroup, operation]];
      }
    },
    [[]],
  )[0];
