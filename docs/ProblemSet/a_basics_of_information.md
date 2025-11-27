---
layout: default
permalink: /problemset/basicsofinformation
title: Basics of Information
description:  Practice questions containg topics from Basics of Information 
parent: Problem Set
nav_order: 1
---


* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design

# Basics of Information 
{: .no_toc}

Each topic's questions are grouped into **three** categories: basic, intermediate, and challenging. You are recommended to do all basic problem set before advancing further. 


## Bit-width intuition (Basic)  
You are designing a small digital device that needs to represent three different states: `IDLE`, `RUN`, and `ERROR`.
**1.** What is the **minimum** number of bits required to represent these three states?
<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
2 bits.
</p></div><br>

**2.** Write down **all** binary patterns available using that number of bits. 
<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
`00, 01, 10, 11`.	
</p></div><br>

**3.** How many of those patterns are unused?
<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
1 pattern unused.
</p></div><br>

**4.** Which binary pattern must be mapped to each of the states (`IDLE`, `RUN`, `ERROR`)?
<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
The mapping is **arbitrary** because binary patterns are *symbolic* labels. Only **consistency** across the system gives the mapping meaning.
</p></div><br>


## Bit-width and misinterpretation (Basic)

You observe the bit pattern:

```
1001
```


**(a)** Interpret the value in unsigned 4-bit representation.
<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
9
</p></div><br>

**(b)** Interpret the value in signed 4-bit 2’s complement.
<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
-7
</p></div><br>

**(c)** Now assume the same pattern is widened to 8 bits using **sign extension**, that is to keep the *value* mathematically consistent (as per what you wrote in part b) despite having wider bits. Write the full 8-bit pattern and give the decimal value.
<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p> The original 4-bit pattern is <code>1001</code>. In 2’s complement, the most significant bit (MSB) indicates the sign. Since the MSB is <code>1</code>, this number is negative.
To perform <strong>sign extension</strong>, we copy (extend) the sign bit into the new higher bits so that the value is preserved when increasing the bit-width:
<br><br>
4-bit: <code>1001</code>
8-bit: <code>1111 1001</code>
The extended value is still <strong>−7</strong> in decimal.
<br><br>
Sign extension keeps a number’s numeric value unchanged when increasing bit-width by repeating the MSB on the left.
</p></div><br>


## Modular arithmetic and 2's complement representation (Basic)

Most computers choose a particular word length (measured in bits) for representing integers and provide hardware that performs various arithmetic operations on word-size operands. The current generation of processors have word lengths of 32 bits; restricting the size of the operands and the result to a single word means that the arithmetic operations are actually performing arithmetic modulo $$2^{32}$$.


Almost all computers use a 2's complement representation for integers since the 2's complement addition operation is the same for both positive and negative numbers. In 2's complement notation, one negates a number by forming the 1's complement (i.e: for each bit, changing 0 to a 1 and vice versa) representation of the number and then adding 1. **By convention**, we write 2's complement integers with the most-significant bit (MSB) on the left and the least-significant bit (LSB) on the right. Also, **by convention**, if the MSB is 1, the number is negative, otherwise it's non-negative.


**(a.)** How many **different** values can be encoded in a 32-bit word?



<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
There are **2^(32)** different values.
</p></div><br>
  

**(b.)** Please use a *32-bit 2's complement representation* (signed bits) to answer the following questions. What are the **representations** for:

1. Zero
2. The most positive integer that can be represented
3. The most negative integer that can be represented



<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
<ol type="1">
<li><code>0000 0000 0000 0000 0000 0000 0000 0000</code></li>
<li><code>0111 1111 1111 1111 1111 1111 1111 1111</code></li>
<li><code>1000 0000 0000 0000 0000 0000 0000 0000</code></li>
</ol></p></div><br>

**(c.)** What are the **decimal values** for the most positive and the most negative number that can be represented by this signed 32-bit machine?

<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
The most positive value in decimal: 2147483647. The most negative value in decimal: -2147483648
</p></div><br>

  
**(d.)** Since writing a string of 32 bits gets tedious, it's often convenient to use hexadecimal representation where a single digit in the range of 0-9 or A-F is used to represent groups of 4 bits. Give the **8-digit hexadecimal equivalent** of the following decimal and binary numbers:
1. Base 10: $$37_{10}$$
2. Base 10: $$-32768_{10}$$
3. Base 2: `1101 1110 1010 1101 1011 1110 1110 1111`


<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
<ol type="1">
<li><code>0x 0000 0025</code></li>
<li> We begin by converting 32768 (positive) number to Hex: <code>0x 0000 8000</code>. Then we take the 1's complement of this value. <br>Note: transform the hex to binary first and flip the bits, then transform back to hex: <code>0x FFFF 7FFF</code>, and finally add it by 1: <code>0x FFFF 8000</code>.</li>
<li> <code>0x DEAD BEEF</code></li></ol></p></div><br>


  
 
**(e).** **Calculate** the following using 6-bit 2's complement arithmetic (which is just a fancy way of saying to do ordinary addition in base 2, keeping only 6 bits of your answer). Show your work using binary notation. Remember that subtraction can be performed by negating the second operand and then adding to the first operand.

1. 13 + 10
2. 15 - 18
3. 27 - 6


<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
<ol type="1">
<li> <code>001101 + 001010 = 010111</code></li>
<li> 18 is <code>010010</code>.<br>-18 is <code>101110</code>.<br>Hence, <code>001111 + 101110 = 111101</code>.</li>
<li><code>011011 + 111010 = 010101</code></li></ol></p></div><br>

  

## Another Base Conversion (Basic)

Consider an 8-bit **signed** number systems. **Do the following base conversion**, and indicate with a `0b` prefix for binary systems and `0x` prefix for hexadecimal systems. Octal and decimal systems do not have prefixes.

1. 76 (decimal) to binary
2. 0b10000001 (binary) to decimal
3. 0b10011101 (binary) to hexadecimal
4. 0xBF (hexadecimal) to binary
5. 0xC6 (hexadecimal) to octal



<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
<ol type="1">
<li> <code>0b01001100</code></li>
<li> <code>-127</code></li>
<li><code>0x9D</code></li>
<li> <code>0b10111111</code></li>
<li> <code>306</code></li></ol></p></div><br>
  
  

## Representing -32 on different number systems (Basic)  

Which of the following signed numbers is **the representation** of number -32 for either an 8-bit or 16-bit system? *Note: the answer must be either 8-bit or 16-bit long.* 


1. `0b1010 0000`
1. `0b1110 0000`
1. `0b0001 0000`
1. `0xE0`
1. `0x80E0`
1. `0xFFE0`
1. `0x10E0`
1. `0x800000E0`
1. `0xFFFFFFE0`



<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
(2), (4), (6)
</p></div><br>


## Byte and Memory Intuition (Intermediate)

A simple system has a memory of **256** *bytes*.

(a.) How many bits is this in total?
<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p> <code>256 × 8 = 2048</code> bits </p></div><br>

(b.) If you want to uniquely refer to (or “label”) every byte in this memory using a binary number, what is the minimum number of bits required for these labels?
<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p> To label 256 different locations, we need a binary number that can represent 256 distinct values. That requires <code>log₂(256) = 8</code> bits. </p></div><br>

(c.) If each memory location stores a 16-bit value, how many different values can a single location represent?
<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p> A 16-bit value can represent <code>2¹⁶ = 65,536</code> different values. </p></div><br>


## Hex + 2’s Complement (Intermediate)

Find the 8-bit **signed** decimal value of:
```
0xD6
```

Show your working in binary.


<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p> 
First, we convert the hex to binary: `0xD6 = 1101 0110`. Then negate it (invert, and + 1): `0010 1001 + 1 = 0010 1010 = 42`. Therefore, `0xD6` is `-42`.
</p></div><br>


## From logic to decision (Intermediate)

Let two 2-bit numbers A and B be given:
* A = `A1A0`
* B = `B1B0`
  
You must determine if `A > B` using logic gates only. *We are only testing for `A > B`, not `B < A` or `B == A`*.


**(a.)** Write the Boolean expression for the output `Z = 1` if `A > B` using any logic gate.

<div cursor="pointer" class="collapsible">Show Answer</div>
<div class="content_answer"><p>

<code>
Z = (A1 AND (NOT B1)) 
    OR 
    ((A1 XNOR B1) AND A0 AND (NOT B0))
</code>

</p></div><br>


**(c.)** Identify *which* part of the expression corresponds to the **MSB** comparison and which to the **LSB** comparison.

<div cursor="pointer" class="collapsible">Show Answer</div>
<div class="content_answer"><p>

<code>
(A1 AND (NOT B1))                   // MSB comparison
((A1 XNOR B1) AND A0 AND (NOT B0))  // LSB comparison
</code>

</p></div><br>





## Proof of 2's Complement (Challenging)

At first glance, "Complement and add 1" doesn't seem like an obvious way to negate a two's complement number. By manipulating the expression $$A + (-A) = 0$$, **show** that "complement and add 1" does produce correct representation for the negative of a two's complement number. 

*Hint: express 0 as (-1 + 1) and rearrange the terms to get -A on one side and ZZZ+1 on the other and then think about how the expression ZZZ is related to A using only logical operations (AND, OR, NOT).* 

Also, see how binary subtraction 'borrow' method works [here](https://www.wikihow.com/Subtract-Binary-Numbers) if you dont know how it works.

[Video Explanation here.](https://youtu.be/44_d1apK3D8)

<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
Let:
$$\begin{aligned} (-A) &= -A - 1 + 1\\ &= (-1 - A) + 1 \end{aligned}$$
In this case, ZZZ is: $$(-1-A)$$ 

Now, let's say we have 8 bit number. We can represent -1 using all 1's : <code>1111 1111</code>. Then, lets represent A arbitrarily as <code>a7 a6 a5 a4 a3 a2 a1 a0</code>, where `ai` can be 0 or 1. 
<br><br>
Subtracting -1 with A will flip the bits of A, such that if `ai == 0` then `(1 - ai) == 1` and if `ai == 1` then `(1-ai) == 0`.

Hence, we can rewrite the above into:
$$\begin{aligned}
(-A) &= \text{bitwise NOT } A + 1
\end{aligned}$$
which is exactly the two complement's steps. 
</p></div><br>


