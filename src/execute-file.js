load('./src/execute.js');

const fileName = arguments[0];
const code = read(fileName);

execute(code);

print(`program terminated ${performance.now()}ms`);
