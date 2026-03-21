---
layout: default
permalink: /fpga/beta-assembler
title: Beta Assembler
description: Python assembler and simulator for the 32-bit Beta CPU
parent: Lucid V2
grand_parent: 1D&2D Project (FPGA)
nav_order: 9
---

* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design

## **Beta Assembler and Simulator**

### Source Code

You can find the assembler source code on GitHub:

- **`main` branch** (assembler + peg solitaire): [github/natalieagus/beta-assembler (main)](https://github.com/natalieagus/beta-assembler/tree/main)
- **`tetris` branch** (assembler + Tetris board simulator): [github/natalieagus/beta-assembler (tetris)](https://github.com/natalieagus/beta-assembler/tree/tetris)

### **Overview**

This is a Python assembler and interactive step debugger for the **MIT Beta ISA (32-bit)**. It translates `.uasm` assembly source files into binary or hex byte arrays suitable for loading onto the **Alchitry AU FPGA** via Lucid's `$readmemh`. The assembler was originally written by [Alex](https://github.com/aleextw), a 2024 CSD graduate. The simulator and Tetris board renderer were added on top of his assembler pipeline.

### **Requirements**

Python **3.10** or later. Install dependencies with:

```
pip install parameterized
```

The curses-based simulators work on **macOS** and **Linux** terminals out of the box. On **Windows**, use **WSL**.

### **Project Structure**

```
beta-assembler/
├── assembler.py          # Core assembler: .uasm source -> binary/hex byte lists
├── assembler_wrapper.py  # CLI wrapper around assembler.py
├── beta_32.py            # Beta ISA definition: instruction encoders, register names
├── helper_functions.py   # Number parsing, two's complement, hex/bin conversion
├── shunting_yard.py      # Expression evaluator (handles labels, arithmetic in .uasm)
└── files/
    ├── game.uasm         # Peg solitaire game instruction memory
    ├── game_data.uasm    # Peg solitaire game data memory
    └── test*.uasm        # Various test programs
```

## **How the Assembler Works**

### Input Files

Instruction and data memory are kept in **separate files**:

- `filename.uasm`: instruction memory
- `filename_data.uasm`: data memory (optional)

Labels defined in data memory are passed to the instruction assembler so they can be referenced in `LD`, `ST`, and branch instructions.

### Two-Pass Assembly

The assembler runs **two passes** over the source:

1. **First pass**: resolves all label addresses and symbolic constant assignments by executing each instruction with dummy arguments. This populates the label table with correct byte addresses.
2. **Second pass**: emits the final encoding using the resolved label values.


### Output Format

The hex/bin dump is written in **reverse address order** (lowest address at the bottom of the file). This matches the Lucid memory initialisation format expected on the Alchitry AU.

<img src="{{ site.baseurl }}//docs/FPGA/Lucid%20V2/images/beta-assembler/2026-03-17-10-11-30.png"  class="center_seventy no-invert"/>


If you are using Verilog's `$readmemh`, you do not have to reverse it and you should not have trailing `,`. Change the implementation of `arr_to_str` in `assembler.py`:

```python
        if input_format == "data":
            return "\n".join(
                [
                    f"{output_prefix}{''.join(data[i : min(i + (beta.memory_width // 8), len(data))][::-1])}," 
                    for i in range(0, len(data), (beta.memory_width // 8)) 
                ][::-1] # reverses
            )
        else:
            return "\n".join(
                [
                    f"{output_prefix}{''.join(data[i : min(i + (beta.instruction_width // 8), len(data))][::-1])}," 
                    for i in range(0, len(data), (beta.instruction_width // 8))
                ][::-1] # reverses
            )
```

You also need to strip the `h` header by changing the `output_formatter`:

```python
output_formatter = {
    "bin": (bin, 8, "b"),
    "hex": (hex, 2, "h"),
}
```

## **Usage**

### Assembling a Program

```bash
cd beta-assembler
python assembler_wrapper.py files/game -b    # binary output
python assembler_wrapper.py files/game -x    # hex output
```

Output files are written alongside the input:

```
files/game.bin  or  files/game.hex         # assembled instruction memory
files/game_data.bin  or  files/game_data.hex    # assembled data memory
```

### CLI Options

| Flag                            | Description                                      |
| ------------------------------- | ------------------------------------------------ |
| `-b`, `--bin`                   | Output in binary format (default)                |
| `-x`, `--hex`                   | Output in hexadecimal format                     |
| `-s`, `--silent`                | Disable printing to console                      |
| `-o filename`, `--out filename` | Specify output filename (defaults to input name) |

## **Assembly Syntax**

### Comments, Labels, and Constants

```uasm
| This is a comment (everything after | on a line is ignored)

delay = 1              | Symbolic constant assignment

. = 0x2600             | Set current address (dot)

TETRIS_BOARD:          | Label (must be on its OWN line)
LONG(0)                | 32-bit word
WORD(0)                | 16-bit word
```

{:.important}
Labels **must** be placed <span class="orange-bold">on their own</span> line. A label followed immediately by an instruction on the same line will **not** be parsed correctly.

### Example Instructions

```uasm
CMOVE(1, R1)               | Constant-move: R1 = 1
ADDC(R1, 5, R2)            | R2 = R1 + 5
ST(R1, TETRIS_BOARD, R2)   | mem[TETRIS_BOARD + R2] = R1
LD(R31, x, R1)             | R1 = mem[x + R31]
BEQ(R0, my_label, R31)     | branch if R0 == 0
BR(loop)                   | unconditional branch
HALT()                     | stop execution
```

### Data Directives

| Directive    | Description                          |
| ------------ | ------------------------------------ |
| `WORD(val)`  | Assemble `val` as a **16-bit** datum |
| `LONG(val)`  | Assemble `val` as a **32-bit** datum |
| `STORAGE(N)` | Reserve `N` 32-bit words of memory   |

## **ISA Reference (beta_32.py)**

The ISA is defined in `beta_32.py` as Python lambda functions. All instruction encoders return a list of 8-character binary strings (one per byte, little-endian).

### Key Parameters

| Parameter           | Value                |
| ------------------- | -------------------- |
| `instruction_width` | 32 bits              |
| `memory_width`      | 32 bits              |
| `output_size`       | 2 hex chars per byte |

### Instruction Format (32 bits)

```
Type 1 (register):
[31:26] opcode   [25:21] RC   [20:16] RA   [15:11] RB   [10:0] unused

Type 2 (literal):
[31:26] opcode   [25:21] RC   [20:16] RA   [15:0] CC (signed 16-bit constant)
```

The **destination register is always last** in the assembly syntax (e.g., `ADD(RA, RB, RC)` stores the result in `RC`).

### Register Aliases

| Name | Number | Role                           |
| ---- | ------ | ------------------------------ |
| BP   | R27    | Base/frame pointer             |
| LP   | R28    | Link register (return address) |
| SP   | R29    | Stack pointer                  |
| XP   | R30    | Interrupt return pointer       |
| R31  | R31    | Always zero (hardwired)        |

### Instruction Set Summary

| Category   | Instructions                                               |
| ---------- | ---------------------------------------------------------- |
| Arithmetic | `ADD`, `ADDC`, `SUB`, `SUBC`, `MUL`, `MULC`, `DIV`, `DIVC` |
| Logic      | `AND`, `ANDC`, `OR`, `ORC`, `XOR`, `XORC`, `XNOR`, `XNORC` |
| Shift      | `SHL`, `SHLC`, `SHR`, `SHRC`, `SRA`, `SRAC`                |
| Compare    | `CMPEQ`, `CMPEQC`, `CMPLE`, `CMPLEC`, `CMPLT`, `CMPLTC`    |
| Branch     | `BEQ`/`BF`, `BNE`/`BT`, `BR`, `JMP`                        |
| Memory     | `LD`, `ST`, `LDR`                                          |
| Pseudo     | `MOVE`, `CMOVE`, `PUSH`, `POP`, `CALL`, `RTN`, `XRTN`      |
| Data       | `WORD`, `LONG`, `STORAGE`                                  |
| System     | `HALT()`, `SVC(code)`, `RAND`, `NOP`                       |

### Non-Standard Extensions

`RAND` (opcode `0x03`) and `NOP` (opcode `0x02`) are **custom extensions**, <span class="orange-bold">not</span> part of the original MIT Beta ISA. Your FPGA datapath must implement support for these opcodes if your program uses them. Modify the opcodes in `beta_32.py` as needed for your own design.

### System Call

`SVC(code)` has opcode `0x01`. The `code` argument is embedded in the 16-bit constant field. The datapath is responsible for handling the trap.

## **Tetris Board Simulator** (`tetris` branch)

{:.note}
The Tetris simulator is available on the **`tetris` branch**. Switch to it with `git checkout tetris`.

### Running the Simulator

```bash
cd beta-assembler
python sim_tetris.py files/tetris
```

This assembles and executes `files/tetris.uasm` + `files/tetris_data.uasm`, rendering the board stored at the `TETRIS_BOARD` data label in real time.

### Board Layout

The board is a **22 rows x 12 columns** grid. Each cell is one `LONG` (4 bytes, 32-bit little-endian) in data memory. Cell `(row, col)` is at byte address:

```
TETRIS_BOARD + (row * 12 + col) * 4
```

Column 0 and column 11 are permanent **walls**, pre-filled with `1` in `tetris_data.uasm`. A cell value of `1` renders as `[]` (green); `0` renders as empty; walls render as `##` (yellow).

### Display

The terminal display shows the board on the left (27 terminal columns wide), all 32 registers on the right, and disassembly below showing the current PC and any breakpoints.

<img src="{{ site.baseurl }}//docs/FPGA/Lucid%20V2/images/beta-assembler/2026-03-17-10-12-30.png"  class="center_seventy no-invert"/>

### Keyboard Controls

| Key | Action                                               |
| --- | ---------------------------------------------------- |
| `n` | Step one instruction                                 |
| `r` | Run until breakpoint or HALT                         |
| `b` | Toggle breakpoint at current PC                      |
| `c` | Clear all breakpoints                                |
| `R` | Reset: PC back to 0, board restored to initial state |
| `q` | Quit                                                 |

### How the Simulator Uses the Assembler

`sim_tetris.py` calls `parse_asm_file()` from `assembler.py` directly. The `.uasm` source is assembled into a list of binary byte strings, which are then reconstructed into 32-bit instruction words and loaded into the simulator's instruction memory. The simulator executes those words as machine code. Opcodes are resolved at runtime by encoding a dummy instruction for each operation using `beta_32.py` and extracting the 6-bit opcode field, so the simulator stays in sync with the ISA definition automatically.

## **Sample Test Program**

Here is a minimal example (`files/test.uasm` and `files/test_data.uasm`) that demonstrates loads, stores, arithmetic, and branching.

**Instruction memory** (`test.uasm`):

```uasm
start:
ADDC(R31, 20, R9)       | populate 20 to R9

ST(R9, x, R31)          | store 20 at label x
LD(R31, x, R1)          | load content at x into R1
ADDC(R1, -5, R0)        | R0 = R1 + (-5) = 15
ST(R0, y, R31)          | store result at label y
MULC(R0, 5, R0)
BEQ(R0, start, R31)     | loop back to start
HALT()
```

**Data memory** (`test_data.uasm`):

```uasm
x:
LONG(0)                  | label x points here
y:
LONG(0)                  | label y points here
```

Assemble with:

```bash
python assembler_wrapper.py files/test -x
```

## **Summary**

- The hex output is **reversed** relative to address order to match Lucid's `$readmemh` format on the Alchitry AU.
- `beta_32.py` is the **authoritative ISA definition**. Do NOT hardcode opcode values anywhere else. Always derive them from `beta_32` by encoding a test instruction and reading back the opcode field.
- Labels **must** always be placed on their own line. A label followed by an instruction on the same line will not be parsed correctly.
