---
layout: default
permalink: /lab/mhp
title: 1D Part 1 - MHP
description: MHP Handout as part of 1D project
parent: Labs
nav_order:  1
---

* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design
<br>
Modified by: Kenny Choo, Natalie Agus, Oka Kurniawan (2021)

# 1D Part 1 - Mini Hardware Project 

This project is **part 1** of your 1D project (with **part 2** being your Electronic Game Hardware Project, details in the course handout). This part 1 weighs 4% of your total assesment, while part 2 weighs 25%. The goal of this project is to familiarise yourself with:
1. The behavior of a few logic gates, 
2. Basic wiring and using the breadboard
3. Soldering various hardware components: switches, LEDs, resistors, logic gates

By the end of this project you should be able to:
* **Measure** static input-output relationship of the logic gates.
* **Design** a simple 1 bit digital adder.
* **Examine** the **functionality** of a simple digital adder.
* **Implement** a simple digital adder on a strip-board with a user interface.

## Deliverables
You are tasked to make a **1-bit FULL adder** using basic logic gates provided in your 1D kit, and **solder** the circuit on a stripboard. See our course handout for further submission details on sample submission photo. 

## Basics of Breadboard
The **breadboard** can be use to **prototype** your circuit design fast without the need to solder anything. Take out a breadboard, battery pack, LED, resistor, a few jumper wires, and assemble the following simple circuit. 

<img src="{{ site.baseurl }}/assets/images/mhp/MHP-1_led.png"  class="center_seventy"/>

The two **horizontal** rows at the top and the bottom of the breadboard (when viewing the breadboard this way) are connected **horizontally** and are usually used for **power** and **ground** lines. Each vertical column (labeled 1 to 63 above) are connected **vertically**. 

The battery's positive terminal (cathode or VDD) and negative terminal (anode or GND) terminals are connected to each of the first two rows in the breadboard. These are the "power lines". 


The LED is connected at column 48 and 49 as shown above:
* The **longer** leg (called anode, or "positive" side) is connected at column 49 
* The **shorter** leg (called cathode, or "negative" side) is connected at column 48 
* Electrons will travel from anode (positive side) to cathode (negative side) and **never** the other way around 

{: .note}
> The battery's **positive** terminal is called cathode, while its **negative** terminal is called anode. The terms "anode" and "cathode" can be **confusing**, because it's "flipped" in the LED. The thing to remember is that **conventional current** always flows from cathode to anode, which means **electrons** travel from anode towards cathode. 
> 
> In a battery cell, the electrons in the circuit move **towards** the (+) terminal, which is a cathode. By extension, the (-) terminal is the anode. 
> 
> See the diagram below to let it *sink* in. Ask yourself, which way the **current** flows? Clockwise or anticlockwise? Then, which way the **electron** flows?

<img src="{{ site.baseurl }}/assets/images/mhp/2022-12-21-17-56-45.png"  class="center_thirty"/>

The LED is connected in **series** with the resistor (it's beyond this class to compute how many Ohm is needed, but you can easily google it). A resistor is needed to not blow up the LED. An AA battery supplies 1.5V each. If you use a 4-battery pack, it will supply 6V, if you use a 2-battery pack, it will supply 3V. A typical LED requires only approximately 2V and 20mA (depends on the color and size). 

{: .note}
Take a look at basic documentation of a [5mm red LED](https://www.sparkfun.com/products/9590)  vs [5mm blue LED](https://www.sparkfun.com/products/11372) vs [10 mm super bright red LED](https://www.sparkfun.com/products/8862). They are all different.

That means given a 4-battery pack power supply ($V_{dd}$ = 6V) and a single 2V, 20mA small LED, we need a resistor with value of:

$$
R = \frac{V_{dd}-V_{led}}{I_{led}} = \frac{6-2}{0.02} = 200 \Omega
$$

### Task 1

{: .new-title}
> Light up the LED
> 
> Ensure that you can assemble the circuit above and get your LED lit up before proceeding.

Then, head to eDimension and answer a few questions pertaining to this task. 

## Logic Gates

We have provided a few **logic gates** in the box as shown. Click on the corresponding datasheet to know what each pin is for. 

Component | Description | Datasheet
---------|----------|---------
 74HC00 | Quad 2-input NAND gate | [74HC00.pdf](https://www.diodes.com/assets/Datasheets/74HC00.pdf)
 74HC02 | Quad 2-input NOR gate | [74HC02.pdf](https://assets.nexperia.com/documents/data-sheet/74HC_HCT02.pdf)
 74HC04 / 74H04 | Hex inverting buffer gate | [74HC04.pdf](https://www.diodes.com/assets/Datasheets/74HC04.pdf)
74HC08 | Quad 2-input AND gate | [74HC08.pdf](https://www.diodes.com/assets/Datasheets/74HC08.pdf)
74HC32 | Quad 2-input OR gate | [74HC32.pdf](https://www.diodes.com/assets/Datasheets/74HC32.pdf)
74HC86 | Quad 2-input exclusive OR gate | [74HC86.pdf](https://www.diodes.com/assets/Datasheets/74HC86.pdf)

Let's figure out the **functionality** of each of these logic gate by assembling them on the breadboard. 

### Example: 74HC00
Let's take into example this Quad NAND gate (74HC00). Assemble it on your breadboard as follows:

<img src="{{ site.baseurl }}/assets/images/mhp/MHP-1_NAND.png"  class="center_seventy"/>

If you open its [datasheet](https://www.diodes.com/assets/Datasheets/74HC00.pdf), you'll notice that it has 14 pins labeled as 1 to 14. The figure on the right shows the <span style="color:red; font-weight: bold;">functionality</span> of each of this pin. It shows that there are four **independent** NAND gates inside 74HC00 (it's like buy 1 get 3 free). 

<img src="{{ site.baseurl }}/assets/images/mhp/2022-12-21-17-02-09.png"  class="center_fifty"/>

To power on the logic gate, **pin 7** is to be connected to GND (negative terminal of your battery) and **pin 14** is to be connected to VCC (also known as VDD, which is the positive terminal of your battery). Then we can supply **inputs** at pin 1 (1A) and pin 2 (1B), and read the output at pin 3 (1Y). 
* If we supply inputs at pin 12 (4A) and 13 (4B), we can read the output at pin 11 (4Y)
* The same logic goes to the rest of the pins 

{: .warning}
<span style="color:red; font-weight: bold;">Remember</span> that (1A, 1B, 1Y), (2A, 2B, 2Y), (3A, 3B, 3Y), (4A, 4B, 4Y) are all **independent** of each other. They are 4 separate logic gates. It's just that they're all soldered together into a little chip for economic reason (it's more expensive to buy 4 separate ones).

### I/O
The **inputs** in the above breadboard schematic is represented by the <span style="color:green; font-weight: bold;">green</span> wires (there are two input lines), and the **output** is represented by the <span style="color:orange; font-weight: bold;">yellow</span> wire. We connect each of the green wires to positive and negative terminal of the batteries. This represents a digital input of `0` (if connected to battery's negative terminal, which can be considered as GND) and `1` (if connected to battery's positive terminal) respectively. 

We use an LED to **read** the output signal. If the LED is on, then the output corresponds to digital value `1` (basically high voltage), and if the LED is off, then the output corresponds to digital value `0` (basically low voltage).





