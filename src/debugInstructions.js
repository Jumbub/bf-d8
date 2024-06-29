let indentation = 1;
const debugInstructionsWarningStatefulFunction = (data, dataI, instruction) => {
  const [label, offset, value] = instruction;
  let prefix = `${'.\t'.repeat(label === GOTO_IF_NOT_ZERO ? indentation - 1 : indentation)}`;
  const offsetPrefix = `${prefix}[${offset > 0 ? '+' : ''}${offset}]`;
  if (label !== MOVE);
  switch (label) {
    case ADD:
      print(`${offsetPrefix} ADD ${value}`);
      break;

    case MOVE:
      print(`${prefix}MOVE ${value}`);
      break;

    case WRITE:
      print(`${offsetPrefix} WRITE`);
      break;

    case READ:
      print(`${offsetPrefix} READ`);
      break;

    case GOTO_IF_ZERO:
      if (data[dataI + offset] !== 0) indentation++;
      print(`${offsetPrefix} GOTO_IF_ZERO ${value}`);
      break;

    case GOTO_IF_NOT_ZERO:
      if (data[dataI + offset] === 0) indentation--;
      print(`${offsetPrefix} GOTO_IF_NOT_ZERO ${value}`);
      break;

    case SET:
      print(`${offsetPrefix} SET ${value}`);
      break;

    case MOVE_WHILE_NOT_ZERO:
      print(`${offsetPrefix} MOVE_WHILE_NOT_ZERO ${value}`);
      break;

    case ADD_WHILE_NOT_ZERO:
      const loop = value.to.map(inner => `[${inner.offset}] ADD ${inner.add}`).join(', ');
      print(`${offsetPrefix} ADD_WHILE_NOT_ZERO ${value.from.add} (${loop})`);
      break;

    default:
      print(`${offsetPrefix} ${JSON.stringify(instruction)}`);
  }
};
