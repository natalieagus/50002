---
layout: default
permalink: /lab/supp-asm
title: Assembly Language
description: Lab handout covering topics from Stack and Procedure
grand_parent: Labs
parent: Supplementary
nav_order: 12
---

* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design
<br>

# Beta Assembly 
{: .no_toc}

{:.note}
This is a self-guided, supplementary lab, intended for revision. The lab is ungraded and you can check out the corresponding questionnaire on eDimension.

## Starter Code

Clone the starter code from here:

```
git clone https://github.com/natalieagus/lab-beta-assembly-starter
```

Then open `bsim.jar`. This is a Beta CPU simulator. Open the file `workspace.uasm` and work the answer for this lab there. 

## Related Materials
The lecture notes on [Stack and Procedures](https://natalieagus.github.io/50002/notes/stackandprocedures) is closely related for this lab. Related sections include:
- Background on [procedure linkage and stack](https://natalieagus.github.io/50002/notes/stackandprocedures#procedure-linkage-and-stack): 
  - Managing resources for each procedure
  - The Stack implementation (BP, SP convention)
  - Handling arguments and return value in a procedure (function)
- [Implementation of Procedure Linkage Contract](https://natalieagus.github.io/50002/notes/stackandprocedures#implementing-procedure-linkage-contract-using-stack):
  - Converting C code into Beta assembly with procedure contract
  - In particular, to implement callee entry sequence and exit sequence

By the end of this lab, you should have a deeper understanding in how compilers work in transforming **functions** in high-level languages into **procedures** in assembly, and linking them together during runtime. 

## Introduction
In this lab you will have the opportunity to write your first Beta assembly language program. Your task is to write a scoring subroutine for the game of **“Moo”**, a numeric version of [Mastermind®](https://en.wikipedia.org/wiki/Mastermind_(board_game)). 

In **Moo**, you will try to guess the secret 4-digit number. 
* Each guess is **scored** with a count of **“bulls”** and **“cows”**. 
* Each **“bull”** means that one of the digits in the guess matches both the **value** and **position** of a digit in the secret number. 
* Each **“cow”** is a correctly guessed digit but its position in the guess *doesn’t match* the position in the secret. 
* Once a **digit** in the secret has been used to score a digit in the guess (e.g: counted as *bull*) it won’t be used in the scoring for other digits in the guess (e.g: wont be double counted as *cow*). 
* The **count** of bulls should be determined **BEFORE** scoring any **cows**.  

Here are two examples:

```cpp
Secret word: 1234	
Guess: 1379		Bulls=1, Cows=1
Guess: 4321		Bulls=0, Cows=4
Guess: 1344		Bulls=2, Cows=1
Guess: 1234		Bulls=4, Cows=0 

Secret word: 2270
Guess: 2208     Bulls=2, Cows=1
Guess: 0227     Bulls=1, Cows=3
Guess: 0000     Bulls=1, Cows=0
Guess: 2207     Bulls=2, Cows=2
```

In addition to this handout, there are some other useful documents that will help you:
* [BSim documentation](https://drive.google.com/file/d/1Tq_Hg-jbZVPKDJZ4O6OZWYF4_8ywakbi/view?usp=sharing). Describes how to use BSim, our Beta simulator with built-in assembler.  Includes a brief introduction to the syntax and structure of Beta assembly language programs.
* [Beta Documentation](https://drive.google.com/file/d/1L4TXMEDgD5gTN2JSd4ea_APpwNKUpzqK/view?usp=sharing): A detailed description of each instruction in the Beta instruction set.  Also documents our convention for subroutine entry and exit sequences.
* [Beta ISA Summary of Instruction Formats](https://drive.google.com/file/d/1v-eaGuxa1W5HPPNi_shvdS1g5z99if3_/view?usp=sharing): A one-page quick reference for Beta instructions.

## Making Moo

The expected subroutine (function) should take **two** arguments: 
1. A **secret** word: `a`  (32 bits)
2. A **test** word: `b` (32 bits)
 

The secret and test words contain four **4-bit digits** packed into the **LOW** order 16 bits of the word.  

For example, if secret word was `1234`, it would be encoded as `a = 0x00001234` where “0x” indicates hexadecimal (base 16) notation.  If the guess word was 1344, it will be encoded as `b = 0x00001344`. Even though 4 bits are used to encode each digit (`0` to `F`), the words will only contain the digits `0` through `9` per digit. 

It should **return** an **integer** encoding the number of bulls and cows as (16*bulls) + cows. 
- For instance if `a = 0x00001234` and `b = 0x00001344`, 
- This results in 2 **bulls** and 1 **cow**
- Hence, the return value is `0x00000021` 
- The last four bits represents the value of **cows**, and bit 4 to 8 represents the value of **bulls**. 

### An Approach in C
You are welcome to compute the score however you would like. In case you would like a head start, here is one approach, written in C:

```cpp
// Test two MOO words, report Bulls & Cows...
// Each word contains four 4-bit digits, packed into low order.
// Each digit ranges from 0 to 9.
// Returns a word whose two low-order 4-bit digits are Bulls & Cows.

int count_bull_cows(int a, int b) {
  int bulls;                  // number of bulls
  int cows;                   // number of cows
  int i, j, btemp, atry, btry, mask; //temp vars

  // Compute Bulls: check each of the four 4-bit digits in turn
  bulls = 0;
  mask = 0xF;                 // mask chooses which 4-bit digit we check
  for (i = 0; i < 4; i = i + 1) {
    // if the 4-bit digits match, we have a bull
    if ((a & mask) == (b & mask)) {
      bulls = bulls + 1;
      // turn matching 4-bit digits to 0xF so we don't
      // count them again when computing number of cows
      a = a | mask;
      b = b | mask;
    }
    // shift mask to check next 4-bit digit
    mask = mask << 4;
  }

  // Compute Cows: check each non-0xF digit of A against all the
  // non-0xF digits of B to see if we have a match
  cows = 0;
  for (i = 0; i < 4; i = i + 1) {
    atry = a & 0xF;	     // this is the next digit from A 
    a = a >> 4;		     // next time around check the next digit
    if (atry != 0xF) {	     // if this digit wasn’t a bull
      // check the A digit against each of the four B digits
      btemp = b;		     // make a copy of the B digits
      mask = 0xF;            // mask chooses which 4-bit digit we check
      for (j = 0; j < 4; j = j + 1) {
        btry = btemp & 0xF;  // this is the next digit from B
        btemp = btemp >> 4;  // next time around check the next digit
        if (btry == atry) {  // if the digits match, we've found a cow
	    cows = cows + 1;
	    b = b | mask;	     // remember that we matched this B digit	
	    break;		     // move on to next A digit
        }
        mask = mask << 4;
      }
    }
  }

  // encode result and return to caller
  return (bulls << 4) + cows;
}
```

## Testing Moo
The test jig uses our **usual** convention for subroutine calls: 
* The two arguments are pushed on the stack in **REVERSE** order (i.e., the first argument is the last one pushed on the stack) and,
* Control is **transferred** to the **beginning** of the Moo subroutine, leaving the **return** address in register `LP`. 
* The result (bulls and cows values) should be returned in `R0`.

Your code should use the following template. It is already given in `workspace.uasm`. Be sure to **include** the **last TWO lines** since they **allocate** space for the stack used by the test jig when calling your program:

```nasm
.include beta.uasm
.include asm-lab-checkoff.uasm

count_bull_cows: | your subroutine must have this name
	| standard subroutine entry sequence
	PUSH(LP)	
	PUSH(BP)	
	MOVE(SP,BP)	
	| PUSH all used registers
	PUSH(R1)		| bulls
	PUSH(R2)		| cows
	PUSH(R3)		| i
	PUSH(R4)		| j
	PUSH(R5)		| btemp
	PUSH(R6)		| atry
	PUSH(R7)		| btry
	PUSH(R8)		| mask
	PUSH(R9)		| temp reg
	PUSH(R10)		| temp reg
	PUSH(R11)		| a
	PUSH(R12)		| b
	LD(BP,-12,R11)		| load the arg value of constant a to R11
	LD(BP,-16,R12)		| load the arg value of constant b to R12
	CMOVE(0,R1)		| set initial val of var bulls = 0
	CMOVE(0xF,R8)		| set initial val of var mask = 0xF
	CMOVE(0,R3)		| set initial val of var i = 0
  	CMOVE(0,R4)   | set initial val of var j = 0
	
	|||||||||||||||||||||||||||||||||||||||||||||||
	|||| … your code here, leave score (return value) in R0 …
	|||||||||||||||||||||||||||||||||||||||||||||||

	| … POP saved registers above in reverse order…
	MOVE(BP,SP)
	POP(BP)
	POP(LP)
	RTN()


StackBase: 
	LONG(.+4)		| Pointer to the bottom of stack
	.=.+0x1000		| Reserve space for stack
```

{: .note}
You are recommended to use the registers above for each variables. 

Using BSim, assemble your subroutine using the assemble tool. 

<img src="/50002/assets/contentimage/lab5/1.png"  class=" center_seventy"/>

If the assembly completes without errors, BSim will bring up the display window and you can execute the test jig (which will call your subroutine) using the **run**  or **single-step**  tools:

<img src="/50002/assets/contentimage/lab5/2.png"  class=" center_seventy"/>

The test jig will try 32 different test values and type out any error messages on the tty console at the bottom of the display window.  Successful execution will result in the following printout at the BSim console:

<img src="/50002/assets/contentimage/lab5/3.png"  class=" center_seventy"/>

<span style="color:red; font-weight: bold;">DO NOT</span> press the green tick. The **success** checkoff message is sufficient to know that your program works <span class="orange-bold">correctly</span>. If there exist an error, such message will be printed out:

<img src="/50002/assets/contentimage/lab5/4.png"  class=" center_seventy"/>

The error message will give you a clue about your bug. The example above shows that the output should be `4` bulls and `0` cows, but your code computes `0` bulls instead. You can trace your code by adding `.breakpoint` along your computation of bulls so that the execution will pause at that line. For instance, adding such `.breakpoint` will pause the beta execution there.  You can then **inspect** each register content and stack content slowly by running each instructions thereafter **step by step**:

```cpp
	SHLC(R1,4,R1)		|bulls = bulls << 4
	.breakpoint
	ADD(R1,R2,R0)		|bulls + cow = R0
```

<img src="/50002/assets/contentimage/lab5/5.png"  class=" center_seventy"/>

## Implementation and Debug Notes

### `.breakpoint`
If you want to examine the execution state of the Beta at a particular point in your program, insert the assembly directive `.breakpoint` at the point where you want the simulation to **halt**.   You can **restart** your program by clicking the **run** button, or you can click **single-step button** to step through your program **instruction-by-instruction**.  

You can insert as many `.breakpoints` in your program as you would like. This works the same way as breakpoints in [regular debuggers](https://code.visualstudio.com/docs/python/debugging).

### Usage of Registers
If your subroutine uses registers other than `R0`, remember that they have to be **restored** to their **ORIGINAL** values **before** returning to the caller. The usual technique is to `PUSH` their value onto the stack right after the instructions of the entry sequence and `POP` those values back into the registers in the **REVERSE** order just before starting the exit sequence.

Allocate a register to hold **each** of the variables in the C code. 
* For example, load `a` into `R1`, `b` into `R2`, 
* Assign current `bulls` count to `R3`, etc
* Reserve `R15` to `R20` for temporary variables like `i` and `j` to track loops. 

You will eliminate a lot of LDs and STs by keeping your variables in **registers** instead of in memory locations on the stack. There are more than enough registers to hold all variables in Moo. 

### Loading arguments `a` and `b`
Assuming you have used the subroutine entry sequence shown above, the **FIRST** argument can be loaded into a register using the instruction `LD(BP,-12,Rx)`. Similarly the **SECOND** argument can be loaded using `LD(BP,-16,Ry)`, where `Rx` and `Ry` are two arbitrary registers that you can choose to hold the initial `a` and `b` values. 


### Beta Macros
The instruction macro `CMOVE(constant,Rx)` is useful for **loading** small numeric constants into a register.  For example, assuming that the variable `mask` has been assigned to `R11`, the C statement `mask = 0xF` can be implemented in a single instruction:` CMOVE(0xF,R11)`.

### If Statements
The `CMP` instructions and `BEQ/BNE` are useful for compiling C “if” statements.  For example, assuming `atry` has been assigned to `R7`, the C fragment:

```cpp
if (atry != 0xF) { 
    ... statements ...
    }
```

It can be compiled into the following instruction sequence:

```nasm
      CMPEQC(R7,0xF,R0)     | R0 is 1 if atry==0xF, 0 otherwise
      BNE(R0,endifatry)             | so branch if R0 is not zero
      … statements if the condition is true…

endifatry:                                 | need a unique label for each if
      … statements if the condition is false (outside if-clause)
```

### For-loops
Here is the template for compiling the a `for` statement.  Given the C fragment, 

```cpp
for (inits; tests; afters) { 
    // body
    ... statements ...
    }
```

Note that the body of the loop is **executed** as long as the `tests` are `true`. The above can be compiled into the following instruction sequence:

```nasm
      … code for inits …
      BR(endfor32) | go to the test 
for32:
      … code for for-loop statement body …
      … code for afters …
endfor32:
      … code for tests, Rx is 1 if tests are true 
      …
      BNE(Rx,for32) | if tests are true, execute the loop body
```

### C Operators
Here's a brief summary of C operators:

```cpp
=	assignment
==	equality test (use CMPEQ, CMPEQC)
!=	inequality test (use CMPEQ, CMPEQC, reverse sense of branch)
<	less than (use CMPLT, CMPLTC)
<<	left shift (use SHL)
>>	right shift (use SRA)
&	bit-wise logical and (use AND, ANDC)
|	bit-wise logical or (use OR, ORC)
+	addition (doh!, use ADD, ADDC)
```

## Summary
The purpose of this lab is to recap on hand-compiling C to Beta Assembly and applying knowledge from the lecture: Stack and Procedure. Your implemented function can be called many times by the test jig with different arguments because you have followed the procedure for function calls closely using the stack. 

From this lab, you hand-compile the following type of instructions:
- Branches: for-loops and if-else using BNE/BEQ, or its macro: BF or BT
- Nested loops: double for-loops during cow computation
- Loop break: exiting the innermost loop 
- Local variable declaration
- Basic arithmetic and masking 

You also utilise the stack to preserver the caller's state (register values), and utilize the following special registers:
- BP: base pointer, to access function arguments
- SP: stack pointer, points to the next available location of the stack (top of the stack)
- LP: linkage pointer, stores return address to the caller to resume execution once callee exists

You do not need to use the stack to store local variables because there are more than enough Registers available to perform the necessary computations. However, note that the BP can also be used to keep track of local variables (besides function arguments). 

Inspect how the test jig is implemented once you have completed the lab. It might help you understand further on why it is important to follow the procedures closely to make function calls reusable. 