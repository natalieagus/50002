---
layout: default 
title: Useful Resources 
permalink: /resources
nav_order: 101
---

# Useful Resources 
{: .no_toc}

This page is dedicated to list certain useful and fun resources to aid your learning. 

### Fun Games 
[Digital Logic Simulator Game](https://sebastian.itch.io/digital-logic-sim).
[You're the OS Game](https://drfreckles42.itch.io/youre-the-os)

### Amazing Articles
[Putting the "You" in CPU](https://cpu.land): A nice article that explains how CPU works and more. 

### Verilog 

[Interactive Verilog Tutorial](https://hdlbits.01xz.net/wiki/Main_Page)

[Verilog Cheat Sheet](https://marceluda.github.io/rp_dummy/EEOF2018/Verilog_Cheat_Sheet.pdf)

### Wonderful Animations

[How does Computer Hardware work?](https://www.youtube.com/watch?v=d86ws7mQYIg)

[How does Computer Memory work?](https://www.youtube.com/watch?v=7J7X7aZvMXQ&t=1s)

[How do SSDs work?](https://www.youtube.com/watch?v=E7Up7VuFd8A)

[How do Smartphone CPUs work?](https://www.youtube.com/watch?v=NKfW8ijmRQ4)

### Videos

[How a CPU works? Apple M1 vs Intel i9](https://www.youtube.com/watch?v=vqs_0W-MSB0)

### Lucid Projects (V1, deprecated)

You can still run these using [Alchitry Labs 1.2.7](https://alchitry.com/alchitry-labs/#version-1-2-7). 

Instructor drivers (written in Lucid V1) for:
1. [WS2812B](https://github.com/natalieagus/ws2812b)
2. [HUB75 RGB LED Matrix](https://github.com/natalieagus/rgbledmatrix)
3. [75HC595 Shift Register](https://github.com/natalieagus/74hc595)
4. [MAX7219](https://github.com/natalieagus/max7219)

The sample 1D Project Repo: [Counter Game](https://github.com/natalieagus/counter-game).

Other [sample Alchitry Projects](https://github.com/natalieagus/SampleAlchitryProjects) written by instructors for reference.

{:.note}
We will incrementally upgrade the above projects to V2. You can also do it yourself, the syntax is 90% similar with the exception of for-loops and FSM as the major changes.

### Custom Br Board Reference

You can [download the full pdf from here](https://www.dropbox.com/scl/fi/6dhf0kirl7oki78hmlq7e/BrElementReferenceNEW.pdf?rlkey=57jzc7kdj9t57hm0p8vx01vq5&dl=0), or refer to the image below. Remember this is the pins you should use with the Custom Br board wings given to you (don't use the one from alchitry website).

<img src="{{ site.baseurl }}/docs/FPGA/images/fpga_applesilicon/br.png"  class="center_full no-invert"/>

### Beta Assembler and Emulator 

[Alex, A CSD senior from batch of 2024 wrote an emulator for Beta ISA](https://github.com/aleextw/beta_tui/tree/master). If creating your own ISA for the 1D project, you may use this as a starter for extending and defining your own opcodes. You can also modify this code to output the machine language of your Beta program to be pasted into your Lucid/Verilog file. 

He also wrote an assembler so that you can get the assembled machine language to be copied to your Lucid file conveniently. [We publish his assembler repository here](https://github.com/natalieagus/beta-assembler). 