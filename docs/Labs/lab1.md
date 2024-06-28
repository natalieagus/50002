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


