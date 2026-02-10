---
layout: default
permalink: /fpga/fpga_vivado_verilog
title: Using Vivado + Verilog with Alchitry Au 
description: This document gives a brief overview of how you can use Vivado to generate bitstream for Alchitry AU FPGAs 
parent: 1D&2D Project (FPGA) 
nav_order:  3
---
* TOC
{:toc}


# Using Vivado + Verilog with Alchitry Au
{: .no_toc}

This guide is written for students who want to entirely skip using Alchitry Labs V2 and code their RTL in Verilog using Vivado (or other tools). You can use Verilog simulator like Icarus-Verilog to test and verify your code, and then turn to Vivado to compile the output.

{:.note}
Using Vivado is out of the syllabus, and we will not be giving you any tutorial on how to use it. This guide is meant exactly to generate a binary to be loaded to your Alchitry Au board.


## Overview

**Vivado** (from AMD/Xilinx) is a full FPGA toolchain. It can do the following tasks:
* Elaborate/simulate (with its own simulator, optional),
* **Synthesize** RTL into gates for a specific FPGA,
* **Place and route**,
* Generate outputs like **.bit** (bitstream) and optionally **.bin**, plus timing/utilization reports.

It is vendor-specific (Xilinx/AMD devices). When you clicked the build button, Alchitry Labs V2 IDE calls Vivado via CLI to generate the bitstream for you.

**Icarus Verilog (iverilog)** is mainly an **RTL simulator/compiler**. Many people use this instead of Vivado to:
* Compile and run Verilog testbenches, produce VCD waveforms.
* It does **not** synthesize for an FPGA and does **not** generate bitstreams.

It is great for fast unit tests and planning.

Here's a recommended workflow:
* Write RTL + testbench in your code editor of choice.
* Run **iverilog** for quick correctness checks.
* Use **Vivado** when you need synthesis, timing, and the **bitstream** for your FPGA and import the files you created in the previous steps

## Vivado Starter Project 

{:.important-title}
> Vivado 2025.2
>
> The starter project is created using Vivado 2025.2. If you do not use this version, you can create one from scratch by reading this section.

Clone [this](https://github.com/natalieagus/vivado-2025-2-starter-alchitry-au-v1-io-demo.git) repository to obtain the starter code.

This contains the same code that implements the IO V1 Demo Pulldown project that you can create using Alchitry Labs, to run on Alchitry Au FPGA:

<img src="{{ site.baseurl }}//docs/FPGA/images/vivado-verilog/2026-02-10-16-28-13.png"  class="center_seventy no-invert"/>

### Open the Project

Opening the project should give you this window.

<img src="{{ site.baseurl }}//docs/FPGA/images/fpga_applesilicon/2026-02-10-09-40-52.png"  class="center_seventy no-invert"/>

You can try to Generate Bitstream (bottom left of the window) to **compile** the sources. After synthesis and implementation is completed, you should find the binary `alchitry.bin` under the directory `<PROJECT_DIR>/<PROJECT_NAME>.runs/impl_1/alchitry_top.bin`:

<img src="{{ site.baseurl }}//docs/FPGA/images/fpga_applesilicon/2026-02-10-09-42-36.png"  class="center_seventy no-invert"/>

### Alchitry Loader

Use Alchitry Loader to load the `.bin` file to the FPGA.

First, you need to have Alchitry Labs installed. Download Alchitry Lab 2 from [here](https://alchitry.com/alchitry-labs/).

Then switch to Alchitry Loader first: 

<img src="{{ site.baseurl }}/docs/FPGA/images/fpga_applesilicon/2024-03-18-14-34-46.png"  class="center_full no-invert"/>

Find the synthesized binary and load it to your Alchitry Au FPGA: 

<img src="{{ site.baseurl }}//docs/FPGA/images/fpga_applesilicon/2024-10-07-11-22-40.png"  class="center_full no-invert"/>


## Create a New Vivado Project (From Scratch)

This section is written to help you set up a new Vivado project if you can't open the starter project given because of version differences (you did not use 2025.2).
