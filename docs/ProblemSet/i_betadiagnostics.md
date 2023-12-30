---
layout: default
permalink: /problemset/betadiagnostics
title: Beta Diagnostics
description: Practice questions containing topics from Beta CPU Diagnostics
parent: Problem Set
nav_order: 7
---


* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design

# Beta CPU Diagnostics
{: .no_toc}


Each topic's questions are grouped into **three** categories: basic, intermediate, and challenging. You are recommended to do all basic problem set before advancing further. 

{: .important}
Before you proceed, we suggest you explore the `bsim` and [**read** the beta documentation](https://drive.google.com/file/d/1L4TXMEDgD5gTN2JSd4ea_APpwNKUpzqK/view?usp=share_link) given in the course handout, especially this section called **Convenience Macros** that makes it easier to express certain common operations.

<img src="{{ site.baseurl }}//assets/images/i_betacpu/2023-04-24-20-03-11.png"  class="center_fifty"/>



## Beta Instruction Replacements (Intermediate)

For each of the statements below, indicate whether they're True or False and provide your reasoning. 

* **Statement 1:**  In the Beta, every `ADDC` instruction can **always** be replaced by a `SUBC` instruction that puts precisely the **same** value in the destination register. For example, `ADDC(R0,1,R0)` is equal to `SUBC(R0,-1,R0)` (*think about all constants*).  
* **Statement 2:** In a Beta program, you can use `BEQ(R31, label, R31)` as a substitute for `JMP(Ra)` where `Ra` stores the address of `label`, no matter where `label` is. 
* **Statement 3:** We can never perform `LD` and `ST`  to any two independent addresses in a *single cycle* (even if the memory unit supports it) by just modifying the **control unit** of the Beta. In other words, we need to modify the datapath of the Beta in order to do this. 

<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
<strong>Statement 1 is <span style="color:red; font-weight: bold;">False</span></strong>. We can have <code>ADDC(R0, -32768, R0)</code> but we cant have <code>SUBC(R0, 32768, R0)</code> as the most positive number that a signed 16-bit can represent is <code>32767</code>.
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









