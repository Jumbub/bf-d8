const simplifyLoop = allInstructions => {
  if (allInstructions.length <= 2) return undefined;

  const [first, firstOffset, firstValue] = allInstructions[1];

  if (first === ADD && firstOffset === 0 && allInstructions.length === 3) {
    // WARNING: aggressive optimisation technique, assumes valid program with terminating loop, in which case, the only way to exit the loop is to just assign the current offset to 0
    return [setFactory(0, 0)];
  } else if (first === MOVE && allInstructions.length === 3) {
    // simplify to a js while loop
    return [moveTilZeroFactory(firstOffset)];
  }

  return undefined;
};
