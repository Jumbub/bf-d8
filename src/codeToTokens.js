const TOKENS = ['>', '<', '+', '-', '.', ',', '[', ']'];

const throwIfInvalidBraces = tokens => {
  const unmatchedBracesCount = tokens.reduce((openBraces, token) => {
    let inc = token === '[' ? 1 : token === ']' ? -1 : 0;
    if (openBraces + inc < 0) throw 'Error: attempting to close brace without matching opening brace';
    return openBraces + inc;
  }, 0);
  if (unmatchedBracesCount !== 0) throw 'Error: has unmatched braces';
  return tokens;
};

const codeToTokens = code => throwIfInvalidBraces(code.split('').filter(command => TOKENS.includes(command)));
