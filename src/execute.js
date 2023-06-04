'use strict';

/** @typedef {('>'|'<'|'+'|'-'|'.'|','|'['|']')} StringToken */
/** @global {StringToken[]} STRING_TOKENS */
const STRING_TOKENS = ['>', '<', '+', '-', '.', ',', '[', ']'];

/** @param {StringToken[]} tokens */
const validateBraces = tokens => {
  const unmatchedBracesCount = tokens.reduce((openBraces, token) => {
    let inc = token === '[' ? 1 : token === ']' ? -1 : 0;
    if (openBraces + inc < 0) throw 'Error: attempting to close brace without matching opening brace';
    return openBraces + inc;
  }, 0);
  if (unmatchedBracesCount !== 0) throw 'Error: has unmatched braces';
};

/** @param {string} code */
const execute = code => {
  const tokens = code.split('').filter(command => STRING_TOKENS.includes(command));

  validateBraces(tokens);

  let data = [];
  let dataI = 0;
  for (let tokenI = 0; tokenI < tokens.length; tokenI++) {
    if (data[dataI] === undefined) data[dataI] = 0;

    // print(`ip:${tokenI}, i:${tokens[tokenI]}, dp:${dataI}, d:${data[dataI]}`);

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
