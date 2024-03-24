const ADD = 0;
const MOVE = 1;
const INPUT = 2;
const OUTPUT = 3;
const GOTO_IF_ZERO = 4;
const GOTO_IF_NOT_ZERO = 5;
const SET = 6;
const SET_UNLESS_EVEN = 7;
const MOVE_WHILE_NOT_ZERO = 8;
const TRANSFER = 9;
const TRANSFER_NEGATIVE = 10;

const INSTRUCTION_BYTES = 3;
const nodesToJs = (nodes, bitSize, memorySize) => {
  const memoryDataStructure = bitSize === 8 ? 'Uint8Array' : bitSize === 16 ? 'Uint16Array' : 'Uint32Array';

  return `// Auto-generated JS
const m = new ${memoryDataStructure}(${memorySize});
let p = 0;
function go() {
${nodesToJsRecursive(nodes, 0, 1)}
};
go();`;
};

const nodesToJsRecursive = (nodes, accumulatedOffset, indent) => {
  const ii = '\t'.repeat(indent);
  return nodes
    .flatMap(node => {
      const trueOffset = node.offset + accumulatedOffset;
      if (has(node.whileNotZero)) {
        const inner = nodesToJsRecursive(node.whileNotZero, trueOffset, indent + 1);
        return `${ii}while (m[p] !== 0) {\n${inner}\n${ii}};`;
      } else if (has(node.add)) {
        return `${ii}m[p] += ${node.add};`;
      } else if (has(node.move)) {
        return `${ii}p += ${node.move};`;
      } else if (has(node.input)) {
        return `${ii}m[p] = read();`;
      } else if (has(node.output)) {
        return `${ii}write(String.fromCharCode(m[p]));`;
      }
      throw new Error(`Un-handled node [${JSON.stringify(node)}]`);
    })
    .join('\n');
};
