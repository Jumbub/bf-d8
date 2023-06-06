load('./src/simplifyPair.js');
load('./src/simplifyTriplet.js');

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
  if (instructions.length < 2) return instructions;

  let mutated;
  let simpler;
  do {
    mutated = false;
    print('looping simplifyer!');

    // pairs
    simpler = [instructions[0]];
    for (let i = 1; i < instructions.length; i++) {
      const left = simpler.pop();
      const right = instructions[i];

      let simplePair = simplifyPair(left, right);
      if (simplePair) mutated = true;

      simpler.push(...(simplePair ?? [left, right]));
    }
    instructions = [...simpler];

    // triples
    simpler = [instructions[0], instructions[1]];
    for (let i = 2; i < instructions.length; i++) {
      const middle = simpler.pop();
      const left = simpler.pop();
      const right = instructions[i];

      if (middle === undefined) {
        simpler.push(right);
        continue;
      } else if (left === undefined) {
        simpler.push(...[middle, right]);
        continue;
      }

      let simpleTriplet = simplifyTriplet(left, middle, right);
      if (simpleTriplet) mutated = true;

      simpler.push(...(simpleTriplet ?? [left, middle, right]));
    }
    instructions = [...simpler];
  } while (mutated);

  return braceOffsetFixer(instructions);
};
