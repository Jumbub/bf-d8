load('./src/codeToTokens.js');
load('./src/tokensToNodes.js');
load('./src/simplifyNodes.js');
load('./src/nodeToString.js');
load('./src/nodesToInstructions.js');
load('./src/executeInstructions.js');

const fileName = arguments[0];

const code = read(fileName);

const tokens = codeToTokens(code);
// print(`TOKENS: ${JSON.stringify(tokens)}\n`);

const nodes = tokensToNodes(tokens);
// print(`NODES: ${JSON.stringify(nodes)}\n`);

const simplifiedNodes = simplifyNodes(nodes);
// print(`SIMPLIFIED: ${JSON.stringify(simplifiedNodes)}\n`);

print(`PROGRAM:\n${nodesToString(simplifiedNodes, 1)}\n`);

const instructions = nodesToInstructions(simplifiedNodes);

// print(`INSTRUCTIONS:\n${instructions}\n`);

print(`starting execution ${performance.now()}ms`);
executeInstructions(instructions, Uint8Array, 30000);
print(`finished execution ${performance.now()}ms`);
