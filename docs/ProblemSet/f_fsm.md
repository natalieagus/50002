---
layout: default
permalink: /problemset/fsm
title: Finite State Machine
description: Practice questions containing topics from Finite State Machine
parent: Problem Set
nav_order: 4
---


* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design


# State Machine
{: .no_toc}

Each topic's questions are grouped into **three** categories: basic, intermediate, and challenging. You are recommended to do all basic problem set before advancing further. 
## Classifying FSM (Basic)
The diagram below illustrates the FSM diagram of a machine that has the same purpose. The circle that is bolded signifies the starting state. 

State whether the following is *true or false* and explain your answer:
* **Statement 1:** "Diagram A illustrates a Mealy machine."
* **Statement 2:** "Diagram B can be further minimized."

What is the *purpose* of these FSMs?

<img src="https://dropbox.com/s/ssyur5zn29v5rsq/fsmmeally.png?raw=1" class="center_fifty"  >


<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
<p>
<strong>Statement 1</strong> is <span style="color:red; font-weight: bold;">false</span> because the machine in Diagram A has its output that depends only on its state. <strong>Statement 2</strong> is **true**, we can minimise it into just two states because <code>S1</code> and <code>S2</code> are <strong>equivalent</strong>. 
<br><br>
The purpose of both machines is to detect the presence of an edge and output a <code>1</code> <strong>once</strong> for the cycle where the edge happens, and <code>0</code> otherwise.
</p>
</div><br>

Your friend plot the timing diagram of the machine in Diagram A and obtain the following output:

<img src="https://dropbox.com/s/cws3uke3gekty4k/plotfsm.png?raw=1"  class="center_fifty">

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
The ACME Company has recently received an order from a Mr. Wiley E. Coyote for their all-digital Perfectly Perplexing Padlock (P3):
* The P3 has **two** buttons ("0" and "1") that when pressed cause the FSM controlling the lock to advance to a new state. 
* In addition to advancing the FSM, each button press is encoded on the B signal (B=0 for button "0", B=1 for button "1"). 
* The padlock **unlocks** when the FSM sets the UNLOCK output signal to 1, which it does whenever the last N button presses correspond to the unique N-digit combination.
* The FSM should **not** fully reset if a valid prefix (1 bit) of the sequence is still present, so after an incorrect input, **check if the last entered digit matches the beginning of the correct sequence**.

  
Unfortunately the design notes for the P3 are *incomplete*. Using the specification above and clues gleaned from the partially completed diagrams below **fill in the information that is missing from the state transition diagram** with its **accompanying truth table**. 

<img src="{{ site.baseurl }}//docs/ProblemSet/images/f_fsm/2025-02-24-16-22-45.png"  class="center_seventy"/>

When done,
*  Each state in the transition diagram should be assigned a 2-bit state name `S1 S0` (note that in this design the state name is not derived from the combination that opens the lock),
*  The arcs leaving each state should be mutually exclusive and collectively exhaustive,
*  The value for UNLOCK should be specified for each state, and the truth table should be completed.

Also, **what** is the **combination** of the lock? 

<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
<p>
This state machine is a <strong>Moore machine</strong>. The completed state transition diagram and truth table is as follows:
<br>
<img src="{{ site.baseurl }}//docs/ProblemSet/images/f_fsm/2025-02-24-16-23-16.png"  class="center_seventy"/>
<br>
The combination for the lock is <code>010</code>.
</p></div>

## Constructing an FSM (Basic)

Construct a **divisible-by-3** **Moore** FSM that accepts a binary number entered **one** bit at a time. The most significant bit entered first, and the FSM should indicate with an output light (1 bit) if the number entered so far is divisible by 3. 

{: .new-title}
> Hint
> 
> The FSM has 3 states.


Answer the following questions:

1.  Draw a state transition diagram for your FSM indicating the initial state and for which states the light should be turned on. 
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>

	If the **value** of the number entered so far is `N`, then if digit `b` is entered next, the value of the new number `N'` is `2N + b`. Using this fact:
	<ul>
	<li>  If `N mod 3 == 0` then for some integer `p`,` N = 3p + 0`. After the digit b is entered, `N' = 6p + b`. So `N'` is `b mod 3`.</li>
	<li>  If `N mod 3 == 1` then for some integer `p`, `N = 3p + 1`. After the digit b is entered, `N' = 6p + 2 + b`. So `N'` is `b+2 mod 3`.</li>
	<li>  If `N mod 3 == 2` then for some integer `p`, `N = 3p + 2`. After the digit b is entered, `N' = 6p + 4 + b`. So `N'` is `b+1 mod 3`.</li>
	</ul>
	<br>This leads to the following transition diagram where each state corresponds to each of the possible values of `N mod 3`.
	<br>
	<img src="https://dropbox.com/s/kp3njg0hbw6kwwb/FSMqn.png?raw=1" class="center_fifty" >
	<br>
	</p></div>

2. Construct a truth table for the FSM logic. Inputs include the state bits and the next bit of the number; outputs include the next state bits and the control for the light. Remember that this should be a Moore machine, so the output (light) should follow the **current** state output and not the next state. 
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
	\text{light } &= \overline{S_1} \cdot \overline{S_0}\\
	S_1' &= \overline{S_1} \cdot S_0 \cdot \overline{b} + S_1 \cdot \overline{S_0} \cdot b \\
	S_0' &= \overline{S_1} \cdot \overline{S_0} \cdot b + S_1 \cdot \overline{S_0} \cdot \overline{b}\\
	\end{aligned}
	$$

	</p>
	</div><br>

## Hardware Implementation of a state machine (Intermediate)

Consider the schematic of a machine as follows, which function is to: *detect a sequence of three or more consecutive 1’s, and output: 1 after three or more consecutive 1’s, or 0 otherwise.*

<img src="https://dropbox.com/s/nx1s0kw3iu0cvqz/Q6.png?raw=1" class="center_fifty" >

[Video explanation here.](https://youtu.be/WbhtWbL45jw) 

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
	The clock period has to satisfy the <strong>feedback</strong> path (t2 timing constraint), that is made up with **tpd** of the <code>dff</code>,  **tpd** of the <code>AND</code> gate,  **tpd** of the <code>OR</code> gate, plus **ts** of the register. This adds up to <code>2+2+2+1 = 7ns</code>. Hence the maximum frequency is:$$\frac{1}{(7*10^{-9})}= 142.9MHz$$.
	</p>
	</div><br>

10. What are the output sequences from `t=0` to `t=15` of the circuit when fed the following input (fed from *left* to *right*): `1101 1111 1110 0010` from `t=0` to `t=15` respectively? Assume that the initial states are `AB=00`.
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	Given that the initial state is <code>AB=00</code>, that makes <code>B = 1</code> at <code>t=0</code>.  This is doable the tedious way by simply tracing the output <code>y</code> sixteen times from <code>t=0</code> to <code>t=15</code>. We can also deduce from the functionality of the device, that is to <strong>detect</strong> three consecutive <code>1</code>'s and output <code>0</code> afterwards. The output sequence is therefore <code>0000 0011 1111 0000</code> from <code>t=0</code> to <code>t=15</code>. repectively.
	</p></div>

## State-Machine Timing Computation (Intermediate)

Take a look at the following State Machine circuitry:

<img src="https://dropbox.com/s/d8o2nhv1ugouf2g/Q3.png?raw=1"  class="center_fifty">

The device `A2` has the following schematic:

<img src="https://dropbox.com/s/9e2jzfrwtjto34p/Q4.png?raw=1" class="center_thirty">

It is made out of this device we call `A000R` with **tcd** = `1ns`, and **tpd** = `3ns` with the following schematic:

<img src="https://dropbox.com/s/55rj88ehoozyo6y/Q5.png?raw=1" class="center_thirty">

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

Both `A1` and `A2` are **combinational** logic that contains `A000R` only. Unfortunately, the design for `A1` is missing. We only know that `A1` uses only `A000R` to compute the output and the next state function and that `A1` has the same **tpd** as `A2`. The other information that we have is that the output of `A1`, `X[2:0]` is a sequence of decimal, `[1, 2, 3, ... ]` in the binary form, i.e. `[001, 010, 011, ...]`.

[Video explanation here.](https://youtu.be/dAQTt2aojrY) 

Answer the following questions:
1. How many bits should the constant `Z1` have?
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	Since one of the inputs to the MUXes are 3-bits, this hardware is implemented using three 2-input MUX. <code>Z1</code> is essentially <strong>three bits</strong>, connected to <i>each</i> of the three copies of 2-input MUXes.
	</p></div><br>

2. How many bits should the constant `Z2` have?
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	<strong>1 bit</strong>. The number of bits of each input to a combinational logic device such as <code>A1</code> does not depend on anything else or other inputs.
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
		The longest path that the clock period has to satisfy is <code>R1 -> A1 -> A2 -> Z1 -> R2</code>. Hence we need to consider the **tpd** of all devices in its path (except <code>R2</code>) plus **ts** of <code>R2: 5+9+9+2+2 = 27ns</code>.
	</p></div><br>

7. What is the minimum **tcd** of `A1` in nanosecond such that **th** of input (`Z2`) can be 0?
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	**tcd** of <code>A1</code> has to be large enough so as to satisfy  **th** of <code>R1</code>. **th** of <code>R1</code> is <code>2ns</code>, and  **tcd** of the MUX is <code>1ns</code>. Therefore min **tcd** of <code>A1</code> is <code>2-1 = 1ns</code>.
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

10. When `X`'s output is sequences of value `[1, 2, 3, ...]`, what is the value of `RESET`?
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	<code>RESET</code> has to be <code>0</code> to enable the <i>addition</i> of the previous value of `X` to take effect, and form a new value of `X` in the next clock cycle.
	</p></div><br>

Now, suppose that at time `t=0`, `RESET` signal is changed from `1` to `0`, and `X` becomes `001`. From then on, `RESET` remains `0`:

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

3. What is the decimal value of `O[2:0]` at time `t = 3`?
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	 <code>X</code>  is  <code>011</code>  and  <code>Y</code>  is  <code>011</code>  at  <code>t=2</code>. Using the truth table of  <code>A000R</code> and the schematic of  <code>A2</code>, we can deduce that  <code>O[2:0]</code>at  <code>t=3</code> is  <code>2</code>.
	</p></div><br>





## FSM Possibility (Basic)


We saw that certain functions, such as parentheses checking, cannot be performed by any finite state machine. Which of the following can be performed by an FSM? 

Assume, in each case, that the device is to take a series of `0`s and `1`s that represent the digits of a binary number entered <span style="color:red; font-weight: bold;">left to right</span>. 

1. The device is to have a **single** output, which is 1 only under this specific condition: when the last `277` digits entered have been alternate `1`s and `0`s.
	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	<strong>Yes</strong>. It is a bit tedious for `277` digits, but you should be able to sketch FSM for 3 or 4 digits.
	</p></div><br>


1. The device is to have a **single** output, which is 1 only under this specific condition: when more 0s than 1s have been entered.

	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	<strong>No</strong>. Requires unbounded counting.
	</p></div><br>

1. The device is to have a **single** output, which is 1 only under this specific condition: when the number entered thus far is **divisible** by 3.

	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	<strong>Yes</strong>, can be done by a 3-state machine.
	</p></div><br>


1. The device is to have a **single** output, which is 1 only under this specific condition: when an odd number of 1s and and even number of 0s have been entered.

	<div  cursor="pointer"  class="collapsible">Show Answer</div>  <div  class="content_answer">
	<p>
	<strong>Yes</strong>,, can be done with a 4-state machine. 
	</p></div><br>









 





