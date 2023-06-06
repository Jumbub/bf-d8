'use strict';

load('./src/tokenizer.js');
load('./src/instructions.js');

const DATA_LENGTH = 30000;
const DATA_TYPE = Uint8Array;

/** @param {string} code */
const execute = code => {
  const tokens = tokenize(code);
  const instructions = instructionsFactory(tokens);
  print(instructions);

  let data = new DATA_TYPE(DATA_LENGTH);
  let dataI = 0;
  for (let tokenI = 0; tokenI < tokens.length; tokenI++) {
    if (data[dataI] === undefined) data[dataI] = 0;

    switch (tokens[tokenI]) {
      case '>':
        dataI++;
        break;

      case '<':
        dataI--;
        break;

      case '+':
        data[dataI]++;
        break;

      case '-':
        data[dataI]--;
        break;

      case '.':
        write(String.fromCharCode(data[dataI]));
        break;

      case ',':
        data[dataI] = readline().charCodeAt(0);
        break;

      case '[':
        if (data[dataI] === 0) {
          let innerBraces = 0;
          tokenI++;
          while (!(tokens[tokenI] === ']' && innerBraces === 0)) {
            if (tokens[tokenI] === '[') innerBraces++;
            else if (tokens[tokenI] === ']') innerBraces--;
            tokenI++;
          }
        }
        break;

      case ']':
        if (data[dataI] !== 0) {
          let innerBraces = 0;
          tokenI--;
          while (!(tokens[tokenI] === '[' && innerBraces === 0)) {
            if (tokens[tokenI] === ']') innerBraces++;
            else if (tokens[tokenI] === '[') innerBraces--;
            tokenI--;
          }
        }
        break;
    }
  }
};
