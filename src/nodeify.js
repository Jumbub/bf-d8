const ROOT = 'ROOT';

const ADD = 'ADD';
const MOVE = 'MOVE';
const INPUT = 'INPUT';
const OUTPUT = 'OUTPUT';
const WHILE_NOT_ZERO = 'WHILE_NOT_ZERO';

const SET = 'SET';
const MOVE_TIL_ZERO = 'MOVE_TIL_ZERO';
const COPY_TO = 'COPY_TO';

const TOKEN_TO_TYPE = {
  '+': ADD,
  '-': ADD,
  '>': MOVE,
  '<': MOVE,
  '.': OUTPUT,
  ',': INPUT,
  '[': WHILE_NOT_ZERO,
  ']': null,
};

/** @typedef {{
 *     do?: Node[];
 *     ifNot?: boolean;
 *     move?: number;
 *     add?: number;
 *     set?: number;
 *     offset?: number
 * }} NodeMeta
 */

const has = x => x !== undefined;
/**
 * @param {NodeMeta} meta
 */
const createNode = meta => {
  const node = {
    ...meta,
    toString: (depth = 0) => {
      let output = '.\t'.repeat(depth);

      if (!has(meta.ifNot) && has(meta.do)) {
        output += '#include <iostream>;\nunsigned char tape[30000];\nunsigned short p = 0';
      }

      if (has(meta.do)) {
        const doStrings = meta.do.map(node => node.toString(depth + 1));
        output += `{\n${doStrings.join('\n')}\n}`;
      }

      if (has(meta.add) || has(meta.set)) {
        if (!has(meta.offset) || meta.offset === 0) {
          output += `d[p]`;
        } else if (meta.offset < 0) {
          output += `d[p]`;
        }
      }
      if (has(meta.add)) {
        output += ` += ${meta.add};`;
      }
      if (has(meta.set)) {
        output += ` = ${meta.add};`;
      }

      return output;
    },
  };
  return node;
};

/**
 * @param {Token[]} tokens
 * @returns {Node}
 *
 * Assumes valid program.
 */
const nodeify = tokens =>
  createNode({
    do: tokens.reduce(
      (allGroups, token) => {
        switch (token) {
          case '[':
            return allGroups.concat([]);

          case ']':
            const loop = createNode({
              do: allGroups.pop(),
              ifNot: 0,
            });
            const newCurrentGroup = allGroups.pop();
            return [...allGroups, [...newCurrentGroup, loop]];

          default:
            const operation =
              token === '>'
                ? createNode({ move: 1, offset: 0 })
                : token === '<'
                ? createNode({ move: -1, offset: 0 })
                : token === '+'
                ? createNode({ add: 1, offset: 0 })
                : token === '-'
                ? createNode({ add: -1, offset: 0 })
                : token === '.'
                ? createNode({ output: true, offset: 0 })
                : token === ','
                ? createNode({ input: true, offset: 0 })
                : 'IMPOSSIBLE';
            const currentGroup = allGroups.pop();
            return [...allGroups, [...currentGroup, operation]];
        }
      },
      [[]],
    )[0],
  });
