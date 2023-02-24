---
layout: default
permalink: /problemset/betacpu
title: Beta CPU Datapath
description: Practice questions containing topics from Beta CPU Datapath
parent: Problem Set
nav_order: 6
---


* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design

# Beta CPU Datapath
{: .no_toc}


Each topic's questions are grouped into **three** categories: basic, intermediate, and challenging. You are recommended to do all basic problem set before advancing further. 

{: .important}
Before you proceed, we suggest you explore the `bsim` and [**read** the beta documentation](https://drive.google.com/file/d/1L4TXMEDgD5gTN2JSd4ea_APpwNKUpzqK/view?usp=share_link) given in the course handout, especially this section called **Convenience Macros** that makes it easier to express certain common operations.

<img src="{{ site.baseurl }}//assets/images/i_betacpu/2023-02-24-08-18-12.png"  class="center_seventy"/>

## $$\beta$$ Trivia (Basic)
1.  In an unpipelined Beta implementation, when is the signal `RA2SEL` set to `1`?

	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	The <code>RA2SEL</code>  signal is set to <code>1</code> when executing a <code>ST</code> instruction. When <code>RA2SEL</code> is <code>1</code> the 5-bit <code>Rc</code> field of the instruction is sent to the <code>RA2</code> port of the register file, causing <code>Reg[Rc]</code> to be sent to the <strong>write data port of main memory.</strong>
	</p></div><br>

2. In an unpipelined Beta implementation, when executing a `BR(foo,LP)` instruction to call procedure `foo`, what should `WDSEL` should be set to?

	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	<code>BR(foo,LP)</code> is a **macro** for <code>BEQ(R31,foo,LP)</code>. All <code>BNE/BEQ</code> instructions save the address of the following instruction in the specified destination register (<code>LP</code> in the example instruction). So <code>WDSEL</code> should be set <code>0</code>, selecting the output of the <code>PC+4</code> logic as the data to be <strong>written into the register file.</strong>
	</p></div><br>

3. The **minimum clock period** of the unpipelined Beta implementation is determined by the *propagation* *delays* of the datapath elements and the amount of time it takes for the **control signals to become valid**. Which of the following select signals should become valid first in order to ensure the smallest possible clock period: `PCSEL, RA2SEL, ASEL, BSEL, WDSEL, WASEL`?
	
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	To ensure the <strong>smallest</strong> possible clock period <code>RA2SEL</code> should become valid first. The <code>RA2SEL</code> mux must produce a <strong>stable register address</strong> before the register file can do its thing. All other control signals affect logic that operates <strong>after</strong> the required register values have been accessed, so they don't have to be valid until <i>later</i> in the cycle.
	</p></div><br>


## $$\beta$$ Assembly Language (Basic)

  

What does the following piece of Beta assembly do? Hand assemble the beta **assembly language** into **machine language**. 
  
```cpp
I = 0x5678
B = 0x1234

LD(I,R0) -- (1)
SHLC(R0,2,R0) --  (2)
LD(R0,B,R1) -- (3)
MULC(R1,17,R1) -- (4)
ST(R1,B,R0)  -- (5)
```
Finally, what is the result stored in `R0`?



<div cursor="pointer" class="collapsible">Show Answer</div>
<div class="content_answer"><p>
The machine language is:

<div class="class=language-cpp highlighter-rouge">
<div class="highlight">
<pre class="highlight"><code>I = 0x5678
B = 0x1234
0x601F5678 || LD(R31,I,R0) -> 011000 00000 11111 0101 0110 0111 1000 
0xF0000002 || SHLC(R0,2,R0) -> 111100 00000 00000 0000 0000 0000 0010 
0x60201234 ||LD(R0,B,R1) -> 011000 00001 00000 0001 0010 0011 0100
0xC8210011 ||MULC(R1,17,R1) -> 110010 00001 00001 0000 0000 0001 0001
0x64201234||ST(R1,B,R0) -> 011001 00001 00000 0001 0010 0011 0100
</code></pre></div>
</div>

Explanation:
<ul>
<li>  <strong>Line 1:</strong> move the content of the memory unit at <code>EA=I</code> to register <code>R0</code></li>
<li>  <strong>Line 2:</strong> the content of <code>R0</code> is multiplied by 4 and stored back at register <code>R0</code></li>
<li>  <strong>Line 3:</strong> move the content of memory address <code>EA</code>: <code>EA</code>= <code>B</code> + content of register  <code>R0</code>; to register <code>R1</code>.</li>
<li>  <strong>Line 4:</strong> The content of register <code>R1</code> is multiplied by 17 and stored back at register <code>R1</code>.</li>
<li>  <strong>Line 5:</strong> Store / copy the content of register R1 to the memory unit with address <code>EA</code>: <code>EA</code>= <code>B</code> + content of register <code>R0</code>.</li>
</ul>
The result of <code>R0</code> is the content of memory address `I`: <code>Mem[I]</code> multiplied by 4.
</p></div><br>

## Non $$\beta$$ Architecture Benchmarking (Basic)

A local junk yard offers older CPUs with non-Beta architecture that require **several clocks** to execute each instruction. Here are the specifications:

$$\begin{matrix}
\text{Model} & \text{Clock Rate} &  \text{Avg. clocks per Instruction}\\
\hline
x & 40 Mhz & 2.0\\
y & 100 Mhz & 10.0\\
z & 60 Mhz & 3.0\\
\end{matrix}$$

You are going to choose the machine which will execute your benchmark program the fastest, so you compiled and ran the benchmark on the three machines and counted the total instructions executed:

1.  `x`: `3,600,000` instructions executed

1.  `y`: `1,900,000` instructions executed

1. `z`: `4,200,000` instructions executed
  

Based on the above data, **which machine would you choose?**

<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
First we find out the time taken to execute those instructions:

$$x: \frac{3.6M}{40M / 2} = 0.18s$$  
$$y: \frac{1.9M} {100M / 10} = 0.19s$$  
$$z: \frac{4.2M}{60M / 3} = 0.21s$$   

From the result above, `x` is the fastest machine. Hence we choose `x`.
</p></div><br>
  
## Clumsy Lab Assistant (Basic)
Notta Kalew, a somewhat fumble-fingered lab assistant, has deleted the opcode field from the following table describing the control logic of an unpipelined Beta processor.

<img src="https://dropbox.com/s/hr0j3m2pmgbhvot/Q1.png?raw=1" class="center_fifty" >

  

1.  Help Notta out by identifying which Beta instruction is implemented by each row of the table.

	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	From first row to the last: <code>SUBC, BEQ, LDR, CMPEQ, ST</code>.
	</p></div><br>

2. Notta notices that `WASEL` is always zero in this table. Explain briefly under what circumstances `WASEL` would be non-zero.

	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	<code>WASEL</code> is <code>1</code> if an <strong><i>interrupt, an illegal opcode is trapped, or a fault occurs</i></strong>. When <code>WASEL</code> is <code>1</code>, it selects <code>XP</code> as the write address for the register file; <code>Reg[XP]</code> is where we store the current <code>PC+4</code>whenever there is an interrupt, a fault, or an illegal opcode.
	</p></div><br>

3. Notta has noticed the following C code fragment appears frequently in the benchmarks:
	
```cpp
int *_p; /* Pointer to integer array */
int i,j; /* integer variables */

...

j = p[i]; /* access ith element of array */
```

The pointer variable `p` contains the *address* of a **dynamically allocated** array of integers. The value of `p[i]` is stored at the address `Mem[p +4i]` where `p` and `i` are locations containing the values of the corresponding C variables. On a conventional Beta this code fragment is translated to the following instruction sequence:

```cpp
LD(...,R1)     /* R1 contains p, the array base address */
LD(...,R2)     /* R2 contains I, the array index */    
...
SHLC(R2,2,R0)  /* compute byte-addressed offset = 4*i */
ADD(R1,R0,R0)  /* address of indexed element */
LD(R0,0,R3)    /* fetch p[i] into R3 */
```

Notta proposes the addition of an `LDX` instruction that shortens the last three instructions to:

```cpp
SHLC(R2,2,R0)  /* compute byte-addressed offset = 4*i */
LDX(R0,R1,R3)  /* fetch p[i] into R3 */
```
	
Give a **register-transfer language** description for the `LDX` instruction. 

<div cursor="pointer" class="collapsible">Show Answer</div>
<div class="content_answer">
<p>

<div class="class=language-cpp highlighter-rouge">
<div class="highlight">
<pre class="highlight"><code>LDX( Ra, Rb, Rc ):
	EA <- Reg[Ra] + Reg[Rb]
	Reg[Rc] <- Mem[EA]
	PC <- PC + 4</code></pre></div>
</div>
</p></div><br>

Using a table like the one above specify the control signals for the `LDX` opcode.

<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
$$\begin{matrix}
PCSEL & RA2SEL & ASEL & BSEL& WDSEL & ALUFN & WR & WERF & WASEL \\
\hline
0 & 0 & 0 & 0 & 2 & ADD & 0 & 1 & 0 \end{matrix}$$
</p></div><br>

It occurs to Notta that adding an `STX` instruction would probably be useful too. Using this new instruction, `p[i] = j` might compile into the following instruction sequence:

```cpp
SHLC(R2,2,R0)  /* compute byte-addressed offset = 4*i */
STX(R3,R0,R1)  /* R3 contains j, R1 contains p */
```

Briefly describe what (hardware) **modifications** to the Beta datapath would be necessary to be able to execute `STX` in a **single cycle.**

<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
The register transfer language description of  <code>STX</code> would be:
<div class="class=language-cpp highlighter-rouge">
<div class="highlight">
<pre class="highlight"><code>STX(Rc, Rb, Ra)
EA <- Reg[Ra] + Reg[Rb]
Mem[EA] <- Reg[Rc]
PC <- PC + 4</code></pre></div>
</div>

It's evident that we need to perform <strong>3 register reads,</strong> but the Beta's register file has only <strong>2 read ports.</strong> Thus we need to add a <strong>third read port</strong> to the register file.
<br><br>
Incidentally, adding a third read port would eliminate the need for the <code>RA2SEL</code> mux because we no longer need to choose between <code>Rb</code> and <code>Rc</code>, since each register field has its own read port.
</p></div><br>


## New Beta Instruction (Basic)
1. Write the register transfer language below corresponds to the instruction with the following control signal:
   
	<img src="https://dropbox.com/s/ysf5rtc0d9mwsil/ctrlnew.png?raw=1" class="center_ten">

	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	<div class="class=language-cpp highlighter-rouge">
	<div class="highlight">
	<pre class="highlight">
	<code>Reg[Rc] <-- (PC+4)+4*SXT(C) 
	     PC <-- PC + 4</code></pre></div>
	</div>
	</p></div><br>

2. Explain why the following instruction cannot be added to our Beta instruction set without further hardware modifications on the datapath:
```cpp
PUSH(Rc, 4, Ra):
	Mem[Reg[Ra]] <-- Reg[Rc]
	Reg[Ra] <-- Reg[Ra] + 4
```

<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
To implement this <code>PUSH</code>, somehow the <code>ALU</code> would have to produce <i>two</i> 32-bit values instead of the original one 32-bit output. The new two 32-bit values are: <code>Reg[Ra]</code> to be used as the memory address and <code>Reg[Ra]+4</code> to be written into the register file.
</p></div><br>


## Another New Beta Instruction (Basic)
Given the following C-code:

```cpp
if (a != 0){ 
	b = 3;
}  

// other instructions
....
```

where `a`, `b` are variables that have been initialised in the earlier part of the code (not shown). If we were to implement the following C-code using the Beta instruction set, we must do this in at least **two** cycles:

```cpp
BEQ(Ra, label_continue, R31)  
ADDC(R31, 3, Rb)  
label_continue: (other code)
```

where `Ra`, `Rb` are assumed to be registers **containing** values `a` and `b`.

The `ALU` in this particular  Beta however, implements *five* new functions on top of the standard functions: `“B”, “NOT-A”, “NOT-B”, “TRUE”, “FALSE”`. 

Due to this, your classmate suggested that we can actually do this in **one** cycle by modifying the `Control Unit` to accept  this **new instruction** called `MCNZ` (move constant if not zero) instead:

```cpp
MCNZ(Ra, literal, Rc) : 
	if(Reg[Ra] != 0)
		Reg[Rc] <-- literal 
	PC <-- PC + 4
```

What values should the Control Unit give for this instruction `MCNZ`?


<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
$$\begin{matrix}
	PCSEL & RA2SEL & ASEL & BSEL& WDSEL & ALUFN & WR & WERF & WASEL \\
	\hline
	0 & - & - & 1 & 1 & "B" & 0 & Z?0:1 & 0 \end{matrix}$$
<br>
Note: <code>Z?0:1</code> means <code>0</code> if <code>Z==1</code>, and <code>1</code> otherwise.
</p></div><br>


## Faulty Detection in Beta (Intermediate)

You suspected that your Beta CPU is faulty, in particular, these two components:
* The `ASEL` **mux** might be faulty: 
	* if `ASEL = 0`, the output is always 0. 
	* There's no problem if `ASEL = 1`.  
	
* The part of the `CU` that gives out `RA2SEL` signal might be faulty: 
	* `RA2SEL` is always **stuck at `0`** (it cannot be `1` regardless of the instruction)

Your friend came up with several short test programs. You want to select one of these programs to run in the faulty Beta, but you don't want to waste your time loading and running multiple programs and would like to select one that can **detect both faults**. Which of the following program(s) can detect **both faults?**

{: .note-title}
> Further Notes
> 
> 1.  The values in the `PC` / Registers in Regfile / Memory Unit will be *different* from a working Beta CPU if these programs were to be executed in this faulty Beta. 
> 2.  You can be 100% sure the discrepancy is caused by **both** `RA2SEL` signal or `ASEL` mux faulty.
> 3.  Programs that can only detect the `RA2SEL` signal faulty but not `ASEL` multiplexer faulty (or vice versa) is **not acceptable**. 

You can assume that the initial content of all registers are `0`.

**Program 1**:
```cpp
.=0x000  
LDR(constant, R0) 
LDR(constant + 4, R1) 
ADD(R0, R1, R2)  
ST(R2, constant + 8, R31) 
HALT()  

constant: LONG(8)
LONG(4)
```

**Program 2**:
```cpp
.=0X000  
CMOVE(5, R1) 
LDR(constant, R2) 
ST(R2, answer, R31) 
MUL(R1, R2, R3) 
HALT()  

constant: LONG(0) 
.=0xFFFC  
answer: LONG(0)
```

**Program 3**:
```cpp
.=0x000  
constant: LONG(8)
LONG(4)
LDR(constant, R0) 
ADD(R0, R0, R0) 
ST(R0, .+8, R31) 
HALT()
```

**Program 4**:
```cpp
.=0x000  
ADDC(R31, 5, R0)  
ST(R0, constant + 8, R31) 
LDR(constant, R1)  
ADD(R1, R1, R2)  
HALT()  

.=0xBCC  
constant: LONG(8)
LONG(4)
```

<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
There's only one instruction: <code>ST</code> that requires <code>RA2SEL</code> to be <code>1</code>. Therefore our program must have this instruction to test against a working Beta CPU. We also must ensure that we utilize instructions that results in <code>ASEL=0</code> and that the output of the <code>ASEL</code> mux should be nonzero in a working Beta CPU. We also need to ensure that the programs need to <i>utilize</i> these instructions in a way that results in a different <strong>state</strong> when run on a working Beta CPU.   
<br><br>
<strong>Program 1</strong> and <strong>Program 4</strong> fulfills the criteria, and the other two don't. 
<br><br>
For <strong>Program 1</strong>:
<ul>
<li>The content stored at <code>R2</code> will be 4 instead of 12 if the <code>ASEL</code> mux is faulty. </li>
<li> We will end up storing 8 instead of 12 to <code>Mem[constant + 8]</code> if <code>RA2SEL</code> signal remains <code>0</code> due to the faulty <code>CU</code>. </li>
</ul>
For <strong>Program 4</strong>:
<ul>
<li> The content of <code>R1</code>  is stored to <code>Mem[Constant+8]</code> instead of the content of <code>R0</code>. Therefore, <code>Mem[Constant+8]</code>  is <code>0</code> instead of <code>5</code>.</li>
<li> The content of <code>R2</code> is <code>8</code> instead of <code>16</code>.</li>
</ul>
<strong>Program 2</strong> and <strong>Program 3</strong> also utilizes <code>ST</code> and <code>OP</code> instructions: <code>MUL</code>/<code>ADD</code>, etc that involve the <code>ASEL</code> mux but if you run them with the faulty Beta and with a working Beta, the end state is either the same or different due to one of the faulties only, and therefore can't be used to detect both faulties. 
</p></div><br>

## Beta Instruction Replacements (Intermediate)

For each of the statements below, indicate whether they're True or False and provide your reasoning. 

* **Statement 1:**  In the Beta, every `ADDC` instruction can **always** be replaced by a `SUBC` instruction that puts precisely the **same** value in the destination register. For example, `ADDC(R0,1,R0)` is equal to `SUBC(R0,-1,R0)` (*think about all constants*).  

* **Statement 2:** In a Beta program, you can use `BEQ(R31, label, R31)` as a substitute for `JMP(Ra)` where `Ra` stores the address of `label`, no matter where `label` is. 

* **Statement 3:** We can never perform `LD` and `ST`  to any two independent addresses in a *single cycle* (even if the memory unit supports it) by just modifying the **control unit** of the Beta. In other words, we need to modify the datapath of the Beta in order to do this. 

<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
<strong>Statement 1 is <span style="color:red; font-weight: bold;">False</span></strong>. We can have <code>ADDC(R0, -32768, R0)</code> but we cant have <code>SUBC(R0, 32768, R0)</code> as the most positive number that a signed 16-bit can represent is <code>32768</code>.
<br>
<br>
<strong>Statement 2 is <span style="color:red; font-weight: bold;">False</span></strong>. <code>Ra</code> contains 32-bit of data, so we can set <code>PC</code> to be pointing to <i>any</i> address in the memory (4GB of address space) with <code>JMP(Ra)</code>. However, <code>BEQ</code> only covers <code>32768 times 4</code> (above <code>PC+4</code>) + <code>32768 times 4</code> (*below and inclusive of <code>PC+4</code>*) bytes of address space.
<br>
<br>
<strong>Statement 3 is True</strong>. The output of the <code>ALU</code> supplies a <strong>single</strong> address for both load and store to the memory unit. </p></div><br>

## PCSEL Fault Detection (Intermediate)

This time round, consider a Beta machine with a faulty **control unit**, where its `PCSEL` signal is always `0`, meaning that the input to the `PC` register is always  `PC+4` *regardless* of the instruction.

As always, we can  detect this particular fault by running a simple test program written in Beta assembly language. State which of the following programs can **detect** this particular fault, meaning that if it was to be run on a faulty Beta machine, we will get different results (contents) on the registers in the regfiles, PC, or Memory Unit, and provide your reasoning. 

Assume that all register values were `0` at the beginning of each program execution.

**Program 1**: (executed for two CLK cycles)
```cpp
.= 0  
BEQ(R0, .+4, R31)  
ADDC(R0, 1, R0)  
```

**Program 2**: (executed for three CLK cycles)
```cpp
.=0  
CMPEQ(R0, R0, R0)  
BNE(R0, .-4, R31)  
ADDC(R0, 1, R0)
```

**Program 3**: (executed for four CLK cycles)
```cpp
.=0  
LD(R0, 0, R0)  
MULC(R0, 1, R0)  
BNE(R0, .+4, R31)  
CMPEQ(R0, R31, R2)
```

**Program 4**: (executed for two CLK cycles)
```cpp
.=0
ST(R0, x, R31) 
x: LONG(12)
```

**Program 5**: (executed for two CLK cycles)
```cpp
.=0  
JMP(R1)  
ADDC(R0, 1, R1)
```

**Program 6**: (executed for two CLK cycles)
```cpp
.=0  
LDR(R31, .+8, R0)  
ADDC(R0, 1, R1)  
x : LONG(3)
```



<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
Program 2, 4, and 5 can successfully <strong>detect</strong> this faulty. All of them forces the control unit to produce non-zero <code>PCSEL</code>. For example, <strong>Program 4</strong> results in <code>illop</code> when the Beta attempts to execute <code>LONG(12)</code> because it isn't an instruction. Therefore <code>PCSEL=3</code> if the control unit works properly and that the content of <code>PC</code> will be <code>ILLOP</code> (wherever the address of illegal operation handler is) instead of address <code>0xC</code>. </p></div><br>


## Quality Control (Intermediate)
One Beta manufacturer is having quality-control problems with their design. In particular, they've had reliability issues with various device connections that are circled in the diagram below.

<img src="https://dropbox.com/s/i71imaa2toxsnk7/betafault.png?raw=1" class="center_seventy"  >

Your job is to **write some test programs** to help determine if a machine is fault-free. Assume that when a device connection is <span style="color:red; font-weight: bold;">faulty</span>, the indicated **bus or signal** is always **producing** `0` instead of the *expected value*.

**For each** of the circled connections, **write an instruction sequence** that when executed for a **specified number of cycles** will leave the following result in `R0`: 
*  `1` in `R0` if the connection was working.
* Other values in `R0` if the connection was faulty. 

{: .note}
You can assume that all registers are reliably set to 0 before each sequence is executed. There's many possible answers, they aren't unique.

Give your instruction sequence for each of the six indicated faults and briefly **explain** how each sequence detects the fault and produces something besides `1` in `R0` when the fault is present:
* **Fault A:** Input 1 of `PCSEL` mux has a value of `0` instead of `PC+4+4*SEXT(C)`.
* **Fault B:** `RA2SEL` multiplexer control signal is `0` instead of as per intended current instruction `OPCODE`.
* **Fault C:** `Z` input to control logic is always `0` instead of the correct value depending on `RD1`.
* **Fault D:**   `BSEL` multiplexer control signal `0`  instead of as per intended current instruction `OPCODE`.
* **Fault E:** `WR` memory control signal is `0`  instead of as per intended current instruction `OPCODE`.
* **Fault F:** Input 0 of `WDSEL` mux has a value of `0` instead of `PC+4`.




**Fault A:** Input 1 of `PCSEL` mux has a value of `0` instead of `PC+4+4*SEXT(C)`.
<div cursor="pointer" class="collapsible">Show Answer</div>
<div class="content_answer"><p>
<div class="class=language-cpp highlighter-rouge">
<div class="highlight">
<pre class="highlight">
<code>| starts at address 0
. = 0
BEQ(R0,.+4,R31) | 0x0
ADDC(R0,1,R0) | 0x4
</code>
</pre>
</div>
</div>
Execute for 2 cycles (i.e., execute two instructions):
<ul>
<li> If fault A is not present, <code>R0</code> contains <code>1</code> after the second cycle, since the second instruction is fetched from location <code>0x4</code>. </li>
<li> If fault A is present, the second instruction is fetched from location <code>0</code> (instead of <code>4</code>, since the input <code>1</code> to the <code>PCSEL</code> mux is <code>0</code>), so the value of <code>R0</code> stays <code>0</code>.</li>
</ul>
Note that the label <code>.+4</code> means “memory location of current instruction + 4”, which is <code>0+4</code> here.
</p></div><br>

**Fault B:** `RA2SEL` multiplexer control signal is `0` instead of as per intended current instruction `OPCODE`.

<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
<div class="class=language-cpp highlighter-rouge">
<div class="highlight">
<pre class="highlight"><code>| starts at address 0
. = 0
ADDC(R1,1,R1)
ST(R1,0,R0)
LD(R0,0,R0)
</code></pre></div>
</div>
Execute for 3 cycles:
<ul>
<li> If fault B is not present, the <code>ST</code> instruction writes the value <code>1</code> into location <code>0</code>, which is then <code>LD</code>-ed (loaded) into <code>R0</code>.</li>
<li> If fault B is present, the <code>ST</code> instruction writes the contents of <code>R0</code> instead (ie, the value <code>0</code>), so now the <code>LD</code> instruction puts <code>0</code> into <code>R0</code>.</li> 
</ul></p></div><br>

**Fault C:** `Z` input to control logic is always `0` instead of the correct value depending on `RD1`.
<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
<div class="class=language-cpp highlighter-rouge">
<div class="highlight">
<pre class="highlight"><code>| starts at address 0
. = 0
BEQ(R0,.+8,R31)
ADDC(R0,0,R0)
ADDC(R0,1,R0)
</code></pre></div>
</div>
Execute for 2 cycles:
<ul>
<li> If fault C is not present, <code>R0</code> is incremented to <code>1</code> since the branch to memory location <code>8</code> is taken.</li> 
<li> If fault C is present, the <code>BEQ</code> instruction never branches, executing the instruction at location <code>4</code>, which leaves the contents of <code>R0</code> unchanged (i.e., it's still <code>0</code>).</li>
</ul>
</p></div><br>

**Fault D:** `BSEL` multiplexer control signal `0`  instead of as per intended current instruction `OPCODE`.
<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
<div class="class=language-cpp highlighter-rouge">
<div class="highlight">
<pre class="highlight"><code>| starts at address 0
. = 0
ADDC(R0,1,R0)
</code></pre></div>
</div>
Execute for 1 cycle:
<ul>
<li>If fault D is not present, <code>R0</code> is increment to <code>1</code>. </li>
<li> If fault D is present, the high-order 5-bits of the literal field (i.e., where <code>Rb</code> is encoded) is used as a register address, and the contents of that register is added to <code>R0</code>. Since the literal is <code>1</code>, the second register is <code>R0</code> (containing <code>0</code>), so the value written into <code>R0</code> is <code>0</code>.</li></ul>
</p></div><br>

**Fault E:** `WR` memory control signal is `0`  instead of as per intended current instruction `OPCODE`.
<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
<div class="class=language-cpp highlighter-rouge">
<div class="highlight">
<pre class="highlight"><code>| starts at address 0
. = 0
ADDC(R1,1,R1)
ST(R1,X,R31)
LD(R31,X,R0)
. = 0x100
X: LONG(0)
</code></pre></div>
</div>
Execute for 3 cycles:
<ul>
<li> If fault E is not present, the  instruction writes the value <code>1</code>  into <code>Mem[X]</code>, which is then <code>LD</code>-ed (loaded) into <code>R0</code>. </li>
<li> If fault E is present, the <code>ST</code> instruction has no effect, so now the <code>LD</code> instruction loads the original value of location <code>X</code> into <code>R0</code>.</li>
</ul>
</p></div><br>

**Fault F:** Input `0` of `WDSEL` mux has a value of `0` instead of `PC+4`.
<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
<div class="class=language-cpp highlighter-rouge">
<div class="highlight">
<pre class="highlight"><code>| starts at address 0
. = 0
BEQ(R0,.+4,R1)
SUBC(R1,3,R0)
</code></pre></div>
</div>
Execute for 2 cycles:
<ul>
<li> If fault F is not present, the <code>BEQ</code> instruction loads <code>4</code> into <code>R1</code> and the <code>SUBC</code> loads <code>1</code> into <code>R0</code>.</li>
<li> If fault F is present, the <code>BEQ</code> instruction loads <code>0</code> into <code>R1</code> and the <code>SUBC</code> loads -3 into <code>R0</code>.</li>
</ul>
</p></div><br>


## Memory Encoding (Basic)

1. You are given a **printout** of a 32-bit *word* at memory address `0` that has a binary form of:

```cpp
0000 0100 0000 0011 0000 0010 0000 0001
```

What is the value of the *byte* stored in address `0, 1, 2` and `3`, respectively assuming a little-endian format? What are the hexadecimal forms of the bytes?

<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
1, 2, 3, and 4 are stored at address <code>0, 1, 2, 3</code> respectively.  The hex form is the word: <code>0x04 03 02 01</code>.
</p></div><br>






