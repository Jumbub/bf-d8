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
        } else if (node.while && node.while.loop.length === 1 && node.while.loop[0].add) {
          // [-] => (set to 0) :: Technically this could break non-terminating apps, so store a non-termination check.
          const inner = node.while.loop[0];
          simple = [{ set: 0, offset: inner.offset, nonTerminatingIfEven: !inner.add }];
        } else if (node.while) {
          // [...] => [(simplified ...)]
          const simplified = simplifyNodes(node.while.loop);
          if (simplified !== node.while.loop) simple = [{ ...node, while: { ...node.while, loop: simplified } }];
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
