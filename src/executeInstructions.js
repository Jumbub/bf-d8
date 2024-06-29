load('./src/debugInstructions.js');

const assertDefined = check => {
  if (typeof check === 'array') {
    if (check.some(value => value === undefined)) {
      throw new Error('you messed up');
    }
  }
  if (check === undefined) {
    throw new Error('you messed up');
  }
};

const not = value => !value;

const newBlock = ({ startAddress, key }) => {
  assertDefined([startAddress, key]);
  return {
    key, // the unique key for this set of instructions
    startAddress,
    inputs: { [startAddress]: 0 }, // you can only start blocks if the value is 0 for the current address
    outputs: {}, // the final values of addresses we've mutated
    prints: [], // the printed values
  };
};

const solvedBlock = ({ solvedBlocks, block }) => {
  assertDefined(solvedBlock, block);
  if (!solvedBlocks[block.key]) {
    solvedBlocks[block.key] = [];
  }
  if (
    solvedBlocks[block.key].some(existing => {
      if (Object.entries(existing.inputs).every(([key, value]) => block.inputs[key] === value)) {
        throw new Error('duplicate entry');
      }
    })
  )
    solvedBlocks[block.key].push({ inputs: block.inputs, outputs: block.outputs, prints: block.prints });
};

const makeBlockKey = ({ instructions, instructionI, stack = 0 }) => {
  assertDefined([instructions, instructionI, stack]);
  let is = '';
  for (; instructionI < instructions.length; instructionI += INSTRUCTION_BYTES) {
    is += [
      String(instructions[instructionI]),
      String(instructions[instructionI + 1]),
      String(instructions[instructionI + 2]),
    ].join(':');
    if (instructions[instructionI] === GOTO_IF_ZERO) {
      stack++;
    } else if (instructions[instructionI] === GOTO_IF_NOT_ZERO) {
      stack--;
    }
    if (stack === 0) {
      return is;
    }
  }
  return is;
};

const findSolvedBlock = ({ solvedBlocks, blockKey, data, startAddress }) => {
  assertDefined([solvedBlocks, blockKey, data, startAddress]);
  for (const solvedBlock of solvedBlocks[blockKey] ?? []) {
    const inputIsMatch = Object.entries(inputs).every(
      ([relativeOffset, expectedValue]) => data[startAddress + Number(relativeOffset)] === expectedValue,
    );
    if (inputIsMatch) {
      // console.log('omg skipped block!', count(), performance.now());
      return solvedBlock;
    }
  }
  return null;
};

const executeSolvedBlock = ({ block: { outputs, prints }, data, startAddress }) => {
  assertDefined([outputs, prints, data, startAddress]);
  for (const [relativeOffset, value] of Object.entries(outputs)) {
    data[startAddress + Number(relativeOffset)] = value;
  }
  prints.forEach(value => write(value));
};

const printData = ({ inProgressBlocks, data, dataI }) => {
  assertDefined([inProgressBlocks, data, dataI]);
  // console.log(JSON.stringify({ inProgressBlocks, data, dataI }));
  const character = String.fromCharCode(getData({ inProgressBlocks, data, dataI }));
  inProgressBlocks.forEach(block => block.prints.push(character));
  write(character);
};

const getData = ({ inProgressBlocks, data, dataI }) => {
  assertDefined([inProgressBlocks, data, dataI]);
  const value = data[dataI];
  inProgressBlocks.forEach(block => {
    const relativeAddress = dataI - block.startAddress;
    if (block.inputs[relativeAddress] == undefined) {
      block.inputs[relativeAddress] = value;
    }
  });
  return value;
};

const setData = ({ inProgressBlocks, data, dataI, value }) => {
  assertDefined([inProgressBlocks, data, dataI, value]);
  inProgressBlocks.forEach(block => {
    block.outputs[dataI - block.startAddress] = value;
  });
  data[dataI] = value;
};

const count = blocks => Object.entries(blocks).reduce((acc, value) => acc + value.length, 0);

const executeInstructions = (instructions, DATA_TYPE, DATA_LENGTH) => {
  let data = new DATA_TYPE(DATA_LENGTH);
  let dataI = 0;

  let solvedBlocks = {};
  let inProgressBlocks = [];

  inProgressBlocks.push(
    newBlock({
      key: makeBlockKey({ instructions, instructionI: 0, stack: 1 }),
      startAddress: 0,
    }),
  );

  let ii = 0;
  for (let instructionI = 0; instructionI < instructions.length; instructionI += INSTRUCTION_BYTES) {
    ii++;

    if (ii % 1000 === 0) {
      // console.log(JSON.stringify(inProgressBlocks));
    }

    // console.log(JSON.stringify({ inProgressBlocks }));
    const type = instructions[instructionI];
    const offsetDataI = dataI + instructions[instructionI + 1];
    const value = instructions[instructionI + 2];
    // console.log(debugInstructionsWarningStatefulFunction(data, dataI, [type, instructions[instructionI + 1], value]));

    switch (type) {
      case ADD:
        setData({
          inProgressBlocks,
          data,
          dataI: offsetDataI,
          value: getData({ inProgressBlocks, data, dataI: offsetDataI }) + value,
        });
        break;

      case MOVE:
        dataI += value;
        break;

      case GOTO_IF_ZERO: {
        if (getData({ inProgressBlocks, data, dataI: offsetDataI }) === 0) {
          instructionI += value * INSTRUCTION_BYTES;
          break;
        }
        const matchingBlock = findSolvedBlock({ solvedBlocks, data, startAddress: dataI });
        // console.log(JSON.stringify({ matchingBlock }));
        if (matchingBlock) {
          executeSolvedBlock({ block: matchingBlock, data, startAddress: dataI });
        } else {
          inProgressBlocks.push(
            newBlock({
              key: makeBlockKey({ instructions, instructionI }),
              startAddress: dataI,
            }),
          );
        }
        break;
      }

      case GOTO_IF_NOT_ZERO: {
        if (getData({ inProgressBlocks, data, dataI: offsetDataI }) !== 0) {
          instructionI += value * INSTRUCTION_BYTES;
        } else {
          solvedBlock({ solvedBlocks, block: inProgressBlocks.pop() });
          // console.log(count(solvedBlocks), inProgressBlocks.length);
        }
        break;
      }

      case WRITE: {
        printData({ inProgressBlocks, data, dataI: offsetDataI });
        break;
      }

      default:
        throw new Error(`Unknown instruction: ${JSON.stringify(type)}`);
    }
  }

  solvedBlock({ solvedBlocks, block: inProgressBlocks.pop() });
  // console.log('\nfinished blocks:', JSON.stringify(solvedBlocks, undefined, 2));
};
