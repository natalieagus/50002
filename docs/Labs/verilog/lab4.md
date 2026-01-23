---
layout: default
permalink: /lab/lab4-verilog
title: Lab 4 - Control Sequencing
description: Lab 4 handout covering topics from FSM
nav_order:  5
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

# (Verilog) Lab 4: Control Sequencing
{: .no_toc}

This is a Verilog parallel of the Lucid + Alchitry Labs Lab 4. It is not part of the syllabus, and it is written for interested students only. You still need to complete all necessary checkoffs in Lucid, as stated in the original lab handout.

{:.important}
If you are reading this document, we assume that you have already read Lab 4 Lucid version, as some generic details are not repeated. This lab has the same objectives and related class materials so we will not paste them again here. For submission criteria, refer to [the original lab 4]({{ site.baseurl }}/lab/lab4) handout.


## Control Sequencing with Finite State Machines

In this lab, you are going to **implement** an FSM + Datapath, and **write testbenches** to ensure that the wirings are done properly. In particular, you are going to build an automated registered adder tester. Afterwards, you are going to **build** the project using Vivado, and **load** the binary to your FPGA using Alchitry Loader.

{:.important-title}
> Installation
>
> [Vivado (free standard edition)](https://www.xilinx.com/support/download.html) and [Alchitry Loader (part of Alchitry Labs)](https://alchitry.com/alchitry-labs/) is required for this lab. Please install them. If you are using macOS, you cannot install Vivado on your system. Read alternatives [here](https://natalieagus.github.io/50002/fpga/fpga_applesilicon).

### The Datapath

Following Lab 4 Lucid Version, the proposed datapath is as follows: 

<img src="{{ site.baseurl }}/docs/Labs/images/cs-2026-50002-datapath-lab4.drawio-4.png"  class="center_full"/>

You are free to modify them but we are going to stick with implementing the above in this handout.

### The FSM

The proposed FSM that will produce the control signals for the datapath is as follows:

<img src="{{ site.baseurl }}/docs/Labs/images/cs-2026-50002-fsm.drawio-2.png"  class="center_full"/>

The rest of this handout will touch on how we can implement the above in Verilog.


## Implementing an FSM in Verilog

