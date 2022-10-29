---
layout: default
permalink: /problemset/turingmachine
title: Turing Machine
description: Practice questions containing topics from Turing Machine 
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




# Turing Machine
{: .no_toc}

Each topic's questions are grouped into **three** categories: basic, intermediate, and challenging. You are recommended to do all basic problem set before advancing further. 

{: .note}
The amount of practice problems in this set is smaller than usual because the topics learned this week is mainly to **set up** the knowledge required for the following week. Please head to the next problem set for more practice problem.* 

## Ben's Turing Machine (Basic)

  
Ben Bitdiddle's proposed Ph.D. thesis involves writing a program to compute a function $$f(x)$$ on a Cray supercomputer. Ben's advisor points out that $$f$$ cannot be computed on any Turing machine. **Should Ben care? Why?**


<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
Church's thesis says that if the function can't be computed on any Turing machine, then it can't be computed on any physically realizable machine that we know of. So Ben is out of luck... a Cray <i>supercomputer</i> isn't "super" in that sense.
</p></div><br>
  
  

Discouraged by your answer to the last question, Ben has turned his attention to an alternative thesis topic. **He now proposes to invent the universal FSM,** which will be to FSMs what a universal Turing machine is to Turing machines. Ben's idea is to build an FSM that can fed a sequence of inputs describing any other FSM and the inputs to that FSM. The universal FSM would then *emulate* the behavior of the described FSM on the specified inputs. **Is Ben's idea workable Why or why not?**



<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
Unfortunately, the Universal FSM will have some fixed number (N) of states built into its design. So it won't have enough states to emulate machines with more than N states. Ben's idea isn't workable, and there's no such thing as "Universal FSM" as he proposed.
</p></div><br>
  


## FSM in TM (Intermediate)
We encode the state of a Turing machine into 2 bits, the value that is read (input) from and written (output) onto the infinite tape into 2 bits, and the output move on the tape (left or right) into 1 bit. How many different finite state machines are there to control such a Turing machine? 


<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
From the explanation above, we have:
<ul>
<li> **s = 2**</li>
<li> **i = 2**</li>
<li> **o = 3**</li>
</ul>
We can enumerate this many FSMs given s, o, and i bits: $$2^{(s+o)2^{s+i}}$$ 
Hence the answer to this question is: $$2^{80}$$
</p></div><br>




## Running a Turing Machine (Basic)

You are given a Turing machine (TM) with three states `(S0, S1, S2)` and a `HALT` state and the following state transition diagram and state table. The TM operates by reading and then moving either left (“L”) or right (“R”) on an infinite tape. **Note that the question defined it as we move the machine here (move the arrow), and not move the tape.**

The tape is used to encode a binary number with three symbols, “0”, “1” and “\_”, where “\_” is used to signal the **beginning** and **end** of the number. For instance, the binary number “1011” is represented on the tape as `_,1,0,1,1,_` (*most significant bit on the left*).

<img src="https://dropbox.com/s/4s0rvpzhm6twih9/tmqns.png?raw=1" class="center_seventy" >


If the tape is in the initial configuration `_,1,0,1,1,_`:
* and the Turing machine starts in **state `S0`**, 
* reading at the tape position of the `0`, 

...what is the state transition sequence that the machine is going to execute (including the start state S0) until it meets a `HALT`?


<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
Answering this is none other than executing the Turing Machine with the  given tape <code>_,1,0,1,1,_</code> and initial state <code>`S0`</code>, with the machine reading the tape at the <code>0</code>.
<br><br>
The sequences of the states until <code>HALT</code> is met is:
<code>S0, S0, S0, S0, S1, S1, S1, S2, S2, S2, HALT</code>
</p></div><br>

What is the **final configuration** of the tape after the TM has halted and **what does the TM do**?


<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
The final tape configuration is: <code>_,1,1,0,0,_</code>  It is obvious that the TM adds <code>1</code> to the input number.
</p></div><br>

## Edge Detector Machine (Intermediate)

The figure below shows a particular tape state *before* and *after* a Turing Machine that does *edge detection* is executed for 12 steps (12 clock cycles). 

Indicate **which of the following Turing Machine specification** [A], [B], [C], [D], [E] shown below is/are able to produce the "after" tape state *in exactly 12 cycles.

<img src="https://dropbox.com/s/isangqp3fexcao5/edgeDetectorTM.png?raw=1" class="center_seventy" >

* **Specification 1**: 
	$$\begin{matrix}
	S_i & \text{Input} & S_{i+1} & \text{Output} & \text{Move Tape}\\
	\hline
	S_0 & 0 & S_0 & 0 & L\\
	S_0 & 1 & S_1 & 1 & L\\
	S_1 & 0 & S_0 & 0 & L\\
	S_1 & 1 & S_2 & 0 & L\\
	S_2 & 0 & S_0 & 0 & L\\
	S_2 & 1 & S_2 & 0 & L\\
	\hline
	\end{matrix}$$<br><br>

* **Specification 2**: 
	$$\begin{matrix}
	S_i & \text{Input} & S_{i+1} & \text{Output} & \text{Move Tape}\\
	\hline
	S_0 & 0 & S_0 & 0 & L\\
	S_0 & 1 & S_1 & 1 & L\\
	S_1 & 0 & S_0 & 0 & L\\
	S_1 & 1 & S_1 & 1 & L\\
	\hline
	\end{matrix}$$<br><br>

* **Specification 3**: 
	$$\begin{matrix}
	S_i & \text{Input} & S_{i+1} & \text{Output} & \text{Move Tape}\\
	\hline
	S_0 & 0 & S_0 & 0 & L\\
	S_0 & 1 & S_1 & 1 & L\\
	S_1 & 0 & S_0 & 0 & L\\
	S_1 & 1 & S_1 & 0 & L\\
	\hline
	\end{matrix}$$<br><br>

* **Specification 4**: 
	$$\begin{matrix}
	S_i & \text{Input} & S_{i+1} & \text{Output} & \text{Move Tape}\\
	\hline
	S_0 & 0 & S_0 & 0 & L\\
	S_0 & 1 & S_1 & 1 & L\\
	S_1 & 0 & S_0 & 0 & L\\
	S_1 & 1 & S_2 & 1 & L\\
	S_2 & 0 & S_0 & 0 & L\\
	S_2 & 1 & S_2 & 1 & L\\
	\hline
	\end{matrix}$$<br><br>

* **Specification 5**: 
	$$\begin{matrix}
	S_i & \text{Input} & S_{i+1} & \text{Output} & \text{Move Tape}\\
	\hline
	S_0 & 0 & S_0 & 0 & L\\
	S_0 & 1 & S_1 & 1 & R\\
	S_1 & 0 & S_0 & 0 & L\\
	S_1 & 1 & S_2 & 0 & R\\
	S_2 & 0 & S_0 & 0 & L\\
	S_2 & 1 & S_2 & 0 & R\\
	\hline
	\end{matrix}$$<br><br>


<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
<strong>Specification 1</strong> and <strong>Specification 3</strong> produces the same output tape as shown above, given the initial tape content and the Turing Machine's start state (and location). We can run the machine five times with each specifications to obtain the answer, but the faster way is to observe them based on the functionality:
<ul>
<li> To detect an edge, there's no need to "re-read" previous input. Therefore <strong>Specification 5</strong> is definitely wrong (we only need to move the tape in one direction). </li>
<li> We only output <code>1</code> once on the occurence of an edge, so the specification shall not output too many <code>1</code>s. You can then start to suspect whether <strong>Specification 2</strong> and <strong>4</strong> are true, and quickly eliminate them from the pool of possible answers.  </li>
</ul>
</p></div><br>
