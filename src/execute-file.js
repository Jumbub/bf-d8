load('./src/execute.js');

const fileName = arguments[0];
const code = read(fileName);

execute(code);

print(`BF_END ${performance.now()}ms`);
