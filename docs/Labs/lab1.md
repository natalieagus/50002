---
layout: default
permalink: /lab/lab1
title: Lab 1 - Digital Abstraction (HDL)
description: Lab 1 handout covering topics from binary counting and digital abstraction
nav_order:  3
---

* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design
<br>

# Lab 1: Digital Abstraction (HDL)
{: .no_toc}


## Starter Code
There's no starter code for this lab. You simply need to have [Alchitry Labs V2](https://alchitry.com/alchitry-labs/) installed. You don't need Vivado for this lab, we are only going to run simulations. 

{:.important}
Consult FPGA resources [listed here](https://natalieagus.github.io/50002/fpga/intro) before coming to the lab or after the lab to enhance your knowledge on FPGA programming in general. This will greatly accelerate the quality of your 1D & 2D project. 

## Related Class Materials
The lecture notes on **[digital abstraction](https://natalieagus.github.io/50002/notes/digitalabstraction)** and **[basics of information](https://natalieagus.github.io/50002/notes/basicsofinformation)** are closely related to this lab.


## Introduction to FPGA Development 

In this lab, we'll explore basics of HDL for FPGA Development. This is crucial for your 1D project, where you're tasked to create an electronic hardware prototype from combinational and sequential logic components using FPGA, that serves as an application of materials you learn in 50002.

{:.important}
Unlike software simulations, FPGAs let you directly program hardware, giving you a real-world, hands-on understanding of how digital systems work. 

**FPGAs offer**:

1. Flexibility: Easily reprogram and experiment with different designs.
2. Real-time Feedback: See your circuits in action, running in parallel.

You have been given the **Alchitry Au FPGA development kit**, which includes I/O ports for **easy** connections to external devices. It’s a cost-effective option compared to full-scale Xilinx boards, making it **ideal** for education. 

To program the FPGA, we'll use the **[Lucid V2](https://alchitry.com/tutorials/lucid-reference/)** hardware description language (HDL), which is simpler (in syntax) than traditional HDLs like Verilog, making it easier to learn. **[Alchitry Labs](https://alchitry.com/alchitry-labs/)** will be our development environment (IDE), converting Lucid into Verilog for synthesis in Vivado. 

{:.note-title}
> Why not Vivado + Verilog?
> 
> Vivado is the industry-standard tool for FPGAs. However, both Vivado and Verilog have <span class="orange-bold">steep</span> learning curves, especially for beginners. It is not suitable for 50.002 because we need to cover a lot of foundational topics—ranging from MOSFETs and transistors to operating systems. Alchitry Labs, will handle the conversion to Verilog in the background, so you can <span class="orange-bold">focus</span> on **learning the core concepts without diving into the complexities of Verilog or Vivado**.

When you "program" an FPGA, you are configuring its logic cells and connections to implement your desired digital circuit or design. This is <span class="orange-bold">different</span> from programming software, as you are actually defining hardware behavior within the FPGA.

{:.important}
> The **Alchitry Au FPGA development kit** hardware given to you is the **original** version purchased prior to 2025, [not the V2](https://shop.alchitry.com/products/alchitry-au). Do <span class="orange-bold">not</span> confuse this to the AlchitryLabs IDE version (V2) and Lucid version (also V2). 
>
> We are using Lucid V2 with Alchitry Labs V2 to code, + Vivado to compile the binary to be loaded to our Alchitry Au FPGA. 
>
> Prior to 2025, we were using Alchitry Labs 1.2.7 and Lucid V1. It worked well, but there's no simulation so development is kind of rough. The V2 IDE supports simulation which **improves** the learning experience greatly. 

### Create New Project

Create a new project with Blinker Demo as a template. Choose <span class="orange-bold">Alchitry Au</span> (<span class="orange-bold">not</span> Alchitry Au V2!). This is our FPGA development board.

<img src="{{ site.baseurl }}//docs/Labs/images/lab2/2024-10-19-08-27-05.png"  class="center_seventy no-invert"/>

There a few Lucid (`.luc`) source files created: 
1. `alchitry_top.luc`: This is the **top-level** file, like a "main" file. It connects all submodules and interfaces with external I/O. The ports are defined in this top-level file, while the constraint file (.acf) **maps** them to physical FPGA pins. 
2. `blinker.luc`: this is a custom module containg the logic of LED blinking 
3. `reset_conditioner.luc`: this is a module obtained from Alchitry component library. It synchronizes the reset button so that all modules in the FPGA can receive the reset signal **at the same time**. 
4. `Constraint files: alchitry.acf`: a constraint file **maps** the FPGA I/O pin with a logical name that you can define in `alchitry_top.luc`, so that you can define the logic to control these I/Os.

### Module 

This section briefly explains basic Lucid V2 syntax. Lucid V2 is a great language to program **simple** behavior on the FPGA which is sufficient for 50.002. 

{:.important}
You are <span class="orange-bold">strongly</span> recommended to give the [official reference guide a read](https://alchitry.com/tutorials/lucid-reference/) to obtain further information. 

Modules are the core building blocks of any Lucid project. They encapsulate specific functionality, allowing you to design complex circuits by breaking them into smaller, manageable components. Each module can have parameters and ports that define how it interacts with other parts of the design. The general structure for a module declaration in Lucid is:

```verilog
module module_name #(
    // optional parameter list
)(
    // port list
) {
    // module body
}
```

{:.note}
By organizing your design into modules, you create **reusable**, **testable** blocks that can be **combined** to form larger systems.

For instance, the `blinker.luc` module is written as follows:

```verilog
module blinker (
    input clk,   // clock
    input rst,   // reset
    output blink // output to LED
) {
    dff counter[26](.clk(clk), .rst(rst))
    
    always {
        blink = counter.q[25]
        counter.d = counter.q + 1
    }
}
```

It is designed to create a **blinking** signal that can drive an LED, **toggling** it on and off at a set interval. It uses a clock signal (`clk`) and a reset signal (`rst`) to control the timing of the blink.

#### Port List 
- **Inputs**: 
  - `clk`: 1 bit clock signal, which drives the timing of the module.
    - By default, the FPGA supplies 100MHz clock (defined in the constraint file `alchitry.acf`)
    - You **can change** this value if your design fail to meet timings, e.g: 10MHz instead
  - `rst`: 1 bit reset signal, which sets the counter back to its initial state (if stated) when triggered.
  
- **Output**: 
  - `blink`: 1 bit output signal that drives the LED, toggling it on and off.

#### Module Body (module instances)
- **Counter**: The module uses a 26-bit **flip-flop-based counter** (`dff counter[26]`), which **increments** its value on each clock cycle. When instantiating the `dff` module, we connect the `clk` and `rst` input signal to the dff's port. This is so that counter’s (dff) state is updated based on the clock (`clk`) and can be reset using the reset signal (`rst`).

#### Module Body (always block: internal logic)
- **Blink Control**: 
  - Assuming the 1st bit of the counter is `counter[0]` (LSB), then,
  - The **blink** signal is assigned the value of the 26th bit (MSB) of the counter. This effectively divides the clock by $$2^{26}$$, slowing down the frequency to a human-visible rate for blinking.

{:.note}
Dividing  default onboard 100 MHz by $$2^{26}$$ results in a frequency of approximately 1.49 Hz, meaning that the signal toggles 3 times per 2 seconds (approximately). Each time the signal toggles, it goes from **on to off** *or* **off to on**. Since this toggle happens 3 times every 2 seconds, the LED will change its state (on to off, or off to on) at that rate. Therefore, the blink will turn on and off once every 1.34 seconds, with both the on and off states taking about 0.67 seconds each.

- **Incrementing the Counter**: 
  - The counter's value (`counter.d`) is updated by adding 1 to the current value (`counter.q + 1`), causing it to increment on **each** clock cycle.


With this logic, `blinker` module uses a 26-bit counter to divide the clock signal down, and the 25th bit is used to toggle the `blink` output. As the counter increments, the `blink` signal toggles between high and low, creating a blinking effect that can be used to drive an LED.

### The `always` Block: Unlike Sequential Programming

{:.warning-title}
> The always block
> 
> In hardware description languages like Lucid, the **`always` block** represents **continuous and parallel execution**, <span class="orange-bold">unlike</span> traditional sequential programming where instructions are executed one after the other. It is used to define connections and relationships between different signals happening in parallel, rather than executing sequential instructions like in software programming.

In the `blinker` module, the **`always` block** ensures that certain operations happen **simultaneously** on <span class="orange-bold">every clock cycle</span>:
- **`blink = counter.q[25]`** constantly updates the `blink` output to match the 25th bit of the counter.
- **`counter.d = counter.q + 1`** continuously increments the counter by 1 on each clock cycle.
- The counter increments on each clock cycle.
- The blink output is continuously updated based on the 25th bit of the counter.
- Both operations (updating blink and incrementing counter) happen in parallel on every clock edge.
- **No explicit loop is needed—everything updates with the clock signal.**

This is inherently different from sequential programming where instructions are executed in a specific order, one after another. In sequential programming, the logic is executed step-by-step, and you would need an explicit loop to simulate the continuous behavior. Here's the same functionality in Python:

```py
def blinker():
    counter = 0
    blink = 0
    while True:
        blink = (counter >> 25) & 1  # Update blink based on the 25th bit of the counter
        counter += 1  # Increment the counter
        time.sleep(1 / clock_frequency)  # Simulate clock delay
```

In the code above:
* The counter is incremented **manually** in each iteration of the loop.
* The blink value is **recalculated** after every iteration based on the 25th bit of the counter.
* This code runs in a <span class="orange-bold">sequential</span> loop, step by step, with a delay (time.sleep()) to simulate the clock.
* Operations are sequential: first, the counter increments, then the blink value is updated, then the process pauses before repeating.

{:.highlight-title}
> Timing
>
> In hardware, the timing is inherently tied to the clock signal, which runs as long as the circuit is powered. In software, you need to introduce artificial delays (e.g., `time.sleep()`) to mimic clock behavior.


Let's compare that again with Lucid’s/HDL `always` block:

```verilog
   always {
        blink = counter.q[25]
        counter.d = counter.q + 1
    }
```

- Both lines of code are evaluated in **parallel** on each clock cycle.
- The operations happen in a **non-blocking** manner, meaning the update of the counter and the assignment to the `blink` output are done concurrently, not one after the other.

*This parallelism is key to understanding how digital logic works—everything inside an FPGA is happening at the same time, driven by the clock, unlike the step-by-step flow of traditional programming.*

### `alchitry_top`

This is the main file that interfaces with the I/O ports. 

```verilog
module alchitry_top (
    input clk,              // 100MHz clock (by default)
    input rst_n,            // reset button (active low)
    output led[8],          // 8 user controllable LEDs
    input usb_rx,           // USB->Serial input
    output usb_tx           // USB->Serial output
)
```

The `blinker` module is instantiated here and then connected to `led`, which is the 8 LEDs connected to the side of the Alchitry Au Board. The reset button is also situated there. The input `clk` is powered by the FPGA, defaulted to `100MHz` unless you update the constraint file. 

<img src="{{ site.baseurl }}//docs/Labs/images/lab2/2024-10-23-14-11-25.png"  class="center_seventy no-invert"/>

> You can ignore `usb_rx` and `usb_tx`. You are not required to use them in this course. 


### Simulate
Alchitry Lab V2 offers the feature of **simulation** with a much slower clock (1000Hz) to test your design before spending a few minutes synthesizing it. You can click the Simulate button to view the simulator:

<img src="{{ site.baseurl }}//docs/Labs/images/lab2/2024-10-19-08-52-08.png"  class="center_seventy no-invert"/>

Right now you won't see the LED blinking because the simulation clock **runs** on 1000Hz clock instead of 100MHz. We are dividing 1000Hz clock by $$2^{26}$$, which results in a frequency of  0.0000149 Hz, or about 1 toggle every  67108  seconds (around 18.6 hours). We need to change the value "25" into something else more suitable for the simulator such as 9 so that it divides the 1000Hz clock by $$2^{10}$$: $$\frac{1000}{2^{10}} = 0.98 Hz$$, or 1 toggle every 1 second. 

Add this line of code in `blinker.luc`:

```verilog
    always {
        blink = counter.q[$is_sim() ? 9 : 25] // set value conditionally
        counter.d = counter.q + 1
    }
```

This means that we will use the value `25` when we synthesize the code for the FPGA, and the value `9` during simulation. 

You should now see the LED blinks in the simulation: 

<img src="{{ site.baseurl }}/docs/Labs/images/blinker.gif"  class="center_seventy no-invert"/>
