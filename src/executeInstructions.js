load('./src/debugInstructions.js');

const executeInstructions = (instructions, DATA_TYPE, DATA_LENGTH) => {
  let data = new DATA_TYPE(DATA_LENGTH);
  let dataI = 0;
  for (let tokenI = 0; tokenI < instructions.length; tokenI++) {
    const [label, offset, value, nonTerminatingIfEven] = instructions[tokenI];

    // debugInstructionsWarningStatefulFunction(data, dataI, instructions[tokenI]);

    switch (label) {
      case ADD:
        data[dataI + offset] += value;
        break;

      case MOVE:
        dataI += value;
        break;

      case OUTPUT:
        write(String.fromCharCode(data[dataI + offset]));
        break;

      case INPUT:
        // note: readline returns undefined in non-interactive environments
        data[dataI + offset] = (readline() ?? '').charCodeAt(0);
        break;

      case GOTO_IF_ZERO:
        if (data[dataI + offset] === 0) tokenI += value;
        break;

      case GOTO_IF_NOT_ZERO:
        if (data[dataI + offset] !== 0) tokenI += value;
        break;

      case SET:
        if (nonTerminatingIfEven && data[dataI + offset] % 2 === 0) throw new Error('Non-terminating loop!');
        data[dataI + offset] = value;
        break;

      case MOVE_WHILE_NOT_ZERO:
        while (data[dataI + offset] !== 0) {
          dataI += value;
        }
        break;

      case ADD_WHILE_NOT_ZERO:
        while (data[dataI + offset] !== 0) {
          data[dataI + offset] += value.from.add;
          value.to.forEach(inner => {
            data[dataI + offset + inner.offset] += inner.add;
          });
        }
        break;

      default:
        throw new Error(`Unknown instruction: ${JSON.stringify(instructions[tokenI])}`);
    }
  }
};
