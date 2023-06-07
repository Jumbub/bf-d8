const PRETTY_LABELS = {
  [ADD]: 'ADD',
  [MOVE]: 'MV',
  [INPUT]: 'IN',
  [OUTPUT]: 'OUT',
  [IF_ZERO_GOTO]: 'WHILE(d!=0)',
  [IF_NOT_ZERO_GOTO]: 'ENDWHILE',
  [SET]: 'SET',
  [MOVE_TIL_ZERO]: 'MV_TO_0',
  [COPY_TO]: 'CP_TO',
};

const visualise = instructions => {
  let depth = 0;
  print();
  for (let i = 0; i < instructions.length; i++) {
    const [label, offset, value] = instructions[i];

    if (label === IF_NOT_ZERO_GOTO) depth--;

    write('.\t'.repeat(depth));
    switch (label) {
      case ADD:
        print(`d[p+${offset}] += ${value}`);
        break;
      case MOVE:
        print(`p += ${offset}`);
        break;
      case INPUT:
        print(`d[p+${offset}] = getChar()`);
        break;
      case OUTPUT:
        print(`writeChar(d[p+${offset}])`);
        break;
      case IF_ZERO_GOTO:
        print(`while (d[p] != 0) {`);
        break;
      case IF_NOT_ZERO_GOTO:
        print(`}`);
        break;
      case SET:
        print(`d[p+${offset}] = ${value}`);
        break;
      case MOVE_TIL_ZERO:
        print(`while (d[p] != 0) { p += ${offset} }`);
        break;
      case COPY_TO:
        print(`d[p+${offset}] = d[p] * ${value}`);
        break;
    }

    if (label === IF_ZERO_GOTO) depth++;
  }
  print();
};
