const simplifyLoop = allInstructions => {
  if (allInstructions.length <= 2) return undefined;

  const [first, firstOffset, firstValue] = allInstructions[1];

  const nonBraceInstructions = allInstructions.filter(
    ([label]) => label !== IF_NOT_ZERO_GOTO && label !== IF_ZERO_GOTO,
  );
  const addInstructions = allInstructions.filter(([label]) => label === ADD);
  const onlyAddInstructions = addInstructions.length === allInstructions.length - 2;
  const zeroOffsets = addInstructions.filter(([, offset]) => offset === 0);
  const nonZeroOffsets = addInstructions.filter(([, offset]) => offset !== 0);

  const uniqueOffsets = instructions => {
    let offsets = [];
    return instructions.every(([, offset]) => {
      if (offsets.includes(offset)) {
        return false;
      } else {
        offsets.push(offset);
        return true;
      }
    });
  };

  if (first === ADD && firstOffset === 0 && allInstructions.length === 3) {
    // WARNING: aggressive optimisation technique, assumes valid program with terminating loop, in which case, the only way to exit the loop is to just assign the current offset to 0
    return [setFactory(0, 0)];
  } else if (first === MOVE && allInstructions.length === 3) {
    // simplify to a js while loop
    return [moveTilZeroFactory(firstOffset)];
  } else if (onlyAddInstructions && zeroOffsets.length === 1 && firstOffset === 0 && uniqueOffsets(nonZeroOffsets)) {
    // COPY LOOP: `[->+<]`, `[->+>++<<]`, etc.
    // only run simplification after the pairs are simplified, i.e. only 1 zero offset add left
    const copyTo = nonZeroOffsets.map(([, offset, multiplyer]) => copyToFactory(offset, multiplyer / -firstValue));
    return [...copyTo, setFactory(0, 0)];
  } else if (nonBraceInstructions.every(([label]) => [INPUT, OUTPUT].includes(label))) {
    // WARNING: aggressive optimisation technique, assumes valid program with terminating loop, in which case, the only way to exit the loop is to mutate the pointer position or the data
    return [];
  }

  return undefined;
};
