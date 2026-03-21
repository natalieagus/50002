---
layout: default
permalink: /fpga/custom-clock-pitfall
title: Custom Clock Pitfall 
description: How to set proper clock
parent: Lucid V2
grand_parent: 1D&2D Project (FPGA)
nav_order: 11
---


* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design


# Custom Clock Pitfall 
{: .no_toc}

{:.highlight-title}
> TL;DR
> 
> Always clock every component in your design using the **single** global 100 MHz FPGA clock or a proper clock generated via the [Clock Wizard]({{ site.baseurl }}/fpga/clocks) (PLL/MMCG). Use counter bits and frequency divider *outputs only as data signals* fed into edge detectors or **synchronous enables**, <span class="orange-bold">never as clock pins</span>.

If you are interested to know more, read along.

## Motivation

We often find ourselves <span class="orange-bold">needing to slow down</span> the clock to show visible effects. The default 100 MHz clock is too fast for human eyes to see. A common approach is to generate a slower clock by taking the output bit of a counter DFF driven by the 100 MHz clock:

```verilog
counter clk_divider(#SIZE(2), .clk(clk), .rst(rst))
// clk_divider.value[0] toggles at 50 MHz
// clk_divider.value[1] toggles at 25 MHz
```

This works fine *in simulation*. On hardware, the story is more <span class="orange-bold">complicated</span>.



## When this is applicable

For *simple*, low-stakes sequential logic such as blinking an LED or cycling through a display sequence once per second in a small game, using a counter bit as an actual clock pin is usually fine in practice:

```verilog
dff display_state(.clk(slow_clk), .rst(rst))
```

In [the lab]({{ site.baseurl }}/lab/lab3#frequency-divider), we also created a frequency divider using chains of DFFs:

```verilog
dff f_2(.clk(clk))
dff f_4(.clk(~f_2.q))
dff f_8(.clk(~f_4.q))
```

The DFFs in the chain have <span class="orange-bold">no data path relationship</span> with anything else. They just toggle. There is no setup/hold requirement to violate because no meaningful data is being captured. The chain exists purely to produce a toggling signal.

However, <span class="orange-bold">the output of this chain</span>, `f_8.q`, must only enter the rest of your design as a data signal fed into an **edge detector**, never as a clock pin to another module. The moment you write the following, you inherit these problems: fabric-routed clock, timing analyzer blind, skew relative to 100 MHz domain.

```verilog
some_module m(.clk(f_8.q), ...)  // WRONG
```

### Sometimes we get away with it

The reason that sometimes we get away with issues after synthesising it in hardware is that:
- The DFF affected is small and isolated. There is only one or a few registers involved.
- The fanout of the clock signal is tiny, so fabric routing delay is short and consistent enough.
- A glitch or metastability event in a single display DFF at worst causes a brief visual flicker. The system recovers on the next cycle.
- There are *no strict data relationships* between this DFF and the rest of the 100 MHz domain that the timing analyzer needs to verify.

So if you are displaying a bouncing character or counting seconds on a 7-segment, and you use `slow_clk` directly as a clock pin, it will very likely just work and nobody gets hurt. However, this is simply because we are lucky.

## When It Breaks: Large BRAMs

{:.warning}
The situation changes completely when you **clock** a large Block RAM (BRAM) with a counter-derived signal.

```verilog
simple_ram simple_ram(#SIZE(8192), .clk(clk_divider.value)); // problem
simple_ram simple_ram(#SIZE(8192), .clk(counter.q[2])); // problem
```

In the example above, we are using the output of the frequency divider or a bit-tap counter as the `clk` input to a `simple_ram` module, which will be synthesized as BRAM.

### What changes with a BRAM?

A BRAM on an FPGA (such as Xilinx 7-series or UltraScale) is a **hard macro**. It is <span class="orange-bold">not</span> made of soft logic fabric. It has dedicated, tightly characterized setup and hold requirements on its clock pin. The clock pin of a BRAM *is designed to receive a signal from a dedicated clock buffer* (BUFG or BUFR), routed on a low-skew global clock network.

When you feed `clk_divider.value` or `counter.q[n]` into a BRAM clock pin:

1. The signal travels through general fabric routing instead of the global clock network.
2. General routing has <span class="orange-bold">significantly higher</span> and less predictable propagation delay compared to dedicated clock routing.
3. The effective clock edge seen by the BRAM is <span class="orange-bold">skewed</span> relative to the true 100 MHz edge by an amount that varies with temperature, voltage, and place-and-route result.

## Clock Skew

{:.note-title}
> Clock skew
>
> Clock skew is the difference in arrival time of the same clock edge at two different points in the circuit that are supposed to be synchronised.

Ideally all flip-flops and BRAMs that share a clock domain see the rising edge at exactly the same instant. Skew is how far reality deviates from that ideal. Formally:

```
skew = t_arrival_A - t_arrival_B
```

where A and B are two components that are nominally on the same clock.

On an FPGA, the dedicated global clock network (BUFG) is <span class="orange-bold">physically engineered</span> to minimise this. The clock tree is **balanced** so that every leaf sees the edge within tens of picoseconds of each other. That is what allows the timing analyzer to make tight, reliable setup and hold calculations across the whole design.

### Worse than a simple skew

The counter-as-BRAM-clock case is a type of clock skew, but it is actually worse than ordinary skew in two ways.

**First**, the counter bit output travels through general fabric routing to reach the BRAM clock pin. That routing path has <span class="orange-bold">nothing to do</span> with the global clock tree. The delay could be 1 ns, 3 ns, 5 ns, it depends on where Vivado places and routes things, which probably might change every build.

Second, the 100 MHz signals feeding the BRAM's address and data ports are **all** synchronised to the true global clock. So the skew is not just between two clocks of the same domain: it is **between the BRAM's clock pin** and *its own address and data inputs*. The BRAM's internal setup time requirement is violated unpredictably because the address arrives relative to the 100 MHz edge, but the clock arrives late and off-phase via fabric. 

{:.highlight}
This means BRAM samples at the wrong moment, unpredictably.


### Why simulation hides this

In simulation, every signal is an **ideal** wire with zero propagation delay unless  we explicitly add it. The slow clock value produced by the frequency divider arrives at the BRAM at exactly the modeled time, addresses are stable, everything checks out. As a result, testbench passes cleanly.

On hardware, the BRAM clock edge could arrive nanoseconds *late* or *early* relative to the address and data signals that are driven by 100 MHz registered logic. Whether the BRAM correctly captures the address at a given cycle depends on routing congestion, which changes every time we rebuild.

### Why the timing analyzer goes blind

{:.highlight}
You might wonder, even though your design passes the testbench, then Vivado's timing analysis should also catch this, right?

Vivado's static timing analysis works by tracing paths between registers on known, constrained clocks. When `clk_divider.value` or some custom slow_clock is used as a BRAM clock pin *without* a proper clock definition and constraint, one of two things happens:

- The tool does <span class="orange-bold">not</span> recognize it as a clock and skips timing analysis on all paths involving that BRAM **entirely**. You get a clean report but the analysis is incomplete.
- The tool partially analyzes it but <span class="orange-bold">uses incorrect assumptions</span> about the clock period and phase, producing timing checks that do not reflect reality.

Either way, the timing report shows no violations, the bitstream is generated, and the hardware fails in ways that are difficult to reproduce or debug. We would probably only realise that our system has bug as we watch our LED/output show things that are not expected: even when it works on the emulator, pass testbenches and timing analysis.

### Why it gets worse with larger BRAMs

{:.note}
Sometimes we might get away with this (our observed output is correct) clock skew issue with smaller BRAMs, let's say less than 512 words (32 bits words). However, if we increase the BRAM size, things might get worse.

With larger size like 8192 words of 4 bytes each (256 Kbits), the BRAM might have the following physical changes:

- Has **higher** internal capacitance on address and data buses, meaning stricter setup time requirements.
- Needs **longer** address decode time internally, which tightens the margin further.
- Is placed **further** from the driving logic as size increases, increasing routing delay on the address and data paths relative to the skewed clock.

At large sizes, Vivado <span class="orange-bold">may split</span> the memory across multiple BRAM primitives, multiplying the number of clock pins that are all receiving the poorly routed signal. Any one of them failing corrupts a different address range unpredictably.

The result is not a clean failure. You get partially wrong data, with some addresses reading correctly and others not, depending on which physical BRAM tile ended up with better or worse routing to the counter output. 

{:.error}
This is extremely hard to debug because the symptom looks like a software or logic bug rather than a timing problem.

### But bigger is NOT always worse

What's confusing is that, while it might get worse with larger BRAMs, not might NOT always be the case.

#### BRAM vs LUTRAM Inference

Vivado decides how to physically implement your memory based on its *size*:

- **Large memories** (typically above a few kilobits, e.g. 8192 words x 4 bytes = 256 Kbits) are mapped to dedicated **BRAM36 hard primitives**. These are fixed silicon blocks placed at known locations on the die, with well-characterised timing properties.
- **Small memories** may instead be inferred as **distributed RAM (LUTRAM)**, implemented entirely in LUTs scattered across the general fabric.

When you use a counter bit as the clock for a large BRAM, the violation is at least consistent: **the BRAM primitive has one clock pin receiving your fabric-routed signal, and the failure mode tends to be wrong data read out in a patterned, reproducible way.**

When you use a counter bit as the clock for a small LUTRAM, the situation can be significantly worse:

- LUTRAM has <span class="orange-bold">no</span> dedicated clock infrastructure at all. The clock is just another fabric signal arriving through ordinary LUT routing.
- The *individual* LUTRAM cells are scattered wherever Vivado finds free LUTs. Each cell is at a different routing distance from your counter output.
- This means **every word of memory potentially sees a different clock arrival time**. There is no single, consistent skew value. It varies per address, per cell, and changes with every rebuild.
- The timing analyzer has even less visibility into LUTRAM clock paths than it does for BRAM primitives.

The result is <span class="orange-bold">chaotic</span> and hard to reproduce: some addresses read correctly, some do not, and the pattern may change between builds or even between power cycles.

### How to Force BRAM Inference

If you want Vivado to always use BRAM primitives *regardless* of memory size, you can add a synthesis attribute:

```verilog
(* ram_style = "block" *) reg [31:0] mem [0:N-1];
```

{:.note}
You can't set this in Lucid `simple_ram` or `simple_dual_port_ram` as it is an imported library, so you need to manually modify the generated Verilog `src` file under the `build` folder before asking Vivado to launch again.

This at least gives you a more consistent failure mode when debugging. <span class="orange-bold">However, it does not fix the underlying problem</span>.





## The Rule of Custom Clock

{:.important}
A counter bit/custom frequency divider output is a **data** signal. It <span class="orange-bold">must never</span> be used as a clock pin for any BRAM or for any logic that has a timing relationship with the rest of your 100 MHz domain.

Use these output only as a **synchronous** enable or as an input to an `edge detector`, always keeping the actual clock pin tied to the true 100 MHz FPGA clock:

```verilog
// Wrong: counter bit used as clock pin for BRAM
simple_ram memory(.clk(counter.q[i]), ...)

// Correct: BRAM clocked by true 100 MHz clock
// Access is gated by a synchronous enable derived from the counter
simple_ram memory(.clk(clk), ...)

// Pass slow clock to an edge detector
edge_detector slow_edge(#RISE(1), #FALL(0), .clk(clk), .in(counter.q[i]))

// In logic:
// depending on usage, here we pass the slow clock into an edge detector
// set write address and write data
if (slow_edge.out) {
    // issue write enable  
    bram_we = 1
}
// here we use the slowclock entirely
if (counter.q[i]){
    // issue read address
    bram_read_address = cpu_addr 
}
if (~counter.q[i]){
    // issue read address
    bram_read_address = gpu_addr 
}
```


This keeps every flip-flop and every BRAM on the single global 100 MHz clock. The timing analyzer can see all paths, constrain all paths, and report real violations. Your design becomes reproducible and trustworthy across builds, temperatures, and boards.


## Summary

| Usage | Using counter bit as clock pin | Using counter bit as enable |
|---|---|---|
| Single display DFF | Usually fine in practice | Correct approach |
| Small isolated logic | Risky but often gets away with it | Correct approach |
| BRAM (any size) | Breaks on hardware, passes simulation | Correct approach |
| Large BRAM (4096+ words) | Corrupts unpredictably, very hard to debug | Correct approach |

The bigger and more interconnected the component, the more <span class="orange-bold">catastrophically</span> the fabric-routed clock fails. For a single LED blink DFF it is an acceptable shortcut. For a BRAM shared between a CPU and a GPU in a real project, it will silently corrupt your data in ways that look like logic bugs until you understand the root cause.

{:.note}
Always use a single clock domain and use edge detectors and synchronous enables to control timing. 