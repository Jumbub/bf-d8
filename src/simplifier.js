const simplifyPair = (left, right) => {
  const [leftI, leftOffset, leftValue] = left;
  const [rightI, rightOffset, rightValue] = right;

  if (leftI === MUTATE && rightI === MUTATE && leftOffset === 0 && leftOffset === rightOffset) {
    return [mutateFactory(0, leftValue + rightValue)];
  }

  return [left, right];
};

const braceOffsetFixer = instructions => {
  let openedBracePositions = [];
  for (let i = 0; i < instructions.length; i++) {
    const [label] = instructions[i];

    if (label === IF_ZERO_GOTO) {
      openedBracePositions.push(i);
    } else if (label === IF_NOT_ZERO_GOTO) {
      const openPosition = openedBracePositions.pop();
      instructions[openPosition][OFFSET_OFFSET] = i - openPosition;
      instructions[i][OFFSET_OFFSET] = openPosition - i;
    }
  }
  return instructions;
};

const instructionSimplifier = instructions => {
  let simpler = [instructions[0]];

  for (let i = 1; i < instructions.length; i++) {
    const left = simpler.pop();
    const right = instructions[i];
    simpler.push(...simplifyPair(left, right));
  }

  return braceOffsetFixer(simpler);
};
