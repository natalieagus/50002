---
layout: default
permalink: /fpga/detect-clock-edge
title: Can We Detect Clock Edge?
description: Pitfall in using edge detector with clock as input
parent: Lucid V2
grand_parent: 1D&2D Project (FPGA)
nav_order: 10
---

* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design

## You Cannot Detect a Clock Edge with Another Clock

### The Problem

Suppose you have two clocks from the same MMCM at 0-degree phase: `clk100` (100 MHz) and `clk25` (25 MHz), both with 50% duty cycle. A natural instinct is to detect the rising or falling edge of `clk25` inside the `clk100` domain using the standard edge detector pattern:

```verilog
reg clk25_d;
always @(posedge clk100) begin
    clk25_d <= clk25;
end

wire clk25_rising  = clk25 & ~clk25_d;
wire clk25_falling = ~clk25 & clk25_d;
```

<span class="orange-bold">This does not work</span>.  It is structurally impossible to make this reliable.

### Why It Fails

When the Clocking Wizard (MMCM) generates multiple output clocks, all outputs are derived from the same PLL and launched from the same internal reference. With all outputs configured at 0-degree phase (the default in Vivado's Clocking Wizard), the edges of every output clock are aligned to the same reference instant.

For `clk100` (10 ns period) and `clk25` (40 ns period), the alignment looks like this:

| Time   | `clk100` | `clk25`  |
|--------|----------|----------|
| 0 ns   | posedge  | posedge  |
| 10 ns  | posedge  |          |
| 20 ns  | posedge  | negedge  |
| 30 ns  | posedge  |          |
| 40 ns  | posedge  | posedge  |

Every transition of `clk25` lands on a `posedge clk100`. Two out of every four `clk100` posedges *coincide* with a `clk25` transition, and *those are exactly the edges you care about detecting*. The flip-flop capturing `clk25_d <= clk25` is trying to sample a signal that is changing at that <span class="orange-bold">exact</span> nominal instant.

A flip-flop requires data to be stable for some time *before* the clock edge (setup time) and *after* the clock edge (hold time). Here, the MMCM launches both transitions from the same PLL at the same instant. After leaving the MMCM:

* `clk100` travels the **clock tree** (BUFG network) to the flip-flop's CLK pin
* `clk25` travels the **data routing fabric** to the flip-flop's D pin

These two paths have different, uncontrolled propagation delays. Depending on which signal arrives at the flip-flop first, you violate either setup or hold. The outcome can vary across builds, across different locations on the die, and even with temperature. The flip-flop may go metastable.

{:.important}
The phase relationship guarantees that every sample you actually want to detect is taken at a data transition. There is no stable sampling point.

## Fix Attempts
### Attempt 1: Fix with Phase Offset

Vivado's Clocking Wizard lets you set a phase offset (in degrees) on each output clock independently. For example, setting `clk25` to 180 degrees shifts all its edges by half of its own period (20 ns), so that `clk25` transitions now land on `clk100` *negedges* instead of posedges. This would give you 5 ns of margin when sampling `clk25` on `posedge clk100`.

This works to a limited extent, but has practical drawbacks:

* The correctness of your entire shared RAM design depends on a single IP configuration field buried in the Clocking Wizard GUI. Anyone regenerating or reconfiguring the IP can silently break the design.
* If you change frequencies later (say, moving to `clk50` instead of `clk100`), you need to recalculate and update the phase offset to **maintain** the correct relationship.
* The phase offset is specified in degrees of the *output clock's own period*, not in nanoseconds. 180 degrees on a 25 MHz output means 20 ns of shift, but 180 degrees on a 50 MHz output means 10 ns. This can be confusing when multiple outputs are involved.

### Attempt 2: Fix with a Counter Running on the Fast Clock

Instead of trying to observe `clk25` as a data signal, generate the <span class="orange-bold">same</span> slot **information** entirely within the `clk100` domain. Just run a free-running counter on `clk100` and tap the appropriate bit:

```verilog
reg [1:0] counter;
always @(posedge clk100) begin
    if (rst)
        counter <= 2'b0;
    else
        counter <= counter + 1;
end
```

`counter` increments every `clk100` cycle: 0, 1, 2, 3, 0, 1, 2, 3, ...

Each bit of this counter is a **clock divider** like we learned in our labs:

| Bit | Frequency | Period | What it tells you |
|-----|-----------|--------|-------------------|
| `counter[0]` | 50 MHz | 20 ns | Which half of a 50 MHz cycle you are in |
| `counter[1]` | 25 MHz | 40 ns | Which half of a 25 MHz cycle you are in |

To know whether you are in the CPU slot or GPU slot, just look at `counter[1]`. It carries the same information as `clk25`: it alternates between 0 and 1 at 25 MHz. But unlike `clk25`, it is a **registered output in the `clk100` domain**. It transitions at `posedge clk100` with a small clk-to-q delay, and by the next `posedge clk100` it has been stable for nearly 10 ns. Sampling it is textbook single-clock-domain logic:

```verilog
// Mux select for shared RAM read port
assign ram_raddr = (counter[1] == 1'b1) ? cpu_addr : gpu_addr;

// GPU cache enable, one half-period delayed
always @(posedge clk100) begin
    en_gpu <= ~counter[1];
end
```

## Two signals carrying the same information

It is perfectly **fine** (and standard practice) to have both `clk25` from the MMCM and `counter[1]` from fabric in the <span class="orange-bold">same</span> design. They represent the same information but serve different physical roles:

| Signal       | Source      | Travels on           | Used as   | Drives                                        |
|--------------|-------------|----------------------|-----------|-----------------------------------------------|
| `clk25`      | MMCM output | Clock tree (BUFG)    | **Clock** | VGA driver, CPU PC, regfile CLK pins          |
| `counter[1]` | `clk100` FF | Data routing fabric  | **Data**  | Mux select, `en_gpu`, any `clk100` control logic |

`clk25` should **only** be used as a clock (connected to CLK pins of flip-flops). `counter[1]` should **only** be used as data (connected to D pins, LUT inputs, mux selects). 

{:.important}
You should NEVER use `counter[1]` as `clk` input port for other modules in your design. Use proper `clk25` for that.


## Startup Alignment: `counter[1]` vs `clk25`

### Background

After `reset`, two signals in the design both toggle at 25 MHz:

- **`counter[1]`** is derived from `clk100` by counting. For example, it can control which device owns a shared RAM read port: `1` = CPU slot, `0` = GPU slot.
- **`clk25`** comes out of the MMCM (the clock wizard). It drives the VGA pixel logic and the CPU pipeline.

Both toggle at the **same** rate, but you might wonder if after reset, they might start with **opposite polarity**. Is there any guarantee that `counter[1]` goes high at the same moment `clk25` goes high?

### Matching Polarity by Design (Phase) at Startup

Since `clk100` and `clk25` both come from the same MMCM at 0 degrees of phase, `clk25` completes exactly **one** full cycle every 4 `clk100` posedges. `counter[1]` also completes one full cycle every 4 `clk100` posedges. Both are **locked** to the same clock source, so their relationship is fixed and deterministic.

There will be a **one clk100 cycle offset** though, because the counter is a *register*, but this shouldn't matter much and the 1-100Mhz cycle latency is expected:

```
clk100 posedge:  1     2     3     4     5     6     7     8
counter:         01    10    11    00    01    10    11    00
counter[1]:       0     1     1     0     0     1     1     0
clk25:            1     1     0     0     1     1     0     0
```

{:.note}
`counter[1]` is `clk25` delayed by one `clk100` cycle. This offset is always the same, never varies between power cycles, because the MMCM enforces the phase relationship and the counter always starts at 0.

So if you use `counter == 2'b00` to detect "clk25 just fell," you are actually detecting it 10ns after the actual falling edge. Whether that 10ns matters depends on your design. But the key point is: it is a **fixed, predictable delay**, not a random polarity mismatch. every 4 clk100 posedges. `counter[1]` also completes one full cycle every 4 clk100 posedges. Both are locked to the same clock source, so their relationship is fixed and deterministic.

There will be a **one clk100 cycle offset** though, because the counter is a register:

```
clk100 posedge:  1     2     3     4     5     6     7     8
counter:         01    10    11    00    01    10    11    00
counter[1]:       0     1     1     0     0     1     1     0
clk25:            1     1     0     0     1     1     0     0
```

`counter[1]` is `clk25` delayed by one clk100 cycle. This offset is always the same, never varies between power cycles, because the MMCM enforces the phase relationship and the counter always starts at 0.

So if you use `counter == 2'b00` to detect "clk25 just fell," you are actually detecting it 10ns after the actual falling edge. Whether that 10ns matters depends on your design. But the key point is: it is a **fixed, predictable delay**, not a random polarity mismatch.

### Do not reset the counter

The counter always increments by 1 on every `clk100` posedge. But the issue is: when `reset` releases, the counter goes to `00`, while `clk25` is at some arbitrary point in its cycle because the MMCM <span class="orange-bold">never</span> stopped.

These are the two cases: 

**Reset releases when `clk25` happens to be falling:**

| clk100 posedge | counter | counter[1] | clk25 | match? |
|---|---|---|---|---|
| reset releases | 00 | 0 | falls to 0 | yes |
| +1 | 01 | 0 | 0 | yes |
| +2 | 10 | 1 | rises to 1 | yes |
| +3 | 11 | 1 | 1 | yes |

**Reset releases when `clk25` happens to be rising:**

| clk100 posedge | counter | counter[1] | clk25 | match? |
|---|---|---|---|---|
| reset releases | 00 | 0 | rises to 1 | **no** |
| +1 | 01 | 0 | 1 | **no** |
| +2 | 10 | 1 | falls to 0 | **no** |
| +3 | 11 | 1 | 0 | **no** |

The counter always counts correctly. But `clk25` did *not* reset with it because the MMCM kept running. So depending on when your `reset` happens to release, you get same polarity or opposite polarity.

{:.important}
At initial power-on it works (same polarity) because both start together. A mid-operation `reset` only resets the counter, not the MMCM. Due to this, never `reset` your reference `clk25` counter.



