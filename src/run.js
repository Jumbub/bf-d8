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
const tokensTime = performance.now();
// print(`TOKENS: ${JSON.stringify(tokens)}\n`);

const nodes = tokensToNodes(tokens);
const nodesTime = performance.now();
// print(`NODES: ${JSON.stringify(nodes)}\n`);

const simplifiedNodes = simplifyNodes(nodes);
const simplifiedNodesTime = performance.now();
// print(`SIMPLIFIED: ${JSON.stringify(simplifiedNodes)}\n`);

// print(`PROGRAM:\n${nodesToString(simplifiedNodes, 0)}\n`);

const instructions = nodesToInstructions(simplifiedNodes);
const instructionsTime = performance.now();

// print(`INSTRUCTIONS:\n${instructions}\n`);

print(`starting execution`);
executeInstructions(instructions, bitSize === 8 ? Uint8Array : bitSize === 16 ? Uint16Array : Uint32Array, memorySize);
const executeInstructionsTime = performance.now();
print(`finished execution ${executeInstructionsTime}ms`);
print(`\ntokens ${tokensTime}ms`);
print(`nodes ${nodesTime - tokensTime}ms`);
print(`simplification ${simplifiedNodesTime - nodesTime}ms`);
print(`instructions ${instructionsTime - simplifiedNodesTime}ms`);
print(`execution ${performance.now() - instructionsTime}ms`);

// writeFile('../working', nodesToString(simplifiedNodes, 0));
