/**
 * @param {NodeInfo} node
 */
const nodesToString = (nodes, depth = 0) => {
  return nodes
    .map(node => {
      const tab = '.\t'.repeat(depth + 1);
      let output = tab;

      const has = property => node[property] !== undefined;
      const POINT_TO_DATA = `d[p${node.offset ? `${node.offset >= 0 ? '+' : ''}${node.offset}` : ''}]`;
      const pointToData = offset => `d[p${offset ? `${offset >= 0 ? '+' : ''}${offset}` : ''}]`;

      // open brace
      if (has('nodes')) {
        if (has('ifNot')) output += `while (${POINT_TO_DATA} != 0)`;
        const looped = nodesToString(node.nodes, depth + 1);
        output += `{\n${looped}\n${tab}}`;
      }

      if (has('add')) {
        output += `${POINT_TO_DATA} ${node.add < 0 ? '-' : '+'}= ${Math.abs(node.add)};`;
      }
      if (has('set')) {
        output += `${POINT_TO_DATA} = ${node.set};`;
      }
      if (has('addTimesThenSet')) {
        output += `times = 1; while((${POINT_TO_DATA} += ${node.addTimesThenSet.divisor}) != 0) {times++}; `;
        output += node.addTimesThenSet.each
          .map(item => `${pointToData(node.offset + item.offset)} = times * ${item.multiplyer};`)
          .join(`; `);
        output += ` ${POINT_TO_DATA} = ${node.addTimesThenSet.set};`;
      }
      if (has('move')) {
        output += `p ${node.move < 0 ? '-' : '+'}= ${Math.abs(node.move)};`;
      }
      if (has('moveTilZero')) {
        output += `while (${POINT_TO_DATA} != 0) { p ${node.moveTilZero < 0 ? '-' : '+'}= ${Math.abs(
          node.moveTilZero,
        )}; };`;
      }

      if (has('input')) {
        output += `${POINT_TO_DATA} = read()[0];`;
      }

      if (has('output')) {
        output += `write(${POINT_TO_DATA});`;
      }

      if (has('info')) {
        output += JSON.stringify(node.info);
      }

      return output;
    })
    .join('\n');
};
