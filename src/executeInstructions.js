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
        data[dataI + offset] = readline().charCodeAt(0);
        break;

      case SKIP_IF_ZERO:
        if (data[dataI] === 0) tokenI += offset;
        break;

      case SKIP_IF_NOT_ZERO:
        if (data[dataI] !== 0) tokenI += offset;
        break;

      case SET:
        if (nonTerminatingIfEvent && data[dataI + offset] % 2 === 0) throw new Error('Non-terminating loop!');
        data[dataI + offset] = value;
        break;

      case MOVE_TIL_ZERO:
        while (data[dataI + offset]) {
          dataI += value;
        }
        break;

      case ADD_TIMES_THEN_SET:
        // print('ADD_TIMES_THEN_SET', JSON.stringify(instructions[tokenI]));
        // print('state', dataI, data[dataI], data[dataI + offset]);
        times = 0;
        let number = data[dataI + offset];
        while (number !== 0) {
          times++;
          number += value.divisor;
        }
        value.each.forEach(copy => {
          data[dataI + offset + copy.offset] += times * copy.multiplyer;
        });
        data[dataI + offset] = value.set;
        break;

      default:
        throw new Error(`Unknown operator ${label}`);
    }
  }
};
