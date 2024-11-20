---
layout: default
permalink: /notes/fsm
title: Finite State Machine
description: Combining sequential and combinational logic devices to make a real and useful machine
nav_order: 7
parent: Hardware Related Topics
---


* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design

# Finite State Machine
{: .no_toc}
[You can find the lecture video here.](https://youtu.be/efLcdpqlAyI) You can also **click** on each header to bring you to the section of the video covering the subtopic. 

{:.highlight-title}
> Detailed Learning Objectives
>
> - **Explain the Basic Concept of Finite State Machines (FSMs):**
>   - Define a finite state machine (FSM) and its components: states, inputs, outputs, transitions, and outputs rules.
>   - Recognize the practical applications of FSMs in everyday devices like traffic lights and electronic locks.
> - **Differentiate Between Moore and Mealy Machines:**
>   - Identify the structural differences between Moore and Mealy FSMs.
>   - Analyze how outputs are determined in both Moore and Mealy machines based on state and input.
> - **Develop State Machine Diagrams and Truth Tables:**
>   - Create state machine diagrams and corresponding truth tables for digital lock mechanisms.
>   - Explain how to encode states for a given number of required bits.
> - **Design and Analyze FSMs:**
>   - Practice transforming state machine descriptions into Boolean equations.
>   - Practice construction of FSMs using different digital components like flip-flops and combinational logic units.
> - **Compare and Contrast Moore and Mealy Machines:**
>   - Discuss the advantages and disadvantages of Moore and Mealy machines in terms of state requirements and response times.
> - **Enumerate and Reduce FSMs:**
>   - Explain the concept of state equivalence and reduction to minimize the number of states in an FSM.
>   - Calculate the number of possible FSMs based on given bits for states, inputs, and outputs.
> - **Discuss FSM Limitations:**
>   - Evaluate the limitations of FSMs in computing tasks that require arbitrarily many states.
>
> The aim of these learning objectives is to master the fundamentals of finite state machines (FSMs), distinguishing between Moore and Mealy types, and to apply this knowledge in building, analyzing, and optimizing FSMs for various digital applications, while also preparing for advanced computational models like Turing machines.

## [Overview](https://www.youtube.com/watch?v=efLcdpqlAyI&t=0s)

The main aim for this chapter is to **understand** how we can utilise the topics we have learned in the previous chapters: pertaining *combinational logic* devices and synchronous *sequential logic* devices to create a specific device called the *finite state machine* (FSM). The FSM is an abstract mathematical model of a sequential logic function.

We frequently use FSMs in our daily lives:  traffic lights, vending machine, heating system, elevator, electronic locks (security systems), railroad systems, turnstile, alarm clock, and many more. We can create an FSM by implementing the functionality of the state machine using combinational logic devices, and assemble them with memory devices to form a complete (sequential logic) FSM circuitry. The FSM comes in two flavours: Moore and Mealy, which schematic is as shown: 

<img src="https://dropbox.com/s/y157lzv1g0lmwpl/Q2.png?raw=1"    >

We will learn in detail how each of them works in the later sections. 

  

## [Abstraction of Finite State Machine](https://www.youtube.com/watch?v=efLcdpqlAyI&t=163s)


A FSM (Finite State Machine) is formally defined to have:

1.  A set of $$k$$ states: $$S_1, S_2, ..., S_k$$ (where one of them should be the "initial" state)

1.  A set of $$m$$ inputs: $$I_1, I_2, ..., I_m$$

1.  A set of $$n$$ outputs: $$O_1, O_2, ..., O_n$$

1.  Transition rules $$s'(S_i, I_i)$$ for each of the $$k$$ states and $$m$$ inputs

1.  Output rules: $$f(S_i)$$ for each of the $$k$$ states



  

## [State Machine Diagram and the Truth Table](https://www.youtube.com/watch?v=efLcdpqlAyI&t=310s)

We can represent a state machine in two forms: **state transition diagram or truth table**.  

Suppose we have a simple digital lock machine, that will open only if we give the password: `0110`. The following state diagram illustrates how that lock works:
 
  <img src="https://dropbox.com/s/peuby3etfi3twvx/Q2%202.png?raw=1"  class="center_seventy" >

The **SX** state in bold represents the *initial* state. The **arrows** are the possible *transitions* between states. The little numbers beside the arrows are the kind of *input* required for state transition to happen. The word $$U$$ inside each state circle is the *output* of each state. If it is unlocked, $$U=1$$, otherwise $$U=0$$ for a locked output 

* When input `0110` is entered in that *exact* sequence, you'll land at `S_3` -- and the lock will be **unlocked**. 
* If at `S_0, S_1,` or `S_3` you *mistakenly* entered `0` instead of `1` (the correct subsequent digit to enter), then its counted as you *restarted* to `S_0` (not `S_X` -- because the first digit of the password is `0`). 
* If at `S_3` you entered `1`, then you land at `S_1` because its counted that the latest correct sequence so far is `01` (the `0` refers to the input entered that caused transition from `S2` to `S_3`).

There are **five** states in total, and we can encode them using 3 bits: `000, 001, 010, 011`, and `110` for `S_X, S_0, S_1, S2`, and `S_3` respectively. Since we have 5 states, we need at least $$\log_2(5) = 3$$ (rounded up) bits to represent the states, *any* 5 distinct values  from `000` to `111`. **This is called encoded representation** of the states.

Then, we can represent the functionality of the FSM in terms of a truth table below

$$
\begin{matrix}
S_i &  In & S_{i+1} & Out\\
\hline
000 & 0 & 001 & 0\\
000 & 1 & 000 & 0 \\
001 & 0 & 001 & 0\\
001 & 1 & 010 & 0\\
010 & 0 & 001 & 0\\
010 & 1 & 011 & 0\\
011 & 0 & 110 & 0 \\
011 & 1 & 000 & 0\\
110 & 0 & 001 & 1 \\
110 & 1 & 010 & 1\\
\hline
\end{matrix}
$$


{: .important}
$$s$$ state bits allow us to encode up to  $$2^s$$ different states. 

The output column in the figure above contains the output that depends on the current state only (also known as the Moore Machine, see next section).


## [Moore and Mealy Machine](https://www.youtube.com/watch?v=efLcdpqlAyI&t=615s)

  

There are two types of FSM (and equivalently two ways to draw the state transition diagram). The digitallock state transition diagram  shown in the previous section is called the **Moore** machine.

{:.highlight-title}
> Output depends solely on state
> 
> Notice that the the output is *drawn on the state (circle)*. This means that the output of the machine  depends on the *current* state. 

The second type of FSM is called the **Mealy** machine, and when we can draw the state transition diagram for Mealy machines by *drawing the output on the transition arrows*. This means that the output of the machine depends on both the *current* input and *current* state. 

We can implement the <span class="orange-bold">same</span> features (of a machine) using either Moore or Mealy configuration, for example, suppose we have a digital lock that can be opened with the password `011`. The state diagram for a Moore implementation of this lock and a Mealy implementation of this lock is as shown: 

<img src="https://dropbox.com/s/yirju0klzdsbj9y/Q3.png?raw=1"   >


We have 4 states for the Moore machine, so we can encode the states as `00, 01, 10,` and `11` for states `S0, S1, S2,` and `S3` respectively. 

The truth table for the Moore Machine above is (combinations that don't apply to the FSM is omitted):

$$
\begin{matrix}
S_i &  In & S_{i+1} & Out\\
\hline
00 & 0 & 01 & 0\\
00 & 1 & 00 & 0 \\
01 & 0 & 01 & 0\\
01 & 1 & 10 & 0\\
10 & 0 & 01 & 0\\
10 & 1 & 11 & 0\\
11 & 0 & 01 & 1 \\
11 & 1 & 00 & 1\\
\hline
\end{matrix}
$$


For the Mealy machine, we have **less** states and we can simply encode the states as `00, 01,` and `10` for `S0, S1`, and `S2` respectively. The truth table for the Mealy Machine above is:

$$
\begin{matrix}
S_i &  In & S_{i+1} & Out\\
\hline
00 & 0 & 01 & 0\\
00 & 1 & 00 & 0 \\
01 & 0 & 01 & 0\\
01 & 1 & 10 & 0\\
10 & 0 & 01 & 0\\
10 & 1 & 00 & 1\\
\hline
\end{matrix}
$$

**Conclusion:** Both tables have the same abstract functionality: which is a lock that unlocks once we key in the right password (`011`). We can implement this lock either as a Moore or a Mealy machine. 

{: .note}
One apparent difference is that a Mealy machine takes less number of states to implement, and a Moore lock machine takes 1 cycle *slower* to **unlock** than a Mealy lock machine. We will compare the pros and cons on each machine further in the later section.

## [Building a State Machine](https://www.youtube.com/watch?v=efLcdpqlAyI&t=987s)


We can build an FSM using Flip-Flops or registers, and combinational logic units such as using ROMs, or multiplexers among others. At first, we can transform the Moore Machine truth table in the previous section. Here it is for your reference:

$$
\begin{matrix}
S_i &  In & S_{i+1} & Out\\
\hline
00 & 0 & 01 & 0\\
00 & 1 & 00 & 0 \\
01 & 0 & 01 & 0\\
01 & 1 & 10 & 0\\
10 & 0 & 01 & 0\\
10 & 1 & 11 & 0\\
11 & 0 & 01 & 1 \\
11 & 1 & 00 & 1\\
\hline
\end{matrix}
$$

{% raw %}

Since there are two state bits, we can label the first bit (MSB) as $$S_{0_i}$$ and the second bit (LSB) as  $$S_{1_i}$$ (at time step $$i$$). We technically have three input bits: $$S_{0_i}$$, $$S_{1_i}$$, and $$In$$,  and three output bits: $$S_{0_{i+1}}$$, $$S_{1_{i+1}}$$, and $$Out$$  in total for the combinational logic part of the FSM. 

The boolean equation for the FSM  (Moore) truth table above is therefore:

$$
\begin{aligned}
S_{0_{i+1}} = & \overline{S_{0_i}} \cdot {S_{1_i}} \cdot \text{in} + S_{0_i} \cdot \overline{{S_{1_i}}} \cdot \text{in}\\
S_{1_{i+1}} = & \overline{S_{0_i}} \cdot \overline{{S_{1_i}}} \cdot \overline{\text{in}} + \\
& \overline{S_{0_i}} \cdot {S_{1_i}} \cdot \overline{\text{in}} + \\
& S_{0_i} \cdot \overline{{S_{1_i}}} \cdot \overline{\text{in}} + \\
& S_{0_i} \cdot \overline{{S_{1_i}}} \cdot \text{in}  + \\
& S_{0_i} \cdot {S_{1_i}} \cdot \overline{\text{in}}\\
Out = & S_{0_i}  \cdot S_{1_i} \cdot \overline{\text{in}}  + S_{0_i} \cdot S_{1_i} \cdot \text{in}  
\end{aligned}
$$
{% endraw %}

{: .new-title}
> Exercise
> 
> Can you minimise the equation above further? For the output bits, its obvious that current input does not matter since it is a Moore machine (can be proved mathematically as well by minimising the $$Out$$ boolean equation). 

To build the equivalent Mealy machine, we can transform the Mealy Machine truth table (pasted below for easier reference) into a boolean equation:


$$
\begin{matrix}
S_i &  In & S_{i+1} & Out\\
\hline
00 & 0 & 01 & 0\\
00 & 1 & 00 & 0 \\
01 & 0 & 01 & 0\\
01 & 1 & 10 & 0\\
10 & 0 & 01 & 0\\
10 & 1 & 00 & 1\\
\hline
\end{matrix}
$$


$$
\begin{aligned}
S_{0_{i+1}} = & \overline{S_{0_{i}}} \cdot S_{1_{i}} \cdot In\\
S_{1_{i+1}} = & \overline{S_{0_{i}}} \cdot \overline{S_{1_{i}}} \cdot \overline{In} + \\
& \overline{S_{0_{i}}} \cdot S_{1_{i}} \cdot \overline{In} + \\
& S_{0_{i}} \cdot \overline{S_{1_{i}}} \cdot \overline{In}\\
Out = & S_{0_{i}} \cdot \overline{S_{1_{i}}} \cdot In
\end{aligned}
$$

{: .new-title}
> Exercise
> 
> Can you minimise the equation above further? 

If you're interested to see how these FSM can be manifested into hardware, see this [Appendix section](#hardware-representation-of-digital-lock-fsm). 


## [Differences between Moore and Mealy Machine](https://www.youtube.com/watch?v=efLcdpqlAyI&t=1552s)

  

There are some differences when implementing a specification as a Moore machine vs a Mealy machine. 

### Characteristics of Moore Machine
A Moore machine has these characteristics:

1. The output  obtained is **depends** **only** on the **current** state (regardless of the input). For example in our simple digital lock above, the output = `1` (unlocked) only happens in State $$S_3$$ (`11`), regardless of whether the input is 0 or 1. 

2.  Sometimes, a Moore machine **may require more states**. It requires 4 states for the simple digital lock (vs 3 states in its Mealy configuration). 

3. The output of a Moore machine is *synchronized* with the state change.  In the example of our smaller digital lock above, the lock is unlocked **only in the *next*** cycle (only in the next cycle where you'll reach $$S_3$$ *after* you keyed in the password: `011` in the current cycle). 

  
### Characteristics of Mealy Machine
On the other hand, a Mealy machine has these characteristics:

1.  The output of a Mealy machine is affected by both the current state and the current input.

2. Mealy machines react *immediately* with the presence of an input (instead of having to obtain the output in the next cycle). We can see that in the digital lock's truth table, that when we are at state $$S_2$$ = `10`, we obtain the unlock (out = `1`) state **immediately** after we key in the last digit of the password. 

3. Typically we can have *less states* and *less transitions*. This means that we can potentially use less registers and logic gates (for the CL) in a Mealy machine, potentially reducing its cost (and size). 

  

### Further Observation
A Mealy machine may seem *faster* or *more responsive* than the Moore machine since the output can  be produced approximately $$t_{pd}$$ (or almost immediately if $$t_{pd}$$ of the last CL unit is small) after input arrives. However  the output of a Moore machine is only obtained in the **next CLK cycle**. 

One CLK period typically takes much longer than the $$t_{pd}$$ of that smaller CL (at the output of the Flip-Flop) because:
- Dynamic discipline has to be obeyed, thus $$t_{pd}$$ of the bigger CL should be smaller than the CLK period 
- Logically, $$t_{pd}$$ of the smaller CL should be smaller than the $$t_{pd}$$ of a bigger CL, supporting the statement above. 


## [Enumerating FSM](https://www.youtube.com/watch?v=efLcdpqlAyI&t=2094s) 

  

The **goal** of this section is that, after establishing the abstraction (specs) of the FSM, we want to make a physical machine that can conform to the functional specification of our designed FSM. For any FSM, we can say that in general we need $$i$$ input bits, $$s$$ state bits, and $$o$$ output bits.


The truth table will look something like this for any *arbitrary* FSM with  $$i$$ input bits, $$s$$ state bits, and $$o$$ output bits:
 

<img src="https://dropbox.com/s/bmm0uh4uzk6mrwe/Q1.png?raw=1"  class="center_fifty" >

In short, we need **to create a combinational logic device** that conforms to the FSM's truth table. We have learned several ways to create such devices:

1.  By creating a ROM: use a demultiplexer, with each output bit soldered to conform to the truth table
1.  By deriving the sum of products and use a INV, AND, and OR gates
1.  By deriving the minimal boolean expression and create CMOS circuitry using CMOS recipe



  

Given $$i$$ input bits, $$s$$ state bits, and $$o$$ output bits we have a total combination of $$2^{i+s}$$ input-state combinations, and each input-state pair has $$o$$ bits as an output.  Hence, the number of possible FSMs that can be captured with $$i$$ input bits, $$o$$ output bits, and $$s$$ state bits is $$2^{(o+s)2^{i+s}}$$ FSMs.

{: .warning-title}
> Important
> 
> Some FSMs in these many possible FSMs may be **equivalent**. 

**Why is this so?**
-  We have $$2^{i+s}$$ input-state combinations if we have $$i$$ input bits and $$s$$ states -- *to define a particular FSM, we need to decide what is the value of next state and its corresponding output for each state-input combination.* 
-  Each combination results in $$o$$ output bits and $$s$$ end-state bits.
- This results in total of: $$(o+s)2^{i+s}$$ bits (to fill up) in both the output column and the next-state column
- Each bit can take up 2 values: `0` or `1`
-  Therefore we have $$2^{(o+s)2^{i+s}}$$ different FSMs


### Example

If $$i=1, o=1, s=1$$, then we can have $$256$$ different FSMs. The picture below shows 4 examples of the 256 different FSMS to paint a clearer picture. The shaded region (input-state combinations) are always the same, but the two columns on its right (next state-output combinations) always differ by at least one bit to define a *different* FSM. 

  

<img src="https://dropbox.com/s/pspqvc7b00homaa/fsms.png?raw=1"   >
  

The reason we want to **enumerate** number of possible FSMs given $$s$$ state bits, $$i$$ input bits, and $$o$$ output bits is because if we are going to make a *hardware* for this FSM using some generic components such as the multiplexer, ROMs, or other memory unit, we want to know *how many different FSMs* can we program onto this particular hardware size which we probably mass-produce.


## [FSM Equivalence and Reduction](https://www.youtube.com/watch?v=efLcdpqlAyI&t=1819s)
FSM A and FSM B shown below have the same functionality, however FSM A has double the amount of states than FSM B. In other words, we could have reduced FSM A by merging **equivalent** states. 
  
<img src="https://dropbox.com/s/4frikzlus8gcmeo/Q4.png?raw=1" >

To reduce the number of states in an FSM, we need to find pairs of **equivalent** states and merge them. 

{: .highlight}
Two states $$S_i$$ and $$S_j$$ are equivalent iff: for  an  arbitrary input  sequence applied  at  both  states,  the  **same**  **output sequence**  results . 

Looking at FSM A diagram above, we can deduce that $$S_3$$ and $$S_2$$ are **identical**:
1. In both states, the output is `1`
2. When either states receive input: `0`, it will transition to $$S_0$$ 
3. When either states receive an input: `1`, it will transition to $$S_3$$
4. There is no other input that can be fed to either states except the ones in (2) and (3).

Therefore, we can safely merge $$S_3$$ and $$S_2$$ into a new state $$S_4$$. The same steps (1) to (4) can be applied between the new state $$S_4$$ and state $$S_1$$, merging the two further and resulting in a minimised FSM like FSM B. 

### Benefits of FSM Reduction
Having less states will result in less bits to represent the states in the machine, and less transitions (i.e: simpler truth table). This in turn allows us to build the machine at a **cheaper** cost (less registers used to store state bits) and **smaller** size.

## FSM Limitations

FSM is not the ultimate computing device. 

{:.note}
Remember that the goal of this course is to teach you how to build a **general-purpose computer** from the ground up. A *general-purpose computer* is supposed to an *ultimate computing device,* able to solve *various computational problems and tasks* such as your math homework, running video games, rending graphics, playing music or video, browsing the web, and many more. 

FSM have the following limitations that prevent them from directly serving as a **general-purpose computer**:

1. **Memory Constraint:** FSMs have a finite number of states and cannot store or process arbitrary amounts of data, limiting their ability to solve tasks like managing dynamic memory or rendering graphics.  
2. **Scalability Issues:** As complexity increases, the state space grows exponentially, making FSMs impractical for handling diverse tasks like video games or web browsing.  
3. **No Context Awareness:** FSMs lack the ability to retain history or context beyond their current state, making them unsuitable for tasks requiring sophisticated data structures or sequential operations.  
4. **Input Dependence:** Pure FSMs rely on predefined input patterns, making them inflexible for dynamic and unpredictable tasks like music playback or web browsing.  
5. **Sequential Nature:** FSMs process one state at a time and struggle to handle parallel operations essential for modern multitasking systems.  

To build a **general-purpose computer**, we need more versatile computational models, like the **Turing Machine** (next chapter), which FSMs alone cannot achieve.
  

## [Summary](https://www.youtube.com/watch?v=efLcdpqlAyI&t=2375s)
[You may want to watch the post lecture videos here.](https://youtu.be/XJQaAG9xLoI)

Here are the key points from this notes:
1. **Finite State Machine**:  A **mathematical** model of computation used to design both computer programs and **sequential** logic circuits. They have the following characteristics:
   * **Finite Set of States**: An FSM consists of a finite number of states. At any given time, the machine is in one of these states.
   * **Initial State**: There is always one state designated as the initial state, where the machine starts operation.
   * **Input**: FSMs receive inputs that can trigger transitions from one state to another. The inputs are based on the application for which the FSM is designed.
   * **State Transitions**: The core functionality of an FSM is defined by its state transitions. Each transition specifies the movement from one state to another, based on the input and possibly the current state. These transitions are defined in a transition table that acts as a roadmap for the FSM.
   * **Outputs (Optional)**: FSMs can be classified into two types based on output behavior:
      - **Moore Machine**: The output is determined solely by the current state, not dependent on the input.
      - **Mealy Machine**: The output depends on both the current state and the input. This generally allows for more reactive outputs and can reduce the number of states needed.
   * **Deterministic Rules**: In deterministic FSMs, the exact next state is uniquely determined by the current state and input. There is no ambiguity in transition.
   * **Termination State (Optional)**: Some FSMs have designated final or accepting states, which indicate a stop in the process or a successful completion of the operation. 
2. **Moore & Mealy**: Two different kinds of FSM. Moore machines have outputs associated with its state, while Mealy machines have outputs associated with its transitions. Moore machines tend to have **more states** (than Mealy) for the same functionality, but this feature makes it more predictable and stable. Mealy machines tend to be more **responsive**, however can be glitchy as its **output** depends on **input** instead of associated with a state like Moore machines. 
3. **Minimising FSM**: Reduce the number of states & transitions of an FSM. This maintains its functionality while saving resources.
4. **Limitations of FSM**: FSM cannot solve problems that require infinitely many number of states in theory. For instance, it cannot solve arbitrary **parenthesis checker** problem because **we do not know (prior)** how many parenthesis are there to check, or how many will be left balanced or unbalanced. 


By definition, an FSM needs a **finite** amount of states. It is able to implement only tasks that require finite states, such as implementing junction traffic lights, line following robots, etc, but *not tasks that requires **arbitrarily many** number of states* (i.e: states that depend on input length for example). 

{: .note-title}
> The Turing Machine
> 
> We know that we can definitely write a program that performs parenthesis checking easily, so we know that our computers aren't just a *simple* FSM. In the next chapter, we will learned another class of machine called the **Turing Machine** that can tackle this issue. 


# Appendix

## Hardware Representation of Digital Lock FSM 

When the boolean equations for each digital lock machine ready, we can simply construct the machine using 2-bit Flip-Flops / Registers, and a combinational logic device. 

One possible schematic for the Moore version of the lock is :

<img src="https://dropbox.com/s/6trfvoracwgajwl/moore_1.png?raw=1" class="center_fifty"  >

 One possible schematic for the Mealy version of the lock is:
 
 <img src="https://dropbox.com/s/bu45lxkolwzbj8n/meally_1.png?raw=1" class="center_fifty"  >
 
Both diagrams above are obtained **after** minimising the boolean expression. There are other ways to construct them machine, such as using only NAND gates, only NOR gates, only multiplexers, or ROMs. Try it yourself as practice.

