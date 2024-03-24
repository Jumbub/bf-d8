/**
 * @param {NodeInfo} node
 */
const nodesToString = (nodes, depth = 0) => {
  return nodes
    .map(node => {
      let output = '.\t'.repeat(depth);

      const has = value => value !== undefined;
      const offsetString = has(node.offset) ? `[${node.offset > 0 ? '+' : ''}${node.offset}]` : '';

      if (has(node.whileNotZero)) {
        output += `${offsetString} WHILE_NOT_ZERO:\n`;
        output += nodesToString(node.whileNotZero, depth + 1);
      }
      if (has(node.add)) output += `${offsetString} ADD ${node.add}`;
      if (has(node.set)) output += `${offsetString} SET ${node.set}`;
      if (has(node.move)) output += `MOVE ${node.move}`;
      if (has(node.moveWhileNotZero)) output += `${offsetString} MOVE_WHILE_NOT_ZERO ${node.moveWhileNotZero}`;
      if (has(node.transfer)) output += `${offsetString} TRANSFER [${node.transfer}]`;
      if (has(node.transferNegative)) output += `${offsetString} TRANSFER_NEGATIVE [${node.transferNegative}]`;
      if (has(node.input)) output += `${offsetString} INPUT`;
      if (has(node.output)) output += `${offsetString} OUTPUT`;
      if (has(node.info)) output += JSON.stringify(node.info);

      return output;
    })
    .join('\n');
};
