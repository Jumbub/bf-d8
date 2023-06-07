const simplifyPair = (left, right) => {
  const [leftI, leftOffset, leftValue] = left;
  const [rightI, rightOffset, rightValue] = right;

  // ensure 0 offset operations are at the front to simplify simplification code
  const rightIsBaseOperation = rightOffset === 0 && leftOffset !== 0;

  if (leftI === ADD && rightI === ADD && leftOffset === rightOffset) {
    // merge mutations at same offset
    return [addFactory(leftOffset, leftValue + rightValue)];
  } else if (leftI === ADD && rightI === ADD && rightIsBaseOperation) {
    return [right, left];
  } else if (leftI === ADD && rightI === SET && rightIsBaseOperation) {
    // return [right, left];
  } else if (leftI === ADD && rightI === SET && rightOffset === leftOffset) {
    // sets after adds override if at the same offset
    return [right];
  } else if (leftI === ADD && rightI === INPUT && leftOffset === rightOffset) {
    // input overrides mutation
    return [right];
  } else if (leftI === ADD && rightI === INPUT && rightIsBaseOperation) {
    // order left to right
    return [right, left];
  } else if (leftI === ADD && rightI === OUTPUT && rightIsBaseOperation) {
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
  } else if (leftI === MOVE && rightI === SET) {
    // print(left);
    // print(right);
    // print(setFactory(leftOffset + rightOffset, rightValue));
    // print(moveFactory(leftOffset + rightOffset));
    // prioritise mutations first, accumulating offsets to match operation outcomes
    // return [setFactory(leftOffset + rightOffset, rightValue), moveFactory(leftOffset + rightOffset)];
  } else if (leftI === MOVE && rightI === INPUT) {
    // prioritise mutations first, accumulating offsets to match operation outcomes
    return [inputFactory(leftOffset + rightOffset), moveFactory(leftOffset + rightOffset)];
  } else if (leftI === MOVE && rightI === OUTPUT) {
    // prioritise mutations first, accumulating offsets to match operation outcomes
    return [outputFactory(leftOffset + rightOffset), moveFactory(leftOffset + rightOffset)];
  } else if (leftI === MOVE && leftOffset === 0 && rightI === IF_NOT_ZERO_GOTO) {
    // noop
    return [right];
  } else if (leftI === INPUT && rightI === ADD && rightIsBaseOperation) {
    return [right, left];
  } else if (leftI === INPUT && rightI === INPUT && rightIsBaseOperation) {
    return [right, left];
  } else if (leftI === INPUT && rightI === OUTPUT && rightIsBaseOperation) {
    return [right, left];
  } else if (leftI === OUTPUT && rightI === ADD && rightIsBaseOperation) {
    return [right, left];
  } else if (leftI === OUTPUT && rightI === INPUT && rightIsBaseOperation) {
    return [right, left];
  } else if (leftI === SET && rightI === ADD && rightOffset === leftOffset) {
    // combine a set followed by an add into a single set (for the same offset)
    return [setFactory(rightOffset, leftValue + rightValue)];
  } else if (leftI === SET && rightI === ADD && rightIsBaseOperation) {
    return [right, left];
  }

  return undefined;
};
