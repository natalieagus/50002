---
layout: default
permalink: /lab/lab1
title: Lab 1 - CMOS
description: Lab 1 handout covering topics from Digital Abstraction, CMOS Technology, and Logic Synthesis
parent: Labs
nav_order:  2
---

* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design
<br>
Modified by: Natalie Agus (2024)

# Lab 1: CMOS
{: .no_toc}

## Starter Code 
The starter code required for this lab is inside `jsim-kit` repository you've cloned for Lab 0 last week. If you've lost it, clone it again:

```sh 
git clone https://github.com/natalieagus/jsim-kit.git
```


## Related Class Materials
The lecture notes on [Digital Abstraction](https://natalieagus.github.io/50002/notes/digitalabstraction) and [CMOS Technology](https://natalieagus.github.io/50002/notes/cmostechnology) are closely related to this lab.


**Task 1 & 2:** measuring tpd and tcd of a **nand** gate
<br>Related Notes: **CMOS Technology**
  * [Timing Specifications of Combinational Logic Devices](https://natalieagus.github.io/50002/notes/cmostechnology#timing-specifications-of-combinational-logic-devices)
  * To analyse the relationship between setup time, hold time, contamination delay, and propagation delays


**Appendix Task:** studying the effect of MOSFET “ON” and MOSFET “OFF”. 
<br>Related Notes: **CMOS Technology**
  * [Types of MOSFETs](https://natalieagus.github.io/50002/notes/cmostechnology#types-of-mosfets)
  * [Switching PFET and NFET ON and OFF](https://natalieagus.github.io/50002/notes/cmostechnology#switching-nfets-and-pfets-onoff)
  * Realise that producing a logic ‘1’ is not always perfect, 
  * Highly depends on the MOSFET’s conductivity 
  * An “OFF” MOSFET isn’t always 100% off, there exist leaky current


## Measuring Timing Specifications

Open `lab1_task1_and_2.jsim`. We have written a netlist for you to **measure** the propagation delay (tpd) and the contamination delay (tcd) of a given nand (not and) gate:

```cpp
.include "nominal.jsim"
.include "custom_gates_lab1.jsim"

* test jig for measuring tcd and tpd
Xdriver vin nin inv
Xtest vdd nin z nand2
* simulate load at the output terminal of nand2 gate
Cload z 0 .02pf
Vin vin 0 pulse(3.3,0,5ns,.1ns,.1ns,4.8ns)

* helper plots to make measurements earlier 	
Vol vol 0 0.3v   
Vil vil 0 0.6v
Vih vih 0 2.6v
Voh voh 0 3.0v

.tran 15ns
.plot nin z vol vil vih voh
```

The netlist above describes this circuit setup (load at Z not drawn. Head to [appendix](#adding-load-at-output-terminal) if you're interested to find out more on why we need to add the load to measure tpd and tcd):

<img src="{{ site.baseurl }}/docs/Labs/images/lab0/cs-2025-lab1-task1.drawio.png"  class="center_thirty"/>


The truth table of a NAND gate is the inverse logic of the AND gate (output is digital `1` except when both `A` and `B` inputs are `1`): 

A | B|  Z
---------|----------|---------
0 | 0 | 1
0 | 1 | 1
1 | 0 | 1
1 | 1 | 0


# Appendix
## Adding Load at Output Terminal

When measuring propagation and contamination delays of logic gates like a NAND gate, it's **essential** to include a load at the output terminal (usually this output terminal is denoted as z). The "load" can be a resistor, another gate input, or a capacitive load. It is directly connected to the output terminal of the gate being tested. This setup is used to **simulate** the real conditions under which the gate would operate within a **larger circuit**, <span class="orange-bold">affecting its delay measurements</span>.

Here are the key reasons for adding a load during these measurements:

1. **Realistic Operating Conditions**: Logic gates in practical circuits do not operate in isolation; they drive other gates or circuit elements. Adding a load to the Z terminal simulates the realistic conditions under which the gate will operate, ensuring that the measurements reflect actual use.

2. **Capacitive Loading**: Logic gates typically drive capacitive loads, which include the input capacitances of subsequent gates and any inherent wiring capacitance. This loading affects how quickly the output can change state, which in turn influences both the propagation delay (the time it takes for an input change to affect the output) and the contamination delay (the minimum time before the output begins to reflect a change at the input).

3. **Propagation Delay Measurement**: Propagation delay is the time it takes for an input change to propagate through the gate and cause a stable change at the output. This delay is affected by the time it takes to charge or discharge the capacitance at the output (load capacitance). Without a realistic load, the output might switch faster or slower than it would in a typical circuit environment, leading to inaccurate measurements.

4. **Contamination Delay Measurement**: Similar to propagation delay, the contamination delay can be influenced by how quickly the output can begin to change state, which is affected by the output's ability to overcome the load capacitance.

5. **Signal Integrity and Drive Capability**: Including a load tests the gate's ability to drive outputs under different loading conditions. This is crucial for assessing the gate's drive strength and its performance in terms of signal integrity.

6. **Preventing Oscillations**: In some cases, especially with high-speed digital circuits, the absence of a load can lead to signal integrity issues like ringing or oscillations at the output due to unmatched impedance or lack of damping provided by the load.

In summary, adding a load to the output of a logic gate during delay measurements ensures that the results are representative of real-world conditions, taking into account the effects of load on the gate’s switching characteristics. This approach helps in designing more **reliable** and **efficient** digital circuits by providing accurate data for optimizing gate configurations and circuit layouts.



