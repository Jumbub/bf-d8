# V8 BF

Running [BF](https://esolangs.org/wiki/Brainfuck) on [V8](https://v8.dev/) with [D8](https://v8.dev/docs/d8).

## Getting started

### Install

- [Build V8](https://v8.dev/docs/build)
- Setup D8 binary for use
  ```bash
  V8_REPO_LOCATION=~/v8 # example location
  alias d8="$V8_REPO_LOCATION/v8/out/x64.release/d8"
  export D8_PATH="$V8_REPO_LOCATION/v8/out/x64.release"
  ```

### Usage

```bash
d8 src/run.js -- <program.b>
```

Included programs:

```bash
d8 src/run.js -- tests/hello-world.b
```

```bash
d8 src/run.js -- tests/mandelbrot.b
```

## Testing

Single test:

```bash
PROGRAM=tests/hello-world
d8 src/run.js -- "${PROGRAM}.b" > output.txt && diff output.txt "${PROGRAM}.txt" && echo "\033[0;32mPass\033[0m" || echo "\033[0;31mFail\033[0m"
```

All tests:

```bash
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
- [Test programs](http://brainfuck.org/tests.b)
