const simplify = (series, whileNotZero = false) => {
  if (series.length === 1) {
    const [node] = series;
    // remove unecessary moves for example
  } else if (series.length === 2) {
    const [rawLeft, rawRight] = series;

    const left = simplify([left]);
    const right = simplify([right]);

    if (shouldAccumulateValue) {
      series = [accumulateValue(left, right)];
    }
  }

  return series;
};
