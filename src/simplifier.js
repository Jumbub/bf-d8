load('./src/simplifyPair.js');
load('./src/simplifyTriplet.js');
load('./src/simplifyLoop.js');

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

    // loops
    let loops = [[]];
    for (let i = 0; i < instructions.length; i++) {
      loops = loops.map(loop => [...loop, instructions[i]]);

      if (instructions[i][0] === IF_ZERO_GOTO) {
        loops.push([instructions[i]]);
      } else if (instructions[i][0] === IF_NOT_ZERO_GOTO) {
        let current = loops.pop();

        const simplified = simplifyLoop(current);
        if (simplified) mutated = true;

        loops = loops.map(loop => {
          const beforeLoop = loop.splice(0, loop.length - current.length);
          return [...beforeLoop, ...(simplified ?? current)];
        });
      }
    }
    instructions = [...loops[0]];
  } while (mutated);

  return braceOffsetFixer(instructions);
};
