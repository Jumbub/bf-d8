load('./src/codeToTokens.js');
load('./src/tokensToNodes.js');
load('./src/nodesToString.js');
load('./src/nodesToInstructions.js');
load('./src/executeInstructions.js');

const fileName = arguments[0];
const bitSize = parseInt(arguments[1] ?? 8);
const memorySize = parseInt(arguments[2] ?? 30000);

const code = read(fileName);

const tokens = codeToTokens(code);
const tokensTime = performance.now();
// print(`TOKENS: ${JSON.stringify(tokens)}\n`);

const nodes = tokensToNodes(tokens);
const nodesTime = performance.now();
// print(`NODES: ${JSON.stringify(nodes)}\n`);

// print(`PROGRAM:\n${nodesToString(nodes, 0)}\n`);

const instructions = nodesToInstructions(nodes);
const instructionsTime = performance.now();

// print(`INSTRUCTIONS:\n${instructions}\n`);

print(`starting execution`);
executeInstructions(instructions, bitSize === 8 ? Uint8Array : bitSize === 16 ? Uint16Array : Uint32Array, memorySize);
const executeInstructionsTime = performance.now();
print(`finished execution ${executeInstructionsTime}ms`);
print(`\ntokens ${tokensTime}ms`);
print(`nodes ${nodesTime - tokensTime}ms`);
print(`instructions ${instructionsTime - nodesTime}ms`);
print(`execution ${performance.now() - instructionsTime}ms`);
