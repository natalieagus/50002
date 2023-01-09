---
layout: default
permalink: /lab/mhp
title: 1D Part 1 - MHP
description: MHP Handout as part of 1D project
parent: Labs
nav_order:  1
---

* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design
<br>
Modified by: Kenny Choo, Natalie Agus, Oka Kurniawan (2021)

# 1D Part 1 - Mini Hardware Project 

This project is **part 1** of your 1D project (with **part 2** being your Electronic Game Hardware Project, details in the course handout). This part 1 weighs 4% of your total assesment, while part 2 weighs 25%. The goal of this project is to familiarise yourself with:
1. The behavior of a few logic gates, 
2. Basic wiring and using the breadboard
3. Soldering various hardware components: switches, LEDs, resistors, logic gates

By the end of this project you should be able to:
* **Measure** static input-output relationship of the logic gates.
* **Design** a simple 1 bit digital adder.
* **Examine** the **functionality** of a simple digital adder.
* **Implement** a simple digital adder on a strip-board with a user interface.

## Deliverables
You have 3 tasks to do to score all 4%:
1. **(0.5%)** Answer related questions about this handout on eDimension (Task 1-7, Task 9-12)
2. **(0.5%)** Assemble 1-bit HALF adder on a breadboard and checkoff in class with a TA or Instructor (Task 8)
3. **(3%)** Make a **1-bit FULL adder** using basic logic gates provided in your 1D kit, and **solder** the circuit on a stripboard. See our course handout for further submission details on sample submission photo. 

## Basics of Breadboard
The **breadboard** can be use to **prototype** your circuit design fast without the need to solder anything. Take out a breadboard, battery pack, LED, resistor, a few jumper wires, and assemble the following simple circuit. 

<img src="{{ site.baseurl }}/assets/images/mhp/MHP-1_led.png"  class="center_seventy"/>

The two **horizontal** rows at the top and the bottom of the breadboard (when viewing the breadboard this way) are connected **horizontally** and are usually used for **power** and **ground** lines. Each vertical column (labeled 1 to 63 above) are connected **vertically**. 

The battery's positive terminal (cathode or VDD) and negative terminal (anode or GND) terminals are connected to each of the first two rows in the breadboard. These can be considered as the "power lines". 

The LED is connected at column 48 and 49 as shown above:
* The **longer** leg (called anode or "positive" side) is connected at column 49 
  * Yes, this is <span style="color:red; font-weight: bold;">not a typo</span>
* The **shorter** leg (called cathode, or "negative" side) is connected at column 48 
* Electrons will travel from anode (positive side) to cathode (negative side) and **never** the other way around 

{: .note}
> The thing to remember is that **conventional current** <span style="color:red; font-weight: bold;">always</span> flows from cathode to anode in the **external** circuit (not internally through the object of interest!). Since the direction of electrons is opposite of current, the electrons in the <span style="color:red; font-weight: bold;">external</span> circuit move **towards** the (+) terminal of the battery cell, which makes it a cathode. By extension, the battery's (-) terminal is the anode. 
>
> For the LED bulb, there exist a diode in it so that **current** flows <span style="color:red; font-weight: bold;">through</span> it from the anode (longer leg) to the cathode (shorter leg) and never the opposite direction. Remember that anywhere in the circuit (external to the battery and the LED bulb) **current** always flows from cathode to anode. 
> 
> See the diagram below to let it *sink* in. Ask yourself, which way the **current** flows? Clockwise or anticlockwise? Then, which way the **electron** flows?

<img src="{{ site.baseurl }}/assets/images/mhp/mhp-circuit.png"  class="center_fifty"/>

Also, the name "cathode" or "anode" on the battery's terminal depends on whether the battery is charging or discharging. One fact remains the same: conventional current always flows from cathode to anode. We can rename the terminals based on the direction of current flow.

<img src="{{ site.baseurl }}/assets/images/mhp/mhp-charge-discharge.png"  class="center_seventy"/>

The LED is connected in **series** with the resistor (it's beyond this class to compute how many Ohm is needed, but you can easily google it). A resistor is needed to not blow up the LED. An AA battery supplies 1.5V each. If you use a 4-battery pack, it will supply 6V, if you use a 2-battery pack, it will supply 3V. A typical LED requires only approximately 2V and 20mA (depends on the color and size). 

{: .note}
Take a look at basic documentation of a [5mm red LED](https://www.sparkfun.com/products/9590)  vs [5mm blue LED](https://www.sparkfun.com/products/11372) vs [10 mm super bright red LED](https://www.sparkfun.com/products/8862). They are all different.

That means given a 4-battery pack power supply ($V_{dd}$ = 6V) and a single 2V, 20mA small LED, we need a resistor with value of:

$$
R = \frac{V_{dd}-V_{led}}{I_{led}} = \frac{6-2}{0.02} = 200 \Omega
$$

### Task 1

{: .new-title}
> Light up the LED
> 
> Ensure that you can assemble the circuit above and get your LED lit up before proceeding. 

**Why does the LEDs light up?**

Let's do some quick recap. The battery's (+) terminal is connected to the LED's longer leg (after passing the resistor) and the battery's (-) terminal is connected to the LED's shorter leg, thereby closing the circuit. The LED lights up because there exists a potential difference between the battery's (+) terminal and the battery's (-) terminal, and there exist current flowing within the closed circuit which dissipates power (to light up the LED). 

Head to eDimension and answer a few questions pertaining to this task. 

## Logic Gates

We have provided a few **logic gates** in the box as shown. Click on the corresponding datasheet to know what each pin is for. 

Component | Description | Datasheet
---------|----------|---------
 74HC00 | Quad 2-input NAND gate | [74HC00.pdf](https://www.diodes.com/assets/Datasheets/74HC00.pdf)
 74HC02 | Quad 2-input NOR gate | [74HC02.pdf](https://assets.nexperia.com/documents/data-sheet/74HC_HCT02.pdf)
 74HC04 / 74H04 | Hex inverting buffer gate | [74HC04.pdf](https://www.diodes.com/assets/Datasheets/74HC04.pdf)
74HC08 | Quad 2-input AND gate | [74HC08.pdf](https://www.diodes.com/assets/Datasheets/74HC08.pdf)
74HC32 | Quad 2-input OR gate | [74HC32.pdf](https://www.diodes.com/assets/Datasheets/74HC32.pdf)
74HC86 | Quad 2-input exclusive OR gate | [74HC86.pdf](https://www.diodes.com/assets/Datasheets/74HC86.pdf)

Let's figure out the **functionality** of each of these logic gate by assembling them on the breadboard. 
* *How* exactly these gates work and *what* electronic components make up these logic gates is a complex issue 
* We will give an overview at the end of this handout, and in the following lectures. Please bear with us for now
* Let's begin by examining its **functionality** first before later studying how it works

### 74HC00
Let's take into example this Quad NAND gate (74HC00). Assemble it on your breadboard as follows:

<img src="{{ site.baseurl }}/assets/images/mhp/MHP-1_NAND.png"  class="center_seventy"/>

If you open its [datasheet](https://www.diodes.com/assets/Datasheets/74HC00.pdf), you'll notice that it has 14 pins labeled as 1 to 14. The figure on the right shows the <span style="color:red; font-weight: bold;">functionality</span> of each of this pin. It shows that there are four **independent** NAND gates inside 74HC00 (it's like buy 1 get 3 free). 

<img src="{{ site.baseurl }}/assets/images/mhp/2022-12-21-17-02-09.png"  class="center_fifty"/>

To power on the logic gate, **pin 7** is to be connected to GND (negative terminal of your battery) and **pin 14** is to be connected to VCC (also known as VDD, which is the positive terminal of your battery). Then we can supply **inputs** at pin 1 (1A) and pin 2 (1B), and read the **output** at pin 3 (1Y). 
* If we supply inputs at pin 12 (4A) and 13 (4B), we can read the output at pin 11 (4Y)
* The same logic goes to the rest of the pins 

{: .warning}
<span style="color:red; font-weight: bold;">Remember</span> that (1A, 1B, 1Y), (2A, 2B, 2Y), (3A, 3B, 3Y), (4A, 4B, 4Y) are all **independent** of each other. They are 4 separate logic gates. It's just that they're all soldered together into a little chip for economic reason (it's more expensive to buy 4 separate ones).

#### Supply Input
The **inputs** in the above breadboard schematic is represented by the <span style="color:green; font-weight: bold;">green</span> wires (there are two input lines), connected to pin 1 (1A) and 2 (1B) of the 74HC00 respectively.  

We connect one of the green wires to positive terminal of the battery, and the other green wire to the negative terminal of the batteries. This represents a digital input of `1` at pin 1 (1A) and a digital input of `0` at pin 2 (2A), 

#### Read Output
The **output** is represented by the <span style="color:orange; font-weight: bold;">yellow</span> wire in the breadboard schematic. We use an LED to **read** the output signal. If the LED is on, then the output corresponds to digital value `1` (basically high voltage), and if the LED is off, then the output corresponds to digital value `0` (basically low voltage).

### Terminologies


#### Digital value `1`

<span style="color:red; font-weight: bold;">For the purpose of this lab</span>, when the LED is ON, it means that pin 3 (1Y) supplies a **high voltage** (which results in current flowing through the LED and power dissipated to light up the bulb). Let's name this **HIGH VOLTAGE** condition as **digital value `1`**. In other words, we say that pin 3 (1Y) supplies digital value `1` to the LED if the LED is lit up. 

The LED itself is just a "tool" that we use to read the voltage value of pin 3 (1Y). If the voltage is HIGH enough, our LED is ON. Otherwise, our LED is OFF. We <span style="color:red; font-weight: bold;">dont really care</span> about the actual voltage value of pin 3 (1Y), only that it is a **HIGH VOLTAGE**: <span style="color:red; font-weight: bold;">higher than the lowest voltage in the circuit</span>, which is the battery's (-) terminal.

#### Digital value `0`
Similarly, <span style="color:red; font-weight: bold;">for the purpose of this lab</span>, when the LED is OFF (at least to the naked eye), it means that pin 3 (1Y) supplies a **low voltage**. It does not necessarily mean that it is 0V, but **low enough** in comparison to the highest voltage point in the entire circuit which is the battery's (+) terminal.  In other words, we say that pin 3 (1Y) supplies digital value `0` to the LED if the led is **not** lit up.

Again, we <span style="color:red; font-weight: bold;">don't really care</span> about the actual low voltage of pin 3 (1Y). 

{: .highlight}
The notion of a "**LOW ENOUGH**" and "**HIGH ENOUGH**" voltage which corresnponds to digital value `0` and `1` respectively (without caring about its actual numerical value)  is called **digital abstraction**. You will learn it in future lectures. 

#### VDD and GND
If you haven't realised already, the terms **HIGH** and **LOW** voltages are <span style="color:red; font-weight: bold;">relative</span> and not absolute. The same logic applies to VDD and GND. 

The notion of VDD and GND (sometimes illustrated as Vss) terminal does not imply anything about its actual numerical voltage value. VDD simply means the positive supply voltage which is the **highest** voltage point value in your entire circuit. Simply, GND (stands for ground) simply means the **lowest** voltage value in your entire circuit and <span style="color:red; font-weight: bold;">it does not always mean 0V</span>. Current flows from VDD to GND in the circuit because it always flows from high voltage point to low voltage point. 

That's why it is important for your circuit to have a <span style="color:red; font-weight: bold;">common ground</span> so that they can <span style="color:red; font-weight: bold;">agree</span> on what is the value of the lowest voltage point in the entire circuit. 

{: .note}
Please consult your freshmore faculties who taught you circuits and electronics if you have forgotten about this. 


### Task 2

{: .new-title}
> The logic of 74HC00
> 
> Assemble the circuit as shown in the breadboard schematic above and observe if the LED is ON or OFF with that exact arrangement. Then, try supplying both `0`  at pin 1 and pin 2 by plugging both green wires at the battery's GND line (-). Is the LED ON or OFF? 

Complete the truth table below by varying the inputs at pin 1 and pin 2 of 74HC00. Key in your answer on eDimension.

**74HC00** Pin 1 (1A) | **74HC00** Pin 2 (1B) | LED (ON/OFF) Pin 3 (1Y) **74HC00**
---------|----------|---------
0 | 0 | ?
0 | 1 | ?
1 | 0 | ?
1 | 1 | ?

Let's do a little Quiz to test your understanding.

<div class="quizdown">
---
primaryColor: '#4b008230'
secondaryColor: '#eeeefd'
shuffleQuestions: false
shuffleAnswers: false
---

#### LED OFF
If an LED connected at pin 3 (1Y) is not lit up (OFF), which statement(s) is/are true about pin 3 (1Y)? Select **all** that applies. 

- [x] pin 3 (1Y) supplies digital value `0` as per this lab's specs
- [ ] pin 3 (1Y) supplies digital value `1` as per this lab's specs
- [x] pin 3 (1Y) supplies LOW voltage value (low enough in comparison to VDD)
- [ ] pin 3 (1Y) supplies HIGH voltage value (high enough in comparison to GND)

#### LED ON
If an LED connected at pin 3 (1Y) is **lit up** (ON), which statement(s) is/are true about pin 3 (1Y)? Select **all** that applies. 

- [ ] pin 3 (1Y) supplies digital value `0` as per this lab's specs
- [x] pin 3 (1Y) supplies digital value `1` as per this lab's specs
- [ ] pin 3 (1Y) supplies LOW voltage value (low enough in comparison to VDD)
- [x] pin 3 (1Y) supplies HIGH voltage value (high enough in comparison to GND)

#### VDD and GND
Select **all** statements that are **TRUE**. 
> The terms **HIGH** and **LOW** voltages are <span style="color:red; font-weight: bold;">relative</span> and not absolute.

- [x] VDD has higher voltage than GND
- [ ] VDD has lower voltage than GND
- [ ] VDD must be 6V 
- [ ] GND must be 0V
- [x] VDD can be 3V and GND can be 0V
- [ ] VDD can be 0V and GND can be 3V 
- [x] VDD can be 6V and GND can be 1V 

</div>

### Task 3 

{: .new-title}
> The logic of 74HC02, 74HC08, 74HC32, and 74HC86
>
> Replace 74HC00 with one of these logic gates and repeat the procedure of observing the LED output by varying inputs to pin 1 and pin 2. 


Complete the truth table below by varying the inputs at pin 1 and pin 2 of each logic gate. Key in your answer on eDimension.

Pin 1 (1A) | Pin 2 (1B) | LED (ON/OFF) Pin 3 (1Y) **74HC02** | LED (ON/OFF) Pin 3 (1Y) **74HC08** | LED (ON/OFF) Pin 3 (1Y) **74HC32** | LED (ON/OFF) Pin 3 (1Y) **74HC86**
---------|----------|---------
0 | 0 | ? | ? | ? | ?  
0 | 1 | ? | ? | ? | ? 
1 | 0 | ? | ? | ? | ? 
1 | 1 | ? | ? | ? | ? 

### Task 4 

{: .new-title}
> The logic of Inverter 74HC04
>
> Study the [datasheet](https://www.diodes.com/assets/Datasheets/74HC04.pdf) of 74HC04. By now, you should be able to **assemble** it on your breadboard, supply an input using the wires and read the output using an LED.

Head to eDimension to answer some questions about Task 3 and 4. You might want to do the quiz below first. 

<div class="quizdown">
---
primaryColor: '#4b008230'
secondaryColor: '#eeeefd'
shuffleQuestions: false
shuffleAnswers: false
---

#### How many inverters?
We know that there are 4 NAND logic gates inside 74HC00. How many inverters are there in a single 74HC04 chip? 

> The answer can be found in the first sentence of the [datasheet](https://www.diodes.com/assets/Datasheets/74HC04.pdf). 

1. [ ] 4
2. [ ] 5
3. [x] 6
  > Correct, good job reading the datasheet. 
4. [ ] 7

#### How many inputs (INV)?
We know that we can supply 2 independent inputs to each NAND logic gates inside 74HC00. How many independent input(s) can we supply to a single inverter inside 74HC04? 

> The answer can be found in the boolean expression under "Description" section of its [datasheet](https://www.diodes.com/assets/Datasheets/74HC04.pdf). 

1. [x] 1
  > Correct, inverters only invert a single input.
2. [ ] 2
3. [ ] 3
4. [ ] 4


#### How many NOR gates?
How many NOR gates are there in a single 74HC02 chip? 

> The answer can be found in the first sentence of the [datasheet](https://assets.nexperia.com/documents/data-sheet/74HC_HCT02.pdf). 

1. [x] 4
  > Correct, good job reading the datasheet.
1. [ ] 5
2. [ ] 6
3. [ ] 7

#### How many inputs (NOR)?
We know that we can supply 2 independent inputs to each NAND logic gates inside 74HC00. How many independent input(s) can we supply to a single NOR gate inside 74HC04? 

> The answer can be found in the boolean expression under "General description" section of its [datasheet](https://assets.nexperia.com/documents/data-sheet/74HC_HCT02.pdf). 

1. [ ] 1
2. [x] 2
  > Correct. We also have 3-input, 4-input, ... N-input NOR/NAND/XOR etc gates too. 
3. [ ] 3
4. [ ] 4

</div>

### More than 2-inputs
We can create a **3-input** NAND/NOR/XOR gates by utilising two gates within each chip. For instance, we can **create** a 3-input XOR gate using 74HC86 by assembling our components as follows:

<img src="{{ site.baseurl }}/assets/images/mhp/MHP-xor3_bb.png"  class="center_seventy"/>

Notice that the **output** of the first XOR gate at pin 3 (1Y) is set as the **input** of the second XOR gate at pin 4 (2A). A third independent input (green wire) is supplied at pin 5 (2B). Finally, the output is read at the LED via pin 6 (2Y).


Complete the 3-input XOR truth table below by varying the inputs at pin 1, pin 2, and pin 5 of 74HC86. Key in your answer on eDimension.

**74HC86** Pin 1 (1A) | **74HC86** Pin 2 (1B) |  **74HC86** Pin 5 (2B) | LED (ON/OFF) Pin 6 (2Y) **74HC00**
---------|----------|---------
0 | 0 | 0 | ?
0 | 1 | 0 | ?
1 | 0 | 0 | ?
1 | 1 | 0 | ?
0 | 0 | 1 | ?
0 | 1 | 1 | ?
1 | 0 | 1 | ?
1 | 1 | 1 | ?


### Symbols

Each logic gate above has a **symbol** that is often used to easily illustrate their arrangement in a circuit. Please **remember** the symbols for each of these basic logic gates. You will need it to survive this subject. 

<img src="{{ site.baseurl }}/assets/images/mhp/gates.png"  class="center_seventy"/>

## 1-bit Half Adder

We can use these basic logic gates: NOR, NAND, XOR, and INV to form a more complex logic such as **addition**. We can perform addition easily in base 10 (decimal). Suppose we have single digit addition, then our output **may** overflow: 
* 5+5 = 10 (with carry out or overflow, where the output digit is more than each of the input digit)
* 9+5 = 14 (also has carry out or overflow)
* 1+1 = 2 (no overflow, carry out value is 0)
* 2+5 = 7 (no overflow, carry out value is 0)

{: .note-title}
> Why care about overflow?
> 
> You don't usually care about overflow when you're just using your computers to compute these measly numbers. But, imagine you're making or buying a hardware (like neon sign) to hold **each** of these numbers to display in front of a shop. You will first consider **how many digits at maximum** each number can hold so you can buy the correct neon sign.

Now, we need to perform addition using base 2 (instead of base 10). In base 2, you have only two values **per digit**: `0` and `1` while in base 10 you have 10 different values: `0` to `9`. 

{: .important}
A single digit in base 2 is called a <span style="color:red; font-weight: bold;">bit</span>. *No, no pun intended*.


<div class="quizdown">
---
primaryColor: '#4b008230'
secondaryColor: '#eeeefd'
shuffleQuestions: false
shuffleAnswers: false
---

#### Largest value 
In base 10, the largest number we can represent in a single digit is 9. In base 2, the largest number we can represent in a single bit is:

1. [ ] 0
1. [x] 1
1. [ ] 2
1. [ ] 3

#### 1-bit Addition 
If we perform addition of two values (1 digit max) in base 10, our possible output value ranges from 0 (from 0+0) to 18 (9+9). If we perform addition of two values (1 bit each) in base 2, our possible output value ranges from:

1. [ ] 0 to 1
1. [x] 0 to 2
  > Correct. 0 comes from 0+0, and 2 comes from 1+1. 
2. [ ] 0 to 3
3. [ ] 0 to 4

#### Representing `2` in base 2
How do we represent the value `2` in base 2? 

1. [ ] 00
1. [ ] 01
  > False. This means 2^0 + 1=1. Prepending zeroes don't affect the numerical value.  
2. [x] 10
  > Correct. This means 2^1 + 0=2. 
1. [ ] 11
  > False. This means 2^1 + 1=3. 
</div>

### Task 5

{: .new-title}
> Half adder logic
> 
> Perform a literature search about logic gate adder, which is the most fundamental logic in your CPU. Then fill up the truth table below that represents the **logic** of a 1-bit adder. In Lab 2, we will learn how to assemble the circuitry of n-bit adder. 

Head to eDimension to answer questions pertaining to this task. 

A (Input 1) | B (Input 2) | Co (Carry out) | S (Sum)
---------|----------|---------
0 | 0 | ? | ?
0 | 1 | ? | ?
1 | 0 | ? | ?
1 | 1 | ? | ?


<div class="quizdown">
---
primaryColor: '#4b008230'
secondaryColor: '#eeeefd'
shuffleQuestions: false
shuffleAnswers: false
---

#### Sum logic
Which logic corresponds to the sum?
> Go and observe the truth tables you made in Task 3. Which logic corresponds to 1-bit half adder **Sum** logic?

1. [ ] NAND
  > Incorrect. If this were true, 0+0 becomes 1 and 1+1 becomes 0. Time to revise primary school math. 
2. [ ] NOR
  > Incorrect. If this were true, 0+0 becomes 1 and 0+1, 1+0, and 1+1 all become 0. Time to revise primary school math. 
3. [ ] XNOR
  > Incorrect. If this were true, 0+1 becomes 0 and 1+0 becomes 0. Time to revise primary school math. 
4. [ ] AND
  > Incorrect. If this were true, 0+1 becomes 0 and 1+0 becomes 0. Time to revise primary school math. 
5. [ ] OR
  > Incorrect. If this were true, 1+1 becomes 1 instead of 2. Time to revise primary school math.  
6. [x] XOR
  > Correct. Good job!

#### Carry out (Co) logic
Which logic corresponds to the carry out? 
> Go and observe the truth tables you made in Task 3. Which logic corresponds to 1-bit half adder **Co** logic?

1. [ ] NAND
  > Incorrect. If this were true, 0+1 and 1+0 will both results in carry out of 1. Time to revise primary school math. 
1. [ ] NOR
  > Incorrect. If this were true, 1+1 will have no carry out, but you know you need at least 2 bits to represent the number `2` in base 2. 
1. [ ] XNOR
  > Incorrect. If this were true, 0+0 will have a carry out of 1. Time to revise primary school math. 
1. [x] AND
  > Correct. Only 1+1 results in carry out (overflow) because the number `2` cannot be represented with just 1 bit in base 2.  
1. [ ] OR
  > Incorrect. If this were true, 0+1 and 1+0 will both results in carry out of 1. Time to revise primary school math. 
1. [ ] XOR
  > Incorrect. If this were true, 0+1 and 1+0 will both results in carry out of 1. Time to revise primary school math.
</div>


### Task 6

{: .new-title}
> Assemble Carry Out
> 
> **Draw** the schematic of the gate level half-adder using the gate symbols shown to you in the previous section. This helps you visualise the schematic of the half adder unit. Then, assemble the carry out unit on a breadboard.


Follow the schematic below. Make sure you **use the right logic gate** to compute the Carry Out bit:

<img src="{{ site.baseurl }}/assets/images/mhp/MHP-half-adder-carry.png"  class="center_seventy"/>

{: .note}
Notice the presence of two resistors below the switch. These are called the <span style="color:red; font-weight: bold;">pulldown resistors</span>. We will explain its purpose later. For now, just follow the diagram closely. 

Do not forget to **test** your carry out by using the dipswitch and observing if the LED is **lit** up only when both of the switches are **ON**. 



### Task 7

{: .new-title}
> Assemble Sum
> 
> Now, assemble the carry out unit on a breadboard.

Follow the schematic below. Make sure you **use the right logic gate** to compute the Sum bit:

<img src="{{ site.baseurl }}/assets/images/mhp/MHP-half-adder-sum-carry_bb.png"  class="center_seventy"/>
Do not forget to **test** your sum bit by using the dipswitch and observing if the LED is **ON** up only when ONE of the switches are **ON**. 


### Task 8

{: .warning-title}
> Checkoff
>
> Approach your TA in class or instructor to give you a checkoff on your half-adder circuit on the breadboard. They will use the switch to supply various input combination. You will obtain 1 mark if circuit shows the functionality of the half adder, and 0 otherwise. There is no half mark, no extension. This 1 mark corresponds to 0.5% of your grade.

{: .important}
If you have a **valid** LOA in Week 1 during your lab session, you may ask the TA to checkoff in Week 2 by showing them your LOA. If you miss the lab in Week 1 without any LOA, you will obtain a zero. 


## 1-bit Full Adder

When we do normal additions with two independent inputs in base 10, we actually do not only add two things together but *three*, because of the **carry over** from the previous digit. We call this the **carry in**. See this illustration below:  

<img src="{{ site.baseurl }}/assets/images/mhp/mhp-addition.png"  class="center_thirty"/>

Right now, our 1-bit half adder does not handle addition of the two existing inputs with the Carry Out (and hence the name: *half* adder). In a full adder, the addition with the carry out is considered (we cann this carry in). 

### Task 9
Do some research online and fill up the 1-bit Full Adder truth table below. The last line is already filled up for you. Then head to eDimension to answer questions pertaining to this task. 


A (Input 1) | B (Input 2) |  Carry In (Ci) | Carry Out (Co) | Sum (S)
---------|----------|---------
0 | 0 | 0 | ? | ?
0 | 1 | 0 | ? | ?
1 | 0 | 0 | ? | ?
1 | 1 | 0 | ? | ?
0 | 0 | 1 | ? | ?
0 | 1 | 1 | ? | ?
1 | 0 | 1 | ? | ?
1 | 1 | 1 | 1 | 1


{: .note}
The last line of the truth table represents the case whereby input 1 is `1`, input 2 is `1`, and Carry in is `1`. This is equivalent to addition 1+1+1, which should result in numerical value 3. The number 3 in base 2 can be represented with binary value `11`. The left `1` is Co, and the right `1` is S. 

## Pulldown Resistor

As promised, we will explain the purpose of adding resistors below the switch. A short explanation is that the pulldown resistor connects <span style="color:red; font-weight: bold;">unused</span> input pin to ground to keep the given input LOW (equivalent to digital input `0`).

{: .highlight}
Well, won't disconnecting the switch gives input LOW too? <span style="color:red; font-weight: bold;">Not necessarily</span>. An "open" wire (disconnected input) has **undetermined** voltage value. 

### An Open Wire

Let's test it by assembling the following circuit on your breadboard. Use the AND gate (74HC08) for this experiment. 

<img src="{{ site.baseurl }}/assets/images/mhp/MHP-no-pulldown_bb.png"  class="center_seventy"/>

Notice that there exist only one resistor for the LED, and no pulldown resistors at the switch. 

#### Task 10

{: .new-title}
> Test whether no input == 0V 
>
> Turn ON both switches first so that the LED lits up. Remember, the AND logic dictates that the output is `1` when the inputs are BOTH `1`. Now, **GENTLY** turn off one of the dipswitch. Ensure you do <span style="color:red; font-weight: bold;">not</span> touch ANY other part of the circuit while doing this. Just use the tip of a pen to turn off one of the switches. **What do you observe?** Is the LED still lit up? 

You can repeat this experiment 5 more times:
1. Flip on both switches, wait until the LED is on
2. Gently switch off one dipswitch 
3. Observe the LED: is it lit up fully? is it half lit? is it fully off? 

You will find that the LED <span style="color:red; font-weight: bold;">will not</span> consistently switch off at step (2). 

{: .note-title}
> Why voltage still exists in an open circuit? 
> 
> If the dipswitch is OFF, then why some voltage is **present** at the green input wires?  You might be confusing *current* and *voltage* at this point. Just remember one thing: just because a circuit is open (disconnected), it does <span style="color:red; font-weight: bold;">not</span> necessarily mean that there exist 0V. Are you *shocked*? That's why you can't just touch any exposed wire in your house. We think [this quora answer](https://www.quora.com/If-the-current-is-zero-in-an-open-circuit-why-is-voltage-present) is simple enough to get you by. 

If your LED remains ON even after you off one of the dipswitches, try touching the input wires with your finger ⚡️ to close the circuit and observe what happens. Don't worry, it's not harmful. 

Now it's time for some recap and **test** yourself. Refer to the diagram below to answer the question.

<img src="{{ site.baseurl }}/assets/images/mhp/MHP_NAND_OPEN.png"  class="center_seventy"/>

<div class="quizdown">
---
primaryColor: '#4b008230'
secondaryColor: '#eeeefd'
shuffleQuestions: false
shuffleAnswers: false
---

#### NAND output value
Refer to the diagram above. Suppose that initially we connected Pin 12 (4A) to the GND, and the orange LED **was** ON. Now, we remove that connection as shown in the diagram. Will the LED stays ON or be OFF? Select **all** that apply. 

- [x] ON
- [x] OFF

#### The red LED
According to the diagram above, will the red LED be ON or OFF? Select **all** that apply. 

- [x] ON
  > Correct. The input value is corresponds to digital value `1` (high voltage) in pin 1 and digital value`0` (low voltage) in pin 2. This should make pin 3 outputs a digital value `1` (high voltage) which lits up the LED.  
- [ ] OFF
</div>

#### Task 11

Now add a pulldown resistor in the circuit:

<img src="{{ site.baseurl }}/assets/images/mhp/MHP-pulldown_bb.png"  class="center_seventy"/>

Vary the inputs with the switch and observe that it behaves like a consistent AND logic; that the LED is only lit up when both switches are ON. 

## The MOSFET

You will learn more on what exactly these gates are in your lecture sessions. These gates are made of MOSFETs (Metal Oxide Seminconductor Field Effect Transistor), and it basically means that they are **voltage driven** switches. Why do we call these gates a "switch"? Are they the same as dipswitches? *Well, kinda.*

Refer to this arrangement of the AND gate with the dipswitch:

<img src="{{ site.baseurl }}/assets/images/mhp/MHP-pulldown_bb.png"  class="center_seventy"/>

When we switch ON both of the dip switches, There's a direct connection between the battery (+) terminal to pin 1 (1A) and pin 2 (1B). We are essentially supplying **HIGH VOLTAGE** values at pin 1 (1A) and pin 2 (1B). It will then produce **HIGH VOLTAGE** output at 1Y. 


{: .important-title}
> How does the LED bulb light up?
> 
> The **potential difference** between pin 3 (1Y) that's connected to the longer leg of the LED **and** the GND or the battery's (-) terminal that's connected at the shorter leg of the LED results in a small **current draw**, which dissipates **power** and resulted in the LED being lit up. 
 
However, the ability of the gate to produce **HIGH VOLTAGE** output at 1Y was due to the fact that we **power** the gate in the first place by **connecting** the AND gate to the battery's (+) terminal at pin 14 and the battery's (-) terminal at pin 7. 

{: .important}
The reason there exist a HIGH or LOW voltage output at pin 3 (1Y) is <span style="color:red; font-weight: bold;">not</span> because there exist some current flow between the inputs at 1A or 1B that's directed to 1Y. This is a <span style="color:red; font-weight: bold;">misconception</span>!. You can **confirm** this statement by **disconnecting** pin 14 (VCC) and pin 7 (GND) and observe whether the circuit still functions like the AND logic.

As such, we can call these gates a **switch**. 
1. When the gate produces **HIGH VOLTAGE** output at 1Y, there exists a **closed circuit** (connection) between the **battery's (+) terminal** via VCC pin 14 to 1Y 
2. Otherwise, when the gate produces **LOW VOLTAGE** output at 1Y, there exists a **closed circuit** (connection) between the **battery's (-) terminal** via GND pin 7 to 1Y

Therefore, pin 3 (1Y) is connected to **either** pin 14 VCC or pin 7 GND (internally within the AND gate), depending on the voltages supplied at 1A or 1B. That's why these gates are actually a **switch**: it switches the connection between pin 3 (1Y) to VCC or GND pin depending on the input voltage values at 1A and 1B. The same logic goes to the other 3 AND gates inside  74HC08.

## Boolean representation of 1-bit Full Adder

We can express the **logic** behind 1-bit full adder using a **boolean expression**. You will learn more about it soon during lectures. Here's a few boolean conventions to represent each of the gates we have discovered so far:

$$
\begin{align}
A + B \quad &(\text{Input A OR-ed with Input B})\\ 
A \cdot B \quad \text{or } AB \quad &(\text{Input A AND-ed with Input B})\\
A \oplus B  \quad &(\text{Input A XOR-ed with Input B}) \\
\overline{A} \quad &(\text{INVERT Input A}) \\
\overline{A + B} \quad &(\text{Input A NOR-ed with Input B})\\ 
\overline{A \cdot B}  \quad \text{or} \quad  \overline{AB} \quad &(\text{Input A NAND-ed with Input B})\\
\overline{A \oplus B}  \quad &(\text{Input A XNOR-ed with Input B}) \\
\overline{A + B + C} \quad &(\text{3 inputs A, B, and C NOR-ed together})\\ 
\end{align}
$$

### Task 12 

**Write down** the boolean expression of a half adder, and **write down** the boolean expression of a full adder. Then head to eDimension to answer a few questions pertaining to these last few tasks.

## Summary
We have covered **a lot** of grounds during this lab session. Please ensure that you know how to do the following before proceeding to build the **hardware** of the 1-bit full adder:
* **Measure** static input-output relationship of the logic gates.
* **Design** a simple 1 bit digital adder.
* **Examine** the **functionality** of a simple digital adder.
* **Implement** a simple digital adder on a strip-board with a user interface.


Once you're confident with how 1-bit full adder works, please **plan** your schematic accordingly so you don't have to solder too many times. Please watch this [video](https://www.youtube.com/watch?v=i_1yAJnbR9U) to know how to **plan** and **remove stripboard coppers** accordingly to match your circuit design. Then, [watch this video to know how to **solder** properly](https://www.youtube.com/watch?v=Qps9woUGkvI) and [this video to know how to **desolder** properly](https://www.youtube.com/watch?v=u-IBG74bmyA). 
* Do not forget your pull-down resistors 
* Watch out for accidents involving soldering two supposedly **independent** connections together

{: .note}
If you don't have solders at home, you can use the soldering stations in DSL or Fablab, or ask your instructor for spare soldering irons. Please return it at the end of the term. 


**Good luck**. When it involves hardware, **planning**  is always better than debugging.  