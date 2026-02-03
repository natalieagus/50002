---
layout: default
permalink: /lab/lab5-verilog
title: Lab 5 - ALU
description: Lab 5 handout covering topics from Beta ISA
nav_order:  5
grand_parent: Labs
parent: Verilog
---

* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design
<br>

# (Verilog) Lab 5: Arithmetic Logic Unit
{: .no_toc}



This is a Verilog parallel of the Lucid + Alchitry Labs Lab 5. It is not part of the syllabus, and it is written for interested students only. You still need to complete all necessary checkoffs in Lucid, as stated in the original lab handout.

{:.important}
If you are reading this document, we assume that you have already read Lab 4 Lucid version, as some generic details are not repeated. This lab has the same objectives and related class materials so we will not paste them again here. For submission criteria, refer to [the original lab 5]({{ site.baseurl }}/lab/lab5) handout.


## ALU 
The ALU can perform the following 13 arithmetic operations based on `ALUFN` signal given as an input:

<img src="/50002/assets/contentimage/lab3/21.png"  class="center_thirty"/>


We shall implement the ALU using basic boolean operations only, and not take shortcuts like using `+/-` to implement adder/subtactor unit for the sake of learning.


## Task 1: Adder Unit 

Implement an **adder/subtractor** unit that can add or subtract 32-bit two’s complement (**SIGNED**) inputs (`A[31:0]`, `B[31:0]`). It should generate a 35-bit output: (`S[31:0]`) **and**`Z`, `V`, `N` signals.  `A[31:0]` and `B[31:0]` are the 32-bit two’s complement (SIGNED) **input** operands and `S[31:0]` is the 32-bit signed **output**. `Z/V/N` are the three **other output** code bits described below: 
* `Z` which is true when the S outputs are all zero (i.e., `NOR(S) == 1 ? Z = 1 : Z = 0`)
* `V` which is true when the addition operation overflows (i.e., the result is too large to be represented in 32 bits), and 
* `N` which is true when the S is negative (i.e., `S31 == 1 ? N = 1 : N = 0`). 

`Z, V, N` will later be used by the **comparator** unit (read next section). The following diagram illustrates a suggested implementation of the 32-bit Adder/Subtractor Unit using a Ripple Carry Adder (RCA):

<img src="{{ site.baseurl }}/assets/contentimage/lab3-fpga/2024-50002-COMPACT-ADDER.drawio.png"  class="center_seventy"/>

The `ALUFN0` input signal controls whether the operation is an `ADD` or `SUBTRACT`.  `ALUFN0` will be set to `0` for an `ADD (S = A + B)` and `1` for a `SUBTRACT (S = A – B)`. To perform a `SUBTRACT`, the circuit first computes the two’s complement of the `B` operand before adding the resulting value with `A`. The two's complement of `B` is computed using the XOR gate and `ALUFN0` as carry in to the first Full Adder in the RCA. 

### The Ripple Carry Adder 

{:.note}
A Ripple Carry Adder (RCA) is a simple binary adder that consists of multiple full adders (FA) connected in **series**. It is used to add **two** binary numbers. You have met this device in the previous lab.

A full adder (FA) schematic is as shown:

<img src="{{ site.baseurl }}/docs/Labs/images/cs-2025-1-bit-full-adder.drawio-2.png"  class="center_forty"/>


To build a 32-bit RCA, you can connect 32 of these in **series** to form a 32-bit ripple-carry-adder. Below is an example of 4-bit ripple-carry-adder from the previous lab for your reference:

<img src="{{ site.baseurl }}/docs/Labs/images/cs-2025-Copy of 4-bit-rca.drawio.png"  class="center_full"/>

If you haven't done it in the previous lab, you are encouraged to create the ripple carry adder as a **standalone** module that accepts the number of operands bits (e.g: `SIZE`) supported as the **PARAMETERS**. 

### Computing Overflow: `V`

{:.note-title}
> What is overflow?
> 
> Overflow happens when the number of bits required to represent the signed result exceeds the hardware's capability. There are two types of overflow: positive and negative.
>
> **Positive** and **negative** overflow refer to specific types of integer overflow that occur when the result of an arithmetic operation exceeds the maximum or falls below the minimum value representable by a given number of bits for a signed integer type. This causes the value to **"wrap around"** to the opposite end of the range. 
>
> For example, consider a signed 4-bit adder. It can represent numbers from -8 to 7. If we let `a = 0111` (7) and `b = 0110` (6) and add them together, it should result in `s = 01101` (13). However, since the hardware only supports 4-bit, we only see the result as `s = 1101` (-3). This is a **positive overflow**: where addition of two *positive* numbers yield a negative result.
>
> Now, can you come up with an example of **negative overflow**? That is where addition of two *negative* numbers yield a positive result.

Notice that **overflow** can never occur when the two operands to the addition have **different** signs. If the two operands have the same sign, then overflow can be detected if the sign of the result differs from the **sign** of the operands. 

$$\begin{align*}
V = &A_{31} \cdot XB_{31} \cdot \overline{S_{31}} + \overline{A_{31}} \cdot \overline{XB_{31}} \cdot S_{31}
\end{align*}$$

Note that we use `XB`, **not** `B`, that's the output of the XOR gate (`B` XOR `ALUFN[0]`) shown in the adder schematic above.

{: .new-title}
> Computing Overflow `V`
> 
> Why is `V` computed like the above? Start by having a small example, let's say a 4-bit RCA. If we have `A: 0111`, and `B: 0001`, adding both values will result in a **positive overflow**. The true answer to this should be decimal `8`. With signed devices, we need **5** bits to represent decimal 8: `01000`. However since our RCA can only output 4-bits, we have our output as just `1000`, and this means decimal -8 in a **signed** 4-bit output. Now think about other possible overflow cases (negative overflow, etc).


### Detailed Adder/Subtractor Schematic
Here’s the detailed schematic of the adder to get you started:

<img src="{{ site.baseurl }}/assets/contentimage/lab3-fpga/2024-50002-ADDER.drawio.png"  class="center_full"/>

You may start by making a 1-bit **Full Adder** module first inside `fa.luc`, and **then** create a 32-bit RCA module in `rca.luc`. Afterwards, assemble everything inside `adder.luc`. 

### Implementation Tips 

{:.note}
This section contains a collection of Verilog syntax that might help you implement the adder/subtractor unit.

#### `for` loops in Verilog: procedural vs generate

In Verilog, there are **two different “for loops”** depending on what you’re trying to do:

1. **Generate `for` loop** (builds repeated hardware instances): Use this when you want to **instantiate many copies** of a module (like chaining full adders).
```verilog
genvar i;
generate
  for (i = 0; i < 32; i = i + 1) begin : FA_CHAIN
    fa u_fa (
      .a   (a[i]),
      .b   (b[i]),
      .cin (c[i]),
      .sum (sum[i]),
      .cout(c[i+1])
    );
  end
endgenerate
```
This `for` is **elaboration-time**. It “unrolls” into 32 physical `fa` instances.

2. **Procedural `for` loop** (runs inside `always` blocks): Use this for **combinational/sequential logic** (often for building buses, priority encoders, etc.). It does **not** create module instances.
```verilog
integer k;
always @* begin
  for (k = 0; k < 32; k = k + 1) begin
    y[k] = a[k] & b[k];
  end
end
```
This `for` loop is still hardware, but it describes **logic equations** (connections between instances), not instantiation.

{:.highlight}
If your goal is “duplicate `fa` units”, you want **generate-for + genvar**, not procedural `for`.

#### Reduction Operators (with examples)

Reduction operators combine all bits of a vector into **one bit**.

Example:

```verilog
wire [3:0] a = 4'b1010;

wire red_or  = |a;  // 1|0|1|0 = 1
wire red_and = &a;  // 1&0&1&0 = 0
wire red_xor = ^a;  // 1^0^1^0 = 0
```

Common uses:
* Detect “any 1” in a bus: `|bus`
* Detect “all 1” in a bus: `&bus`
* Parity: `^bus` (a 1-bit check that tells you whether a bit-vector has an **odd or even number of 1s**)

Parity is mainly for **simple error detection** (it catches any single-bit flip, but not all multi-bit errors).

#### Reuse your RCA (and add XOR + ZVN)

If you already built an RCA module, reuse it by:

* XOR-ing `b` with a control bit (for add/sub style patterns)
* Feeding the RCA’s `cin` appropriately (often same control bit)
* Adding Z/V/N flags logic

Example pattern:

```verilog
wire [31:0] b_xor = b ^ {32{sub}};   // replicate sub bit 32 times
wire        cin   = sub;

rca32 u_rca (.a(a), .b(b_xor), .cin(cin), .sum(sum), .cout(cout));
```

Then compute:

* **Z**: `z = ~(|sum);` (sum is all zeros)
* **N**: `n = sum[31];` (MSB)
* **V**: overflow logic depending on add/sub definition (typically from sign bits)


Yep, replication + generate/genvar are the two “non-beginner” syntax features here that are worth explicitly teaching. Here are the remarks I’d put in lab notes, focused purely on syntax/semantics.

#### Replication and concatenation are compile-time wiring

Example:

```verilog
b_x = b ^ {SIZE{alufn0}};
```

You would need to replicate `alufn0` `SIZE` times and you can do it with `{SIZE{alufn0}}`. This is not a runtime loop. It creates a vector of length `SIZE` by *repeating* a 1-bit signal.

{:.note}
Replication can replicate *any* packed expression, not just 1 bit: `{4{2'b10}}` becomes `8'b10101010`


#### `genvar` and `generate` are elaboration-time constructs

To implement the RCA, you probably use something like:
```verilog
genvar i;
generate
  for (i = 0; i < SIZE; i = i + 1) begin : fa_chain
    fa fa_inst (...);
  end
endgenerate
```

`genvar` is not a variable in simulation. It exists only during **elaboration** (the compiler “unrolls” hardware instances).

`i` cannot be read as a runtime value. You can’t do `if (i==3)` in procedural logic outside generate context.

The label `begin : fa_chain` creates a named generate block, which enables hierarchical names like:
  * `fa_chain[0].fa_inst`, `fa_chain[1].fa_inst`, etc. This is *gold* for wave debugging and force/probe in simulators.

`for-generate` requires `genvar` (or at least should, stylistically). A normal integer loop is for procedural blocks only (like `always_comb`).



### Test

Here's a simple testbench to test the functionality of the adder, given that you follow the interface as per the circuit drawing:

```verilog
`timescale 1ns/1ps

module tb_adder;

  parameter SIZE = 32;

  reg  [SIZE-1:0] a, b;
  reg             alufn0;
  wire [SIZE-1:0] s;
  wire            z, v, n;

  adder #( .SIZE(SIZE) ) u_adder (
    .a(a),
    .b(b),
    .alufn0(alufn0),
    .s(s),
    .z(z),
    .v(v),
    .n(n)
  );

  reg [99:0] TEST_CASES [0:7];
  integer i;

  task fail_s;
    input integer tc;
    input [SIZE-1:0] exp_s;
    begin
      $display("FAIL %0d: s exp=%h got=%h  (a=%h b=%h alufn0=%b)", tc, exp_s, s, a, b, alufn0);
      $finish;
    end
  endtask

  task fail_flag;
    input integer tc;
    input [8*1:1] which;   // tiny string like "z" / "v" / "n" in Verilog-ish form
    input exp;
    input got;
    begin
      $display("FAIL %0d: %0s exp=%b got=%b  (a=%h b=%h alufn0=%b s=%h)", tc, which, exp, got, a, b, alufn0, s);
      $finish;
    end
  endtask

  task check_case;
    input integer tc;
    input [SIZE-1:0] exp_s;
    input exp_z;
    input exp_v;
    input exp_n;
    begin
      if (s !== exp_s) fail_s(tc, exp_s);
      if (z !== exp_z) fail_flag(tc, "z", exp_z, z);
      if (v !== exp_v) fail_flag(tc, "v", exp_v, v);
      if (n !== exp_n) fail_flag(tc, "n", exp_n, n);
      $display("PASS test case: %0d", tc);
    end
  endtask

  initial begin
    a = 0; b = 0; alufn0 = 0;
    #1;

    TEST_CASES[0] = {32'd10,        32'd3,         1'b0, 32'd13,         1'b0, 1'b0, 1'b0};
    TEST_CASES[1] = {32'd5,         -32'sd5,       1'b0, 32'd0,          1'b1, 1'b0, 1'b0};
    TEST_CASES[2] = {32'd3,         -32'sd10,      1'b0, -32'sd7,        1'b0, 1'b0, 1'b1};
    TEST_CASES[3] = {32'h7fffffff,  32'd1,         1'b0, 32'h80000000,   1'b0, 1'b1, 1'b1};
    TEST_CASES[4] = {32'h80000000,  32'd1,         1'b1, 32'h7fffffff,   1'b0, 1'b1, 1'b0};
    TEST_CASES[5] = {32'd42,        32'd42,        1'b1, 32'd0,          1'b1, 1'b0, 1'b0};
    TEST_CASES[6] = {32'd5,         32'd8,         1'b1, -32'sd3,        1'b0, 1'b0, 1'b1};
    TEST_CASES[7] = {32'h80000000,  32'd1,         1'b0, 32'h80000001,   1'b0, 1'b0, 1'b1};

    for (i = 0; i < 8; i = i + 1) begin
      a      = TEST_CASES[i][99:68];
      b      = TEST_CASES[i][67:36];
      alufn0 = TEST_CASES[i][35];

      #1;

      check_case(i+1,
                 TEST_CASES[i][34:3],
                 TEST_CASES[i][2],
                 TEST_CASES[i][1],
                 TEST_CASES[i][0]);
    end

    $display("ALL PASS");
    $finish;
  end

endmodule

```
