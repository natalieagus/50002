---
layout: default
permalink: /problemset/instructionset
title: Designing an Instruction Set
description: Practice questions containing topics from ISA
parent: Problem Set
nav_order: 5
---


* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design

# Designing an Instruction Set
{: .no_toc}

Each topic's questions are grouped into **three** categories: basic, intermediate, and challenging. You are recommended to do all basic problem set before advancing further. 

{: .note}
The amount of practice problems in this set is smaller than usual because the topics learned this week is mainly to **set up** the knowledge required for the following week. Please head to the next problem set for more practice problem.

## CPU Trivia (Basic)

1. How much memory can a 32-bit von Neumann machine have, assuming it has 32-bit address bus? **Explain** your answer.

	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	`2^32` bytes because each address is also 32 bits long in a 32-bit von Neumann machine.
	</p></div><br>

2. Can a CPU have as many registers as possible, in theory?


	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	<span style="color:red; font-weight: bold;">No</span>. Addresses for each register involved in the instruction must be encoded within the instruction, i.e: `5` bits for 32 registers. An instruction is **32 bits** long for Beta architecture, so having too many registers will make encoding infeasible.
	</p></div><br>

3. In Theory, which machine is least powerful but sufficient to compute each of the following functions? Choose for the four following possible choices ranked by its level of *powerfullness*:  
	* Turing Machine (most powerful)
	* FSM
	* Combinational Logic (least powerful)
	* Uncomputable	
	
	<br>
	The functions in question are:
	* **Function 1:** A processor that executes Beta instruction set
	* **Function 2:** A device which takes as input the digits of a binary integer from left to right, and output 1 if the number entered so far is divisible by 6, and 0 otherwise. 
	* **Function 3:** A device that takes a sequence of binary digits, one each milisecond clock period, and output `1` if the sequence so far contains more `1`s than `0`s. 
	* **Function 4:** A device that takes as input an integer `n` between 0 and 20, and outputs the closing price of Apple Stock on the `n`$$^{th}$$ trading day of year 2019 (to the nearest whole dollar)

	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	<strong>Function 1:</strong> FSM
	<br>
	<strong>Function 2:</strong> FSM
	<br>
	<strong>Function 3:</strong>  Turing Machine
	<br>
	<strong>Function 4:</strong> Combinational Logic
	</p></div><br>


## Memory Addressing (Basic)


1. How many bits of addresses are required at minimum to address the following chunk of data, assuming that they are **byte** addressable? 

```cpp
0000 0100 0000 0011 0000 0010 0000 0001
1111 1111 0000 0000 1111 1111 0000 0000
1010 1010 0011 1100 0101 0011 0011 0000 
0000 0011 0010 1100 0101 1100 1100 0001
0000 0000 0000 0000 0000 1100 1100 0001
```
	

<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer"><p>

There are 20 bytes in the data above. We need at least: $$\lceil\log_2(20)\rceil$$This results to at least <strong>5 bits for addressing.</strong>
</p></div>
