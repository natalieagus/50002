
## CMOS Logic Gate Design

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

**Steps:**
* Open `lab2_cmos_submit.jsim` and write your answer there:
* There should be three parts to your answer
  * The pullup circuitry
  * The pulldown circuitry
  * The inverter at the drain of not F CMOS circuitry to produce back F 
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
