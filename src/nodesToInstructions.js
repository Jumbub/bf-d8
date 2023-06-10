const ADD = 0;
const MOVE = 1;
const INPUT = 2;
const OUTPUT = 3;
const GOTO_IF_ZERO = 4;
const GOTO_IF_NOT_ZERO = 5;
const SET = 6;
const MOVE_WHILE_NOT_ZERO = 7;
const ADD_WHILE_NOT_ZERO = 8;

// const ADD = 'ADD';
// const MOVE = 'MOVE';
// const INPUT = 'INPUT';
// const OUTPUT = 'OUTPUT';
// const GOTO_IF_ZERO = 'GOTO_IF_ZERO';
// const GOTO_IF_NOT_ZERO = 'GOTO_IF_NOT_ZERO';
// const SET = 'SET';
// const MOVE_WHILE_NOT_ZERO = 'MOVE_WHILE_NOT_ZERO';

const nodesToInstructions = (nodes, accumulatedOffset = 0) =>
  nodes.flatMap(node => {
    const trueOffset = node.offset + accumulatedOffset;
    if (has(node.whileNotZero)) {
      const instructions = nodesToInstructions(node.whileNotZero, trueOffset);
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
      return [[INPUT, trueOffset]];
    } else if (has(node.output)) {
      return [[OUTPUT, trueOffset]];
    } else if (has(node.set)) {
      return [[SET, trueOffset, node.set, node.nonTerminatingIfEven]];
    } else if (has(node.moveWhileNotZero)) {
      return [[MOVE_WHILE_NOT_ZERO, trueOffset, node.moveWhileNotZero]];
    } else if (has(node.addWhileNotZero)) {
      return [[ADD_WHILE_NOT_ZERO, trueOffset, node.addWhileNotZero]];
    }
    throw new Error(`Un-handled node [${JSON.stringify(node)}]`);
  });
