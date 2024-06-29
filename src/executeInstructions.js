load('./src/debugInstructions.js');

const not = value => !value;
const missing = property => property !== undefined;
const newBlock = value => ({
  offset: value.offset,
  inputs: value.inputs, // the initial values of addresses we've read
  outputs: {}, // the final values of addresses we've mutated
  writes: [], // the printed values
  reads: [],
  instructions: value.instructions, // the instructions
});

const executeInstructions = (instructions, DATA_TYPE, DATA_LENGTH) => {
  let data = new DATA_TYPE(DATA_LENGTH);
  let dataI = 0;

  let finishedBlocks = {};
  let blocks = [];

  const makeInstructions = (instructionI, stack = 0) => {
    let is = '';
    for (; instructionI < instructions.length; instructionI += INSTRUCTION_BYTES) {
      is += String(instructions[instructionI]);
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

  blocks.push(
    newBlock({
      offset: 0,
      inputs: { 0: 0 },
      instructions: makeInstructions(0, 1),
    }),
  );

  const popBlock = () => {
    if (blocks.length == 0) {
      throw new Error(`Bad number of blocks remaining: ${blocks.length}`);
    }
    const block = blocks.pop();
    if (block.reads.length > 0) {
      // throw away
    } else {
      finishedBlocks[block.instructions] = finishedBlocks[block.instructions] ?? [];
      finishedBlocks[block.instructions].push(block);
    }
  };

  const markPushedUserOutput = character => {
    blocks.forEach(block => block.writes.push(character));
  };

  const markPushedUserInput = character => {
    blocks.forEach(block => block.inputs.push(character));
  };

  for (let instructionI = 0; instructionI < instructions.length; instructionI += INSTRUCTION_BYTES) {
    const type = instructions[instructionI];
    const offset = instructions[instructionI + 1];
    const value = instructions[instructionI + 2];

    const pushNewBlock = () => {
      const instructions = makeInstructions(instructionI);

      if (instructions in finishedBlocks) {
        for (const { inputs, outputs, writes } of finishedBlocks[instructions]) {
          if (Object.entries(inputs).every(([key, value]) => data[dataI + Number(key)] === value)) {
            console.log('value!', performance.now());
            for (const [key, value] of Object.entries(outputs)) {
              data[dataI + Number(key)] = value;
            }
            writes.forEach(value => write(value));
            return false;
          }
        }
      }

      const blockOffset = dataI;
      const dataAddress = dataI + offset;
      const relativeDataAddress = dataAddress - blockOffset;
      blocks.push(
        newBlock({
          offset: blockOffset,
          inputs: { [relativeDataAddress]: data[dataAddress] },
          instructions,
        }),
      );
      console.log('pushed', performance.now());
      return true;
    };

    const markReadData = () => {
      blocks.forEach(block => {
        const dataAddress = dataI + offset;
        const relativeDataAddress = dataAddress - block.offset;
        // if first read for address
        if (not(relativeDataAddress in block.inputs)) {
          // store first read value
          block.inputs[relativeDataAddress] = data[dataAddress];
        }
      });
    };

    const markMutatedData = () => {
      blocks.forEach(block => {
        const dataAddress = dataI + offset;
        const relativeDataAddress = dataAddress - block.offset;
        block.outputs[relativeDataAddress] = data[dataAddress];
      });
    };

    switch (type) {
      case ADD:
        markReadData();
        data[dataI + offset] += value;
        markMutatedData();
        break;

      case MOVE:
        dataI += value;
        break;

      case GOTO_IF_ZERO:
        markReadData();
        if (data[dataI + offset] === 0 || !pushNewBlock()) {
          instructionI += value * INSTRUCTION_BYTES;
        }
        break;

      case GOTO_IF_NOT_ZERO:
        markReadData();
        if (data[dataI + offset] !== 0) {
          instructionI += value * INSTRUCTION_BYTES;
        } else {
          popBlock();
        }
        break;

      case WRITE: {
        const character = String.fromCharCode(data[dataI + offset]);
        markMutatedData();
        write(character);
        markPushedUserOutput(character);
        break;
      }

      case READ: {
        const character = (readline() ?? '').charCodeAt(0);
        markReadData();
        data[dataI + offset] = character;
        markPushedUserInput(character);
        break;
      }

      default:
        throw new Error(`Unknown instruction: ${JSON.stringify(type)}`);
    }
  }

  popBlock();

  console.log('\nfinished blocks:', JSON.stringify(finishedBlocks, undefined, 2));
};
