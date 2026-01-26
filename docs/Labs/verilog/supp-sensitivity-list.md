---
layout: default
permalink: /lab/supp-2-verilog
title: Sensitivity List
description: A supplementary materials detailing sensitivity list in Verilog
nav_order:  20
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

# Sensitivity Lists in Verilog (Beyond `@*` and `@(posedge clk)`)
{: .no_toc}



In Verilog, an `always` block is executed whenever an event in its **sensitivity list** occurs. The sensitivity list determines when the procedural statements inside the block are re-evaluated. Selecting the correct sensitivity list is essential to ensure simulation matches intended hardware.

There are three broad categories commonly used in RTL:

1. **Combinational evaluation**: re-evaluate when any input changes
2. **Clocked evaluation**: re-evaluate on a clock edge (and optionally reset edge)
3. **Event-driven / mixed lists**: re-evaluate on specific signal transitions or changes (often for modeling asynchronous behavior or for testbenches)

This section enumerates the relevant `always` forms and illustrates what each means, with minimal testbenches.

All examples are Verilog-2005.



## `always @*` (Combinational, automatic sensitivity)


`always @*` re-executes the block whenever any signal read in the block changes. It is used to model combinational logic without manually listing signals. It reduces the risk of omitting a dependency.

Here's an example, and the corresponding testbench:
```verilog
module comb_star(
  input  wire a,
  input  wire b,
  input  wire c,
  output reg  y
);
  always @* begin
    y = (a & b) | c;
  end
endmodule
```


```verilog
`timescale 1ns/1ps
module tb_comb_star;

  reg a, b, c;
  wire y;

  comb_star dut(.a(a), .b(b), .c(c), .y(y));

  initial begin
    $dumpfile("tb_comb_star.vcd");
    $dumpvars(0, tb_comb_star);

    a=0; b=0; c=0;
    #2 a=1;
    #2 b=1;
    #2 c=1;
    #2 a=0;
    #5 $finish;
  end

endmodule
```

**Observed behavior**: `y` updates immediately (within the same timestep/delta) whenever any input changes.



##  `always @(a or b or c)` (Combinational, manual sensitivity)

This form re-executes only when listed signals change. It is logically equivalent to `@*` if (and only if) every RHS signal is included. Omitting a signal produces simulation that fails to update when it should.

Here's the correct example:
```verilog
module comb_manual_ok(
  input  wire a,
  input  wire b,
  input  wire c,
  output reg  y
);
  always @(a or b or c) begin
    y = (a & b) | c;
  end
endmodule
```

This is an incorrect example (omitted `c`):

```verilog
module comb_manual_bug(
  input  wire a,
  input  wire b,
  input  wire c,
  output reg  y
);
  always @(a or b) begin
    y = (a & b) | c; // c missing from sensitivity list
  end
endmodule
```

The testbench below compares the two versions (correct vs buggy):

```verilog
`timescale 1ns/1ps
module tb_comb_manual;

  reg a, b, c;
  wire y_ok, y_bug;

  comb_manual_ok  u_ok (.a(a), .b(b), .c(c), .y(y_ok));
  comb_manual_bug u_bug(.a(a), .b(b), .c(c), .y(y_bug));

  initial begin
    $dumpfile("tb_comb_manual.vcd");
    $dumpvars(0, tb_comb_manual);

    a=0; b=0; c=0;
    #2 c=1;        // y_ok updates, y_bug may not
    #2 a=1;        // both update (a is in list)
    #2 c=0;        // y_ok updates, y_bug may not
    #5 $finish;
  end

endmodule
```

You should observe:
* Expected combinational: output changes when `c` changes.
* Bug version: output may remain stale until `a` or `b` changes.



## `always @(posedge clk)` (Clocked sequential logic)

The statements under this block run only on rising edges of `clk`. Used to model synchronous flip-flops.


```verilog
always @(posedge clk) begin
  q <= d;
end
```

Between edges, the block does not execute; `q` holds for the example above.

## `always @(posedge clk or posedge rst)` (Clocked logic with asynchronous reset)

Statements here run on rising edges of `clk` and also on rising edges of `rst`. This models an asynchronous active-high reset.

Example and minimal testbench to verify the async reset behavior:
```verilog
always @(posedge clk or posedge rst) begin
  if (rst) q <= 1'b0;
  else     q <= d;
end
```

```verilog
`timescale 1ns/1ps
module tb_async_reset;

  reg clk, rst, d;
  reg q;

  initial begin clk = 0; forever #5 clk = ~clk; end

  always @(posedge clk or posedge rst) begin
    if (rst) q <= 1'b0;
    else     q <= d;
  end

  initial begin
    $dumpfile("tb_async_reset.vcd");
    $dumpvars(0, tb_async_reset);

    d=1; rst=0;
    #7 rst=1;   // assert reset not aligned to clock
    #4 rst=0;
    #20 $finish;
  end

endmodule
```

What you should expect:
* `q` resets immediately when `rst` rises, even mid-cycle.
* `q` updates from `d` only on clock edges.



## `always @(negedge clk)` (Negative-edge sequential logic)


Like the `posedge`, this runs only on falling edges of `clk`. Used when the design intentionally triggers on the falling edge.

```verilog
always @(negedge clk) q <= d;
```

The example above updates `q` at falling edges instead of rising edges.


## `always @(a)` (Level-sensitive re-evaluation on any change of a signal)

The statements under this block run when `a` changes value (either rising or falling). This is an event control on value change, not on edges only.

This is *occasionally* used in testbenches or simple event-driven logic. For RTL combinational logic, `@*` is normally preferred.


For example:
```verilog
module change_trigger(
  input  wire a,
  output reg  y
);
  always @(a) begin
    y = ~a;
  end
endmodule
```

This behaves like **combinational** for this trivial case because it depends only on `a`. If it depends on multiple signals, `@(a)` would be incomplete.


## `always @(posedge a)` / `always @(negedge a)` (Edge-triggered on a non-clock signal)

Similarly, they run only on a specific edge of an arbitrary signal. This can model asynchronous event detection (for example, capturing an external pulse). In synchronous RTL, it is usually avoided unless intentionally modeling an asynchronous domain.

This is an example of a pulse counter increment on event signal:

```verilog
module event_counter(
  input  wire rst,
  input  wire event_sig,
  output reg [3:0] cnt
);
  always @(posedge event_sig or posedge rst) begin
    if (rst) cnt <= 4'd0;
    else     cnt <= cnt + 4'd1;
  end
endmodule
```


{:.note}
This creates a flip-flop clocked by `event_sig`, which is a separate clock domain. This can be correct in some designs but is generally *not* what is wanted for synchronous FPGA datapaths. Generally, you want EVERY dff to be clocked by the same central clock so that they are **synchronous** with one another. Formally, this is called being *edge-aligned in one clock domain* (all state updates happen on the same clock edge).



## `always begin ... end` with no event control (Simulation-only infinite loop)

An `always` block without an event control never waits; it runs continuously, consuming simulation time only if delays are present. This is not synthesizable and is used for testbench stimulus such as clock generation.

For example, this is a block to generate a `clk` signal. You commonly see this in testbenches provided in the lab handout:
```verilog
always begin
  #5 clk = ~clk;
end
```

Synthesis tools reject `#` delays in RTL, but this pattern is standard in testbenches.


## Summary Table (Meaning of common `always` forms)

* `always @*`:
  Combinational logic; re-evaluate on any RHS change.

* `always @(a or b or c)`:
  Combinational logic; re-evaluate only when listed signals change. Easy to get wrong.

* `always @(posedge clk)`:
  Synchronous sequential logic on rising edges.

* `always @(posedge clk or posedge rst)`:
  Sequential logic with asynchronous active-high reset.

* `always @(negedge clk)`:
  Sequential logic on falling edges.

* `always @(a)`:
  Re-evaluate when a changes; incomplete for multi-signal combinational logic.

* `always @(posedge sig)`:
  Edge-triggered on arbitrary signal; implies separate clock domain.

* `always begin #... end`:
  Simulation loop; used in testbenches (not synthesizable).


