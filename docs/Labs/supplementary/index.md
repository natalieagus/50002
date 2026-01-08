---
layout: default
title: Supplementary 
permalink: /labs/supp
has_children: true
parent: Labs
nav_order: 10
---

## Supplementary Lab
{: .no_toc}

Click on the sidebar to view various supplementary labs available in this course. They won't be graded, but they might be useful to enhance your knowledge or if you are up for extra challenge.

1. [**Digital Abstraction**]({{ site.baseurl }}/lab/supp-digital-abs): this lab uses JSim to simulate basic logic gates (AND/OR/XOR) and then tune transistor sizing to center an AND gate’s voltage transfer curve (VTC) so you can choose reliable logic thresholds (VOL/VOH/VIL/VIH) and maximize noise margin.
2. [**CMOS**]({{ site.baseurl }}/lab/supp-cmos): This lab uses JSim to measure propagation and contamination delays (tpd/tcd) of a CMOS NAND gate and a NAND-built half-adder by reading waveform threshold crossings and relating the results to critical and shortest paths under realistic output loading.
3. [**Beta IO on FPGA**]({{ site.baseurl }}/lab/supp-beta-io): This lab walks you through Beta CPU interrupt-driven shared-memory I/O by stepping a small assembly program on FPGA to see how user-mode code enters kernel handlers (reset/IRQ/ILLOP), reads input from a memory-mapped buffer, writes output to another buffer, and returns back to user mode via the supervisor bit.
4. [**Beta Assembly**]({{ site.baseurl }}/lab/supp-asm): This lab has you write and debug a Beta assembly subroutine for the “Moo” (bulls-and-cows) scoring algorithm, using the standard stack-based calling convention (BP/SP/LP) so it can be repeatedly called by an automated test jig.
