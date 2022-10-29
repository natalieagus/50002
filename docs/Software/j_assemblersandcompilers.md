---
layout: default
permalink: /notes/assemblersandcompilers
title: Assemblers and Compilers
description: Improving the programmability and usability of the Beta CPU even further
nav_order: 11
parent: Software Related Topics
---

* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design


# Assemblers and Compilers 
{: .no_toc}
[You can find the lecture video here.](https://youtu.be/Hhq3RhZcngQ) You can also **click** on each header to bring you to the section of the video covering the subtopic. 

## [Overview](https://www.youtube.com/watch?v=Hhq3RhZcngQ&t=49s)
The goal of this chapter is to help us understand how to improve the programmability of the $$\beta$$ (or any ISA in general). The $$\beta$$ machine language is encoded into 32-bit instructions each. 

For example, the 32-bit `ADD` instruction is:
`100000 | 00100 | 00010 | 00011 | 00000000000`

The $$\beta$$ understands it as: `Reg[R4] = Reg[R2] + Reg[R3]`

However, most of us would prefer to write: `ADD(R2, R3, R4)`, or even `a = b+c` because we couldn't care less which registers are used as long as the CPU can add two variables together and produce the correct result. 

We need to improve the programmability and usability of our machine by **providing abstraction**.
> i.e: so that we can program (e.g: write code) and/or use the machine in an easier way by removing irrelevant data, hence allowing us to ***concentrate*** on one issue at a time. 

We can do this by writing various **softwares** that allow us to abstract some details so that it is easier to fulfil our tasks. 


## [Software: Abstraction Strategy](https://www.youtube.com/watch?v=Hhq3RhZcngQ&t=449s)

Abstraction is a fundamental concept in software engineering and computer science. It refers to process of removing physical, spatial, or temporal details to allow us to focus our attention on matters of **greater importance.** 

We can engineer various softwares to provide abstraction in a computer system. A central form of abstraction in computing is the language abstraction. 

> Language abstraction: generational development of programming languages from the *machine language* to the *assembly language* and the *high-level language.* Each stage can be used as a stepping stone for the next stage. 
> 
> We can also create new abstraction within  a programming language, such as subroutines, modules, software components, polymorphism, and so on. 

There are several **layers** to software abstraction, summarised below: 
* *Basic Layer*: compilation tool softwares such as   *assemblers*, *interpreters* and *compilers*:
	* **Assemblers and Interpreters**: hides bit-level representations, hex locations, and binary values
	* **Compilers:** hides machine instructions, registers, machine architecture
* *Higher Layers*: interpretive tool softwares such as Operating System and Applications (web browser, video player, text editors, etc):
	* **Operating System:** hides resources (memory, CPU, I/O devices) limitations and details.
	* **Applications:** hides local parameters, network location, security details, etc. 


## [Assembler](https://www.youtube.com/watch?v=Hhq3RhZcngQ&t=749s) 

An assembler is technically a program for writing programs. It also can be called as a *primitive compiler*. It provides:
* A symbolic **language** (assembly language) for representing strings of bits. 
	> In this course, we use `beta.uasm` and this file enables us to represent strings of bits in terms of symbols. 
	
* A program for translating assembly source code to machine code in binary. 
	> In this course, this translator program is built into `bsim`. 

### UASM 

In order to write a code thats runnable in BSIM conveniently, we need:
* A **symbolic language** (UASM) for representing strings of bits
* A Program for translating UASM source code into binary. 

<img src="https://dropbox.com/s/5krjxvccdmeesge/uasmstuff.png?raw=1" class="center_seventy" >

A UASM source file contains, in symbolic text, **values of successive bytes to be loaded into memory.** We can define various things in UASM source file:
* **Basic values**: **Decimals**, **binary** (with `0b` prefix), and **hexadecimal** (with `0x` prefix) -- all will be loaded (from low to high address) as 1 byte each, separated by spaces. 
> For example,`5 6 7 8` will result as  `08 07 06 05` in memory.
> Anything more than 256 (1 byte: $$2^8$$): `256 257 258 259` will be truncated into 1 byte only, and resulted as the following in memory (only remainder left): `03 02 01 00`

* **Symbols**, defined by the `=` sign allows us to "rename"  basic values (like defining variables):

```cpp
x = 0x1000
y = 0x1004

R0 = 0 
R1 = 1
```

* **Special variable** `.` (period): means *next* byte address to be filled:
  
```cpp
. = 0x100
ADDC(R0, 3, R1) | means to load this instruction at address 0x100
```

* **Labels** $$\rightarrow$$ symbols that represent memory addresses. Defined using `:` syntax:
  
```cpp
. = 0x108
ADDC(R31, 3, R1)

| begin_loop is a label the address of SUBC instruction 
begin_loop : SUBC(R1, 3, R1)  
BEQ(R1, begin_loop, R31)
``` 

> `ADDC` is loaded at (byte) address `0x108`. Since `ADDC`'s length is 4 bytes, `SUBC` is loaded at the subsequent address : `0x10C`.

* **Macroinstructions**: parameterized abbreviations, or shorthand. 
	* These two macros, `WORD` and `LONG` allows us to assemble input `x` that is more than 256 into longer streams of bytes
	* There are two ways of storing bytes in memory: the **little endian** format where lowest byte stored at the lowest address and vice versa, and the **big endian** format where the highest byte is stored at the lowest address and vice versa. 
	* The $$\beta$$ CPU follows the **little-endian** format
  
  
```cpp
.macro WORD(x) x%256 (x/256)%256 
.macro LONG(x) WORD(x) WORD(x >> 16)
```


For example, suppose we want to store the word `0xDEADBEEF` to memory address `0x0`. We start by loading `0xEF` to address `0x0`, then `0xBE` to address `0x1`, and so on. This is so tedious to do. Using the **macro**: `LONG(0xDEADBEEF)` has the same effect as storing: `0xEF 0xBE 0xAD 0xDE` to memory in sequence from low to high memory address, resulting in the following: 

| Address      | 0x0 | 0x1 | 0x2 | 0x3 |
| ----------- | ----------- |----------- | ----------- | ----------- |
| Content      | 0xEF       | 0xBE | 0xAD | 0xDE| 


If one were to store `0xDEADBEEF` in big-endian format, it will result in: 

| Address      | 0x0 | 0x1 | 0x2 | 0x3 |
| ----------- | ----------- |----------- | ----------- | ----------- |
| Content      | 0xDE       | 0xAD | 0xBE | 0xEF| 


**Note** that our `bsim.jar` program displays the memory address the other way around, that is **high address** on the **left** and **low address** on the **right**, so our little-endian format in $$\beta$$ *looks like* the big-endian format for easy debugging: 

| Address      | 0x3 | 0x2 | 0x1 | 0x0 |
| ----------- | ----------- |----------- | ----------- | ----------- |
| Content      | 0xDE       | 0xAD | 0xBE | 0xEF| 




$$\beta$$ instructions are also created by writing **convenient** **macroinstructions**. For example, we want to load the following instruction into memory:
`110000 00000 11111 1000 0000 0000 0000`
The above is an `ADDC` instruction, to add contents of `R31` with `-32768` and store it at `R0`. 

**Without any symbols**, would need to write them as:
`0b00000000 0b10000000 0b00011111 0b11000000` to be loaded properly where the `OPCODE` is stored at a higher address than `Rc`, and `Rc` is at a higher memory address than `Ra`, and 16-bit constant `c` is at the lowest memory address of the entire word. 
> But the above is so unintuitive! We need to chop the original instruction into 1 byte chunks and "load" them from right to left so they're stored from lowest to highest memory location to follow the little-endian format. 

With a slight improvement from macro `LONG`, we can write them as: 
`LONG(0b11000000000011111000000000000000)`

Better yet, we can define a macro called `betaopc` and `ADDC` that relies on the former: 

```cpp
.macro betaopc(OP,RA,CC,RC) {
	.align 4
	LONG((OP<<26)+((RC%32)<<21)+((RA%32)<<16)+(CC % 0x10000))
}
.macro ADDC(RA,C,RC) betaopc(0x30,RA,C,RC)
```

Then we can utilise it easily to load our instruction above in a more intuitive way: 
```cpp
ADDC(R15, -32768, R0)
```

**In summary,** the file `beta.uasm` given for your lab provides support for all $$\beta$$ instructions so that we can write instructions for $$\beta$$ in a *much more intuitive way without caring about the details on how to load these values properly into memory* (**abstraction provided**).  

```cpp
| BETA Instructions:

|| OP instructions
.macro ADD(RA,RB,RC) betaop(0x20,RA,RB,RC)
.macro AND(RA,RB,RC) betaop(0x28,RA,RB,RC)
.macro MUL(RA,RB,RC) betaop(0x22,RA,RB,RC)

|| OPC instructions
.macro ADDC(RA,C,RC) betaopc(0x30,RA,C,RC)
.macro ANDC(RA,C,RC) betaopc(0x38,RA,C,RC)
.macro MULC(RA,C,RC) betaopc(0x32,RA,C,RC) 

...
|| Memory Access instructions
.macro LD(RA,CC,RC) betaopc(0x18,RA,CC,RC)
.macro ST(RC,CC,RA) betaopc(0x19,RA,CC,RC)
.macro LDR(CC, RC) betabr(0x1F, R31, RC, CC)
...

|| Transfer Control instructions
.macro betabr(OP,RA,RC,LABEL)	betaopc(OP,RA,((LABEL-.)>>2)-1, RC)
.macro JMP(RA, RC) betaopc(0x1B,RA,0,RC)
.macro BEQ(RA,LABEL,RC) betabr(0x1D,RA,RC,LABEL)
.macro BNE(RA,LABEL,RC) betabr(0x1E,RA,RC,LABEL)
...
```


## [Interpreter and Compiler](https://www.youtube.com/watch?v=Hhq3RhZcngQ&t=1487s)

We are naturally more accustomed  to higher level language. They're more readable, concise, and portable. 

Some higher level languages, like Java and C/C++ have to be compiled first using its respective **compilers** (`javac` for Java or `GCC` for C/C++), resulting in an executable (a sequence of binary instructions directly understandable by the CPU). 

>Compilers typically go through sophisticated steps of analysing the entire high-level source code to produce an optimized set of instructions for the machine. We will not be able to execute the program if the compiler meets an error, hence making it comparatively harder to debug. It slows down program *development* but it will result in faster execution. 

Other languages like Python and Ruby are *interpreted*. The **interpreter** for these languages execute the program directly, often by translating each statement into a sequence of one or more standard subroutines, and finally into machine code. 

>There's not too much *analysing* of source code done, and will translate the program on the fly. It will execute the program until the first error is met, hence debugging will be comparatively easier than debugging compiled languages. 


## Compiling Expressions

In this course, we will not dive into how compilers, assemblers, or interpreters work in too much detail. In fact, we are going to **hand compile** the high-level language (we will use C) ourselves into $$\beta$$ assembly (and then hand assemble them into the binary executable).

> Don't worry. Compilation to *unoptimized* code is pretty straightforward. You won't be required to write C-code either, only to read them.  

There are several rules to keep in mind in order to do this well:
* Variables are assigned to memory locations and accessed via `LD` and `ST`
* Operators translate to ALU `OP`
	* Small constants translate to `c` (literal-mode) ALU instructions
	* Large constants must be loaded to registers first
* Conditionals and loops involve `BEQ` or `BNE`

Let's dive into simple examples to make this clearer. 

> To aid your learning, copy each snippet to `bsim` and observe the instruction execution step by step. 

### [Example 1: Basic Variable Declarations](https://www.youtube.com/watch?v=Hhq3RhZcngQ&t=1730s)

C Code: 
```cpp
int x,y;
x = 20
y = x + 5
```

Translates to the following $$\beta$$ assembly code:
```cpp
.include beta.uasm

LD(R31, x, R1)		| load the content of memory address x to R1
ADDC(R1, 5, R0)	| now that '20' is in R1, add it with 5, store it at R0
ST(R0, y, R31) 		| store the result (at R0) to location y
HALT()

x : LONG(20)	| label x points to where 20 is stored
y : LONG(0)		| label y points to where 0 is stored
```
### [Example 2: Arrays ](https://www.youtube.com/watch?v=Hhq3RhZcngQ&t=1934s)

C Code: 
```cpp
int x[5];
x[0] = 12; 
x[1] = 13;
x[2] = x[0] + x[1];
```
Translates to the following $$\beta$$ assembly code:
```cpp
.include beta.uasm

ADDC(R31, 12, R0)	| supposed content of x[0]
ST(R0, x)			| store '12' in R0 at address x
ADDC(R31, 13, R1)	| supposed content of x[1]
ADDC(R31, 4, R2) 	| index 1 (x[1] -> x+4)
ST(R1, x, R2)    	| store '13' in R1 at address (x+4)
ADD(R0, R1, R3) 	| x[0] + x[1] = 25
ADDC(R31, 8, R2) 	| index 2 (x[2] -> x+8)
ST(R3, x, R2) 		| store '25' in R3 at address (x+8)
HALT()

x : . 
```

### [Example 3: Conditionals and Loops](https://www.youtube.com/watch?v=Hhq3RhZcngQ&t=2206s)
C Code: 
```cpp
int n = 20;
int r = 1;

while (true){
	if (n <= 0) break;
	r = r*n;
	n = n-1;
}
```
Might translate to the following $$\beta$$ assembly code:
```cpp
.include beta.uasm

LD(R31, n, R1)
LD(R31, r, R2) 

check_while: CMPLT(R31, R1, R0)	| compute whether n > 0
BNE(R0, while_true, R31) | if R0 != 0, go to while_true
ST(R2, r, R31)			 | store the result to location 'r'
HALT()

while_true: MUL(R1, R2, R2) | r = r*n
SUBC(R1, 1, R1) 			| n = n-1
BEQ(R31, check_while, R31) 	| always go back to check_while

n : LONG(20)
r : LONG(1)
```

## [Summary](https://www.youtube.com/watch?v=Hhq3RhZcngQ&t=2557s)
[You may want to watch the post lecture videos here:](https://youtu.be/ppYTQsHXVZU)


There are a lot of ways to translate higher level language into a lower level language. The examples given above are not necessarily the *most optimised* way, for example, we can ask ourselves:
* Is it possible to reduce the number of instructions? 
* Is it possible to reduce the amount of `LD` and `ST`? 

The examples above are also not exhaustive. There are several undiscussed parts:
* How do we reuse boilerplate code?
* How do we write functions? Declare structures? 
* Where do we keep local variables? 

> We will address them in the next chapter. 

Note that optimization in compilation is not a trivial task. For now, don't worry too much about it. We simply only need to hand assemble C into $$\beta$$ assembly language, and have a general idea on what a compiler, interpreter, and assembler are for -- that is to enhance the programmability of a computer by providing **software abstraction.** 




