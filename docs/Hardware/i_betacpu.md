---
layout: default
permalink: /notes/betacpu
title: Building Beta CPU
description: In-depth study on the Beta CPU's datapath
nav_order: 10
parent: Hardware Related Topics
---

* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design


# Building the $$\beta$$ CPU
{: .no_toc}
[You can find the lecture video here.](https://youtu.be/4T9MR8BSzt0) You can also **click** on each header to bring you to the section of the video covering the subtopic. 

{:.highlight-title}
> Detailed Learning Objectives
>
> 1. **Explain the Relationship Between Control Logic and CPU Instruction Handling**
>    - Learn how the Control Logic unit decodes the OPCODE of instructions and outputs appropriate control signals to manipulate the datapath for executing various instructions.
> 	 - Implement the datapath for $$\beta$$ ISA 
> 2. **Examine the Instruction Fetch and Decode Process**
>    - Explore how the CPU fetches and decodes instructions during each clock cycle, focusing on the computation of instruction addresses and the decoding of OPCODEs.
> 3. **Analyze the Detailed Anatomy of the $$\beta$$ CPU**
>    - Study the components of the $$\beta$$ CPU, including the Program Counter (PC), Register Files (REGFILE), Arithmetic Logic Unit (ALU), and Control Unit (CU), and their interconnections.
> 4. **Explain Memory Interaction in the CPU**
>    - Investigate how instructions interact with memory, specifically how data is loaded and stored between the CPU's registers and the physical memory unit.
> 5. **Explore the Control Transfer in CPU Operations**
>    - Delve into instructions that involve control transfer such as conditional branches and jumps, and understand how they modify the flow of execution within the CPU.
> 6. **Familiarize with the $$\beta$$ Instruction Set**
>    - Gain knowledge of the specific instructions under the $$\beta$$ ISA, their formats, and how they are executed within the CPU's datapath.
> 7. **Recognize the Role of the Control Unit in Instruction Execution**
>    - Identify how the Control Unit's signals direct the CPU's datapath to execute instructions correctly based on the decoded instruction type.
> 8. **Assess CPU Performance with Benchmarks**
>    - Learn how to evaluate CPU performance using metrics such as MIPS (Million Instructions Per Second) and understand the implications of CPI (Clocks Per Instruction) on performance assessment.
> 
> These objectives help students grasp the intricate details of how a CPU interprets and executes instructions based on a predefined instruction set architecture, using the $$\beta$$ CPU as a model system.

## [Overview](https://www.youtube.com/watch?v=4T9MR8BSzt0&t=0s)

In the previous chapter, we were introduced to the $$\beta$$ ISA, a CPU **blueprint** that specifies what instructions the CPU can process, how it interacts with the memory unit, the basic CPU components, instruction formats, and many more. 

In this chapter, we will study how each of the 32 $$\beta$$ instructions is supposed to work, and how the $$\beta$$ **CPU** (an implementation of the $$\beta$$ ISA) is able to compute each and every one of them by reprogramming its datapath without physically changing its hardware.  

The key is to have a proper **Control Logic** unit that is able to ***decode***  current instruction's `OPCODE` and give out the correct control signals (PCSEL, RA2SEL, ASEL, etc) to reprogram the datapath. The complete truth table of the control logic unit is as shown below,

<img src="https://dropbox.com/s/2txzo6r3aeynguy/CU_2.png?raw=1"  class="center_fifty"  >

{: .note}
This unit can be easily implemented using a read only memory. 

We will go through the function of each instruction and understand how the given $$\beta$$ datapath is able to execute the instruction properly by producing appropriate control signals as shown above. 

  

## [Instruction Cycles](https://www.youtube.com/watch?v=4T9MR8BSzt0&t=119s)
At each clock cycle, the CPU has to first **fetch** the current instruction from the Memory and **decode** its `OPCODE`. This instruction tells the CPU what to *do* for this clock cycle.  

### Instruction Fetch

The first thing a CPU must do is to **compute** the *address* (`ia[31:0]`) of the instruction to execute next, and then **fetch** (read) them (`id[31:0]`) from the Physical Memory Unit  (RAM). When we write programs in high-level languages, its compiler or interpreter will translate them into machine instructions that are specific to the CPU's ISA. The control unit will know what control signals to produce and which signals need to be *routed* where for each type of instruction.

{: .note-title
> Running an Executable
> 
> For example, when you double-click (run) an executable `.exe` on Windows, the code for that program is moved from Disk into the Memory Unit (RAM), and the CPU is told what address the first instruction of that program starts at. 
> 
> The CPU **always** maintains an internal register called the Program Counter (PC) that holds the memory location of the next instruction to be executed. 
>

Once the CPU knows the address of the very first instruction to be executed for the current process, it can fetch that first instruction from the Memory Unit and execute it. Figuring out the addresses of the subsequent instructions is easy:
* The first instruction contains the information about the address of the second instruction.  
* The second instruction will also contain the information about the address of the third instruction.
* This is **repeated** until the CPU met a `HALT()` instruction.


{: .note-title}
> Starting Address Assumption
> 
> As of now, you always assume that the content of the PC register is always initially zero (32-bit of zeroes), and that the first line of your program instruction is always put at memory address zero (`0x00000000`). That means the **first** instruction to your program (first line of code) **must be placed** in the Memory in address 0. 


###  Instruction Decoding

When the CPU has an instruction, it needs to figure out (decode) specifically what type of instruction it is. Each instruction will have a certain set of bits called the `OPCODE` that tells the CPU how to interpret it. In the $$\beta$$ ISA, the `OPCODE` can be found in the <span style="color:red; font-weight: bold;">6 most significant bits</span> of the 32-bits $$\beta$$ instruction. This `OPCODE` is given as an **input** to the Control Unit, and the Control Unit will compute the appropriate **control signals** to program the datapath. 

This decoding step depends on how complex the ISA is. RISC-based computers (e.g: the $$\beta$$ ISA) has a smaller number of instructions (a few dozens) of the same length, while x86-based computers have thousands of differing lengths. In either architecture, we can group their instructions into these three families in general? 
* **Memory Access**: anything regarding loading and storing of data between the REGFILE (CPU internal storage) and the Memory Unit. No other computation is performed.
* **Arithmetic**: anything that requires computation using the ALU, and inputs are taken from the REGFILE.  
* **Branch instructions**: anything pertaining to changing the value of PC Register to load instructions in different Memory Address, (*conditional*) based on a content of a specific register in the REGFILE. 

## Detailed Anatomy of the $$\beta$$ CPU

  
The $$\beta$$ CPU  is comprised of the following standard parts that typically make up a **CPU**:
* PC (program counter),  
* REGFILE (register file),  
* ALU (arithmetic logic unit), and 
* CU (control unit).

  

### [Program Counter and Physical Memory Unit](https://www.youtube.com/watch?v=4T9MR8BSzt0&t=402s)

 
The PC is a 32-bit register (i.e: a set of **32** 1-bit registers). Its job is to store the address of the **current** instruction that is executed. For now, we can safely assume that the initial content of the `PC` REG is always `0x0` (32 bits). 

The datapath of the components involving the PC and the Physical Memory is shown in the figure below:

<img src="/50002/assets/contentimage/beta/pc.png"  class="center_full"/>

The memory unit is neatly segmented into **instruction** memory and **data** memory for the sake of **learning** and **simplicity**. In reality, this might not always be the case. Your operating system will do the memory management for you and decide where in the physical memory each process should reside and run. 

Two important things happened **at the same time** at every CPU clock cycle:
1. The output of the PC Register is connected to the `ia` port (the input address port) of the Memory Unit (RAM or **Physical Memory**), hence the Memory Unit will produce the content of that address through the `Ins` (instruction) port. 
2. The output of the PC REG will also be added by 4. 
	* If `PCSEL=0` and `RESET=0`,  this value (old PC + 4) will enter the PC REG in the next clock cycle. This will cause the PC to supply the address of the **subsequent instruction word** in the next clock cycle. 
	*  If `PCSEL!=0` and `RESET=0`, then the value in the PC REG will be equivalent to either of the inputs to the PCSEL mux (depending on what `PCSEL` value is). 

#### RESET
If `RESET=1` then the value of the PC REG in the next cycle will be equivalent to `RESET`. We will learn what `RESET` is in the later weeks but in short, if `RESET=1`, then the value in the `PC` REG will will be set to `0x80000000` in the **next** clock cycle *instead of being increased by 4* or whichever other address that the supposed current instruction should compute. 

You will learn in the Virtual Machine chapter on why the MSB of `RESET` is `1` instead of `0`, but for now you can take its purpose as simply *resetting* the machine and eventually putting content of `PC` REG content back to `0` (restarting the program). 

{: .note}
> Setting `PC=RESET` means that we will **execute** whatever instruction that resides at `0x80000000` in the next cycle. The instruction that resides in the `RESET` address is called the **reset handler**. It is usually a standard routine to **restart your computer**/devices. 



<img src="/50002/assets/contentimage/beta/reset.png"  class="center_seventy"/>

### [Register Files](https://www.youtube.com/watch?v=4T9MR8BSzt0&t=657s)

The REGFILE in $$\beta$$ ISA is the CPU's internal storage unit that is comprised of 32 sets of 32-bit registers, denoted as $$R_0, R_1, ...., R_{31}$$. **Each register is addressable in 5 bits**. For example: `00000` is the address of $$R_0$$, `00001` is the address of $$R_1$$, `00010` is the address of $$R_2$$, and so on.

{: .important}
Remember, a 32-bit register simply means a set of **32** 1-bit registers

The figure below shows the anatomy of $$\beta$$ REGFILE component:

<img src="/50002/assets/contentimage/beta/regfile.png"  class="center_seventy"/>

It has two **combinational** read ports: `RD1` and `RD2`, and one **clocked/sequential** write port: `WD`. 

We can **simultaneously** (at the same clock cycle) **read** the contents of two selected registers, addressable in 5 bits denoted as `Ra` and `Rb`, :
* The 5-bit address `Ra` is supplied through port `RA1`
* The 5-bit address `Rb` is supplied through `RA2`

We can also **write** data supplied at the `WD` port to any of the registers in the REGFILE:
* In order to write, a valid `1` must be supplied at the `WE` port
* The address of the register to write into is determined by the 5-bit input supplied at the `WA` port. 

#### The Write Enable Signal
Recall that a register / D Flip-Flop sort of **captures** a NEW input value at each CLK rise, and is able to maintain that **stable** value for the period of the CLK. 


However, in practice, we might not want our register to "capture" new input all the time, but only on certain moments. Therefore, there exist a `WE` signal such that:
* When it's value is `1`, the register "**captures**" and **stores** the current input in in it's `MEMORY` mode.
* Otherwise, the register will ignore the input and will **output the last stored** value regardless of the CLK edge. 


#### Detailed Anatomy of the REGFILE

To understand how the Write Enable `WE` signal works more clearly, we need to dive deeper into the inner circuitry of the REGFILE. The figure below shows a more detailed anatomy of the REGFILE unit. 

{: .note-title}
> The Special Register `R31`
> 
> R31's content is  always  `0x00000000`, regardless of what values are written to it. Therefore it is not a regular register like the other 30 registers in the REGFILE. It is simply giving out `0x00000000` as output when RA1 or RA2 is 11111, which is illustrated as the 0 on the rightmost part of each read muxes.

<img src="/50002/assets/contentimage/beta/regfile_detailed.png"  class="center_seventy"/>

The `WE` signal is fed into a 1-to-32 demultiplexer unit. The `WA` signal is the selector of this demux. As a result, only 1 out of the 32 outputs of the demux will follow exactly the value of `WE`. The outputs of the demux is used as a selector (`EN` port) to each of the *2-to-1* 32-bit multiplexer connected to each 32-bit register.

{: .note}
Although not drawn (to not clutter the figure further), all the registers are synchronized with the same CLK. 

#### [The Static and Dynamic Discipline of the REGFILE](https://www.youtube.com/watch?v=4T9MR8BSzt0&t=1161s)

As mentioned above, the REGFILE unit has **2 combinational read ports** that is made up by the two large *32-to-1* 32-bit multiplexers drawn at the bottom of the figure. We can supply two read addresses: `RA1` and `RA2`. They are the selector signals of these two multiplexers. Therefore the time taken to produce valid output (32-bit) data at `RD1` and `RD2` is at least  the $$t_{pd}$$ of the multiplexer and $$t_{pd}$$ of the DFFs depending on when exactly the addresses become valid. 

This unit also have **1 sequential write port**. The write data is always supplied at `WD`. When the `EN` signal of a target register is a valid `1`, we need to wait until the nearest CLK rise edge in order for `WD` to be reflected at the `Q` port of that register. 

In register transfer language, the content of register with address `A` is often denoted as : `Reg[A]` 

The timing diagram for read and write is shown below. Please take some time to study them: 
<img src="https://dropbox.com/s/rvpovodxab54ywl/timing_reg.png?raw=1" class="center_fifty"   >


Notice how the new data denoted as `new Reg[A]` supplied at port `WD` (to be written onto `Reg[A]`) must fulfill both $$t_S$$ and $$t_h$$ requirement of the hardware. 

{: .important-title}
> Register Content (32 bits) vs Register Address (5 bits)
> 
> The <span style="color:red; font-weight: bold;">CONTENT</span> of a Register `Ra` in a REGFILE is **distinct** from the <span style="color:red; font-weight: bold;">ADDRESS</span> of Register `Ra` in the REGFILE. For instance, you can store the value `0xDEADBEEF` in Register `R3`. The address of this register is 3 (`0b00011`) but the content is `0xDEADBEEF`. 
  

### [Control Logic Unit](https://www.youtube.com/watch?v=4T9MR8BSzt0&t=1309s)

The heart of the control logic unit (CU) is a **combinational** logic device that receives 6-bit `OPCODE` signal, 1-bit `z` signal, 1-bit `RESET` signal, and 1-bit `IRQ` signal as input. We will discuss about `RESET`, `z` and `IRQ` much later on.

At each CLK cycle, the PC will supply a new 32-bit address to the Memory Unit, and in turn, 32-bit instruction data is produced by the Memory Unit. The first 6 bits of the instruction, called the `OPCODE` is supplied as an input to the CU. 

The CU will then decode the input combination consisted of `OPCODE`, `z`, `RESET`, and `IRQ`, and produce various control signals as shown in the figure below. In practice, this unit can be made using a ROM.

<img src="/50002/assets/contentimage/beta/cu.png"  class="center_seventy"/>

Note that the `ALUFN` is 6 bits long, `PCSEL` is 3 bits long, `WDSEL` is 2 bits long, `RA2SEL`, `BSEL` `ASEL`, `WASEL`, `WR`, and `WERF` (`WE` to REGFILE) are all 1 bit long. The total number of output bits of the CU is therefore *at least* 17 bits long 

{: .note}
In our Lab however, the output signal of the control unit is 18 bits long. We don't have to memorise these, as long as we get the main idea.


{: .new-title}
> The IRQ (Interrupt) Signal
> 
> Notice the presence of `clk` as input into the Control Unit. This is because we need to **sample** the interrupt signal at the beginning of instruction execution. You may ignore this for now, we will learn more about it in the later weeks. For simplicity, we omit the display of this register unit in the diagrams to explain the datapaths below. 

## Beta Datapaths

The $$\beta$$ datapath can be reprogrammed by setting the appropriate control signals depending on the current instruction's `OPCODE`. In general, we can separate the instructions into four categories, and explain the datapath for each:
* The `OP` datapath (Type 1)
* The `OPC` datapath (Type 2)
* Memory access datapath (Type 2)
* Control transfer datapath  (Type 2)

## Basic Operation Datapath
### [OP datapath](https://www.youtube.com/watch?v=4T9MR8BSzt0&t=1662s)

**Purpose**<br>
Perform any **logical** computations using the ALU. The inputs to the `A` and `B` port of the ALU is taken from the <span style="color:red; font-weight: bold;">contents</span> of any two registers `Reg[Ra]` and `Reg[Rb]` from the REGFILE. The output of the ALU is stored as a <span style="color:red; font-weight: bold;">content</span> of `Reg[Rc]`.


The instructions that fall under `OP` category are: `ADD, SUB, MUL, DIV, AND, OR, XOR, CMPEQ, CMPLT, CMPLE, SHL, SHR`, and `SRA`. Its general format is:

<img src="https://dropbox.com/s/sufiy5rhdo5k2j0/op_ins.png?raw=1" class="center_fifty"  >

**Register Transfer Language**<br>
The register transfer language for this instruction is: 
<br>
`PC` $$\leftarrow$$ `PC+4`<br>
`Reg[Rc]` $$\leftarrow$$ `Reg[Ra]` `(OP)`  `Reg[Rb]` <br>

**Assembly Language Format**<br>
The corresponding assembly instruction format runnable in BSIM is `OP(Ra, Rb, Rc)`

{: .important}
Read the $$\beta$$ documentation and fully study the functionalities of each instruction. 

**Datapath**<br>

<img src="/50002/assets/contentimage/beta/op.png"  class="center_seventy"/>

The highlighted lines in **pink** show how the signals should flow in order for the $$\beta$$ to support `OP` instructions. 


**Control Signals**

-  `ALUFN = F(OP)` 
	-	This means the `ALUFN` signal for the corresponding operation `OP`, for example, if `OPCODE = SUB` then `ALUFN  = 010001`, and so on.
-  `WERF = 1`
- `BSEL = 0`
-  `WDSEL = 01`
-  `WR = 0`
-  `RA2SEL = 0`
-  `PCSEL = 000`
-  `ASEL = 0` 
-  `WASEL = 0`

{: .new-title}
> Think!
> 
> Take some time to understand why the value of these control signals must be set this way to support the `OP` instructions. 



### [OPC datapath](https://www.youtube.com/watch?v=4T9MR8BSzt0&t=2061s)

**Purpose**<br>
Perform any **logical** computations using the ALU (similar to `OP` above). The `OPC` (Type 2 instruction) datapath is similar to the `OP` datapath, except that input to the `B` port of the ALU must be a **constant** that comes from `c = I[16:0]`, **sign extended** to 32-bits. There is no `Rb` field in Type 2 instruction, only the `c`-field. The output is stored as a <span style="color:red; font-weight: bold;">content</span> of `Reg[Rc]`


The instructions that fall under `OPC` category are: `ADDC, SUBC, MULC, DIVC, ANDC, ORC, XORC, CMPEQC, CMPLTC, CMPLEC, SHLC, SHRC`, and `SRAC`. It's general format is:

<img src="https://dropbox.com/s/wcirw4bgwhh2xbg/opc_insdfhi9j45vnuw7n0/opc.png?raw=1" class="center_fifty"  >

**Register Transfer Language**<br>
`PC` $$\leftarrow$$ `PC+4`<br>
`Reg[Rc]` $$\leftarrow$$ `Reg[Ra]` `(OP)`   `SEXT(C)` <br>

{: .important}
Again, don't forget to read $$\beta$$ documentation to understand each functionalities. 

**Assembly Language Format**<br>
The corresponding assembly instruction format runnable in BSIM  is `OPC(Ra, c, Rc)`

**Datapath**<br>
<img src="/50002/assets/contentimage/beta/opc.png"  class="center_seventy"/>

**Control Signals**<br>
The control signals for `OPC` instructions are almost identical to `OP` operations, except that we need to have  `BSEL = 1`. 

### Sample Code

{: .new-title}
> Try it Yourself!
> 
> Try it yourself by running this code step by step on BSIM and observe the datapath to familiarize yourself with how OP and OPC datapath works.
> * At each time step, be aware of the value of PC and all Registers. 
> * **Familiarise** yourself with how to translate from the assembly language to the 32-bit machine language

```nasm
.include beta.uasm

ADDC(R31, 5, R0)
SUBC(R31, 3, R1)
MUL(R0, R1, R2)
CMPEQ(R1, R1, R4) 
CMPLT(R0, R1, R4)
SHL(R1, R1, R5)
SRAC(R5, 4, R5)
SHRC(R1, 4, R6)
```

## Memory Access Datapath

There are three instructions that involve access to the Memory Unit: `LD`, `LDR` and `ST`. All of them are Type 2 instructions.


### [LD Datapath](https://www.youtube.com/watch?v=4T9MR8BSzt0&t=2565s)

The general format of the `LD` instruction is:

<img src="https://dropbox.com/s/bicusis1a1cx707/ld_ins.png?raw=1"  class="center_fifty" >

**Purpose**<br>
The LD instruction allows the CPU to **load** one word (32-bit) of data from the Memory Unit and store it to `Rc`. The effective address (`EA`) of this data that we are about to Load to the CPU can be computed from **adding** content of Register `Ra` and 16 bit signed constant `c`. The data fetched from memory with this `EA` is stored as the **content** of `Reg Rc`.

**Register Transfer Language**<br>
`PC` $$\leftarrow$$ `PC+4`<br>
`EA` $$\leftarrow$$ `Reg[Ra] + SEXT(C)`<br>
`Reg[Rc]` $$\leftarrow$$ `Mem[EA]` <br>

**Assembly Language Format**<br>
The corresponding assembly instruction format runnable in BSIM is `LD(Ra, c, Rc)`

**Datapath**<br>
<img src="/50002/assets/contentimage/beta/ld.png"  class="center_seventy"/>

**Control Signals<br>**
-  `ALUFN = ADD (000000)` 
-  `WERF = 1`
- `BSEL = 1`
-  `WDSEL = 10`
-  `WR = 0`
-  `RA2SEL = --`
   -  `--` means we don't care what the value is, since we don't utilise this datapath involving `RA2SEL`
-  `PCSEL = 000`
-  `ASEL = 0`
-  `WASEL = 0`
  

### [LDR datapath](https://www.youtube.com/watch?v=4T9MR8BSzt0&t=3044s)

**Purpose**<br>
The `LDR` instruction is similar to the `LD` instruction, except in the method of computing the `EA` of the data loaded. It computes `EA` **relative** to the current address pointed by `PC`.

The general format of the `LDR` instruction is:
<img src="https://dropbox.com/s/5kj00vwcw0ghlfp/ldr_inst.png?raw=1" class="center_fifty"  >

**Register Transfer Language**<br>
`PC` $$\leftarrow$$ `PC+4`<br>
`EA` $$\leftarrow$$ `PC+4*SEXT(C)`<br>
`Reg[Rc]` $$\leftarrow$$ `Mem[EA]` <br> 
  
**Assembly Language Format**<br> 
The corresponding assembly instruction format runnable in BSIM is `LDR(label, Rc)`. We give the `label` (target address) to the assembler, and it auto computes `c` with the formula: `(address_of_label - address_of_current_ins)/4-1`


**Datapath**<br>
<img src="/50002/assets/contentimage/beta/ldr.png"  class="center_seventy"/>

**Control Signals**

-  `ALUFN = 'A' (011010)` 
   - The ALU is simply required to be *transparent*, i.e: "pass" the input at the `A` port through to its output port. 
-  `WERF = 1`
- `BSEL = --`
-  `WDSEL = 10`
-  `WR = 0`
-  `RA2SEL = --`
-  `PCSEL = 000`
-  `ASEL = 1` 
-  `WASEL = 0`


  
  
### [ST datapath](https://www.youtube.com/watch?v=4T9MR8BSzt0&t=2837s)

**Purpose**<br>
The `ST` instruction does the <span style="color:red; font-weight: bold;">opposite</span> to what the `LD` instruction does. It allows the CPU to **store** contents from one of its REGFILE registers to the Memory Unit. It **stores**  data present in `Rc` to the Memory Unit. 

Similar to how `EA` is computed for `LD`, the **effective address** (`EA`) of where the data is supposed to be stored is computed using the content of `Ra`  (32-bit) added with `c` (sign extended to be 32-bit).

{: .note}
The instructions `ST` and `LD`/`LDR` allows the CPU to have access to an expandable memory unit without changing its datapath, although the CPU itself has a limited amount of internal storage in the REGFILE. 

The general format of the `ST` instruction is:
<img src="https://dropbox.com/s/is3q37kvo167325/st_ins.png?raw=1"  class="center_fifty" >

**Register Transfer Language**<br>
`PC` $$\leftarrow$$ `PC+4`<br>
`EA` $$\leftarrow$$ `Reg[Ra]+SEXT(c)`<br>
`Mem[EA]`  $$\leftarrow$$   `Reg[Rc]`<br>


**Assembly Language Format**<br> 
The corresponding assembly instruction format runnable in BSIM is `ST(Rc, c, Ra)`, notice the swapped `Rc` and `Ra` position. 


**Datapath**<br>
<img src="/50002/assets/contentimage/beta/st.png"  class="center_seventy"/>

  
The control signals therefore must be set to: 
-  `ALUFN = 'ADD' (000000)` 
-  `WERF = 0`
- `BSEL = 1`
-  `WDSEL = --`
-  `WR = 1`
-  `RA2SEL = 1`
-  `PCSEL = 000`
-  `ASEL = 0` 
-  `WASEL = --`

### Sample Code

{: .new-title}
> Try it yourself!
> 
> **Try it yourself** by running this code step by step on BSIM and observe the datapath to familiarize yourself with how LD, LDR and ST datapath works.
> * At each timestep, be aware of the value of PC and all Registers. 
> * Be aware on the value stored at certain memory locations 
> * Familiarise yourself with how to translate from the assembly language to the 32-bit machine language using *labels* and *literals*


```nasm
.include beta.uasm

LD(R31, x, R0)
LD(R31, x + 4, R1)
LD(R31, x + 8, R2)
LD(R31, x + 12, R3)
LDR(x, R4)
LDR(x+8, R5)
MUL(R0, R3, R0)
ADD(R1, R1, R1)
ADDC(R31, 12, R6)
ST(R0, x)
ST(R1, x, R6)

x : LONG(15) | this is an array
	LONG(7)
	LONG(9)
	LONG(-1)
```


## Control Transfer Datapath

So far, we have only seen `PC` to be advanced by 4:  `PC` $$\leftarrow$$ `PC+4`. With instructions involving transfer-of-control, we are going to set `PC` a little bit differently. 

There are three instructions that involves **transfer-of-control** (i.e: *branching*, or *jumping*), that is to change the value of `PC` so that we can execute instruction from other `EA` in the Memory Unit instead of going to the next line. These instructions are `BEQ`, `BNE`, and `JMP`. 

{: .warning}
We do not use the ALU at all when transferring control. 


### [BEQ datapath](https://www.youtube.com/watch?v=4T9MR8BSzt0&t=3642s)

**Purpose**<br>
This instruction allows the `PC` to *branch* to a particular `EA` if the content of `Ra` is zero.  It is commonly used when checking for condition prior to branching, e.g: `if x==0, else`.

The **address** of the instruction following the `BEQ` instruction is written to `Rc`. 
* If the contents of  `Ra` are zero, the `PC` is loaded with the target address `EA`;
* Otherwise, execution continues with the next sequential instruction.

{: .note-title}
> Z
> 
> The checking of the content of `Ra` is **not** done through ALU, but rather through the 32-bit NOR gate that produces `Z` (1-bit). The value of `Z` is fed to the CONTROL UNIT to determine whether PCSEL should be `001` or `000` depending on the value of `Z`.

  
The general format of the `BEQ` instruction is:
<img src="https://dropbox.com/s/hla3dyi15xjxocf/beq_inst.png?raw=1"   class="center_fifty" >

**Register Transfer Language**<br>
`PC` $$\leftarrow$$ `PC+4`<br>
`Reg[Rc]` $$\leftarrow$$ `PC`<br>
`EA` $$\leftarrow$$ `PC + 4*SEXT(C)`<br>
`if (Reg[Ra] == 0)` then `PC` $$\leftarrow$$ `EA`<br>


**Assembly Language Format**<br> 
The corresponding assembly instruction format runnable in BSIM is `BEQ(Ra, label, Rc)` where `c` is **auto** computed as `(address_of_label - address_of_current_ins)/4-1`

**Datapath**<br>
<img src="/50002/assets/contentimage/beta/beq.png"  class="center_seventy"/>


**Control Signals**<br>
-  `ALUFN = --`
	- We aren't using the ALU at all when transferring control, so we don't care about what values goes as `ALUFN`.  
-  `WERF = 1`
- `BSEL = --`
-  `WDSEL = 00`
-  `WR = 0`
-  `RA2SEL = --`
-  `PCSEL = Z ? 001 : 000`
-  `ASEL = --` 
-  `WASEL = 0`
  
### [BNE datapath](https://www.youtube.com/watch?v=4T9MR8BSzt0&t=4011s)

**Purpose**<br>
`BNE` is similar to  `BEQ`, but branches `PC` in the <span style="color:red; font-weight: bold;">opposite</span> way, i.e: when `Ra != 0`. It also utilizes the output `Z`.
  
The general format of the `BNE` instruction is:
<img src="https://dropbox.com/s/wrqpdsusx3g7lkd/bne_ins.png?raw=1" class="center_fifty"   >

**Register Transfer Language**<br> 
`PC` $$\leftarrow$$ `PC+4`<br>
`Reg[Rc]` $$\leftarrow$$ `PC`<br>
`EA` $$\leftarrow$$ `PC + 4*SEXT(C)`<br>
`if (Reg[Ra] != 0)` then `PC` $$\leftarrow$$ `EA`<br>

**Assembly Language Format**<br> 
The corresponding assembly instruction format runnable in BSIM is `BNE(Ra, label, Rc)` where `c` is **auto** computed as `(address_of_label - address_of_current_ins)/4-1`

**Datapath**<br>
<img src="/50002/assets/contentimage/beta/bne.png"  class="**center_full**"/>


**Control Signals**<br>
-  `ALUFN = --`
-  `WERF = 1`
- `BSEL = --`
-  `WDSEL = 00`
-  `WR = 0`
-  `RA2SEL = --`
-  `PCSEL = Z ? 000 : 001`
-  `ASEL = --` 
-  `WASEL = 0`


  
### [JMP Datapath](https://www.youtube.com/watch?v=4T9MR8BSzt0&t=4112s)

**Purpose**<br>
`JMP` also allows the CPU to change its `PC` value, but without any condition (hence the name: *jump*). The **address** of the instruction following the `JMP` instruction is written to `Rc`, then  `PC` is loaded with the contents of  `Ra`. The low two bits of `Reg[Ra]` must be **masked** (force set to `00`) to ensure that the target address is aligned on a 4-byte boundary.
  
{: .new-title}
> Think!
>
> If `Reg[Ra]` is `0x00001357`, we can **force** it's lower to bits to be `00`, by doing a `BITWISE AND` with **mask** `0xFFFFFFFC` hence resulting in `0x00001354`. **Why** do we need to do this? 

The general format of the `JMP` instruction is:
<img src="https://dropbox.com/s/94bul2ifo7a3afj/jmp_inst.png?raw=1" class="center_fifty"   >

**Register Transfer Language**<br>
`PC` $$\leftarrow$$ `PC+4`<br>
`Reg[Rc]` $$\leftarrow$$ `PC`<br>
`EA` $$\leftarrow$$ `Reg[Ra] & 0xFFFFFFFC` (masked)<br>
`PC`$$\leftarrow$$ `EA`<br>
* The corresponding assembly instruction format runnable in BSIM is `JMP(Ra, Rc)`.

 
**Datapath**<br>
<img src="/50002/assets/contentimage/beta/jmp.png"  class="center_seventy"/>


**Control Signals**<br>
-  `ALUFN = --`
-  `WERF = 1`
- `BSEL = --`
-  `WDSEL = 00`
-  `WR = 0`
-  `RA2SEL = --`
-  `PCSEL = 010`
-  `ASEL = --` 
-  `WASEL = 0`


### Sample Code

{: .new-title}
> Try it Yourself!
>
> Run this code step by step on BSIM and observe the datapath to familiarize yourself with how OP and OPC datapath works.
> * At each timestep, be aware of the value of PC and all Registers. 
> * Know where is the address of each instruction when loaded to memory
> * Note how to translate from `label` to `literal`  when crafting the 32-bit machine language for `BEQ/BNE` instructions.
  
```nasm
.include beta.uasm

ADDC(R31, 3, R0)

begin_check: CMPEQ(R31, R0, R1)
BNE(R1, is_zero, R10)
SUBC(R0, 1, R0)
BEQ(R31, begin_check, R10)

is_zero: JMP(R31)
```


## More about RESET
The $$\beta$$ processor accept external `RESET` signal that can reset the value of the `PC`. The signal `RESET` must be `1` for <span style="color:red; font-weight: bold;">several</span> clock cycles in order to ensure that the values affected by `RESET` propagates throughout the entire circuit. During the period where `RESET = 1`, we need to make sure that `WR` is `0` so that we do not accidentally overwrite the content of the physical memory.


## [CPU Benchmarking](https://www.youtube.com/watch?v=4T9MR8BSzt0&t=4767s)

We always want a CPU that has a high performance (most instruction per second) at a low cost. Unfortunately there will always be a tradeoff between the two. Although it is common to judge a CPU's performance from its *clock rate* (cycles per second, typically ranging between 2-4 GHz per core for modern computers), we also need to consider another metric called the $$CPI$$, that is the *average clock cycles* used to execute a single instruction.

We can benchmark the quality of a CPU by computing its $$MIPS$$ (million instruction per second),

$$MIPS = \frac{Clock Rate }{CPI}$$

where $$CPI$$ means **clocks per instruction**. 

{: .note}
$$\beta$$ assembly language takes exactly 1 clock per instruction. However, this is not always true in general. Complex architectures like the `x86` might require several cycles to perform a single instruction. Besides, if we loosely meant the benchmarking instruction as *high-level* instruction, then surely it takes more than 1 clock cycle to compute because they can be assembled into many lines of instructions. 

For instance:

```python
# assume x is at memory address 48 (just an arbitrary choice)
x = 3 # single line of assignment 

# translates to at least 2 cycles in Beta
ADDC(R31, 3, R2)
ST(R2, 0x0030, R31) 
```

Typically, one will choose a particular program (written in a particular language, e.g: c or Python) for **benchmarking** purposes, and the same benchmark program is run on different CPUs with potentially different Clock Rate and $$CPI$$. 

{: .highlight}
The higher the $$MIPS$$, the faster it takes to run the benchmark program. Therefore we can say that a CPU with the highest $$MIPS$$ has the best performance.

## Summary
You may want to watch the post lecture videos here:
* [Part 1: Beta Datapath](https://youtu.be/IXiSoP_0Kvc)
* [Part 2: Beta Datapath Analysis - this is difficult!](https://youtu.be/4MmUEeAKmxc)


This chapter focuses on the architecture and operation of the \(\beta\) CPU, designed as an educational tool to help understand the principles of CPU design and operation. Key topics covered include:

- **CPU Components and Functions**: The architecture includes a Program Counter (PC), Register Files (REGFILE), Arithmetic Logic Unit (ALU), and a Control Unit (CU). Each component plays a critical role, with the PC determining the sequence of operations, REGFILE storing temporary data, ALU performing arithmetic and logical operations, and the CU directing all these activities based on the decoded instructions.

- **Memory Interaction**: Instructions are fetched from memory and executed by the CPU. This process involves the PC fetching the instruction address, the memory returning the instruction data, and the CU decoding and executing these instructions.

- **Control Logic and Signals**: The control unit uses various signals derived from the opcode of each instruction to control the flow of data and operations within the CPU. This includes signals for selecting operation types and directing data paths within the CPU.

- **Datapaths**: The CPU's datapaths are configured based on the type of instruction being executed, which can involve direct arithmetic operations, memory access, or control transfer instructions. These paths dictate how data moves through the CPU and how results are stored or used.

- **Instruction Set and Encoding**: The Beta CPU uses a specific set of instructions, each encoded in a standard format that the CU can interpret. This includes simple arithmetic operations to more complex memory and control instructions.

In short, we provide a detailed insight into how a simplified yet functional CPU operates, mirroring larger, more complex systems used in real-world computing (especially RISC family).


We can run these instructions written in machine language (`0`s and `1`s), but obviously it is not user friendly at all, not to mention that this CPU alone *does not support reusable instructions* (we know them as **functions**). The next lecture introduces us to assemblers and compilers, which are softwares created to help us utilise the $$\beta$$ CPU better (program more easily) so that we can be more focused on designing our program, and less time *writing* the program. 



