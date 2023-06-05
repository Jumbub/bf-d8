# Thoughts

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

</br>


## Hash map

> The final form of rapid optimisation strategies, hash-maps

##### Batch operations

Sequential operations should be batchable to reduce "instruction parsing" time.

The batching is based on state of system, and only possible under certain conditions.

</br>


## Runtime representation

##### Single operation representation

> operations have meta-data to simplify representation

`mutate`

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
