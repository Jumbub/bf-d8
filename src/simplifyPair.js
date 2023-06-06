const simplifyPair = (left, right) => {
  const [leftI, leftOffset, leftValue] = left;
  const [rightI, rightOffset, rightValue] = right;

  if (leftI === ADD && rightI === ADD && leftOffset === rightOffset) {
    // merge mutations at same offset
    return [addFactory(leftOffset, leftValue + rightValue)];
  } else if (leftI === ADD && rightI === ADD && leftOffset > rightOffset) {
    return [right, left];
  } else if (leftI === ADD && rightI === INPUT && leftOffset === rightOffset) {
    // input overrides mutation
    return [right];
  } else if (leftI === ADD && rightI === INPUT && leftOffset > rightOffset) {
    // order left to right
    return [right, left];
  } else if (leftI === ADD && rightI === OUTPUT && leftOffset > rightOffset) {
    // order left to right
    return [right, left];
  } else if (leftI === MOVE && rightI === MOVE && leftOffset + rightOffset === 0) {
    // remove movement
    return [];
  } else if (leftI === MOVE && rightI === MOVE) {
    // merge movements
    return [moveFactory(leftOffset + rightOffset)];
  } else if (leftI === MOVE && rightI === ADD) {
    // prioritise mutations first, accumulating offsets to match operation outcomes
    return [addFactory(leftOffset + rightOffset, rightValue), moveFactory(leftOffset + rightOffset)];
  } else if (leftI === MOVE && rightI === INPUT) {
    // prioritise mutations first, accumulating offsets to match operation outcomes
    return [inputFactory(leftOffset + rightOffset), moveFactory(leftOffset + rightOffset)];
  } else if (leftI === MOVE && rightI === OUTPUT) {
    // prioritise mutations first, accumulating offsets to match operation outcomes
    return [outputFactory(leftOffset + rightOffset), moveFactory(leftOffset + rightOffset)];
  } else if (leftI === MOVE && leftOffset === 0 && rightI === IF_NOT_ZERO_GOTO) {
    // noop
    return [right];
  } else if (leftI === INPUT && rightI === ADD && leftOffset > rightOffset) {
    return [right, left];
  } else if (leftI === INPUT && rightI === INPUT && leftOffset > rightOffset) {
    return [right, left];
  } else if (leftI === INPUT && rightI === OUTPUT && leftOffset > rightOffset) {
    return [right, left];
  } else if (leftI === OUTPUT && rightI === ADD && leftOffset > rightOffset) {
    return [right, left];
  } else if (leftI === OUTPUT && rightI === INPUT && leftOffset > rightOffset) {
    return [right, left];
  }

  return undefined;
};
