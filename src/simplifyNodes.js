const has = property => property !== undefined;

const simplifyNodes = allNodes => {
  for (let size = 1; size <= allNodes.length; size++) {
    for (let offset = 0; offset <= allNodes.length - size; offset++) {
      const nodes = allNodes.slice(offset, offset + size);
      let simple = undefined;

      if (nodes.length === 1) {
        const [node] = nodes;

        if (node.move === 0) {
          // >< => nothing
          simple = [];
        } else if (node.add === 0) {
          // +- => nothing
          simple = [];
        } else if (node.whileNotZero?.length === 0) {
          // [] => nothing
          simple = [];
        } else if (node.whileNotZero?.length === 1 && node.whileNotZero[0].move) {
          // [>] => (move 1 while not zero)
          simple = [{ offset: node.offset, moveWhileNotZero: node.whileNotZero[0].move }];
        } else if (
          false &&
          node.whileNotZero?.filter(inner => inner.add === undefined).length == 0 &&
          node.whileNotZero?.filter(inner => inner.add !== undefined).length >= 2 &&
          node.whileNotZero?.filter(inner => inner.offset === 0).length == 1
        ) {
          // [-->+>++] (while A not zero (add -2 to A; add +1 to B; add +2 to B))
          simple = [
            {
              addWhileNotZero: {
                from: node.whileNotZero.find(inner => inner.offset === 0),
                to: node.whileNotZero.filter(inner => inner.offset !== 0),
              },
              offset: node.offset,
            },
          ];
        } else if (node.whileNotZero?.length === 1 && node.whileNotZero[0].add) {
          // [-] => (set to 0)
          // Technically this could break non-terminating apps, so store a non-termination check.
          const inner = node.whileNotZero[0];
          simple = [{ set: 0, offset: inner.offset, nonTerminatingIfEven: !inner.add }];
        } else if (node.whileNotZero) {
          // [...] => [(simplified ...)]
          const simplified = simplifyNodes(node.whileNotZero);
          if (simplified !== node.whileNotZero) simple = [{ offset: node.offset, whileNotZero: simplified }];
        }
      } else if (nodes.length === 2) {
        const [left, right] = nodes;

        if (left.add && right.add && left.offset === right.offset) {
          // +- => (add 1-1)
          simple = [{ offset: left.offset, add: left.add + right.add }];
        } else if (left.move && right.move) {
          // >< => (move 1-1)
          simple = [{ move: left.move + right.move }];
        } else if (left.move && right.offset !== undefined) {
          // >+ => (add 1 offset 1),(move 1)
          simple = [{ ...right, offset: left.move + right.offset }, { move: left.move + right.offset }];
        } else if (left.set !== undefined && right.add !== undefined && left.offset === right.offset) {
          // (set 1)(add 2) => (set 3)
          simple = [{ set: left.set + right.add, offset: left.offset }];
        }
      }

      if (simple) {
        allNodes = [...allNodes.slice(0, offset), ...simple, ...allNodes.slice(offset + size, allNodes.length)];
        size = 0;
        break;
      }
    }
  }
  return allNodes;
};
