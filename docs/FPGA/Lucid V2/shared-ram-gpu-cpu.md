---
layout: default
permalink: /fpga/shared-ram-gpu-cpu
title: Shared RAM (CPU + GPU)
description: Time-multiplexed single-port RAM between CPU and GPU using dual clocks
parent: Lucid V2
grand_parent: 1D&2D Project (FPGA)
nav_order: 9
---

* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design

# Sharing a Single RAM Between CPU and GPU

### Module Code

Refer to [this](https://github.com/natalieagus/shared-ram-gpu-cpu-verilog) repository for the source code (verilog).

The relevant files for this design are:

1. `shared_ram_gpu_cpu.v`: Top-level time-multiplexer and GPU cache register
2. `simple_dual_port_ram.v`: Underlying BRAM primitive (posedge-clocked, single read port, single write port)
3. `register.v`: Generic synchronous register used as the GPU output cache
4. `tb_shared_ram.v`: Testbench covering writes, reads, concurrent access, and latency checks

## Overview

A  renderer  (GPU-ish, e.g: VGA driver) and a CPU both need to read from the same screen buffer RAM. The problem is that a typical BRAM has only two ports: one read port and one write port, for simultaneous reads and writes at *different addresses*. The write port is straightforwardly owned by the CPU; it only writes. The read port, however, must be shared: the GPU reads every single pixel clock to fetch the current cell's character and color, and the CPU also needs to read back values it has written.

The solution here is <span class="orange-bold">time-division multiplexing</span> of the single read port, orchestrated entirely by the relationship between two clocks: a 50 MHz clock (`clk50`) and a 25 MHz clock (`clk25`). No arbitration logic, no handshake, and no FSM needed. The two clock edges carve the time axis into *alternating* CPU and GPU slots, and the mux select is literally just `clk25`.

{:.note}
This notes is written with the assumption that the GPU runs on 25Mhz clock e.g: for VGA. You can adjust the logic accordingly for different clock rates.

### Assumptions

Here's the hardware assumptions for this setup:
1. Memory (BRAM) contains data only, not instruction
2. Instruction memory is separate from data memory
3. Modules needs to read and write simultaneously to the data memory in a single cycle to different address
4. PC regfile has combinational read ports and synchronous write port

### Dual-Read Port BRAM Configuration

For a single BRAM primitive (RAMB36E1 on Artix-7), we have:
* 2 ports total, A and B
* Each port can be read/write independently
* So maximum is 2 read ports and 2 write ports, but they share the *same* 2 physical ports

The configuration explained above: read and write to different addresses independently is the standard usage. This is what you get if you use `simple_dual_port_ram` in Alchitry Labs

However, you can also create a dual-port BRAM with the following specs instead if you <span class="orange-bold">don't need</span> to read/write **simultaneously** at the different addresses:
1. Port A: Read/Write to address X
2. Port B: Read from address Y


Therefore you can utilise the two ports available on the BRAM for independent reads, and one of the ports has shared read/write.

```verilog
module dual_port_bram #(
    parameter ADDR_WIDTH = 14,
    parameter DATA_WIDTH = 8
)(
    // Port A: CPU read/write
    input                       clk_a,
    input  [ADDR_WIDTH-1:0]     addr_a,
    input  [DATA_WIDTH-1:0]     wdata_a,
    input                       we_a,
    output reg [DATA_WIDTH-1:0] rdata_a,

    // Port B: GPU read only
    input                       clk_b,
    input  [ADDR_WIDTH-1:0]     addr_b,
    output reg [DATA_WIDTH-1:0] rdata_b
);
    (* ram_style = "block" *)
    reg [DATA_WIDTH-1:0] mem [0:(1<<ADDR_WIDTH)-1];

    // Port A: CPU
    always @(posedge clk_a) begin
        if (we_a)
            mem[addr_a] <= wdata_a;
        rdata_a <= mem[addr_a];
    end

    // Port B: VGA
    always @(posedge clk_b) begin
        rdata_b <= mem[addr_b];
    end

endmodule
```

If your system is okay with the above design, then you can skip this guide entirely and let CPU and VGA read from the BRAM independently without multiplexing.


Note that `rdata_a` on Port A gives you the **old** value at `addr_a` even on a write cycle (read-first mode). If you want the new written value to appear on `rdata_a` immediately, change Port A to:

```verilog
always @(posedge clk_a) begin
    if (we_a) begin
        mem[addr_a] <= wdata_a;
        rdata_a     <= wdata_a;  // write-first mode
    end else begin
        rdata_a <= mem[addr_a];
    end
end
```

Which mode you want depends on whether your CPU ever reads and writes the same address in the *same* cycle.

### Assumption

This guide is written with the assumption that you *need* simultaneous read/write at *different* addresses. Therefore, the modules that need to read from the BRAM have to share the `read` time slices. If you do not need this constraint, skip this guide entirely.

## Clock Relationship

Two clocks are used. Their frequencies and phase are not arbitrary: they are carefully chosen so that their edges interleave in a predictable, non-overlapping pattern.

| Clock   | Period | Posedge times       | Negedge times       |
|---------|--------|---------------------|---------------------|
| `clk50` | 20 ns  | 10, 30, 50, 70 ...  | 20, 40, 60, 80 ...  |
| `clk25` | 40 ns  | 20, 60, 100, 140 ...| 40, 80, 120, 160 ...|

{:.important}
The critical invariant is: **Every rising edge (posedge) of `clk25` is aligned with a falling edge (negedge) of `clk50`.**

This means every `clk25` half-period contains exactly one `clk50` posedge in its interior, 10 ns after the `clk25` edge. That 10 ns gap is the setup window available for the RAM to respond before any result needs to be captured.

<img src="{{ site.baseurl }}//docs/FPGA/Lucid%20V2/images/shared-ram-gpu-cpu/2026-03-12-15-47-47.png"  class="center_full no-invert"/>

## Time-Sliced Read Port Mux

The read address to the RAM is selected combinationally based on `clk25`:

```verilog
assign ram_raddr = (clk25 == 1'b1) ? cpu_addr : gpu_addr;
```

- When `clk25 = 1` (high half, 20 ns wide): the RAM reads the **CPU address**
- When `clk25 = 0` (low half, 20 ns wide): the RAM reads the **GPU address**

Because the BRAM is posedge-clocked on `clk50`, the address that gets latched and read is whichever address was stable when the `clk50` posedge arrived. Since every `clk25` edge leads a `clk50` posedge by 10 ns, the new address is always stable well *before* the RAM samples it.

## Clock Specifications

### `clk50`

{:.highlight}
This is the 50 MHz master clock with a period of 20ns. 

This is the fastest clock in the system and is the reference everything else is derived from or phased against. All sequential elements that need to capture data from the RAM use this clock or its inverse. Posedges land at t = 10, 30, 50, 70, ... and negedges land at t = 20, 40, 60, 80, ...

### `clk25` 

{:.highlight}
This is the 25 MHz pixel clock with a period of 40 ns. 

This is the VGA pixel clock. The GPU issues one read address per pixel clock, and the CPU is given access to the shared RAM in the complementary half-period. `clk25` is not just any 25 MHz clock. It's phase relative to `clk50` is the entire basis of the design's correctness.

{:.important}
The defining constraint is: **Every rising edge of `clk25` is aligned to a falling edge of `clk50`.**

Because `clk25` is exactly half the frequency of `clk50`, this alignment automatically guarantees that every falling edge of `clk25` is also aligned to a falling edge of `clk50`. In other words, both transitions of `clk25` land on `clk50` negedges, and the `clk50` posedges always fall in the *interior* of a `clk25` half-period, never at the boundary. Look at this waveform again to internalise that.

<img src="{{ site.baseurl }}//docs/FPGA/Lucid%20V2/images/shared-ram-gpu-cpu/2026-03-12-15-47-47.png"  class="center_full no-invert"/>

Each `clk25` half-period is exactly 20 ns wide. 
- Within that 20 ns window, one `clk50` posedge falls at the 10 ns midpoint (red box)
- This midpoint posedge is **when the RAM does its work**. 
- The 10 ns before it is the <span class="orange-bold">address setup window</span> (yellow box), and the 10 ns after it (ending at the next `clk25` edge) is the RAM output propagation window before any capture happens (green box).

<img src="{{ site.baseurl }}/docs/FPGA/Lucid V2/images/Screenshot 2026-03-12 at 4.00.22 PM.png"  class="center_full no-invert"/>

### Generating Clock using MMCM

You should use Vivado `clock_wiz` or equivalent to generate the clock signal properly and not use other signals as clock. Read this [handout](https://natalieagus.github.io/50002/fpga/clocks) for more information.
- Give appropriate `phase` value in the Clocking Wizard window to align the 25Mhz and 50Mhz clock properly
- You will need these clock signals:
  - `clk100`: 100Mhz (for CPU's dffs and other dffs)
  - `clk50`: 50Mhz (for BRAM)
  - `clk25`: 25Mhz (for CPU advance/clock, and GPU/driver clock)
  - `clk50_n`: 50Mhz (phase: 180, for GPU/driver cache register)
  - `clk25`: 25Mhz (phase: 180, for GPU cache enable)
- Once generated, use it to drive the `clk` port of the RAM, CPU, GPU, etc

### Data RAM clock: `clk50`

The underlying BRAM is clocked on `posedge clk50`. This is the moment the RAM <span class="orange-bold">latches</span> the current `ram_raddr` and produces `ram_rdata` on its output. Because the BRAM is *synchronous*, `ram_rdata` is not valid immediately after the address is driven; it only updates after a `clk50` posedge has occurred with the address stable at its input.

The RAM sees one posedge per `clk25` half-period: one during the CPU slot and one during the GPU slot, and each time it captures whatever address the mux is currently presenting.

## Warning: Detecting Clock Edges    

If your CPU or GPU logic runs on `clk100` and you need to **detect** edges of `clk25` to generate single-cycle **enables**, you cannot sample `clk25` directly with `clk100`. See [this]({{ site.baseurl }}/fpga/detect-clock-edge) handout for why, and for the correct counter-based approach.


## CPU Slot Timing

The CPU drives its address at `posedge clk25` (which is a `clk50` negedge), this is denoted as the white box in the diagram below. Consecutively, GPU timing is represented in purple box. At this moment `clk25` goes high and the mux selects `cpu_addr`.

<img src="{{ site.baseurl }}//docs/FPGA/Lucid%20V2/images/shared-ram-gpu-cpu/2026-03-12-16-26-20.png"  class="center_full no-invert"/>

```
posedge clk25 = t=20   CPU drives cpu_addr, mux selects cpu_addr
posedge clk50 = t=30   RAM latches raddr = cpu_addr, ram_rdata becomes valid after delta
negedge clk25 = t=40   cpu_rdata_raw wire valid, CPU can safely read it
```

`cpu_rdata_raw` is a wire directly from `ram_rdata`, with no register in the path. This means it becomes valid roughly 10 ns after the `clk50` posedge, and is fully settled well before `negedge clk25` at t=40.

```verilog
assign cpu_rdata_raw = ram_rdata;
```

{:.highlight}
CPU read latency from address driven to data readable (at the RAM's read data port) is half a period of 50 MHz clock (10 ns).

### CPU PC and REGFILE clk

There is no need to cache the RAM result to the CPU, as the CPU can be made to *stall* during `negedge clk25`. It should have completed instruction execution within `posedge clk25`.


You can stall the CPU in the low level of `clk25` by making its regfile clocked on `clk25_n` directly, and the pc reg clocked on `clk25`. 
> We assume that instruction BRAM is exclusive to the CPU and only data BRAM is shared between CPU and GPU. Read [assumptions](#assumptions) section above. 

This clock setup gives 10ns of setup and 10ns of hold margin during data `LD`, so the regfile captures the correct RAM data cleanly with no modifications to the CPU.

{:.note}
> PC on posedge of `clk25`, REGFILE on negedge of `clk25`
> 
> The PC should still be clocked to rising 25MHz edge. Every posedge 25MHz the PC advances to the next instruction, issues the new address to instruction RAM, and the CPU begins execution. The full high half of the 25MHz period is the execution window. At the falling edge, the regfile commits and the CPU is idle for the rest of the cycle.


## GPU Slot Timing

The GPU drives its address at `negedge clk25` (which is also a `clk50` negedge). At this moment `clk25` goes low and the mux switches to `gpu_addr`.

```
negedge clk25 = t=40   GPU drives gpu_addr, mux selects gpu_addr
posedge clk50 = t=50   RAM latches raddr = gpu_addr, ram_rdata becomes valid after delta
negedge clk50 = t=60   GPU cache register captures ram_rdata
               = posedge clk25 (next CPU slot starts)
```

{:.important}
The GPU **MUST** produce a new read address request `@negedge clk25`. If your driver's address is latched, ensure you are computing the address early so there's no long latency from `negedge clk25` to when GPU produces a new read address request to the shared ram.

Unlike the CPU path, the GPU result <span class="orange-bold">cannot</span> be read as a raw wire at the right time because we need the RAM result for the entire period of `clk25` for certain drivers like VGA to work. 

By t=60, the system has already crossed into the next `clk25` posedge, which begins the CPU slot. To hold the GPU result stable across the next CPU period (and beyond), it must be **registered**. This register is called `gpu_cache_u`. There's a dedicated section for this [below](#the-gpu-cache-register).

GPU read latency from address driven to cached data valid: **20 ns** (one `clk50` period, or one `clk25` half-period).


## The GPU Cache Register

The GPU cache is a standard synchronous register with three connections worth examining closely: its clock, its enable, and its data input.

```verilog
wire reg_clk = clk50_n;   // captures on clk50 negedge

register #(.W(32), .RESET_VALUE(0)) gpu_cache_u (
    .clk(reg_clk),
    .rst(rst),
    .en (en_gpu),
    .d  (ram_rdata),
    .q  (gpu_rdata_cached)
);
```


### Cache clock 

The cache's job is to cache the gpu's read request and it's driven by `clk50` negedge (`clk50_n`).

The GPU result register (`gpu_cache_u`) is clocked on `clk50_n`, which is the logical inverse of `clk50`. Clocking on the negedge of `clk50` serves a single very important purpose: it places the cache capture (orange box) 10 ns *after* the RAM posedge, giving the RAM output (ram_rdata) the maximum possible time to settle before the register samples it.. 


```verilog
wire reg_clk = clk50_n;
```

<img src="{{ site.baseurl }}//docs/FPGA/Lucid%20V2/images/shared-ram-gpu-cpu/2026-03-12-16-05-57.png"  class="center_full no-invert"/>

The cache's output remains stable for the entire duration denoted by the pink box, which is a full 25MHz period (40ns), until new address is supplied by the GPU at the falling edge of the 25MHz clock. In short, capturing on the negedge gives maximum setup margin on the RAM output.

### Cache enable  

{:.highlight}
Denoted as `en_gpu`, registered one half-period late.

The cache must only capture during the GPU read slot (during low levels of 25Mhz clock), not the CPU slot. The naive implementation would be `en = ~clk25`. This is wrong. At the `clk50` negedge that ends the GPU slot (orange box region), `clk25` is simultaneously rising (beginning the next CPU slot). The enable and the register clock would be transitioning at the *same* instant, creating a setup/hold violation on the enable input of the register.

<img src="{{ site.baseurl }}//docs/FPGA/Lucid%20V2/images/shared-ram-gpu-cpu/2026-03-12-16-05-57.png"  class="center_full no-invert"/>

Because of this, we shift the `en_gpu` one-half period late as opposed to exactly aligned with the low levels of `clk25`. In other words, `en_gpu` is asserted one `clk50` half-period later, at the preceding `clk50` posedge:

```verilog
reg en_gpu;
always @(posedge clk50) begin
    en_gpu <= ~clk25;
end
```

At each `clk50` posedge, `en_gpu` is loaded with the **current** value of `~clk25`:

- `clk50` posedge at t=30 (during CPU half, `clk25=1`): `en_gpu <= 0` -- disable capture
- `clk50` posedge at t=50 (during GPU half, `clk25=0`): `en_gpu <= 1` —- enable capture

{:.important}
Ensure you understand that when the register clocks at t=60 (negedge `clk50`), `en_gpu` is already 1 (set 10 ns earlier at t=50). The RAM output has been stable since shortly after t=50. The register captures cleanly.


At the `clk50` posedge in the middle of the GPU slot (within yellow box), `clk25` is still `0`, so `en_gpu` gets loaded with `1`. This happens 10 ns before the cache's capture edge. By the time the negedge arrives and the register clocks (orange box), `en_gpu` has been stable for 10 ns with no pending transitions. 

{:.note}
`clk25` rising simultaneously at that negedge has zero effect on `en_gpu` because the register that holds it *already* fired.

Similarly, at the `clk50` posedge in the middle of the CPU slot, `clk25` is 1, so `en_gpu` gets loaded with 0 (teal box). The cache will <span class="orange-bold">not</span> capture at the subsequent negedge.

<img src="{{ site.baseurl }}/docs/FPGA/Lucid V2/images/shared-ram-gpu-cpu/2026-03-12-16-16-28.png"  class="center_seventy no-invert"/>


{:.note}
The complete chain per GPU read is therefore: GPU drives address at `negedge clk25` --> `clk50` posedge 10 ns later latches it into RAM and simultaneously loads `en_gpu = 1` --> `clk50` negedge 10 ns after that captures `ram_rdata` into the cache with a clean, settled enable.


## Write Port

The CPU writes directly through to the RAM with <span class="orange-bold">no time-slicing needed</span>:

```verilog
assign ram_we = cpu_we;
```

The underlying `simple_dual_port_ram` has *separate* read and write ports. CPU writes go to the write port (clocked on `clk50` posedge), and reads go to the shared read port described above. There is <span class="orange-bold">no write-read conflict</span> between CPU writes and GPU reads because they use separate physical port paths.

If the CPU writes and the GPU reads the **same address** in the same `clk25` period, the GPU will see the newly written value in its cache output one `clk25` period later (after the read completes at the next `clk50` posedge following the GPU address being placed on the mux). The testbench verifies this in Phase 3.

## Latency

The diagram below shows one full `clk25` period (40 ns) covering a GPU slot followed by a CPU slot.

<img src="{{ site.baseurl }}//docs/FPGA/Lucid%20V2/images/shared-ram-gpu-cpu/2026-03-12-16-41-20.png"  class="center_seventy no-invert"/>

Legend:
1. Yellow box: CPU latency
2. Orange box: CPU read request outputted (at RAM's read data output)
3. Red box: GPU latency (with reference to GPU cache)
4. Pink box: GPU read request outputted at the `.q` port of GPU cache


## Integration Notes

An important consequence for the VGA use case: by the time the GPU cache produces a result at `posedge clk25`, the VGA renderer is already 50% through its `clk25` period. The renderer's pipeline <span class="orange-bold">must account</span> for this one-half-period offset when deciding which address to issue relative to which pixel it expects to draw. We address it in [this]({{ site.baseurl }}/fpga/vga-textmode) guide.

## Port Reference

### `shared_ram_gpu_cpu`

| Port                 | Direction | Width | Description                                              |
|----------------------|-----------|-------|----------------------------------------------------------|
| `clk50`              | input     | 1     | 50 MHz clock, drives BRAM           |
| `clk50_n`              | input     | 1     | 50 MHz clock, drives  `en_gpu` register          |
| `clk25`              | input     | 1     | 25 MHz clock, acts as read-port mux select               |
| `rst`                | input     | 1     | Synchronous reset for GPU cache register                 |
| `same_phase`         | input     | 1     | Reserved (tie to 0 for standard operation)               |
| `cpu_addr`           | input     | 3     | CPU read/write address                                   |
| `cpu_wdata`          | input     | 32    | CPU write data                                           |
| `cpu_we`             | input     | 1     | CPU write enable                                         |
| `gpu_addr`           | input     | 3     | GPU read address                                         |
| `cpu_rdata_raw`      | output    | 32    | CPU read data (wire directly from RAM output)            |
| `gpu_rdata_cached`   | output    | 32    | GPU read data (registered, stable for full CPU slot)     |
| `ram_read_data_dbg`  | output    | 32    | Debug: current RAM read data (same as `cpu_rdata_raw`)   |
| `ram_raddr_dbg`      | output    | 3     | Debug: current address on RAM read port                  |
| `ram_write_enable_dbg`| output   | 1     | Debug: current RAM write enable                          |

## Testbench Phases

The testbench (`tb_shared_ram.v`) validates the design through eight phases:

1. **Phase 1**: CPU preloads addresses 1 through 4 with known values. GPU is parked on address 0 (uninitialized, expect X).
2. **Phase 2**: GPU reads back the four values written by the CPU. Checks that each read returns the correct value and measures cache latency.
3. **Phase 3**: CPU writes and GPU reads the **same address** in the same `clk25` period. Confirms the GPU sees the freshly written value exactly one `clk25` period later.
4. **Phase 4**: CPU writes one address while the GPU reads a different address. Confirms there is no cross-address corruption.
5. **Phase 5**: CPU reads raw and GPU reads cached on the same addresses. Both results checked for correctness and latency.
6. **Phase 6**: Rapid interleaved reads across all written addresses, alternating CPU and GPU addresses every slot. Every check reports measured latency; all should show 20 ns consistently.
7. **Phase 7**: GPU holds the same address for four consecutive slots. Confirms the cache holds its value stably between GPU slot updates while the CPU slot runs in between.
8. **Phase 8**: CPU overwrites an address while the GPU is repeatedly reading it. Confirms the GPU cache reflects the new value in the very next slot after the write completes.
