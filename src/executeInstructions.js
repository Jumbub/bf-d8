load('./src/debugInstructions.js');

const executeInstructions = (instructions, DATA_TYPE, DATA_LENGTH) => {
  let data = new DATA_TYPE(DATA_LENGTH);
  let dataI = 0;
  for (let tokenI = 0; tokenI < instructions.length; tokenI++) {
    // debugInstructionsWarningStatefulFunction(data, dataI, instructions[tokenI]);

    switch (instructions[tokenI][0]) {
      case ADD:
        data[dataI + instructions[tokenI][1]] += instructions[tokenI][2];
        break;

      case MOVE:
        dataI += instructions[tokenI][2];
        break;

      case OUTPUT:
        write(String.fromCharCode(data[dataI + instructions[tokenI][1]]));
        break;

      case INPUT:
        // note: readline returns undefined in non-interactive environments
        data[dataI + instructions[tokenI][1]] = (readline() ?? '').charCodeAt(0);
        break;

      case GOTO_IF_ZERO:
        if (data[dataI + instructions[tokenI][1]] === 0) tokenI += instructions[tokenI][2];
        break;

      case GOTO_IF_NOT_ZERO:
        if (data[dataI + instructions[tokenI][1]] !== 0) tokenI += instructions[tokenI][2];
        break;

      case SET:
        if (instructions[tokenI][3] && data[dataI + instructions[tokenI][1]] % 2 === 0)
          throw new Error('Non-terminating loop!');
        data[dataI + instructions[tokenI][1]] = instructions[tokenI][2];
        break;

      case MOVE_WHILE_NOT_ZERO:
        while (data[dataI + instructions[tokenI][1]] !== 0) {
          dataI += instructions[tokenI][2];
        }
        break;

      case ADD_WHILE_NOT_ZERO:
        while (data[dataI + instructions[tokenI][1]] !== 0) {
          data[dataI + instructions[tokenI][1]] += instructions[tokenI][2].from.add;
          instructions[tokenI][2].to.forEach(inner => {
            data[dataI + instructions[tokenI][1] + inner.offset] += inner.add;
          });
        }
        break;

      default:
        throw new Error(`Unknown instruction: ${JSON.stringify(instructions[tokenI])}`);
    }
  }
};
