load('./src/debugInstructions.js');

const assertDefined = check => {
  if (typeof check === 'array') {
    if (check.some(value => value === undefined || value === null)) {
      console.error('you messed up', JSON.stringify(check));
      throw new Error('you messed up');
    }
  }
  if (check === undefined) {
    console.error('you messed up', JSON.stringify(check));
    throw new Error('you messed up');
  }
};

const not = value => !value;

const newBlock = ({ inputs, key, startingI }) => {
  assertDefined([inputs, key, startingI]);
  return {
    startingI,
    key, // the unique key for this set of instructions
    inputs,
    outputs: {}, // the final values of addresses we've mutated
    prints: [], // the printed values
    move: 0, // relative position of final I
  };
};

const solvedBlock = ({ solvedBlocks, block }) => {
  assertDefined([solvedBlock, block.key, block.inputs, block.outputs, block.prints]);
  if (!solvedBlocks[block.key]) {
    solvedBlocks[block.key] = [];
  }

  const duplicateEntry = solvedBlocks[block.key].find(existing => {
    return (
      Object.entries(existing.inputs).every(([key, value]) => block.inputs[key] === value) &&
      Object.entries(block.inputs).every(([key, value]) => existing.inputs[key] === value)
    );
  });
  if (duplicateEntry) {
    console.error(
      JSON.stringify({
        solveds: solvedBlocks[block.key].length,
        duplicateEntry,
        block,
      }),
    );
    throw new Error('duplicate entry');
  }
  solvedBlocks[block.key].push({
    inputs: block.inputs,
    outputs: block.outputs,
    prints: block.prints,
    move: block.move,
  });
};

const makeBlockKey = ({ instructions, instructionI, stack = 0 }) => {
  // return instructionI;
  assertDefined([instructions, instructionI, stack]);
  let is = '';
  for (; instructionI < instructions.length; instructionI += INSTRUCTION_BYTES) {
    is +=
      [
        String(instructions[instructionI]),
        String(instructions[instructionI + 1]),
        String(instructions[instructionI + 2]),
      ].join(',') + ',';
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

const findSolvedBlock = ({ solvedBlocks, blockKey, data, dataI }) => {
  assertDefined([solvedBlocks ?? null, blockKey ?? null, data ?? null, dataI ?? null]);
  return (solvedBlocks[blockKey] ?? []).find(compare =>
    Object.entries(compare.inputs).every(([relativeOffsetString, expectedValue]) => {
      const relativeI = Number(relativeOffsetString);
      const absoluteI = dataI + relativeI;
      if (isNaN(relativeI) || isNaN(absoluteI) || isNaN(expectedValue) || data[absoluteI] === undefined) {
        if (absoluteI < 0 || absoluteI >= 30000) {
          console.error('out of bounds');
        }
        console.log(JSON.stringify({ relativeI, absoluteI, expectedValue, d: data[absoluteI] ?? '?' }));
        throw new Error('bad!');
      }
      return data[absoluteI] === expectedValue;
    }),
  );
};

const executeSolvedBlock = ({ block: { outputs, prints, inputs, move }, inProgressBlocks, data, dataPointer }) => {
  assertDefined([outputs, prints, data, dataPointer.dataI]);
  for (const [offsetString, value] of Object.entries(inputs)) {
    const absoluteI = dataPointer.dataI + Number(offsetString);
    inProgressBlocks.forEach(block => {
      const relativeI = absoluteI - block.startingI;
      if (block.inputs[relativeI] == undefined) {
        block.inputs[relativeI] = value;
      }
    });
  }
  for (const [offsetString, value] of Object.entries(outputs)) {
    setData({ inProgressBlocks, data, dataI: dataPointer.dataI + Number(offsetString), value });
  }
  prints.forEach(character => {
    inProgressBlocks.forEach(block => block.prints.push(character));
    write(character);
  });
  inProgressBlocks.forEach(block => (block.move += move));
  dataPointer.dataI += move;
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
  if (data[dataI] === undefined) {
    throw new Error('ran out of tape');
  }
  const value = data[dataI];
  inProgressBlocks.forEach(block => {
    const relativeAddress = dataI - block.startingI;
    if (block.inputs[relativeAddress] == undefined) {
      block.inputs[relativeAddress] = value;
    }
  });
  assertDefined(value);
  return value;
};

const moveDataPointer = ({ inProgressBlocks, movement, dataPointer }) => {
  assertDefined([inProgressBlocks, movement ?? null]);
  inProgressBlocks.forEach(block => {
    block.move += movement;
  });
  dataPointer.dataI += movement;
};

const setData = ({ inProgressBlocks, data, dataI, value }) => {
  assertDefined([inProgressBlocks, data, dataI, value]);
  inProgressBlocks.forEach(block => {
    block.outputs[dataI - block.startingI] = value;
  });
  data[dataI] = value;
};

const count = blocks =>
  Object.entries(blocks).reduce((acc, [, value]) => {
    return acc + value.length;
  }, 0);

const executeInstructions = (instructions, DATA_TYPE, DATA_LENGTH) => {
  let RAW_DATA = new DATA_TYPE(DATA_LENGTH);
  let DATA_POINTER = { dataI: 0 };

  let solvedBlocks = {};
  let inProgressBlocks = [];

  inProgressBlocks.push(
    newBlock({
      inputs: { 0: 0 },
      startingI: 0,
      key: makeBlockKey({ instructions, instructionI: 0, stack: 1 }),
    }),
  );

  for (let instructionI = 0; instructionI < instructions.length; instructionI += INSTRUCTION_BYTES) {
    // console.log(JSON.stringify({ inProgressBlocks }));
    const type = instructions[instructionI];
    const offsetDataI = DATA_POINTER.dataI + instructions[instructionI + 1];
    const value = instructions[instructionI + 2];
    // console.log(debugInstructionsWarningStatefulFunction(data, dataI, [type, instructions[instructionI + 1], value]));

    switch (type) {
      case ADD:
        setData({
          inProgressBlocks,
          data: RAW_DATA,
          dataI: offsetDataI,
          value: getData({ inProgressBlocks, data: RAW_DATA, dataI: offsetDataI }) + value,
        });
        break;

      case MOVE:
        moveDataPointer({ inProgressBlocks, movement: value, dataPointer: DATA_POINTER });
        break;

      case GOTO_IF_ZERO: {
        const startValue = getData({ inProgressBlocks, data: RAW_DATA, dataI: offsetDataI });
        if (startValue === 0) {
          instructionI += value * INSTRUCTION_BYTES;
          break;
        }
        const blockKey = makeBlockKey({ instructions, instructionI });
        // console.log(blockKey);
        const matchingBlock = findSolvedBlock({ solvedBlocks, blockKey, data: RAW_DATA, dataI: DATA_POINTER.dataI });
        // console.log(matchingBlock);
        // console.log(JSON.stringify({ blockKey, matchingBlock }));
        if (matchingBlock) {
          executeSolvedBlock({ block: matchingBlock, inProgressBlocks, data: RAW_DATA, dataPointer: DATA_POINTER });
          instructionI += value * INSTRUCTION_BYTES;
          break;
        } else {
          if (inProgressBlocks.some(b => b.key === blockKey)) {
            throw new Error('impossible');
          }
          inProgressBlocks.push(
            newBlock({
              inputs: { [offsetDataI - DATA_POINTER.dataI]: startValue },
              startingI: DATA_POINTER.dataI,
              key: blockKey,
            }),
          );
        }
        break;
      }

      case GOTO_IF_NOT_ZERO: {
        if (getData({ inProgressBlocks, data: RAW_DATA, dataI: offsetDataI }) !== 0) {
          instructionI += value * INSTRUCTION_BYTES;
        } else {
          solvedBlock({ solvedBlocks, block: inProgressBlocks.pop() });
        }
        break;
      }

      case WRITE: {
        printData({ inProgressBlocks, data: RAW_DATA, dataI: offsetDataI });
        break;
      }

      default:
        throw new Error(`Unknown instruction: ${JSON.stringify(type)}`);
    }
  }

  solvedBlock({ solvedBlocks, block: inProgressBlocks.pop() });
  console.log('\nfinished blocks:', JSON.stringify(solvedBlocks, undefined, 2), count(solvedBlocks));
};
