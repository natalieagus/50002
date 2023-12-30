---
layout: default
permalink: /lab/lab3-part1
title: Lab 3 - Arithmetic Logic Unit with FPGA (Part 1)
description: Lab 3 handout covering topics from Logic Synthesis, and Designing an Instruction Set
parent: Labs
nav_order:  4
---

* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design
<br>
Modified by: Kenny Choo, Natalie Agus, Oka Kurniawan (2021)

# Lab 3: Arithmetic Logic Unit
{: .no_toc}

{: .warning}
Before this lab, you are required to [complete this very basic FPGA tutorial](https://natalieagus.github.io/50002/fpga/fpga_1) we wrote and perhaps the official [Getting-Started-With-FPGA tutorial](https://alchitry.com/your-first-fpga-project) by Alchitry lab. Please **come prepared** and bring your FPGA + laptops where Vivado + Alchitry Lab is installed. At least one person in each team should have a laptop that can run Vivado and bring the FPGA. 


## Starter Code
Please clone the starter code from this repository, then **open** it with Alchitry Lab. 
```
git clone https://github.com/natalieagus/alu-starter.git
```

{: .important}
Since there's only 1 FPGA per group, you need to work through this lab as a 1D group during class. However each person must still submit the lab questionnaire **individually**.


## Related Class Materials
The lecture notes on [Logic Synthesis](https://natalieagus.github.io/50002/notes/logicsynthesis) and [Designing an Instruction Set](https://natalieagus.github.io/50002/notes/instructionset) are closely related to this lab. 

**Part A:** Design the ALU Components (Task 1-4) and **Part B:** Studying a Multiplier Design
<br>Related sections in the notes: **[Logic Synthesis](https://natalieagus.github.io/50002/notes/logicsynthesis)**	
* [N-input gates](https://natalieagus.github.io/50002/notes/logicsynthesis#n-input-gates) (all kinds of gates to produce the logic of each component in the ALU)
* [Special combinational logic devices](https://natalieagus.github.io/50002/notes/logicsynthesis#special-combinational-logic-devices) (multiplexer with 1 or 2 selectors, and combining multiplexers together to form an even bigger one)

**Part C:** Combine each combinational element in Part A and Part B to form an ALU
<br>Related sections in the notes: **Designing an Instruction Set**
* [Basics of programmable control systems](https://natalieagus.github.io/50002/notes/instructionset#an-example-of-a-basic-programmable-control-system) (using control signals like ALUFN to **perform different operations (`ADD`, `SHIFT`, `MUL`, etc)** between two **32-bit** inputs A and B in the same ALU circuit -- no hardware modification needed). 

The lab will reinforce your understanding on how you can build the circuit to conform to the logic that you want, e.g: adder circuit will perform binary addition of input A and B, etc, and make it **programmable** using the control signal: `ALUFN`. 

## Part 1 Introduction 

In this lab, we will build a 32-bit **arithmetic and logic unit (ALU)** for the Beta processor. You <span style="color:#ff791a; font-weight: bold;">will</span> need this for your 1D Project Checkoff 1, just that you will need to modify it to be a 16-bit ALU.  

{: .new-title}
> Arithmetic Logic Unit (ALU)
> 
> The ALU is a **combinational** logic device that has two **32-bit inputs** (which we will call “A” and “B”) and produces one **35-bit output**: `alu[31:0]`, `Z`, `V`, and `N`. 
> We will start by designing the ALU modularly. It is composed from five as a separate modules, each producing its own 32-bit output. 
> We will then combine these outputs into a single ALU result.

In this lab (both Part 1 and 2), we will attempt to create a 32-bit ALU. It is one of the components inside our Beta CPU. We will eventually utilise our work here to build an entire Beta CPU circuit in the next lab (Lab 4). 

The Arithmetic Logic Unit (ALU) serves as the central core of the CPU, handling a variety of logical computations. Essential operations that a standard ALU encompasses are:
* An Addition/Subtraction Unit, facilitating elementary addition and subtraction tasks.
* A Comparison Unit, utilized for branching functions.
* A Boolean Unit, dedicated to boolean operations such as XOR, bit masking, and similar tasks.
* A Shifter Unit, instrumental in operations like division or multiplication by 2, as well as segmenting data.
* A Multiplier Unit, specialized in performing multiplication. The design of this unit is more complicated than the rest of the units. We will do this in Part 2 of the Lab, alongside assembling the complete 32-bit ALU. 

{: .important-title}
> Important: <span style="color:red; font-weight: bold;">ALUFN</span> != <span style="color:red; font-weight: bold;">OPCODE</span>
> 
> 
> The `ALUFN` signal is **NOT** Beta CPU `OPCODE`, despite both being 6-bit long. These two encodings are **NOT** the same.
> The `ALUFN` is used to **control** the operation of the ALU circuitry, while the Beta CPU `OPCODE` is used by the Control Unit to **control** the entire Beta CPU datapath. In Lab 4, you will build a ROM as part of the Control Unit that will translate the `OPCODE` field of a currently executed instruction into the appropriate `ALUFN` control signal. 


## Task 1: Adder and Subtractor Unit
Design an **adder/subtractor** unit that operates on 32-bit two’s complement (**SIGNED**) inputs (`A[31:0]`, `B[31:0]`) and generates a 35-bit output: (`S[31:0]`) **and**`Z`, `V`, `N` signals.  

It will be useful to generate three other output signals to be used by the comparison logic in Part B: 
* `Z` which is true when the S outputs are all zero (i.e., `NOR(S) == 1 ? Z = 1 : Z = 0`)
* `V` which is true when the addition operation overflows (i.e., the result is too large to be represented in 32 bits), and 
* `N` which is true when the S is negative (i.e., `S31 == 1 ? N = 1 : N = 0`). 


The following schematic is a big picture for how to go about the design:

<img src="/50002/assets/contentimage/lab3/3.png"  class=" center_seventy"/>

The `ALUFN0` input signal selects whether the operation is an `ADD` or `SUBTRACT`.  
* `ALUFN0` will be set to `0` for an `ADD (S = A + B)` and `1` for a `SUBTRACT (S = A – B)`; 
* To do a `SUBTRACT`, the circuit first computes the two’s complement negation of the “B” operand by inverting “B” and then adding one (which can be done by forcing the carry-in of the 32-bit add to be 1).  

`A[31:0]` and `B[31:0]` are the 32-bit two’s complement (SIGNED) **input** operands and `S[31:0]` is the 32-bit **output**. `Z/V/N` are the three **other output** code bits described above. 

Start by implementing the 32-bit add using a ripple-carry architecture. You’ll have to construct the 32-input NOR gate required to compute Z using a tree of smaller fan-in gates (the parts library only has gates with up to 4 inputs).

#### Computing Overflow
**Overflow** can never occur when the two operands to the addition have **different** signs. If the two operands have the same sign, then overflow can be detected if the sign of the result differs from the **sign** of the operands. Note that `XA` and `XB` are just the input nodes of the `FA` drawn in the diagram above. 

$$\begin{align*}
V = &XA_{31} \cdot XB_{31} \cdot \overline{S_{31}} + \overline{XA_{31}} \cdot \overline{XB_{31}} \cdot S_{31}
\end{align*}$$

{: .new-title}
> Think!
> 
> Why is `V` computed as above? Start by having a small example, let's say a 4-bit RCA. If we have `A: 0111`, and `B: 0001`, adding both values will result in a **positive overflow**. The true answer to this should be decimal `8`. With signed devices, we need **5** bits to represent decimal 8: `01000`. However since our RCA can only output 4-bits, we have our output as just `1000`, and this means decimal -8 in a **signed** 4-bit output. Now think about other possible overflow cases (negative overflow, etc).


#### Detailed Adder/Subtractor Schematic
Here’s the detailed schematic of the adder. Please **label** the nodes yourself before describing them in jsim so that you don’t make typos and end up in a debugging nightmare. 

<img src="/50002/assets/contentimage/lab3/adder.png"  class=" center_seventy"/>

{: .highlight}
**Write** your answer in the space provided inside `lab3_alu_submit.jsim`, and include `lab3_testadder.jsim` header to test your adder32 unit only. You can <span style="color:red; font-weight: bold;">comment</span> out `lab3checkoff.jsim` for the time being. 

```cpp
**********************************
**** FA circuit ******************
.subckt FA a b cin s co
* Paste your answer from Lab 2 here
* Replace the gates using stdcell gates instead of your custom gates
* BEGIN ANSWER


* END ANSWER
.ends

**********************************
**** Adder32 circuit *************
.subckt adder32 ALUFN[0] a[31:0] b[31:0] s[31:0] z v n
* BEGIN ANSWER


* END ANSWER
.ends
*********************************
```

#### Test 
To use the test jig `lab3_testadder.jsim`:
1. Uncomment the `lab3_testadder.jsim` file in the header and comment the rest as such: 
```cpp
.include "nominal.jsim"
.include "stdcell.jsim"
.include "lab3_mult.jsim"
.include "lab3_testadder.jsim"
* .include "lab3_testcompare.jsim"
* .include "lab3_testboolean.jsim"
* .include "lab3_testshifter.jsim"
* .include "lab3_testmultiply.jsim"
* .include "lab3checkoff.jsim"
```
2. Do a **GATE**-level simulation because now we use stdcell library instead of building our own gates using transistor (see [Appendix](https://natalieagus.github.io/50002/lab/lab3#gate-level-simulation))
3. A waveform window showing the `adder32` inputs and outputs should appear as such:

<img src="/50002/assets/contentimage/lab3/6.png"  class="center_full"/>

Click the checkoff button (the **green tick** at the upper right window of JSim). JSim will **check** your circuit’s results against a list of expected values and report any discrepancies it finds. 

Use the waveforms to <span style="color:red; font-weight: bold;">debug</span> your component if any error is found:
  * Find the **time** when the error occur, and get the value of `a` and `b` and `alufn0` that caused it 
  * Compute the actual value **manually**, and check against your `s`, `z`, `v`, and `n` values
  * This might give you some clues about which **datapath** caused the error. 


## Task 2: Compare Unit
Design a 32-bit compare unit that generates one of two constants (`0` or `1`) depending on the `ALUFN` control signals (used to select the comparison to be performed) and the `Z`, `V`, and `N` outputs of the adder/subtractor unit.  

Clearly the high order 31 bits of the output are **always zero** (use that connection to connect `0` in JSim to zero `cmp[31:1]`).  The least significant bit of the output is determined by the answer to the **comparison** being performed.

<img src="/50002/assets/contentimage/lab3/7.png"  class=" center_fourty"/>

Recall that we **control** the adder/subtractor unit using `ALUFN0` so we cannot use `ALUFN0` to control this compare unit too. Therefore, `ALUFN[2:1]` are used to **control** the **compare unit**.

#### Performance
The `Z`, `V` and `N` inputs to this circuit can only be calculated by the adder/subtractor unit **after** the 32-bit add is **complete**.  This means they arrive quite late (takes **tpd** of adder to compute valid `ZVN` signals) and then require further processing in this module, which in turn makes valid `cmp0` shows up after **tpd** of **both** adder and compare units.  

You can speed things up considerably by thinking about the *relative* timing of `Z`, `V` and `N` and then designing your logic to minimize delay paths involving late-arriving signals. For instance, if you need to perform computations involving `Z` and other variables, you can compute those intermediary output involving the other variables first while "waiting" for `Z`. 

#### Detailed Compare Unit Schematic
Here’s the detailed schematic of the compare unit:

<img src="/50002/assets/contentimage/lab3/8.png"  class="center_thirty"/>

#### Test
{: .highlight}
**Write** your answer in the space provided inside `lab3_alu_submit.jsim`. We have created a test jig to test your compare unit: `lab3_testcompare.jsim`. Remember to comment the rest of the test jigs, and only use the compare test jig to test this unit.

```cpp
.include "nominal.jsim"
.include "stdcell.jsim"
.include "lab3_mult.jsim"
* .include "lab3_testadder.jsim"
.include "lab3_testcompare.jsim"
* .include "lab3_testboolean.jsim"
* .include "lab3_testshifter.jsim"
* .include "lab3_testmultiply.jsim"
* .include "lab3checkoff.jsim"


**********************************
**** Compare32 circuit ***********
.subckt compare32 ALUFN[2:1] z v n cmp[31:0]
* BEGIN ANSWER


* END ANSWER
.ends
**********************************
```

## Task 3: Boolean Unit

Design a **32-bit Boolean unit** for the Beta’s logic operations.  One implementation of a 32-bit boolean unit uses a **32 copies of a 4-to-1 multiplexer** where `ALUFN0`, `ALUFN1`, `ALUFN2`, and `ALUFN3` **hardcode** the operation to be performed, and `Ai` and `Bi` are hooked to the multiplexer **`SELECT`** inputs.  This implementation can produce any of the 16 2-input Boolean functions; but we will only be using 4 of the possibilities: `AND`, `OR`, `XOR`, and `A`. 

Here's the general schematic of the Boolean Unit:

<img src="/50002/assets/contentimage/lab3/9.png"  class=" center_fourty"/>

{: .important}
Pay close attention to the ORDER of the multiplexer **control** signals and its corresponding **output**. See [stdcell documentation](https://drive.google.com/file/d/1ArkRewfiBqJGmVqzkiGzFxbS0fZ-2eWw/view?usp=sharing) on the 4-to-1 mux if you’re unsure how these are obtained. 

The following table shows the encodings for the `ALUFN[3:0]` control signals used by the test jig.  If you choose a different implementation you should also include logic to **convert** the supplied control signals into signals appropriate for your design.

<img src="/50002/assets/contentimage/lab3/10.png"  class=" center_twenty"/>

#### Detailed Boolean Unit Schematic

Here’s the detailed schematic of the Boolean unit:

<img src="/50002/assets/contentimage/lab3/11.png"  class=" center_seventy"/>

In total, you should utilise 32 4-to-1 multiplexers to build the boolean unit. **Please use [JSim iterator](https://natalieagus.github.io/50002/lab/lab3#jsim-iterators) explained in the appendix for this!**

{: .highlight}
**Write** your answer in the space provided inside `lab3_alu_submit.jsim`. We’ve created a test jig to test your boolean unit: `lab3_testboolean.jsim`. Use it to test that your boolean unit works properly. 

```cpp
.include "nominal.jsim"
.include "stdcell.jsim"
.include "lab3_mult.jsim"
* .include "lab3_testadder.jsim"
* .include "lab3_testcompare.jsim"
.include "lab3_testboolean.jsim"
* .include "lab3_testshifter.jsim"
* .include "lab3_testmultiply.jsim"
* .include "lab3checkoff.jsim"


**********************************
**** Boolean32 circuit ***********
.subckt boole32 ALUFN[3:0] A[31:0] B[31:0] boole[31:0]
* BEGIN ANSWER


* END ANSWER
.ends
**********************************
```

## Task 4: Shifter
Design a **32-bit shifter** that implements `SRA`, `SHR` and `SHL` instructions.  
* The `A[31:0]` input supplies the data to be shifted  
* The **low-order** 5 bits of the `B[4:0]`  are used as the **shift count** (i.e., from 0 to 31 bits of shift)
* We do not use the high 27 bits of the `B` input (meaning that `B[31:5]` is **ignored** in this unit)

For example, if `A: 0x0000 00F0` and we would like to **shift** A to the left by FOUR bits, the `B` input should be `0x0000 0004` 

The desired operation will be encoded on `ALUFN[1:0]` as follows:

<img src="/50002/assets/contentimage/lab3/12.png"  class="center_fourty"/>

With this encoding, the **control** signal `ALUFN0` is `0` for a **left shift** (SHL) and `1` for a **right shift** (SHR) and `ALUFN1` controls the **sign extension** logic on **right shift**.   
* For `SHL` and `SHR`, 0’s are shifted into the vacated bit positions.  
* For `SRA` (“shift right arithmetic”), the vacated bit positions are all filled with A31, the sign bit of the original data so that the result will be the same as dividing the original data by the appropriate power of 2.

Here’s the condensed schematic of the left shifter.  In total, you should use **32x5 = 160** 2-to-1 multiplexers. 

<img src="/50002/assets/contentimage/lab3/13.png"  class="center_seventy"/>

#### Detailed Shifter Unit Schematic
The simplest implementation is to build THREE shifters: one for shifting **left**, one for shifting **right**, and one for shifting **right arithmetic**. Then, we  use a 4-way 32-bit multiplexer to select the appropriate answer as the unit’s output.  

It’s easy to build a shifter after noticing that a **multi-bit shift** can be **accomplished** by **cascading** shifts by various powers of 2.  
* For example, a 13-bit shift can be implemented by a shift of 8, followed by a shift of 4, followed by a shift of 1. 
* So the shifter is just a cascade of multiplexers each controlled by one bit of the shift count.  

Here’s the detailed schematic of the **left shifter**. There are really a lot of muxes. Please use the JSim **ITERATOR** for this!

<img src="/50002/assets/contentimage/lab3/14.png"  class="center_seventy"/>

Here’s the detailed schematic of the **right shifter**. 

<img src="/50002/assets/contentimage/lab3/15.png"  class=" center_seventy"/>

Here’s the detailed schematic of the **right arithmetic shifter**. 

<img src="/50002/assets/contentimage/lab3/16.png"  class=" center_seventy"/>

Finally, we can combine all three shifters together to form the total shifter output:

<img src="/50002/assets/contentimage/lab3/17.png"  class="center_seventy"/>

{: .new-title}
> Alternative Approach
> 
> Another approach that **adds** latency but **saves** gates is to use the *left shift logic* for **both** left and right shifts, but for right shifts, **reverse** the bits of the `A` input first on the way in and **reverse** the bits of the output on the way out.


{: .highlight}
**Write** your answer in the space provided inside `lab3_alu_submit.jsim`. We have created a test jig to test your shift unit: `lab3_testshifter.jsim`. Use it to test that your shifter unit works properly. 

```cpp
.include "nominal.jsim"
.include "stdcell.jsim"
.include "lab3_mult.jsim"
* .include "lab3_testadder.jsim"
* .include "lab3_testcompare.jsim"
* .include "lab3_testboolean.jsim"
 .include "lab3_testshifter.jsim"
* .include "lab3_testmultiply.jsim"
* .include "lab3checkoff.jsim"

**********************************
**** Shifter32 circuit ***********
.subckt shift32 ALUFN[1:0] A[31:0] B[4:0] shift[31:0]
* BEGIN ANSWER


* END ANSWER
.ends
**********************************
```

## Summary 
