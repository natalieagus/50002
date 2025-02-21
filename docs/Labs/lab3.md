---
layout: default
permalink: /lab/lab3
title: Lab 3 - Arithmetic Logic Unit with FPGA 
description: Lab 3 handout covering topics from Logic Synthesis, and Designing an Instruction Set
parent: Labs
nav_order:  4
---

* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design
<br>

# Lab 3: Arithmetic Logic Unit
{: .no_toc}

## Starter Code
Please clone the starter code from this repository, then **open** it with Alchitry Lab V2. 

```
git clone https://github.com/natalieagus/50002-lab3-alu.git
```

{: .important}
You will complete 1D Checkoff 1 by completing this Lab 3. Lab 3 spans two weeks: this week and the next. Do not forget to do the regular lab questionnaire **individually** as well.


## Related Class Materials
The lecture notes on [Logic Synthesis](https://natalieagus.github.io/50002/notes/logicsynthesis) and [Designing an Instruction Set](https://natalieagus.github.io/50002/notes/instructionset) are closely related to this lab. 

Design 5 combinational ALU components: adder/subtractor, compare, boolean, shifter, and multiplier
<br>Related sections in the notes: **[Logic Synthesis](https://natalieagus.github.io/50002/notes/logicsynthesis)**	
* [N-input gates](https://natalieagus.github.io/50002/notes/logicsynthesis#n-input-gates) (all kinds of gates to produce the logic of each component in the ALU)
* [Special combinational logic devices](https://natalieagus.github.io/50002/notes/logicsynthesis#special-combinational-logic-devices) (multiplexer with 1 or 2 selectors, and combining multiplexers together to form an even bigger one)
* [Basics of programmable control systems](https://natalieagus.github.io/50002/notes/instructionset#an-example-of-a-basic-programmable-control-system) (using control signals like ALUFN to **perform different operations (`ADD`, `SHIFT`, `MUL`, etc)** between two **32-bit** inputs A and B in the same ALU circuit -- no hardware modification needed). 


This lab will deepen your understanding of building circuits to achieve specific logic functions. For instance, an adder circuit performs binary addition on inputs A and B. You'll also make it **programmable** using the `ALUFN` control signal.

{: .warning}
You are <span style="color:red; font-weight: bold;">NOT</span> allowed to use **any** of Lucid's **math** and **comparison** operators when implementing this lab's ALU 13 functionalities. This is the requirement of your 1D project because we would like you to learn the basics and not solely rely on Vivado's capability on creating components of the ALU. Please follow the implementation of the units from the given schematics. **Failure to comply will result in -2% of your overall grades**. However, you can use them for array indexing or checking conditions in loops. 

## Introduction 

In this lab, we will build a 32-bit **arithmetic and logic unit (ALU)** for the Beta processor. You <span style="color:#ff791a; font-weight: bold;">will</span> need this for your 1D Project Checkoff 1 **and** Lab 4 (Building the Beta). 

{: .new-title}
> Arithmetic Logic Unit (ALU)
> 
> The ALU is a **combinational** logic device that has two **32-bit inputs** (which we will call “A” and “B”) and produces one **35-bit output**: `alu[31:0]`, `Z`, `V`, and `N`. 
> We will start by designing the ALU modularly. It is composed from five as a separate modules, each producing its own 32-bit output. 
> We will then combine these outputs into a single ALU result.

In this lab, we will attempt to create a 32-bit ALU. It is one of the components inside our Beta CPU. We will eventually utilise our work here to build an entire Beta CPU circuit in the next lab (Lab 4). 

The Arithmetic Logic Unit (ALU) serves as the central core of the CPU, handling a variety of logical computations. Essential operations that a standard ALU encompasses are:
* An **Addition/Subtraction** Unit, facilitating elementary addition and subtraction tasks.
* A **Comparison** Unit, utilized for branching functions.
* A **Boolean** Unit, dedicated to boolean operations such as XOR, bit masking, and similar tasks.
* A **Shifter** Unit, instrumental in operations like division or multiplication by 2, as well as segmenting data.
* A **Multiplier** Unit, specialized in performing multiplication. The design of this unit is more complicated than the rest of the units. 

{: .important-title}
> Important: <span style="color:red; font-weight: bold;">ALUFN</span> != <span style="color:red; font-weight: bold;">OPCODE</span>
> 
> 
> The `ALUFN` signal is **NOT** Beta CPU `OPCODE`, despite both being 6-bit long. These two encodings are **NOT** the same.
> The `ALUFN` is used to **control** the operation of the ALU circuitry, while the Beta CPU `OPCODE` is used by the Control Unit to **control** the entire Beta CPU datapath. In Lab 4, you will build a ROM as part of the Control Unit that will translate the `OPCODE` field of a currently executed instruction into the appropriate `ALUFN` control signal. 

The ALU can perform the following 13 arithmetic operations based on `ALUFN` signal given as an input:

<img src="/50002/assets/contentimage/lab3/21.png"  class="center_thirty"/>

## Task 1: Adder Unit 

You implemented a simple adder in lab 2 by using Lucid's arithmetic operator `+`. You are <span class="orange-bold">NOT allowed</span> to do that here and in your 1D project. You need to solely build the components of the ALU using logic units. 

Implement an **adder/subtractor** unit that can add or subtract 32-bit two’s complement (**SIGNED**) inputs (`A[31:0]`, `B[31:0]`). It should generate a 35-bit output: (`S[31:0]`) **and**`Z`, `V`, `N` signals.  `A[31:0]` and `B[31:0]` are the 32-bit two’s complement (SIGNED) **input** operands and `S[31:0]` is the 32-bit signed **output**. `Z/V/N` are the three **other output** code bits described below: 
* `Z` which is true when the S outputs are all zero (i.e., `NOR(S) == 1 ? Z = 1 : Z = 0`)
* `V` which is true when the addition operation overflows (i.e., the result is too large to be represented in 32 bits), and 
* `N` which is true when the S is negative (i.e., `S31 == 1 ? N = 1 : N = 0`). 

`Z, V, N` will later be used by the **comparator** unit (read next section). The following diagram illustrates a suggested implementation of the 32-bit Adder/Subtractor Unit using a Ripple Carry Adder (RCA):

<img src="{{ site.baseurl }}/assets/contentimage/lab3-fpga/2024-50002-COMPACT-ADDER.drawio.png"  class="center_seventy"/>

The `ALUFN0` input signal controls whether the operation is an `ADD` or `SUBTRACT`.  `ALUFN0` will be set to `0` for an `ADD (S = A + B)` and `1` for a `SUBTRACT (S = A – B)`. To perform a `SUBTRACT`, the circuit first computes the two’s complement of the `B` operand before adding the resulting value with `A`. The two's complement of `B` is computed using the XOR gate and `ALUFN0` as carry in to the first Full Adder in the RCA. 

### The Ripple Carry Adder 

{:.note}
A Ripple Carry Adder (RCA) is a simple binary adder that consists of multiple full adders (FA) connected in **series**. It is used to add **two** binary numbers.

A full adder (FA) schematic is as shown:

<img src="{{ site.baseurl }}/docs/Labs/images/cs-2025-1-bit-full-adder.drawio-2.png"  class="center_thirty"/>

{:.highlight}
As an exercise, derive the truth table of the FA above. 

You can then connect 32 of these in **series** to form a 32-bit ripple-carry-adder. Below is an example of 4-bit ripple-carry-adder for your reference:

<img src="{{ site.baseurl }}/docs/Labs/images/cs-2025-Copy of 4-bit-rca.drawio.png"  class="center_seventy"/>

You are encouraged to create the ripple carry adder as a standalone module that accepts the number of bits of addition supported as the **parameter**. 

### Computing Overflow: `V`
Note that **overflow** can never occur when the two operands to the addition have **different** signs. If the two operands have the same sign, then overflow can be detected if the sign of the result differs from the **sign** of the operands. Note that we use `XB`, **not** `B`.

$$\begin{align*}
V = &A_{31} \cdot XB_{31} \cdot \overline{S_{31}} + \overline{A_{31}} \cdot \overline{XB_{31}} \cdot S_{31}
\end{align*}$$

{: .new-title}
> Computing Overflow `V`
> 
> Why is `V` computed like the above? Start by having a small example, let's say a 4-bit RCA. If we have `A: 0111`, and `B: 0001`, adding both values will result in a **positive overflow**. The true answer to this should be decimal `8`. With signed devices, we need **5** bits to represent decimal 8: `01000`. However since our RCA can only output 4-bits, we have our output as just `1000`, and this means decimal -8 in a **signed** 4-bit output. Now think about other possible overflow cases (negative overflow, etc).


### Detailed Adder/Subtractor Schematic
Here’s the detailed schematic of the adder to get you started:

<img src="{{ site.baseurl }}/assets/contentimage/lab3-fpga/2024-50002-ADDER.drawio.png"  class="center_full"/>

You may start by making a 1-bit **Full Adder** module first, and **then** create a 32-bit RCA module. Afterwards, assemble everything inside `adder.luc`. 

### Implementation Tips 

{: .warning}
Remember that you are **NOT** allowed to use Lucid's math operator, such as `out = a+b` or `out = a-b` to implement the adder unit. Please follow the implementation of the schematic above. This is part of the requirements of your 1D project. You can however use these operators for **indexing**.

**`repeat` statement**: Recall that the syntax of the `repeat` statement is as follows:

```verilog
repeat(i, count, start = 0, step = 1) {
    statements
}
```

You can utilise `repeat` statement in Lucid V2 (the same applies for Verilog) to **duplicate** creation of multiple units of `fa`. For instance, if you have the following `fa` module interface:

<img src="{{ site.baseurl }}/assets/contentimage/lab3-fpga/2024-50002-FA.drawio.png"  class="center_fifty"/>

```cpp
// fa.luc 
module fa (
    input a,
    input b,
    input ci,
    output co,
    output s
  )(
    // implementation
    
  )
```



You can utilise it as follows to create a 32-bit Ripple Carry Adder module's body:

```cpp
// rca.luc
module rca (
    input a[32],
    input b[32],
    input ci,
    output s[32]
  ) {

  fa fa[32];

  always {

    fa.a = a
    fa.b = b
    fa.cin = 0;
    
    repeat(i, SIZE){
        if (i == 0){
            fa.cin[0] = cin
        }
        else{
            fa.cin[i] = fa.cout[i-1]
        }
    }
      
    s = fa.s; // connect the output bits
  }
}
```

{: .warning}
Remember that **repeat** statement in HDL (Hardware Design Language) like Lucid or Verilog does **NOT** perform the same way like the `for` loops we are familiar with in Python or Java. It's important to understand that in HDLs, repeat loops/statements are used to **describe hardware**, <span style="color:#ff791a; font-weight: bold;">not</span> to control flow as in software programming. They primarily for **generating repetitive hardware structures**.

**Reduction Operators**

In HDLs, **reduction** operators applies the logic across the bits of the input to produce a single bit output. For instance, given `a = 4b1010`:
* `|a` (reduction OR) is `1|0|1|0`, which is `1`
* `&a` (reduction AND) is `1&0&1&01` which is `0`
* `^a` (reduction XOR) is `1^0^1^0` which is `0`

### Test 

Once you have implemented `adder.luc`, instantiate and **connect** its input and output properly in `alu.luc` so that we can test our adder unit **manually**.

```cpp 
    // alu.luc body
    adder.a = a;
    adder.b = b;
    adder.alufn_signal = alufn_signal;

    z = adder.z;
    v = adder.v;
    n = adder.n;

    alu_output = adder.out; 
```

#### `alu_manual_tester`

We have instantiated `alu` in `alu_manual_tester` for testing. `alu_manual_tester` is just an IO wrapper connected to `alchitry_top` so that we can have a more **modular** structure. 

{:.note-title}
> Be organised 
> 
> You should <span class="orange-bold">not</span> implement *any* logic in `alchitry_top`, only I/O connections. 

Use `io_dip` and/or `io_button` to key in arbitrary values of `a`, `b` and `alufn`, then observe the output at `io_led` and/or `led`. Utilise the knowledge you got from lab 2 to thoroughly test your adder before proceeding. If in doubt, consult your instructors/TAs or post questions on edstem.

Tester design suggestion:
- Since `a` and `b` are 32-bit long and we only have 24 dip switches, you can create a **tester FSM** that allows us to store the first 16 bits of `a`, then last 16 bits of `a`, then first 16 bits of `b`, and finally the last 16 bits of `b`. 
- As for `alufn` signal, you can use `io_dip[2][5:0]`.

Think of **useful test cases**, such as addition of zeroes, addition of two negative numbers, test overflow, subtraction of -ve values, and so on. 

{: .important}
Please be careful with the switches, they're **delicate** and easy to break. Use the tip of a male jumper wire to flick them. 

### Why don't we just use the operators? 
We made it a requirement in your 1D project to **NOT** use Lucid (or Verilog) math and comparison operators when implementing any of the 13 functionalities of the ALU. You can technically implement a 32-bit adder unit in this manner and let Vivado do the work: 

```cpp
module adder (
    input a[32],
    input b[32],
    input alufn0,
    output s[32]
  ) {

  always {
    if (alufn0){
      s = a + b;
    }
    else{
      s = a - b;
    }
  }
}
```

However the above does <span class="orange-bold">not</span> allow you to learn anything new. Implementing components of the ALU from scratch has its own benefits as you're still learning. 

**Firstly**, it enables you to gain a deeper insight into the underlying hardware mechanisms that perform arithmetic operations, and offers a tangible perspective on how abstract mathematical concepts are translated into physical, operational circuits. 

This hands-on experience is invaluable for developing an appreciation of the intricacies and challenges associated with digital circuit design, including considerations of **timing**, **power consumption**, and **scalability**.

**Secondly**, it encourages problem-solving skills, requiring you to apply logic and reasoning to create efficient and functional circuits, along with the first few weeks of 50.002 materials. This process enhances your ability to design, troubleshoot, and optimize digital systems, skills that are crucial for both academic and professional success in the CS field.

**Finally**, it cultivates an **appreciation** for the evolution of digital design methodologies and the role of automation in modern engineering. You are *not* learning *how to rely* on Vivado but rather to figure out how it works under the hood.


## Task 2: Compare Unit
Implement a 32-bit compare unit that generate 1 bit output, depending on the following conditions: 
<img src="/50002/assets/contentimage/lab3/7.png"  class=" center_fifty"/>

The inputs to the compare unit are:
1. The `ALUFN` control signals (used to select the comparison to be performed), in particular: `ALUFN[2:1]`
2. The `Z`, `V`, and `N` bits. They're the output of the adder/subtractor unit. The adder **must** be in **subtraction** mode. 


*Why should the adder be in subtraction mode? *


### Performance
The `Z`, `V` and `N` inputs to this circuit can only be produced by the adder/subtractor unit. That means we need to first perform a 32-bit addition/subtraction between `a` and `b` before we can compare them. This means there's some significant **tpd** to produce the output of the compare unit as the RCA is considerably **slow**. 

In real life, you can speed things up considerably by thinking about the *relative* timing of `Z`, `V` and `N` and then designing your logic to minimize delay paths involving late-arriving signals. For instance, if you need to perform computations involving `Z` and other variables, you can compute those intermediary output involving the other variables first while "waiting" for `Z`. We do not need to worry much about it in this Lab as Vivado will do all sorts of optimisation for you. 

#### Detailed Compare Unit Schematic
Here’s the detailed schematic of the compare unit. Pay **close** attention to the bit selector and the corresponding inputs at the mux:

<img src="/50002/assets/contentimage/lab3-fpga/2024-50002-COMPARE.drawio.png"  class="center_fifty"/>

### Implementation Tips 
Since you are **not** allowed to use Lucid's math and comparison operators to implement this lab, it will be beneficial for you if you create a `mux_4` unit first: 

```cpp
// mux_4.luc
module mux_4 (
    input s0,  // selectors
    input s1,
    input in[4], // inputs 
    output out
  ) {

  always {
    case (c{s1, s0}){
      b00: out = in[0];
      b01: out = in[1];
      b10: out = in[2];
      b11: out = in[3];
      default:
        out = 0;
    }
  }
}
```

You can then utilise this inside `compare.luc` to implement the compare truth table above. 

### Test 

Since the alu **must** produce a 32-bit output, you should **set** the higher 31 bits to `0`, and set the LSB to the output of the **compare** unit. You can use **concatenation** for this.

```cpp
  // alu.luc body 
  alu_output = c{31x{b0}, compare.cmp}; // concatenation 
```

Your test cases **must be comprehensive**, and think of possible **edge** cases such as comparing two negative numbers together, or comparing zeroes. 

{: .important}
It is very important to test each of your modules **incrementally** before proceeding to the next section. Debugging HDL is <span style="color:#ff791a; font-weight: bold;">extremely difficult</span> (no straightforward and convenient `print` statements or debugger to "pause" execution), so we shall minimise propagation of errors by testing each small module carefully. 

## Task 3: Boolean Unit

Implement a **32-bit Boolean unit** that performs **bitwise** boolean operation between `a` and `b`. The unit should receive 32-bits of `a` and `b` as inputs, as well as 4-bit `ALUFN[3:0]` input, and **produce** a 32-bit output. In particular it should perform either `AND`, `OR`, `XOR`, or `A` bitwise boolean operations, depending on the `ALUFN` signals supplied: 

<img src="/50002/assets/contentimage/lab3/10.png"  class="center_twenty_five"/>

#### Detailed Boolean Unit Schematic
Here's the general schematic of the Boolean Unit:

<img src="{{ site.baseurl }}/assets/contentimage/lab3-fpga/2024-50002-BOOL.drawio.png"  class="center_fourty"/>

**Explanation**:

One possible implementation of a 32-bit boolean unit uses **32 copies of a 4-to-1 multiplexer** where `ALUFN0`, `ALUFN1`, `ALUFN2`, and `ALUFN3` **hardcode** the operation to be performed, and `Ai` and `Bi` are hooked to the multiplexer **`SELECT`** inputs.  This implementation can produce any of the 16 2-input Boolean functions; but we will only be using 4 of the possibilities: `AND`, `OR`, `XOR`, and `A`. 

In total, you should utilise 32 4-to-1 multiplexers to build the boolean unit. You can utilise the earlier created `mux_4.luc` module to implement this. 

### Implementation Tips 

You will need 32 copies of `ALUFN` signals as you will be plugging them into the input ports of each `mux_4`. To do this, you can use the **duplication** operator in lucid, for instance:

```cpp
// boolean.luc 
  // module declaration 

  // declaration of modules utilised in boolean unit 
  mux_4 mux_4_32[32];
{% raw %}
  always{
    // create 32 copies of ALUFN signal as input to each mux_4 unit 
    // the double curly brackets are intentional because
    // we are creating 2D array: 32 by 4 bits
    mux_4_32.in = 32x{{alufn_signal[3:0]}}; 
    // the rest of boolean.luc body 

  }
{% endraw %}
```


### Test 
Please test the `boolean.luc` module by making appropriate connections in `alu.luc` before proceeding.

```verilog
  // alu.luc body 
  alu_output = boolean.bool
```

Don't forget to think of **useful test cases** that test not only the functionality of each boolean operation, but also **edge cases** (e.g: `A` and `B` are all `0` or `1`).

## Task 4: Shifter
Implement a **32-bit shifter** unit that is able to perform a shift left (SHL), shift right (SRA), or shift right arithmetic (SRA) operation on `A`:
* The `A[31:0]` input supplies the data to be shifted  
* The **low-order** 5 bits of the `B[4:0]`  are used as the **shift count** (i.e., from 0 to 31 bits of shift)
* We do not use the high 27 bits of the `B` input (meaning that `B[31:5]` is **ignored** in this unit)

For example, if `A: 0x0000 00F0` and we would like to **shift** A to the left by FOUR bits, the `B` input should be `0x0000 0004` 

The desired operation will be encoded on `ALUFN[1:0]` as follows:

<img src="/50002/assets/contentimage/lab3/12.png"  class="center_fifty"/>

With this encoding, the **control** signal `ALUFN0` controls whether we are performing a **left shift** or a **right shift** (SHR). `ALUFN1` decides whether we apply the **sign extension** logic on **right shift**.   
* For `SHL` and `SHR`, `0`s are shifted into the vacated bit positions.  
* For `SRA` (“shift right arithmetic”), the vacated bit positions are all filled with `A31`, the sign bit of the original data so that the result will be the same as arithmetically dividing the original data by the appropriate power of 2.

#### Detailed Shifter Unit Schematic
The simplest implementation is to build **three** separate shifters: one for shifting **left**, one for shifting **right**, and one for shifting **right arithmetic**. 

<img src="{{ site.baseurl }}/assets/contentimage/lab3-fpga/2024-50002-SHIFTER.drawio.png"  class="center_full"/>

Notice how a **multi-bit shift** can be **accomplished** by **cascading** shifts by various powers of 2.  
* For example, a 13-bit shift can be implemented by a shift of 8, followed by a shift of 4, followed by a shift of 1. 
* Each shifter unit is just a cascade of multiplexers each controlled by one bit of the shift count.  

Afterwards, we can use a 4-way 32-bit multiplexer to select the appropriate answer as the unit’s output.  

{: .new-title}
> Alternative Approach: Compact Shifter
> 
> Another approach that **adds** latency but **saves** gates is to use the *left shift logic* for **both** left and right shifts, but for right shifts, **reverse** the bits of the `A` input first on the way in and **reverse** the bits of the output on the way out.
>
> Here's the schematic of this compact shifter.
>
> <img src="{{ site.baseurl }}/assets/contentimage/lab3-fpga/2024-50002-COMPACT-SHIFTER.drawio.png"  class="center_full"/>

### Implementation Tips 

You might want to create a `mux_2.luc` module here to help your implementation:

```cpp
module mux_2 (
    input s0,
    input in[2], // note: you can put input as an array, or declare them separately, e.g: input d0, input d1
    // it will affect how you utilise this mux
    output out
  ) {

  always {
    case (s0) {
      0: out = in[0];
      1: out = in[1];
      default:
        out = 0;
    }
  }
}
```

Then, you might want to implement `x_bit_left_shifter.luc` unit, where x is an arbitrary value. You can supply a `SHIFT` parameter to this module: 

```cpp
module x_bit_left_shifter #(
  // parameter declaration, to be set during module instantiation
  // default value given is 8
  SHIFT = 8 : SHIFT > -1 & SHIFT < 32
  )(
    input a[32],
    input shift,
    input pad,
    output out[32]
  ) {
  
  // module declarations
  // instantiate mux_2 (32 of them)
  // other useful intermediary signals, e.g: shifted_bits[32] 
  
  always {
    // assign value to shifted_bits[32] depending on the value of SHIFT
    // connect the selector of each mux_2 with shift 
    // 
    // use a repeat-loop to: 
    // connect input[0] of each mux_2 with a[i]
    // connect input[1] of each mux_2 with the shifted_bits[i] 
  }
}
```

#### Instance Parameters

If you want to create instances of N modules with the same parameter, you can use this format: 

```verilog
#PARAM_NAME(VALUE) {
    module_type my_module[N]
}
```
In the above example, all `N`  instances of module_type will have their parameter, `PARAM_NAME` set to `VALUE` (must be a constant).

If you want to assign **different** parameter to each instance, then you need to create an array of `N` by `M`, where `M` is the number of bits required to set `VALUE` for each instance. For example, we can instantiate 10 `my_module` with parameter of `8` bits each as follows:

```verilog
module_type my_module[10](#PARAM_NAME({8d0, 8d1, 8d2, 8d3, 8d4, 8d5, 8d6, 8d7}))
```

{:.warning}
This does <span class="orange-bold">not</span> apply to the dff. The `clk` `and` rst inputs are always 1 bit and the `INIT` parameter always applies to the FULL dff. If you do `dff storage[32](#INIT(32hABCDFFFF))` then it will store 32-bit value `0xABCDFFFF` in these 32 bits `dff`, where each `dff` holds 1 bit.



### Test 
Please test the `shifter.luc` module by making appropriate connections in `alu.luc` before proceeding. Be **mindful** when testing this unit, it should be as comprehensive as the tests you've done for the other 3 units above. 


```verilog
  // alu.luc body 
  alu_output = shifter.shift
```

## Task 5: Multiplier

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
10001111   (Sum of the above partial products)
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
> Why do we ignore the MSB of the operands?
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

> The negation of `0110000` is `1010000` (flip the bits, then add 1).

In both cases, the lower half of the product (`1110`) is the **same**. This is because the difference caused by the negative MSB in the two's complement representation affects only the higher-order bits, which are outside the lower half of the product.

When multiplying two numbers where the sign of one is significant (like in two's complement), the alterations to the upper bits due to the sign are not reflected in the lower bits. This is why, in certain computational scenarios where **only the lower half** of the product is of interest, the circuitry can be simplified as it **doesn't need to differentiate** between signed and unsigned numbers.

{: .note-title}
> Design Note
> 
> Combinational multipliers implemented as described above are pretty slow!  There are many design tricks we can use to speed things up – see the *appendix* on “Computer Arithmetic” in any of the editions of **Computer Architecture: A Quantitative Approach** by John Hennessy and David Patterson (Morgan Kauffmann publishers).


### Test 

As usual, **please test your multiplier** circuit properly before proceeding. Think of useful test cases, such as multiplication by `0`, multiplication by `-1`, and multiplication by two positive numbers. 

Connect the output of your multiplier to the output of your alu for now:

```cpp 
// alu.luc body
  alu.out = multiplier.mul;
```

### Failed Timing Warning 
This 32-bit combinational multiplier, as part of the ALU, may fail to meet the timing specifications for a 100 MHz clock in a sequential device. However this should still produce a working binary and <span class="orange-bold">does not</span> affect other parts of your ALU. It might even give the right output for the multiplier (small bit multiplications).

<img src="{{ site.baseurl }}//docs/Labs/images/lab3/2025-01-23-14-12-12.png"  class="center_seventy"/>

To address this, you can modify the constraint file to use a slower clock, such as 10 MHz.

<img src="{{ site.baseurl }}//docs/Labs/images/lab3/2025-01-23-13-55-19.png"  class="center_seventy"/>

{:.note}
As part of your 2D project: Optimisation part, you can consider using other multiplier designs that can pass the original 100MHz clk. 

## Task 6: Assembling the ALU

You are free to implement each module in whichever way you deem fit, or even come up with a new schematic as long as you don't use Lucid's math operators and compare operators to implement any of these 13 functionalities. You can however use them for indexing purposes or conditional loops. 

Finally, open `alu.luc` and assemble the outputs of the finished **adder**, **multiplier**, **compare**, **boolean** and **shift** units to produce 32-bit alu output `alu_output[31:0]` based on the input `ALUFN` signal. The simplest approach is to use a 4-way 32-bit multiplexer as shown in the schematic below:

<img src="{{ site.baseurl }}/assets/contentimage/lab3-fpga/2024-50002-ALU.drawio.png"  class="center_fifty"/>

{:.note}
You can use `mux_4` above, or use the `case` statement, or use plain `if-else` statements. 

**Two** control signals (`ALUFN[5:4]`) that we have never used before in the individual module have now been utilised to **select which unit** will supply the value for the ALU output.  The encodings for `ALUFN[5:0]` should follow this table that you've seen in the beginning of this handout: 

<img src="/50002/assets/contentimage/lab3/21.png"  class="center_thirty"/>

Note that the `Z`, `V`, and `N` signals from the adder/subtractor unit are <span style="color:red; font-weight: bold;">included</span> in the terminal list for the alu subcircuit (they're counted as ALU’s output). Please connect these terminals properly in your `alu.luc` file. 

### Test 

Ensure that you test your ALU **comprehensively** because you will be using it for your 1D project. You wouldn't want to discover some bugs down the road as your project grows larger. Here's some suggestions (you're not limited to these, think of more!):

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
   - **Overflow** (not compulsory, only if it's relevant to your project): Multiply two numbers that will cause overflow and ensure it is handled correctly.
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

Carefully **consult Checkoff 1: ALU** schedule, requirements and rubrics given in the course handout. <span class="orange-bold">Do not miss your checkoff slot</span>. 

### 1D Checkoff 1: ALU 
For your Checkoff 1: ALU, you're also required to create **additional** functionalities. You **are allowed** to use Lucid math and comparison operator for this **NEW** functionality. For example, if your new operation involves `DIVISION` between A and B, you're allowed to implement it as follows:

```cpp
// divide a by b
module divider (
    input a[32], // dividend
    input b[32], // divisor
    output d[32] // a/b
  ) {

  always {
    d = a/b;
  }
}

```

Only the original 13 functionalities must be implemented using logic gates as per the circuitry given in this lab handout. 

{: .highlight}
When you're done with the implementation of your ALU, head to eDimension to complete this lab quiz. 
