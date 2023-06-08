const ADD = 0;
const MOVE = 1;
const INPUT = 2;
const OUTPUT = 3;
const SKIP_IF_ZERO = 4;
const SKIP_IF_NOT_ZERO = 5;
const SET = 6;
const MOVE_TIL_ZERO = 7;
const ADD_TIMES_THEN_SET = 8;

// const ADD = 'ADD';
// const SET = 'SET';
// const MOVE = 'MOVE';
// const INPUT = 'INPUT';
// const OUTPUT = 'OUTPUT';
// const SKIP_IF_ZERO = 'SKIP_IF_ZERO';
// const SKIP_IF_NOT_ZERO = 'SKIP_IF_NOT_ZERO';

const nodesToInstructions = nodes => {
  return nodes.flatMap(node => {
    if (has(node.nodes)) {
      const instructions = nodesToInstructions(node.nodes);
      return [[SKIP_IF_ZERO, instructions.length], ...instructions, [SKIP_IF_NOT_ZERO, -instructions.length - 1]];
    } else if (has(node.add)) {
      return [[ADD, node.offset, node.add]];
    } else if (has(node.move)) {
      return [[MOVE, node.move]];
    } else if (has(node.input)) {
      return [[INPUT, node.offset]];
    } else if (has(node.output)) {
      return [[OUTPUT, node.offset]];
    } else if (has(node.set)) {
      return [[SET, node.offset, node.set, node.nonTerminatingIfEven]];
    } else if (has(node.moveTilZero)) {
      return [[MOVE_TIL_ZERO, node.offset, node.moveTilZero]];
    } else if (has(node.addTimesThenSet)) {
      return [[ADD_TIMES_THEN_SET, node.offset, node.addTimesThenSet]];
    }
    throw new Error(`Un-handled node [${JSON.stringify(node)}]`);
  });
};
