const ADD = 0;
const MOVE = 1;
const INPUT = 2;
const OUTPUT = 3;
const GOTO_IF_ZERO = 4;
const GOTO_IF_NOT_ZERO = 5;
const SET = 6;
const SET_UNLESS_EVEN = 7;
const MOVE_WHILE_NOT_ZERO = 8;
const ADD_WHILE_NOT_ZERO = 9;

// const ADD = 'ADD';
// const MOVE = 'MOVE';
// const INPUT = 'INPUT';
// const OUTPUT = 'OUTPUT';
// const GOTO_IF_ZERO = 'GOTO_IF_ZERO';
// const GOTO_IF_NOT_ZERO = 'GOTO_IF_NOT_ZERO';
// const SET = 'SET';
// const MOVE_WHILE_NOT_ZERO = 'MOVE_WHILE_NOT_ZERO';

const INSTRUCTION_BYTES = 3;
const nodesToInstructions = nodes => {
  const ins = nodesToInstructionsRecursive(nodes, 0);
  const acc = new Int32Array(ins.length * INSTRUCTION_BYTES);
  for (let i = 0; i < ins.length; i++) {
    acc[i * INSTRUCTION_BYTES] = ins[i][0];
    acc[i * INSTRUCTION_BYTES + 1] = ins[i][1];
    acc[i * INSTRUCTION_BYTES + 2] = ins[i][2];
  }
  return acc;
};

const nodesToInstructionsRecursive = (nodes, accumulatedOffset) =>
  nodes.flatMap(node => {
    const trueOffset = node.offset + accumulatedOffset;
    if (has(node.whileNotZero)) {
      const instructions = nodesToInstructionsRecursive(node.whileNotZero, trueOffset);
      return [
        [GOTO_IF_ZERO, trueOffset, instructions.length + 1],
        ...instructions,
        [GOTO_IF_NOT_ZERO, trueOffset, -instructions.length - 1],
      ];
    } else if (has(node.add)) {
      return [[ADD, trueOffset, node.add]];
    } else if (has(node.move)) {
      return [[MOVE, 0, node.move]];
    } else if (has(node.input)) {
      return [[INPUT, trueOffset, 0]];
    } else if (has(node.output)) {
      return [[OUTPUT, trueOffset, 0]];
    } else if (has(node.set)) {
      return node.nonTerminatingIfEven ? [[SET_UNLESS_EVEN, trueOffset, node.set]] : [[SET, trueOffset, node.set]];
    } else if (has(node.moveWhileNotZero)) {
      return [[MOVE_WHILE_NOT_ZERO, trueOffset, node.moveWhileNotZero]];
    } else if (has(node.addWhileNotZero)) {
      return [[ADD_WHILE_NOT_ZERO, trueOffset, node.addWhileNotZero]];
    }
    throw new Error(`Un-handled node [${JSON.stringify(node)}]`);
  });
