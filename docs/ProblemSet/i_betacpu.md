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
Before you proceed, we suggest you explore the Beta simulator [`bsim`](https://github.com/natalieagus/bsim-kit) and [**read** the beta documentation](https://drive.google.com/file/d/1L4TXMEDgD5gTN2JSd4ea_APpwNKUpzqK/view?usp=share_link) given in the course handout, especially this section called **Convenience Macros** that makes it easier to express certain common operations.

<img src="{{ site.baseurl }}//assets/images/i_betacpu/2023-04-24-20-03-11.png"  class="center_fifty"/>

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
	To ensure the <strong>smallest</strong> possible clock period <code>RA2SEL</code> should become valid first. The <code>RA2SEL</code> MUX must produce a <strong>stable register address</strong> before the register file can do its thing. All other control signals affect logic that operates <strong>after</strong> the required register values have been accessed, so they don't have to be valid until <i>later</i> in the cycle.
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
Incidentally, adding a third read port would eliminate the need for the <code>RA2SEL</code> MUX because we no longer need to choose between <code>Rb</code> and <code>Rc</code>, since each register field has its own read port.
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

## Memory Encoding (Basic)

1. You are given a **printout** of a 32-bit *word* at memory address `0` that has a binary form of:

```cpp
0000 0100 0000 0011 0000 0010 0000 0001
```

What is the value of the *byte* stored in address `0, 1, 2` and `3`, respectively assuming a little-endian format? What are the hexadecimal forms of the bytes?

<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
1, 2, 3, and 4 are stored at address <code>0, 1, 2, 3</code> respectively.  The hex form is the word: <code>0x04 03 02 01</code>.
</p></div><br>
