load('./src/braces.js');

const ADD = 'add';
const MOVE = 'move';
const INPUT = 'input';
const OUTPUT = 'output';
const IF_ZERO_GOTO = 'if_zero_goto';
const IF_NOT_ZERO_GOTO = 'if_not_zero_goto';
const SET = 'set';
const MOVE_TIL_ZERO = 'move_til_zero';
const COPY_TO = 'copy_to';

const LABEL_OFFSET = 0;
const OFFSET_OFFSET = 1;
const VALUE_OFFSET = 2;

const addFactory = (offset, value) => {
  return [ADD, offset, value];
};
const moveFactory = offset => {
  return [MOVE, offset];
};
const inputFactory = offset => {
  return [INPUT, offset];
};
const outputFactory = offset => {
  return [OUTPUT, offset];
};
const gotoIfZeroFactory = offset => {
  return [IF_ZERO_GOTO, offset];
};
const gotoIfNotZeroFactory = offset => {
  return [IF_NOT_ZERO_GOTO, offset];
};
const setFactory = (offset, value) => {
  return [SET, offset, value];
};
const moveTilZeroFactory = offset => {
  return [MOVE_TIL_ZERO, offset];
};
const copyToFactory = (offset, multiplyer) => {
  return [COPY_TO, offset, multiplyer];
};

const nonLoopInstructionFactory = token => {
  switch (token) {
    case '+':
      return addFactory(0, 1);
    case '-':
      return addFactory(0, -1);
    case '>':
      return moveFactory(1);
    case '<':
      return moveFactory(-1);
    case '.':
      return outputFactory(0);
    case ',':
      return inputFactory(0);
    default:
      throw new Error('Only non-loop instructions');
  }
};

const loopInstructionFactory = (token, tokens, tokenPosition) => {
  switch (token) {
    case '[':
      return gotoIfZeroFactory(findMatchingCloseBraceOffset(tokens, tokenPosition));
    case ']':
      return gotoIfNotZeroFactory(findMatchingOpenBraceOffset(tokens, tokenPosition));
    default:
      throw new Error('Only loop instructions');
  }
};

/**
 * @param {Token[]} tokens
 *
 * Assumes valid program.
 */
const instructionsFactory = tokens => {
  let instructions = [];
  let offset = 0;
  let token = undefined;
  while ((token = tokens[offset++]) !== undefined) {
    if (token === '[' || token === ']') {
      instructions.push(loopInstructionFactory(token, tokens, offset - 1));
    } else {
      instructions.push(nonLoopInstructionFactory(token));
    }
  }

  return instructions;
};
