---
layout: default
permalink: /problemset/sequentiallogic
title: Sequential Logic
description: Practice questions containing topics from Sequential Logic and Synchronization
parent: Problem Set
nav_order: 3
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

Each topic's questions are grouped into **three** categories: basic, intermediate, and challenging. You are recommended to do all basic problem set before advancing further. 

**You are strongly encouraged to <span style="color:red; font-weight: bold;">read</span> [this supplementary document](https://dropbox.com/s/gi4r2ea1tdv5x4d/Seq_Logic_Timing_Extras_2020.pdf?dl=1) to know more about timing computations for sequential logic device.**

## Warm-up Timing Computations (Basic)
  

Consider the following diagram of a simple sequential circuit:
<img src="https://dropbox.com/s/63cip82ur4u3y64/Q1.png?raw=1" class="center_seventy" >
  
The components labeled `CL1` and `CL2` are combinational and `R1` and `R2` are edge triggered flip flops. Timing parameters for each component are as shown in the figure (in ns). Answer both questions below:

1. Suggest the values for each timing specifications: **ts**, **th**, **tcd** , **tcd** `CL2`, **tpd**, **tclk** (clock period) for the wholen system using the timing specifications of each of the internal components that are given in the figure. 

	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	**th** and **ts** is for `IN`, **tcd** and **tpd** is with reference to the `CLK`. Below are the proposed values (in ns):
	$$
	\begin{aligned}
	t_S &= t_{S.R1} + t_{PD.CL1} = 4 + 3 = 7\\
	t_H &= t_{H.R1} - t_{CD.CL1} = 2 - 1 = 1\\
	t_{CD} \text{ CL2} &=t_{H.R2} - t_{CD.R1} = 7.5\\
	t_{CD} &= t_{CD.R2} = 2\\
	t_{PD} &= t_{PD.R2} = 8\\
	t_{CLK} &\geq t_{PD.R1} + t_{PD.CL2} + t_{S.R2} = 2 + 15 + 16 = 33
	\end{aligned}$$
	From this, hopefully you realise that the **tpd** and **tcd** of a sequential circuit is counted from the <strong>last</strong> downstream register(s) (there can be more than one) in the circuit because our reference "input" is no longer `IN` but the `CLK` signal.<br><br>Computation of **ts** and **th** is concerning the path from `IN` until the <strong>first</strong> upstream register(s) (there can be more than one)  in the circuit.<br><br>The dynamic discipline is always obeyed in any middle path, which is between two DFFs or register in the circuit because of the hardware characteristics (tcd of CLs in between and the `CLK` period) of the sequential circuit, so we don't need to worry about that. Therefore the definition of **ts** and **th** of the <strong>entire</strong> circuit is only concerning the first upstream register, because this is where we need need to be wary of its **ts** and **th** since it has to be fulfilled by the (*unreliable*) external input.
	</p>
	</div><br>
	
	
2. Suppose you had available a faster version of `CL2` having a propagation delay of 3 and a contamination delay of zero. Could you substitute the faster `CL2` for the one shown in the diagram? **Explain.**

	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	
	No we <span style="color:red; font-weight: bold;">cannot</span>. The contamination delay (tcd) for `R1` is 1ns, while the contamination delay (tcd) for `CL2` is 0ns. After another `CLK` edge rises, `R2` input is valid and stable for 1ns due to **tcd** of `CL2` before turning invalid, but its **th** required is 8.5ns.
	</p>
	</div><br>

## Timing Plot Analysis (Basic)
Consider the following unusual D-latch configuration:
<img src="https://dropbox.com/s/vxvoeomb1zyc7h0/Q7.png?raw=1" class="center_fourty" >
 
Now we feed it the following input signal and `CLK` signal. <span style="color:red; font-weight: bold;">Which</span> of the following signal plots represent the output of this device made out of 3 D-latches? Assume that the jagged edges means unknown value and that the contents of each latch in the beginning is unknown, and that dynamic discipline is always obeyed. The plots below are drawn as if we were to measure it from the beginning (at `t=0`).

<img src="https://dropbox.com/s/7a8ww9nvk0lzlfq/Q7b.png?raw=1" class="center_fourty" >

<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
<p>
<strong>Signal 2</strong> is the output of the device since there's two <strong>unknown</strong> outputs (it takes two half-clock cycles for the input to be propagated to the output). 
<br>
<br>
Signal 5, although it has <span style="color:red; font-weight: bold;">invalid</span> values for two clock cycles isn't the answer because since it is an odd-numbered DFFs, it will  <strong>change output</strong> at the <strong>falling</strong> edge, as opposed to rising edge in a normal DFF with two latches.
</p>
</div><br>


## Another Timing Computation (Basic)

Consider the following circuit, and notice the **feedback loop**. You may assume that the circuit has been **reset**, that is all dffs are outputting a valid (reset) signal (e.g: bit `0` in reset state) in the beginning:

<img src="https://dropbox.com/s/jhq2pg9rs70rlrj/Q8.png?raw=1" class="center_fifty">

Setup time, hold time, propagation delay, and contamination delay (all in nanoseconds) of each component is as written above. Lets now analyse its timing constraints:

1.  What is the minimum contamination delay (**tcd**) of `CL1` such that the sequential circuit may still function properly?


	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	The combinational logic unit 1 (`CL1`) is responsible for the **hold** times of `R4` and `R1`. Since `R1`'s **th** is larger than `R4`, we should use  that (`R1`'s **th**) to compute min **tcd** for `CL1`.  

	**th** of `R1` can be satisfied using the **tcd** of `CL1` plus the <strong>minimum</strong> **tcd** of either `R1`, `R2`, or `R3`. 

	Hence, minimum acceptable **tcd** of `CL1` is: **th** R1 - **tcd** `R1` = 1.2 - 0.3 = 0.9ns.
	</p>
	</div><br>

1.  Write down the minimum `CLK` period for the sequential circuit to function properly.


	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	The clock period must be big enough for signals to propagate from the upstream registers on the left to any downstream registers `R1` or `R4`.<br><br>There are <strong>six</strong> paths to be considered in total where **t2** constraint must be obeyed in <strong>all</strong> of them: `R1-CL1-R1`, `R1-CL1-R4`, `R2-CL1-R1`, `R2-CL1-R4`, `R3-CL1-R1`, and `R3-CL1-R4`.<br><br>The longest path is formed by the **tpd** of `R3` + **tpd** `CL1` + **ts** `R1` = 1.5 + 2 + 2 = 5.5ns.
	</p>
	</div><br>

1.  Write down the minimum hold time (**th**) for the `IN` signal to the system.


	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	The input must satisfy the **th** of both `R2` and `R3`, which is 2ns.
	</p>
	</div><br>
	
1.  Write down the propagation time of the sequential logic circuit.


	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	The propagation time of the circuit is counted from R4 onwards since it is the last register in the circuit, hence it is: **tpd** `R4` + **tpd** `CL2` = 3.5ns.
	</p>
	</div><br>


## Metastable State Analysis (Basic)

Consider the following D-latch device and its VTC plot:
<img src="https://dropbox.com/s/ojcjpgj8g7da5oj/Q9.png?raw=1" class="center_fifty">
  

We are given the following specification about the multiplexer's valid operating voltage ranges: $$V_{IL} = 1V, V_{OL} = 0.5V, V_{IH} = 3V, V_{OH} = 3.5V$$. The noise margin is $$0.5V$$ and we can assume that the device obeys the **static discipline**.

1.  Which voltage value approximately, has the highest probability for the device to be in the metastable state?

	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	We plot the line: $$\text{Vout} == \text{Vin}$$ and find the intersection with the VTC curve to be approximately at 2.35V. This is the **Vin** value that has the highest probability for the device to stay in metastable state.
	</p>
	</div><br>

1.  Compare $$V_{IN} = 0.9V$$ vs $$V_{IN} = 3V$$. Which input voltage will most likely  cause the device stay in the metastable state?
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	Both input voltage values are <strong>valid</strong> inputs. Therefore the device will <strong>always produce valid output voltages</strong> since it obeys the static discipline. We can say that both values are equally unlikely to stay in the metastable state.
	</p>
	</div><br>

1.  Compare $$V_{IN} = 2.1V$$ vs $$V_{IN} = 2.5V$$. Which input voltage will most likely  cause the device stay in the metastable state?

	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	Both input voltage values are <i>invalid</i> inputs. <br><br>From the graph, we can deduce that **Vin** = 2.1V results in **Vout**= 1V, while **Vin** = 2.5V  results in **Vout** = 3.3V. <br><br>Taking 2.35V as the most likely voltage value for the device to stay in the metastable state, 3.3V is nearer to 2.35V as opposed to 1V. Hence, we can deduce that  **Vin** = 2.5V is more likely to cause the device to stay in the metastable state.
	</p>
	</div><br>

## Determining Suitable Clock Period (Intermediate)

The following circuit diagram implements a sequential circuit with two state bits, `S0` and `S1`:

<img src="https://dropbox.com/s/etums208i4we063/fig1.png?raw=1" class="center_fifty" >

The specifications are as follows:
* **tpd, tcd, ts, th,** of both registers: 0.5s, 0.3s, 1.0s, and 0.5s respectively.
* **tpd**, **tcd** of `INV` and `NOR` gates: 0.5s, and 0.4s respectively.

Answer the following questions:

1.  What is the smallest clock period for which the circuit still operates correctly?

	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	There are two contraints to check:
	<br>
	$$\begin{aligned}
	t_{PD.REG} + t_{PD.INV} + t_{PD.INV} + t_{S.REG} & \leq t_{CLK}\\
	t_{PD.REG} + t_{PD.NOR2} + t_{S.REG} &\leq t_{CLK}
	\end{aligned}$$
	<br>
	We need to find the largest value of **tclk** that satisfies both constraints. This comes from the first constraint that requires: $$t_{CLK} \geq 2.5\text{s}$$
	</p>
	</div><br>

1.  A sharp-eyed student suggests optimizing the circuit by removing the pair of inverters and connecting the `Q` output of the left register directly to the `D` input of the right register. If the clock period could be adjusted appropriately, would the optimized circuit operate correctly? If yes, explain the adjustment to the clock period will be needed. 

	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	No, the circuit won't operate correctly since $$t_{CD.REG} < t_{HOLD.REG}$$ 
	i.e., the output of the left register doesn't meet the required hold time when connected directly to the input of the right register.
	</p>
	</div><br>

1.  When the `RESET` signal is set to `1` for several cycles, what values are `S0` and `S1` set to?


	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	<code>S0 = 0, S1 = 0</code>
	</p>
	</div><br>

1.  Assuming the `RESET` signal has been set to `0` and will stay that way, what is the state following `S0=1` and `S1=1`?

	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	<code>S0 = 1, S1 = 0</code>
	</p>
	</div><br>

## Synchronizability (Basic)
Which of the following cannot be made to function with perfect reliability, assuming reliable components and connections? <span style="color:red; font-weight: bold;">Explain your reasoning</span>. 

Some of the specifications refer to <span style="color:red; font-weight: bold;">bounded time</span> which means there is a specified time interval, measured from the most recent input transition, after which the output is stable and valid.

1. A circuit that in unbounded time indicates <span style="color:red; font-weight: bold;">which of two</span> game show contestants pressed their button first.
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	It is possible to build this <i>unbounded</i>-time arbiter.
	<br> 
	<br>
	It may take an arbitrary period, after which it will produce <strong>a decision and a signal</strong> that indicates that its made a decision.
	</p>
	</div><br>
		
2. A circuit that in bounded time indicates which of two game show contestants pressed their button first.
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	This is a restatement of the "bounded time arbiter problem", known to be <span style="color:red; font-weight: bold;">unsolvable</span> in theory. In practice we can build a circuit to solve this problem where the probability of failure is related to **tpd**. For large **tpd** (eg, 10's of nanoseconds in today's technologies) the probability of failure can be made very small (eg, 1 failure in billions of years).
	</p>
	</div><br>

3. A circuit that determines if button A was pressed ***before*** a specified deadline. Assume the circuit has an accurate internal signal that transitions from 0 to 1 when the deadline is reached. The output should be 1 if the button was pressed on or before the deadline, 0 if pressed after the deadline. The output should be valid and stable within a specified tpd.
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	This is another restatement of the "bounded time arbiter problem", known to be unsolvable in theory. Of course, given sufficiently long time bounds, we can engineer practical approximate solutions (see the answer to the previous question).
	</p>
	</div><br>

4. A circuit that in bounded time indicates which of two game show contestants pressed their button first if the presses were more than 0.1 second apart, otherwise the circuit lights up a "TIE" light.
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	Not possible, same reasoning as the previous question. This circuit will suffer metastability problems because the decision as to whether the presses were 0.1 seconds apart is subject to metastability problems. 
	</p>
	</div><br>
	
5. A circuit that in bounded time indicates that at least one button has been pressed by some contestant.
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	Yes, an <code>OR</code> gate will do the job.
	</p>
	</div><br>

6. A circuit that in bounded time indicates that exactly one of the contestants has pressed their button. You can assume there are only two contestants.
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	Yes, a <code>XOR</code> gate will do the job.
	</p>
	</div><br>


7. A circuit that has two parts: 
   1. A subcircuit that indicates which of two game show contestants pressed their button first, and 
   2. A subcircuit that in bounded time lights a "TIE" light if the subcircuit hasn't produced an answer after 1 second. The "TIE" light should stay lit even if we make a decision at some later point.

	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	Both subcircuits will suffer metastability problems. (a) is asking for an arbiter (see part 2 above) and (b) has the same difficulties as outlined for part 3 above.
	</p>
	</div><br>

8. A circuit that converts button presses from two contestants into the following two-bit output encoding. The circuit has two inputs, A and B, one for each contestant. A contestant's input will transition from 0 to 1 when he/she presses his/her button. The final output should be:
   1.  `00` if neither contestant is pressing their button
   2.  `01` if contestant A is pressing her button
   3.  `10` if contestant B is pressing her button
   4.  `11` if both contestants are pressing their buttons

	The output should be **valid and stable** within a specified **tpd** of the most recent input transition.
	
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	The low-order bit of the encoding is the signal from A, the high-order bit is the signal from B. Nothing can go to metastable here.
	</p>
	</div><br>







 





