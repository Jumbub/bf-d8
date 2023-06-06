const simplifyTriplet = (left, middle, right) => {
  const [leftI, leftOffset, leftValue] = left;
  const [middleI, middleOffset, middleValue] = middle;
  const [rightI, rightOffset, rightValue] = right;

  if (leftI === IF_ZERO_GOTO && middleI === MUTATE && middleOffset === 0 && rightI === IF_NOT_ZERO_GOTO) {
    // WARNING: assumes that the loop actually terminates
    return [setFactory(0, 0)];
  } else if (leftI === IF_ZERO_GOTO && middleI === MOVE && rightI === IF_NOT_ZERO_GOTO) {
    return [moveTilZeroFactory(middleOffset)];
  }

  return undefined;
};
