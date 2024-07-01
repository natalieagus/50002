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
  * To derive contamination delay and propagation delays of a gate from waveforms

**Task 3 & 4:** measuring tpd and tcd of a half-adder unit 
<br>Related Notes: **CMOS Technology**
  * [Combinational Logic Devices](https://natalieagus.github.io/50002/notes/digitalabstraction#a-digital-processing-element-combinational-device-and-combinational-digital-system)
  * [Timing Specifications of Combinational Logic Devices](https://natalieagus.github.io/50002/notes/cmostechnology#timing-specifications-of-combinational-logic-devices)
  * To derive contamination delay and propagation delays of a combinational logic unit from waveforms

**Appendix Task:** studying the effect of MOSFET “ON” and MOSFET “OFF”. 
<br>Related Notes: **CMOS Technology**
  * [Types of MOSFETs](https://natalieagus.github.io/50002/notes/cmostechnology#types-of-mosfets)
  * [Switching PFET and NFET ON and OFF](https://natalieagus.github.io/50002/notes/cmostechnology#switching-nfets-and-pfets-onoff)
  * Realise that producing a logic ‘1’ is not always perfect, 
  * Highly depends on the MOSFET’s conductivity 
  * An “OFF” MOSFET isn’t always 100% off, there exist leaky current


## Measuring Timing Specifications of a Gate
In the last lab, we tried to vary the MOSFET's width and length to try to **center** the resulting logic gate (made of those MOSFETs) VTC and optimise the noise margin. Remember that VTC's steepness and graph characteristics (how centered it is, gradient, etc), does <span class="orange-bold">not directly</span> imply the **speed** of getting a particular output Vout.

{:.important}
The **shape**, **steepness**, and **centeredness** of the VTC <span class="orange-bold">do not directly indicate the switching speed</span>, including propagation delay (tpd) and contamination delay (tcd), of the gate. These characteristics reflect the **static** response of the gate, while the speed of obtaining a valid output from a valid input is determined by **dynamic** factors such as capacitance, drive strength, load, and supply voltage.


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

When we set one of the inputs of the NAND gate as `vdd`, we essentially turn our NAND gate into an **inverter**

{: .warning-title}
> tcd and tpd
> 
> The contamination delay, **tcd**, for the `nand2` gate will be a **lower** bound for all the tc measurements we make. Similarly, the propagation delay, **tpd**, for the `nand2` gate will be an **upper** bound for all the tP measurements. 
>
> *Why is this so?*

Following standard practice, we have choosen the voltage thresholds for you as follows:
* Vol = 10% of power supply voltage = .3V
* Vil  = 20% of power supply voltage = .6V
* Vih  = 80% of power supply voltage = 2.6V
* Voh = 90% of power supply voltage = 3V

Click the **device-level simulation** to obtain the output waveform: 
<img src="{{ site.baseurl }}//docs/Labs/images/lab1/2024-06-28-09-34-22.png"  class="center_seventy no-invert"/>


### Task 1: Measure Contamination Delay (tcd)

{:.note-title}
> Definition
> 
> Recall from our lecture that **contamination delay is the minimum time from an invalid input to an invalid output,** i.e., from the moment the input begins to change to when the output starts to change, indicating the earliest point at which the output may become invalid due to an input change.

{:.warning}
Revise the lecture on [Digital Abstraction](https://natalieagus.github.io/50002/notes/digitalabstraction) if you're still confused about this concept of **valid** or **invalid** digital values

To measure the gate's **contamination** delay, we need to find two values from the waveform: **tc rise** and **tc fall** and taking the **minimum** of the two. 
* These two values are the **contamination** delay in the case where output is transitioning from low to high (tc rise), and from high to low (tc fall). 
* The name *rise* or *fall* depends on whether the **output** is about to fall or rise.
* If you're interested to find out why tc rise $$/neq$$ tc fall in practice, see this [appendix](#what-causes-tc-rise-and-tc-fall-to-differ) section. 

**Find tc rise**: scroll to the part of the waveform where the output is **rising** (around 9.9ns). **Zoom** in at least 4-5 times to get a clearer picture of the signals. 
- Then click and drag your mouse to cover the region where **invalid** **input** begins to where **invalid** **output** (as consequence of this invalid input) is observed 
- You can then note this time period as **tc rise** of the NAND gate

<img src="{{ site.baseurl }}/docs/Labs/images/lab1/tc-rise.gif"  class="center_seventy no-invert"/>


**Find tc fall**: scroll to the part of the waveform where the output is **falling** (around 5ns). 
- Similarly, click and drag your mouse covering the region of **contamination delay**.
- This time period is the gate's **tc fall**

<img src="{{ site.baseurl }}/docs/Labs/images/lab1/tc-fall.gif"  class="center_seventy no-invert"/>

{:.highlight}
Head to edimension to answer questions pertaining to this task. 

### Task 2: Measure Propagation Delay (tpd)

{:.note-title}
> Definition
> 
> Recall from our lecture that **propagation delay is the time taken from a valid input to a valid output,** i.e., from the moment the input changes to when the output reaches a stable and valid state. 

Similarly, we need to find two values from the waveform: **tp rise** and **tp fall** and taking the **maximum** of the two as the **propagation delay** measurement of the gate. 

**Find tp rise**: scroll to the part of the waveform where the output is rising (around 9.9ns). Don't forget to **zoom in**.
- Click and drag your mouse to cover the region where **valid** input begins to where **valid output** (as a result of that valid input) is observed
- This time period is the gate's tp rise 

**Find tp fall**: scroll to the part of the waveform where the output is falling (around 5ns). 
- Click and drag your mouse to cover the region where **valid** input begins to where **valid output** (as a result of that valid input) is observed
- This time period is the gate's tp fall 

*No gifs provided here. You are to figure out the starting and ending measurement points yourself to compute tp rise and tp fall.*

{:.highlight}
Head to edimension to answer questions pertaining to this task. 

### Conclusion

{: .important-title}
> Reporting overall device tpd and tcd
> 
> As said above, to compute overall device tpd, we take the **maximum** between tp rise and tp fall. To compute its tcd, we take the **minimum** between tc rise and tc fall. 

The *why* should be pretty intuitive by now. tcd can be seen as the *memory* ability of the device; indicating how long it is able to produce the **previous** valid output even when the input has currently turned invalid. If your device *remembers* rising case better than falling case, the overall *memory ability* that should be reported for the device should be the smaller of the two. 

Likewise, tpd is some sort of *loading time* of the device. If your device loads longer in the falling case than the rising case, we have to report the longer loading time so our users know how to mitigate that. In short, we need to take into account that the device will be used to produce both rising and falling cases. 

{:.note-title}
> How would tcd and tpd change with temperature? 
>
> For many consumer products, designs are tested in the **range** of 0°C to 100°C. In general, both tcd and tpd will increase when measured at higher temperature.
> 
> If a 2019 Intel Core i9 processor is rated to run correctly at 2.3 GHz at 100°C, it is certainly capable to run at a much **faster** **clock** rate at room temperature (assuming tpd is the parameter that determines “correct” computer behavior).  
> 
> This is why you can usually get away with overclocking your CPU—it’s been rated for operation under much more severe environmental conditions than you’re probably running it at! 

## Measuring Timing Specifications of a combinational logic unit 

{:.note-title}
> Combinational Logic Devices
>
> Combinational logic devices are digital circuits that produce outputs **based solely on their current inputs**, without memory, using components like adders, multiplexers, encoders, and decoders. Examples include half adders, full adders, and multiplexers.

Below is the schematic of a <span class="orange-bold">half-adder unit</span>: **combinational** logic circuit that adds two **single-bit** binary numbers A and B, producing a Sum and a Carry bit output. They can be made solely with NAND gates. 

<img src="{{ site.baseurl }}/docs/Labs/images/lab1/cs-2025-half-adder.drawio.png"  class="center_fifty"/>

Here's its truth table:

| A | B | Sum | Carry |
|---|---|-----|-------|
| 0 | 0 |  0  |   0   |
| 0 | 1 |  1  |   0   |
| 1 | 0 |  1  |   0   |
| 1 | 1 |  0  |   1   |

### Task 3: Find tpd of a half-adder
From the lectures, you're taught that the **propagation** delay is determined by the longest path because it dictates the **maximum** time the circuit takes to stabilize its output after an input change. Since a half-adder device has **two** output bits: Sum and Carry, we need to compute the tpd of each bit and then report the **maximum** value as the tpd of the half-adder. 

Open `lab1_task3_and_4.jsim`. This netlist describes the schematic of a half adder. 

```cpp 
.include "nominal.jsim"
.include "custom_gates_lab1.jsim"

.subckt half_adder a b sum carry
Xnand1_unit a b nand1_out nand2
Xnand2_unit nand1_out a nand2_out nand2
Xnand3_unit nand1_out b nand3_out nand2 
Xoutput_sum nand2_out nand3_out sum nand2
Xoutput_carry nand1_out nand1_out carry nand2
.ends


* test jig for measuring tcd and tpd
Xdriver vin B inv
Xtest vdd B sum carry half_adder
* simulate load at the output terminals of the half adder unit
Cload_carry carry 0 .02pf
Cload_sum sum 0 .02pf
Vin vin 0 pulse(3.3,0,5ns,.1ns,.1ns,4.8ns)

* helper plots to make measurements earlier 	
Vol vol 0 0.3v   
Vil vil 0 0.6v
Vih vih 0 2.6v
Voh voh 0 3.0v

.tran 15ns
.plot B sum vol vil vih voh
.plot B carry vol vil vih voh
```

Here we fix the `A` input terminal as `1` (vdd), and **vary** the voltage value at the `B` input terminal instead. The value of Sum and Carry bit should follow this truth table:

| A | B | Sum | Carry |
|---|---|-----|-------|
| 1 | 0 |  1  |   0   |
| 1 | 1 |  0  |   1   |

Click the **Device Level Simulation** button: 

<img src="{{ site.baseurl }}//docs/Labs/images/lab1/2024-07-01-15-05-55.png"  class="center_seventy no-invert"/>

1. Compute the tp rise and tp fall of the sum bit
2. Compute the tp rise and tp fall of the carry bit
  
Take the **maximum** value from (1) and (2) above and report it as the tpd of the half-adder. Then look at the half-adder schematic and identify the **critical path** of the device. 
- How many nand2 gates are there in the critical path of the device?
- Do you find that the tpd of the half-adder is **exactly** sum of the **tpd** of these nand2 gates (in the critical path) computed in Task 1 above? If not, is it *more* or *less* than that? 

{:.note-title}
> Critical Path
>
> The critical path in a digital circuit is the **longest** path from <span class="orange-bold">any</span> input to <span class="orange-bold">any</span> output, which determines the maximum propagation delay of the circuit. 
> 
> It is the path that takes the **most** time for a signal to travel through the circuit, and it defines the overall speed at which the circuit can operate, as the circuit cannot produce a valid output (all bits) until all signals have propagated through this path.

{:.highlight}
Head to edimension to answer questions pertaining to this task. 

#### Conclusion

The propagation delay of the sum bit in a 1-bit half adder is <span class="orange-bold">approximately</span> the sum of the delays through each individual nand gate in the critical path like we learned during Lecture, but in practice it is <span class="orange-bold">not</span> exactly 3 times the intrinsic delay of a single nand gate due to additional factors such as:

1. **Gate Loading**: Each gate's output drives the inputs of subsequent gates, increasing the capacitive load and thus slightly increasing the delay.

2. **Parasitic Capacitance**: Interconnecting wires and components have inherent capacitance that adds extra delay as signals travel through the circuit.

3. **Interconnect Delays**: The physical layout of the circuit introduces resistance and capacitance in the interconnecting wires, contributing to additional delays.

4. **Non-ideal Behavior**: Real gates do not switch instantaneously and have finite rise and fall times, which add to the overall delay. 

These factors cumulatively cause the actual propagation delay to be slightly higher than the simple sum of the delays of individual gates.

### Task 4: Find tcd of a half-adder 

From the same graph in Task 3: 
1. Compute the tc rise and tc fall of the sum bit
2. Compute the tc rise and tc fall of the carry bit

Take the **minimum** value from (1) and (2) above and report it as the tcd of the half-adder. Then look at the half-adder schematic and identify the **shortest path** of the device. 
- How many nand2 gates are there in the shortest path of the device?
- Do you find that the tpd of the half-adder is **exactly** sum of the **tpd** of these nand2 gates (in the shortest path) computed in Task 1 above? If not, is it *more* or *less* than that? 

{:.note-title}
> Shortest Path
>
> The shortest path in the context of contamination delay is the path through the circuit that has the **minimum** total delay from an input to an output. 
> 
> This path defines the contamination delay because it represents the **fastest** possible route for a signal to propagate through the circuit, indicating the **earliest** time at which any output may change (such as become invalid from previously being valid) in response to a change at the input.


{:.highlight}
Head to edimension to answer questions pertaining to this task. 

#### Conclusion
The contamination delay (tcd) of a logic gate is not exactly the sum of the contamination delays of the individual gates making the shortest path due to:

1. **Gate Loading**: Similar to propagation delay, the loading effects can vary, affecting the minimum delay.
2. **Parasitic Capacitance**: These can also affect the minimum transition time, adding to the delay.
3. **Interconnect Delays**: Even for the shortest path, these delays can add up and affect the total tcd.

Typically, the actual contamination delay is **more** than the simple sum of the individual gates' minimum delays due to these additional factors, which add to the overall minimum delay.

## Summary 


In this lab, we measured the tpd and tcd of both a 2-input nand gate and a half-adder unit made up using these gates. 

By analyzing the waveforms, we identified the **critical** path to determine the maximum tpd and the **shortest** path for the minimum tcd. Understanding how these delays are computed is crucial for accurate timing analysis and reliable digital circuit design.


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

## What causes tc rise and tc fall to differ? 
The difference in contamination delay (\( t_{cc} \)) rise and fall times for the same logic gate can be attributed to several factors, including the inherent asymmetries in the design and behavior of the transistors within the gate. Here are some of the primary reasons:

1. **Transistor Sizing**: In a typical CMOS logic gate, the NMOS and PMOS transistors are sized differently to balance the drive strengths and to achieve equal rise and fall times for the output signal. However, due to the differences in electron and hole mobilities (electrons move faster than holes), the NMOS transistors are usually smaller than the PMOS transistors. This can lead to different switching characteristics and, consequently, different contamination delays for rising and falling edges.

2. **Mobility Difference**: The mobility of electrons in NMOS transistors is typically higher than that of holes in PMOS transistors. This means NMOS transistors can pull the output low faster than PMOS transistors can pull the output high. This difference in mobility results in different contamination delays for rising and falling transitions.

3. **Threshold Voltage (\( V_t \)) Difference**: The threshold voltages of NMOS and PMOS transistors are usually different. This difference affects the switching speed and the point at which the transistors turn on and off, contributing to different rise and fall contamination delays.

4. **Load Capacitance**: The load capacitance seen by the NMOS and PMOS transistors can differ due to the layout and wiring of the circuit. Variations in load capacitance affect the time required to charge and discharge the load, leading to different contamination delays for rising and falling transitions.

5. **Body Effect**: The body effect can cause variations in the threshold voltage of the transistors, which in turn affects the switching characteristics. This effect might be more pronounced in one type of transistor (NMOS or PMOS), leading to asymmetric contamination delays.

6. **Process Variations**: Manufacturing process variations can cause differences in the physical characteristics of the transistors, such as channel length, width, and oxide thickness. These variations can lead to differences in the electrical characteristics and switching speeds of NMOS and PMOS transistors, affecting the contamination delay for rising and falling edges.

7. **Intrinsic Gate Delay**: The intrinsic delay of a gate is influenced by the internal resistance and capacitance of the transistors. Since the NMOS and PMOS transistors have different resistive and capacitive properties, this intrinsic delay can differ for rising and falling transitions.

Understanding these factors helps in designing logic gates with balanced rise and fall times, though achieving perfect symmetry is challenging due to the inherent differences in the transistor characteristics and the practical constraints of the manufacturing process.


