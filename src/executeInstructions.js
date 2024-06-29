load('./src/debugInstructions.js');

const not = value => !value;
const missing = property => property !== undefined;
const newBlock = value => ({
  inputs: value.inputs, // the initial values of addresses we've read
  outputs: {}, // the final values of addresses we've mutated
  writes: [], // the printed values
  reads: false, // too lazy to build out input handling
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
      inputs: { 0: 0 },
      instructions: makeInstructions(0, 1),
    }),
  );

  const popBlock = () => {
    if (blocks.length == 0) {
      throw new Error(`Bad number of blocks remaining: ${blocks.length}`);
    }
    const block = blocks.pop();
    finishedBlocks[block.instructions] = finishedBlocks[block.instructions] ?? [];
    finishedBlocks[block.instructions].push(block);
  };

  const markPushedUserOutput = character => {
    blocks.forEach(block => block.writes.push(character));
  };

  for (let instructionI = 0; instructionI < instructions.length; instructionI += INSTRUCTION_BYTES) {
    const type = instructions[instructionI];
    const offset = instructions[instructionI + 1];
    const value = instructions[instructionI + 2];

    const pushNewBlock = () => {
      blocks.push(
        newBlock({
          inputs: { [dataI + offset]: data[dataI + offset] },
          instructions: makeInstructions(instructionI),
        }),
      );
      return true;
    };

    const markReadData = () => {
      blocks.forEach(block => {
        // if first read for address
        if (not(dataI + offset in block.inputs)) {
          // store first read value
          block.inputs[dataI + offset] = data[dataI + offset];
        }
      });
    };

    const markMutatedData = () => {
      blocks.forEach(block => {
        block.outputs[dataI + offset] = data[dataI + offset];
      });
    };

    const markReadUserInput = () => {
      blocks.forEach(block => {
        block.reads = true;
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
        if (data[dataI + offset] === 0) {
          instructionI += value * INSTRUCTION_BYTES;
        } else {
          if (!pushNewBlock()) {
            instructionI += value * INSTRUCTION_BYTES;
          }
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

      case WRITE:
        const character = String.fromCharCode(data[dataI + offset]);
        markMutatedData();
        write(character);
        markPushedUserOutput(character);
        break;

      case READ:
        markReadData();
        markReadUserInput();
        blocks.forEach(block => block.writes.push(character));
        // execute
        data[dataI + offset] = (readline() ?? '').charCodeAt(0);
        break;

      default:
        throw new Error(`Unknown instruction: ${JSON.stringify(type)}`);
    }
  }

  popBlock();

  console.log('\nfinished blocks:', JSON.stringify(finishedBlocks, undefined, 2));
};
