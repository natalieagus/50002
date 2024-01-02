---
layout: default
permalink: /lab/lab3-part2
title: Lab 3 - Arithmetic Logic Unit with FPGA (Part 2)
description: Lab 3 handout covering topics from Logic Synthesis, and Designing an Instruction Set
parent: Labs
nav_order:  5
---

* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design
<br>
Modified by: Natalie Agus (2024) 

# Lab 3: Arithmetic Logic Unit
{: .no_toc}

## Starter Code
Continue to work on your ALU project from the previous lab. 

{: .important}
Since there's only 1 FPGA per group, you need to work through this lab as a 1D group during class. However each person must still submit the lab questionnaire **individually**.

You are <span style="color:#ff791a; font-weight: bold;">not required</span> to submit your code for this lab. You will need it anyway for your 1D Project Checkoff 1: ALU and you should submit it then. Simply head to eDimension and do the lab questionnaire by the stipulated due date. 

## Related Class Materials
The lecture notes on [Logic Synthesis](https://natalieagus.github.io/50002/notes/logicsynthesis) and [Designing an Instruction Set](https://natalieagus.github.io/50002/notes/instructionset) are closely related to this lab. 

**Part 2:** Design a multiplier and combine it with each combinational element in Part 1 to form an ALU
<br>Related sections in the notes: **Designing an Instruction Set**
* [Basics of programmable control systems](https://natalieagus.github.io/50002/notes/instructionset#an-example-of-a-basic-programmable-control-system) (using control signals like ALUFN to **perform different operations (`ADD`, `SHIFT`, `MUL`, etc)** between two **32-bit** inputs A and B in the same ALU circuit -- no hardware modification needed). 

## Part 2 Introduction 
In thit Part 2 of our ALU lab, we will implement a 32-bit multiplier unit and then assemble each of the components we have crated in Part 1 plus the multiplier to form a 32-bit ALU. 

The ALU can perform the following 13 arithmetic operations:

<img src="/50002/assets/contentimage/lab3/21.png"  class="center_thirty"/>

{: .new-title}
> Think!
> 
> Remember that an ALU is a **combinational** logic device. It has a certain `tpd` and `tcd`. We use 6-bit `ALUFN` **control signal** to perform any of the 13 operations.  Could you guess which operation determines the `tpd` of the ALU? What about its `tcd`?

## Task 1: Multiplier Unit
The multiplier unit performs a multiplication between 32-bit inputs `A` and `B` each, and produce a 32-bit output. 

{: .note}
**Multiplying two 32-bit numbers produces a 64-bit product** in practice, but the result we’re looking for is **just the low-order 32-bits of the 64-bit product.**

### 4-bit Multiplication Logic
It's hard to imagine a 32-bit multiplier straight up, so let's scale down to a 4-bit version. 

Suppose we want to multiply two 4-bit binary numbers: `A = 1011` (which is 11 in decimal) and `B = 1101` (which is 13 in decimal).

The multiplication process involves the following steps:

1. Write Down the **Multiplicands**: Write A and B such that each bit of B is **aligned** under each bit of A.
2. **Multiply** Each Bit of B by A: Multiply each bit of B with the entire number A, **shifting** the result to the left for each subsequent bit. In binary multiplication, this means we either take A (if the bit in B is 1) or take 0 (if the bit in B is 0).
3. Add the **Partial Products**: Add all the partial products together to get the final result.

```vb
    1011   (A = 11 in decimal)
  x 1101   (B = 13 in decimal)
  ------
    1011   (This is A * 1; the rightmost bit in B is 1)
   0000    (This is A * 0; shift left by 1 because we're on the second bit from the right in B)
  1011     (This is A * 1; shift left by 2)
 1011       (This is A * 1; shift left by 3)
------
10011111   (Sum of the above partial products)
```


Here is a detailed bit-level description of how a **4-bit** by **4-bit** unsigned multiplication works.  This diagram assumes **we only want the low-order 4 bits** of the 8-bit product.

<img src="/50002/assets/contentimage/lab3/18.png"  class="center_fifty"/>

This diagram can be **extended** in a straightforward way to 32-bit by 32-bit multiplication. Remember that since our machine is **only** 32-bit, that means we only can store the low-order 32-bits of the result, we <span style="color:red; font-weight: bold;">don’t need</span> to include the circuitry that generates the rest of the 64-bit product.

### 4-bit Multiplier Schematic
As you can see from the diagram above, forming the *partial products* is easy.  Multiplication of two bits can be implemented using an `AND` gate.  The hard **and tedious part** is adding up all the partial products **(there will be 32 partial products in your circuit)**. 
* One can use FA units hooked up in a ripple-carry configuration to add each partial product to the accumulated sum of the previous partial products (see the diagram below) 
* The circuit closely follows the diagram above but omits an FA module if two of its inputs are `0`


<img src="{{ site.baseurl }}/assets/contentimage/lab3-fpga/2024-50002-MUL.drawio.png"  class="center_seventy"/>

### Multiplier Analysis

The circuit above works with both **unsigned** operands and **signed** two’s complement operands.  

{: .new-title}
> Think!
> 
> This may seem strange, don’t we have to worry about the most significant bit (MSB) of the operands?  With unsigned operands the MSB has a weight of $$2^{MSB}$$ (assuming the bits are numbered 0 to MSB) but with signed operands the MSB has a weight of $$-2^{MSB}$$.  
> 
> **Doesn’t our circuitry need to take that into account?**

Turns out it **does**, but when we are only saving the lower half of the product, the differences <span style="color:#ff791a; font-weight: bold;">don’t appear</span>. The multiplicand (`A` in the figure above) can be **either** unsigned or two’s complement (signed), and the FA circuits will perform correctly in either case.  

When the multiplier (`B` in the figure above) is signed, we should **subtract** the final partial product instead of adding it.  
* But **subtraction** is the **same as adding the negative**, and the negative of a two’s complement number can be computed by taking its complement and adding 1.  
* When we work this through we see that the **low-order bit of the partial product is the same whether positive or negated**.  

{: .highlight}
The low-order bit is **ALL** that we need when saving only the lower half of the product. 

If we were building a multiplier that computed the full product, we’d see many differences between a multiplier that handles **unsigned** operands and one that handles **two’s complement** (signed) operands, but these differences **only** affect how the **high half** of the product is computed.

#### Example: 4-bit Signed Multiplication

Let's use a 4-bit example to illustrate why the lower half of the product is the same whether we are dealing with signed or unsigned numbers, especially in the context of two's complement arithmetic.

Suppose we have `A = 0110` (6 in decimal) multiplied by `B = 1101` (-3 in decimal, two's complement).

As Unsigned Numbers, they are:
* `A = 0110` (6 in decimal)
* `B = 1101` (13 in decimal, treated as unsigned)

The multiplication (ignoring overflow) of these two numbers is:

```vb
   0110   (A = 6)
 x 1101   (B = 13, as unsigned)
 ------
   0110   (A * 1)
  0000    (A * 0, shift left by 1)
 0110     (A * 1, shift left by 2)
0110      (A * 1, shift left by 3)
------
1001110   (78 in decimal, unsigned)
```

However, the multiplication as **signed** numbers works differently because the last partial product **should be negated**:

```vb
    0110   (A = 6)
  x 1101   (B = -3, as signed)
  ------
    0110   (A * 1)
   0000    (A * 0, shift left by 1)
  0110     (A * 1, shift left by 2)
 1010000   (A * 1, shift left by 3, we get 0110000 but it should be negated, resulting in 1010000)
------
 1101110 (-18 in decimal, signed)
```

If you're confused, realise that the negation of `0110000` is `1010000` (flip the bits, then add 1).


In both cases, the lower half of the product (`1110`) is the **same**. This is because the difference caused by the negative MSB in the two's complement representation affects only the higher-order bits, which are outside the lower half of the product.

When multiplying two numbers where the sign of one is significant (like in two's complement), the alterations to the upper bits due to the sign are not reflected in the lower bits. This is why, in certain computational scenarios where only the lower half of the product is of interest, the circuitry can be simplified as it **doesn't need to differentiate** between signed and unsigned numbers.

{: .note-title}
> Design Note
> 
> Combinational multipliers implemented as described above are pretty slow!  There are many design tricks we can use to speed things up – see the appendix on “Computer Arithmetic” in any of the editions of **Computer Architecture: A Quantitative Approach** by John Hennessy and David Patterson (Morgan Kauffmann publishers).

### Implementation tips 


### Test 

As usual, **please test your multiplier** circuit properly before proceeding. Think of useful test cases, such as multiplication by `0`, multiplication by `-1`, and multiplication by two positive numbers. 

Connect the output of your multiplier to the output of your alu for now:

```cpp 
// alu.luc body

  alu.out = multiplier.mul;
```



## Task 2: Assembling the ALU

Combine the outputs of the finished **adder**, **multiplier**, **compare**, **boolean** and **shift** units to produce a single `ALU` output: `ALU[31:0]`.  The simplest approach is to use a 4-way 32-bit multiplexer as shown in the schematic below:

<img src="{{ site.baseurl }}/assets/contentimage/lab3-fpga/2024-50002-ALU.drawio.png"  class="center_fifty"/>

> You can utilise `mux_4.luc` you've created before if you've followed Part 1 handout closely. 

**Two** control signals (`ALUFN[5:4]`) that we have never used before in the individual module have now been utilised to **select which unit** will supply the value for the ALU output.  The encodings for `ALUFN[5:0]` should follow this table that you've seen in the beginning of this handout: 

<img src="/50002/assets/contentimage/lab3/21.png"  class="center_thirty"/>

Note that the `Z`, `V`, and `N` signals from the adder/subtractor unit are <span style="color:red; font-weight: bold;">included</span> in the terminal list for the alu subcircuit (they're counted as ALU’s output). Please connect these terminals properly in your `alu.luc` file. 

### Test 

Be sure to test your ALU **comprehensively**. Here's some suggestions (you're not limited to these, think of more!):

1. ADD (0x00)
   - **Zero Addition**: `A + 0` and `0 + A` to ensure correct handling of zero.
   - **Positive Numbers**: Add two positive numbers.
   - **Boundary Values**: Add the maximum positive number to itself and ensure correct handling of overflow.
   - Check for **overflow** by adding two very big positive numbers 
2. SUB (0x01)
   - **Zero Subtraction**: `A - 0` and `0 - A` to test for correct subtraction with zero.
   - **Underflow**: Subtract a larger number from a smaller one to test for underflow.
   - **Boundary Values**: Subtract the maximum positive number from zero and check for correct negative result in two's complement.
3. MUL (0x02)
   - **Zero Multiplication**: Multiply by 0 to ensure the result is 0.
   - **Multiplication by One**: `A * 1` should yield `A`.
   - **Positive Numbers**: Multiply two positive numbers and check for correct results.
   - **Overflow**: Multiply two numbers that will cause overflow and ensure it is handled correctly.
4. AND (0x18)
   - **All Zeros and Ones**: `A AND 0` should be 0, `A AND 0xFFFF` (assuming 16-bit operands) should be `A`.
   - **Identity Check**: `A AND A` should give `A`.
   - **Complement Check**: `A AND NOT A` should give 0.
5. OR (0x1E)
   - **All Zeros and Ones**: `A OR 0` should be `A`, `A OR 0xFFFF` should be 0xFFFF.
   - **Identity Check**: `A OR A` should give `A`.
6. XOR (0x16)
   - **Identity Check**: `A XOR 0` should give `A`, `A XOR A` should give 0.
   - **Complement Check**: `A XOR NOT A` should give 0xFFFF.
7. "A" (LDR) (0x1A)
   - **Load Function**: Ensure that inputting `A` gives `A`, and does not modify it.
8. SHL (0x20)
   - **Zero Shift**: Shifting `A` by 0 should yield `A`.
   - **Maximum Shift**: Shifting a number by the width of the data bus minus one.
   - **Boundary Cases**: Shift a number with a 1 in the MSB and ensure it is handled correctly.
9. SHR (0x21)
   - **Zero Shift**: Shifting `A` by 0 should yield `A`.
   - **Maximum Shift**: Shifting a number by the width of the data bus minus one.
   - **Logical Shift**: Ensure that the vacated bits are filled with 0.
10. SRA (0x23)
    - **Arithmetic Right Shift**: Ensure the sign bit is replicated to preserve the sign of the number.
11. CMPEQ (0x33)
    - **Equality**: Test with equal values to ensure the result is true.
    - **Inequality**: Test with different values to ensure the result is false.
12. CMPLT (0x35)
    - **Less Than**: Test where `A` is less than `B`.
    - **Greater Than or Equal**: Test where `A` is greater than or equal to `B` to ensure the result is false.
13. CMPLE (0x37)
    - **Less Than or Equal**: Test where `A` is less than or equal to `B`.
    - **Greater Than**: Test where `A` is greater than `B` to ensure the result is false.

## Summary 

Congratulations 🎉🎉! You have successfully built a 32-bit ALU in this lab and familiarse yourself with programming FPGA with Lucid. You will be required to **utilise it** in Lab 4 (Beta CPU), so **please keep a copy of your answer**. 

For your 1D project, you will need to downsize the ALU to support 16-bit instead of 32-bit. It shouldn't be too much work to modify. You might also want to consider creating **automatic tester** using the `fsm` module for your 1D Project Checkoff 1: ALU. Read the FPGA tutorials linked in our course handout for further information, and don't forget to polish your knowledge on Sequential Logic before proceeding. 

Please also **read Checkoff 1: ALU** requirements and rubrics given in the course handout **carefully**. 

{: .highlight}
When you're done with the implementation of your ALU, head to eDimension to complete this week's lab quiz. 
