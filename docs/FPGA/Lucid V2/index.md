---
layout: default
title: Lucid V2 
permalink: /fpga/lucid-v2/intro
has_children: true
parent: 1D&2D Project (FPGA)
nav_order: 5
---

# Lucid V2 
{: .no_toc}

You can find FPGA tutorials using Lucid V2 in the **sidebar**. If you find any bugs, please make a PR or report it to your instructor.

If you're familiar with Lucid V1, Lucid V2 comes with a few breaking changes (although they are 90% similar and shouldn't be too difficult to get used to). Read [this](https://alchitry.com/news/lucid-1-vs-2/) post to find out more about the breaking changes. 

Here are the list of guides written so far, separated by categories.

### Debug and Mistakes-Related

* [**Debugging Strategies**]({{ site.baseurl }}/fpga/fpga_8_2024): a collection of debugging strategies depending on the severity of your bugs. Refer to each section depending on your needs. 
* [**Pitfalls**]({{ site.baseurl }}/fpga/fpga_5_2024): a collection of common pitfalls and bugs when programming in Lucid HDL
* [**Testbench**]({{ site.baseurl }}/fpga/test_bench): using Alchitry IDE's testbench to speed up development

### Alchitry Hardware Guides

* [**Alchitry Pinout**]({{ site.baseurl }}/fpga/fpga_4_2024): how to connect external I/O devices to your Alchitry boards.

### Clock-Related

* [**Board Reset**]({{ site.baseurl }}/fpga/fpga_1_2024): how to properly reset your system so that they are all synchronized and comes out of reset at the same time
* [**Clocks**]({{ site.baseurl }}/fpga/clocks): how to generate other clock signals other than 100MHz by default

### Drivers

* [**WS2812B (NeoPixel):**]({{ site.baseurl }}/fpga/ws2812b) an addressable RGB LED where each LED has a built-in driver so you send a timed one-wire data stream and each LED latches its own 24-bit color and forwards the rest down the chain.
* [**MAX7219:**]({{ site.baseurl }}/fpga/max7219) a serially controlled LED matrix/7-seg driver IC that multiplexes 8 digits (8x8 matrix) with built-in current regulation, letting you update the display by writing registers over SPI-like signals.
* [**SN74HC595:**]({{ site.baseurl }}/fpga/sn74hc595) an 8-bit serial-in, parallel-out shift register that shifts bits in on a clock and then latches them to 8 output pins (and can be daisy-chained for more outputs).
* [**RGB LED Matrix (HUB75, Adafruit-style panels):**]({{ site.baseurl }}/fpga/hub75) a scanned (multiplexed) RGB panel interface where you stream pixel data into shift registers for the active row pair and use row-address and latch/clock signals to refresh the display continuously.

### Useful Modules

* [Random Number Generator]({{ site.baseurl }}/fpga/fpga_2_2024)
* [Seven Segment]({{ site.baseurl }}/fpga/fpga_3_2024): detailed guide on how 7segs work