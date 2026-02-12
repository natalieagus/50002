---
layout: default
title: 1D&2D Project (FPGA) 
permalink: /fpga/intro
has_children: true
nav_order: 22
---

# 50.002 FPGA Tutorials
{: .no_toc}

We are using [Alchitry Au FPGA Development Board](https://www.sparkfun.com/products/16527) in this course. To facilitate learning and development, we purchased the [Br breakout board](https://www.sparkfun.com/products/16524) (prototyping periphery) and the [Io](https://www.sparkfun.com/products/17278) expansion board. 

It is crucial that you start familiarising yourself with coding the FPGA right away after you obtain the kit. Failure to do so will result in inevitable sufferings towards the end of the semester, which we do not want you to go through. This is <span style="color:red; font-weight: bold;">unlike</span> any programming subjects that you have learned in previous terms.

The FPGA tutorials are written in Lucid programming language, specifically **Lucid V2** programming language.
1. [Product description, schematics for: Au, Io, and Br. ](https://drive.google.com/drive/folders/1p8nP67o50hCzpcxhIxo2FYi0QfdDwFc2?usp=sharing)
   * The Br reference schematic is different from original Alchitry due to our custom PCB. [<span style="color:red; font-weight: bold;">Use our NEW one here</span>](https://drive.google.com/file/d/1T3Vth8YpqDq1iOcPEW6TWjwVH0-h-59C/view?usp=sharing). 
   * Please DO NOT use Alchitry original Br, the schematic is DIFFERENT (see below)
2. [Lucid V2 documentation](https://alchitry.com/tutorials/lucid-reference/): : We will program the FPGA using **Lucid**, <span style="color:red; font-weight: bold;">not</span> Verilog. However, you can choose to program it using Verilog if you have prior experience. 

## Beginner Tutorials

Consult these tutorials by Alchitry to get started: 
1. [Background tutorial](https://alchitry.com/tutorials/background/)
2. [Your First FPGA Project](https://alchitry.com/tutorials/your-first-fpga-project/) and [external IO setup](https://learn.sparkfun.com/tutorials/external-io-and-metastability/all) 
3. [Synchronous Logic](https://alchitry.com/tutorials/synchronous-logic/) (Related to Week 3 materials)
4. [Io Element Project](https://alchitry.com/tutorials/io-element/)
5. [ROM and FSMs Project](https://alchitry.com/tutorials/roms-and-fsms/) (Related to Week 2-5 materials)
6. [Basic CPU](https://alchitry.com/tutorials/hello-your-name-here/)  (Related to Beta CPU)
7. [DDR3 RAM](https://alchitry.com/tutorials/ddr3-memory/) (intermediate) 

## Recommended Tutorials 

Consult these tutorials based on your needs:
1. [Alchitry Pinout](https://natalieagus.github.io/50002/fpga/fpga_4_2024)
2. [Board Reset](https://natalieagus.github.io/50002/fpga/fpga_1_2024)
3. [Random Number Generation](https://natalieagus.github.io/50002/fpga/fpga_2_2024)
4. [Seven Segment](https://natalieagus.github.io/50002/fpga/fpga_3_2024)
5. [LucidV2 Pitfalls](https://natalieagus.github.io/50002/fpga/fpga_5_2024)

## I/O Drivers 

Driving LED displays efficiently requires understanding various communication protocols and hardware interfaces. In this guide, we will explore how to control **WS2812B addressable LEDs, HUB75 RGB LED matrices, 74HC595 shift registers, and MAX7219 LED drivers** using an FPGA.

1. **[WS2812B](https://cdn-shop.adafruit.com/datasheets/WS2812B.pdf) (Addressable RGB LEDs)**  
   WS2812B LEDs are individually addressable RGB LEDs with an integrated driver chip. They use a single-wire **timing-based protocol** to transmit color data in a daisy-chain fashion. Since precise timing is required, controlling WS2812B from an FPGA involves generating **accurate** pulse widths to match the protocol specifications.

2. **[HUB75](https://learn.adafruit.com/32x16-32x32-rgb-led-matrix/overview) RGB LED Matrix**  
   The HUB75 interface is commonly used in large RGB LED panel displays. It utilizes a **multiplexed row-column addressing scheme**, requiring multiple control signals, including row selection, RGB data lines, and clock signals. Driving a HUB75 matrix with an FPGA involves sequentially scanning rows while updating pixel data at high speed to achieve a flicker-free display.

3. **[74HC595](https://www.diodes.com/assets/Datasheets/74HC595.pdf) Shift Register**  
   The **74HC595** is an **8-bit serial-in, parallel-out shift register** used for expanding output pins. It is often used in LED matrix displays to control multiple LEDs with fewer FPGA I/O pins. The FPGA shifts data into the register using a **serial clock (SCK) and latch enable (LE) signal**, allowing efficient control of large LED arrays.

4. **[MAX7219](https://www.analog.com/media/en/technical-documentation/data-sheets/max7219-max7221.pdf) LED Driver**  
   The **MAX7219** is a serially interfaced **LED driver** designed for controlling 7-segment displays, dot matrices, and bar graphs. It simplifies driving multiple LEDs by handling current regulation and multiplexing internally. Communication with the MAX7219 is done using a **simple SPI-like protocol**, making it an efficient solution for driving multiple digits or LED segments with minimal FPGA resources.

Each of these devices requires a *different* approach to interfacing with an FPGA. 

You can refer to these repositories for demos of following drivers in LucidV2 & its guide: 
1. [WS2812B](https://github.com/natalieagus/ws2812b-v2), [guide](https://natalieagus.github.io/50002/fpga/ws2812b)
2. [HUB75 RGB LED Matrix](https://github.com/natalieagus/rgb-led-matrix-driver-demo/blob/main/source/rgb_led_matrix_driver.luc) , [guide](https://natalieagus.github.io/50002/fpga/hub75)
3. [75HC595 Shift Register](https://github.com/natalieagus/sn74hc595-v2.git), [guide]({{ site.baseurl }}/fpga/sn74hc595)
4. [MAX7219](https://github.com/natalieagus/max7219-v2), [guide]({{ site.baseurl }}/fpga/max7219)

These are the same drivers but implemented in LucidV1. 
1. [WS2812B](https://github.com/natalieagus/ws2812b)
2. [HUB75 RGB LED Matrix](https://github.com/natalieagus/rgbledmatrix)
3. [75HC595 Shift Register](https://github.com/natalieagus/74hc595)
4. [MAX7219](https://github.com/natalieagus/max7219) 

If you're looking for 1D project sample for 50.002 in LucidV2, checkout [this repository](https://github.com/natalieagus/sample-1d-project-alchitry-v2).


## Br Board Schematic

This is our Br Board schematic: 
<img src="{{ site.baseurl }}//docs/FPGA/images/index/2024-12-04-17-34-54.png"  class="center_seventy"/>

Notice how it is different from the schematic uploaded on Sparkfun:

<img src="{{ site.baseurl }}//docs/FPGA/images/index/2024-12-04-17-36-34.png"  class="center_seventy"/>