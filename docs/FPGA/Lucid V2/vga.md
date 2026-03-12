---
layout: default
permalink: /fpga/vga-textmode
title: VGA Text Mode
description: Tips on how to use the VGA 20×15 text-mode driver
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

## **Driving a VGA Display with an FPGA**

### Driver Code

You can download the driver code from the repository. The files below are designed to work together.

1. [`vga_text_mode.luc`](https://github.com/natalieagus/vga-textmode-20x15-v2/blob/main/source/vga_text_mode.luc): VGA timing engine, tile addressing, and color output
2. [`vga_font_rom.luc`](https://github.com/natalieagus/vga-textmode-20x15-v2/blob/main/source/vga_font_rom.luc):  Combinational ASCII glyph ROM (8×8 bitmap font)
3. [`vga_mem.luc`](https://github.com/natalieagus/vga-textmode-20x15-v2/blob/main/source/vga_mem.luc): Example screen memory (replace with your own BRAM or ROM)

The full repository with demo top-level code can be found [here](https://github.com/natalieagus/vga-textmode-20x15-v2).
{:.highlight-title}
> Credits
> 
> This design is based on the original 2020 Lucid HDL work by **Ragul Balaji** (SUTD 50.002 Computation Structures).

## Overview

This driver implements a **VGA text-mode renderer** targeting **640×480 @ 60 Hz**. The visible area is divided into a grid of **20 columns × 15 rows** of character cells. Each cell is **32×32 pixels** on screen and displays one ASCII glyph from an internal 8×8 font, scaled up by 4× in each dimension. Each cell independently stores a **foreground color**, a **background color**, and an **ASCII character code** in a compact 16-bit word.

The FPGA outputs five digital signals: `R`, `G`, `B` (1 bit each), `HSYNC`, and `VSYNC`. These are routed through a VGA interface board or a resistor DAC before reaching a VGA connector, because VGA color lines are analog.

## How VGA Timing Works

A VGA display is driven by a continuous stream of pixel clocks. The FPGA counts through the full horizontal and vertical timing envelope every frame, including the non-visible blanking intervals. The standard pixel clock for 640×480 @ 60 Hz is approximately **25.175 MHz**.

### Horizontal timing (per scanline, 800 pixel clocks total)

| Region          | Pixel clocks | hzcnt range |
|----------------|-------------|-------------|
| Visible pixels  | 640         | 0..639      |
| Front porch     | 16          | 640..655    |
| HSYNC pulse     | 96          | 656..751    |
| Back porch      | 48          | 752..799    |

`HSYNC` goes high for `hzcnt` values 656..750, signaling the monitor to start a new scanline.

### Vertical timing (per frame, 525 lines total)

| Region           | Lines | vtcnt range |
|-----------------|-------|-------------|
| Visible lines    | 480   | 0..479      |
| Front porch      | 10    | 480..489    |
| VSYNC pulse      | 2     | 490..491    |
| Back porch       | 33    | 492..524    |

`VSYNC` goes high for `vtcnt` values 490..491, signaling the monitor to return to the top of the frame.

RGB outputs must be driven to `000` (black / blank) during any non-visible region (front porch, sync pulse, back porch), regardless of what is stored in screen memory.

### Pixel clock derivation

The Alchitry Au runs at **100 MHz**. The design uses a 1-bit counter (`slowcnt`) feeding an `edge_detector` to produce a **25 MHz pixel tick**. The horizontal and vertical counters `hzcnt` and `vtcnt` only advance on this tick.

```
edges.in = slowcnt.value   // 100 MHz -> 25 MHz level signal
                            // edge_detector fires once per rising edge
if (edges.out == 1) {
    // advance hzcnt / vtcnt
}
```

## Module Breakdown

### `vga_text_mode.luc` 


This is the top-level driver module, which is the timing and rendering engine. It:

1. Counts pixel clocks (horizontal `hzcnt`, vertical `vtcnt`) at 25 MHz.
2. Computes the current **text cell address** (`vga_mem_address`) from the counters.
3. Outputs that address externally so screen memory can respond with a 16-bit data word (`vga_mem_data`).
4. Feeds the character code and glyph position to `vga_font_rom` to determine whether the current pixel is foreground or background.
5. Selects and outputs the correct RGB color and sync signals.

#### Ports

| Port              | Direction | Width | Description                                         |
|------------------|-----------|-------|-----------------------------------------------------|
| `clk`            | input     | 1     | 100 MHz system clock                                |
| `rst`            | input     | 1     | Synchronous reset                                   |
| `vga_mem_data`   | input     | 16    | Character + color word for the current text cell    |
| `vga_mem_address`| output    | 9     | Index of the text cell currently being rendered     |
| `vga_rgb`        | output    | 3     | RGB color output (1 bit per channel)                |
| `vga_hsync`      | output    | 1     | Horizontal sync signal                              |
| `vga_vsync`      | output    | 1     | Vertical sync signal                                |

### `vga_font_rom.luc` 

This is the glyph ROM.

It is a purely **combinational** lookup table. Given an ASCII code, a row index (0..7), and a column index (0..7), it returns a single bit indicating whether that pixel within the glyph is on (foreground) or off (background).

Glyphs are stored as 64-bit constants, one per ASCII character. The bit at position `(row << 3) + col` within the 64-bit constant determines the pixel value.

#### Ports

| Port         | Direction | Width | Description                               |
|-------------|-----------|-------|-------------------------------------------|
| `asciicode` | input     | 8     | ASCII character code (e.g. `8h41` for A)  |
| `row`       | input     | 3     | Glyph row (0..7)                          |
| `col`       | input     | 3     | Glyph column (0..7)                       |
| `color`     | output    | 1     | 1 = foreground pixel, 0 = background pixel|

The font covers printable ASCII (`0x21`..`0x7E`) plus a handful of custom glyphs. Unmapped codes return all zeros (blank).

### `vga_mem.luc` 

This is a sample screen memory. 

It is a minimal **combinational** stand-in for screen memory. It ignores the incoming address and returns the same 16-bit word for every cell: a white-on-black letter `A` everywhere. You are expected to replace this with your own implementation, for instance a synchronous dual-port BRAM that your game logic writes to.

```
data[15:14] = 2b00    // unused
data[13:11] = 3b111   // foreground: white
data[10:8]  = 3b000   // background: black
data[7:0]   = 8h41    // ASCII 'A'
```

{:.important}
The driver expects `vga_mem_data` to be valid **combinationally** for the current `vga_mem_address`. If you use synchronous BRAM with a 1-cycle read latency, you must <span class="orange-bold">perform combinational lookahead</span> or the rendered character will be off by one cell. See [this](#pipelined-memory-addressing) section for details.

## Key Signals and Data Layout

### `vga_mem_address[9]` (output from `vga_text_mode`)

Selects which of the 300 text cells is currently being rendered. The formula is:

```
tile_x = hzcnt >> 5        // divide pixel x by 32 => column 0..19
tile_y = vtcnt >> 5        // divide pixel y by 32 => row 0..14
vga_mem_address = tile_x + (tile_y * 20)
```

Linear address layout:

- Address `0` = row 0, col 0 (top-left)
- Address `19` = row 0, col 19 (top-right)
- Address `20` = row 1, col 0
- Address `299` = row 14, col 19 (bottom-right)

9 bits are required because 300 cells exceed the 8-bit range of 256.

During blanking intervals, the counters continue running and `vga_mem_address` may hold values outside 0..299. Your memory should return a safe default (such as all zeros) for out-of-range addresses rather than leaving outputs undefined.

### `vga_mem_data[16]` (input to `vga_text_mode`)

Provides the character and color information for the cell currently pointed to by `vga_mem_address`.

#### Bit layout

| Bits    | Field           | Description                                   |
|--------|-----------------|-----------------------------------------------|
| `[7:0]`  | ASCII code      | Character to display (fed to `vga_font_rom`)  |
| `[10:8]` | Background color| 3-bit RGB, `{R,G,B}` 1 bit each               |
| `[13:11]`| Foreground color| 3-bit RGB, `{R,G,B}` 1 bit each               |
| `[15:14]`| Unused          | Reserved, ignored by the renderer             |

#### Color encoding (3-bit RGB)

Each color field encodes `{R, G, B}` with one bit per channel, giving 8 possible colors:

| `{R,G,B}` | Color   |
|----------|---------|
| `000`    | Black   |
| `100`    | Red     |
| `010`    | Green   |
| `001`    | Blue    |
| `110`    | Yellow  |
| `101`    | Magenta |
| `011`    | Cyan    |
| `111`    | White   |

#### Per-pixel color selection

For each pixel, the font ROM returns a 1-bit `color` value:

- If `font_rom.color == 1`, output the **foreground** color `vga_mem_data[13:11]`
- If `font_rom.color == 0`, output the **background** color `vga_mem_data[10:8]`

#### Example packed word

To display a green `H` on a black background:

```
// ASCII 'H' = 0x48, FG = green = 010, BG = black = 000
vga_mem_data = 16b00_010_000_01001000
```

To fill every cell with white-on-black `A` (as in the demo):

```
vga_mem_data = 16b00_111_000_01000001
```

### Glyph row and column derivation

Inside `vga_text_mode`, the glyph position fed to the font ROM is extracted from the pixel counters:

```
font_rom.row = (vtcnt.q >> 2) & 3b111   // bits [4:2] of vtcnt => 0..7
font_rom.col = (hzcnt.q >> 2) & 3b111   // bits [4:2] of hzcnt => 0..7
```

Shifting right by 2 divides by 4, so each glyph pixel covers a 4×4 block of screen pixels. The `& 3b111` masks the result to 0..7, selecting the correct column/row within the 8×8 glyph.

### RGB output bit swap

VGA connector wiring on some boards routes pins in BGR order. The module compensates with an explicit swap before output:

```
vga_rgb[0] = sig_RGB[2]   // R from bit 2
vga_rgb[1] = sig_RGB[1]   // G from bit 1
vga_rgb[2] = sig_RGB[0]   // B from bit 0
```

If your board's wiring is already RGB-ordered, remove this swap. Check your VGA adapter schematic to confirm.

## What Happens Every Pixel Clock

Each 25 MHz tick, the following sequence completes combinationally within `vga_text_mode`:

1. **Address**: compute `vga_mem_address` from `hzcnt` and `vtcnt`.
2. **Fetch**: screen memory responds with `vga_mem_data` (character + colors).
3. **Glyph lookup**: feed `asciicode`, `row`, `col` to `vga_font_rom` and get 1-bit `color`.
4. **Color select**: pick foreground or background color based on `font_rom.color`.
5. **Blanking**: if outside the 640×480 visible region, force RGB to `000`.
6. **Sync**: assert `HSYNC` or `VSYNC` if within the correct counter window.
7. **Output**: drive `vga_rgb`, `vga_hsync`, `vga_vsync`.

All of this happens in a single combinational `always` block with no additional pipeline stages, so there is zero output latency beyond the pixel clock itself.

## Connecting it in `alchitry_top.luc`

The demo top-level wires everything together:

```lucid
vga_mem mem
vga_text_mode vga(.rst(rst))

// ...

mem.addr        = vga.vga_mem_address
vga.vga_mem_data = mem.data

led[2:0] = vga.vga_rgb
led[3]   = vga.vga_hsync
led[4]   = vga.vga_vsync
```

The screen memory address output from the renderer feeds directly into screen memory, and the memory response feeds directly back. No registered handshake is needed because both are combinational.

### Pin mapping

| Signal  | `led` bit | Board pin |
|---------|-----------|-----------|
| RED     | `led[0]`  | D49       |
| GREEN   | `led[1]`  | D48       |
| BLUE    | `led[2]`  | D2        |
| HSYNC   | `led[3]`  | D3        |
| VSYNC   | `led[4]`  | D46       |

These `led` outputs are routed to FPGA GPIO pins and connect to your VGA interface hardware. Update the pin constraints file if your board differs.

We only use 1 bit for each color here, there are 8 color combinations in total. It can be easily expanded to support 3-bit per color.

## Replacing `vga_mem` with Your Own Screen Buffer

{:.note}
The demo `vga_mem` module is intentionally trivial. 

In a real project, replace it with a writable screen buffer. A typical approach uses a **dual-port BRAM**: one port for the renderer to read (driven by `vga_mem_address`), and a second port for your game or application logic to write.

The 16-bit word per cell is wide enough to hold character plus color, so a 300-entry, 16-bit-wide BRAM is sufficient. In Lucid, this is a `simple_ram` or equivalent component.

## Pipelined Memory Addressing

{:.important}
When an address is issued to RAM on clock cycle `N`, the data is not available until the next RAM clock cycle. This means if you request `address_N` while displaying pixel `N`, the data arrives <span class="orange-bold">one cycle late</span> and the wrong data is displayed.

Rather than modifying `vga_text_mode`, a separate combinational module `vga_addr_lookahead` should be created to handle this. It takes `hzcnt` and `vtcnt` as inputs, computes what the <span class="orange-bold">next</span> pixel's coordinates will be, and outputs the correct lookahead address to the RAM. 

```verilog
    module vga_addr_lookahead (
        input hzcnt[12],
        input vtcnt[12],
        output mem_address[9]
    ) {
        sig next_hzcnt[12]
        sig next_vtcnt[12]

        always {
            
            next_hzcnt = (hzcnt == 799) ? 0 : hzcnt + 1
            next_vtcnt = (hzcnt == 799) ? ((vtcnt == 524) ? 0 : vtcnt + 1) : vtcnt
            
            mem_address = (next_hzcnt >> 5) + ((next_vtcnt >> 5) * 20)
        }
    }
```

The `vga_text_mode` module stays largely untouched, except that now `hzcnt` and `vtcnt` should be exposed as outputs from `vga_text_mode` and fed into this module. This module's `mem_address` connects to the RAM/cache instead of vga_text_mode's original vga_mem_address output. 


At the very last cycle of the frame where `hzcnt=799` and `vtcnt=524`, `next_hzcnt=0` and `next_vtcnt=0`, so address `0` is requested. By the time the first visible pixel arrives, the RAM/cache *has already responded* and the correct data is ready. 

{:.note}
The only exception is the <span class="orange-bold">very first frame</span> after reset. At that point hzcnt=799 vtcnt=524 has *never* occurred yet, so address `0` has never been requested and the cache holds garbage when pixel `0` first arrives. This corrupts *exactly one pixel*, the top left corner, one time only at startup. From the second frame onward every pixel is correct. This is completely imperceptible in practice.

## Hardware: Connecting to a VGA Monitor

VGA expects HSYNC and VSYNC as digital signals, and R, G, B as **analog voltage levels**. The FPGA outputs digital bits, so you need a small interface between the FPGA and the VGA connector.

### Option 1: VGA accessory board (recommended for prototyping)

An accessory board such as the [Waveshare VGA PS/2 Board](https://www.waveshare.com/vga-ps2-board.htm) or equivalent already includes the VGA connector and the analog interface. Wire:

- `R`, `G`, `B` from FPGA GPIO
- `HSYNC`, `VSYNC` from FPGA GPIO
- `GND`

This is the fastest way to get a working display without soldering.

### Option 2: Resistor DAC (simplest DIY)

Because this design outputs only 1 bit per color channel, the simplest analog interface is a single resistor per channel between the FPGA pin and the VGA connector pin. Standard VGA color inputs expect a 0.7 V peak into 75 ohms. A series resistor chosen for this load converts the FPGA's 3.3 V output to the correct level.

If you later want more color depth (for example 3 bits per channel = 512 colors), use a weighted resistor network per channel with resistors in powers-of-two ratios. References: [fpga4fun.com/VGA](https://www.fpga4fun.com/VGA.html) and [embeddedthoughts.com VGA guide](https://embeddedthoughts.com/2016/07/29/driving-a-vga-monitor-using-an-fpga/).

### Option 3: VGA PMOD

A VGA PMOD such as the [Digilent PMOD VGA](https://digilent.com/reference/pmod/pmodvga/start) is a compact board with VGA connector and resistor network in a standard PMOD footprint. It is the same concept as the Waveshare board but in a different form factor.

### What this design needs

This text-mode renderer only requires HSYNC, VSYNC, and three 1-bit color signals. A simple resistor DAC or a basic VGA interface board is entirely sufficient for this project. A dedicated video DAC is not necessary unless you expand to more color bits.

## Extending the Design

### More colors

The 3-bit color scheme gives 8 colors. To expand to more shades, widen the color fields in `vga_mem_data` and widen the RGB output ports. You also need a corresponding analog interface (more resistor bits or a DAC) to handle the extra bits per channel. `vga_mem_data[15:14]` is currently unused and could be repurposed.

### Larger grid or different resolution

The grid is sized for 640×480 with 32×32 cells. To change cell size or resolution, update the counter limits in `vga_text_mode`, the shift amounts for tile and glyph coordinate extraction, and the address formula. The font ROM itself is resolution-independent since it only cares about which 8×8 glyph pixel to output.

### Custom glyphs

`vga_font_rom` is a plain `case` statement. Add entries for unused ASCII codes (or reassign existing ones) to define custom tile graphics. Each glyph is a 64-bit constant, read row-major, MSB at top-left within the 8×8 grid.

### Scrolling or animation

Because the screen buffer is decoupled from the renderer, you can update any cell at any time by writing to the BRAM through the second port. The renderer will pick up the new value on the next frame pass through that cell. There is no double-buffering in this design, so writes during active scan can cause a one-frame tear on updated cells.
