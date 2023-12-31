---
layout: default
permalink: /lab/lab2
title: Lab 2 - Adder
description: Lab 2 handout covering topics from CMOS Technology and Logic Synthesis
parent: Labs
nav_order:  3
---

* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design
<br>
Modified by: Natalie Agus (2023) 
# Lab 2: Adder
{: .no_toc}
## Starter Code
The following files inside your `/50002/` folder are what you're going to use for this lab:
- `lab2_cmos_submit.jsim`
- `lab2_adder4_submit.jsim` 
- `lab2_debug.jsim` (for debugging only, no submission required)

Please submit all `*_submit.jsim` files by the due date (see course calendar), and do the lab questionnaire in eDimension as usual. 

## Related Class Materials
The lecture notes on **[CMOS technology](https://natalieagus.github.io/50002/notes/cmostechnology)** and **[logic synthesis](https://natalieagus.github.io/50002/notes/logicsynthesis)** are closely related to this lab.

**Part A:** Logic synthesis and CMOS circuit
<br>Related Notes: **Logic Synthesis**
* [Translating between truth table and boolean equation](https://natalieagus.github.io/50002/notes/logicsynthesis#straightforward-logic-synthesis)
* [Creating CMOS circuit from the given boolean equation](https://natalieagus.github.io/50002/notes/logicsynthesis#logic-synthesization-with-cmos), consisting of pull-up and pull-down parts then inverting the overall output.

**Part B:** Building XOR and XNOR gate using PFETs and NFETs
<br>Related sections in the notes:	
* [Logic Synthesis](https://natalieagus.github.io/50002/notes/logicsynthesis):
  * [N-input gates](https://natalieagus.github.io/50002/notes/logicsynthesis#n-input-gates) (other gates you can use to build a FA)
  * [Logic Synthesization with CMOS](https://natalieagus.github.io/50002/notes/logicsynthesis#logic-synthesization-with-cmos) (you can build a XOR or XNOR using CMOS)
* [CMOS Technology](https://natalieagus.github.io/50002/notes/cmostechnology):
  * [Understand why the C in CMOS is necessary](https://natalieagus.github.io/50002/notes/cmostechnology#complementary-mos-circuitry): to prevent short circuit; the PU and PD cannot both be ON. 

**Part C:** Build 1-bit Full Adder using gates you built in Part B
<br>Related Notes: **Logic Synthesis**
* [Sum-of-products](https://natalieagus.github.io/50002/notes/logicsynthesis#sum-of-products) (you can build a FA using AND, OR, and INV gates)
* [Universal gates](https://natalieagus.github.io/50002/notes/logicsynthesis#universal-gates) (you can build a FA using NANDs only or NORs only)
* Realise that there’s more than ONE way to construct a FA circuit. There’s no one *right or best* circuit. 

## 4-bit Ripple-Carry Adder
Your mission this week is to design and test a CMOS circuit that performs addition on **TWO** ***UNSIGNED*** 4-bit inputs: `A[3:0], B[3:0]`, producing a 5-bit output `S[4:0]`:

<img src="/50002/assets/contentimage/lab2/1.png"  class="center_thirty"/>

Before we do this, let's practice on your Logic Gate Design.

## Part A: CMOS Logic Gate Design

In this section, your mission is to create and test a CMOS circuitry that implements the function $$F(A,B,C) = C + A·B$$ using NFETs and PFETs. The truth table for F is shown below:


A |  B |  C | F(A,B,C)
---------|----------|---------|---------
0 | 0 | 0 | 0
0 | 0 | 1 | 1
0 | 1 | 0 | 0
0 | 1 | 1 | 1
1 | 0 | 0 | 0
1 | 0 | 1 | 1
1 | 1 | 0 | 1
1 | 1 | 1 | 1

### Task 1

{: .highlight}
**Write** your answer in the space provided  inside `lab2_cmos_submit.jsim`. Your solution should contain <span style="color:red; font-weight: bold;">NO</span> more than 8 MOSFETs. 

```cpp
.include "nominal.jsim"
.include "lab2cmoscheckoff.jsim"

.subckt F A B C Z
* BEGIN ANSWER
* NOT F CMOS circuitry: Pullup


* NOT F CMOS circuitry: Pulldown

* Inverter

*END ANSWER
.ends
```

You can follow this schematic to derive your answer. Note that circuit design is <span style="color:red; font-weight: bold;">not</span> tested in exams, but you need to be able to trace the outputs of a CMOS circuit given various combinations of inputs. 

<img src="{{ site.baseurl }}/assets/images/lab2/mhp-cmos.png"  class="center_fifty"/>

**Steps:**
* Open `lab2_cmos_submit.jsim` and write your answer there:
* There should be three parts to your answer:
  * The pullup circuitry (PFETs)
  * The pulldown circuitry (NFETs)
  * The inverter at the drain of $$\bar{F}$$ CMOS circuitry to produce back $$F$$
* Run it on jsim using the **FAST TRANSIENT ANALYSIS** button: 
<br><br>
<img src="/50002/assets/contentimage/lab1/8.png"  class=" center_fifty"/>
<br>
* You will need to **understand** the output plot, and the meaning of each line of instruction in the answer to be able to excel in the Lab Quiz. 

Click on the green tick button on the right hand corner of the plot window. A message as such should appear and brings you happiness. This means that all values produced by your circuit is as expected and passes the test:
<br><br>
<img src="/50002/assets/contentimage/lab1/6.png"  class=" center_fifty"/>


The files `nominal.jsim` and `lab2cmoscheckoff.jsim` contains the necessary circuitry to generate the appropriate input waveforms to test your circuit.  It includes a `.tran` statement to run the simulation for the appropriate length of time and a few .plot statements which will display the input and output waveforms for your circuit.

{: .new-title}
> Hints
> 
> Remember that only NFETs should be used in **pulldown** circuits and only PFETs should be in **pullup** circuits. Using six MOSFETs, we implement the complement of F as one large CMOS (complementary MOS) gate and then use the remaining two MOSFETs to **invert** the output of your large gate. Refer to the lecture on [CMOS Technology](https://natalieagus.github.io/50002/notes/cmostechnology) to understand how you can construct the circuit using complementary MOSFETs. 




## Part B: Building Logic Gates XOR and XNOR

Since logic gates are used to implement the logic for the full adder, a good place to start is to:
* Build your own gate library (e.g., inverter, 2-input `nand`, 2-input `nor`, `inv`, 2-input `xnor`, 2-input `xor`), 
* Test them individually, then
* Use them to implement your design.  

We have given you a headstart by implementing 2-input `nand`, 2-input `nor`, and `inv` for you inside `lab2_adder4_submit.jsim`. Now you just need to implement 2-input `xnor` and 2-input `xor` gates. 

### XOR and XNOR Gate Schematic
It’s much easier to debug your circuit module-by-module rather than as one big lump.  XOR/XNOR can be challenging gates to design; here’s one suggestion for how they might be implemented. Use PFET with specs: SW as 4 and SL as 1, and NFET with specs: SW as 2 and SL as 1. 

<img src="/50002/assets/contentimage/lab2/2.png"  class=" center_fourty"/>

<img src="/50002/assets/contentimage/lab2/3.png"  class=" center_fourty"/>

### Task 2

{: .highlight}
**Write** your xnor and xor circuitry inside `lab2_adder4_submit.jsim`. <br>

```cpp
* 2-input xor: input is a and b, output is z
.subckt xor2 a b z
* Build your own xor gate here
* BEGIN ANSWER


*END ANSWER
.ends

* 2-input xnor: input is a and b, output is z
.subckt xnor2 a b z
* Build your own xnor gate here
* BEGIN ANSWER


*END ANSWER
.ends
```

## Part C: Simple 1-bit Adder
Let’s start a simple **1-bit full-adder** module before proceeding to create a 4-bit Ripple-Carry adder. Later we will discuss higher performance adder architectures you can use in the implementation of the Beta (the computer central processing unit we will be designing in later labs).

The full adder module has **3 inputs** (`A`, `B`, and `Ci`) and **2 outputs** (`S` and `Co`). The logic equations and truth tables for `S` and `Co` are shown below.

<img src="/50002/assets/contentimage/lab2/5.png"  class=" center_seventy"/>

**Logic Equation:**

$$\begin{align}
S &= A \oplus B \oplus C_{i} \\
C_{o}  &= A \cdot B + A \cdot C_{i} + B \cdot C_i
\end{align}$$

{: .new-title}
> Hints
> 
> `S` is typically implemented using two cascaded 2-input XOR gates. You can use three 2-input NANDs and one 3-input NAND to implement `Co` (remember that by De Morgan’s Law, two cascaded NANDs are logically equivalent to a cascade of AND/OR).

### Task 3

{: .highlight}
**Write** your answer inside `lab2_adder4_submit.jsim`.

```cpp
* FA: 1-bit Full Adder circuit
* Input: a, b, ci 
* Output: s, co
.subckt FA a b ci s co
* write your FA circuitry here
* BEGIN ANSWER



*END ANSWER
.ends
```

### Ripple-Carry Adder
We can **cascade** FA units to form a **Ripple-Carry Adder** (RCA). The module performs the addition of two one-bit inputs (`A` and `B`) incorporating the carry in from the **previous** stage (`Ci`).  The result appears on the `S` output and a carry (`Co`) is generated for the **next** stage. 

A possible schematic for the 4-bit adder is shown below:

<img src="/50002/assets/contentimage/lab2/6.png"  class=" center_seventy"/>

We have implemented this part for you inside `lab2_adder4_submit.jsim`. Please study it. 

```cpp
.subckt ADDER4 a3 a2 a1 a0 b3 b2 b1 b0 s4 s3 s2 s1 s0
Xbit0 a0 b0 0 s0 c0 FA
Xbit1 a1 b1 c0 s1 c1 FA
Xbit2 a2 b2 c1 s2 c2 FA
Xbit3 a3 b3 c2 s3 s4 FA
.ends
```

### Testing your Circuit
The file `lab2_debug.jsim` contains code to debug and test your circuit. **You DO NOT need to submit this file.** 

You can use the file `8clocks.jsim` which can be included in your netlist to generate test waveforms for your circuits.  It provides eight different **square** waves (50% duty cycle) with different periods:

```cpp
clk1	period = 10ns
clk2  	period = 20ns
clk3  	period = 40ns
clk4  	period = 80ns
clk5  	period = 160ns
clk6  	period = 320ns
clk7  	period = 640ns
clk8  	period = 1280ns
```

For example, to completely test all possible input combinations for a 2-input gate, you could connect `clk1` and `clk2` to the two inputs and simulate for `20ns`. See `lab2_debug.jsim` file for example. You can open `lab2_debug.jsim` and click the **Fast Transient Analysis** button. Comment out the line `.include "lab2checkoff.jsim"` in `lab2_adder4_submit.jsim` if you want to plot these **debug plots** instead of the **checkoff plots**. Don't forget to uncomment back this line for your final submission.

Below is a screenshot on the contents of `lab2_debug.jsim`:

```cpp
.include "8clocks.jsim"
.include "lab2_adder4_submit.jsim"

Xdriver1 clk1 a inv
Xdriver2 clk2 b inv
Xdriver3 clk3 ci inv
X1 a b ci s co FA

.tran 40ns

.plot L(a)
.plot L(b)
.plot L(ci)
.plot L(s)
.plot L(co)
```

We use `clk1`, `clk2`, and `clk3` to create signals for `A`, `B`, and `Ci` using an **inverter** (you can use a buffer too, it doesn't really matter). Since each clock period is *double* the previous one, we will be able to create **all** 8 input combinations: `000, 001, …, 111` using these three clocks. 

Then we plug in `A`, `B`, and `Ci` signals to FA, getting its output: `S`, and `Co`. Afterwards, we plot them (the last 5 lines). 


Once you are somewhat confident that your circuit works properly, go to `lab2_adder4_submit.jsim` and click the **Fast Transient Analysis** (not device level simulation!) button. A waveform window as such should pop up:

<img src="/50002/assets/contentimage/lab2/12.png"  class="center_full"/>

This plot represents all signals produced by `s[4:0]` given various `a` and `b` values as time progresses (time is the x-axis). You can **zoom** in to see the plots better. 

Click on the top right hand corner green tick button to check if all values are as expected. If everything works correctly, this window should pop up and brings you happiness:

<img src="/50002/assets/contentimage/lab2/13.png"  class=" center_fifty"/>


## Appendix
### Interpreting analogue signal levels using JSim
Interpreting analog signal levels as logic values can be **tedious**. For a given signal `a`, JSim will do it for you automatically if you ask to plot `L(a)` instead of just `a`.  The logic-high and logic-thresholds are determined by the `vih` and `vil` options:

```cpp
.options vih=2.6 vil=0.6
```


These values are **already** specified in `nominal.jsim`, but you can override them in your own netlist.  Voltages between `vil` and `vih` are displayed as a filled-in rectangle to indicate that the logic value cannot be determined (**invalid** values).  For example:

<img src="/50002/assets/contentimage/lab2/9.png"  class="center_fourty"/>

You can also ask for the values of a set of signals to be displayed as a bus, e.g., `L(a3,a2,a1,a0)`. The signals should be listed, **most-significant bit first**. A bus waveform is displayed as a:
1. **Filled-rectangle** if any of the component signals has an **invalid** logic level or
2. As a hexadecimal value if it has a **valid** logic level. 

<img src="/50002/assets/contentimage/lab2/10.png"  class=" center_fourty"/>
<br><br>

There are three sections in the above plot:
1. Initially, the four signals `a3`, `a2`, `a1` and `a0` are interpreted as a **4-bit integer** with initial value of `1111 (0xF)`. 
2. Then, since x-axis represents **time**, the high-order bit (`a3`) is making a 1→0 transition. 
  * The filled-in rectangle represents the **period of time** during which `a3` transitions from **Vih** to **Vil**, rendering them ALL invalid denoted in the shaded rectangle 
  * If one signal is invalid, all signals in the bus will be deemed invalid as a shaded box!<>,
3. After the highest bit made a transition to zero completely, and the value of L ultimately became valid `0111 (0x7)`.
<br><br>
Below is the screenshot of the JSIM plot that you will see after you complete your code and would like to test the answer. You can use the plot to check if your code implements the functional specification of a 4-bit adder correctly. Each row is a plot of the values of the terminals over time. For simplicity, they’re **represented** in **hex** instead of in binary.  

<img src="/50002/assets/contentimage/lab2/11.png"  class="center_seventy"/>

<br><br>
**You can represent `a` which is just 1 bit in hex too**. The value of `a` is periodically changed between 1 and 0 (but when represented as hex it becomes 0x1 and 0x0 respectively even though `a` is ONE bit).

**Another example:**
* If signal `b` is 3 bits in length with a value of `101`, the hex representation is `0x5`
* If signal `c` is 6 bits in length with a value of `11111`, the hex representation is `0x3F`

The above plot is merely a digital value representation of the signal in hex. 
* The value of `b` and `ci` is initially `0`  
* The **expected** **output** when `a=1`, `b=1`, and `ci = 1` is `s=1` and `c0=1`. **We know this from the truth table.**
* The plot confirms that this is **true** since the values of `s` and `c0` are shown to indeed be 1 given that combination of `a=1`, `b=1`, and `ci=1` (bottom two rows)
