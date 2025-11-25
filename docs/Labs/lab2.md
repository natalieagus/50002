---
layout: default
permalink: /lab/lab2
title: Lab 2 - Combinational Logic
description: Lab 2 handout covering topics from boolean algebra and CMOS
nav_order:  4
parent: Labs
---

* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design
<br>

# Lab 2: Combinational Logic
{: .no_toc}

## Objectives

### Submission
There's no code submission/checkoffs for this lab. Simply complete the Lab Questionnaire on eDimension.

### Starter Code
There's no starter code for this lab. You simply need to have [Alchitry Labs V2](https://alchitry.com/alchitry-labs/) installed. You don't need Vivado for this lab, we are only going to run simulations. 

{:.important}
Consult FPGA resources [listed here](https://natalieagus.github.io/50002/fpga/intro) before coming to the lab or after the lab to enhance your knowledge on FPGA programming in general. This will greatly accelerate the quality of your 1D & 2D project. 

## Related Class Materials
The lecture notes on **[logic synthesis](https://natalieagus.github.io/50002/notes/logicsynthesis)** and **[CMOS technology](https://natalieagus.github.io/50002/notes/cmos)** are closely related to this lab.

## Combinational Logic Foundations

Before touching the FPGA, we will translate several logic requirements into Boolean expressions and circuits. Afterwards, we will describe that hardware in HDL and run it on the Alchitry lab simulator. If all works well, we shall build and flash it to the FPGA.

In this lab, we will build three core combinational logic devices: the **full adder**, the **multiplexer**, and the **decoder**. 

<img src="{{ site.baseurl }}/docs/Labs/images/cs-2026-50002-combilogic.drawio.png"  class="center_seventy"/>

These are the most basic non-trivial building blocks of a CPU, the computational “brain” found in microcontrollers, general-purpose computers, GPUs, and other digital systems.

This is the **first** step in learning how to construct **actual** compute units from fundamental logic instead of treating them as black boxes.

### Full Adder

The first combinational logic circuit we are going to build is the **full adder** (FA). This is the smallest non-trivial arithmetic block in digital systems. Its only job is to **add three 1-bit values together and produce a 1-bit sum and a 1-bit carry**.

{:.note}
This full adder is a **fundamental** building block of the ALU (lab in later weeks), which is the computational core of a CPU (which is our goal in learning this course). By building a full adder, we are starting from the *smallest* unit that will later **scale** into an ALU and ultimately a working CPU datapath.

The FA module has **3 inputs** (`A`, `B`, and `Ci`) and **2 outputs** (`S` and `Co`). The logic equations and truth tables for `S` and `Co` are shown below. The logic equation is derived from the truth table.

| A | B | Ci | S | Co |
| - | - | -- | - | -- |
| 0 | 0 | 0  | 0 | 0  |
| 0 | 0 | 1  | 1 | 0  |
| 0 | 1 | 0  | 1 | 0  |
| 0 | 1 | 1  | 0 | 1  |
| 1 | 0 | 0  | 1 | 0  |
| 1 | 0 | 1  | 0 | 1  |
| 1 | 1 | 0  | 0 | 1  |
| 1 | 1 | 1  | 1 | 1  |



**Logic Equation:**

$$\begin{align}
S &= A \oplus B \oplus C_{i} \\
C_{o}  &= A \cdot B + A \cdot C_{i} + B \cdot C_i
\end{align}$$

{: .note}
> The above is not the only way we can write the boolean expression of the FA module.
>
> You can express it using the sum of products method (ANDs and ORs for `S` instead of XORs). You can also build it using *only* the NAND gates or *only* the NOR gates since they are universal gates.

Intuitively, you can think of it as binary column addition:
* Add `A` and `B`
* Then add the *incoming* carry `Ci`
* If the total is `0` or `1`, it goes to `S`
* If the total is `2` or `3`, it “overflows” and produces a carry (`Co` = `1`)

Adding two 1-bits together doesn't seem much at first. But in order to make an N-bit adder later on, we simply cascade N FA modules together. We will get there later.


### Multiplexers (MUX)

The next combinational building block is the **multiplexer** (mux). While the full adder *computes*, the mux selects. You will use muxes everywhere in an **ALU** and **datapath** to *choose* which value should flow forward.

#### 2:1 MUX

A 2:1 MUX has:
* **Two data inputs**: `D0`, `D1`
* **One select input**: `S`
* **One output**: `Y`

{:.new-title}
> mux logic recap
> 
> * If `S = 0`, output `Y` should be `D0`
> * If `S = 1`, output `Y` should be `D1`


The boolean expression for a 2-to-1 mux is:
$$
Y = \overline{S} \cdot D_0 + S \cdot D_1
$$

This is a very compact sum of products expression. From this single line, you can directly draw the gate level implementation:
* One *inverter* for `S`
* Two AND gates for the product terms
* One OR gate to combine

{:.note}
You can think of a 2:1 mux as a <span class="orange-bold">controlled digital switch</span> (an `if` logic). The select line `S` decides *which* data input is connected to the output. In the ALU later, the mux will choose between different **operation** results or between different sources for the same bus.

For multi bit signals, you simply apply the same equation **bitwise**. For example, a 4 bit 2:1 MUX takes `D0[3:0]`, `D1[3:0]`, and `S`, and produces `Y[3:0]` where each bit of `Y` is selected by the same `S`.

#### From 2:1 MUX to 4:1 MUX

A 4:1 mux is simply an extension to the 2:1 mux. It has:

* **Four data inputs**: `D0`, `D1`, `D2`, `D3`
* **Two select inputs**: `S1`, `S0`
* **One output**: `Y`

The truth table now uses the 2 bit select `(S1 S0)` to choose which `Di` appears at `Y`. For example:

* `S1S0 = 00` selects `D0`
* `S1S0 = 01` selects `D1`
* `S1S0 = 10` selects `D2`
* `S1S0 = 11` selects `D3`

You can write the Boolean equation:

$$
\begin{align}
Y &= \overline{S_1} \cdot \overline{S_0} \cdot D_0 \\
& + \overline{S_1} \cdot S_0 \cdot D_1 \\
& + S_1 \cdot \overline{S_0} \cdot D_2 \\
& + S_1 \cdot S_0 \cdot D_3
\end{align}
$$

But for the lab, it is more important that you see how to **construct** a 4:1 MUX **from smaller 2:1 MUXes** that you already understand. A standard structure is:

* **First stage**: two 2:1 MUXes select between `(D0, D1)` and `(D2, D3)` using `S0`
* **Second stage**: a final 2:1 MUX selects between those two intermediate results using `S1`


<img src="{{ site.baseurl }}/docs/Labs/images/lab2/cs-2026-50002-4-to-1 mux.drawio.png"  class="center_fifty"/>


{:.note-title}
> Composition
> 
> This bottom up construction is the same *philosophy* we use for the CPU datapath. We do <span class="orange-bold">not</span> design a giant block from scratch. We design small, verified modules (like 2:1 MUXes and full adders) and then compose them systematically into larger components such as 4:1 MUXes, ALUs, and eventually the whole CPU.
>
> This is why static discipline is so important. It allows us to compose large and complex digital circuits from smaller components and they will all communicate perfectly without loss of information.


### Decoder

A **decoder** is another standard combinational block. While a mux selects one of many inputs to drive a single output, a decoder activates **exactly one** of many outputs based on the input code. It essentially converts a binary code into a **one hot** output.

{: .note}
A **one-hot** encoding means that **exactly one signal line is HIGH (1) at any given time**, while all others are LOW (0). For a 2-to-4 decoder, this means only one of `Y0`, `Y1`, `Y2`, or `Y3` can ever be `1` for a valid input, and the rest must be `0`. This is useful for selecting or enabling exactly one component in a larger system, such as choosing which register to write to or which operation to activate in a control unit.


#### 1 to 2 Decoder

The simplest form of a decoder is the **1-to-2 decoder**. It takes a single binary input and activates exactly one of two outputs.


A 1:2 Decoder has:
* **One data input**: `A`
* **Two outputs**: `Y0`, `Y1` (one-hot)

{:.new-title}
> decoder logic recap
> 
> * If `A = 0`, output `Y0` should be `1`, while `Y1` should be `0`
> * If `A = 1`, output `Y1` should be `1`, while `Y0` should be `0`


The Boolean equations are:

$$
\begin{align}
Y_0 &= \overline{A} \\
Y_1 &= A
\end{align}
$$

This is simply a `NOT` gate for `Y0` and a wire copy for `Y1`. Despite its simplicity, it is the fundamental building block for larger decoders.

#### 2 to 4 Decoder

A **2-to-4 decoder** converts a 2-bit binary input into four one-hot outputs. It can be **constructed hierarchically using three 1-to-2 decoders** arranged in two stages. It has:
* **Two data input**: `A0`, `A1`
* **Four outputs**: `Y0`, `Y1`, `Y2`, `Y3` (one-hot)

**Conceptual construction:**

1. A 1-to-2 decoder first acts on the **MSB (`A1`)**, producing `E0` and `E1`
2. These two signals **enable** two separate 1-to-2 decoders that act on the **LSB (`A0`)**:
   * The first produces `Y0` and `Y1` when `E0 = 1`
   * The second produces `Y2` and `Y3` when `E1 = 1`


This results in exactly one output being asserted for every possible input combination.

<img src="{{ site.baseurl }}/docs/Labs/images/cs-2026-50002-2-to-4 decoder.drawio-2.png"  class="center_seventy"/>

Here is a clean, academically tight note you can drop in without confusion:

{: .note}
When building a larger decoder from smaller modules, do not confuse **port names** with **signal identity**. For example, a 1-to-2 decoder module may have output ports named `Y0` and `Y1`, but when that module is instantiated inside a 2-to-4 decoder, those ports can be connected to signals such as `Y2` and `Y3`. The *module’s internal port names do not define the meaning of the signal* in the larger design. Only the **actual wire it is connected to** determines its role in the system.


**Signal Mapping** (trace it from the circuit diagram to test your understanding):

* `A1A0 = 00`: `Y0 = 1`, `Y1 = Y2 = Y3 = 0`
* `A1A0 = 01`:  `Y1 = 1`, `Y0 = Y2 = Y3 = 0`
* `A1A0 = 10`: `Y2 = 1`, `Y0 = Y1 = Y3 = 0`
* `A1A0 = 11`: `Y3 = 1`, `Y0 = Y1 = Y2 = 0`

The Boolean equations are therefore:

$$
\begin{align}
Y_0 &= \overline{A_1},\overline{A_0} \\
Y_1 &= \overline{A_1},A_0 \\
Y_2 &= A_1,\overline{A_0} \\
Y_3 &= A_1,A_0
\end{align}
$$

Each output is a **single product term**. No summation is required because exactly one output is asserted in any given row of the truth table.

{:.new-title}
> Decoder Usage
>
> A decoder can be seen as the structural opposite of a multiplexer. A multiplexer uses a binary code to **select one input**. A decoder uses a binary code to **activate one output**. In a CPU, decoders are used as control logic, for example selecting a *target* register or enabling a specific ALU operation from an opcode.


With the **full adder**, **muxes**, and **decoders**, we now have the core combinational patterns that **will be reused continuously** when we assemble the ALU and CPU datapath.

## Implementation 

Now lets implement each of the combinational logic module above. Create a new project in Alchitry Labs using this template:

<img src="{{ site.baseurl }}/docs/Labs/images/Screenshot 2025-11-25 at 9.28.09 AM.png"  class="center_seventy"/>

Remember to always select the base project with **pulldowns**. This is to ensure that the board receives a **valid low** when input buttons are not pressed (which maps to invalid input if a pulldown internal resistor is not present). If you're interested to know more, [read this](https://natalieagus.github.io/50002/fpga/fpga_4_2024#version-1-pulldownioacf).

Then we will build the modules in the following order:
* Full adder
* N-bit adder using full adders
* Mux2
* Mux4 using Mux2
* Decoder1to2
* Decoder2to4 using Decoder1to2

### Full Adder

{:.important}
> You are NOT allowed to use the built-in '+' operator in Lucid for this lab and for your 1D project. In fact, you are not allowed to use many arithmetic operators for your project (see later labs). High-level arithmetic operators are **intentionally restricted**. You must construct functionality from Boolean logic and primitive modules, since the objective of this course is to understand the internal structure and behaviour of digital systems, *not* to abstract it away.
> 
> For instance, writing `sum = a + b + ci` hides the structure of half-adders and full-adders and bypasses Boolean reasoning.
> 
> You must implement the full adder using:
> - Boolean expressions
> - AND, OR, NOT, XOR (or NAND/NOR only for bonus)
>
> The purpose of this lab is to expose the actual hardware structure of addition, not to hide it behind a high-level operator.



