---
layout: default
permalink: /notes/sequentiallogicanimation
title: Sequential Timing Animation
description: Animation to aid understanding of tpd, tcd, t1, and t2 constraints.
nav_order: 6
parent: Hardware Related Topics
---


* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design


# Sequential Timing Animation
{: .no_toc}

**You are strongly encouraged to <span style="color:red; font-weight: bold;">read</span> [this supplementary document](https://dropbox.com/s/gi4r2ea1tdv5x4d/Seq_Logic_Timing_Extras_2020.pdf?dl=1) to know more about timing computations for sequential logic device** before proceeding to watch these animations.

## Propagation Delay

Let's start with the basic tpd (propagation delay). By definition, it is the **time taken** from the moment inputs turn valid to the moment <span style="color:red; font-weight: bold;">all</span> outputs turn valid.

<video src="{{ site.baseurl }}/assets/videos/tpd.mov" controls="controls" class="center_full">
</video>

{: .important}
Remember that we do assume that all input bits will turn valid at the **same** time (if you've learned sequential logic, you'd know how this happens with use of the DFF), and that we need <span style="color:red; font-weight: bold;">all</span> output bits to be valid in order for the entire circuit's output to be deemed as valid (as a whole).

## Contamination Delay

Now onto basic tcd (contamination delay), By definition, it is the **time taken** from the moment inputs turn invalid to the moment <span style="color:red; font-weight: bold;">any</span> output bits turn invalid (quite literally *contaminated*). Think of this as some kind of a *memory ability* of the combinational device. 

<video src="{{ site.baseurl }}/assets/videos/tcd.mov" controls="controls" class="center_full">
</video>

{: .important}
Again, we **do assume** that all input bits can turn invalid at the same time, and that we must deem the output of the entire circuit to be invalid the moment <span style="color:red; font-weight: bold;">any</span> of its output bit turns invalid.

## The Dynamic Discipline


The dynamic discipline states that there are **two timing** **requirements for the input signal supplied at D**, named as $$T_{setup}$$ and $$T_{hold}$$, which lengths are:
1. $$T_{setup}$$ is defined as  the minimum amount of time that the voltage on wire D needs to be valid/stable **BEFORE** the **clock edge changes from `1` to  `0`** (turning from `write` mode to `memory` mode).
2. $$T_{hold}$$ is defined as the minimum amount of time that the voltage on wire D needs to be valid/stable **AFTER** the **clock edge reaches a valid  `0` from a previous `1`**.

The animation below shows exactly when tsetup and thold takes place. 

<video src="{{ site.baseurl }}/assets/videos/th-ts.mov" controls="controls" class="center_full">
</video>

Here's the breakdown of what's happening, following timestamps in the video:
1. At `t=0` seconds mark in the video, an input (green) is about to enter the DFF
2. At `t=7`, this green input is effectvely observed in the output. At the **same time**, it's safe for new input (blue) to enter the master latch. 
3. At `t=16`, the blue input is observed at the output of the slave latch 
4. At `t=26`, the blue input is observed at the output of the slave latch 

Hence, the **output** of the DFF is **synchronized** with the clock, with each clock cycle outputting a single stable value:
1. During the **first** clock cycle in the video, the DFF outputs some old *pink* output. We didn't illustrate where this came from, but assume it comes from the previous cycle.. 
2. During the **second** clock cycle in the video, the DFF outputs the <span style="color:green; font-weight: bold;">green</span> output that was fed into the master latch during the **first** clock cycle. 
3. During the **third** clock cycle in the video, the DFF outputs the <span style="color:blue; font-weight: bold;">blue</span> output that was fed into the master latch during the **second** clock cycle. 
4. During the **first** clock cycle in the video, the DFF outputs the <span style="color:deeppink; font-weight: bold;">pink</span> output that was fed into the master latch during the **third** clock cycle. 


{: .warning}
Note that the actual length of the timings are exaggerated (not to scale) so you have enough time to digest the information. For instance, the CLK period should contain equal amount of time for both HIGH and LOW. The same applies for other animations below.

From the dynamic discipline of the DFF, we have $$t1$$ and $$t2$$ constraints if we were to use DFFs in sequential circuits. 

### t2 constraint

It's easier to begin with t2 constraint first by illustrating how inputs are *processed* in sequential circuits. 

The $$t_2$$ constraint ensures that the clock period is **long enough** for <span style="color:red; font-weight: bold;">three</span> things to complete:
- Valid signal to be produced at the output of upstream DFF and 
- Signal to *propagate* through the combinational logic unit in between,
- Signal to be set-up at the downstream DFF

<video src="{{ site.baseurl }}/assets/videos/t2-simple.mov" controls="controls" class="center_full">
</video>

{: .important}
Notice how tpd (and also tcd by extension) of the overall circuit is computed **from** the downstream DFF only because now our input <span style="color:red; font-weight: bold;">reference</span> is the **clock** and <span style="color:red; font-weight: bold;">no longer</span> the actual IN to the circuit. 

### Sequential outputs synchronized with CLK

Notice how a sequential logic circuit **beautifully** synchronizes the output with the CLK. We have a **new** valid and stable output (of the downstream register) at each rising CLK edge. Similarly, the input to the combinational logic CL (which is the output of the **upstream**) DFF is also synchronized with the clock.

{: .highlight}
This is why we can assume for the computation of tpd and tcd above that inputs can turn valid or invalid **at the same time**, because typically we feed inputs to combinational logic circuits only **after** they **have been synchronized** (with the CLK) using (upstream) DFFs. 

<video src="{{ site.baseurl }}/assets/videos/t2-long.mov" controls="controls" class="center_full">
</video>

### t1 constraint

Finally, this animation illustrates why t1 constraint is important. The $$t_1$$ constraint ensures that the $$t_H$$ requirement of the downstream register is fulfilled by the devices thats put upstream (before it), that is the combinational logic in yellow and the upstream register.

When the CLK turns to `1`, <span style="color:red; font-weight: bold;">both</span> upstream and downstream DFFs are "*capturing*" different values. These happens **simultaneously**. Upstream DFF is receiving *current* input value, while downstream DFF is receiving the *computed* old input value that was produced by the CL.

All devices upstream of the downstream DFF (that is the CL and the upstream DFF) has to **help** to hold on to this *old* valid value for the $$t_H$$ of the downstream DFF to be fulfilled before responding to the rising edge of the clock and producing new values. The *memory ability* of CL and upstream DFF (their tcds) is the one that can fulfil $$t_H$$ of the downstream DFF.

<video src="{{ site.baseurl }}/assets/videos/t1-explanation.mov" controls="controls" class="center_full">
</video>

## Word of Advice

It takes time to understand the dynamic discipline. Watch the animations closely, and pause at key moments especially when new information pops up. It is certainly faster to simply *memorize* them, but in the long run it won't do anybody any good. The dynamic discipline is a <span style="color:red; font-weight: bold;">crucial</span> concept because it dictates your CLK period (or frequency, equivalently), which translates to *how fast* your computer can compute things. It also dictates what type or hardware can or cannot be used in a sequential logic circuit because their tcds must match the downstream DFFs tcd. It takes careful and marvelous engineering to have computers that we have today. 