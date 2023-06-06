'use strict';

load('./src/tokenizer.js');
load('./src/instructions.js');
load('./src/simplifier.js');

const DATA_LENGTH = 30000;
const DATA_TYPE = Uint8Array;

/** @param {string} code */
const execute = code => {
  const instructions = instructionSimplifier(instructionsFactory(tokenize(code)));

  let data = new DATA_TYPE(DATA_LENGTH);
  let dataI = 0;
  for (let tokenI = 0; tokenI < instructions.length; tokenI++) {
    const instruction = instructions[tokenI];
    const label = instruction[LABEL_OFFSET];
    const offset = instruction[OFFSET_OFFSET];
    switch (label) {
      case MUTATE:
        data[dataI + offset] += instruction[VALUE_OFFSET];
        break;

      case MOVE:
        dataI += instruction[OFFSET_OFFSET];
        break;

      case OUTPUT:
        write(String.fromCharCode(data[dataI + offset]));
        break;

      case INPUT:
        data[dataI + offset] = readline().charCodeAt(0);
        break;

      case IF_ZERO_GOTO:
        if (data[dataI] === 0) tokenI += offset;
        break;

      case IF_NOT_ZERO_GOTO:
        if (data[dataI] !== 0) tokenI += offset;
        break;

      default:
        throw new Error(`Unknown operator ${label}`);
    }
  }
};
