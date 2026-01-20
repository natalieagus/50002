---
layout: default
permalink: /lab/lab3-verilog
title: Lab 3 - Clocked Circuits
description: Lab 3 handout covering topics from sequential logic
nav_order:  4
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

# (Verilog) Lab 3: Clocked Circuits
{: .no_toc}


This is a Verilog parallel of the Lucid + Alchitry Labs Lab 3. It is not part of the syllabus, and it is written for interested students only. You still need to complete all necessary checkoffs in Lucid, as stated in the original lab handout.

{:.important}
If you are reading this document, we assume that you have already read Lab 3 Lucid version, as some generic details are not repeated. This lab has the same objectives and related class materials so we will not paste them again here. For submission criteria, refer to [the original lab 3]({{ site.baseurl }}/lab/lab3) handout.


### Preface

Real systems <span class="orange-bold">need order in time</span>. They must perform one step, then the next, then the next, in a controlled and repeatable way so that ALL components progress **together** and remain **synchronized**. To achieve this, we introduce a **clock**. 

In this lab, we will use dffs to construct registers and create our first clocked circuits called the *pipelined* RCA. With this, we should begin to see our design not as a collection of gates, but as a machine that moves *forward* one step at a time, **on each clock edge**.

Although many signals may exist in parallel, **the system progresses in a sequence of moments**. A clock's function is to divide (continuous) time into uniform periods and creates **discrete** moments when a circuit is allowed to change its state.

{:.highlight}
*Each clock edge represents ONE new state* in the system, e.g: new set of input values fed to the system, new set of output values produced by the system, etc.


This way of thinking will form the basis of state machines in the next lab.

## `dff` in Verilog

As you've learned in lecture, a `dff` commonly has 3 ports: a data input that defines the next state (D), a timing control
input that tells the flip-flop exactly when to “memorize” the data input (CLK), and the output port (Q). Sometimes it has three extra ports:
1. `Reset` or `CLR` (input): it can cause the memory to be reset/cleared to `0` regardless of the other two inputs (D and CLK). This is also known as <span class="orange-bold">asynchronous reset</span>
3. `EN` (input): when high, `D` is captured at rising `CLK` edge, otherwise it retains its old value
2. `~Q` (output): simply the inverse of `Q`'s value

The diagram below shows the variation with reset (clear) and with enable + reset:

<img src="{{ site.baseurl }}/docs/Labs/images/cs-2026-50002-dff.drawio-2.png"  class="center_seventy"/>

The implementation in Verilog is straightforward:

```verilog
module dff(
    input D,
    input clk,
    input rst,
    output reg Q
    );
 
always @ (posedge clk or posedge rst)
begin
    if (rst == 1)
        Q <= 1'b0;
    else
        Q <= D;
end
 
endmodule
```

If you'd like an `en` signal, you may explicitly use a procedural variable to hold the `old_Q` and choose assignment:

```verilog
module dff_en(
    input  D,
    input  clk,
    input  rst,
    input  en,
    output reg Q
);

reg next_Q;

// combinational
always @* begin
    next_Q = Q;          // default: hold
    if (en) next_Q = D;  // if enabled: take D
end

// sequential
always @(posedge clk or posedge rst) begin
    if (rst) Q <= 1'b0;
    else     Q <= next_Q;
end

endmodule
```


However in practice, the following implementation is sufficient. 

```verilog
`timescale 1ns/1ps
module dff_en(
    input  D,
    input  clk,
    input  rst,
    input  en,
    output reg Q
);


 always @(posedge clk or posedge rst) begin
     if (rst)
         Q <= 1'b0;
     else if (en)
         Q <= D;
    // no need to write else Q <= Q here
 end
endmodule
```

There’s no need for `else Q <= Q;` because the `always @(posedge clk or posedge rst)` block is edge-triggered, so `Q` only changes on those edges. If `en` is low at a clock edge, no assignment happens and the flip-flop simply retains its previous `Q` value, with *no latch* involved.

### What it means by "no latch involved"

Recall in the earlier labs that static discpline must be obeyed in combinational blocks (`always @*`), otherwise we will *implied a latch* (memory).

{:.note-title}
> Recap
> 
> A **latch** is a *level-sensitive* 1-bit memory element we learned in the lectures (it was simplified an implemented as a mux whose output is connected to `D0` port). When its enable (select) is high, it is “transparent” and `Q` can follow `D` continuously. Conversely, when enable goes low, it “closes” and holds the last value. 

In Verilog, latches are most commonly inferred accidentally in **combinational** blocks (`always @*`) when you forget to assign an output on every possible path. The tool must then <span class="orange-bold">create memory</span> during synthesis to preserve the old value, and that memory is a **latch**.

#### Recap of accidental latch creation in combinational modules

**Accidental latch (violates the static discipline) recap:**

```verilog
reg Y;

always @* begin
    if (en)
        Y = D;
    // When en==0, Y is not assigned in this block.
    // To match "Y stays the same", hardware needs memory -> latch inferred during synthesis.
end
```


When a combinational block accidentally implies a latch, the hardware the tool infers is effectively this behavior:

* **Enable active (latch open, transparent):** the output can change immediately in response to input changes. So if `D` becomes invalid/unstable/wiggle while `en=1`, `Q` can become like that too.
* **Enable inactive (latch closed):** the output stops following the input and **holds** the last value it had right when the enable turned off.

That is why latches are considered risky in synchronous design: during the “open” time, any <span class="orange-bold">glitches</span> or small timing differences on the input can <span class="orange-bold">leak</span> through to the output, and you have to reason about how *long* the latch stays open (level timing), not just about a single clock edge.

{:.important}
> An inferred latch behaves like a “gate-controlled wire” when enabled, and like “memory” when disabled. In lecture, we highlighted why latches can be [problematic](https://natalieagus.github.io/50002/notes/sequentiallogic#problems) in synchronous digital systems: during the time the latch is enabled, the output can change whenever the input changes, which makes timing and glitches harder to control. 
>
> To **avoid** this, we design [edge-triggered flip-flops](https://natalieagus.github.io/50002/notes/sequentiallogic#the-beauty-of-dff) instead, so signals only update on a clock edge and remain stable between edges, giving more predictable and robust behavior.

Therefore a **latch SHOULD be avoided (static discipline obeyed)** in digital design:

```verilog
reg Y;

always @* begin
    Y = 1'b0;      // default assignment covers all cases
    if (en)
        Y = D;
end
```

#### Synthesis process
In Verilog, `reg` is just a *variable type* for simulation. The “flip-flop” is not a literal object in the source code. It is inferred by the synthesis tool from this pattern:

```verilog
always @(posedge clk or posedge rst) begin
  ...
end
```

An edge-triggered `always` block tells the synthesize the following: “*this signal must be stored across time and only update on clock edges,*”. Therefore, it builds a **D flip-flop** in hardware for `Q` (with an async reset if you include `or posedge rst`). 

When `en==0`, the tool typically implements that as a mux feeding the D input of the flip-flop (select `D` vs select old `Q`) as provided in the diagram above, or equivalent clock-enable circuitry. Either way, it is still a flip-flop, not a latch.


#### DFF is not a latch
Now compare how latch behaves with a D **flip-flop** (edge-triggered). As taught in lectures, a flip-flop only <span class="orange-bold">updates</span> at a clock **edge**, and it naturally *holds its value* <span class="orange-bold">between</span> edges (so this is unlike latch which is transparent and susceptible to noise *half the time*). 

{:.highlight}
Therefore, in a clocked block, omitting the `else` does **not** imply a latch; it results in a **D flip-flop** being inferred. When the condition is false at a clock edge, no new value is loaded and the flip-flop simply retains its previously stored value for that cycle.


**D flip-flop with enable (no latch involved):**

```verilog
reg Q;

always @(posedge clk or posedge rst) begin
    if (rst)
        Q <= 1'b0;
    else if (en)
        Q <= D;
    // else: no assignment on this edge -> Q holds its stored value in the flip-flop
end
```

{:.highlight}
> Missing assignments in `always @*` can force **latch** inference (because combinational logic cannot remember).
> Missing assignments in `always @(posedge clk ...)` do **not** infer a latch; the **flip-flop** already provides the memory and simply does not load a new value when `en==0`.

### Testbench

#### `dff` with reset
To test if our `dff` works as intended, we need a testbench that does the following:
1. Create a clock signal with fixed period
2. Vary `D` in between clock edges to observe the "capture" moments
3. Test for clear/reset asynchronously

```verilog
`timescale 1ns/1ps

module tb_dff;

  reg D;
  reg clk;
  reg rst;
  wire Q;

  // DUT
  dff dut (
    .D(D),
    .clk(clk),
    .rst(rst),
    .Q(Q)
  );

  // Clock: 10ns period
  initial begin
    clk = 1'b0;
    forever #5 clk = ~clk;
  end

  // Dump waveform (works in e.g., iverilog/gtkwave)
  initial begin
    $dumpfile("dff_tb.vcd");
    $dumpvars(0, tb_dff);
  end

  // Stimulus
  initial begin
    // init
    D   = 1'b0;
    rst = 1'b0;

    // async reset pulse (assert not aligned to clk)
    #2  rst = 1'b1;
    #7  rst = 1'b0;

    // Toggle D at different times to check that changes at Q is only reflected at posedge:
    // - sometimes between edges (should only take effect at next posedge)
    // - sometimes right near an edge (to see sampling behavior in sim)
    #3  D = 1'b1;     // between edges
    #6  D = 1'b0;     // between edges
    #4  D = 1'b1;     // near an edge depending on timeline
    #10 D = 1'b0;

    // assert reset while clock running (async)
    #1  rst = 1'b1;
    #6  rst = 1'b0;

    // more D activity
    #2  D = 1'b1;
    #12 D = 1'b0;

    #20 $finish;
  end

  // console trace on key events
  always @(posedge clk or posedge rst) begin
    $display("%0t  rst=%b clk=%b D=%b Q=%b", $time, rst, clk, D, Q);
  end

endmodule
```

The output of the testbench should be as follows:

<img src="{{ site.baseurl }}//docs/Labs/verilog/images/lab3/2026-01-20-13-06-34.png"  class="center_seventy no-invert"/>

The output waveform is as follows:

<img src="{{ site.baseurl }}//docs/Labs/verilog/images/lab3/2026-01-20-13-09-16.png"  class="center_full no-invert"/>

Things to observe:
1. `Q`'s value is synchronised with the rising clock edge
2. Changes in `D`  values in-between rising clock edges are ignored
3. Reset happens **asynchronously** and takes **precedence**. At around 33000 ps mark, `Q` changes to `0` immediately as soon as reset is `1`, regardless of the `clk`.

#### `dff` with reset and `en`

When you add an `en` to the `dff`, we have one more case to test: whether `Q` changes with `D` at rising clock edges if `en` is 0. Everything else remains the same.

The following testbench produces relevant waveforms:

```verilog
`timescale 1ns/1ps

module tb_dff_en;

  reg  clk;
  reg  D;
  reg  en;
  reg  rst;
  wire Q;

  // DUT
  dff_en dut (
    .D(D),
    .clk(clk),
    .rst(rst),
    .en(en),
    .Q(Q)
  );

  // ANSWER KEY, hardcoded
  reg expected_Q [0:13];

  initial begin
    expected_Q[0] = 1'b0; // rst = 1
    expected_Q[1] = 1'b1; // D = 1, en = 1, rst = 0
    expected_Q[2] = 1'b1; // D = 0, en = 0, rst = 0, maintain prev value
    expected_Q[3] = 1'b1; // D = 1, en = 1, rst = 0
    expected_Q[4] = 1'b1; // D = 0, en = 0, rst = 0, maintain prev value
    expected_Q[5] = 1'b0; // rst = 1
    expected_Q[6] = 1'b1; // D = 1, en = 1, rst = 0
    expected_Q[7] = 1'b1; // D toggles exactly at posedge but en 0, maintain prev value
    expected_Q[8] = 1'b0; // D = 0, en = 1, rst = 0
    expected_Q[9] = 1'b0; // D = 1, en = 0, rst = 0, maintain prev value
    expected_Q[10] = 1'b0; // rst = 1
    expected_Q[11] = 1'bx; // D toggles exactly at posedge and en is 1, so unexpected
    expected_Q[12] = 1'bx; // en = 0, so maintains prev value
    expected_Q[13] = 1'bx; // en = 0, so maintains previous value
  end
  
  // Clock: 10 ns period
  initial begin
    clk = 0;
    forever #5 clk = ~clk;
  end

  // Waveform
  initial begin
    $dumpfile("tb_dff_en.vcd");
    $dumpvars(0, tb_dff_en);
    $dumpvars(0, dut); // includes next_Q
  end


  // -------------------------------------------------
  // Checker: compare after each rising edge
  // -------------------------------------------------
  integer checker_index;
  initial checker_index = 0;

  always @(posedge clk) begin
    #1; // sample slightly after rising edge
    if (checker_index < 14) begin
      if (expected_Q[checker_index] !== 1'bx) begin
        if (Q !== expected_Q[checker_index]) begin
          $display(
            "FAIL at edge %0d : Q=%b expected=%b",
            checker_index, Q, expected_Q[checker_index]
          );
          $finish;
        end
      end
    end
    checker_index = checker_index + 1;
  end



  integer cycle;
  initial begin
    D   = 0;
    en  = 0;
    rst = 0;

    // Initial async reset
    #3 rst = 1;
    #4 rst = 0;

    for (cycle = 0; cycle < 10; cycle = cycle + 1) begin
      @(negedge clk);

      // Far before next posedge
      #1  D  = ~D;

      // Just before posedge
      #3  en = ~en;

      // Occassionally change D exactly at posedge time
      if (cycle == 5 || cycle == 8) begin
        // Exactly at posedge time
        #1  D  = ~D;
      end
      else #1
 
      // Just after posedge toggle only on some cycles
      if (cycle == 2 || cycle == 3 || cycle == 9) begin
      #1  D  = ~D;
      end
      else #1

      // Mid-cycle change, but only at some cycles
      if (cycle == 5)
        #2  en = ~en;

      // Occasionally assert async reset mid-cycle
      if (cycle == 3 || cycle == 7 || cycle == 9) begin
        #1 rst = 1;
        #5 rst = 0;
      end
    end

    #5;
    $display("PASS");
    $finish;
  end

endmodule

```

You should arrive at the following waveform:

<img src="{{ site.baseurl }}//docs/Labs/verilog/images/lab3/2026-01-20-14-21-39.png"  class="center_full no-invert"/>

Things to lookout for:
1. If `en` is 0, `Q` maintains its old value, but if `en` is `1`, then it behaves like a regular `dff`
2. `Q`'s changes is synchronised to the rising edge of the clock except when reset is `1`
3. At around 49000 ps, `Q` becomes `0` because reset is `1`, even though `en` is 0 and it's in-between rising clock edges

#### Using AI to produce testbenches for you

Writing a long testbench can be quite taxing, and repetitive. It is very tempting to just ask AI to spit out some for you, and in fact, that is the right move especially with well known language like Verilog. However, it is <span class="orange-bold">very</span> important that you are **specific** when prompting AI to generate a testbench for you.

You need to define all edge cases as much as possible, and also forces it to provide an **answer** key. 

A complete prompt like the following should be good enough:

> *Write a plain 2005 Verilog testbench for a D flip-flop with asynchronous active-high reset and enable. The testbench should run for many clock cycles and continuously exercise the design rather than using a few hand-picked cases. The clock period is 10 ns. Across the run, the input D must change at different times relative to each rising clock edge: well before the edge, just before the edge, exactly at the same simulation time as the edge, and after the edge, so the waveform clearly shows how sampling works and that changes at the edge itself are undefined. The enable signal should toggle between 0 and 1 multiple times; when enable is 1 and reset is 0, Q should follow D at rising edges, and when enable is 0 and reset is 0, Q should hold its previous value even though D continues to change. The reset signal must be asserted asynchronously at times not aligned with the clock and must override everything else: whenever reset is 1, Q must immediately go to 0 regardless of enable or D. The testbench must include a simple reference model updated on posedge clk or posedge reset that acts as an answer key for defined behavior, and the reference values should be visible in the waveform for comparison rather than used for strict pass-fail checking. The testbench should dump a VCD waveform.*

## Creating a Pipeline
A **pipeline** means **splitting** a computation into multiple **stages** separated by **registers**, so different inputs can be processed at the same time, <span class="orange-bold">one stage per clock cycle</span>. Each clock edge, the stage registers capture intermediate results and pass them to the next stage, which increases throughput (more results per second) even if the total latency per item becomes multiple cycles.

### Simple Registered Adder
To demonstrate this pipeline concept, we will create a pipelined `rca` (created from the previous lab) so that data can be fed to it in a **time-ordered sequence**.

<img src="{{ site.baseurl }}/docs/Labs/images/cs-2026-50002-Page-12.drawio.png"  class="center_seventy"/>

{:.note-title}
> Recall: Register
> 
> In digital design, a **register** is a storage element built from **flip-flops**.
>
> * A **1-bit register** is essentially **one D flip-flop** (stores 1 bit).
> * An **N-bit register** is **N flip-flops in parallel** sharing the same clock (stores an N-bit value, like 32 bits).
>
> Registers are used to hold state: CPU registers, pipeline registers, FSM state registers, counters, etc. They update on clock edges (often with optional reset and enable) and stay stable between edges.

```verilog
// Pipelined Ripple-Carry Adder
// Registers: a_reg, b_reg, s_reg 
// Latency: 2 cycles (inputs registered on cycle N, sum registered on cycle N+1)
module pipelined_rca #(
    parameter SIZE = 8
)(
    input                  clk,
    input                  rst,     // async active-high reset
    input                  en,      // pipeline enable (stalls all regs when 0)
    input  [SIZE-1:0]      a,
    input  [SIZE-1:0]      b,
    input                  ci,
    output [SIZE-1:0]      s,
    output                 co       // optional
);

    // Stage 0 registers (registered inputs)
    wire [SIZE-1:0] a_q;
    wire [SIZE-1:0] b_q;

    genvar i;

    generate
        for (i = 0; i < SIZE; i = i + 1) begin : in_regs
            dff_en u_a_reg (.D(a[i]), .clk(clk), .rst(rst), .en(en), .Q(a_q[i]));
            dff_en u_b_reg (.D(b[i]), .clk(clk), .rst(rst), .en(en), .Q(b_q[i]));
        end
    endgenerate

    // Combinational adder between stages
    wire [SIZE-1:0] sum_comb;
    wire            co_comb;

    rca #(.SIZE(SIZE)) u_rca (
        .a(a_q),
        .b(b_q),
        .ci(ci),
        .s(sum_comb),
        .co(co_comb)
    );

    // Stage 1 registers (registered sum)
    wire [SIZE-1:0] s_q;
    wire co_q;

    generate
        for (i = 0; i < SIZE; i = i + 1) begin : out_regs
            dff_en u_s_reg (.D(sum_comb[i]), .clk(clk), .rst(rst), .en(en), .Q(s_q[i]));
        end
    endgenerate

    dff_en u_co_reg (.D(co_comb), .clk(clk), .rst(rst), .en(en), .Q(co_q));

    assign s  = s_q;
    assign co = co_q;  // not registered (no co reg requested)

endmodule
```

{:.note}
Note how we never use `instance.output_port` here and always use intermediary `wire` instead.


### Testbench


