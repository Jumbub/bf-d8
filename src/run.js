load('./src/codeToTokens.js');
load('./src/tokensToNodes.js');
load('./src/simplifyNodes.js');
load('./src/nodesToString.js');
load('./src/nodesToInstructions.js');
load('./src/executeInstructions.js');

const fileName = arguments[0];
const bitSize = parseInt(arguments[1] ?? 32);
const memorySize = parseInt(arguments[2] ?? 30000);
const debug = !!arguments[3];

const code = read(fileName);

const tokens = codeToTokens(code);
const tokensTime = performance.now();
// print(`TOKENS: ${JSON.stringify(tokens)}\n`);

nodes = tokensToNodes(tokens);
const nodesTime = performance.now();
// print(`NODES: ${JSON.stringify(nodes)}\n`);

nodes = simplifyNodes(nodes);
const simplifiedNodesTime = performance.now();
// print(`SIMPLIFIED: ${JSON.stringify(nodes)}\n`);

const instructions = nodesToInstructions(nodes, bitSize, memorySize);
const instructionsTime = performance.now();
// print(`INSTRUCTIONS: ${instructions}\n`);

writeFile('generated.js', instructions);
const writeTime = performance.now();

const executeInstructionsTime = performance.now();
load('generated.js');
print(`finished execution ${executeInstructionsTime}ms`);

print(`\ntokens ${tokensTime}ms`);
print(`nodes ${nodesTime - tokensTime}ms`);
print(`simplification ${simplifiedNodesTime - nodesTime}ms`);
print(`instructions ${instructionsTime - simplifiedNodesTime}ms`);
print(`write ${writeTime - instructionsTime}ms`);
print(`execution ${performance.now() - writeTime}ms`);
// writeFile('../working', nodesToString(simplifiedNodes, 0));
