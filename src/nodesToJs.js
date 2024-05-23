const nodesToJs = (nodes, bitSize, memorySize) => {
  const memoryDataStructure = bitSize === 8 ? 'Uint8Array' : bitSize === 16 ? 'Uint16Array' : 'Uint32Array';
  const maxValue = Math.pow(2, bitSize);

  const startMethodName = nodesToJsRecursive(nodes, 0, 1, maxValue);

  return `// Auto-generated JS
const m = new ${memoryDataStructure}(${memorySize});
let p = 0;

function w(o) {
  write(String.fromCharCode(m[p + o]));
}

${methods}

${startMethodName}()`;
};

let methodNumber = 0;
let methods = ``;

const nodesToJsRecursive = (nodes, accumulatedOffset, indent, maxValue) => {
  const code = nodes
    .flatMap(node => {
      const trueOffset = node.offset + accumulatedOffset;
      if (has(node.while)) {
        if (node.while.value <= -maxValue || node.while.value >= maxValue) throw new Error('bad!');
        print(node.while.value, maxValue);
        const methodName = nodesToJsRecursive(node.while.loop, trueOffset, indent + 1, maxValue);
        return `\twhile (m[p + ${trueOffset}] ${node.while.not ? '!' : '='}== ${
          node.while.value < 0 ? maxValue + node.while.value : node.while.value
        }) {\n\t\t${methodName}()\n\t};`;
      } else if (has(node.add)) {
        return `\tm[p + ${trueOffset}] += ${node.add};`;
      } else if (has(node.move)) {
        return `\tp += ${node.move};`;
      } else if (has(node.input)) {
        return `\tm[p + ${trueOffset}] = read();`;
      } else if (has(node.output)) {
        return `\tw(${trueOffset});`;
      } else if (has(node.set) && !node.nonTerminatingIfEven) {
        return `\tm[p + ${trueOffset}] = ${node.set};`;
      }
      throw new Error(`Un-handled node [${JSON.stringify(node)}]`);
    })
    .join('\n');

  const methodName = `method${++methodNumber}`;

  methods += `function ${methodName}(){
${code}
}\n`;

  return methodName;
};
