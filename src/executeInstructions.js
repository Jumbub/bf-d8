const executeInstructions = (instructions, DATA_TYPE, DATA_LENGTH) => {
  let data = new DATA_TYPE(DATA_LENGTH);
  let dataI = 0;
  for (let tokenI = 0; tokenI < instructions.length; tokenI++) {
    const [label, offset, value, nonTerminatingIfEvent] = instructions[tokenI];
    switch (label) {
      case ADD:
        data[dataI + offset] += value;
        break;

      case MOVE:
        dataI += offset;
        break;

      case OUTPUT:
        write(String.fromCharCode(data[dataI + offset]));
        break;

      case INPUT:
        // note: readline returns undefined in non-interactive environments
        data[dataI + offset] = (readline() ?? '').charCodeAt(0);
        break;

      case SKIP_IF_ZERO:
        if (data[dataI] === 0) tokenI += offset;
        break;

      case SKIP_IF_NOT_ZERO:
        if (data[dataI] !== 0) tokenI += offset;
        break;

      // case SET:
      //   if (nonTerminatingIfEvent && data[dataI + offset] % 2 === 0) throw new Error('Non-terminating loop!');
      //   data[dataI + offset] = value;
      //   break;

      // case MOVE_TIL_ZERO:
      //   while (data[dataI + offset]) {
      //     dataI += value;
      //   }
      //   break;

      default:
        throw new Error(`Unknown instruction: ${JSON.stringify(instructions[tokenI])}`);
    }
  }
};
