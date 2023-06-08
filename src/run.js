load('./src/codeToTokens.js');
load('./src/tokensToNodes.js');
load('./src/simplifyNodes.js');
load('./src/nodeToString.js');
load('./src/nodesToInstructions.js');
load('./src/executeInstructions.js');

const fileName = arguments[0];
const bitSize = parseInt(arguments[1] ?? 8);
const memorySize = parseInt(arguments[2] ?? 30000);

const code = read(fileName);

const tokens = codeToTokens(code);
// print(`TOKENS: ${JSON.stringify(tokens)}\n`);

const nodes = tokensToNodes(tokens);
// print(`NODES: ${JSON.stringify(nodes)}\n`);

const simplifiedNodes = simplifyNodes(nodes);
// print(`SIMPLIFIED: ${JSON.stringify(simplifiedNodes)}\n`);

print(`PROGRAM:\n${nodesToString(simplifiedNodes, 0)}\n`);

const instructions = nodesToInstructions(simplifiedNodes);

// print(`INSTRUCTIONS:\n${instructions}\n`);

print(`starting execution ${performance.now()}ms`);
executeInstructions(
  instructions,
  bitSize === 8 ? Uint8Array : bitSize === 16 ? Uint16Array : bitSize === 32 ? Uint32Array : BigUint64Array,
  memorySize,
);
print(`finished execution ${performance.now()}ms`);
