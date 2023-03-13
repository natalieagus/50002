---
layout: default
permalink: /lab/lab4-part1
title: Lab 4 - Beta Processor with FPGA (Part 1)
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

# Lab 4: Beta Processor with FPGA (Part 1)
{: .no_toc}

{: .warning}
Before this lab, you are required to [complete this very basic FPGA tutorial](https://natalieagus.github.io/50002/fpga/fpga_1) we wrote and perhaps the official [Getting-Started-With-FPGA tutorial](https://alchitry.com/your-first-fpga-project) by Alchitry lab. Please **come prepared** and bring your FPGA + laptops where Vivado + Alchitry Lab is installed. At least one person in each team should have a laptop that can run Vivado and bring the FPGA. 

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
The Memory Unit is implemented in the file `memory_unit.luc`. It is physically *separated* into two sections for ease of explanation and implementation: 
* the **instruction** memory and 
* the **data** memory

{: .note}
In practice, the *data* segment of the memory and the *instruction* segment of the memory is only **logically** segregated. They still share the same physical device we know as **RAM**. 

The schematic of the memory unit is as follows:

<img src="/50002/assets/contentimage/beta/memory.png"  class="center_seventy"/>


### Instruction Memory
The instruction memory is implemented using the `simple_ram.v` component. See this file under the `Components` folder in your alchitry project to read more about how to use it. In short:
- `read_data` port of the `simple_ram` will output the value of the entry pointed by `raddr` in the <span style="color:red; font-weight: bold;">previous</span> clock cycle. If you want to read address `EA`, you shall set `raddr = EA` and then wait for one FPGA clock cycle for `Mem[EA]` to show up. 
- If you read and write to the **same** address, you will get the value of the old output at `read_data` in the second clock cycle, and on the third clock cycle, the newly updated value will be produced at `read_data`.  


The input to the instruction memory supplied by the Beta is: **instruction address** (`ia[31:0]`). This contains the address of the next instruction to be executed. This will cause the instruction memory to output **instruction data** (`id[31:0]`) for the Beta CPU. Since we never need to **write** to this instruction memory *during program execution*, we implement it as a **single port ram** (only read *or* write can be done one at a time in one `clk` cycle)

{: .note}
The instruction memory unit receives input address `ia[31:0]` and outputs instruction data `id[31:0]`. After a certain **propagation delay**, the memory unit will supply the Beta with the **contents** of address `ia[31:0]`. We symbolically illustrate this **content** as `Mem[EA]`, where `EA = ia[31:0]`.

The interface of the instruction memory is given to you inside `memory_unit.luc`:

```verilog  
    // for instruction memory 
    input ia[$clog2(WORDS)+2], // byte addressing expected
    input instruction_write_enable,
    input instruction_towrite[32],
    output id[32]
```

### Data Memory
The Beta CPU can **read** or **write** to the Data Memory. For ease of demonstration data memory is implemented as a **dual port ram** (read and write can be done independently in the same `clk` cycle). That is why we have two address ports `raddr` and `waddr` inside `memory_unit.luc` instead of `addr` like illustrated in our diagram above, but in principle they work the same way. See `simple_dual_ram.v` in the Components folder in your Alchitry project for more information. In short:
- `read_data` port of the `simple_ram` will output the value of the entry pointed by `raddr` in the <span style="color:red; font-weight: bold;">previous</span> clock cycle. If you want to read address `EA`, you shall set `raddr = EA` and then wait for one FPGA clock cycle for `Mem[EA]` to show up.  
- We should <span style="color:red; font-weight: bold;">avoid</span> reading and writing to the same address simultaneously because the `read_data` will be undefined.

The interface for the data memory is given to you inside `memory_unit.luc`:

```verilog
    // for data memory
    input raddr[$clog2(WORDS)+2], // byte addressing expected
    input waddr[$clog2(WORDS)+2], // byte addressing expected
    input wd[32], // write data
    input we,
    output mrd[32],
```

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
The signal `wr`  should **ALWAYS** have a **valid** logic value (either 1 or 0) at the **RISING** edge of `CLK` otherwise the contents of the memory will be affected. If signal `wr` is 1, the data  `mwd[31:0]` will be written into memory at the **end** of the current cycle. Otherwise, if `wr = 0`, then the data at` mwd[31:0]` will be **ignored**. 

### Addressing Convention
We expect **byte addressing** to be supplied at `raddr`, `waddr`, and `ia`. However, since we would naturally declare our `simple_ram` with `#SIZE(32)`, it expects word addressing. Hence, we need to ignore the lower two bits of `ia`, `raddr`, and `waddr` when using them. 

```verilog
  instruction_memory.address = ia[$clog2(WORDS)+2-1:2]; 
```

Given memory capacity of `WORDS`, we need to take `log2` of it to find the minimum number of bits to address this many `WORDS` of data. When **declaring** `ia`, we state that `ia` contains `$clog2(WORDS)+2` bits. Thus when **indexing**, we want to start from index `$clog2(WORDS)+2-1` (this is MSB). Since we only want word addressing when actually using the `simple_ram`, we simply start from index `$clog2(WORDS)+2-1` and end at index `2` (inclusive). 

{: .note}
Note that we can declare our `simple_ram` with `#SIZE(4), #DEPTH(WORDS*4)` if we want it to strictly be byte addressable, but we will need additional logics to extract 4 bytes at a type. 



## Part A: PC Unit
### PC Unit Schematic
Here is the suggested PC Unit schematic that you can implement. Take note of the input and output notes. This will come in very useful when creating the module for your PC Unit. 

<img src="/50002/assets/contentimage/lab4/pcunit.png"  class="center_seventy"/>




### Task 1: PCSEL Multiplexers

{: .highlight}
**Paste** the code snippet below in the space provided under `PCSEL mux` section inside `pc_unit.luc`. 

```verilog
      case (pcsel){
          b000: 
            pcsel_out = pc_4_sig;
          b001:
            pcsel_out = pc_4_sxtc_sig;
          b010:
            // JMP mux to protect JT31
            pcsel_out = c{pc.q[31] & reg_data_1[31], reg_data_1[30:0]};
          b011:
            pcsel_out = h80000004; // illop 
          b100: 
            pcsel_out = h80000008; // irq 
          default:
            pcsel_out = pc.q;
        }
      pc.d = c{pcsel_out[31:2], b00}; // setting of pcreg content must happen only when slowclk == 1, don't bring this outside of if(slowclk) clause
```

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
pc.d = c{pcsel_out[31:2], b00};
```

### Task 2: RESET Multiplexer

{: .highlight}
**Paste** the code snippet below in the space provided under `RESET mux` section inside `pc_unit.luc`. 

```verilog
    if (rst){
        pc.d = h80000000; // reset can happen anytime regardless of slowclk
    }
```


Remember that we need to add a way to set the PC to zero on `RESET`.  We use a two-input 32-bit mux that selects `0x80000000` when the RESET signal is asserted, and the output of the PCSEL mux when RESET is not asserted. We will use the RESET signal to force the PC to zero during the first clock period of the simulation.

### Task 3: 32-bit PC Reg
The PC is a separate **32-bit register** that can be built using the `dff` component. We have declared it above the `always` block:

```verilog
  dff pc[32](#INIT(0),.clk(clk)); // PC Register
```

### Increment-by-4
Conceptually, the increment-by-4 circuit is just a 32-bit adder with one input wired to the constant 4. It is possible to build a much **smaller** circuit if you design an adder **optimized** knowing that one of its inputs is `0x00000004` constant. In Lucid, this can be done very easily by just stating:

```verilog
    // increment pc by 4
    pc_4_sig = c{pc.q[31], pc.q[30:0] + 4};     
```


### Task 4: Shift-and-add
The branch-offset adder **adds** PC+4 to the 16-bit offset encoded in the instruction `id[15:0]`. The offset is **sign-extended** to 32-bits and multiplied by 4 in preparation for the addition.  Both the sign extension and shift operations can be done with appropriate wiring—no gates required!

{: .highlight}
**Paste** the code snippet below in the space provided under `shift-and-add` inside `pc_unit.luc`. 

```verilog
    sextc = 4 * c{id[15], id[15:0]};
    pc_4_sxtc_sig = c{pc.q[31], pc.q[30:0] + 4 + sextc[30:0]};
```

### Task 5: Supervisor Bit
The highest-order bit of the PC (`PC31`/`ia31`) is dedicated as the **supervisor** bit (see section 6.3 of the [**Beta Documentation**](https://drive.google.com/file/d/1L4TXMEDgD5gTN2JSd4ea_APpwNKUpzqK/view?usp=share_link)). 
* The `LDR` instruction **ignores** this bit, treating it as if it were *zero*. 
* The `JMP` instruction is allowed to clear the Supervisor bit or leave it unchanged, but <span style="color:red; font-weight: bold;">cannot set</span> it, 
* **No other instructions may have any effect on `PC31`**

{: .note-title}
> Setting the Supervisor Bit
>  
> Only `RESET`, `exceptions` (`ILLOP`) and `interrupts` (`XAddr`) cause the Supervisor bit of the Beta `PC` to become **set**.

This has the following three implications for your PC unit design:

1. `0x80000000`, `0x80000004` and `0x80000008` are loaded into the PC during `reset`, `ILLOP` and `IRQ` respectively.   This is the only way that the supervisor bit gets set.  Note that after `reset` the Beta starts execution in supervisor mode. This is equivalent to when a regular computer is starting up.

2. **Bit 31** of the `PC+4` and **branch-offset** inputs to the **PCSEL** mux should be connected to the highest bit of the PC Reg output, `ia31`; i.e., the value of the supervisor bit doesn’t change when executing most instructions. 

3. You need to add additional logic to **bit 31** of the `JT` input to the **PCSEL** mux to ensure that JMP instruction can only **clear** or **leave the supervisor bit unchanged**. Here’s a table showing the new value of the supervisor bit after a `JMP` as function of JT31 and the current value of the supervisor bit (PC31):

old PC31 (ia31) | JT31 (ra31) | new PC31
---------|----------|---------
0 | -- | 0
1 | 0 | 0
1 | 1 | 1


{: .new-title}
> Think! 
>
> You have pasted quite a fair bit of answers to complete `pc_unit.luc`. Which part(s) protects the supervisor bit?



## Part B: REGFILE Unit
### REGFILE Unit Schematic
Here is the suggested REGFILE Unit schematic that you can implement. 

<img src="/50002/assets/contentimage/lab4/regfileunit.png"  class="center_seventy"/>


Open `regfile_unit.luc` and observe that the module interface has been provided for you. **We follow the Regfile Unit Schematic** above for the declaration of the input and output.



### Task 6: RA2SEL and WASEL Mux
You will need a mux controlled by `RA2SEL` to select the **correct** address for the B read port. The 5-bit 2-to-1 **WASEL** multiplexer determines the write address for the register file. 

{: .highlight}
**Paste** the code snippet below in the space provided under `RA2SEL mux` and `WASEL mux` sections inside `regfile_unit.luc`.

```verilog
    // RA2SEL mux
    case(ra2sel){
      b0:
        ra2sel_out = rb;
      b1:
        ra2sel_out = rc;
      default:
        ra2sel_out = rb;
    }

    // WASEL mux 
    case(wasel){
      b0:
        wasel_out = rc;
      b1:
        wasel_out = b11110;
      default:
        wasel_out = rc;
    }
```

### Task 7: Regfile Memory
The register file is a 3-port memory. It should be implemented in `regfile_memory.luc`, which is then utilised by `regfile_unit.luc`. 

{: .highlight}
Paste the code below inside the `always` block in `regfile_unit.luc`.

```verilog
    // always read 
    reg_data_1 = registers.q[read_address_1];
    reg_data_2 = registers.q[read_address_2];
    
    // check if write_en and its not R31 
    if (write_address != b11111 && write_enable){
        registers.d[write_address] = write_data;
    }
    
    // always give out 0 if we are reading R31
    if (read_address_1 == b11111) reg_data_1 = 32h0;
    if (read_address_2 == b11111) reg_data_2 = 32h0;
```

The `RD1` port output producing `reg_data_1[31:0]` is also wired directly as the third (for `JMP`) input of the `PCSEL` multiplexer. Remember we <span style="color:red; font-weight: bold;">already</span>  **force** the low-order two bits to zero and to add supervisor bit logic to bit 31 in the `PCSEL` Unit, so we do not have to do it here anymore.

### Task 8: Z Logic
Z logic can be added to the output of the RA1/RD1 port of the register file memory above. The value of Z must be `1` if and only if `reg_data_1[31:0]` is `0x00000000`. Z must be `0` otherwise. This is exactly a `NOR` logic. You can create a reduction `NOR` logic gate very easily in Lucid (well, [actually Verilog](https://class.ece.uw.edu/cadta/verilog/reduction.html)), but of course you're welcome to follow the schematic above. 

{: .highlight}
Paste the code snippet below in the space provided under `commpute Z` section inside `regfile_unit.luc`.

```verilog
    z = ~|regfile.reg_data_1;
```


### Task 9: mwd[31:0] Output
Finally, we need to connect the output of the `RD2` port of the register file memory above to produce `mwd[31:0]`. 

{: .highlight}
Paste the code below to this task section `regfile_unit.luc`. 

```verilog
    mwd = regfile.reg_data_2;
```


## Part C: CONTROL Unit
### CONTROL Unit Schematic
Here is the suggested **CONTROL** Unit schematic that you can implement. 

<img src="/50002/assets/contentimage/lab4/controlunit.png"  class="center_seventy"/>

Open `control_unit.luc` and observe that the module interface has been provided for you. **We follow the Control Unit Schematic** above for the declaration of the input and output.



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

### WR and WERF
We do need to be careful with the write enable signal for main memory (WR) which needs to be **valid** even before the first instruction is fetched from memory. WR is an **input** to the main memory, and recall that ALL inputs need to be VALID (0 is also a valid value!) in order for the main memory to give a valid output data. You should include some additional logic that forces `wr` to `b0` when `reset is 1`. This takes highest priority, hence it is written at the bottom of the `always` block in `control_unit.luc`. 


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
**Paste** the code snippet below in the space provided under `PCSEL for BNE/BEQ` section inside `control_unit.luc`.

```verilog
    if (opcode == b011101 && z == 1){ // BEQ, branch if z == 1
      pcsel = b001;
    }
    else if (opcode == b011110 && z == 0){ // BNE, branch if z != 1
      pcsel = b001;
    }
```

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

```verilog
    if (irq_sampler.q & slowclk & ~ia31){
      pcsel = b100;
      wasel = 1;
      werf = 1;
      wdsel = b00;
      wr = 0;
      // clear interrupt bit 
      irq_sampler.d = 0;
    }
```

Note that the snippet above is located near the end of the `always` block because it shall **overwrite** the current instructions' control signals defined earlier above. 


## ALU + WDSEL Unit
This unit is fairly straightforward to implement.  **In fact, it is so easy and we just implement it for you** inside `beta_cpu.luc`. We  provide you with the ALU unit (`alu.luc`) so you don't have to make the 32-bit version. We follow closely the modular implementation of ALU from Lab 3. 

### ALU+WDSEL Unit Schematic
Here is the suggested **ALU + WDSEL** Unit schematic that we implemented: 

<img src="/50002/assets/contentimage/lab4/aluwdselunit.png"  class="center_seventy"/>


### ASEL and BSEL Mux

The low-order 16 bits of the instruction need to be **sign**-extended to 32 bits as an input to the BSEL mux.  Sign-extension is easy in hardware, no extra components needed as you have known already when creating the shift + add component in PC Unit. 

Also, **Bit 31** of the branch-offset input to the ASEL mux should be set to `0`. This means that the supervisor bit is **ignored** when doing address arithmetic for the `LDR` instruction.


### WDSEL Mux
**Bit 31** of the PC+4 input to the **WDSEL** mux should connect to the highest bit of the PC Reg output, `ia31`, saving the current value of the supervisor whenever the value of the PC is saved by a branch instruction or trap.  This is already handled in the PC unit. You don't need to do anything else here.


## Part D: Assemble Completed Beta
### Task 12

The complete schematic of the Beta is (you might want to open this image in another tab):

<img src="/50002/assets/contentimage/beta/beta.png"  class="center_seventy"/>

Open `beta_cpu.luc` and study the starter code. The 4 major components of the Beta has been instantiated for you.

```verilog
  control_unit control_system(.clk(clk), .rst(rst));
  alu alu_system;
  regfile_unit regfile_system(.clk(clk), .rst(rst));
  pc_unit pc_system(.clk(clk));
```

{: .highlight}
Paste the code below under `Task 12` section to define connections to the control unit, PC unit, and regfile unit respectively. 

```verilog
    //***** CONTROL unit ******// 
    control_system.irq = irq;
    control_system.ia31 = pc_system.ia[31];
    control_system.opcode = instruction[31:26];
    control_system.z = regfile_system.z;
    control_system.slowclk = slowclk;

    //***** PC unit ******// 
    pc_system.rst = rst;
    pc_system.slowclk = slowclk;
    pc_system.reg_data_1 = regfile_system.reg_data_1;
    pc_system.pcsel = control_system.pcsel;
    pc_system.id = instruction[15:0];
    ia = pc_system.ia;

    //***** REGFILE unit *****//
    regfile_system.slowclk = slowclk;
    regfile_system.ra2sel = control_system.ra2sel;
    regfile_system.wasel = control_system.wasel;
    regfile_system.werf = control_system.werf;
    regfile_system.ra = instruction[20:16];
    regfile_system.rb = instruction[15:11];
    regfile_system.rc = instruction[25:21];
```

{: .highlight}
Finally, we need our beta to produce appropriate output signals. Paste the code snippet below under `output connections` section in `beta_cpu.luc`. 

```verilog

    alu_system.a = asel_out;
    alu_system.b = bsel_out; 
    regfile_system.wdsel_out = wdsel_out;
    mem_data_address = alu_system.out;
    mem_data_output = regfile_system.mwd;
    wr = control_system.wr;

```

### Connect Debug Signals 

It is really hard to debug your FPGA and it takes a long time to compile your Lucid code. As such, it always helps to create additional debug output so that we can "inspect" the content of each crucial component in the Beta CPU during each instruction execution. 

{: .highlight}
Paste the debug code below under `debug signals` section in `beta_cpu.luc`.

```verilog
    debug[0][15:0] = pc_system.pc_4_sxtc[15:0];
    debug[1][15:0] = asel_out[15:0];
    debug[2][15:0] = bsel_out[15:0];
    debug[3][15:0] = wdsel_out[15:0];
```

Congratulations! 🎉 

You have made a working Beta CPU. Please take your time to understand how each component works. In the next lab, we will study how to **run** this beta cpu and connect I/O. 
