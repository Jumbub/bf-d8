# Thoughts

## Hash map

> The final form of rapid optimisation strategies, hash-maps

##### Batch operations

Sequential operations should be batchable to reduce "instruction parsing" time.

The batching is based on state of system, and only possible under certain conditions.

</br>


## Representation

#### Analysis

##### Linked list

Requires no re-computation of offsets because each node can reference another node directly.

##### Tree

Allows simplification without losing data. Each simplified representation can have it's derivation as child nodes.

Also has implicit array storage as an array is represented as just an ordered set of children nodes with a node marked as "array".

#### Runtime

##### Memory bounds checking

Note this information from the 3rd test in this file [test.b](http://brainfuck.org/tests.b).

> In a low-level implementation you can get bounds checking
for free by using the OS's own memory protections; this is the best
solution, which may require making the array size a multiple of the page
size.

##### Single operation representation

> operations have meta-data to simplify representation

`add`

- value: the value to increment or decrement by
- offset: the relative position of the variable to mutate

`move`

- value: the value to move by

`input`

- offset: the relative position of the variable to write in

`output`

- offset: the relative position of the variable to print out

`while`

- code: the operations within the loop

##### Fastest way to read and execute instructions?

Fast data type for storage of instructions: `Uint32Array`

> the size of "meta" must be large enough to store the minimum between a complete wrap of the tape or incrementing to the largest number (Uint16 may work, but let's optimise this later)

Uniform storage of all instructions and meta-data: `[instruction, meta-1, meta-2]`

## Execution environments

> impact of execution environments

Deno?

Node.js?

D8?

</br>


## JIT

##### Is it worth optimising as we go, rather than upfront

Pros:

- can optimise based on current pointer and data values
- can execute instructions while optimising in the background

Cons:

- optimisations being injected into instruction set will break control flow, potentially breaking/decreasing V8 optimisations
- optimisations would be re-run many more times (or the complexity of which code to optimise would increase)


## Optimisations

##### Removal comments

`the following are valid brainfuck instruction +-><.,[] got it?` => `+-><.,[]`

##### Operations

`+` => `add d[p] 1`
`-` => `add d[p] -1`
`>` => `add p 1`
`<` => `add p -1`
`.` => `out d[p]`
`,` => `in d[p]`
`[` => `if d[p] == 0 then goto matching ]`
`]` => `if d[p] != 0 then goto matching [`

##### Operation multiplication

`+++` => `add d[p] 3`
`---` => `add d[p] -3`
`>>>` => `add p 3`
`<<<` => `add p -3`

##### No-op

> where `$` is the start of the program

`$[]++` => `++`

##### "Set zero" loops

`[-]` => `set d[p] 0`
`[+]` => `set d[p] 0`
`[++-]` => `set d[p] 0`
`[+--]` => `set d[p] 0`
`[+-]` => `if d[p] != 0 then err 'non terminating'`

##### "Find zero" loops

`[>]` => `while d[p] != 0 do p += 1`
`[<]` => `while d[p] != 0 do p -= 1`
`[>>>]` => `while d[p] != 0 do p += 3`
`[<<<]` => `while d[p] != 0 do p -= 3`
`[>><<]` => `if d[p] != 0 then err 'non terminating'`

##### "Static check" while loops

> if the > & < operations match in brace, the check variable is static

`[-<+>]` => `while static != 0 do <internals>`

##### "Bounce arithmetic"

`>+<` => `add d[p + 1] 1`
`>>+++<<` => `add d[p + 2] 3`

##### Assume loops terminate

> if the loop only contains mutations, assume that its just reseting to 0, otherwise it's a non terminating loop. We assume programs do not contain non terminating loops.

`[++]` => `set d[p] 0`

##### Clear and assign value

> any "set zero" loops followed by incrementing instructions can be replaced with assignment

`[-]+++` => `set d[p] 3`

##### Generate loop match addresses

> compute matching brace addresses for instant traversal, where `N` is the address

`[` has `matching with N`
`]` has `matching with N`

##### Output-less programs

> non-outputing programs terminate instantly

`+>-<,>>>,++-,>>` => ``

##### Instructions

Operations at face value:

- `add`
- `sub`
- `moveRight`
- `moveLeft`
- `input`
- `output`
- `if 0 goto <matching brace>`
- `if not 0 goto <matching brace>`

Operations simplified:

- `add N` (positive or negative N)
- `move N` (positive or negative N)
- `input`
- `output`
- `if 0 goto <matching brace>`
- `if not 0 goto <matching brace>`

Operation simplification options:

> where O is address offset, and V is the value of the operation

- `add <offset> <value>`
- `set <offset> <value>`
- `move <offset>`
- `input <offset>`
- `output <offset>`
- `if 0 goto <matching brace>`
- `if not 0 goto <matching brace>`
