load('./src/debugInstructions.js');

const executeInstructions = (instructions, DATA_TYPE, DATA_LENGTH) => {
  let data = new DATA_TYPE(DATA_LENGTH);
  let dataI = 0;
  for (let instructionI = 0; instructionI < instructions.length; instructionI++) {
    // debugInstructionsWarningStatefulFunction(data, dataI, instructions[instructionI]);

    const offset = instructions[instructionI][1];
    const value = instructions[instructionI][2];

    switch (instructions[instructionI][0]) {
      case ADD_WHILE_NOT_ZERO:
        while (data[dataI + offset] !== 0) {
          data[dataI + offset] += value.from.add;
          value.to.forEach(inner => {
            data[dataI + offset + inner.offset] += inner.add;
          });
        }
        break;

      case GOTO_IF_NOT_ZERO:
        if (data[dataI + offset] !== 0) instructionI += value;
        break;

      case MOVE:
        dataI += value;
        break;

      case ADD:
        data[dataI + offset] += value;
        break;

      case SET:
        if (instructions[instructionI][3] && data[dataI + offset] % 2 === 0) throw new Error('Non-terminating loop!');
        data[dataI + offset] = value;
        break;

      case GOTO_IF_ZERO:
        if (data[dataI + offset] === 0) instructionI += value;
        break;

      case MOVE_WHILE_NOT_ZERO:
        while (data[dataI + offset] !== 0) {
          dataI += value;
        }
        break;

      case OUTPUT:
        write(String.fromCharCode(data[dataI + offset]));
        break;

      case INPUT:
        // note: readline returns undefined in non-interactive environments
        data[dataI + offset] = (readline() ?? '').charCodeAt(0);
        break;

      default:
        throw new Error(`Unknown instruction: ${JSON.stringify(instructions[instructionI])}`);
    }
  }
};
