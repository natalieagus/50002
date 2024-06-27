---
layout: default
permalink: /lab/lab0
title: Lab 0 - Digital Abstraction
description: Lab 0 handout covering topics from Digital Abstraction,
parent: Labs
nav_order:  0
---

* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design
<br>
Written by: Natalie Agus (2024)

# Lab 0: Digital Abstraction
{: .no_toc}

## Starter Code and Tools 

We will be using MIT's JSim for this lab, a **circuit simulation program** useful to study the theoretical behaviour of various logic gates and digital circuits. 

Clone the starter code from here:

```sh 
git clone https://github.com/natalieagus/jsim-kit.git
```

JSim uses **mathematical** models of circuit elements to make predictions of how a circuit will behave both statically (DC analysis) and dynamically (transient analysis). We will *not* be learning how to use JSim or write JSim netlists. If you're interested in JSim syntax and how it works, head to [appendix](#introduction-to-jsim) section. 

{:.note}
You will need [Java](https://www.oracle.com/sg/java/technologies/downloads/) to run JSim. You should already have it installed for 50.001. 

### Open JSim

Open JSim and you should be faced with the following user interface:
<img src="{{ site.baseurl }}/assets/contentimage/lab1/1.png"  class="center_seventy"/>

Your job now is to simply Open the right `.jsim` netlist file for each Task of this Lab, and then run the simulation by clicking the `Gate-level Simulation` button (Task 1-3), or the `Device-level Simulation` button (Task 4-5).

## Related Class Materials
The lecture notes on [Basics of Information](https://natalieagus.github.io/50002/notes/basicsofinformation) and [Digital Abstraction](https://natalieagus.github.io/50002/notes/digitalabstraction) are closely related to this lab.


**Task 1 - Task 3:** studying the graphical output of AND, OR, and XOR gates. 
<br>Related Notes: **Basics of Information**
  * [Exploring Logic Gates](https://natalieagus.github.io/50002/notes/basicsofinformation#introduction-to-logic-gates)

**Task 3 and Task 4:** finding an optimal VTC 
<br>Related Notes: **Digital Abstraction**
  * [VTC Section](https://natalieagus.github.io/50002/notes/digitalabstraction#voltage-transfer-characteristic-function-vtc)
  * [Voltage Specifications and Noise Margin ](https://natalieagus.github.io/50002/notes/digitalabstraction#voltage-specifications-and-noise-margin)
  * Realise that we can optimise the noise margin by optimising the MOSFET material 
  * Understand why





# Appendix

## Introduction to JSim
JSim uses **mathematical** models of circuit elements to make predictions of how a circuit will behave both statically (DC analysis) and dynamically (transient analysis). The model for each circuit element is parameterised, e.g., the MOSFET model includes parameters for the length and width of the MOSFET, as well as many parameters that characterize the physical aspects of the manufacturing process. For the models we are using, the manufacturing parameters have been derived from measurements taken at the integrated circuit fabrication facility, and so the resulting predictions are quite accurate.

The (increasingly) complete JSim documentation can be found [here](https://drive.google.com/file/d/1Lc04nVEe6ch9-3wOMoKEa_sBVPuEDtkZ/view?usp=sharing). 


### User Interface
Open JSim and observe it's user interface: 
<img src="{{ site.baseurl }}/assets/contentimage/lab1/1.png"  class="center_seventy"/>

Each icon has the following meaning:
<img src="/50002/assets/contentimage/lab1/2.png"  class="center_fifty"/>


### JSim netlist format

This sample code is a setup to characterise an NFET with the following setup:

<img src="{{ site.baseurl }}/assets/contentimage/lab1/4.png"  class="center_fifty"/>

```cpp
* plot Ids vs. Vds for 5 different Vgs values //1
.include "nominal.jsim" //2
Vmeter vds drain 0v     //3
Vds vds 0 0v            //4
Vgs gate 0 0v           //5

* N-channel MOSFET used for our test  //6
M1 drain gate 0 0 NENH W=1.2u L=600n  //7
.dc Vds 0 5 .1 Vgs 0 5 1              //8
.plot I(Vmeter)                       //9
```

The JSim netlist format is quite similar to that used by [SPICE](https://en.wikipedia.org/wiki/SPICE), a well-known circuit simulator. Each line of the netlist is one of the following:

* **Comment line**
  * Indicated by an `*` (asterisk) as the first character. 
  * Comment and blank lines are ignored when JSim processes your netlist
  * C++/Java style comments can also be used
  * `//`, all characters starting with this and to the end of the line are ignored.
  * `/*` and `*/`, any lines or parts of lines enclosed by these are ignored.<br><br>
* **Continuation line**
  * Indicated by a `+` as the first character.
  * Treated as if they had been typed at the end of the previous line (without the `+` of course)
  * No limit to length of an input line, but breaking long lines using `+` makes it easier to edit and understand
  * `+` also continues comment lines<br><br>
* **Control statement**
  * Indicated by `.` (period) as the first character.
  * Provides information about how the circuit is to be simulated<br><br>
* **Circuit element**
  * Indicated by a letter as the first character, that represents the type of circuit element. e.g. `r` for resistor, `c` for capacitor, `m` for MOSFET, `v` for voltage source.
  * Remainder of line specifies which circuit nodes connect to which device terminals and any parameters needed by that type of circuit element. For example, the following line describes a 1000Ω resistor called `R1` that connects to nodes `A` and `B`: `R1 A B 1k`

{: .note-title}
> Note
> 
> The numbers can be entered using engineering suffixes for readability. Common suffixes are:
> * **kilo**: “k” = 1000 
> * **micro**: “u” = 1E-6 
> * **nano**: “n” = 1E-9  
> * **pico**: “p” = 1E-12

With that knowledge in mind, the code snippet above has the following meaning:


Line | Description
---------|----------
1, 6 | A **comment**. Any line that begins with a `*` signifies a comment.
2 | **A control statement** that directs JSim to include a netlist file containing the MOSFET model parameters for the manufacturing process we will be targeting this semester. The pathname shown **MUST be MODIFIED** to point at where your `nominal.jsim` file is located
3-5 | These specify **three** voltage sources; each voltage source specifies the two terminal nodes and the voltage we want between them. **Note that the reference node for the circuit (marked with a GROUND symbol in the schematic) is always called 0**. The `v` following the voltage specification is not a legal scale factor and will be ignored by JSim--it is included **just to remind ourselves** that the last number is the voltage of the voltage source. All three sources are initially set to 0 volts but the voltage for the `Vds` and `Vgs` sources will be changed later when JSim processes the `.dc` control statement. We can ask JSim to plot the current through voltage sources which is how we’ll see what `Ids` is for different values of `Vgs` and `Vds`.  We could just ask for the current of the `Vds` voltage source, but the sign would be <span style="color:red; font-weight: bold;">wrong</span> since JSim uses the convention that positive current flows from the positive to negative terminal of a voltage source.  So we introduce a 0V source with its terminals oriented to produce the current sign we’re looking for.
7 | **This is the MOSFET**. We have described in the following order: **drain**, **gate**, **source** and **substrate** nodes (in this order!). For instance, `MPD1 z a 1 0 NENH sw=8 sl=1` signifies that **drain** is connected to node `z`, **gate** to node `a`, **source** to node `1` (**this is NOT VDD**) **bulk** to node `0` (ground). The next item names the set of model parameters JSim should use when simulating this device; “NENH” for an NFET, and “PENH” for a p-channel MOFET (PFET). The final two entries specify the width and length of the MOSFET.  Note that the dimensions are in microns (1E-6 meters) since we’ve specified the `u` scale factor as a suffix.  Do not forget the `u` or your MOSFETS **will be meters long**!  You can always use scientific notation (e.g., `1.2E-6`) if suffixes are confusing.
8 | **A control statement** requesting a DC **analysis** of the circuit made with different settings for the `Vds` and `Vgs` voltage sources: the voltage of `Vds` is **swept** from 0V to 5V in .1V steps, and the voltage of `Vgs` is swept from 0V to 5V in 1V steps.  Altogether $$51 \times 6$$ separate measurements will be made.
9 | **A control statement** that gets JSim to plot the current through the voltage source named `Vmeter`.  JSim knows how to plot the results from the dual voltage sweep requested on the previous line: it will plot `I(Vmeter)` versus the voltage of source `Vds` for **each** value of voltage of the source `Vgs`. There will be 6 plots in overall, each consisting of **51** connected data points.



### Waveform Window
After you enter the netlist above, you might want to **save** your efforts for later use by using the **save file** button.  To run the simulation, **click** the **device-level simulation**”button on the toolbar. After a pause, a **waveform** window will pop up and we can take some measurements.  


<img src="{{ site.baseurl }}/assets/images/lab1/waveform.gif"  class="center_seventy"/>

Controls:
* As you hover the mouse over the waveform window, a moving cursor will be **displayed** on the **first** waveform above the mouse’s position and a **readout** giving the cursor coordinates will appear in the upper left hand corner of the window.  
* To **measure** the delta (**difference**) between two points, position the mouse so the cursor is on top of the first point. 
  * Now click left and drag the mouse (i.e., move the mouse while holding its left button down) to bring up a second cursor that you can then position **over** the second point.  
* The readout in the **upper left corner** will show the coordinates for both cursors and the delta between the two coordinates.  
* You can return to one cursor by **releasing the left button**.

In the example above, we only have **one** channel. The waveform window shows various **waveforms** in one or more channels (rows) in general.  Initially one channel is displayed for each `.plot` control statement in your netlist.  If more than one waveform is assigned to a channel, the plots are overlaid on top of each using a different drawing color for each waveform.  If you want to add a waveform to a channel simply add the appropriate signal name to the list appearing to the left of the waveform display (the name of each signal should be on a separate line).  

You can also add the name of the signal you would like displayed to the appropriate `.plot` statement in your netlist and rerun the simulation.  If you simply name a node in your circuit, its voltage is plotted. You can also ask for the current through a voltage source by entering `I(Vid)`.

The waveform window has several other buttons on its toolbar:
<img src="{{ site.baseurl }}/assets/contentimage/lab1/3.png"  class="center_fifty"/>

### Zoom, Pan, Center
You can **zoom** and **pan** over the traces in the waveform window using the controls found along the bottom edge of the waveform display. The scrollbar at the bottom of the waveform window can be used to scroll through the waveforms. To recentre the waveform about a particular point, place the cursor at that position and press `c`.


### Defining Circuit Elements Using `.subckt` 
You can create your own custom circuit elements made of various MOSFETs using `.subckt` keyword. The following JSim netlist shows you how to define your own circuit elements using the `.subckt` statement:

```cpp
.include "nominal.jsim"

* 2-input NAND: inputs are A and B, output is Z
.subckt nand2 a b z
MPD1 z a 1 0 NENH sw=8 sl=1
MPD2 1 b 0 0 NENH sw=8 sl=1
MPU1 z a vdd vdd PENH sw=8 sl=1
MPU2 z b vdd vdd PENH sw=8 sl=1
.ends

* INVERTER: input is A, output is Z
.subckt inv a z
MPD1 z a 0 0 NENH sw=16 sl=1
MPU1 z a vdd vdd PENH sw=16 sl=1
.ends
```


The `.subckt` statement introduces a new level of netlist. 
* All lines following the `.subckt` up to the **matching** `.ends` statement will be treated as a self-contained subcircuit. 
* This includes **model definitions**, **nested subcircuit definitions**, **electrical nodes** and **circuit elements**. 
* Remember the **order** of mosfet node declaration: drain gate source substrate(bulk)
  * `MPD1 z a 1 0 NENH sw=8 sl=1` signifies that drain is connected to node `z`, gate to node `a`, source to node `1` (**this is NOT VDD**) bulk to node `0` (ground)
  * Notice how the source node of MPD1 is connected to the drain node of MPD2, which means that both NFETs are connected in series
  * Both PFETs are connected in **parallel** (by CMOS rule)


The only parts of the subcircuit visible to the outside world are its terminal nodes which are listed following the name of the subcircuit in the `.subckt` statement:

```cpp
.subckt name terminals…
* internal circuit elements are listed here
.ends
```

In the example netlist, two subcircuits are defined: 
* `nand2` which has **3 terminals** named `a`, `b` and `z` inside the `nand2` subcircuit 
* `inv` which has 2 terminals named `a` and `z`

### Using Subcircuits

Once the definitions are complete, you can create an **instance** of a subcircuit using the `X` circuit element:

```cpp
Xid nodes… name
```

where:
* `name`: the name of the circuit definition to be used, 
* `id`: a **UNIQUE** name for this instance of the subcircuit 
* `nodes…`: the names of **electrical nodes** that will be hooked up to the **terminals** of the subcircuit instance

There should be the same number of nodes listed in the `X` statement as there were terminals in the `.subckt` statement that defined name.  

For example, here’s a short netlist that instantiates 3 NAND gates (called `g0`, `g1` and `g2`):

```cpp
Xg0 d0 ctl z0 nand2
Xg1 d1 ctl z1 nand2
Xg2 d2 ctl z2 nand2
```

**Explanation**:
* The node `ctl` connects to **all** three `nand2` gates instances; all the other terminals are connected to different nodes.  
* Note that any nodes that are private to the subcircuit definition (i.e. nodes used in the subcircuit that don’t appear on the terminal list) will be **unique** for each instantiation of the subcircuit (**like local variables**):
  * For example, there is a private node named `1` used inside the `nand2` definition.  
  * When JSim processes the three `X` statements above, it will make three independent nodes called `xg0.1`, `xg1.1` and `xg2.1`, one for each of the three instances of `nand2`.  
  * There is <span style="color:red; font-weight: bold;">no</span> sharing of internal elements or nodes between multiple instances of the same subcircuit.
  * The example netlist above uses `vdd` (jsim standard for **power source**) whenever a connection to the power supply is required.


### Shared Nodes

{: .warning}
There are two common shared nodes in jsim: `vdd` and `0`. Please **do not use these to name your custom electrical nodes**. 

It is sometimes convenient to define nodes that are shared by the entire circuit, including subcircuits; for example, power supply nodes.  The ground node `0` is such a node; all references to `0` anywhere in the netlist refer to the same electrical node.  The included netlist file nominal.jsim defines another shared node called `vdd` using the following statements:
```cpp
.global vdd
VDD vdd 0 3.3v
```
The example netlist above allows us to use `vdd` whenever a connection to the power supply is required.

### Symbolic Dimensions
The other new twist introduced in the example netlist is the use of symbolic dimensions for the MOSFETs (`SW=` and `SL=`) **instead** of physical dimensions (`W=` and `L=`).  Symbolic dimensions specify multiples of a parameter called `SCALE`, which is also defined in `nominal.jsim`:

```cpp
.option SCALE=0.6u
```

So with this scale factor, specifying `SW=8` is equivalent to specifying `W=4.8u`.  

Using symbolic dimensions is encouraged since it makes it easier to determine the `W/L` ratio for a MOSFET (the current through a MOSFET is proportional to `W/L`) and it makes it easy to move the design to a new manufacturing process that uses different dimensions for its MOSFETs.  Note that in almost all instances `SL=1` since increasing the channel length of a MOSFET reduces its current carrying capacity, not something we’re usually looking to do.

We’ll need to keep the PN junctions in the source and drain diffusions **reverse biased** to ensure that the MOSFETs stay electrically isolated, so the substrate terminal of NFET (those specifying the NENH model) should always be hooked to ground (node `0`).  Similarly the substrate terminal of PFET (those specifying the “PENH” model) should always be hooked to the power supply (node `vdd`).

### Perform `.dc` analysis
we’ll perform a `dc` analysis to plot the gate’s output voltage as a function of the input voltage using the following additional netlist statements. Paste this under the `nand2` and `inverter` declaration you made above in the new file. 

```cpp
* dc analysis to create VTC
Xtest vin vin vout nand2
Vin vin 0 0v

Vol vol 0 0.3v   
Voh voh 0 3v 	 

.dc Vin 0 3.3 .005
.plot vin vout voh vol
```

Click the device-level simulation button to view the output waveform window. 
