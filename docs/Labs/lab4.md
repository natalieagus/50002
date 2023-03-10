---
layout: default
permalink: /lab/lab4
title: Lab 4 - Beta Processor with FPGA
description: Lab 4 handout covering topics from Beta Datapath
parent: Labs
nav_order:  5
---

* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design
<br>
Written by: Natalie Agus (2023)

# Lab 4: Beta Processor with FPGA
{: .no_toc}

{: .warning}
Before this lab, you are required to [complete this very basic FPGA tutorial](https://natalieagus.github.io/50002/fpga/fpga_1) we wrote and perhaps the official [Getting-Started-With-FPGA tutorial](https://alchitry.com/your-first-fpga-project) by Alchitry lab. Please **come prepared** and bring your FPGA + laptops where Vivado + Alchitry Lab is installed. At least one person in each team should have this. 

## Starter Code 

Please clone the starter code from this repository, then **open** it with Alchitry Lab. 
```
TBC
```

{: .important}
Since there's only 1 FPGA per group, you need to work through this lab as a 1D group during class. However each person must still submit the lab questionnaire **individually**.

## Related Class Materials
The lecture notes on [Building the Beta CPU](https://natalieagus.github.io/50002/notes/betacpu), and [Designing an Instruction Set](https://natalieagus.github.io/50002/notes/instructionset) are closely related to this lab. 

This lab will reinforce your understanding on how the Beta CPU works, and all data paths for OP, OPC, Control Transfer, and Memory Access operations. 

Related sections in [Designing an Instruction Set](https://natalieagus.github.io/50002/notes/instructionset):	
* [The Von Neumann model](https://natalieagus.github.io/50002/notes/instructionset#the-von-neumann-model): CPU, Memory, IO
* [Programmability of a Von Neumann Machine](https://natalieagus.github.io/50002/notes/instructionset#programmability-of-a-von-neumann-machine): basics of programmable control systems (using control signals like `OPCODE` to activate different data paths in the Beta CPU). 
* [Beta ISA Format](https://natalieagus.github.io/50002/notes/instructionset#beta-isa-format)
* [Beta Instruction Encoding](https://natalieagus.github.io/50002/notes/instructionset#beta-instruction-encoding)


Related sections in [Beta CPU](https://natalieagus.github.io/50002/notes/betacpu):	
* [OP datapath](https://natalieagus.github.io/50002/notes/betacpu#op-datapath)
* [OPC datapath](https://natalieagus.github.io/50002/notes/betacpu#opc-datapath)
* [Memory Access datapath](https://natalieagus.github.io/50002/notes/betacpu#memory-access-datapath)
* [Control transfer datapath](https://natalieagus.github.io/50002/notes/betacpu#control-transfer-datapath)
* [Exception handling](https://natalieagus.github.io/50002/notes/betacpu#exception-handling)
* By the end of this lab, you should know how to build the schematic of the entire Beta CPU based on its [ISA](https://natalieagus.github.io/50002/notes/instructionset#the-beta-instruction-set-architecture) (blueprint). This lab will also help you to familiarise yourselves with core Beta instructions

## Introduction
The goal of this lab is to build a **fully** functional 32-bit Beta Processor on our FPGA so that it could simulate simple programs written in Beta Assembly Language. It is a huge device, and to make it more bearable we shall modularise it into four major components:
* (Part A) **PC** Unit: containing the PC register and all necessary components to support the ISA
* (Part B) **REGFILE** Unit: containing 32 32-bit registers, WASEL, and RA2SEL mux, plus circuitry to compute Z
* (Part C) **CONTROL** Unit: containing the ROM and necessary components to produce all Beta control signals given an `OPCODE`
* **ALU+WDSEL** Unit: containing the ALU and WDSEL, ASEL, BSEL muxes (**given to you**)
* (Part D) Assemble the entire Beta CPU using all subcomponents above
 
<img src="/50002/assets/contentimage/lab4/beta_lab.png"  class="center_seventy"/><br>

The signals indicated in red refers to external **`INPUT`** to our Beta, supplied by the **Memory Unit**. The signals illustrated yellow refers to our Beta's **`OUTPUT`** to the **Memory Unit**.


## Memory Unit
The Memory Unit is implemented in the file `memory_unit.luc`. It is physically *broken* into two sections for ease of explanation and implementation: 
* the **instruction** memory and 
* the **data** memory

{: .note}
In practice, the *data* segment of the memory and the *instruction* segment of the memory is only **logically** segregated. They still share the same physical device we know as **RAM**. 

The schematic of the memory unit is as follows:

<img src="/50002/assets/contentimage/beta/memory.png"  class="center_seventy"/>


### Instruction Memory
The input to the instruction memory supplied by the Beta is: **instruction address** (`ia[31:0]`). This contains the address of the next instruction to be executed. This will cause the instruction memory to output **instruction data** (`id[31:0]`) for the Beta CPU. Since we never need to **write** to this instruction memory *during program execution*, we implement it as a **single port ram** (only read *or* write can be done one at a time in one `clk` cycle)

{: .note}
The instruction memory unit receives input address `ia[31:0]` and outputs instruction data `id[31:0]`. After a certain **propagation delay**, the memory unit will supply the Beta with the **contents** of address `ia[31:0]`. We symbolically illustrate this **content** as `Mem[EA]`, where `EA = ia[31:0]`.

### Data Memory
The Beta CPU can **read** or **write** to the Data Memory. The data memory is implemented as a **dual port ram** (read and write can be done independently in the same `clk` cycle).

#### Memory Read
The Data Memory Unit receives **one** input from the Beta:
* data memory address (`ma[31:0]`). This is the address of data memory location where we want to read (load) from or write (store) to. 
* We often know this as `EA` in our lecture notes as well.

When the Beta wants to **load** (read) data from the memory, it needs to supply the above `ma[31:0]` to the memory unit. Then, the data memory will output `mrd[31:0]` (otherwise known as `Mem[EA]`) for the Beta CPU.

#### Memory Write
If the Beta wants to **store** (write) data to the memory, it needs to supply **two** signals to the data memory:
* memory write data (`mwd[31:0]`): the 32-bit data to be stored to the memory unit, and,
* memory write enable (`wr`) signal. Set to 1 when the Beta wants to store into the memory location specified by `ma[31:0]` at the **end** of the current cycle.  

{: .warning}
The signal `wr`  should **ALWAYS** have a **valid** logic value (either 1 or 0) at the **RISING** edge of `CLK` otherwise the contents of the memory will be erased. If signal `wr` is 1, the data  `mwd[31:0]` will be written into memory at the **end** of the current cycle. Otherwise, if `wr = 0`, then the data at` mwd[31:0]` will be **ignored**. 

## Part A: PC Unit
### PC Unit Schematic
Here is the suggested PC Unit schematic that you can implement. Take note of the input and output notes. This will come in very useful when creating the module for your PC Unit. 

<img src="/50002/assets/contentimage/lab4/pcunit.png"  class="center_seventy"/>


Open `TBC` and observe that the module interface has been provided for you. **We follow the PC Unit Schematic** above for the declaration of the input and output (they are **positional arguments**). Your job is to fill up each blanks between `BEGIN ANSWER` and `END ANSWER`.

### Task 1: PCSEL Multiplexers

{: .highlight}
**Paste** the code snippet below in the space provided under `5-to-1 PCSEL mux` section inside `pc_unit.luc`. Read on to find out how to fill it up.

The 32-bit 5-to-1 PC mux **selects** the value to be loaded into the `PC` register at the next rising edge of the clock depending on the `PCSEL` control signal. 


#### `XAddr` and `ILLOP`
`XAddr` and `ILLOP` in the Beta diagram in our lecture notes represents **constant** addresses used when the Beta services an interrupt (triggered by IRQ) or executes an instruction with an illegal or unimplemented opcode.  For this assignment assume that `XAddr = 0x00000008` and `ILLOP = 0x00000004` and we will make sure the first three locations of main memory contain BR instructions that branch to code which handle reset, illegal instruction traps and interrupts respectively. In other words, the first three locations of main memory contain:

```cpp
Mem[0x80000000] = BR(reset_handler)
Mem[0x80000004] = BR(illop_handler)
Mem[0x80000008] = BR(interrupt_handler)
```


#### Lower Two Bits of `PC`
You also have to **force** the lower two bits of inputs going into the PC+4, PC+4+4*SXTC, and JT port of the mux to be `b00` because the memory is byte addressable but the Beta obtains one word of data/instructions at each clock cycle. You can do this with appropriate wiring.

Example: 

```verilog
pcsel_out = c{pc_signal[31:2], b00}
```

### Task 2: RESET Multiplexer
{: .highlight}
**Paste** the code snippet below in the space provided under `RESET mux` and `PC Register` sections inside `pc_unit.luc`. Read on to find out how to fill it up.


Remember that we need to add a way to set the PC to zero on `RESET`.  We use a two-input 32-bit mux that selects `0x80000000` when the RESET signal is asserted, and the output of the PCSEL mux when RESET is not asserted. We will use the RESET signal to force the PC to zero during the first clock period of the simulation.

### Task 3: 32-bit PC Reg
The PC is a separate **32-bit register** that can be built using the `dff` component.

{: .highlight}
**Paste** the code snippet below in the space provided under `PC Register` inside `pc_unit.luc`.


### Increment-by-4
Conceptually, the increment-by-4 circuit is just a 32-bit adder with one input wired to the constant 4. It is possible to build a much **smaller** circuit if you design an adder **optimized** knowing that one of its inputs is `0x00000004` constant. In Lucid, this can be done very easily by just stating:

```verilog
pc_sig = pc.q + 4;
```


### Task 4: Shift-and-add
The branch-offset adder **adds** PC+4 to the 16-bit offset encoded in the instruction `id[15:0]`. The offset is **sign-extended** to 32-bits and multiplied by 4 in preparation for the addition.  Both the sign extension and shift operations can be done with appropriate wiring—no gates required!

{: .highlight}
**Paste** the code snippet below in the space provided under `shift add unit` inside `pc_unit.luc`.

### Task 5: Supervisor Bit
The high-order bit of the PC is dedicated as the **supervisor** bit (see section 6.3 of the [**Beta Documentation**](https://drive.google.com/file/d/1L4TXMEDgD5gTN2JSd4ea_APpwNKUpzqK/view?usp=share_link)). 
* The `LDR` instruction **ignores** this bit, treating it as if it were *zero*. 
* The `JMP` instruction is allowed to clear the Supervisor bit or leave it unchanged, but <span style="color:red; font-weight: bold;">cannot set</span> it, 
* **No other instructions may have any effect on it**

{: .note-title}
> Setting the Supervisor Bit
>  
> Only `RESET`, `exceptions` (`ILLOP`) and `interrupts` (`XAddr`) cause the Supervisor bit of the Beta `PC` to become **set**.

This has the following three implications for your Beta design:

1. `0x80000000`, `0x80000004` and `0x80000008` are loaded into the PC during `reset`, `ILLOP` and `IRQ` respectively.   This is the only way that the supervisor bit gets set.  Note that after `reset` the Beta starts execution in supervisor mode. This is equivalent to when a regular computer is starting up.

2. **Bit 31** of the `PC+4` and **branch-offset** inputs to the **PCSEL** mux should be connected to the highest bit of the PC Reg output, `ia31`; i.e., the value of the supervisor bit doesn’t change when executing most instructions. 
    * Please ensure your answer in shift-and-add section takes this into account. 

3. You’ll have to add logic to **bit 31** of the `JT` input to the **PCSEL** mux to ensure that JMP instruction can only **clear** or **leave the supervisor bit unchanged**. Here’s a table showing the new value of the supervisor bit after a `JMP` as function of JT31 and the current value of the supervisor bit (PC31): <br>

old PC31 (ia31) | JT31 (ra31) | new PC31
---------|----------|---------
0 | -- | 0
1 | 0 | 0
1 | 1 | 1


{: .highlight}
**Paste** the code snippet below in the space provided under `JMP mux` inside `pc_unit.luc`.



### Testing 
It takes quite some time to compile Lucid (and Verilog too) code, so testing smaller components is crucial! 

```
TBC
```

## Part B: REGFILE Unit
### REGFILE Unit Schematic
Here is the suggested REGFILE Unit schematic that you can implement. 

<img src="/50002/assets/contentimage/lab4/regfileunit.png"  class="center_seventy"/>


Open `regfile_unit.luc` and observe that the module interface has been provided for you. **We follow the Regfile Unit Schematic** above for the declaration of the input and output.

{: .note}
Your job is to fill up each blanks between `BEGIN ANSWER` and `END ANSWER`

### Task 6: WASEL and RA2SEL Mux
You will need a mux controlled by `RA2SEL` to select the **correct** address for the B read port. The 5-bit 2-to-1 **WASEL** multiplexer determines the write address for the register file. 

{: .highlight}
**Paste** the code snippet below in the space provided under `RA2SEL mux` and `WASEL mux` sections inside `regfile_unit.luc`.

### Task 7: Regfile Memory
The register file is a 3-port memory. You must implement it in `regfile_memory.luc`, which is then utilised by `regfile_unit.luc`. The `RA1`/`RD1` port output producing `ra[31:0]` is also wired directly to the `JT` inputs of the `PCSEL` multiplexer. Remember we already  **force** the low-order two bits to zero and to add supervisor bit logic to bit 31 in the PCSEL Unit, so we do not have to do it here anymore.

### Task 8: Z Logic
Z logic can be added to the output of the RA1/RD1 port of the register file memory above. The value of Z must be `1` if and only if `ra[31:0]` is `0x00000000`. Z must be `0` otherwise. This is exactly a `NOR` logic. You can create a reduction `NOR` logic gate very easily in Lucid (well, [actually Verilog](https://class.ece.uw.edu/cadta/verilog/reduction.html)), but of course you're welcome to follow the schematic above. 

{: .highlight}
**Paste** the code snippet below in the space provided under `Z computation` section inside `regfile_unit.luc`.


### Task 9: mwd[31:0] Output
Finally, connect the output of the `RD2` port of the register file memory above to produce `mwd[31:0]`. 

{: .highlight}
**Paste** the code snippet below in the space provided under `mwd[31:0] output` section inside `regfile_unit.luc`.



### Testing 

TBC

## Part C: CONTROL Unit
### CONTROL Unit Schematic
Here is the suggested **CONTROL** Unit schematic that you can implement. 

<img src="/50002/assets/contentimage/lab4/controlunit.png"  class="center_seventy"/>

Open `control_unit.luc` and observe that the module interface has been provided for you. **We follow the Control Unit Schematic** above for the declaration of the input and output.

Fill up each blanks between `BEGIN ANSWER` and `END ANSWER`

### ROM
The control logic should be tailored to generate the control signals your logic requires, which may differ from what’s shown in the diagram above. Note that a ROM can be built by simply declaring a `CONST` array in Lucid. 

```verilog
  const CU_ROM = { 
    b01110000000000010,
    b00000011000110110,
    b00000011000010110,
    b00000011000000110,
    b01110000000000010,
    b00000010101100110,
    b00000010111100110, 
    b00000010110000110,
    b01110000000000010,
    b00000011101110110,
    ...
```


Some of the signals can connect directly to the appropriate logic, e.g., `ALUFN[5:0]` can connect **directly** to the **ALUFN** inputs of your **ALU**, however some signals like `PCSEL[2:0]` requires some degree of <span style="color:red; font-weight: bold;">post-processing</span> depending on the value of other signals like `Z`. 

We have already provided you with the bare Control Unit ROM as shown in the schematic above. Further processing for control signals: `PCSEL, wasel, wdsel, werf, wr` are needed. 

### WR 
We do need to be careful with the write enable signal for main memory (WR) which needs to be **valid** even before the first instruction is fetched from memory. WR is an **input** to the main memory, and recall that ALL inputs need to be VALID (0 is also a valid value!) in order for the main memory to give a valid output data. You should include some additional logic that forces `wr` to `0b0` when `reset=1`. 


### Task 10: PCSEL 
The PCSEL logic should take into account the presence of **branching** `BNE/BEQ` OPCODE, and output the correct signal depending on the value of `Z` if branching is indeed happening. Here's the related OPCODE and PCSEL value:


OPCODE | Z | PCSEL
---------|----------|---------
BEQ `011101` | 0 | `000`
BEQ `011101` | 1 | `001`
BNE `011110` | 0 | `001`
BNE `011110` | 1 | `000`

If you are using **pureply** a ROM-based implementation without additional logic (128 words in the ROM as opposed to just 64), you can make `Z` an additional address input to the ROM (**doubling** its size).  A more economical implementation might use external logic to modify the value of the PCSEL signals as defined in our schematic above. 

{: .highlight}
**Paste** the code snippet below in the space provided under `Branch check` section inside `control_unit.jsim`.


### Task 11: IRQ Handling
When `IRQ` signal is 1 and the Beta is in “user mode” (PC31 is zero), an **interrupt** should occur.  Asserting `IRQ` should have NO effect when in “supervisor mode” (`PC31` is one).  You should add logic that causes the Beta to abort the current instruction and **save** the current **PC+4** in register `XP` (`11110`) and to set the PC to `0x80000008`.  In other words, an interrupt forces the following:

1.	PCSEL to `b100` (select `0x80000008` as the next `PC` value)
2.	WASEL to `b1` (select `XP` as the register file write address)
3.	WERF to `b1` (write into the register file)
4.	WDSEL to `b00` (select `PC+4` as the data to be written into the register file)
5.	WR to `b0` (this ensures that if the interrupted instruction was a `ST` that it doesn’t get to write into main memory).

Note that you’ll also want to add logic to **reset** the Beta; at the very least when `reset` is asserted you’ll need to force the PC to `0x80000000` and ensure that `WR` is 0 (to prevent your initialized main memory from being overwritten).

{: .highlight}
**Paste** the code snippet below in the space provided under `IRQ handling` section inside `control_unit.luc`.



### Testing 
TBC

## ALU + WDSEL Unit
This unit is fairly straightforward to implement.  **In fact, it is so easy and we just implement it for you** inside `beta_cpu.luc`. We  provide you with the ALU unit (`alu.luc`) so you don't have to make the 32-bit version. We follow closely the modular implementation of ALU from Lab 3. 

### ALU+WDSEL Unit Schematic
Here is the suggested **ALU + WDSEL** Unit schematic that we implemented: 

<img src="/50002/assets/contentimage/lab4/aluwdselunit.png"  class="center_seventy"/>


### ASEL and BSEL Mux

The low-order 16 bits of the instruction need to be **sign**-extended to 32 bits as an input to the BSEL mux.  Sign-extension is easy in hardware, no extra components needed as you have known already when creating the shift + add component in PC Unit. 

Also, **Bit 31** of the branch-offset input to the ASEL mux should be set to `0`. This means that the supervisor bit is **ignored** when doing address arithmetic for the `LDR` instruction.


### WDSEL Mux
**Bit 31** of the PC+4 input to the **WDSEL** mux should connect to the highest bit of the PC Reg output, `ia31`, saving the current value of the supervisor whenever the value of the PC is saved by a branch instruction or trap.


## Part D: Assemble Completed Beta
### Task 12
Open `beta_cpu.luc` and fill in your answer between the `BEGIN ANSWER` and `END ANSWER` statements. The necessary units: `alu`, `regfile_unit`, `control_unit`, and `pc_unit` have all been instantiated for you.

{: .highlight}
Write your answer in the space given. 

The complete schematic of the Beta is (you might want to open this image in another tab):

<img src="/50002/assets/contentimage/beta/beta.png"  class="center_seventy"/>


## Beta Tester Source Code
We have written a simple 5-line tester code for your Beta inside `instruction_rom.luc`. Unfortunately, we don't have a nice auto-tester and auto-graded checkoff file like we have in `jsim`. We just need to either manually ensure that the outputs are correct by observing each **state** of the Beta (PC content, Regfile content, control signals, etc) at each instruction execution or write an automatic tester like you did for your ALU in Checkoff 1.

TBC

