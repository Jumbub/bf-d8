/**
 * @param {NodeInfo} node
 */
const nodesToString = (nodes, depth = 0) => {
  return nodes
    .map(node => {
      const tab = '.\t'.repeat(depth);
      let output = tab;

      const has = property => node[property] !== undefined;
      const POINT_TO_DATA = `d[p${(offset = node.offset ? `+ ${node.offset}` : '')}]`;

      // open brace
      if (has('nodes')) {
        if (has('ifNot')) output += `while (${POINT_TO_DATA} == 0) `;

        output += `{\n${nodesToString(node.nodes, depth + 1)}`;
      }

      if (has('add')) {
        output += `${POINT_TO_DATA} ${node.add < 0 ? '-' : '+'}= ${node.add};`;
      }
      if (has('set')) {
        output += `${POINT_TO_DATA} = ${node.add};`;
      }
      if (has('move')) {
        output += `p ${node.move < 0 ? '-' : '+'}= ${node.move};`;
      }

      if (has('input')) {
        output += `${POINT_TO_DATA} = read()[0];`;
      }

      if (has('output')) {
        output += `write(${POINT_TO_DATA});`;
      }

      // close brace
      if (has('nodes')) {
        output += `\n${tab}}`;
      }

      return output;
    })
    .join('\n');
};
