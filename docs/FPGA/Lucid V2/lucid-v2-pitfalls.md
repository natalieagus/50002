---
layout: default
permalink: /fpga/fpga_5_2024
title: LucidV2 Pitfalls
description: Common bugs and pitfalls
parent: Lucid V2
grand_parent: 1D&2D Project (FPGA)
nav_order:  5
---


* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design


# LucidV2 Pitfalls

This notes contain a collection of common pitfalls and bugs when programming in HDL.



## Setting Port Width using Parameter

{:.important}
When using parameters to define port sizes in Lucid/Verilog, it's best to explicitly **specify** the width in a way that ensures proper computation.

For example:

```verilog
    const COLUMN_DIMENSION = 16d16 // 16 bits, value of d16
    const ROW_DIMENSION = 16d16  // 16 bits, value of d16 
```

When using the constant above to create `dff` or other module port size, it will be computed properly:

```verilog
    const PIXEL_COUNT = COLUMN_DIMENSION *  ROW_DIMENSION   // 16 bit width, chosen from the max width of the operands
    dff led_encoding[PIXEL_COUNT](#INIT(1)) // PIXEL_COUNT is computed properly 
```

When used to instantiate a module, correct port size will be computed:



```verilog
// instantiation 
        
    index_reverser index_reverser(#COLUMN_DIMENSION(COLUMN_DIMENSION), #ROW_DIMENSION(ROW_DIMENSION)) // correct port is created
    
// module declaration, another file 
module index_reverser#(
    ROW_DIMENSION = 8 : ROW_DIMENSION > 1, 
    COLUMN_DIMENSION = 8 : COLUMN_DIMENSION > 1
) (
    input input_address[$clog2(ROW_DIMENSION * COLUMN_DIMENSION)], 
    output output_address[$clog2(ROW_DIMENSION * COLUMN_DIMENSION)], // port width is proper
) 
``` 

If you did <span class="orange-bold">not</span> specify the width, then Vivado will follow the size of the maximum of the operands. The following error might happen:

```verilog
    const COLUMN_DIMENSION = 16 // computed as 5 bits
    const ROW_DIMENSION = 16  // computed as 5 bits 

    const PIXEL_COUNT = COLUMN_DIMENSION *  ROW_DIMENSION   // computed as 5 bits, not enough to hold a value of 256 

    // using module 
    // since input_address port width is $clog2(ROW_DIMENSION * COLUMN_DIMENSION), 
    // and ROW_DIMENSION * COLUMN_DIMENSION is computed as 5 bits (following the max of the two operands),
    // input address port is wrongly computed to be just $clog2(5) = 3 bits wide 
    index_reverser index_reverser(#COLUMN_DIMENSION(COLUMN_DIMENSION), #COLUMN_DIMENSION(ROW_DIMENSION)) 
```

If you use the wrong number of bits during computation, it will cause problems as well, for instance:

```
    const COLUMN_DIMENSION = 5d16 
    const ROW_DIMENSION = 5d16 
    
    dff pixels[ROW_DIMENSION*COLUMN_DIMENSION] // only created 31-bit dff because the value 256 is too big to be represented in 5 bits 
```


Ensure that each const is wide enough: 
```
    const COLUMN_DIMENSION = 16d16 
    const ROW_DIMENSION = 16d16 
    
    dff pixels[ROW_DIMENSION*COLUMN_DIMENSION] // created 256 bit dff
```

## Instantiating modules in an array with parameters

Suppose we have the following module:

```verilog
module adder #(
    SIZE = 32 : SIZE > 1
)(
    input a[SIZE],
    input b[SIZE],
    output out[SIZE],
    output z,
    output v,
    output n
  )
```

If we want to instantiate an array of 8 adders, the parameter dimension must match:


{% raw %}

```verilog
    adder adder[8](#SIZE(8x{{16}}))
```


All modules in the array must have <span class="orange-bold">identically</span> sized ports. The following cannot be done:

```verilog
    adder adder[8](#SIZE({8d1, 8d2, 8d3, 8d4, 8d5, 8d6, 8d7, 8d8}))
```

The above will cause the first adder to have an output port `out[8]`, the second adder to have an output port `out[7]`, and so on (same with port `a` and `b`) which is **not allowed**. 

You also cannot instantiate a parameter array using constants as such:


```verilog
    const ADDER_SIZE = 16
    adder adder[8](#SIZE(8x{{ADDER_SIZE}}))
```

This is because the width of constants is flexible. We <span class="orange-bold">cannot</span> create an array in HDL with elements of varying size.  

To fix this, use the `$resize()` function:
{% endraw %}

<img src="{{ site.baseurl }}/docs/FPGA/Lucid V2/images/fpga_5_2024/2025-01-31-07-40-57.png"  class="center_seventy"/>

{% raw %}
```verilog
    const ADDER_SIZE = 16
    adder adder[8](#SIZE(8x{{$resize(ADDER_SIZE,16)}}))
```
{% endraw %}

{:.important}
The "16" does not refer to 16 bits, but to match the width of **const 16** (4 bits). It is automatically computed for you.


## Array Manipulation 

If you instantiate a module as such as an array:
```verilog
module adder #(
    SIZE = 32 : SIZE > 1
)(
    input a[SIZE],
    input b[SIZE],
    output out[SIZE],
    output z,
    output v,
    output n
  )
```

{% raw %}
```verilog
    const ADDER_SIZE = 16
    adder adder[8](#SIZE(8x{{$resize(ADDER_SIZE,16)}}))
```

The dimension of the ports changes too. For instance, this results in an error:

```verilog
    adder.a = 0
```

This is because the `.a` port is now expecting an 8 by 16 array. A correct way to set it is as such:


```verilog
    adder.a = 8x{{16b0}}
    adder.b = {16d0, 16d1, 16d2, 16d3, 16d4, 16d5, 16d6, 16d7}
```

You can also use array **concatenation** if that suits your use case:


```verilog
    adder_array.a = 8x{{16b0}}
    adder_array.b = c{ {16d3, 16d4, 16d5, 16d6, 16d7}, 3x{{16b0}} }
```
{% endraw %}




## Using $width on structs 

You **cannot** use the function `$width(expr, dim)` on structs. 

For instance, lets say we have an array of `COLORS` as shown: 

```verilog
    struct color { red[8], green[8], blue[8] }
    
    const COLORS = 
    {
        <color>(.red(250), .green(172), .blue(31)),
        <color>(.red(20), .green(172), .blue(255)),
        <color>(.red(10), .green(170), .blue(31)),
        <color>(.red(0), .green(0), .blue(255)),
        <color>(.red(80), .green(50), .blue(25)),
        <color>(.red(90), .green(250), .blue(31)),
        <color>(.red(100), .green(172), .blue(9)),
        <color>(.red(28), .green(172), .blue(31))
    }

```

The IDE will complain that you can't use it to compute the first dimension of `COLORS` in bits, which is 3 bits (8). The following code will fail: 

```verilog
  always{ 
    // other code 

    io_led[0] = $width(COLORS)
  }
```

Even if your constant is two dimensional:

```verilog
    const COLORS_2D = 
    {
        {
            <color>(.red(250), .green(172), .blue(31)),
            <color>(.red(20), .green(172), .blue(255)),
            <color>(.red(10), .green(170), .blue(31)),
            <color>(.red(0), .green(0), .blue(255))
        },
        {
            <color>(.red(80), .green(50), .blue(25)),
            <color>(.red(90), .green(250), .blue(31)),
            <color>(.red(100), .green(172), .blue(9)),
            <color>(.red(28), .green(172), .blue(31))
        }
    }
    
```

This code will still fail: 
```verilog
  always{ 
    // other code 
    io_led[0] = $width(COLORS, 0)
  }
```

$width only works for plain arrays: 

```
    enum States {
        S1,
        S2,
        S3,
        S4,
        S5
    }

    always {
        // other code
         io_led[1] = $width(States) // will show 3, as 3 bits is the minimum bits required to encode 5 different values
    }
```

## Using Division by Non-Powers of 2

Most hardware division uses restoring or non-restoring algorithms, or iterative subtraction, which take **multiple** clock cycles. This introduces sequential logic into your combinational logic devices like your integer-based ALU, instead of keeping it purely combinational. 

As a result, it can mess up your timing, increase your critical path delay, and make synthesis and debugging harder if you utilize this supposedly combinational module in an FSM. You will likely find that your project **works on simulation** but does not work on hardware. 

If you need to divide by a power of 2, use right shifts instead:
- `a >> n` is equivalent to $$\frac{a}{2^n}$$, and is synthesized efficiently with simple wiring logic.

In short: stick to shifts for division, unless you really know what you're doing and have the extra cycles (literally). Once you have done this, recompile the project and test. 

