---
layout: default
permalink: /notes/logicsynthesis
title: Logic Synthesis
description: A little bit of Boolean Algebra knowledge for us to synthesize logic and make functional specifications for our hardware.  
nav_order: 5
parent: Hardware Related Topics
---


* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design

# Logic Synthesis
{: .no_toc}
[You can find the lecture video here.](https://youtu.be/yXBAy432vT8) You can also **click** on each header to bring you to the section of the video covering the subtopic. 

{:.highlight-title}
> Detailed Learning Objectives
>
> 1. **Explain the Basics of Logic Synthesis:**
>   - Explain how combinational logic devices synthesize logic to produce specific outputs based on given inputs, adhering to functional specifications or truth tables.
>   - Explain how functional specifications are expressed through truth tables for different logic gates like NAND and AND.
> 2. **Explain Multi-input Logic Gates:**
>   - Explain the concept of multi-input gates and recognize the computational possibilities and limitations of different gate types.
>   - Justify how the number of possible logic gates increases exponentially with the number of inputs.
> 3. **Apply Sum of Products Method (SoP):**
>   - Compute Boolean expressions from given truth tables using the sum of products method.
>   - Explain the process of creating combinational logic expressions that align with specified truth tables using SoP.
> 4. **Synthesize Logic Using Basic Logic Gates:**
>   - Syntheize any given Boolean expression with the use of basic logic gates (INV, AND, OR, XOR).
>   - Apply straightforward logic synthesis to build complex combinational devices from basic components.
> 5. **Utilize Boolean Algebra for Logic Minimization:**
>   - Apply Boolean algebra properties to manipulate and simplify Boolean expressions.
>   - Identify various Boolean algebra rules and their applications in reducing logic complexity.
> 6. **Explain Universal Gates:**
>   - Explain how NAND and NOR gates as considered as universal gates capable of implementing any Boolean function.
>   - Practice how to construct basic logic functions using only NAND or NOR gates.
> 7. **Identify Special Combinational Logic Devices:**
>   - Examine the functionality and application of multiplexers and demultiplexers in digital circuits.
>   - Illustrate how multiplexers can implement any Boolean function by selecting among multiple inputs.
> 8. **Explain the Use of ROMs for Hardcoding Logic:**
>   - Explain the use of Read-Only Memories (ROMs) to permanently encode specific logic functions.
>   - Explain the physical layout of ROMs and practice designing ROMs
> 	- Justify the implications of using ROMs in digital circuit design.
>
> These objectives are designed to provide students with a thorough understanding of how combinational logic devices are conceptualized, designed, and implemented in digital electronics, fostering a foundation for more complex system designs.

## [Overview](https://www.youtube.com/watch?v=yXBAy432vT8&t=0s)
The purpose of creating combinational devices is to **synthesise logic**, meaning that we create a device that is able to give a certain combination of output given a certain combination input. In other words, a device that adheres to a truth table, i.e: its *functional specification.* 

Any combinational device has to have a functional specification. Functional specifications are represented with **truth tables**. So for example, the following is the truth table of an NAND gate *(input: A and B, output: Y)*: 

$$\begin{matrix}
A & B & Y\\
\hline
0 & 0 & 1\\
0 & 1 & 1\\
1 & 0 & 1\\
1 & 1 & 0\\
\end{matrix}
$$

The truth table for an AND gate is the opposite *(input: A and B, output: Y)*: 

$$\begin{matrix}
A & B & Y\\
\hline
0 & 0 & 0\\
0 & 1 & 0\\
1 & 0 & 0\\
1 & 1 & 1\\
\end{matrix}
$$

So as you can see, "NAND" is just a short for "not-an-and". The output of a NAND gate is always `1` unless both A and B are `1`. The output of an AND gate is the opposite, that is it is always `0` unless both A ***and*** B are `1`.  

  
## [N-input Gates](https://www.youtube.com/watch?v=yXBAy432vT8&t=309s)

  

There are 16-possible 2-input gates, as shown in the image below. The AND gate and the NAND gate are among the few ones that are more common. The OR, NOR, XOR, and XNOR gates are very commonly used too. In short, **there are $$2^{2^x}$$ possible x-input gates**, but not all are exactly useful in practice.

{: .note}
Please do not memorize these things blindly. They're **logic**, encoded in binary. The names of the gates signify the logic, for example logic AND means that we shall *detect* and produce a discernible output if input `i` **and** `j` (or any other inputs) to the device are all `1`. 

<img src="https://dropbox.com/s/p407rd2m9n943hh/tt.png?raw=1"  class="center_seventy" >  
  


## [Sum of Products](https://www.youtube.com/watch?v=yXBAy432vT8&t=585s)
We can also have functional specifications in terms of **boolean expression**. To convert truth tables into boolean expressions, we take the following steps:

1. Look **only for the rows with output= 1**. In the case of the NAND gate, we look at row 1, 2, and 3. 
1. For each row in with output = 1, if the value of the input is a 0, then express it with a NOT.
3. **Sum** all the expressions from the rows with Y=1 to get sum of products.


Taking the NAND gate's truth table as example:
 
A | B | Y
---------|----------|---------
 0 | 0 | 1
 0 | 1 | 1
 1 | 0 | 1
 1 | 1 | 0

NAND gate's sum of product is:
$$\begin{aligned}
Y = \overline{A} \text{ } \overline{B} + \overline{A}B + A\overline{B}
\end{aligned}$$


*Sometimes in textbooks, it is called as canonical sum of products. They mean the same thing as just "sum of products".*




## [Straightforward Logic Synthesis](https://www.youtube.com/watch?v=yXBAy432vT8&t=1248s)

Combinational devices are designed to meet specific functional specifications. By using basic gates like INV (inverter), AND, and OR, we can synthesize any complex logic or truth table. This foundational approach allows us to <span class="orange-bold">apply the sum of products method</span> to effectively construct these complex functions.

The truth table for `OR` gate is as follows, that is the output is `1` if either A or B input is `1`:

$$\begin{matrix}
A & B & Y\\
\hline
0 & 0 & 0\\
0 & 1 & 1\\
1 & 0 & 1\\
1 & 1 & 1\\
\end{matrix}
$$


Given a sum-of-products boolean expression, we can make a combinational device that has that boolean expression as functional specification using **these three types of logics**: `INV`, `AND`, and `OR` with *arbitrary* number of inputs.

For example, given the following sum of products expression,

$$ \begin{aligned}
Y = \overline{C} \text{ }\overline{B} A + \overline{C} B A + CB\overline{A} + CBA
\end{aligned}$$

 
We can make a combinational device as such that it adheres to the expression above using these three logic devices only, as shown below: 

<img src="https://dropbox.com/s/9snlkdv9s4ldy10/gates.png?raw=1" class="center_fourty" >

Explanation:
* The boolean expression of the output Y contains **4 terms** that are added or summed together.
 * The 4-input OR gate at the output Y represents the **summation** of these four terms.
* The AND gates in the *second "column"* of the figure represents the **combination** of each of the input terms, 
* The INV at the input represents the NOT inputs *(negated inputs).*

{: .note-title}
> Example
> 
> $$\overline{C} \text{ }\overline{B} A$$ means *not C*, *not B*, and *A* combined together as an input to a 3-input AND gate. 


{:.important}
By applying the sum-of-products directly with `INV`, `AND` and `OR` gates, we synthesize logic easily, but this is not necessarily the most efficient, cheapest, smallest method available. 


## [Boolean Algebra Properties](https://www.youtube.com/watch?v=yXBAy432vT8&t=1492s)

In this section, we learn how to ***reduce*** the boolean expression such that we have less number of terms, and thus are able to synthesize the logic more effectively (cheaper device, smaller in terms of size, use less gates, etc). 

Boolean algebra properties are useful to <span class="orange-bold">manipulate</span> boolean expressions so that we simplify and reduce the terms, while still keeping the logic equivalent. 

Here are some simple boolean algebra properties:

$$\begin{aligned}
\text{OR rules: } & a+1 = 1, \\
& a+0 = a, \\
& a+a=a\\
\text{AND rules: } & a1=a, \\ & a0=0, \\ & aa=a\\
\text{COMPLEMENT rules: } & a + \bar{a}=1, \\ & a\bar{a}=0 \\ 
\end{aligned}$$

Below we have more properties that are built based on some of the rules above and each other. <span class="orange-bold">We do not have to prove each law in this course</span>, but if you're interested, you can look for other references such as [here](https://www.electronics-tutorials.ws/boolean/bool_6.html).

$$\begin{aligned}
\text{Commutative: } & a+b = b+a, \\ &ab = ba\\\\
\text{Associative: } & (a+b)+c = a+(b+c),\\ & (ab)c = a(bc)\\\\
\text{Distributive: } & a(b+c) = ab+ac, ,\\ & a+bc = (a+b)(a+c)
\end{aligned}$$

The two laws below are useful to perform boolean minimisation because we might end up with less number of terms while keeping the same logic:

$$\begin{aligned}
\text{Absorption law: } & a+ab=a, \\ & a+\bar{a}b = a+b,\\ &a(a+b) = a, \\ &a(\bar{a}+b) = ab\\
\text{Reduction law: } &ab + \bar{a}b = b, \\& (a+b)(\bar{a}+b) = b
\end{aligned}$$


Note that the boolean algebra properties above also applies for the inverted form, e.g: if $$\bar{a}$$ is swapped with $$a$$ instead: 
*  $$a+\bar{a}b = a+b$$ (original); $$\bar{a}+ab = \bar{a}+b$$ (invert $$a$$)
* $$ab + \bar{a}b = b$$ (original); $$a\bar{b} + \bar{a}\bar{b} = \bar{b}$$ (invert $$b$$) 
* $$a(a+b) = a$$ (original); $$\bar{a}(\bar{a}+\bar{b}) = \bar{a}$$ (invert both)

There's a lot of boolean theorems that are derived from the above, for example:

$$\text{Consensus Theorem} \\
ab + \bar{a}c + bc =  ab + \bar{a}c$$

Proof:

$$
\begin{aligned}
ab + \bar{a}c + bc &=  ab + \bar{a}c + (\bar{a}+a)bc\\
&=ab + abc+ \bar{a}c + \bar{a}bc \\
&= ab(1+c) + \bar{a}c (1+b)\\
&=ab + \bar{a}c\
\end{aligned}
$$

What's important is to **pay attention** to the <span class="orange-bold">relationship</span> between each variables. You can easily let $$\bar{a} = x$$ and find the formula applies as well for the inverted version. 
 
### [DeMorgan's Theorem](https://www.youtube.com/watch?v=yXBAy432vT8&t=1507s)

The DeMorgan's theorem is a useful tool for manipulating boolean equations, allowing the conversion of `OR` operations into `AND` operations and vice versa using `INV`. The theorem states:
  

$$\begin{aligned}
\overline{a+b} &= \overline{a} \text{ } \overline{b}\\
\overline{ab} &= \overline{a} + \overline{b}
\end{aligned}$$


### [Boolean Minimization Example](https://www.youtube.com/watch?v=yXBAy432vT8&t=1663s)

When given a boolean expression, we need to be creative and utilize all possible properties of boolean algebra to minimise the expression. For example, we can use the *reduction* rule from the boolean algebra cheat-sheet above to perform boolean minimization:

$$\begin{aligned}
Y &= \overline{C} \text{ }\overline{B} A + \overline{C} B A + CB\overline{A} + CBA\\
&= \overline{C} \text{ } \overline{B} A + \overline{C} BA + CB \\
&= \overline{C} A + CB 
\end{aligned}$$

{:.note}
It takes practice. Don't worry if you don't get it on the first try. 

### [Karnaugh Map for Boolean Minimisation](https://www.youtube.com/watch?v=yXBAy432vT8&t=1953s)

The Karnaugh Map offers an <span class="orange-bold">alternative</span> method to perform boolean minimization. This is a method to easily perform boolean minimization, and **ultimately the end goal is to reduce the digital circuit to its minimum number of gates** (save cost and save space).


*The following figure shows a 2-input (by input it just basically means how many input boolean variables), 3-input, and 4-input Karnaugh maps.* **Please do not change the order**, they follow **Gray code configuration** to preserve **adjacency** so rules 1-6 below can apply. 

{:.note}
It is possible to rotate them clockwise or anticlockwise but do so only if you understand the logic behind arrangement of Karnaugh map configuration, which is out of this syllabus. 

<img src="https://dropbox.com/s/3aaw73p23w2zd4j/k1.png?raw=1"   class="center_seventy" >

The number of **cells** of Karnaugh maps with $$x$$ inputs is $$2^x$$ cells. Then, fill in `1` to all the cells that represent logic `1` on the boolean expression. 

For instance, here is an example of a  truth table and its corresponding Karnaugh map:

  
<img src="https://dropbox.com/s/cmx3apt9l48izd5/k2.png?raw=1" class="center_fifty" >

You can **simplify** the Karnaugh Map using these six fundamental rules:

1. **Maximize `1` cells in each group**, avoiding any blank cells.
2. Groups must be **powers of 2**: 1, 2, 4, 8, 16, 32, etc.
3. **Adjacent grouping only**: `1` cells can be grouped with others immediately to the left, right, above, or below—**no diagonals**.
4. **Overlapping is allowed**, enabling smaller groups to expand, thus aiding in achieving the simplest solution.
5. Consider the **map's edges and corners as continuous**: groups can extend over the top and bottom or left and right edges, with corners also able to join these edge groups, provided all other rules are met.
6. **Minimize the number of groups** to streamline the solution.

  

Following the rules above, the simplified example Karnaugh map is:

<img src="https://dropbox.com/s/ul1xkga719faqes/k3.png?raw=1" class="center_fourty">

  
To convert this Map back into boolean expression, we need to look at each group and use a little bit of logic:
1. In the **blue group,** the output is  `1` regardless of A, and regardless of C. Hence, the boolean expression for the blue group is just M.
2. In the green group, the output is  `1` regardless of M. Therefore, the boolean expression for the green group is AC.
3. The complete simplified boolean expression is: $$X = M + AC$$.

$$X = M + AC$$ is logically equivalent to $$X = \bar{A}M\bar{C}$$+$$\bar{A}MC$$+ $$AM\bar{C}$$+$$A\bar{M}C$$+$$AMC$$ (the sum of products of its truth table). 

You can also obtain the minimized expression using boolean algebra:
- **Reduction** rule: $$\bar{A}M\bar{C}$$+$$\bar{A}MC$$ = $$\bar{A}M$$
- Apply another **reduction** rule: $$AM\bar{C}$$+$$AMC$$ = $$AM$$
- So far we have: $$X = AM+ \bar{A}M+A\bar{M}{C}$$
- We can further reduce the first two terms, resulting in  X = $$M+A\bar{M}{C}$$
- Use **absorption** rule to absorb $$\bar{M}$$, we end up with X = $$M+AC$$

{: .note}
Minimised boolean forms are <span class="orange-bold">not</span> necessarily unique. The number of terms left in the final expression is unique but its possible to have a different form. 


## [Universal Gates](https://www.youtube.com/watch?v=yXBAy432vT8&t=908s)
 

NAND and NOR gates are **universal**, meaning that each *alone* can implement **any** boolean function. AND, OR, and INV alone aren't sufficient, but together these three can express any boolean expressions (we will see this in the next section). 

We can use just NANDs or just NORs gates to make AND, OR and INV gates:

<img src="https://dropbox.com/s/dflzkxdqvuyypjt/univgates.png?raw=1" class="center_fifty" >

{:.note}
Universal gates like NAND and NOR simplify circuit design, reduce manufacturing costs, and enhance reliability by allowing any Boolean function to be implemented using just one type of gate.


## Special Combinational Logic Devices

### [The Multiplexer](https://www.youtube.com/watch?v=yXBAy432vT8&t=3493s)
  

The Multiplexer (shorted as "mux") is a special combinational logic device that is very commonly used in practice. It is implemented using basic logic gates (INV, AND, and OR, or NANDs). The mux is expensive to manufacture, but *universal*, meaning that it can **implement any boolean function because essentially it "hardcodes" the truth table**. 

The symbol for a mux is as shown in the image below. The truth table is written at the side. A mux **always** has **three** types of terminals: 
* $$2^k$$ bits data inputs, 
* `k` bits selector signal(s) --*this is also an input, but we have a special name for them them: selector*-- , and 
* 1-bit output. 

It's function components: the inputs, the selector signal(s), and the output. It basically "*allows*" one of the input signals to pass through when selected to be reflected at `OUT`. 

{: .highlight}
For example in the case of 2-input mux below, when S=0, it will reflect whatever value the signal  $$A$$ carries (`1` or `0`) as its output:

Take some time to make sense of the truth table. That is if S=0, OUT = A. Else, if S=1, OUT = B. produce the signal  $$D_0$$ as its output:

<img src="https://dropbox.com/s/nbatvm3m7xvq279/muxtt.png?raw=1"    class="center_fifty" >

You can build a 2-input multiplexer using basic gates:

<img src="https://dropbox.com/s/kl35pytim23xlm4/muxin.png?raw=1"   class="center_fifty"  >

Some properties about multiplexers:
1. Muxes are **universal**, meaning that it can implement any boolean functions
1. A Mux can have $$2^k$$ data inputs, and $$k$$ bits select inputs, and **only can have 1 output** terminal. 

We can also generalise the multiplexer to take more inputs: 4, or 8, or 16, etc. We can either build a bigger multiplexer or cascade many 2-input multiplexers. The following figure shows an example of a 4-input multiplexer, implemented as a big mux (left) or using a series of 2-input mux (right):  

<img src="https://dropbox.com/s/g5sqzvvn5pqwoha/4mux.png?raw=1"   class="center_seventy"   > 	
  
Similarly, you can build a 4-input mux using basic logic gates: 

<img src="https://dropbox.com/s/pl9902hnvpeg9mp/4muxin.png?raw=1"  class="center_fifty"   >

Below is an example of how a mux can be used to implement a more complex combinational device, the full adder that we encounter in the lab. The truth table of a full adder is as shown, it is basically an addition (of three inputs) in base 2:

<img src="https://dropbox.com/s/lryt8p85jrowz40/addr.png?raw=1" class="center_thirty"  >  

The multiplexer can simply implement the truth table by mapping each type of output bit $$C_{out}$$, and $$S$$ in each of the input terminals of the mux as illustrated below (for the carry out): 


<img src="https://dropbox.com/s/0vpdyz1lch62jd1/muxc.png?raw=1"  class="center_seventy" >

We can do the same thing for $$S$$, and both of them combined will function as a full adder. 

### [Decoder](https://www.youtube.com/watch?v=yXBAy432vT8&t=3938s)

The Decoder (also known as "demux" or "demultiplexer") is a special combinational logic device that is also very commonly used in practice. It can have $$k$$ select inputs, and $$2^k$$ possible output combinations. The schematic of a 1-select input decoder is:

<img src="{{ site.baseurl }}/docs/Hardware/images/demuxin.png"  class="center_fourty"/>

{: .note-title}
> Practice
> 
> Draw out the truth table of the decoder above.


The schematic of a 2-select inputs decoder: $$S_0$$ and $$S_1$$ is (we omit the "IN") because it is usually just VDD:

<img src="https://dropbox.com/s/8uagnvsipvppgby/decoderinside.png?raw=1"   class="center_fourty"  >

> Take some time to trace out the selector values to the output and draw out a truth table for the decoder. Do not worry about the logic gate schematics of a decoder. It is only there to show you that a decoder is made up of the normal logic gates like inverters and AND gates.

Some properties about decoders:

1. A Decoder is basically the *opposite* of a multiplexer. It has $$k$$ select inputs, and $$2^k$$  **possible data outputs**, and only 1 bit of input (typically VDD). The symbol is shown below:
<img src="https://www.dropbox.com/s/ig6s46lb2s992c2/demux.png?raw=1"  class="center_thirty"   > 

1. This figure omits the 1 bit input to the decoder because **it is always set to 1** in practice.
2. Therefore, for a 4 bit decoder as shown in the figure above, the input signals are only the two **SELECTOR** signals, denoted as $$IA_0$$ and $$IA_1$$ in the figure.
3. **At any given time** only 1 bit of the $$2^k$$ output bits can be  `1` (high). This is apparent when we try to draw the truth table for a $$k$$ input decoder.

For example, the truth table for a 1-selector bit decoder is:

$$
\begin{matrix}
S & O_1 & O_2\\
\hline
0 & 1 & 0 \\
1 & 0 & 1\\
\hline
\end{matrix}
$$
	
The truth table for a 2-selector bits decoder is:

$$
\begin{matrix}
S_1 & S_0 & O_0 & O_1 & O_2 & O_3\\
\hline
0 & 0 & 1 & 0 & 0 & 0 \\
0 & 1 & 0 & 1 & 0 & 0 \\
1 & 0 & 0 & 0 & 1 & 0 \\
1 & 1 & 0 & 0 & 0 & 1 \\
\hline
\end{matrix}
$$

In other words, only the selected output $$i$$ is HIGH ( `1`), and the rest of the $$2^k-1$$ data output is LOW (`0`).

### [Read-Only-Memories (ROM)](https://www.youtube.com/watch?v=yXBAy432vT8&t=4059s)

  

One of the application of a decoder is to create a read-only-memories (ROM). 
> You can buy them online, like [this product](https://learn.adafruit.com/digital-circuits-5-memories/read-only-memory). 

For example, if we "**hardcode**" the Full-Adder using a decoder, we end up with the following schematic:<br>
<img src="https://www.dropbox.com/s/t90f9n3ypg9aj9c/decoder.png?raw=1" class="center_seventy">

Explanation of the schematic above:

- At the output of the decoder, the little circuit with inverted triangle symbol signifies a **pulldown circuit** (an NFET connected to ground), which will "drain" a signal into LOW (0).
- Recall that at  each **combination** of select signal $$A, B$$, and $$C_i$$, only one of the 8 outputs of the decoder will be  `1`. 

For example, when $$A=0, B=0, C_{in}=1$$, the second output line of the decoder from the top, highlighted in blue in the image below is set to  `1`:
<img src="https://dropbox.com/s/o5meriyxc47k0bn/sel1.png?raw=1" class="center_seventy" >

* Since there exist a **pulldown** at the S line, it drains the `1` and results in `0` at S line towards the inverter. There's no pulldown for the $$C_{out}$$ line, so the value fed in towards the inverter in the $$C_{out}$$ line is `1`. The inverter invert these values as their final output.
* Therefore, when $$A=0, B=0, C_i=1$$, $$S$$ is `1` and $$C_{out}$$ is `0`. 

Note the **presence of inverters by invention** at the end of the two vertical output lines for $$S$$ and $$C_{out}$$, so the overall output is inverted to be  `1` for $$S$$ and `0` for $$C_{out}$$.

By **invention**, the location of the "pulldown" circuits **correspond to a `1` in the truth table** for that particular output ($$S$$ or $$C_{out}$$).

For $$K$$ inputs, decoder produces $$2^K$$ signals, only  `1` which is asserted (valid "High", or simply "selected") at a time. 

The **properties** of ROM are as follows:

1. ROMs ignore the structure of combinational functions (our truth table is "**hardcoded**". 
2. The selectors are like **addresses** of an entry.
3. For an $$N$$-input boolean function, the size of ROM is roughly $$2^N \times \text{ \#outputs}$$. 

{: .highlight} 
For example, the Full Adder has 3 inputs (A, B, $$C_{in}$$), and 2 outputs ($$S$$ and $$C_{out}$$). Hence the size of the ROM is $$2^3 * 2 = 16$$.

ROM is a **universal** tool for implementing combinational logic functions but may not always be practical for functions with a large number of inputs due to memory size constraints.

## [Summary](https://www.youtube.com/watch?v=yXBAy432vT8&t=4421s)
[You may want to watch the post lecture videos here.](https://youtu.be/oo58e54SHjs)

Here are the key points from this notes:
1. **Multi-input logic gates**: There are 16 2-input logic gates (AND, XOR, XNOR, etc), and there are $2^{2^x}$ possible $x$ input gates. 
2. **Synthesize logic**: Given a truth table,  perform straightforward logic synthesis using **sum-of-products**. 
3. **Boolean Algebra Minimisation**: Minimise boolean functions (e.g: basic sum-of-products) using DeMorgan's theorem, reduction rule, absorption rule, etc or Karnaugh Map to make the boolean equation more compact. This results in simplified hardware (cheaper, smaller) while retaining functionality.
4. **Universal Gates**: NAND and NOR gates are universal. We can construct **any** combinational logic device by just using NAND gates or NOR gates alone. 
5. **Complex Combinational Logic Device**: Special devices like decoder, multiplexer, and ROM are essential components. Multiplexers are used to implement **conditional logic** (if-else), decoders are used to perform address decoding among many others. Decoders can be used to implement a ROM. It maps the input address lines to specific memory locations within the ROM.

ROM can be used to implement **any** combinational logic function. This is because ROM essentially acts as a look-up table (LUT) where each input combination maps directly to a pre-defined output value. However, this results in **size explosion**. For $n$ inputs, the ROM requires $2^n$ rows,  leading to rapid growth in memory size for large input sizes.

{:.note}
Designing and implementing the logic directly using gates like AND, OR, NOT, NAND, NOR, etc., rather than relying on a ROM to store the outputs leads to a more efficient design (smaller unit, cheaper unit, less power drawn), but it is challenging to do so and to test because it is prone to errors. 

# Appendix


## [Logic Synthesization with CMOS](https://www.youtube.com/watch?v=yXBAy432vT8&t=2605s)
We can create a combinational logic device easily given the *minimized* boolean expression, using any of the universal gates:
* NANDs only
* NORs only
* AND, INV, and OR 

Each gate can be created using transistors: PFETs and NFETs arranged in a complementary way. The schematic of each is as follows:
<img src="https://dropbox.com/s/tnleg2coz9kjpul/andorinv.png?raw=1" class="center_seventy"  >

{:.note}
The OR and AND gates are simply the NOR and NAND gates with inverter at the output. 

We can also create the device straight using CMOS recipe given the minimised boolean expression (instead of using the universal gates). For example, given this minimised equation that we did earlier:
$$Y= \overline{C} A + CB$$

It can be made this way with a combination of **universal gates**: 

{:.highlight}
Recall that the AND is actually NAND + INV, and the OR is NOR + INV.

<img src="https://dropbox.com/s/rqc1v5b9uioneef/dev.png?raw=1" class="center_fourty" >

This requires **20 MOSFETs** to build.

{: .note-title}
> The **freestyle** way
> 
> You may design CMOS circuitry without any rules. It's a little like an artwork and <strong>theres more than one way to construct the circuit that produces the same logic</strong>. You can choose to construct the pull-down first or the pull-up first. You can also choose to construct the negation of the circuit and invert the overall output.   Please do not memorise this blindly. At the end of the day, whichever method you choose, it is fine as long as the CMOS circuit produces the <strong>correct logic</strong>. If you want to <i>minimise</i> them though them some careful design is required. It is an art to design a CMOS circuit and it is beyond the scope of this course. 

* **Step 1:** Construct a **pull-down circuitry**: 
	* for each '+' (OR) we build a parallel NFET circuit
	* for each $$\cdot$$ (AND) we build a series NFET circuit 
	Therefore we have two sets of two NFETs in **series**: 
<img src="https://dropbox.com/s/vsfyv7iefuv19cx/DEVMOS1.png?raw=1"  class="center_thirty"   >

* **Step 2:** Add **inverter** at the output.
	* In **Step 1** we created a pull-down circuitry that is *activated* when each of the terms in the boolean expression produces an overall `1`. 
    * E.g: when $$B, C$$ are both 1, the pull-down is activated as current can flow from $$Y$$ to the GND. The effective output at $$Y$$ will be then `0` when $$B,C$$ are both  `1`. 
	* Since what we want is the *opposite*, we need to put an inverter at the output, that is   $$Y=1$$ when $$B,C$$ are both 1, we need to put an inverter at the output, as shown: 
	<img src="https://dropbox.com/s/x2ktjw4gqxx979r/devmos2.png?raw=1"  class="center_fourty"   > 

	If what you want is for $$Y$$ to be <code>0</code> when $$B,C$$ are both <code>1</code> then there's no need to put an inverter in the end. Just draw the complementary pullup and call it a day 

* **Step 3:** Construct the **complementary** pull-up circuitry and assemble. Refer to the CMOS recipe in the previous chapter. 
<img src="https://dropbox.com/s/ft9xplwm26ksgks/devmos3.png?raw=1"   class="center_fourty"  >

This requires **14 MOSFETs** to build, less than the previous design. It is definitely easier (for us) to create a combinational logic device using a bunch of universal gates, but it comes at the cost of money and size. 

Note that the CMOS recipes that we learn in this course also **does not guarantee** that you can build a device with **minimised number of transistors,** given its functional specification. It is an *art* to create the most efficient circuit in terms of money, size, and usage. 