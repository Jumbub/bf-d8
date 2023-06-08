const has = property => property !== undefined;

const simplifyNodes = allNodes => {
  for (let size = 1; size <= allNodes.length; size++) {
    let mutated = false;
    for (let offset = 0; offset <= allNodes.length - size; offset++) {
      const nodes = allNodes.slice(offset, offset + size);
      let simple = undefined;

      if (nodes.length === 1) {
        const [node] = nodes;

        if (has(node.nodes)) {
          const simplifiedNodes = simplifyNodes(node.nodes);
          if (simplifiedNodes !== node.nodes) simple = [{ ...node, nodes: simplifiedNodes }];
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
        } else if (has(left.move) && has(right.add)) {
          // print(JSON.stringify([left, right]));
          // print(
          //   JSON.stringify([{ add: right.add, offset: left.move + right.offset }, { move: left.move + right.offset }]),
          // );
          // throw 'no';
          // simple = [{ add: right.add, offset: left.move + right.offset }, { move: left.move + right.offset }];
        }
      }

      if (simple) {
        mutated = true;
        allNodes = [...allNodes.slice(0, offset), ...simple, ...allNodes.slice(offset + size, allNodes.length)];
      }
    }
    if (mutated) size = 1; // restart simplification
  }
  return allNodes;
};
