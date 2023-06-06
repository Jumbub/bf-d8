const simplifyPair = (left, right) => {
  const [leftI, leftOffset, leftValue] = left;
  const [rightI, rightOffset, rightValue] = right;

  if (leftI === MUTATE && rightI === MUTATE && leftOffset === rightOffset) {
    // merge mutations at same offset
    return [mutateFactory(leftOffset, leftValue + rightValue)];
  } else if (leftI === MUTATE && rightI === MUTATE && leftOffset > rightOffset) {
    return [right, left];
  } else if (leftI === MUTATE && rightI === INPUT && leftOffset === rightOffset) {
    // input overrides mutation
    return [right];
  } else if (leftI === MUTATE && rightI === INPUT && leftOffset > rightOffset) {
    // order left to right
    return [right, left];
  } else if (leftI === MUTATE && rightI === OUTPUT && leftOffset > rightOffset) {
    // order left to right
    return [right, left];
  } else if (leftI === MOVE && rightI === MOVE) {
    // merge movements
    return [moveFactory(leftOffset + rightOffset)];
  } else if (leftI === MOVE && rightI === MUTATE) {
    // prioritise mutations first, accumulating offsets to match operation outcomes
    return [mutateFactory(leftOffset + rightOffset, rightValue), moveFactory(leftOffset + rightOffset)];
  } else if (leftI === MOVE && rightI === INPUT) {
    // prioritise mutations first, accumulating offsets to match operation outcomes
    return [inputFactory(leftOffset + rightOffset), moveFactory(leftOffset + rightOffset)];
  } else if (leftI === MOVE && rightI === OUTPUT) {
    // prioritise mutations first, accumulating offsets to match operation outcomes
    return [outputFactory(leftOffset + rightOffset), moveFactory(leftOffset + rightOffset)];
  } else if (leftI === INPUT && rightI === MUTATE && leftOffset > rightOffset) {
    return [right, left];
  } else if (leftI === INPUT && rightI === INPUT && leftOffset > rightOffset) {
    return [right, left];
  } else if (leftI === INPUT && rightI === OUTPUT && leftOffset > rightOffset) {
    return [right, left];
  } else if (leftI === OUTPUT && rightI === MUTATE && leftOffset > rightOffset) {
    return [right, left];
  } else if (leftI === OUTPUT && rightI === INPUT && leftOffset > rightOffset) {
    return [right, left];
  }

  return undefined;
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
  if (instructions.length === 0) return instructions;

  let mutated;
  do {
    let simpler = [instructions[0]];
    mutated = false;
    for (let i = 1; i < instructions.length; i++) {
      const left = simpler.pop();
      const right = instructions[i];
      let simplePair = simplifyPair(left, right);

      if (simplePair) mutated = true;

      simpler.push(...(simplePair ?? [left, right]));
    }
    instructions = [...simpler];
  } while (mutated);

  return braceOffsetFixer(instructions);
};
