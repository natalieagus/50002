---
layout: default
permalink: /problemset/logicsynthesis
title: Logic Synthesis
description: Practice questions containing topics from  Logic Synthesis
parent: Problem Set
nav_order: 2
---


* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design


# Logic Synthesis
{: .no_toc}

Each topic's questions are grouped into **three** categories: basic, intermediate, and challenging. You are recommended to do all basic problem set before advancing further. 
## CMOS Circuit Boolean Expression (Basic)

<img src="/50002/assets/contentimage/pset2/10.png"  class="center_thirty"/>

1. **Draw** the truth table of the CMOS circuit above. 
2. What is the **boolean** expression for the CMOS circuit shown?



<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
1.  The truth table of the CMOS circuit contains 16 lines since there are 16 possible input combinations and 1 possible output bit: 
<br>
$$\begin{matrix} 
A & B & C & D & F \\ \hline 0 & 0 & 0 & 0 & 1 \\ 0 & 0 & 0 & 1 & 1 \\ 0 & 0 & 1 & 0 & 1 \\ 0 & 0 & 1 & 1 & 1 \\ 0 & 1 & 0 & 0 & 1 \\ 0 & 1 & 0 & 1 & 1 \\ 0 & 1 & 1 & 0 & 1 \\ 0 & 1 & 1 & 1 & 1 \\ 1 & 0 & 0 & 0 & 1 \\ 1 & 0 & 0 & 1 & 1 \\ 1 & 0 & 1 & 0 & 1 \\ 1 & 0 & 1 & 1 & 0 \\ 1 & 1 & 0 & 0 & 1 \\ 1 & 1 & 0 & 1 & 0 \\ 1 & 1 & 1 & 0 & 1 \\ 1 & 1 & 1 & 1 & 0 \\ \hline \end{matrix}$$
<br><br>
2. The final boolean expression is: $$F = \overline{A(B+C)D}$$
</p></div><br>



  
  
  

## Combinational Circuit's Functional Specs (Basic)
Consider the following circuit that implements the 2-input function $$H(A,B)$$:

<img src="/50002/assets/contentimage/pset2/4.png"  class="center_fifty"/>

1. Write down the **truth table** for $$H$$.
2. Give a **sum-of-products expression** that corresponds to your truth table.
3. Using the information below, what are the **tcd** and **tpd** of the circuit?
	- **tcd** and **tpd** of `NOR2`:  5ns, 30ns
	- **tcd** and **tpd** of `NAND2`: 5ns, 30ns
	- **tcd** and **tpd** of `AND2`:  6ns, 50ns
	- **tcd** and **tpd** of `OR2`: 10ns, 20ns
	- **tcd** and **tpd** of `INV`: 1ns, 3ns


<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
<ol type="1">
<li> The truth table for H is as follows: 
$$\begin{matrix}
A & B & H \\
\hline
0 & 0 & 1\\
0 & 1 & 1 \\
1 & 0 & 0 \\
1 & 1 & 1\\
\hline
\end{matrix}
$$</li><br>
<li> We begin by finding the expression of the topmost two circuits and applying de Morgan's law: $$\overline{A + \overline{B}} = \overline{A}B$$ 
<br><br>Then, we find the expression of the next pair, which is: $$AB$$
We combine this with the above using a NOR gate and reduce the result, $$\overline{\overline{A}B + AB} = \overline{B}$$<br>
<br>Finally, we find the expression for the bottom two pairs, which is simply: $$A+B$$
Combining this with the above expression, we reduce and apply de Morgan's law:
$$\begin{aligned} \overline{(A+B)\overline{B}} &= \overline{A \overline{B} + B \overline{B}} = \overline{A\overline{B}} = \overline{A} + B\\
\end{aligned}$$
</li><br>
<li>The **contamination** delay is the path  (from any input to any output)  that results in the **shortest** time: `NOR2` + `NOR2` + `NAND2` = 5 + 5 + 5 = 15ns. The **propagation** delay is the path (from any input to any output) that results in the **longest** time: `AND2` + `NOR2` + `NAND2` = 50 + 30 + 30 = 110ns.</li></ol>
</p></div><br>

  
  
  

## Simple Boolean Algebra (Basic)
  

Given the following truth table,

$$\begin{matrix}
A & B & C & OUT \\
\hline
0 & 0 & 0 & 1 \\
0 & 0 & 1 & 1 \\
0 & 1 & 0 & 1 \\
0 & 1 & 1 & 0 \\
1 & 0 & 0 & 1 \\
1 & 0 &  1 & 1 \\
1 & 1 & 0 & 1 \\
1 & 1 & 1 & 0 \\
\hline
\end{matrix}$$


  

Choose all  correct Boolean expression(s) of this circuit:
(a). $$OUT = \bar{C} + \bar{B}$$ <br>
(b). $$OUT = \bar{A} \cdot \bar{B} + A \cdot \bar{B} + B \cdot \bar{C}$$ <br>
(c). $$OUT = \bar{A} \cdot \bar{C} + A \cdot B \cdot \bar{C} + \bar{B}$$ <br>
(d). $$OUT = \bar{A} \cdot B + A \cdot B \cdot \bar{C} + \bar{B}$$

{: .new-title}
> Hint
>
> Express the table in terms of sum of products first and then simplify the expression.

<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
<strong>(a), (b), and (c)</strong> are all <strong>equivalent</strong> and represents the truth table.
</p></div><br>

  

## Reading ROM (Basic)


What is the the **sum-of-products** for the following ROM (Read Only Memory)?

<img src="/50002/assets/contentimage/pset2/5.png"  class="center_thirty"/>

  
<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
$$Y = \bar{A}\bar{B}\bar{C} + \bar{A}BC + A \bar{B} C+ AB\bar{C}$$ 
This expression can be computed easily after you create a truth table first out of the ROM.
</p></div><br>


  

##  Implementing Half-Adder using ROM (Basic)

  
<img src="https://dropbox.com/s/m643xvogmyh405r/farom.png?raw=1" class="center_fifty"  >


Take a look at the figure above. **Which** of the above ROM represents the functionality of a **half adder**?

  


<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
**ROM [3]** represents half-adder functionality. 
<br><br>
`Y`'s output shows a `XOR(A,B)` while `Z`'s output shows an `AND(A,B`). Hence this make `Y` to be the adder's **SUM** output and **Z** to be the adder's **CARRY** output.
</p></div><br>
  


## CMOS Gate Analysis (Basic)

  

The following diagram shows a schematic for the pulldown circuitry for a particular CMOS gate:

<img src="/50002/assets/contentimage/pset2/6.png"  class="center_fourty"/>

1. What is the correct schematic for the **pullup** circuitry?
2. Assuming the pullup circuitry is designed correctly, what is the **logic function** (boolean function) implemented at this gate?
3. Assuming the pullup circuitry is designed correctly, when the output of the CMOS gate above is a **logic "0"** in the steady state, what would we expect the ***voltage* value** of the output terminal to approximately be? What would be the approximate voltage output value if the output were a **logic `1`?**




<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
<ol type="1">
<li> The output for the pullup circuitry is the inversion of the output of the pulldown circuitry: 
$$\overline{(A+B) C + D} = (\overline{A} \text{ }\overline{B} + \overline{C}) \overline{D}$$ 
We don't need to add inverter in the inputs. Convince yourself that this is true by tracing some input combinations to the output terminal.
<br>
<img src="
https://dropbox.com/s/6romn7t1g594ddz/pfetup.png?raw=1"  class="center_twenty" >
</li><br>
<li>From the pulldown diagram, it seems like the output is 0 if D is 1, or A and C is 1, or B and C is 1. Therefore, the output for the gate is the <strong>inverse</strong> of the expression of the pulldown circuitry, which is the output of the pullup circuitry above: $$\overline{(A+B) C + D} = (\overline{A} \text{ }\overline{B} + \overline{C}) \overline{D}$$
</li><br>
<li> The voltage of the output terminal at `0` steady state is `0` (GND). The voltage of the output terminal at `1` steady state is VDD's voltage.</li></ol></p></div><br>


  
  
  

## Simplifying a Rather Complicated Boolean Expression (Intermediate)

Simplify the following boolean expression:

$$\begin{aligned} Y = &AB \bar{C} \bar{D} + AB \bar{C}D + \\
						& \bar{A} \bar{B}CD + \bar{A}BCD + \\
						& ABCD + A\bar{B}CD + \bar{A}\bar{B}C \bar{D} + \\
						& ABC \bar{D} + A\bar{B}C \bar{D}
\end{aligned}$$



<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
The final simplified form is $$Y = AB + CD + \bar{B}C$$ 
The steps are as follows:
$$\begin{aligned}
Y &= AB \bar{C} \bar{D} + AB \bar{C}D + \bar{A} \bar{B}CD + \bar{A}BCD + ABCD \\
& + A\bar{B}CD + \bar{A}\bar{B}C \bar{D} + ABC \bar{D} + A\bar{B}C \bar{D}\\
&= AB\bar{C} + \bar{A}CD + ACD + \bar{B}C\bar{D} + ABC\bar{D}\\
&= CD + AB\bar{C} + \bar{B}C\bar{D} + ABC\bar{D}\\
&= C(D + \bar{B} \bar{D}) + AB(\bar{C} + C\bar{D} )\\
&= C(D + \bar{B} ) + AB(\bar{C} + \bar{D} )\\
&=CD + C\bar{B} + AB(\overline{CD} )\\
&= CD + C\bar{B} + AB
\end{aligned}$$
<br>
Convince yourself that the simplified form allows you to make a cheaper and smaller combinational logic device (because we use less number of gates).
</p></div><br>

  

## CMOS Gate Design (Challenging)

Anna Logue, a circuit designer who missed several early 6.004 lectures, is struggling to design her first CMOS logic gate. She has implemented the following circuit:

<img src="https://dropbox.com/s/4a5ipod927ton7h/Q2.png?raw=1" class="center_fourty"  >


Anna has fabricated 100 test chips containing this circuit, and has a simple testing circuit which allows her to try out her proposed gate statically for various combinations of the A and B inputs. 

She has burned out 97 of her chips, and needs your help before destroying the remaining three. She is certain she is applying only valid input voltages, and expects to find a valid output at terminal C. Anna also keeps noticing a very faint *smell of smoke.*

 
1. **What is burning out Anna's test chips?** Give a specific scenario, including input values together with a description of the failure scenario. For what input combinations will this failure occur?
3. Are there input combinations for which Anna can expect a valid output at C? **Explain**.
4. One of Anna's test chips has failed by **burning out the pullup** connected to A as well as the pulldown connected to B. Each of the burned out FETs appears as an open circuit (no connection), but the rest of the circuit remains functional. *Can the resulting circuit be used as a combinational device whose two inputs are A and B?* **Explain** its behavior for each combination of valid inputs.  
5. In order to salvage her remaining two chips, Anna *connects the A and B inputs of each and tries to use it as a single-input gate.* Can the result be used as a single-input combinational device? **Explain**.


<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
<ol type="1">
<li> When: `A=0, B=1` or `A=1, B=0`, it means that there's a <strong>connection</strong> between VDD and GND. This caused the gate to short circuit, and hence its burning out.</li><br>
<li> <strong>Yes</strong>, when: `A=1, B=1`, then `C==0`. When `A=0, B=0`, then `C==1`. This happens when the pullup and pulldown circuit are not both `ON` (active) at the same time.</li><br>
<li> <strong>No</strong>. When `A=1, B=0`, then the circuit will burn out again since the pullup and pulldown will be `ON` (active), thus causing a short circuit and burning out the circuit. Also, the output is **not** defined when: `A=0, B=1`. This is because **neither** the pullup or pulldown are active.</li><br>
<li><strong>Yes</strong>. It exhibits the behavior of an <strong>inverter</strong>, i.e: A and B are connected to the same `Vin`.</li>
</ol>
</p>
</div><br>



## Another Boolean Minimisation (Basic)

  

A certain function F has the following truth table:

$$\begin{matrix}
A & B & C & F \\
\hline
0 & 0 & 0 & 1\\
0 & 0 & 1 & 0\\
0 & 1 & 0 & 0\\
0 & 1 & 1 & 1\\
1 & 0 & 0 & 1\\
1 & 0 & 1 & 1\\
1 & 1 & 0 & 0\\
1 & 1 & 1 & 1\\
\hline
\end{matrix}
$$


Answer the following questions based on the truth table:

1. Write a sum-of-products expression for F.

2. Write a minimal sum-of-products expression for F. Show a combinational circuit that implements F using INV and OR, and AND gates. Then implement it using only NAND gates.
3. Implement F using one 4-input MUX and inverter.
4. Write a minimal sum-of-products expression for NOT(F).




<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
<ol type="1">
<li>Sum-of-products expressionf or F is: $$\overline{A}\text{ }\overline{B}\text{ }\overline{C} + \overline{A}BC + A \overline{B}\text{ }\overline{C} + A \overline{B}C + ABC$$</li><br>
<li>  The minimal sum of products is: $$\overline{B}A + \overline{B} \text{ } \overline{C} + BC$$ You can draw a combinational circuit of this by adding an input to a  big OR gate for every '+', INV (where necessary for negated input) with AND gate for every *pair* of input in the minimal sum of products:<br>
<img src="https://dropbox.com/s/39en3zjm86f3h6l/sumofpdt.png?raw=1"  class="center_thirty" >
<br>To turn AND and ORs into just NANDs, we can do this in two steps. First, turn the AND into NAND and add an inverter:<br>
<img src="https://dropbox.com/s/o52diqfidgb7dul/sumofpdt1.png?raw=1"  class="center_thirty" >
<br>
Then apply DeMorgan law:<br>
<img src="https://dropbox.com/s/yzjpvf2xbn3car5/sumofpdt2.png?raw=1" class="center_thirty"  >
</li><br>
<li> If we use A and B as the <strong>select</strong> inputs for the MUX, then the four data inputs of the MUX should be tied to one of `0` (ground), `1` (VDD), `C` or `NOT C`. The following is one of the correct schematics that implement this function (there are other acceptable answers as well). Note that by changing the connections on the data inputs to the mux, we could implement any function of A, B and C.
<br><img src="https://dropbox.com/s/0yykalujmctihu4/mux_stuff.png?raw=1"  class="center_thirty" >
</li><br>
<li>We can just write *sum of product* for rows that results the `0`s in the table above, and then reduce the expression into: $$\overline{F} = B \overline{C} + \overline{A} \text{ } \overline{B} C$$</li></ol></p></div><br>




## Reading Karnaugh's Map

Given the following Karnaugh's Map, write its **simplified boolean equation**.
<br>

$$\begin{matrix}
 & \bar{A} \bar{B} &\bar{A} B & AB & A\bar{B}  \\
\hline
\bar{C}\bar{D} & 1 & 0 & 0 & 1 \\
C\bar{D} & 1 & 0 & 0 & 1\\
CD  & 0 & 0& 1 & 1\\
\bar{C}D & 1 & 0 & 1 & 1\\
\end{matrix}$$



<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
The minimised boolean expression is: $$AD + \bar{B}\bar{C} + \bar{B} \bar{D}$$
They're obtained from these **three** boxes: 
<ul>
<li> on the lower right corner (row 3 and 4, with column 3 and 4), </li>
<li> on the sides (row 1 and 2, with column 1 and 4), and </li>
<li>on the four corners (row 1 col 1, and row 1 col 4, and row 4 col 1, and row 4 col 4).</li>
</ul></p></div><br>

## The FPGA (Challenging)

  

The Xilinx 4000 series field-programmable gate array (FPGA) can be programmed to emulate a circuit made up of many thousands of gates; for example, the *XC4025E* can emulate circuits with up to **25,000 gates**. 

The heart of the FPGA architecture is a *configurable logic block (CLB)* which has a **combinational logic subsection** with the following circuit diagram:


<img src="https://dropbox.com/s/kyx7a79owajbxde/Q5.png?raw=1" class="center_seventy"  >


There are **two 4-input function generators** and **one 3-input function generator**, each capable of implementing an **arbitrary** Boolean function of its inputs.

{: .note}
The function generators are actually **small** 16-by-1 and 8-by-1 memories that are used as lookup tables. When the Xilinx device is <span style="color:red; font-weight: bold;">programmed</span> these memories are <span style="color:red; font-weight: bold;">filled</span> with the appropriate values so that each generator produces the desired outputs.

The multiplexer select signals (labeled `Mx` in the diagram) are also set by the programming process to configure the CLB. After programming, these Mx signals remain constant during CLB operation.

The following is a list of the possible configurations proposed:
(a). An arbitrary function F of **up to four unrelated input variables**, plus another arbitrary function G of **up to four unrelated input variables,** plus a third arbitrary function H of **up to three unrelated input variables.**
(b). An arbitrary single function of **five variables.**
(c).  An arbitrary function of **four variables** together *with some functions of six variables.* Characterize the functions of six variables that can be implemented.  
(d). Some functions of up to **nine variables.** Characterize the functions of up to nine variables that can be implemented.
(e). Can **every** function of **six** inputs be implemented? If so, explain how. If not, give a 6-input function and explain why it can't be implemented in the CLB.


For **each** configuration <span style="color:red; font-weight: bold;">indicate how</span>:
- Each the **control signals** (`MA`, `MB`, `MC`, `MD`, and `ME`) should be programmed? 
- Which of the **input lines** (`C1-C4`, `F1-F4`, and `G1-G4`) are used?
- And what **output lines** (`X`, `Y`, or `Z`) the result(s) appear on?




<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
<ol type="a">
<li> Let `X = F(F1, F2, F3, F4)` be the function of four variables with the four inputs connected to node `F1-F4`, `Z = G(G1, G2, G3, G4)` be another function of four variables with the four inputs connected to node `G1-G4`, and `Y = H(C1, C2, C3)` be the function with three unrelated input variables with the three inputs connected to node `C1-C3` in the diagram above. The necessary control signals are:
<ul>
<li> `MA` = 1 </li>
<li> `MB` = 1 </li>
<li> `MC` = 0 (select `C1`) </li>
<li> `MD` = 1 (select `C2`) </li>
<li>  `ME` = 2 (select `C3`) </li>
</ul></li><br>
<li> Let `Y = F(A1, A2, A3, A4, A5)`, where `A1` to `A5` are the five input variables which we can **map** to the input nodes in the diagram above. Let input `A1-A4` be connected to node `F1-F4` and `G1-G4` (they're connected to the same 4 inputs) and A5 be connected to node `C1`. This can be implemented using both 4-input logic functions, and selecting between the two outputs with the 3-input logic function.
<ul>
<li>  `Z = f(A1, A2, A3, A4, 0)`, </li>
<li> `X = f(A1, A2, A3, A4, 1)`, </li>
<li>  `Y = Z` if `A5=0`, else `Y = X` </li>
</ul>
So `Z` calculates `F` for the case when `A5 = 0`, `X` calculates `F` for the case when `A5 = 1`, and `Y` is **selecting** between `X` and `Z` with a multiplexer function. 
<br><br>
The necessary control signals are:
<ul>
<li>`MA` = 0 </li>
<li>`MB` = 0 </li>
<li>`MC` = X (value doesn't matter) </li>
<li>`MD` = X (value doesn't matter) </li>
<li> `ME` = 0 (select C1) </li>
</ul></li><br>
<li> Let `Z = G(G1, G2, G3, G4)` be the function of the 4 variables, so the four inputs are connected directly to node `G1-G4`. Then, let `X = F(F1, F2, F3, F4)` and  let `Y = H(C1, C2, X) = H(C1, C2, F(F1, F2, F3, F4))`. The functions of <span style="color:red; font-weight: bold;">six</span> variables which can be implemented (along with the 4-variable function) are all those functions that can be **re-written** as the function H with 3 variables. The inputs to this function of three variables must be 2 of the original variables (plugged at nodes `C1`, `C2`) and some function of the remaining four variables (plugged at nodes `G1-G4`). The necessary control signals are:
<ul>
<li> `MA` = 0 </li>
<li> `MB` = 1 </li>
<li> `MC` = X (value doesn't matter) </li>
<li> `MD` = 0 (select C1) </li>
<li> `ME` = 1 (select C2) </li>
</ul></li><br>
<li> Let: `X = F(F1, F2, F3, F4)`, `Z = G(G1, G2, G3, G4)`, `Y = H(C1, X, Z) = H(C1, F(F1, F2, F3, F4), G(G1, G2, G3, G4))`. The 9 inputs are connected to node `F1-F4`, `G1-G4`, and `C1`. The functions of <span style="color:red; font-weight: bold;">nine</span> variables that can be implemented are all those functions that can be re-written as the function `H` consisted of these 3 variables: `C1`, `F`, and `G`. The inputs to this three-variable function will be **one** of the original variables, plus **two** separate functions of 4 variables `F1-F4`, `G1-G4` (these two 4-variable functions will have the remaining 8 original variables as inputs).
<ul>
<li> `MA` = 0 </li>
<li> `MB` = 0 </li>
<li> `MC` = X (value doesn't matter) </li>
<li> `MD` = X (value doesn't matter) </li>
<li> `ME` = 0 (select C1) </li>
</ul></li><br>
<li> The functions of 6 variables which we can implement must be of the form: `Y = C(C1, C2, F(F1,F2,F3,F4))` or the form of `Y = C(C1,F(F1, F2, F3, F4), G(G1, G2, G3, G4))`. <i>This second function will have some **overlap** between `C1`, `F1-4`, and `G1-4`; that is some variables will be connected to **multiple** inputs.</i>
<br><br>
Essentially, the functions we are able to implement are only those for which we can <span style="color:red; font-weight: bold;">factor</span> a set of 4 variables out of the equation. For example, the following function cannot be implemented by the CLB: `Y = A1A2A3A4A5 + A1A2A3A4A6 + A1A2A3A5A6 + A1A2A4A5A6 + A1A3A4A5A6 + A2A3A4A5A6`. This function <span style="color:red; font-weight: bold;">cannot</span> be broken down into either of the forms mentioned above.
</li></ol></p></div><br>



