---
layout: default
permalink: /notes/sequentiallogic
title: Sequential Logic
description: Sequential Logic Devices can do what Combinational Logic Devices can't; to produce output that depends on both past and current input.
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

# Sequential Logic and Synchronization
{: .no_toc}
[You can find the lecture video here.](https://youtu.be/HlizelEp4Yc) You can also **click** on each header to bring you to the section of the video covering the subtopic.

{:.highlight-title}
> Detailed Learning Objectives
>
> 1. **Distinguish Sequential and Combinational Logic Devices**
>    - Explain the functional differences between sequential and combinational logic devices.
>    - Explain the role of memory elements in sequential devices which allow them to store and reference past inputs.
> 2. **Explain Memory Devices: D Flip-Flops and D-Latches**
>    - Discover the structure and operational modes (write and memory modes) of D Flip-Flops and D-Latches.
>    - Examine how these memory devices integrate with combinational logic to form sequential logic circuits.
> 3. **Identify the Role of the Clock Signal**
>    - Justify the critical role of the clock (CLK) signal in managing the behavior of sequential logic devices.
>    - Explain how the CLK signal ensures synchronization of inputs for reliable operation.
> 4. **Discuss Edge-Triggered D Flip-Flops**
>    - Discuss the design and functionalities of Edge-Triggered D Flip-Flops, focusing on master and slave latch configurations.
>    - Assess the importance of clock signal inversion and its impact on the operational dynamics of D Flip-Flops.
> 5. **Justify Dynamic Discipline Requirements**
>    - Explain the necessity of setup time and hold time to prevent the storage of invalid information.
>    - Explain how adhering to dynamic discipline ensures the reliability of sequential circuits.
> 6. **Analyze Timing Constraints in Sequential Circuits**
>    - Explain the importance of critical timing constraints `t1` and `t2` between sequential logic devices.
>    - Prove how `t1` and `t2` constraints ensure stable and valid outputs throughout clock cycles.
> 7. **Discuss Synchronization Challenges of External Inputs**
>    - Explain the difficulties in synchronizing external inputs with the clock in sequential circuits.
>    - Examine potential issues arising from violations of the dynamic discipline.
> 8. **Explain the Metastable State in Sequential Logic Devices**
>    - Identify what a metastable state is and the conditions that lead to its occurrence in sequential logic devices.
>    - Evaluate the consequences and impacts on circuit functionality when a device enters a metastable state.
> 9. **Evaluate Methods to Minimize Metastability**
>    - Analyze strategies to reduce the likelihood of a device entering a metastable state.
>    - Measure the trade-offs involved in these strategies, such as cost, responsiveness, and device size.
>
> The aim of these learning objectives is to thoroughly understand sequential and combinational logic devices, focusing on their differences, integration of memory elements, operational synchronization, and challenges in maintaining reliable and efficient functionality.

## [Overview](https://www.youtube.com/watch?v=HlizelEp4Yc&t=0s)


We've covered the basics of combinational logic devices, which produce outputs based solely on current inputs and must adhere to specified truth tables. However, external inputs are unreliable and may not persist long enough for the device to process them effectively. To manage this, we need methods to **synchronize** input signals to ensure <span class="orange-bold">sufficient</span> processing time.

Additionally, we need to explore <span class="orange-bold">sequential logic devices</span>, which depend on both current and past inputs. Known as finite state machines (FSMs) when they have a limited number of states, these devices incorporate memory to store and reference past inputs. Further details on FSMs will be discussed in the next chapter.

{: .note-title}
> Recap
>
> A simple combinational logic device **does not remember its output value**. It only gives an output when there's an input, and the output(s) stay(s) stable for as long as its input(s) is/are stable. A **memory** device on the other hand, is a device of which we can *write* new values to and is able to *remember* this value for a period of time.

We can connect **memory** device(s) together with **combinational** logic device(s) to form a **sequential logic device**. Notice the presence of a `CLK` signal below. A sequential logic device has a *general* structure as shown below:


<img src="https://dropbox.com/s/7crg33w0e7yg2hn/Q1.png?raw=1"    class="center_seventy"    >


In the next few sections we will learn how to create this memory device labeled as **Registers** above (or more specifically, it is called *D Flip-Flop*).

## [Storage Device: D-Latch](https://www.youtube.com/watch?v=HlizelEp4Yc&t=309s)


A D Flip-Flop (memory device) is made using another device called a D-latch.  A D-latch can be created using a multiplexer with a **feedback** **loop**,

<img src="https://dropbox.com/s/612f6bsfepegsbb/Q2.png?raw=1" class="center_thirty" >

{: .note}
This is **not** the only way to make a D-latch. A simple Google search will present you with some other alternatives.  We just use a multiplexer here to explain the idea easily.

How it works:

* In practice, G is clock (CLK) signal. It will periodically **switch** between `1`s and  `0`s (valid high voltage and valid low voltage) as shown in the image below:

<img src="https://dropbox.com/s/1s4wmuj1bsfpmfp/Q3.png?raw=1" class="center_seventy">

* Q is the output of the latch, and D is the (external) input that's placed at the second input port the latch.
* Q is fed back as Q', the first input port of the latch.
* If G is 1, then the input signal on wire D will be "passed" to / reflected at output wire Q, *independent of the signal on wire Q'.*
  * Lets call this the **`write` mode**.

{:.important}
The term "**pass through**" is used from this point onwards in this chapter to easily explain the behavior of the MUX, that when G=1, then value at Q always reflects the value at D. However recall from from Week 1 lecture (CMOS) that the signal at Q is actually due to the VDD or GND and D is simply the input at the gate that activates or deactivates the pull-up or pull-down components of the latch.


-  If G is 0, then output signal on wire Q reflects the signal on wire Q', *independent of input wire D*.
   -  Lets call this the **`memory` mode** (or `read` mode in some textbooks).


Before we progress, let's ensure we understand one thing first:
* The theory of a working D latch is that when G transitions from HIGH to LOW, Q should hold the value present on D at that moment.
* However, a combinational device (the Mux) makes NO output guarantees until $$t_{pd}$$ after an input change and may behave unpredictably between $$t_{cd}$$ and $$t_{pd}$$.
* This is time gap between "remembering old stable value" to "producing new stable value" as input transitions.

So if the falling edge of G briefly invalidates Q, the memory fails because Q is exactly what we are trying to preserve. Therefore, we must ensure that a HIGH-to-LOW transition on G does not disturb Q at all. This is done by the hardware, which is to build a lenient MUX. You can read the appendix section if you're interested, but as long as you can take at face value that HIGH TO LOW transition on G does not disturb Q at all, as long as some prerequisites about D holds (will be explained below), then you're good to continue.

### Using a D-Latch

A D-latch operates by capturing the input voltage (valid low or high) at the D wire when a valid high voltage is applied to the G wire (also shown as the **Clock** port in the diagram below). After the voltage at G switches to low, the D-latch retains the value from D at the time G was high, without needing to maintain D's initial values.

By arranging multiple D-latches in parallel, we can create a stable N-bit output that "remembers" the input values without requiring continuous input at the D ports. This stored output can then serve as a reliable input to a combinational logic device for the duration of its processing time (\(t_{pd}\)), mitigating issues with unreliable external inputs.

The accompanying figure demonstrates a setup with a 4-bit input and a corresponding 4-bit output. Each rectangle (marked with a ">" at its lower left corner) represents a **Flip-Flop**, which consists of D-latches and will be discussed in a later section.

<img src="https://dropbox.com/s/ruxrkxm1r6kog88/s1.png?raw=1" class="center_seventy"  >


{:. note}
From this point onwards, `1` simply means valid high voltage, and  `0` means valid low voltage .

### Problems
There are **two** problems that arises from using this simple D-latch in our electronic devices without any contract / rules:

#### 1: Storage of invalid information
If G changes from `1` to `0` at the ***exact*** moment when D just turned **invalid** from previously being valid, then we might end up storing that  **invalid value of D** when the latch enters `memory` mode.

#### 2: Invalid/unstable output due to transition in input
If the *existing* stable input value in D is flipped, e.g: is changed from `1` to  `0` or vice versa,  the value at D will be invalid (*momentarily*) during this *transition*.

The voltage value at D can also be invalid (unstable, unreliable) due to any disturbance. This will affect the output at Q if G is 1, because it will pass **all** input from D to the output wire Q, regardless of whether it is a valid or stable input or not (during transition or any disturbance). We end up with potentially unstable/invalid output **half the time**.

In practice, this is <span class="orange-bold">not acceptable</span> because we do not want our electronic devices (e.g: computers) to have invalid output computed (e.g: be unstable, or hang, or freeze) at any point in time, *even when D is transitioning*. We want it to be **robust**, and **reliable** at **all** times.

{: .highlight }
Combinational component within an electronic device requires a certain amount of time <code>tpd</code> to produce meaningful results; and over this time-frame we need to hold its input <strong>stable</strong>, however external input is <strong>unreliable,</strong> so there's <strong>no guarantee</strong> that this requirement is fulfilled.

## Proposed Solution
As a **solution** to this problem we create another device using D-latches called **D Flip-Flop** (DFF) or more informally a *Register* to **synchronize** external input with the circuit's CLK, and also *switch* between `write` and `memory` mode as we intend it to behave.

A **D Flip-Flop** with a right Clock setup will be able to produce a **valid and stable** output for an entire clock period; *long enough* for any combinational logic connected downstream to finish its computation ($$t_{pd}$$) and produce meaningful output before the next **output** value is produced.

We address these problems in the next two sections.



### [The Dynamic Discipline](https://www.youtube.com/watch?v=HlizelEp4Yc&t=1400s)

{:.highlight}
The *dynamic discipline* is a contract that is made to address the **first** problem above: the possibility of **storing invalid information** in the memory device. It is imperative to never violate the dynamic discipline to ensure any sequential logic circuits to work properly.

The dynamic discipline states that there are **two timing** **requirements for the input signal supplied at D**, named as $$T_{setup}$$ and $$T_{hold}$$:
1. $$T_{setup}$$ is defined as  the minimum amount of time that the voltage on wire D needs to be valid/stable **BEFORE** the **clock edge changes from `1` to  `0`** (turning from `write` mode to `memory` mode).
2. $$T_{hold}$$ is defined as the minimum amount of time that the voltage on wire D needs to be valid/stable **AFTER** the **clock edge reaches a valid  `0` from a previous `1`**.

These two values are crucial for [later](#sequential-logic-device-timing-constraint-t1-and-t2).

### [Edge-Triggered D Flip-Flop ](https://www.youtube.com/watch?v=HlizelEp4Yc&t=2066s)

To address the second problem: the presence of **unstable/invalid output during transition of input**, we need to create another device called the *Edge-Triggered D Flip Flop* (or shortened as DFF) by putting two D-Latches in series as shown:

<img src="https://dropbox.com/s/gtqq3c7i9d6vz3c/Q1.png?raw=1" class="center_seventy" >

At first, each of the two rectangles are the symbol of a regular D-latch. Putting them in series (and ***inverting*** the CLK signal fed to the first latch) results in a DFF (the rectangular symbol on the right). The difference is that in a DFF, the CLK input port is represented by the > symbol at its lower left corner.


### General Anatomy
We can describe the structure of a Flip-Flop as follows:
- The first D-latch that receives the external input D is called the **MASTER** latch, and the second D-latch is called the **SLAVE** latch.
- There is an **inverter** applied on the G input on the master Flip-Flop, so the master latch receives or "sees" the **inverted**  clock signal.
- The star ($$\star$$) symbol represents the intermediary output and its not observable outside of the system.
- The output at the Q port of the slave latch is the observable output of the Flip-Flop.



### The Beauty of DFF

{:.highlight}
**How does a Flip-Flop prevent the presence of invalid/unstable output during transition/disturbance of input at D?**

The observer/user gets output only from the output wire of the **slave** latch's Q port, and the observer/user supplies input only to the **master** latch's D port.

Notice that CLK is a signal that **periodically** changes from `0` to `1` and vice versa.

When CLK signal is `0`, the G port of **master** latch will receive a `1` (due to the inverter) and the G port of **slave** flip flop will receive a `0` **at the same time**.
- This means that the **master** latch is in "`write` mode", i.e: it lets signal from its D wire through to its Q port, while the **slave** latch is in "`memory` mode", i.e: slave's output depends on **its own** memory  Q' and not affected by input on $$\star$$.

When CLK signal is `1`, the G port of **master** latch will receive a `0` due to the inverter and the G wire of **slave** latch will receive a 1.
- This means that the **master** latch is in "`memory` mode", i.e: master's output depends on its own memory  Q' and is <span class="orange-bold">not</span> affected by any value on input port D.
- Meanwhile, the **slave** latch is on "`write` mode", i.e: it lets signal from the $$\star$$ wire to be passed through its slave input port D.

{: .highlight}
Hence, **only ONE of the two D-Latches is on "`write` mode" at a time** or equivalently, **only one D-latch is on "`memory` mode" at a time**. Unlike a single D-latch alone, this Flip-Flop configuration **prevents** a *direct* reflection of the input of the system (supplied by the user) to the output of the system.


The explanation above is illustrated in terms of **waveforms** below. Take some time to study the waveforms and convince yourselves that they make sense. Note that "Q" here means the overall output of the Flip-Flop, which is the signal produced by the Q port of the slave latch.

<img src="https://dropbox.com/s/lsovnj1u8s9d95i/ffwaveform.png?raw=1" class="center_seventy"  >


Notice two further behaviors in the Flip-Flop:

1. Unlike the $$\star$$, the signal at Q is **stable throughout an entire clock period**, and change *only* in the **next** clock period. In comparison, the $$\star$$  is only stable **half the time** when the master latch is at `memory` mode, but reflects ever-changing D-input signal during `write` mode.
2. The edge-triggered flip-flop in this particular configuration, where the master is the one that receives the **inverted** CLK signal produces **new** value at Q (reflects the input at D) at every **rising edge** of the CLK.

It is as if we are able to ***capture*** the instantaneous value of D at each CLK-rise edge (like a camera shutter), and produce it at Q (stable) for that **entire period** of the CLK.

{: .important}
You can also make the slave latch to be the one that receives the inverted CLK signal, and the value at Q reflects the input at D at each **falling edge** of the CLK. The name "edge-triggered" comes from the fact that the **output at port Q**  of the slave **changes** only when the CLK edge changes (in our case, at every rising *edge*).

## DFF as Memory Device
A DFF always outputs a stable and valid value at its Q port for one clock period (regardless of the actual input at the D port), before changing it to a new updated value. In a way, it is able to **memorise** whatever value at D was during CLK rising edge for an entire CLK period thereafter.

We can create another circuit using a DFF to allow it to either **always** output a previously stored value regardless of the CLK, *or* to **load** a new `IN` value into the DFF when needed using a <span style="color:red; font-weight: bold;">control</span> signal called `WRITE ENABLE`.

A simplified anatomy is shown below:

<img src="{{ site.baseurl }}/assets/images/notes/mhp-register.drawio.png"  class="center_fifty"/>

You will meet this device [later on ](https://natalieagus.github.io/50002/notes/betacpu#detailed-anatomy-of-the-regfile).

## [D Flip-Flop Timing Constraint](https://www.youtube.com/watch?v=HlizelEp4Yc&t=3458s)


Recall that the *dynamic discipline* ($$T_{setup}$$ and $$T_{hold}$$) ensure that we do not end up storing invalid input signals. In the flip-flop configuration, we **connect** two D-latches together.   Hence the dynamic discipline for the slave latch has to be **obeyed** by the master latch because the *output* of the master latch is the *input* to the slave latch.

To obey the dynamic discipline, there exist this **timing constraint** for the D Flip-Flop configuration:

$$t_{CD_{master}} > t_{H_{slave}}$$

{:.highlight}
Head to [Appendix](#dff-timing-constraint) if you're interested to learn why.



## [Sequential Logic Device Timing Constraint (t1 and t2)](https://youtu.be/HlizelEp4Yc?si=OtkjqiYRpIDcVyRq&t=3903)
We can integrate Flip-Flops into our circuits as 'synchronization' or 'memory' devices, ensuring stable output for at least one clock cycle. These can be placed either before or after any combinational logic circuit. To ensure reliable operation of such sequential logic circuits or devices, adherence to the **dynamic discipline** is crucial at all times. This discipline ensures that all parts of the circuit properly manage timing, charge, and signal integrity to function correctly.

{: .warning}
Due to Dynamic Discipline, we have **two** timing constraints called **$$t_1$$ and $$t_2$$** that should **always** apply in **ANY** path between two (one upstream and one downstream) connecting Flip-Flops  (regardless of how many CLs are there in the middle of the two Flip-Flops) in a SL circuit.

Take into example a very simple combination as shown in the figure below, consisted of two Flip-Flops and one CL device in between. Let's name the Flip-Flop R1 on the left as the "upstream" Flip-Flop and the Flip-Flop R2 on the right as the "downstream" Flip-Flop:

<img src="/50002/assets/contentimage/week3notes/1.png" class="center_seventy">

If we were to plot the timing diagram of the CLK, output of R1 ($$Q_{R1}$$), and the output of the CL (CL out), we have the following:
<img src="https://dropbox.com/s/dxcun9lssktr6rn/Q12.png?raw=1"  class="center_seventy">


From the diagram above, we can define two timing constraints for this particular scenario where $$t_{CLK}$$ is the CLK (clock) period.
- $$t_1$$ : $$t_{CD} R_1 + t_{CD} CL \geq t_{H} R_2$$
- $$t_2$$ : $$t_{PD} R_1 + t_{PD} CL + t_S R_2 \leq t_{CLK}$$

{:.note}
You may read [this supplementary document](https://dropbox.com/s/gi4r2ea1tdv5x4d/Seq_Logic_Timing_Extras_2020.pdf?dl=1) to know more about timing computations for sequential logic device. If you're interested to find the **reasoning** behind t1 and t2 constraints, read this [appendix](#t1-and-t2-constraint-derivation) section.



## [$$t_{pd}$$ and $$t_{cd}$$ of Sequential Logic vs Combinational Logic Devices](https://www.youtube.com/watch?v=HlizelEp4Yc&t=2974s)

In the previous chapter, we learned about the definition $$t_{CD}$$ and $$t_{PD}$$ for combinational logic (CL) devices, and how to compute these values. For **sequential logic (SL) devices**, i.e: circuits with Flip-Flops and CLs combined, these timings mean as follows:
1. $$t_{CD}$$ of a Flip-Flop (or sequential logic devices) is the time taken for an **invalid** CLK input (**not input to the sequential logic circuit**),    as a result of *transition* from  `0` to `1`, to produce an **invalid** *final* output of the SL (Sequential Logic) device.
1. $$t_{PD}$$ of a Flip-Flop (or sequential logic devices) is the time taken for **valid `1`** CLK input (**again, not input to the sequential logic circuit**), to produce a **valid** *final* output of the SL device.


### Subtle Difference

In **combinational** devices, there is **no input CLK** and units with *feedback* paths like the Flip Flops involved. $$t_{PD}$$ of a combinational device is the time measured from the moment a **valid** input is fed to the circuit to the moment it produces a **valid** output of the circuit, and $$t_{CD}$$ is the time measured from the moment an **invalid** input is fed to the circuit to the moment it produces an **invalid** output.

However in **sequential** logic devices, our **input**  will be the **CLK** and not the *"user"* input, and in particular only are concerned with the **CLK transition from `0` to `1`**, where the D Flip-Flop "captures" a new input value.



## [Synchronization with Input](https://www.youtube.com/watch?v=HlizelEp4Yc&t=4980s)

In any sequential logic circuit we use a **single synchronous clock**, meaning that we use one same clock to any D Flip-Flop in the device. Our timing constraints ensure that the CLs are given valid and stable input long enough for it to produce meaningful output. However, we still have one small **issue**: the external input need to obey the dynamic discipline for the **first** 'upstream' DFF (that directly receives external input) in the circuit.

**Why is this an issue?**

In practice, it is **not possible** for any arbitrary input to always be synchronised with the clock, i.e: to obey the $$t_S$$ and $$t_H$$ requirements (of the external input facing 'upstream' DFF) at all times. For instance, when you type on your keyboard, you aren't able to synchronise that keyboard presses with your CPU clock, are you?

### Violating the Dynamic Discipline
Recall that dynamic discipline is crucial for any sequential logic circuit to work properly. We are now going to investigate what happens if **dynamic discipline is violated**. In the figure below, suppose tH constraint is violated and the D latch captures an invalid voltage range:

<img src="{{ site.baseurl }}//docs/Hardware/images/e_sequentiallogic/2025-02-12-12-40-46.png"  class="center_seventy"/>

We may end up storing the invalid values during `memory` mode (CLK is `0`) instead of a stable 0 or 1. This condition is what we refer to as the **metastable state**, where the output is **undefined** (does not correspond to any valid logic value) and could lead to <span class="orange-bold">unpredictable</span> behavior in the system. This is because:
1. The output might resolve to either `0` or `1` after an **unpredictable** delay, meaning different runs on the same circuit could produce different results (non deterministic)
2. This gets worse in downstream components: If multiple downstream gates receive the metastable signal, some might interpret it as 0 while others as 1, leading to inconsistent logic states and system instability.
3. **Glitches**: If an intermediate or fluctuating voltage is fed into a gate, **different** transistors inside the gate may interpret it differently, leading to a glitch—a brief, unintended transition in the output. This will affect timing constraints of even more device downstream.


## [The Metastable State](https://www.youtube.com/watch?v=HlizelEp4Yc&t=5110s)

{: .important-title}
> The metastable state
>
> When the dynamic discipline (t1 and t2 time constraints) is violated, the dff may enter a **metastable** state, meaning its output is <span class="orange-bold">neither</span> a stable 0 nor a stable 1 for an <span class="orange-bold">unpredictable</span> duration. The output might still resolve to a valid 0 or 1, but the resolution time is uncertain, and this makes it <span class="orange-bold">dangerous</span>.
>
> As mentioned above, if the resolution takes too long, it can **violate** timing constraints in downstream logic, leading to incorrect or unpredictable behavior.
>
> If metastability **propagates**, different parts of the circuit might interpret the unstable signal differently, causing divergent outputs and system failures.

### Cause
Due to the existence of a feedback loop in the D-latch as shown, it has a unique property where there exist a point in its voltage characteristics function whereby **$$V_{in} = V_{out}$$**.

<img src="{{ site.baseurl }}//docs/Hardware/images/e_sequentiallogic/2025-02-12-11-58-43.png"  class="center_thirty"/>

The VTC plot of the D-latch setup above is as follows:

<img src="{{ site.baseurl }}//docs/Hardware/images/e_sequentiallogic/2025-02-12-12-09-30.png"  class="center_seventy"/>

The <span style="color:red; font-weight: bold;">red</span> line signifies the feedback constraint, where we have **Q** at $$V_{out}$$ to be equivalent to **Q'** as $$V_{in}$$. **This is the effect of the feedback loop**.

The <span style="color:green; font-weight: bold;">green</span> line signifies the VTC of a "closed latch" state, i.e: when the selector bit of the multiplexer receives a  `0` as shown in the diagram above.

In the `memory` mode (closed-latch state), the D-latch passes the value from $$V_{in}$$ (Q') as the output at $$V_{out}$$ (Q), and thus we have a shape that resembles that of a **buffer**.

There are three points formed by the intersections of the <span style="color:red; font-weight: bold;">red</span> line (feedback constraint) and the <span style="color:green; font-weight: bold;">green</span> line (VTC of the closed latch), as indicated by the three circles in the figure above:
- Two end points that results in "valid" voltages (either `0` or `1`). These are called low and high stable point.
- One middle point that called the *METASTABLE* point
  - The $$V_{in}$$ value at this point is denoted as $$V_m$$


{: .highlight}
> What is the **significance** (meaning) of these solution points?
>
> The **stable** equilibrium points (high and low) are where the D-latch naturally settles, corresponding to the stored logic `1` and logic `0` states. The *metastable* point is an <span class="orange-bold">unstable</span> equilibrium where the system momentarily balances but will eventually resolve to one of the stable states due to noise or small perturbations.

### Thought Experiments
Let's think about a few scenarios while looking at the VTC plot above.

#### 1: Initial $$V_{in}$$ value is *well* *below* $$V_m$$.

This will land the output voltage at the low stable equilibrium region.
* With initial $$V_{in}$$ value << $$V_m$$, the device will produce a lower $$V_{out}$$
* This $$V_{out}$$ will loop back as $$V_{in}$$, and produce an even lower value of $$V_{out}$$  at the next iteration
* **Eventually**, the value of $$V_{out_N}$$ after certain N loops traversal tends towards the **stable** low equilibrium point


#### 2: Initial value of $$V_{in}$$ is well above $$V_m$$

This will land the output voltage at the high stable equilibrium region.
* Conversely,with initial $$V_{in}$$ value >> $$V_m$$, the device will produce a higher $$V_{out}$$
* As this $$V_{out}$$ loops back and becomes a new $$V_{in}$$,  it will produce an even higher value of $$V_{out}$$ at the next iteration
* Since $$V_{out_i}$$ is always greater than $$V_{in_i}$$ at each loop $$i$$, we will eventually have a $$V_{out}$$ value that tends towards the **stable** high equilibrium point

#### 3: Initial value of $$V_{in}$$ is equal or near to $$V_m$$

We are at the metastable point.
* If we have $$V_{in} = V_m$$ (exactly at $$V_m$$), then its $$V_{out}$$ will be near $$V_m$$ again.
* Under noise-free condition, $$V_{out}$$ will always be equal to $$V_{in}$$ no matter how many times the signal loops (no improvement!)
* We might indefinitely be stuck at this metastable point (invalid voltage value)

{:.warning-title}
> Why is invalid logic value a problem?
>
> If an upstream component propagates an invalid (metastable) voltage, downstream logic gates may interpret it <span class="orange-bold">inconsistently</span>, leading to **unpredictable** or **divergent** outputs. This can cause timing violations, glitches, or delayed resolution, potentially corrupting data or causing system instability.
>
> **Unpredictable output**: Digital devices receiving invalid voltage input value may produce either `0` or `1` <span class="orange-bold">randomly</span>, meaning that different executions of the same operation may yield different results, making the system unreliable
>
> **Divergent output**: If multiple downstream gates receive an invalid signal (metastable), some gates might *interpret* it as `0` (settled to `0`) while others *interpret* it as `1` (settled to `1`), causing different parts of the circuit to operate on **conflicting** logic states, leading to glitches, race conditions, or system instability

### Noise is Good, Sometimes
Without the presence of noise or external disturbances, if $$V_{in}$$ is *exactly* at $$V_m$$ then there is **always** a **chance** that we *MIGHT* *wait* **forever** for it to be able to settle to either a stable values. A small presence of noise will drive $$V_{in}$$ down or up and eventually it *may* settle to a stable value, however this is **not guaranteed in bounded time**.

{: .important}
> If we wait for a metastable value to settle, it may resolve to the *wrong* state (not necessarily the original input), but this is <span class="orange-bold">still preferable</span> to remaining in an undefined state indefinitely. Digital systems require a definite `0` or `1` to ensure **predictable** operation, even if the resolved state doesn’t always match the original input.
>
> The actual true value of the input is <span style="color:red; font-weight: bold;">effectively lost</span> (when it violates the dynamic discipline that caused this metastable state for example).

### Properties of Metastable State
The state whereby your SL device is unable to settle to a stable valid value for unknown period of time is called the **metastable** state. Obviously we **do not** want this because the output of the device is invalid during this unknown time frame, and therefore rendered *useless*.

In summary, **properties** of metastable state are illustrated below:
- It is an **unstable** equilibrium, a small noise/pertubation may cause it to *accelerate* towards either ends: a stable `0` or `1`... *eventually* (but it might not too).
- It corresponds to an **invalid** logic level -- the switching threshold of a device
- Depending on how close $$V_{in}$$ is to $$V_m$$ and presence of noise, it also **may take forever** to settle towards a stable value (unbounded time).
- Every bistable system exhibits **at least one** metastable state.

### Inevitability
The metastable state is an **inevitable** risk of synchronization *because* our active device **always** have a **fixed-point voltage $$V_m$$** such that $$V_{in} = V_m$$ implies $$V_{out} = V_m$$, caused inherently by the feedback loop constraint and the VTC of the multiplexer.

The **violation of dynamic discipline** may put our feedback loop at some voltage *near* $$V_m$$. The **time taken** for $$V_{out}$$ to eventually settle towards a stable `0` or `1` is **inversely** proportional to current $$\|V_{out} - V_m\|$$, and is *theoretically infinite* for $$V_{out} = V_m$$.

Since there is **no lower bound** on $$\|V_{out} - V_m\|$$, then there is **no upper bound** for the settling time of eventual $$V_{out}$$ value.


{: .important}
In summary, we cannot completely avoid the metastable state. If a SL device enters the metastable state, it *might* eventually settle to a valid zero... or a valid one, but there is **no guarantee** when this will happen. It may take a second,  or it may take forever to settle.


The only thing we can do is to **minimise** the metastable state's probability from happening. We can do that by introducing more **delays** between the first 'upstream' Flip-Flop and the CL devices downstream in the **hopes** that the signal will somehow settle towards either end before reaching the CL, as illustrated here:

<img src="https://dropbox.com/s/g5sbabtn9ywwkod/series.png?raw=1">

{: .highlight}
**Note** that this comes at the cost of price, responsiveness, and size of the device.




## [Summary](https://www.youtube.com/watch?v=HlizelEp4Yc&t=5788s)
You may want to watch the post lecture videos here:
* [Part 1: D-Latch](https://youtu.be/TdwV30ORXJY)
* [Part 2: Timing Specifications](https://youtu.be/_qTTgelFAGY)
* [Part 3: D-Flip Flop or Registers](https://youtu.be/X6kxFjAHkSw)
* [Part 4: Synchronisation](https://youtu.be/eK4JCv1oADo)


We learned about sequential logic devices in this notes and its challenges. Sequential logic device is a type of digital circuit where the output not only depends on the current inputs but also on the **history** of inputs, storing information about past events.
> Hence the name **sequential logic** comes from the fact that it is a type of **logic** circuit whose output depends **not only on the present** value of its input signals but on the *sequence of past inputs, (the input history) as well.*

This feature is achieved through the use of storage elements like flip-flops or latches. These devices are fundamental in creating memory and more complex processing units within digital systems, enabling the implementation of functions such as counters, shift registers, and state machines.

A **sequential** logic device has a *general* structure as shown below:

<img src="{{ site.baseurl }}//docs/Hardware/images/e_sequentiallogic/2025-02-12-13-39-46.png"  class="center_fifty"/>

In order for sequential logic devices to work, we need to obey the dynamic discipline and the t1 and t2 constraints. Failure to obey that might put the device into the metastable state.

Here are the key points from this notes:
1. General structure of **sequential logic devices**:
  <img src="https://dropbox.com/s/7crg33w0e7yg2hn/Q1.png?raw=1"    class="center_seventy"   >
2. **Dynamic discipline**: The setup time (t1) and hold time (t2) constraints ensures the proper operation of sequential circuits by guaranteeing that data is reliably transferred between flip-flops in a sequential circuit. They prevent timing violations that could lead to incorrect operation of the circuit (incorrect propagation of signals). These constraints enforce specific time windows during which the data must remain **stable** around the clock edge (t1 **before** the clock edge for **upstream** dff, and t2 **after** the clock edge for **downstream** dff)
3. **$$t_{cd}$$ and $$t_{pd}$$ computation of sequential logic devices**: $$t_{cd}$$ and $$t_{pd}$$ are computed based only on the downstream combinational logic relative to the clock input, <span class="orange-bold">not</span> user inputs.
4. **Metastable state**: Occurs in flip-flops when the input changes too close to the clock edge, **violating** setup or hold time. In this state, the output is **neither** a stable 0 nor 1 and may oscillate or settle unpredictably. It arises because flip-flops internal feedback cannot resolve conflicting signal states quickly. We can mitigate metastability (but cannot completely avoid it) by using synchronizers and ensuring that dynamic discipline is obeyed.

# Appendix


## $$T_{setup}$$ and $$T_{hold}$$
If you're interested to know *why* the dynamic discipline has those specific constraints ($$T_{setup}$$ and $$T_{hold}$$), read this section. If this is too much for you, you can skip it. You won't exactly lose in exam if you skip it, just that your knowledge wont be whole.

#### How long is $$T_{setup}$$ and $$T_{hold}$$ approximately?
{: .note}
$$T_{setup}$$ is *approximately* measured as $$2 \times t_{pd}$$  of the <span style="color:red; font-weight: bold;">components that make up the D-latch</span>. $$T_{hold}$$ is *approximately* measured as  $$t_{pd}$$ of the components that make up the D-latch. This $$t_{pd}$$ is <span style="color:red; font-weight: bold;">not</span> the same as the $$t_{pd}$$ of the entire sequential logic circuit ([see section below](https://natalieagus.github.io/50002/notes/sequentiallogic#t_pd-and-t_cd-of-sequential-logic-vs-combinational-logic-devices))

As explained in the previous notes,  $$t_{pd}$$ is the **propagation** delay of the combinational logic devices (components) that make up a D-latch, e.g: a multiplexer, which has a $$t_{pd}$$ value. The multiplexer can be made using a handful NAND gates. To clarify, this $$t_{pd}$$ is the propagation delay of that multiplexer or  components (combinational logic devices) that are used to make up a D-latch.

{: .new-title}
> Think!
>
> Why are the lengths for $$T_{setup}$$ and $$T_{hold}$$ dependent on the the $$t_{pd}$$ of the components that make up the D-latch?


For $$T_{setup}$$, you can figure this out by estimating **how long** you **should** wait to ensure that the output signal at Q reflects what was supplied at D (requires $$1\times t_{pd}$$), and to ensure that this output at Q maintains this value when CLK at G turns `0` (from Q', requires *another* $$1\times t_{pd}$$).


For $$T_{hold}$$, you can figure this out by realising that CLK is an **input** to the D-latch system as well, and the device needs **some time** ($$1\times t_{pd}$$) to realise that it is in `memory` mode after CLK turns to a valid `0`. Throughout this brief period. of time, the input at D must be held valid/stable.

#### The Lenient Mux

Notice that Q is *also* an input to the MUX. We will meet a <span style="color:red; font-weight: bold;">problem</span> if 1-to-0 transition on G causes the Q output to become invalid at a brief interval (even when D is held stable obeying $$T_{setup}$$ and $$T_{hold}$$).

{: .highlight}
Thus, we assume that the MUX used in a latch is a **lenient** MUX. A lenient MUX is a MUX where a 1-to-0 transition on G doesn’t affect the validity of Q output if certain prerequisite holds.

In particular, a lenient MUX WILL produce a stable and valid Q as long as either of 3 conditions below is fulfilled:
1. When G is 1 (we are loading the latch), once D is valid for as long as *half* of $$T_{setup}$$ (1 $$t_{pd}$$), we guarantee that Q will be stable and valid (reflecting D) **independently** of Q' initial value. This allows Q to be unaffected by Q' as it is overwriting Q' when new values from D has just arrived.
2. When D is valid for as long as $$T_{setup}$$, we guarantee that Q will be stable and valid (reflecting D) **independently** of G. This ensures that a 1-to-0 transition on G doesn’t contaminate Q output
3. When G is 0 (memory mode) and Q has been stable for at least $$T_{hold}$$, then Q will no longer be affected by subsequent transitions on D input. Note that the only way for Q to be stable for this long when G has just turned to valid 0 is fulfilled by D, it should be held stable for at least $$T_{hold}$$ for this effect to happen.

The truth table for the lenient MUX is as follows:

| G | D | Q' | Q |
|---|---|----|---|
| 1 | 0 | X  | 0 |
| 1 | 1 | X  | 1 |
| 0 | X | 0  | 0 |
| 0 | X | 1  | 1 |
| X | 0 | 0  | 0 |
| X | 1 | 1  | 1 |
| X | 0 | 1  | X |
| X | 1 | 0  | X |

## DFF Timing Constraint

To obey the dynamic discipline, there exist this **timing constraint** for the D Flip-Flop configuration:

$$t_{CD_{master}} > t_{H_{slave}}$$

Imagine the exact moment when the INV CLK seen by master (latch) changes from `0` to `1`, at the same time, the CLK signal seen by slave (latch)  changes from `1` to `0`. This transition by the CLK is **not immediate** and there is a short time window where the CLK goes from (valid) `1` to invalid value to (valid) `0`.

This implies that the master goes into `write` mode while the slave goes into `memory` mode *simultaneously*.

However, the $$\star$$ at the output of the master cannot change *immediately* in order to fulfil the $${t_{H}}$$ requirement of the slave.

The $$\star$$ has to retain its **previous** valid value (when the clock was valid) and **cannot immediately** do the following before the $${t_{H}}$$ requirement of the slave is fulfilled:
- Become invalid due to transition in the CLK value, or
- Reflect whatever new input is given at D port of the master latch, even though the master latch is at the `write` mode.


This means the **contamination** delay of the master latch (time taken on signal on $$\star$$ is be invalid after CLK at G port  becomes invalid) has to be **larger** than the hold time of the slave latch *so that the Flip-Flop system obeys the dynamic discipline.*


## t1 and t2 Constraint Derivation
### t1 constraint
The $$t_1$$ constraint ensures that the $$t_H$$ requirement of the downstream register, R2, is fulfilled by the devices thats put upstream (before it), that is CL and R1 in the example above.
- When the CLK rises at $$t_i$$, both R1 and R2 are "*capturing*" different values, **simultaneously**.
- R1 is receiving *current* input value at $$t_i$$, while R2 is receiving the *computed* old input value that was produced by R1 at $$t_{i-1}$$.
- The devices upstream of R2 has to **help** to hold on to this *old*  $$t_{i-1}$$ values for the $$t_H$$ of R2 to be fulfilled before responding to the rising edge of the clock and producing new values.

### t2 constraint
The $$t_2$$ constraint ensures that the clock period is **long enough** for three things to complete:
- Valid signal to be produced at the output of R1 and
- Signal to *propagate* through CL in between, and
- Signal to be set-up at the downstream register R2 (for `memory` mode).

{: .warning}
Once again, BOTH $$t_1$$ and $$t_2$$ constraints must be fulfilled within **any paths between two connecting DFFs** in a circuit, in order for the overall circuit to obey the dynamic discipline.

### $$t_{pd}$$ of CL
We can call the $$t_{PD} CL$$ (propagation delay of the CL) as the time taken to do **actual work** or **logic computation**.

{: .highlight}
> It should be clear by now why the input to this CL must be stable for at least $$t_{pd}$$ for it to have meaningful output, and how our new circuit with DFFs (obeying dynamic discipline, $$t_1$$, and $$t_2$$ constraint) guarantees this -- something that unreliable external input alone cannot guarantee if it were to be fed directly to the CL units.

The propagation or contamination delays of a Flip-Flop is not considered a logic computation, because unlike combinational logic devices (that can be made to implement functionalities such as addition, subtraction, boolean expressions, etc), a Flip-Flop **does not implement** any other special functionalities except to function as a memory device.


## About CPU Clock

{: .highlight}
This is a **supplementary knowledge**, for those who are curious only.

Throughout this lecture, we have learned how clocks make it **easier** to **synchronize** various combinational logic devices.

{: .important}
If you have difficulties remembering **why** synchronisation is required, remember **assembly line**. Ever seen an assembly line? People and machines working in sync to get the job done in the fastest and most efficient manner? <span style="color:red; font-weight: bold;">Remember the sync part, that is the key.</span> How are they so synchronized?

<figure>
<img src="https://th-thumbnailer.cdn-si-edu.com/0jP0vHeCZLZ_24H9q6zAw5J_oTk=/1000x750/filters:no_upscale()/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer/1c/11/1c113495-5153-4040-b7ea-5a37acf4d525/ford_assembly_line_-_1913.jpg"  class="center_fifty no-invert"/>
<figcaption style="text-align: center">The Ford assembly line in 1913. Wikimedia Commons/public domain.</figcaption>
</figure>

Our CPU is very similar to that. It's a giant synchronous circuit consisted of billions of transistors working together to compute results together. A CPU is typically reported with a clk rate (something around 3-4 Ghz in 2023) -- that's our clock signal: a **timing signal**, like a conductor in an orchestra or the constant humming of machines in a factory that keeps up the assembly line's **tempo**.


Our combinational logic devices will still work (to an extent) without adding clocks, but its functionality will be primitive. It will not be able to process series of inputs and outputs in an orderly (pipelined) fashion, and it will not be able to compute an output based on sequences of input (no memory device).

{: .highlight}
**But where do clocks come from? How are they made and how can they produce such a high frequency for our CPUs to run?**

The clock signal is commonly (but <span style="color:red; font-weight: bold;">not</span> always, there are other techniques too) produced **mechanically** using [quartz crystals oscillators](https://www.allaboutcircuits.com/technical-articles/understanding-the-operation-of-quartz-crystal-oscillators/). When we apply a voltage source to a small thin piece of quartz crystal, it begins to change its **shape** and *vibrate* (a characteristic known as the [piezo-electric effect](https://www.explainthatstuff.com/piezoelectricity.html)). This characteristics produces a mechanical force. The frequency of which the crystal is going to oscillate varies, depending on the oscillator's topology. We typically call this the **base frequency** of our clock. We then can build other circuits to multiply (boost) or divide (slow down) this frequency to run different components in our PC at different speed depending on the specifications.

For example in a multicore CPU, each core might have an independent multiplier circuit. Cores that are underutilised can run slower while cores under heavy load can run faster (e.g: [Intel Turbo Boost](https://www.intel.sg/content/www/xa/en/gaming/resources/turbo-boost.html)). Your RAM also need a different clock speed than your CPUs.
