---
layout: default
permalink: /problemset/problemset3
title: Problem Set 3
description: Week 3 practice questions containing topics from Sequential Logic, Synchronization and Finite State Machine
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

# Problem Set 3


This page contains all practice questions that constitutes the topics learned in <ins>Week 3</ins>: **Sequential Logic and Synchronization** and **FSM**. 

Each topic's questions are grouped into **three** categories: basic, intermediate, and challenging. You are recommended to do all basic problem set before advancing further. 




# Sequential Logic and Synchronization


## Warm-up Timing Computations (Basic)
  

Consider the following diagram of a simple sequential circuit:
<img src="https://dropbox.com/s/63cip82ur4u3y64/Q1.png?raw=1" style="width: 70%;" >
  
The components labeled CL1 and CL2 are combinational; R1 and R2 are edge triggered flip flops. Timing parameters for each component are as noted. Answer both questions below:

1. Suggest the values for each timing specifications (**ts**, **th**, **tcd** , **tcd** CL2, **tpd**, **tclk** -- clock period) for the system **as a whole** using the timing specifications of each of the internal components that are given in the figure. 

	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	**th** and **ts** is for IN, **tcd** and **tpd** is with reference to the CLK. Below are the proposed values:
	$$
	\begin{aligned}
	t_S &= t_{S.R1} + t_{PD.CL1} = 4 + 3 = 7\\
	t_H &= t_{H.R1} - t_{CD.CL1} = 2 - 1 = 1\\
	t_{CD} \text{ CL2} &=t_{H.R2} - t_{CD.R1} = 7.5\\
	t_{CD} &= t_{CD.R2} = 2\\
	t_{PD} &= t_{PD.R2} = 8\\
	t_{CLK} &\geq t_{PD.R1} + t_{PD.CL2} + t_{S.R2} = 2 + 15 + 16 = 33
	\end{aligned}$$
	<div class="redbox">From this, hopefully you realise that the **tpd** and **tcd** of a sequential circuit is counted from the <strong>last</strong> downstream register(s) (there can be more than one) in the circuit because our reference "input" is no longer IN but the CLK.<br><br>Similarly, **ts** and **th** is concerning the path from **INPUT** until the <strong>first</strong> upstream register(s) (there can be more than one)  in the circuit.<br><br><strong>The dynamic discipline is always obeyed in any middle path</strong> between two DFFs or register in the circuit because of the hardware characteristics (tcds and CLK period) of the sequential circuit, so we don't need to worry about that. Therefore the definition of **ts** and **th** of the <strong>entire</strong> circuit is only concerning the first upstream register, because this is where we need need to be wary of its **ts** and **th** since it has to be fulfilled by the (unreliable) external input.</div>
	</p>
	</div><br>
	
	
2. Suppose you had available a faster version of CL2 having a propagation delay of 3 and a contamination delay of zero. Could you substitute the faster CL2 for the one shown in the diagram **Explain.**

	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	
	No we can't. The contamination delay for R1 is 1, while the contamination delay for CL2 is 0. After CLK change, R2 input is valid and stable for 1s due to **tcd** of CL2 before turning invalid, but its **th** required is 8.5s.
	</p>
	</div><br>

## Timing Plot Analysis (Basic)
Consider the following unusual D-latch configuration:
<img src="https://dropbox.com/s/vxvoeomb1zyc7h0/Q7.png?raw=1" style="width: 70%;" >
 
Now we feed it the following input signal and CLK signal. **Which of the following signal plots represent the output of this device made out of 3 D-latches?** Assume that the jagged edges means unknown value and that the contents of each latch in the beginning is unknown, and that dynamic discipline is always obeyed. The plots below are drawn as if we were to measure it from the beginning (at t=0).

<img src="https://dropbox.com/s/7a8ww9nvk0lzlfq/Q7b.png?raw=1" style="width: 70%;" >

<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
<p>
<strong>Signal 2</strong> is the output of the device since there's two <strong>unknown</strong> outputs (it takes two half-clock cycles for the input to be propagated to the output). 
<br>
<br>
Signal 5, although it has "invalid" values for two clock cycles isn't the answer because since it is an odd-numbered DFFs, it will  <strong>change output</strong> at the <strong>falling</strong> edge, as opposed to rising edge in a normal DFF with two latches.
</p>
</div><br>


## Another Timing Computation (Basic)

Consider the following circuit, and notice the **feedback loop**. You may assume that the circuit has been **reset**, that is all dffs are outputting a valid (reset) signal (e.g: bit `0` in reset state) in the beginning:

<img src="https://dropbox.com/s/jhq2pg9rs70rlrj/Q8.png?raw=1" style="width: 80%;">

Setup time, hold time, propagation delay, and contamination delay (all in nanoseconds) of each component is as written above. Lets now analyse its timing constraints:

1.  What is the minimum contamination delay (**tcd**) of Combinational Logic 1 such that the sequential circuit may still function properly?


	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	The combinational logic unit 1 (CL1) is responsible for the hold times of R4 and R1. Since R1's **th** is larger than R4, we should use  that (R1's **th**) to compute min **tcd** for CL1.  

	th of R1 can be satisfied using the **tcd** of CL1 plus the <strong>minimum</strong> **tcd** of either R1, R2, or R3. 

	Hence, minimum acceptable **tcd** of CL1 is: **th** R1 - **tcd** R1 = 1.2 - 0.3 = 0.9ns.
	</p>
	</div><br>

1.  Write down the minimum CLK period for the sequential circuit to function properly.


	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	The clock period must be big enough for signals to propagate from the upstream registers on the left to any downstream registers R1 or R4.<br><br>There are <strong>six</strong> paths to be considered in total where **t2** constraint must be obeyed in <strong>all</strong> of them: R1-CL1-R1, R1-CL1-R4, R2-CL1-R1, R2-CL1-R4, R3-CL1-R1, and R3-CL1-R4.<br><br>The longest path is formed by the **tpd** of R3 + **tpd** CL1 + **ts** R1 = 1.5 + 2 + 2 = 5.5ns.
	</p>
	</div><br>

1.  Write down the minimum hold time (**th**) for the IN signal to the system.


	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	The input must satisfy the **th** of both R2 and R3, which is 2ns.
	</p>
	</div><br>
	
1.  Write down the propagation time of the sequential logic circuit.


	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	The propagation time of the circuit is counted from R4 onwards since it is the last register in the circuit, hence it is: **tpd** R4 + **tpd** CL2 = 3.5ns.
	</p>
	</div><br>


## Metastable State Analysis (Basic)

Consider the following D-latch device and its VTC plot:
<img src="https://dropbox.com/s/ojcjpgj8g7da5oj/Q9.png?raw=1" style="width: 70%;">
  

We are given the following specification about the multiplexer's valid operating voltage ranges: $$V_{IL} = 1V, V_{OL} = 0.5V, V_{IH} = 3V, V_{OH} = 3.5V$$. The noise margin is $$0.5V$$ and we can assume that the device obeys the **static discipline**.

1.  Which voltage value approximately, has the highest probability for the device to be in the metastable state?

	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	We plot the line $$\text{Vout} == \text{Vin}$$ and find the intersection with the VTC curve to be approximately at 2.35V. This is the **Vin** value that has the highest probability for the device to stay in metastable state.
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
	Both input voltage values are <i>invalid</i> inputs. <br><br>From the graph, we can deduce that **Vin** = 2.1V results in Vout= 1V, while **Vin** = 2.5V  results in **Vout** = 3.3V. <br><br>Taking 2.35V as the most likely voltage value for the device to stay in the metastable state, 3.3V is nearer to 2.35V as opposed to 1V. Hence, we can deduce that  **Vin** = 2.5V is more likely to cause the device to stay in the metastable state.
	</p>
	</div><br>

## Determining Suitable Clock Period (Intermediate)

The following circuit diagram implements a sequential circuit with two state bits, `S0` and `S1`:

<img src="https://dropbox.com/s/etums208i4we063/fig1.png?raw=1" style="width: 70%;" >

The specifications are as follows:
* **tpd, tcd, ts, th,** of both registers: 0.5s, 0.3s, 1.0s, and 0.5s respectively.
* **tpd**, **tcd** of inverters and NOR gates: 0.5s, and 0.4s respectively.

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
	We need to find the largest value of **tclk** that satisfies both constraints. This comes from the first constraint that requires $$t_{CLK} \geq 2.5\text{s}$$
	</p>
	</div><br>

1.  A sharp-eyed student suggests optimizing the circuit by removing the pair of inverters and connecting the Q output of the left register directly to the D input of the right register. If the clock period could be adjusted appropriately, would the optimized circuit operate correctly? If yes, explain the adjustment to the clock period will be needed. 

	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	No, the circuit won't operate correctly since $$t_{CD.REG} < t_{HOLD.REG}$$ 
	i.e., the output of the left register doesn't meet the required hold time when connected directly to the input of the right register.
	</p>
	</div><br>

1.  When the RESET signal is set to "1" for several cycles, what values are `S0` and `S1` set to?


	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	<code>S0 = 0, S1 = 0</code>
	</p>
	</div><br>

1.  Assuming the RESET signal has been set to "0" and will stay that way, what is the state following S0=1 and S1=1?

	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	<code>S0 = 1, S1 = 0</code>
	</p>
	</div><br>

## Synchronizability (Basic)
Which of the following cannot be made to function with perfect reliability, assuming reliable components and connections? **Explain your reasoning.** 

Some of the specifications refer to "bounded time" which means there is a *specified time interval*, measured from the most recent input transition, after which the output is stable and valid.

1. A circuit that in unbounded time indicates which of two game show contestants pressed their button first.
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
	This is a restatement of the "bounded time arbiter problem", known to be unsolvable in theory. In practice we can build a circuit to solve this problem where the probability of failure is related to tpd. For "large" **tpd** (eg, 10's of nanoseconds in today's technologies) the probability of failure can be made very small (eg, 1 failure in billions of years).
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
	Yes, an <code>XOR</code> gate will do the job.
	</p>
	</div><br>


7. A circuit that has two parts: 
(a).  A subcircuit that indicates which of two game show contestants pressed their button first, and 
(b). A subcircuit that in bounded time lights a "TIE" light if the (a) subcircuit hasn't produced an answer after 1 second. The "TIE" light should stay lit even if (a) makes a decision at some later point.

	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	Both subcircuits will suffer metastability problems. (a) is asking for an arbiter (see part 2 above) and (b) has the same difficulties as outlined for part 3 above.
	</p>
	</div><br>

8. A circuit that converts button presses from two contestants into the following two-bit output encoding. The circuit has two inputs, A and B, one for each contestant. A contestant's input will transition from 0 to 1 when he/she presses his/her button. The final output should be:

	1.  00 if neither contestant is pressing their button
	2.  01 if contestant A is pressing her button
	3.  10 if contestant B is pressing her button
	4.  11 if both contestants are pressing their buttons

	The output should be **valid and stable** within a specified **tpd** of the most recent input transition.
	
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	The low-order bit of the encoding is the signal from A, the high-order bit is the signal from B. Nothing to go metastable here.
	</p>
	</div><br>



# State Machine


## Classifying FSM (Basic)
The diagram below illustrates the FSM diagram of a machine that has the same purpose. The circle that is bolded signifies the starting state. 

State whether the following is *true or false* and explain your answer:
* **Statement 1:** *"Diagram A illustrates a Mealy machine."*
* **Statement 2:** *"Diagram B can be further minimized."*

What is the *purpose* of these FSMs?

<img src="https://dropbox.com/s/ssyur5zn29v5rsq/fsmmeally.png?raw=1" style="width: 70%;"  >


<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
<p>
<strong>Statement 1</strong> is <i>false</i> because the machine in Diagram A has its output that depends only on its state. <strong>Statement 2</strong> is <i>true</i>, we can minimise it into just two states because <code>S1</code> and <code>S2</code> are <strong>equivalent</strong>. 
<br><br>
The purpose of both machines is to detect the presence of an edge and output a <code>1</code> <strong>once</strong> for the cycle where the edge happens, and <code>0</code> otherwise.
</p>
</div><br>

Your friend plot the timing diagram of the machine in Diagram A and obtain the following output:

<img src="https://dropbox.com/s/cws3uke3gekty4k/plotfsm.png?raw=1"  style="width: 70%;">

Assume that the machine starts at `S0`. While referring to the FSM diagram up above, write the current state that occurs at instances `[A], [B], [C],` and `[D]` respectively. 


<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
<p>
We can obtain the answers  easily by running the FSM step by step. At each labeled instance, the machine is at the following states:
<br>
<ul>  
<li><code>[A]: S0</code>,</li>  
<li><code>[B]: S2</code>,</li>  
<li><code>[C]: S1</code>,</li>  
<li><code>[D]: S0</code>,</li>  
</ul></p></div>

## An Incomplete State Machine (Basic)
The ACME Company has recently received an order from a Mr. Wiley E. Coyote for their all-digital Perfectly Perplexing Padlock:
* The P3 has **two** buttons ("0" and "1") that when pressed cause the FSM controlling the lock to advance to a new state. 
* In addition to advancing the FSM, each button press is encoded on the B signal (B=0 for button "0", B=1 for button "1"). 
* The padlock **unlocks** when the FSM sets the UNLOCK output signal to 1, which it does whenever the last N button presses correspond to the unique N-digit combination.

  
Unfortunately the design notes for the P3 are *incomplete*. Using the specification above and clues gleaned from the partially completed diagrams below **fill in the information that is missing from the state transition diagram** with its **accompanying truth table**. 

<img src="https://dropbox.com/s/1ww80s7vpxznf1k/Q1%202.png?raw=1" style="width: 90%;">

When done,
*  Each state in the transition diagram should be assigned a 2-bit state name S1S0 (note that in this design the state name is not derived from the combination that opens the lock),

*  The arcs leaving each state should be mutually exclusive and collectively exhaustive,

*  The value for UNLOCK should be specified for each state, and the truth table should be completed.

Also, **what is the combination of the lock**? 



<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
<p>
This state machine is a <strong>Moore machine</strong>. The completed state transition diagram and truth table is as follows:
<br>
<img src="https://dropbox.com/s/nstfdu7qea4dozo/Q2%202.png?raw=1">
<br>
The combination for the lock is <code>100</code>.
</p></div>

## Constructing an FSM (Basic)

Construct a "divisible-by-3" FSM that accepts a binary number entered one bit at a time, most significant bit first, and indicates with a *light* if the number entered so far is divisible by 3. Answer the following questions:

1.  Draw a state transition diagram for your FSM indicating the initial state and for which states the light should be turned on. *Hint: the FSM has 3 states.*
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>

	If the value of the number entered so far is N, then if digit b is entered next, the value of the new number N' is 2N + b. Using this fact:
	<ul>
	<li>  If N is 0 mod 3 then for some p, N = 3p + 0. After the digit b is entered, N' = 6p + b. So N' is b mod 3.</li>
	<li>  If N is 1 mod 3 then for some p, N = 3p + 1. After the digit b is entered, N' = 6p + 2 + b. So N' is b+2 mod 3.</li>
	<li>  If N is 2 mod 3 then for some p, N = 3p + 2. After the digit b is entered, N' = 6p + 4 + b. So N' is b+1 mod 3.</li>
	</ul>
	<br>This leads to the following transition diagram where each state corresponds to each of the possible values of N mod 3.
	<br>
	<img src="https://dropbox.com/s/kp3njg0hbw6kwwb/FSMqn.png?raw=1"  >
	<br>
	</p></div>

2. Construct a truth table for the FSM logic. Inputs include the state bits and the next bit of the number; outputs include the next state bits and the control for the light.
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	$$
	\begin{matrix}
	S_1 & S_0 & b & S_1' & S_0' & \text{light} \\
	\hline 
	 0 & 0 & 0 & 0 & 0 & 1 \\
	 0 & 0 & 1 & 0 & 1 & 1 \\
	 0 & 1 & 0 & 1 & 0 & 0 \\
	 0 & 1 & 1 & 0 & 0 & 0 \\
	 1 & 0 & 0 & 0 & 1 & 0 \\
	 1 & 0 & 1 & 1 & 0 & 0 \\
	\hline
	\end{matrix}
	$$
	</p>
	</div><br>

3. Write down the boolean equation for the FSM.
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>

	The boolean equation for the FSM is:
	$$
	\begin{aligned}
	\text{light } &= \overline{S_1} \times \overline{S_0}\\
	S_1' &= \overline{S_1} \times S_0 \times \overline{b} + S_1 \times \overline{S_0} \times b \\
	S_0' &= \overline{S_1} \times \overline{S_0} \times b + S_1 \times \overline{S_0} \times \overline{b}\\
	\end{aligned}
	$$

	</p>
	</div><br>

## Hardware Implementation of a state machine (Intermediate)

Consider the schematic of a machine as follows, which function is to: *detect a sequence of three or more consecutive 1’s, and output: 1 after three or more consecutive 1’s, or 0 otherwise.*

<img src="https://dropbox.com/s/nx1s0kw3iu0cvqz/Q6.png?raw=1" style="width: 70%;" >

Let's analyse the circuit by answering the questions below:
1. If the circuit has an **initial** state of `AB=00`, and the input at `t=0` is `x=0`, what will the immediate next state be?
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	The immediate next state is: <code>AB = 00</code>. You can easily trace this output from the circuit above. 
	</p>
	</div><br>
	
2. If the circuit has an **initial** state of `AB=00`, and the input at `t=0` is `x=1`, what will the immediate next state be?	
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	The immediate next state is: <code>AB = 01</code>. You can easily trace this output from the circuit above. 
	</p>
	</div><br>

3. If the circuit has a **current** state `AB=01`, and the current input is  `x=1`, what will the immediate next state be?	
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	The immediate next state is: <code>AB = 10</code>. You can easily trace this output from the circuit above. 
	</p>
	</div><br>

4. If the circuit has a **current** state `AB=11`, and the current input is  `x=1`, what will the immediate next state be?
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	The immediate next state is: <code>AB = 11</code>. You can easily trace this output from the circuit above. 
	</p>
	</div><br>

5. If the circuit has a **current** state `AB=11`, and the current input is  `x=0`, what will the immediate next state be?	
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	The immediate next state is: <code>AB = 00</code>. You can easily trace this output from the circuit above. 
	</p>
	</div><br>

6. What are the state(s) that can go to state `AB=00` as its ***next*** state?

	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	All combinations: <code>AB=00, 01, 10</code>, or <code>11</code>. You can prove it easily by brute force: checking if <code>AB = 00</code> next if its previously set to some value <code>AB = ij</code> given existing value <code>x</code>. 
	</p></div><br>

7. What is the value of output `y` when the current state is `AB = 11` and the current input is `x = 0`?
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	Tracing it out, we have <code>y=1</code>. 
	</p></div><br>

8. The propagation delays for all the combinational logic gates and the flip-flops are `2ns`. The clock frequency is `100MHz`. **What is the worst case delay** in nanosecond for the next states at `A` and `B` to appear (i.e. for `A` and `B` to be valid) after the input `x` is changed to be a valid input. *Assume that the initial states `AB` are given and fixed.*
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	From the frequency, we can compute the <i>period</i> of the clock to be <code>10ns</code>. 
	<br><br>
	For the <strong>worst</strong> case delay, we need to consider the scenario that input <code>x</code> is propagated up to input of the register and <i>it just missed the <code>clk</code> rise</i>. It takes <code>4ns</code> to propagate through the <code>AND</code> and <code>OR</code> gates, and another <code>10ns</code> to wait for another <code>clk</code> rise. Finally, it takes <code>2ns</code> to propagate through the register to produce <code>A</code> or <code>B</code>. Hence the <strong>worst case delay</strong> is <code>4+10+2 = 16ns</code>.
	</p></div><br>


9. The **propagation** delays for all the combinational logic gates and the flip-flops are `2ns`. Each `dff` have **th** and **ts** of `1ns` each.  If the clock frequency is not given, what is the **maximum clock frequency** *(smallest `clk` period)* that we can have for this device?

	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	The clock period has to satisfy the <strong>feedback</strong> path (t2 timing constraint), that is made up with **tpd** of the <code>dff</code>,  **tpd** of the <code>AND</code> gate,  **tpd** of the <code>OR</code> gate, plus **ts** of the register. This adds up to <code>2+2+2+1 = 7ns</code>. Hence the maximum frequency is $$\frac{1}{(7*10^{-9})}$$ <code>= 142.9MHz</code>.
	</p>
	</div><br>

10. What are the output sequences from `t=0` to `t=15` of the circuit when fed the following input (fed from *left* to *right*): `1101 1111 1110 0010` from `t=0` to `t=15` respectively? Assume that the initial states are `AB=00`.
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	Given that the initial state is <code>AB=00</code>, that makes <code>B = 1</code> at <code>t=0</code>.  This is doable the tedious way by simply tracing the output <code>y</code> sixteen times from <code>t=0</code> to <code>t=15</code>. We can also deduce from the functionality of the device, that is to <strong>detect</strong> three consecutive <code>1</code>'s and output <code>0</code> afterwards. The output sequence is therefore <code>0000 0011 1111 0000</code> from <code>t=0</code> to <code>t=15</code>. repectively.
	</p></div>

## State-Machine Timing Computation (Intermediate)

Take a look at the following State Machine circuitry:

<img src="https://dropbox.com/s/d8o2nhv1ugouf2g/Q3.png?raw=1"  style="width: 70%;">

The device `A2` has the following schematic:

<img src="https://dropbox.com/s/9e2jzfrwtjto34p/Q4.png?raw=1" style="width: 50%;">


It is made out of this device we call `A000R` with **tcd** = `1ns`, and **tpd** = `3ns` with the following schematic:

<img src="https://dropbox.com/s/55rj88ehoozyo6y/Q5.png?raw=1" style="width: 50%;">

The truth table for `A000R` is as follows: 

$$
\begin{matrix}
    A & B & C & D & E \\
    \hline 
    0 & 0 & 0 & 0 & 0 \\
    0 & 0 & 1 & 1 & 0 \\
    0 & 1 & 0 & 1 & 0 \\
    0 & 1 & 1 & 0 & 1 \\
    1 & 0 & 0 & 1 & 0 \\
    1 & 0 & 1 & 0 & 1 \\
    1 & 1 & 0 & 0 & 1 \\
    1 & 1 & 1 & 1 & 1 \\
    \hline
\end{matrix}
$$

The timing specifications for other devices in the state machine is:
*  The Mux has the following time specification: **tcd** = `1ns`, and **tpd** = `2ns`.

* The Registers has the following time specification: **tcd** = `2ns`, **tpd** = `5ns`, **ts** = `2ns`, **th** = `2ns`.

Both `A1` and `A2` are **combinational** logic that contains `A000R` only. Unfortunately, the design for `A1` is *missing*. We only know that `A1` uses only `A000R` to compute the output and the next state function **and that A1 has the same **tpd** as A2**. The other information that we have is that the output of `A1`, `X[2:0]` is a sequence of decimal, `[1, 2, 3, ... ]` in the *binary* form, i.e. `[001, 010, 011, ...]`.

Answer the following questions:
1. How many bits should the constant `Z1` have?
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	Since one of the inputs to the muxes are 3-bits, this hardware is implemented using three 2-input mux. <code>Z1</code> is essentially <strong>three bits</strong>, connected to <i>each</i> of the three copies of 2-input muxes.
	</p></div><br>

2. How many bits should the constant `Z2` have?
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	<strong>1 bit</strong>. The number of bits of each input to a combinational logic device such as <code>A1</code> <i>does not depend on anything else or other inputs.</i>
	</p></div><br>

3. What is the decimal value of `Z1`?
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	Since <code>X[2:0]</code> produces an increasing sequence from decimal value of <code>1,2,3,4,...</code> etc, we can easily guess that the the decimal value of <code>Z1</code> should be <code>0</code>, such that when there's a <code>RESET</code>, the output of the register <code>R1</code> is zero.
	</p></div><br>

4. What is the decimal value of `Z2`?
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	<code>Z2</code>'s decimal value is <code>1</code>. The same reason applies: since the sequence <code>X[2:0]</code> produced by <code>A1</code> is increasing by 1, the input to <code>A1</code> should be 1 such that at *every* cycle, theres an addition of 1 to be produced at <code>X</code>.
	</p></div><br>

5. What is the **tpd** of `A2` in nanosecond?
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	The  **tpd**  of <code>A000R</code> is 3ns, hence the  **tpd**  of <code>A2</code> is <code>9ns</code> since it is made out of three <code>A000R</code> modules connected in series.
	</p></div><br>
	
6. What is the minimum clock period in nanosecond?
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
		The <i>longest</i> path that the clock period has to satisfy is <code>R1 -> A1 -> A2 -> Z1 -> R2</code>. Hence we need to consider the **tpd** of all devices in its path (except <code>R2</code>) plus **ts** of <code>R2: 5+9+9+2+2 = 27ns</code>.
	</p></div><br>

7. What is the minimum **tcd** of `A1` in nanosecond such that **th** of input (`Z2`) can be 0?
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	**tcd** of <code>A1</code> has to be large enough so as to satisfy  **th** of <code>R1</code>. **th** of <code>R1</code> is <code>2ns</code>, and  **tcd** of the mux is <code>1ns</code>. Therefore min **tcd** of <code>A1</code> is <code>2-1 = 1ns</code>.
	</p></div><br>

8. What is value of `A2`'s **tcd** in nanosecond?
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	The **tcd** of <code>A2</code> is basically the **tcd** of a single <code>A000R (1ns)</code> since that is the <i>shortest</i> path from any input to any output in <code>A2</code>.
	</p></div><br>

9. When `RESET` is `1` for several cycles, what will be the value of `X[2:0]`?
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	When <code>RESET</code> is <code>1</code>, the output of <code>R1</code> will be <code>000</code>. Hence the value of <code>X[2:0]</code> will be <code>001</code>..
	</p></div><br>

10. When X's output is sequences of value `[1, 2, 3, ...]`, what is the value of `RESET`?
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	<code>RESET</code> has to be <code>0</code> to enable the <i>addition</i> of the previous value of X to take effect, and form a new value of X in the next clock cycle.
	</p></div><br>

Now, suppose that at time `t=0`, `RESET` signal is changed from `1` to `0`, and `X` becomes `001`. From then on, `RESET` remains 0:

1. What is the decimal value of `O[2:0]` at time `t = 0`?
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	 <code>X</code>  is  <code>001</code>  and  <code>Y</code>  is  <code>000</code>  at  <code>t=0</code>. Using the truth table of  <code>A000R</code> and the schematic of  <code>A1</code>, we can deduce that  <code>O[2:0]</code>at  <code>t=0</code> is  <code>1</code>.
	</p></div><br>

2. What is the decimal value of `O[2:0]` at time `t = 1`?
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	 <code>X</code>  is  <code>010</code>  and  <code>Y</code>  is  <code>001</code>  at  <code>t=1</code>. Using the truth table of  <code>A000R</code> and the schematic of  <code>A1</code>, we can deduce that  <code>O[2:0]</code>at  <code>t=1</code> is  <code>3</code>.
	</p></div><br>

3. What is the decimal value of `O[2:0]` at time `t=3`?
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	 <code>X</code>  is  <code>011</code>  and  <code>Y</code>  is  <code>011</code>  at  <code>t=2</code>. Using the truth table of  <code>A000R</code> and the schematic of  <code>A1</code>, we can deduce that  <code>O[2:0]</code>at  <code>t=3</code> is  <code>2</code>.
	</p></div><br>





## FSM Possibility (Basic)


We saw that certain functions, such as parentheses checking, cannot be performed by any finite state machine. **Which of the following can be performed by an FSM?** 

Assume, in each case, that the device is to take a series of `0`s and `1`s that represent the digits of a binary number entered *left-to-right*. 

1. The device is to have a **single** output, which is 1 only under this specific condition: *when the last 277 digits entered have been alternate `1`s and `0`s.*
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	<strong>Yes</strong>. It is a bit tedious for 277 digits, but you should be able to sketch FSM for 3 or 4 digits.
	</p></div><br>


1. The device is to have a **single** output, which is 1 only under this specific condition: *when more 0s than 1s have been entered*.

	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	<strong>No</strong>. Requires unbounded counting.
	</p></div><br>

1. The device is to have a **single** output, which is 1 only under this specific condition: *when the number entered thus far is **divisible** by 3.*

	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	<strong>Yes</strong>, can be done by a 3-state machine.
	</p></div><br>


1. The device is to have a **single** output, which is 1 only under this specific condition: *when an odd number of 1s and and even number of 0s have been entered.*

	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	<strong>Yes</strong>,, can be done with a 4-state machine. 
	</p></div><br>









 





