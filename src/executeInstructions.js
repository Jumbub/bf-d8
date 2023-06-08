const executeInstructions = (instructions, DATA_TYPE, DATA_LENGTH) => {
  let data = new DATA_TYPE(DATA_LENGTH);
  let dataI = 0;
  for (let tokenI = 0; tokenI < instructions.length; tokenI++) {
    const [label, offset, value] = instructions[tokenI];
    // print(dataI, data[dataI], label, offset, value);
    // if (isNaN(dataI)) throw new Error('wtf');
    // if (isNaN(data[dataI])) throw new Error('wtf');
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

      // case SET:
      //   data[dataI + offset] = value;
      //   break;

      // case COPY_TO:
      //   data[dataI + offset] += data[dataI] * value;
      //   break;

      // case MOVE_TIL_ZERO:
      //   while (data[dataI]) {
      //     dataI += offset;
      //   }
      //   break;

      default:
        throw new Error(`Unknown operator ${label}`);
    }
  }
};
