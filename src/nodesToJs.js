const nodesToJs = (nodes, bitSize, memorySize) => {
  const memoryDataStructure = bitSize === 8 ? 'Uint8Array' : bitSize === 16 ? 'Uint16Array' : 'Uint32Array';

  return `// Auto-generated JS
const m = new ${memoryDataStructure}(${memorySize});
let p = 0;

function w(o) {
  write(String.fromCharCode(m[p + o]));
}

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
        return `${ii}while (m[p + ${trueOffset}] !== 0) {\n${inner}\n${ii}};`;
      } else if (has(node.add)) {
        return `${ii}m[p + ${trueOffset}] += ${node.add};`;
      } else if (has(node.move)) {
        return `${ii}p += ${node.move};`;
      } else if (has(node.input)) {
        return `${ii}m[p + ${trueOffset}] = read();`;
      } else if (has(node.output)) {
        return `${ii}w(${trueOffset});`;
      } else if (has(node.set) && !node.nonTerminatingIfEven) {
        return `${ii}m[p + ${trueOffset}] = ${node.set};`;
      }
      throw new Error(`Un-handled node [${JSON.stringify(node)}]`);
    })
    .join('\n');
};
