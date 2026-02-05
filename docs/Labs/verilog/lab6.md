---
layout: default
permalink: /lab/lab6-verilog
title: Lab 6 - Beta CPU
description: Lab 6 handout covering topics from Beta ISA
nav_order:  6
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

# (Verilog) Lab 6: Beta CPU
{: .no_toc}



This is a Verilog parallel of the Lucid + Alchitry Labs Lab 6. It is not part of the syllabus, and it is written for interested students only. You still need to complete all necessary checkoffs in Lucid, as stated in the original lab handout.

{:.important}
If you are reading this document, we assume that you have already read Lab 4 Lucid version, as some generic details are not repeated. This lab has the same objectives and related class materials so we will not paste them again here. For submission criteria, refer to [the original lab 6]({{ site.baseurl }}/lab/lab6) handout.

## Introduction
The goal of this lab is to build a **fully** functional 32-bit Beta Processor on our FPGA so that it could simulate simple programs written in Beta Assembly Language. It is a huge device, and to make it more bearable we shall modularise it into six major components:
* **Memory Unit**: the RAM or physical memory, separated into data and instruction memory.
* (Beta CPU Part A) **PC** Unit: containing the PC register and all necessary components to support the ISA
* (Beta CPU Part B) **REGFILE** Unit: containing 32 32-bit registers, WASEL, and RA2SEL mux, plus circuitry to compute Z
* (Beta CPU Part C) **CONTROL** Unit: containing the ROM and necessary components to produce all Beta control signals given an `OPCODE`
* (Beta CPU Part D)  **ALU+WDSEL** Unit: containing the ALU and WDSEL, ASEL, BSEL muxes 
* **Motherboard**: We assemble the entire Beta CPU using all subcomponents above and connect it to I/O
 
<img src="/50002/assets/contentimage/lab4/beta_lab.png"  class="center_seventy"/><br>

The signals indicated in red refers to external **`INPUT`** to our Beta, supplied by the **Memory Unit**. The signals illustrated yellow refers to our Beta's **`OUTPUT`** to the **Memory Unit**.

{: .note}
Please study each section **carefully** as this will be beneficial not only for your 1D Project and Exam, but also to sharpen your knowledge in basics of computer architecture which might be useful in your future career as a computer science graduate. 


## Memory Unit

We strongly suggest that the memory Unit is made physically *separated* into two sections for ease of explanation and implementation:

* the **instruction** memory and
* the **data** memory

{: .note}
In practice, the *data* segment and the *instruction* segment are only **logically** segregated, so it would need to support two reads in a single cycle (for both data and instruction). They still share the same physical device we call **RAM**, but we implement them as two RAM blocks here to keep the Beta CPU wiring simple. For more details regarding 2R1W type of RAM and possible implementation in FPGA, see the [appendix](#unified-memory-model).

Below is a sample implementation of the memory unit that can be used to alongside your Beta CPU.

```verilog
// Byte-addressed inputs, word-aligned internally (addr >> 2)
module memory_unit #(
    parameter integer WORDS = 16
)(
    input  wire clk,

    // data memory (byte addressing expected)
    input  wire [$clog2(WORDS)+2-1:0] raddr,
    input  wire [$clog2(WORDS)+2-1:0] waddr,
    input  wire [31:0]                wd,
    input  wire                       we,
    output wire [31:0]                mrd,

    // instruction memory (byte addressing expected)
    input  wire [$clog2(WORDS)+2-1:0] ia,
    input  wire                       instruction_we,
    input  wire [31:0]                instruction_wd,
    output wire [31:0]                id
);

  localparam integer AW = $clog2(WORDS);

  // Convert byte address -> word address by dropping low 2 bits
  wire [AW-1:0] ia_word = ia[AW+1:2];
  wire [AW-1:0] ra_word = raddr[AW+1:2];
  wire [AW-1:0] wa_word = waddr[AW+1:2];

  // Instruction memory: single-port RAM (sync read, 1-cycle latency)
  simple_ram #(
      .WIDTH(32),
      .ENTRIES(WORDS)
  ) instruction_memory (
      .clk          (clk),
      .address      (ia_word),
      .read_data    (id),
      .write_data   (instruction_wd),
      .write_enable (instruction_we)
  );

  // Data memory: dual-port RAM (sync read on rclk, write on wclk)
  simple_dual_port_ram #(
      .WIDTH(32),
      .ENTRIES(WORDS)
  ) data_memory (
      .wclk         (clk),
      .waddr        (wa_word),
      .write_data   (wd),
      .write_enable (we),

      .rclk         (clk),
      .raddr        (ra_word),
      .read_data    (mrd)
  );

endmodule
```



### Instruction Memory

The instruction memory is implemented using the `simple_ram` component from Alchitry Labs, code featured in [Appendix](#simple_ramv).

* `read_data` outputs the value of the entry pointed to by `address` in the <span style="color:red; font-weight: bold;">previous</span> clock cycle. If you want to read address `EA`, you set `address = EA_word` and wait one FPGA clock cycle for `Mem[EA]` to show up.
* If you read and write the **same** address, then:

  * on the next cycle you will see the **old** value at `read_data`, and
  * one cycle later you will see the **newly written** value at `read_data`.

Since we never need to **write** to instruction memory *during program execution*, we normally keep `instruction_we = 0`. However, the port is provided so that we can load programs into instruction memory during testing.

The interface is:

```verilog
// for instruction memory (byte addressing expected)
input  ia[$clog2(WORDS)+2],
input  instruction_we,
input  instruction_wd[32],
output id[32]
```

{:.important}
`id` outputs the value of the entry pointed to by `ia` in the **previous** clock cycle. Also, if you read and write the same address `ia` and hold `ia`, the first clock cycle the address will be written, the second clock cycle the old value will be output on `id`, and on the third clock cycle the newly updated value will be output on `id`.

### Data Memory

The Beta CPU can **read** or **write** the Data Memory. For ease of demonstration, data memory is implemented as a **dual port RAM** (read and write can be done independently in the same `clk` cycle), see [appendix](#simple_dual_port_ramv). That is why we have two address ports `raddr` and `waddr`.

* `read_data` outputs the value of the entry pointed to by `raddr` in the <span style="color:red; font-weight: bold;">previous</span> clock cycle. If you want to read address `EA`, set `raddr = EA` and wait one FPGA clock cycle for `Mem[EA]` to show up.
* We should <span style="color:red; font-weight: bold;">avoid</span> reading and writing to the same address simultaneously because the returned value is undefined (tool/FPGA dependent).

The interface is:

```verilog
// for data memory (byte addressing expected)
input  raddr[$clog2(WORDS)+2],
input  waddr[$clog2(WORDS)+2],
input  wd[32],
input  we,
output mrd[32]
```


{:.important}
You should avoid reading and writing to the same address simultaneously. The value read in this case is undefined. Also, `mrd` outputs the value of the entry pointed to by raddr in the previous clock cycle. The unit is **always reading** based on whatever value is at `raddr`, so you can ignore `mrd` values if you don't need it.

### Memory Read

To **load** (read) data from memory, the Beta supplies the effective address `EA` on `raddr`. After one rising edge of `clk`, the memory outputs:

* `mrd[31:0] = Mem[EA]`


### Memory Write

To **store** (write) data to memory, the Beta supplies:

* `waddr` = effective address `EA`
* `wd[31:0]` = the 32-bit value to store
* `we` = 1 to perform the write on the rising edge of `clk`

{: .warning}
The signal `we` must always be a valid logic value (0 or 1) at the rising edge of `clk`. If `we = 1`, the value on `wd[31:0]` is written into memory at the end of the current cycle. If `we = 0`, `wd[31:0]` is ignored.


### Addressing Convention (Byte Address In, Word-Aligned)

We expect **byte addresses** to be supplied at `ia`, `raddr`, and `waddr`. However, our RAM blocks store **32-bit words**, so the memory unit is **word-aligned** internally.

This means:

* We ignore the lower two bits of the address (`addr[1:0]`).
* Internally, the word index is `addr >> 2`.

In Verilog, we implement this by slicing:

```verilog
wire [AW-1:0] word_addr = addr[AW+1:2];  // drop addr[1:0]
```

As a result:

* Addresses `0x00`, `0x01`, `0x02`, `0x03` all map to the **same** word (word 0)
* Address `0x04` maps to the next word (word 1)
* Unaligned accesses are not supported (they are forced to the aligned word).

{: .note}
We could implement a strictly byte-addressable RAM by storing bytes (`WIDTH=8`) and using `ENTRIES=WORDS*4`, but then we must add additional logic to assemble 4 bytes into a 32-bit word (and handle byte enables on stores). For the Beta CPU memory unit here, we keep the design word-aligned for simplicity.
### Testbench

You can use the following testbench to observe how the memory unit work:

```verilog
`timescale 1ns / 1ps

module tb_memory_unit;

  // --------------------------------------------------------------------------
  // Params
  // --------------------------------------------------------------------------
  localparam integer WORDS = 16;
  localparam integer AWB = $clog2(WORDS) + 2;  // byte-address width

  // --------------------------------------------------------------------------
  // DUT I/O
  // --------------------------------------------------------------------------
  reg            clk;

  reg  [AWB-1:0] raddr;
  reg  [AWB-1:0] waddr;
  reg  [   31:0] wd;
  reg            we;
  wire [   31:0] mrd;

  reg  [AWB-1:0] ia;
  reg            instruction_we;
  reg  [   31:0] instruction_wd;
  wire [   31:0] id;

  // --------------------------------------------------------------------------
  // Instantiate DUT
  // --------------------------------------------------------------------------
  memory_unit #(
      .WORDS(WORDS)
  ) dut (
      .clk(clk),

      .raddr(raddr),
      .waddr(waddr),
      .wd   (wd),
      .we   (we),
      .mrd  (mrd),

      .ia            (ia),
      .instruction_we(instruction_we),
      .instruction_wd(instruction_wd),
      .id            (id)
  );

  // --------------------------------------------------------------------------
  // Clock
  // --------------------------------------------------------------------------
  initial clk = 1'b0;
  always #5 clk = ~clk;  // 100 MHz

  // --------------------------------------------------------------------------
  // Wave dump
  // --------------------------------------------------------------------------
  initial begin
    $dumpfile("tb_memory_unit.vcd");
    $dumpvars(0, tb_memory_unit);
  end

  // --------------------------------------------------------------------------
  // Helpers
  // --------------------------------------------------------------------------
  task tick;
    begin
      @(posedge clk);
      #1;  // small delay for signals to settle
    end
  endtask

  task tb_fatal(input [1023:0] msg);
    begin
      $display("ASSERTION FAILED at t=%0t: %0s", $time, msg);
      $fatal(1);
    end
  endtask

  // Simple "assert equal" helper
  task assert_eq32(input [31:0] got, input [31:0] exp, input [1023:0] what);
    begin
      if (got !== exp) begin
        $display("  got = 0x%08h", got);
        $display("  exp = 0x%08h", exp);
        tb_fatal(what);
      end
    end
  endtask

  task instr_write(input [31:0] byte_addr, input [31:0] data);
    begin
      ia             = byte_addr[AWB-1:0];
      instruction_wd = data;
      instruction_we = 1'b1;
      tick();
      instruction_we = 1'b0;
    end
  endtask

  // Sets ia, ticks once (read occurs), then checks id (which updates on that tick)
  task instr_read_check(input [31:0] byte_addr, input [31:0] exp);
    begin
      ia = byte_addr[AWB-1:0];
      tick();  // id <= mem[ia_word] at this edge
      assert_eq32(id, exp, {"instr read @", hex32(byte_addr), " (word-aligned)"});
    end
  endtask

  task data_write(input [31:0] byte_addr, input [31:0] data);
    begin
      waddr = byte_addr[AWB-1:0];
      wd    = data;
      we    = 1'b1;
      tick();
      we = 1'b0;
    end
  endtask

  task data_read_check(input [31:0] byte_addr, input [31:0] exp);
    begin
      raddr = byte_addr[AWB-1:0];
      tick();  // mrd <= mem[raddr_word] at this edge
      assert_eq32(mrd, exp, {"data read @", hex32(byte_addr), " (word-aligned)"});
    end
  endtask

  // Format helper: return 8-hex string for messages
  function [8*10-1:0] hex32(input [31:0] x);
    begin
      // "0x" + 8 hex digits = 10 chars
      hex32 = {
        "0x",
        nyb(x[31:28]),
        nyb(x[27:24]),
        nyb(x[23:20]),
        nyb(x[19:16]),
        nyb(x[15:12]),
        nyb(x[11:8]),
        nyb(x[7:4]),
        nyb(x[3:0])
      };
    end
  endfunction

  function [7:0] nyb(input [3:0] n);
    begin
      case (n)
        4'h0: nyb = "0";
        4'h1: nyb = "1";
        4'h2: nyb = "2";
        4'h3: nyb = "3";
        4'h4: nyb = "4";
        4'h5: nyb = "5";
        4'h6: nyb = "6";
        4'h7: nyb = "7";
        4'h8: nyb = "8";
        4'h9: nyb = "9";
        4'hA: nyb = "A";
        4'hB: nyb = "B";
        4'hC: nyb = "C";
        4'hD: nyb = "D";
        4'hE: nyb = "E";
        4'hF: nyb = "F";
      endcase
    end
  endfunction


  function [AWB-1:0] trunc_addr(input [31:0] x);
    begin
      trunc_addr = x[AWB-1:0];
    end
  endfunction

  // --------------------------------------------------------------------------
  // Stimulus + Asserts
  // --------------------------------------------------------------------------
  initial begin
    // init inputs
    raddr          = {AWB{1'b0}};
    waddr          = {AWB{1'b0}};
    wd             = 32'h0;
    we             = 1'b0;

    ia             = {AWB{1'b0}};
    instruction_we = 1'b0;
    instruction_wd = 32'h0;

    // idle cycles (first reads likely X unless RAM init elsewhere)
    tick();
    tick();

    // ------------------------------------------------------------------------
    // Instruction memory: write then read back (word-aligned)
    // ------------------------------------------------------------------------
    instr_write(32'h0000_0000, 32'h1111_0000);
    instr_write(32'h0000_0004, 32'h2222_0001);
    instr_write(32'h0000_0008, 32'h3333_0002);

    instr_read_check(32'h0000_0000, 32'h1111_0000);
    instr_read_check(32'h0000_0004, 32'h2222_0001);
    instr_read_check(32'h0000_0008, 32'h3333_0002);

    // Word-alignment: 0x0,0x1,0x2,0x3 all map to word 0
    instr_read_check(32'h0000_0001, 32'h1111_0000);
    instr_read_check(32'h0000_0003, 32'h1111_0000);

    // ------------------------------------------------------------------------
    // Data memory: write then read back (word-aligned)
    // ------------------------------------------------------------------------
    data_write(32'h0000_000C, 32'hAAAA_0003);  // word 3
    data_write(32'h0000_0010, 32'hBBBB_0004);  // word 4

    data_read_check(32'h0000_000C, 32'hAAAA_0003);
    data_read_check(32'h0000_0010, 32'hBBBB_0004);

    // Word-alignment: 0xE maps to word 3
    data_read_check(32'h0000_000E, 32'hAAAA_0003);

    // ------------------------------------------------------------------------
    // Fun: drive BOTH instruction + data read addresses together
    // (They are independent RAMs here, so both should work in parallel.)
    // ------------------------------------------------------------------------
    ia    = trunc_addr(32'h0000_0004);
    raddr = trunc_addr(32'h0000_0010);
    tick();
    assert_eq32(id, 32'h2222_0001, "parallel read: id should be instr word 1");
    assert_eq32(mrd, 32'hBBBB_0004, "parallel read: mrd should be data word 4");

    // ------------------------------------------------------------------------
    // Another write/read quick check
    // ------------------------------------------------------------------------
    data_write(32'h0000_0014, 32'hCCCC_0005);  // word 5
    data_read_check(32'h0000_0014, 32'hCCCC_0005);

    $display("All assertions passed.");
    repeat (3) tick();
    $finish;
  end

endmodule
```

And you will obtain the following waveform:

<img src="{{ site.baseurl }}//docs/Labs/verilog/images/lab6/2026-02-05-10-28-52.png"  class="center_full no-invert"/>

Few things to note:
1. Read data comes out one cycle later after address `ia`/`raddr`/`waddr` is given
2. From 0 to 55000 ps, `id` is `x` because we are technically "reading" from them as we are writing to them in each cycle here.
3. Writing to instruction memory / data memory is only done when `instruction_we` or `we` is high
4. Data memory was initially "empty" (giving out `x`)
5. We started writing to data memory from 95000 ps onwards, on address `0x0C` and `0x10` as `we` is high
6. Memory data is able to produce what's written from 125000 ps onwards, based on read address given by `raddr`


## Appendix


### Unified Memory Model 

In practice, the **instruction memory** and **data memory** are only **logically** segregated. Architecturally, the CPU treats them as separate spaces because they serve different purposes, but physically they can reside in the **same RAM device**.

What the CPU actually requires in a single cycle is:

* **one instruction fetch** (read),
* **one data load** (read), and
* **optionally one data store** (write).

{:.highlight}
This access pattern corresponds to a **2-read, 1-write (2R1W)** memory.


### Physical Realisation on FPGA

Most FPGA block RAMs natively support at most **two ports**. A true 2R1W memory is therefore *not* directly available as a single primitive. In practice, FPGA designs implement this behaviour using one of the following techniques:

1. **Separate instruction and data memories** (what we do): Instruction memory and data memory are instantiated as two independent RAM blocks. This is simple to reason about and is commonly used in teaching designs.

2. **Replicated memory**: Two identical copies of the same memory are created. This technique provides the illusion of a single unified memory with two independent read ports and one write port.
   * one copy services the **instruction read port**, and
   * the other copy services the **data read port**.
   * Any **write** operation updates **both copies**, ensuring that the two read ports always observe consistent memory contents.


Below is a sample implementation for method (2):

```verilog
// Unified RAM: 2 read ports (ia + raddr) and 1 write port (waddr)
// Byte-addressed inputs, word-aligned internally (addr >> 2)
//
// Implementation: replicated RAM for the two read ports.
// Any write updates BOTH copies so both reads see the same memory contents.
module memory_unit_2r1w #(
    parameter integer WORDS = 16
)(
    input  wire clk,

    // instruction fetch (byte addressing expected)
    input  wire [$clog2(WORDS)+2-1:0] ia,
    output reg  [31:0]                id,

    // data read (byte addressing expected)
    input  wire [$clog2(WORDS)+2-1:0] raddr,
    output reg  [31:0]                mrd,

    // data write (byte addressing expected)
    input  wire [$clog2(WORDS)+2-1:0] waddr,
    input  wire [31:0]                wd,
    input  wire                       we
);

  localparam integer AW = $clog2(WORDS);

  wire [AW-1:0] ia_word = ia[AW+1:2];
  wire [AW-1:0] ra_word = raddr[AW+1:2];
  wire [AW-1:0] wa_word = waddr[AW+1:2];

  // Two identical copies to get two independent synchronous read ports
  // Tells synthesis tool to implement this array as block RAM (BRAM) instead of flip-flops (LUT RAM)
  (* ram_style = "block" *) reg [31:0] mem_i [0:WORDS-1]; // for instruction read
  (* ram_style = "block" *) reg [31:0] mem_d [0:WORDS-1]; // for data read

  integer k;
  initial begin
    // Optional: init to 0 for simulation friendliness
    for (k = 0; k < WORDS; k = k + 1) begin
      mem_i[k] = 32'h0;
      mem_d[k] = 32'h0;
    end
  end

  always @(posedge clk) begin
    // synchronous reads (1-cycle latency)
    id  <= mem_i[ia_word];
    mrd <= mem_d[ra_word];

    // write updates BOTH copies
    if (we) begin
      mem_i[wa_word] <= wd;
      mem_d[wa_word] <= wd;
    end
  end

endmodule
```

Note that if you use this construct, then the addresses used in `LD`, `ST` and `LDR` instruction would differ from when you use the separated instruction-data construct.

### Timing Semantics

All memory accesses are **synchronous**:

* Read data is returned in the <span style="color:red; font-weight: bold;">next</span> clock cycle.
* Write data is committed at the **end of the current cycle** if the write enable is asserted.

As a result:

* Instruction fetch and data load addresses are presented in cycle *N*.
* The corresponding values become visible in cycle *N+1*.


### Addressing Convention (Byte Address In, Word-Aligned)

The memory unit accepts **byte addresses** at its interface, but stores data internally as **32-bit words**. Therefore, the memory is **word-aligned**:

* The lowest two bits of every address (`addr[1:0]`) are ignored.
* The internal word index is effectively `addr >> 2`.

This is implemented by slicing the address as follows:

```verilog
addr_word = addr[$clog2(WORDS)+2-1 : 2];
```

Consequences:

* Addresses that differ only in the lowest two bits map to the same word.
* Unaligned byte or halfword accesses are not supported and are implicitly forced to the nearest aligned word.

{: .note}
A strictly byte-addressable memory could be implemented by storing 8-bit entries and assembling 32-bit words in logic, but this would significantly complicate the design. For the Beta CPU, a word-aligned memory provides a cleaner and more instructive model.



### `simple_ram.v`

```verilog
/******************************************************************************

   The MIT License (MIT)

   Copyright (c) 2026 Alchitry

   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated documentation files (the "Software"), to deal
   in the Software without restriction, including without limitation the rights
   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   copies of the Software, and to permit persons to whom the Software is
   furnished to do so, subject to the following conditions:

   The above copyright notice and this permission notice shall be included in
   all copies or substantial portions of the Software.

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
   THE SOFTWARE.

   *****************************************************************************

   This module is a simple single port RAM. This RAM is implemented in such a
   way that the tools will recognize it as a RAM and implement large
   instances in block RAM instead of flip-flops.

   The parameter WIDTH is used to specify the word size. That is the size of
   each entry in the RAM.

   The parameter ENTRIES is used to specify how many entries are in the RAM.

   read_data outputs the value of the entry pointed to by address in the previous
   clock cycle. That means to read address 10, you would set address to be 10
   and wait one cycle for its value to show up. The RAM is always reading whatever
   address is. If you don't need to read, just ignore this value.

   To write, set write_enable to 1, write_data to the value to write,
   and address to the address you want to write.

   If you read and write the same address, the first clock cycle the address will
   be written, the second clock cycle the old value will be output on read_data,
   and on the third clock cycle the newly updated value will be output on
   read_data.
*/

module simple_ram #(
    parameter WIDTH = 1,                  // size of each entry
    parameter ENTRIES = 1                 // number of entries
  )(
    input clk,                            // clock
    input [$clog2(ENTRIES)-1:0] address,  // address to read or write
    output reg [WIDTH-1:0] read_data,     // data read
    input [WIDTH-1:0] write_data,         // data to write
    input write_enable                    // write enable (1 = write)
  );

  reg [WIDTH-1:0] ram [ENTRIES-1:0];      // memory array

  always @(posedge clk) begin
    read_data <= ram[address];            // read the entry

    if (write_enable)                     // if we need to write
      ram[address] <= write_data;         // update that value
  end

endmodule
```

### `simple_dual_port_ram.v`


```verilog
/******************************************************************************

   The MIT License (MIT)

   Copyright (c) 2026 Alchitry

   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated documentation files (the "Software"), to deal
   in the Software without restriction, including without limitation the rights
   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   copies of the Software, and to permit persons to whom the Software is
   furnished to do so, subject to the following conditions:

   The above copyright notice and this permission notice shall be included in
   all copies or substantial portions of the Software.

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
   THE SOFTWARE.

   *****************************************************************************

   This module is a simple dual port RAM. This RAM is implemented in such a
   way that Xilinx's tools will recognize it as a RAM and implement large
   instances in block RAM instead of flip-flops.

   The parameter WIDTH is used to specify the word size. That is the size of
   each entry in the RAM.

   The parameter ENTRIES is used to specify how many entries are in the RAM.

   read_data outputs the value of the entry pointed to by raddr in the previous
   clock cycle. That means to read address 10, you would set address to be 10
   and wait one cycle for its value to show up. The RAM is always reading whatever
   address is. If you don't need to read, just ignore this value.

   To write, set write_enable to 1, write_data to the value to write, and waddr to
   the address you want to write.

   You should avoid reading and writing to the same address simultaneously. The
   value read in this case is undefined.
*/
module simple_dual_port_ram #(
    parameter WIDTH = 8,                // size of each entry
    parameter ENTRIES = 8               // number of entries
  )(
    // write interface
    input wclk,                         // write clock
    input [$clog2(ENTRIES)-1:0] waddr,  // write address
    input [WIDTH-1:0] write_data,       // write data
    input write_enable,                 // write enable (1 = write)
    
    // read interface
    input rclk,                         // read clock
    input [$clog2(ENTRIES)-1:0] raddr,  // read address
    output reg [WIDTH-1:0] read_data    // read data
  );
  
  reg [WIDTH-1:0] mem [ENTRIES-1:0];    // memory array
  
  // write clock domain
  always @(posedge wclk) begin
    if (write_enable)                   // if write enable
      mem[waddr] <= write_data;         // write memory
  end
  
  // read clock domain
  always @(posedge rclk) begin
    read_data <= mem[raddr];            // read memory
  end
  
endmodule
```
