const MUTATE = Symbol();
const MOVE = Symbol();
const INPUT = Symbol();
const OUTPUT = Symbol();
const IF_ZERO_GOTO = Symbol();
const IF_NOT_ZERO_GOTO = Symbol();

const mutateFactory = (value, offset) => {
  return [MUTATE, value, offset];
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

const nonLoopInstructionFactory = token => {
  switch (token) {
    case '+':
      return mutateFactory(1, 0);
    case '-':
      return mutateFactory(-1, 0);
    case '>':
      return moveFactory(1);
    case '<':
      return moveFactory(-1);
    case '.':
      return outputFactory(1);
    case ',':
      return inputFactory(-1);
    default:
      throw new Error('Only non-loop instructions');
  }
};

const loopInstructionFactory = (token, tokenPosition, tokens) => {
  switch (token) {
    case '[':
      return gotoIfZeroFactory(NaN);
    case ']':
      return gotoIfNotZeroFactory(NaN);
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
  print('tokens', tokens.join(''));
  while ((token = tokens[offset]) !== undefined) {
    print('token', token);
    switch (token) {
      case '[':
        const closingBraceLocation = findMatchingClosingBracePosition(tokens, offset);
        const loopTokens = tokens.splice(offset, closingBraceLocation - 1);
        offset = closingBraceLocation + 1; // Next iteration should skip closing brace
        print(offset, token, closingBraceLocation);
        instructions.push(instructionsFactory(loopTokens));
      case ']':
        throw new Error('Program with valid bracing should never reach this state');
      default:
        offset += 1;
        instructions.push(nonLoopInstructionFactory(token));
    }
  }

  print('done');
};
