'use strict';

load('./src/tokenizer.js');
load('./src/instructions.js');
load('./src/simplifier.js');
load('./src/visualise.js');

const DATA_LENGTH = 30000;
const DATA_TYPE = Uint8Array;

/** @param {string} code */
const execute = code => {
  const initialInstructions = instructionsFactory(tokenize(code));
  const instructions = instructionSimplifier(initialInstructions);
  visualise(instructions);
  print(initialInstructions.length, ' instructions shrunk to ', instructions.length);

  let data = new DATA_TYPE(DATA_LENGTH);
  let dataI = 0;
  for (let tokenI = 0; tokenI < instructions.length; tokenI++) {
    const instruction = instructions[tokenI];
    const label = instruction[LABEL_OFFSET];
    const offset = instruction[OFFSET_OFFSET];
    switch (label) {
      case ADD:
        data[dataI + offset] += instruction[VALUE_OFFSET];
        break;

      case SET:
        data[dataI + offset] = instruction[VALUE_OFFSET];
        break;

      case COPY_TO:
        data[dataI + offset] += data[dataI] * instruction[VALUE_OFFSET];
        break;

      case MOVE:
        dataI += instruction[OFFSET_OFFSET];
        break;

      case MOVE_TIL_ZERO:
        while (data[dataI]) {
          dataI += offset;
        }
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
