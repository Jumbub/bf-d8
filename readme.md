# V8 BF

[V8](https://v8.dev/) powered [BF](https://esolangs.org/wiki/Brainfuck) execution environment.

## Benchmarks

Benchmarking run on `tests/mandelbrot.b`

##### [First working code](https://github.com/Jumbub/bf/commit/435d6bc0fd33609b6f63d579fb770a64a21c2f46)

> 63.00s user 0.02s system 100% cpu 1:03.00 total

##### Using Uint8Array for data storage

> bout 10% increase in performance (from slightly more lazy undefined value checking than above)

##### Pre computing loop jumps, and pre processing commands slightly

> bout 20% increase in performance (from slightly more lazy undefined value checking than above)

##### Merging increment operations

> bout 20% increase in performance (from slightly more lazy undefined value checking than above)

##### Merging pointer movement operations

> bout 400% increase in performance (from slightly more lazy undefined value checking than above)

##### Aliasing the reset value loop `[add]`

> 2% increase in performance

##### Aliasing the "move til zero" loop `[move]`

> 50% increase in performance

##### Remove empty move operations at the end of loops

> 1.5% increase in performance

##### Replace copy loops with fixed operation

> 15% performance decrease!!!

## Setup

- [Build V8](https://v8.dev/docs/build)
- [Execute app with D8](https://v8.dev/docs/d8)

### Recommended alias

```bash
alias d8=~/repos/v8/v8/out/x64.release/d8
export D8_PATH="~/repos/v8/v8/out/x64.release"
```

### Usage

```bash
d8 src/run.js -- <program.b>
```

Example programs can be found in the `tests` folder.

E.g. `d8 src/run.js -- tests/hello-world.b`

### Tests

```bash
# Single test
d8 src/run.js -- tests/hello-world.b > output.txt && diff output.txt tests/hello-world.b && echo Passed test! || echo Failed test!

# Test suite
find tests/*.b | grep -oP "(?<=/)[\-\w]+(?=.b)" | xargs -n 1 sh -c '<d8-executable-location> src/run.js -- tests/$0.b > output.txt && diff output.txt tests/$0.txt && echo Passed $0 test! || echo Failed $0 test!'
```

## References

### V8

- [V8](https://v8.dev/)
- [D8](https://v8.dev/docs/d8)

### BF

- [BF](https://esolangs.org/wiki/Brainfuck)
- [Very fast interpreters, transpilers and programs](https://github.com/rdebath/Brainfuck)
- [Great intro into BF](https://gist.github.com/roachhd/dce54bec8ba55fb17d3a)
- [Optimizing brainfuck compiler](https://www.nayuki.io/page/optimizing-brainfuck-compiler)
