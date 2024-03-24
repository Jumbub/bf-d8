const fileName = arguments[0];
const bitSize = parseInt(arguments[1] ?? 32);
const memorySize = parseInt(arguments[2] ?? 30000);
const debug = !!arguments[3];

if (debug) {
  bootTime = performance.now();
}

load('./src/codeToTokens.js');
load('./src/tokensToNodes.js');
load('./src/simplifyNodes.js');
load('./src/nodesToJs.js');

if (debug) {
  moduleTime = performance.now();
}

const code = read(fileName);
if (debug) {
  readTime = performance.now();
}

const tokens = codeToTokens(code);
if (debug) {
  tokensTime = performance.now();
}

nodes = tokensToNodes(tokens);
if (debug) {
  nodesTime = performance.now();
}

nodes = simplifyNodes(nodes);
if (debug) {
  simplifiedNodesTime = performance.now();
}

const instructions = nodesToJs(nodes, bitSize, memorySize);
if (debug) {
  instructionsTime = performance.now();
}

writeFile('generated.js', instructions);
if (debug) {
  writeTime = performance.now();
}

load('generated.js');
if (debug) {
  executeTime = performance.now();
}

if (debug) {
  print(`bootTime ${bootTime}ms`);
  print(`moduleTime ${moduleTime - bootTime}ms`);
  print(`readTime ${readTime - moduleTime}ms`);
  print(`tokens ${tokensTime - readTime}ms`);
  print(`nodes ${nodesTime - tokensTime}ms`);
  print(`simplification ${simplifiedNodesTime - nodesTime}ms`);
  print(`instructions ${instructionsTime - simplifiedNodesTime}ms`);
  print(`write ${writeTime - instructionsTime}ms`);
  print(`done ${executeTime - writeTime}ms`);
}
