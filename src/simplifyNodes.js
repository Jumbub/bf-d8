const has = property => property !== undefined;

const simplifyNodes = allNodes => {
  for (let size = 1; size <= allNodes.length; size++) {
    for (let offset = 0; offset <= allNodes.length - size; offset++) {
      const nodes = allNodes.slice(offset, offset + size);
      let simple = undefined;

      if (nodes.length === 1) {
        const [node] = nodes;

        if (has(node.nodes) && node.nodes.length === 1 && has(node.nodes[0].add)) {
          // for this loop to exit, the data must be 0
          // (note: if the current data value is odd, and the add value is even, this loop never terminates)
          simple = [{ set: 0, offset: node.nodes[0].offset, nonTerminatingIfEven: !(node.nodes[0].add % 2) }];
        } else if (has(node.nodes) && node.nodes.length === 1 && has(node.nodes[0].move)) {
          // use 1 instruction to represent moving in a loop
          simple = [{ moveTilZero: node.nodes[0].move, offset: 0 }];
        } else if (has(node.nodes)) {
          // recurse into loop, simplifying looping instructions in isolation
          const simplifiedNodes = simplifyNodes(node.nodes);
          if (simplifiedNodes !== node.nodes) simple = [{ ...node, nodes: simplifiedNodes }];
        } else if (node.add === 0) {
          // remove noop adds
          simple = [];
        } else if (node.move === 0) {
          // remove noop moves
          simple = [];
        }
      }

      if (nodes.length === 2) {
        const [left, right] = nodes;

        if (has(left.add) && has(right.add) && left.offset === right.offset) {
          // accumulate adds
          simple = [{ add: left.add + right.add, offset: left.offset }];
        } else if (has(left.move) && has(right.move)) {
          // accumulate moves
          simple = [{ move: left.move + right.move }];
        } else if (has(left.move) && has(right.offset)) {
          // accumulate pointer movements as operation offsets
          simple = [{ ...right, offset: left.move + right.offset }, { move: left.move + right.offset }];
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
