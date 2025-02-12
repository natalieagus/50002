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


## I/O Drivers 
You can refer to these repositories for the following drivers in LucidV2: 
1. WS2812B (TBC)
2. HUB75 RGB LED Matrix (TBC)
3. 75HC595 Shift Register (TBC)
4. MAX7219(TBC)

These are the same drivers but implemented in LucidV1. Please adapt it to LucidV2 on your own if you visit this page and the above is still TBC. 
1. [WS2812B](https://github.com/natalieagus/ws2812b)
2. [HUB75 RGB LED Matrix](https://github.com/natalieagus/rgbledmatrix)
3. [75HC595 Shift Register](https://github.com/natalieagus/74hc595)
4. [MAX7219](https://github.com/natalieagus/max7219) 

If you're looking for 1D project sample for 50.002 in LucidV2, checkout [this repository](https://github.com/natalieagus/sample-1d-project-alchitry-v2).


**More materials that are recommended:**
1. [Background tutorial](https://alchitry.com/tutorials/background/)
2. [Your First FPGA Project](https://alchitry.com/tutorials/lucid_v1/your-first-fpga-project/) and [external IO setup](https://learn.sparkfun.com/tutorials/external-io-and-metastability/all) 
3. [Synchronous Logic](https://alchitry.com/tutorials/lucid_v1/synchronous-logic/) (Related to Week 3 materials)
4. [Io Element Project](https://alchitry.com/tutorials/lucid_v1/io-element/)
5. [ROM and FSMs Project](https://alchitry.com/tutorials/lucid_v1/roms-and-fsms/) (Related to Week 2-5 materials)
6. [Basic CPU](https://alchitry.com/tutorials/lucid_v1/hello-your-name-here/)  (Related to Beta CPU)
7. [DDR3 RAM](https://alchitry.com/tutorials/lucid_v1/ddr3-memory/) (intermediate) 

## Br Board Schematic

This is our Br Board schematic: 
<img src="{{ site.baseurl }}//docs/FPGA/images/index/2024-12-04-17-34-54.png"  class="center_seventy"/>

Notice how it is different from the schematic uploaded on Sparkfun:

<img src="{{ site.baseurl }}//docs/FPGA/images/index/2024-12-04-17-36-34.png"  class="center_seventy"/>