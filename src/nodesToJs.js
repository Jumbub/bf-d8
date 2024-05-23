const nodesToJs = (nodes, bitSize, memorySize) => {
  const memoryDataStructure = bitSize === 8 ? 'Uint8Array' : bitSize === 16 ? 'Uint16Array' : 'Uint32Array';
  const maxValue = Math.pow(2, bitSize);

  const invoke = nodesToJsRecursive(nodes, 0, 1, maxValue);

  return `// Auto-generated JS
const m = new ${memoryDataStructure}(${memorySize});
let p = 0;

function w(o) {
  write(String.fromCharCode(m[p + o]));
}

${Object.entries(methods)
  .map(([, { code }]) => code)
  .join('\n')}

${invoke}`;
};

let methodNumber = 0;
let methods = {};

const nodesToJsRecursive = (nodes, accumulatedOffset, indent, maxValue) => {
  let hasFunctionCalls = false;
  const code = nodes
    .flatMap(node => {
      const trueOffset = node.offset + accumulatedOffset;
      if (has(node.while)) {
        hasFunctionCalls = true;
        if (node.while.value <= -maxValue || node.while.value >= maxValue) throw new Error('bad!');
        const invoke = nodesToJsRecursive(node.while.loop, trueOffset, indent + 1, maxValue);
        return `\twhile (m[p + ${trueOffset}] ${node.while.not ? '!' : '='}== ${
          node.while.value < 0 ? maxValue + node.while.value : node.while.value
        }) {\n\t\t${invoke}\n\t};`;
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

  if (!hasFunctionCalls) {
    return code;
  }

  const existingMethod = methods[code];
  if (existingMethod) {
    return `${existingMethod.name}()`;
  }

  const methodName = `method${++methodNumber}`;

  methods[code] = {
    name: methodName,
    code: `function ${methodName}(){
${code}
}\n`,
  };

  return `${methodName}()`;
};
