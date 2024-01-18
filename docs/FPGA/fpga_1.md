---
layout: default
permalink: /fpga/fpga_1
title: FPGA Tutorial for Babies
description: Getting Started with FPGA Part 1 - Combinational Logic
parent: FPGA
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
**Natalie Agus (Fall 2020)**

# Getting Started with FPGA: Part 1
{: .no_toc}
This document is written to guide you with hardware programming in <a href="https://cdn.shopify.com/s/files/1/2702/8766/files/Lucid_Reference.pdf" target="_blank">Lucid</a>, a more human friendly version of Verilog -- the popular but relatively *difficult* hardware descriptive language.  Ultimately, we want to compile our code into a binary file to be loaded to our FPGA: the Alchitry Au, so that the FPGA can emulate the behavior of the machine that we describe via the code. 

**Some fun facts about Alchitry Au:**
* It features **Xilinx Artix 7** FPGA, containing 33280 logic cells (the more cells, the better. Our code can "program" these cells, so if our FPGA has more cells it means that we can implement more complex functionalities)
* On-board clock speed: **100 MHz.** 
* **102** IO pins (you'll never run out of any!) 

More information about the board can be found <a href="https://alchitry.com/boards/au" target="_blank">here</a> but for now the above suffices. 

{: .note}
You are recommended to read this guide at the end of week 2, after you have finished **logic synthesis**, otherwise you might feel a little lost. 

**Before you begin, please install some softwares:**
1. Prepare **at least 50GB** of free space. It goes without saying that you can use cloud storage (Dropbox, GDrive, iCloud Drive, AWS Cloud) or get an external drive. 

### Apple Silicon
{: .new-title}
> Apple Silicon Users
> 
> There's no way to run and compile with Vivado on Apple Silicon macs. A possible workaround is to set up a remote x86 instance, e.g: AWS EC2 instance and then install Alchitry Labs + Vivado on it.  It is pretty involved. Estimated time taken: 6 hours
>
> [Please read the guide here](https://natalieagus.notion.site/Vivado-on-EC2-8ad5254e1091458bb62ce1e10ff5e95f?pvs=4). 

### x86 Windows or Linux 
1. Install <a href="https://www.xilinx.com/support/download.html" target="_blank">Xilinx Vivado</a> : scroll down until you see the **Self-extracting Web-Installer**  (Windows or Linux only). 
	* Sign-up for a **free** Xilinx account 
	* Download Vivado ML Edition (2023.2) or Vivado HLx (2020.2). Either are tested and work perfectly. If you don't see these versions, please click the left tab **Vivado Archive** under "Version" in the site. 
	<img src="{{ site.baseurl }}//images/fpga_1/2024-01-18-19-14-57.png"  class="center_seventy"/>
	* When the installer has been downloaded, open it and install **Vivado ML Standard** (if you choose Vivado ML Edition) or **Vivado HL WebPACK Edition** (if you choose Vivado HLx). This is the **free** version.
	*  To avoid installing too many things, select just **Vivado** and **Artix7**:
	<br><img src="https://dropbox.com/s/vqcvos3ram702u9/vivado1.png?raw=1"   class="center_thirty">
	<img src="	https://dropbox.com/s/9ixj1lxu6vvi2so/vivado2.png?raw=1"   class="center_thirty"><br>
2. Install  <a href="https://www.oracle.com/java/technologies/javase-downloads.html" target="_blank">Java SE</a> (Java  JDK & JRE included in it), although it is likely that you already have these installed due to your other subject. 
3. Then, download the  <a href="https://alchitry.com/alchitry-labs" target="_blank">Alchitry Lab IDE</a>. This is the IDE where you can write your program in Lucid and flash it to the FPGA via USB connection. 

{: .highlight}
If needed, see step by step installation <a href="https://www.notion.so/natalieagus/Vivado-on-EC2-8ad5254e1091458bb62ce1e10ff5e95f?pvs=4#2fbb74193830466b933cb9c21a4b86a7" target="_blank">here</a>. 

By the end of this document, you should be able to create **simple combinational logic** modules and test them on Alchitry Au. 

## FPGA
A field-programmable gate array (FPGA) is an **integrated** circuit designed to be configured by a designer after manufacturing (instead of *before*), and hence the term *field-programmable*. The FPGA configuration is generally specified using a hardware description language (HDL). Lucid and Verilog are HDLs. You can also define the desired behavior of an FPGA using schematic design (for example, like this tool created by MIT called [Jade](https://computationstructures.org/exercises/tool_docs/jade.html)), but the HDL form is more suited to work with large structures because it's possible to specify high-level functional behavior rather than **drawing** every piece by hand. 

The FPGA is consisted of thousands of **programmable logic blocks** so that it can **mimic** the behavior of any combinational functions. It is commonly used by circuit designers to test their circuit designs. Before FPGA exists, one need to solder hundreds and even thousands of logic gates together to test the performance of their circuit design. It takes a lot of investment to realise your circuit design.  

{: .highlight}
Imagine the amount of work needed if we ask you to create a Beta CPU without any FPGA. How many logic gates in total would you need? 


## Creating Combinational Logic Modules

The purpose of using an FPGA is so that we can have an actual hardware device that realises (actually implements) certain functions or **logic** that we have designed. 

Let's take an example of a Full Adder unit that we did in Lab 2:
* After drawing its schematic at first, we can then *test* or *simulate* its functionalities using jsim or some other tools.
* Then you need to actually solder a bunch of things (transistors, etc) to prove your concept. *This is quite a hassle.* 
* If you were to design a state-of-the-art full adder unit, you will want to mass-produce your design (if it works exceptionally well). 

{: .important}
[Please teach yourself how to solder](https://www.youtube.com/watch?v=Qps9woUGkvI), and how to [solder useful things like GPIO pins](https://www.youtube.com/watch?v=qz9Ryos1_GY). 

Alternatively, we can use an FPGA to prove our concept. You can load your program (describing how your Full Adder works) onto an FPGA, and now the FPGA can be an actual working Full Adder unit. 

**How can we write this module/unit in Lucid?** 

Firstly, create a project in Alchitry Lab,
<br><img src="https://dropbox.com/s/yn3r5mnet0cbega/1a.png?raw=1" class="center_fourty"  >


Give it some name, ensure that it is Au and Lucid. Also, use the IO Element Base template. It sets the IO Unit for you:
<br><img src="https://dropbox.com/s/rng6k9awy6a95qp/1b.png?raw=1"  class="center_fourty" >


Now you should see that you have a project with several files:
<br><img src="https://dropbox.com/s/qpvoetamz6vz9xw/1c.png?raw=1" class="center_fourty"  >


{: .important}
You need to do your own self-study part to fill in the gaps and understand how the code works better by reading the <a href="https://alchitry.com/lucid" target="_blank">tutorials</a> provided by the original developer. The course handout also provides you some useful self-study materials. This document is only made to *complement* and *speed up* your self-study process, but it **doesn't mean** that you can forget about reading anything else. 

If you haven't read any tutorials about Lucid and Alchitry yet, here's some quick information: 
* Under `Source`, thats where you will write **all** your script. `au_top.luc` is like the `main` script, so do not delete that. 
* `au_top.luc` is the only script that can interface with **external input and output**, like LED, switches and buttons.  
* Each `.luc` script should describe a **component** (combinational / sequential).
*  Typically in `au_top.luc` we **combine** all components together with input/output, forming a whole complete device. 
* Under `Components` is where you can **add** standard components (like standard library modules). Right click on it and click `Add Components`, and you'll be faced with a phethora of modules which you may or may not use depending on your application:
<br><img src="https://dropbox.com/s/guc9ll03qiivdrx/1d.png?raw=1"  class="center_fourty" ><br> 

But a few important ones that you probably can't live without are: **counter, edge detector, button conditioner.** We will meet them soon. 

The **Constraints** tab is where you can define your input and output terminals. We will come back to this later. 

### The Full Adder
So now back to creating a **Full Adder.** By now you should know that this circuit implements a full adder functionality: 

<br><img src="https://dropbox.com/s/n1aqlz9dry92efk/FA.png?raw=1"  class="center_thirty" ><br>

We can describe this schematic in Lucid, by first defining the **input** and **output**. 

### Define Input and Output terminals

**Create a new source file** and name it `full_adder.luc`. **You will see that all lucid files should begin with terminals definition.** In a full adder, we have 3 1-bit inputs: `x, y, cin` and 2 1-bit outputs: `s, cout` . Therefore we shall modify the header as such:
```verilog
module full_adder (
	input x,
	input y,
	input cin,
	output s,
	output cout
)
```

{: .note}
Since FA is a combinational logic device, then we don't have to use the CLK.

And then in the body, we have the `always` block, which as the name suggests it **signifies a connection**, something that is **always** connected.  We can define other modules to be used above the `always` block, such as the `clock` or `reset` signals, or simply intermediary connections using the keyword `sig`. 

{: .important-title}
> The `always` block
> 
> Remember that this `always` block describes how a hardware devices should be **connected**, that is: literally describing its schematic in terms of code for Alchitry / Vivado to **interpret** and create an appropriate "connections" (logic) in the **Au** board.


The following code describes the schematic of an FA. The syntax is self-explanatory. Refer to Page 2 of the documentation (<a href="https://cdn.shopify.com/s/files/1/2702/8766/files/Lucid_Reference.pdf?5280018026990691420" target="_blank">Lucid Quick Reference Guide</a>) for a summary of syntaxes. 

```verilog
{
sig i, j, k; // connector
always {
	s = x ^ y ^ cin;
	i = x & y;
	j = x & cin;
	k = y & cin;
	cout = i | j | k;
	}
}
```
The values on the right of the `=` sign is the value that you will **assign** to the connection name on its left. 

You can download completed `full_adder.luc`  <a href="https://github.com/natalieagus/SampleAlchitryProjects/blob/master/GettingStartedWithFPGA/source/full_adder.luc" target="_blank">here</a>. 
### Connect Unit to I/O for Testing

Now let's **declare and connect** the Full Adder module in `au_top.luc` so that we can supply an actual input and output to the unit. Add the following line below `sig rst` in `au_top.luc`:
```cpp
sig rst; // reset signal
full_adder fulladder;
```

Then, connect the input and output terminal of the `fulladder` with some preset IO terminals in the `always` block, below the `io_sel = 4hf` line (keep the rest intact):
```verilog
... 
io_sel = 4hf; // select no digits

fulladder.x = io_dip[0][0];
fulladder.y = io_dip[0][1];
fulladder.cin = io_dip[0][2];

io_led[2][1] = fulladder.s;
io_led[2][0] = fulladder.cout;
```

{: .note}
It is highly recommended that you **do not implement** any further combinational logic modules in `au_top.luc`. Your code has to be as   **modular** <> as possible for the sake of easy debugging and development. **As a good practice, the module `au_top.luc` should be only used to simply connect big module(s) to the input/output terminal.** 

Here's a visual representation of the schematic. In other words, `au_top.luc` is the script that **interfaces** your custom modules with the **board's input and output unit:**

<br><img src="https://dropbox.com/s/ljwrcth2eu3fdw8/FAau.png?raw=1" class="center_fifty"  >

It's not as complicated as it looks. We simply want to use:
* `io_dip[0][0]` as `x`
* `io_dip[0][1]` as `y`
* `io_dip[0][2]` as `cin`
* `io_led[2][1]` as `s`
* `io_led[2][0]` as `cout`

Where are these stuffs on Alchitry Io? 
<br><img src="https://dropbox.com/s/v4baxwf8e33utm0/alc_io.png?raw=1"  class="center_seventy" >

Therefore we can use the dip switches (switch up for `1` and down for `0`) to supply various combinations of input `x,y,cin` **manually** and observe the output at the two rightmost LED in `IO_LED[2]`. 


Now build your code (it may take awhile, 2-3 minutes depending on your computer stats), and flash it to the Alchitry Au: 
<br><img src="https://dropbox.com/s/6vwvgyan4y60l4d/buildfile.png?raw=1" class="center_fourty"  >

**After it is successfully loaded to your board, do:**
* Try using the dip switch (three rightmost of `io_dip[0]`) to supply different values of input to the `fulladder` (all 8 combinations).
* Observe the output at `io_led[2][1]` and `io_led[2][0]`.
* Convince yourself that the output conforms to the full adder's fuctional specifications. Although automated testing is always better, this <span style="color:red; font-weight: bold;">manual</span> testing is important so that you can build bigger units with this. 

### Alchitry Io
Alchitry Io is basically our **input-output device**. We use the **LEDs** to debug like a monitor, and **buttons** to supply input. In our modern computers, we use keyboards and mouse as our input devices, and our beautiful 4K screen as our output. However here we use simply **buttons** and **LEDs**. It is very very primitive, and **it is very difficult**  to **debug** so always test each small module before integrating it!*

{: .note}
It's the same for modern hardware anyway; your keyboard is a collection of buttons, and your mouse has some buttons too plus a bunch of sensors. Your monitor is consisted of thousands of pixels. The difference is that with this FPGA, you are writing not just the **functionality** of the program but also the **input driver**, the **output driver**, and the **entire circuitry** to produce that logic!

The template **Io Base** already prepare these terminal namings for you, and define it under `Constraints` file. Open `io.acf` and you will see the following:
<br><img src="https://dropbox.com/s/bjtd5hrfo3ejvwj/constraintfile.png?raw=1" class="center_fourty"  >

#### `io.acf` File
The `.acf` file defines input and output pins from the original schematic of `Alchitry Au` to its symbols to be used when we code, e.g: `io_led`, `io_dip`, etc. The ones with the keyword `pulldown` signifies **input** pins, while the rest are digital output. 


{: .note-title}
> `pulldown` vs `pullup`
> 
> An input pin with `pulldown` resistor will by default give a value of `0` if there's **no** input being supplied to prevent a *floating/undefined* input voltage. An input pin with a `pullup` resistorlikewise will give a value of `1` by default if there's no input being supplied at that port. It is useful to read abit about <a href="https://www.electronics-tutorials.ws/logic/pull-up-resistor.html" target="_blank">pull-down and pull-up resistors</a>  if you were to implement a unit from scratch like our Mini-Hardware Project.  

This document will <span style="color:red; font-weight: bold;">not</span> teach you how to define more inputs for use on the `Br` board yet, or use the 7-segments to display numbers (it's an **anode** 7-seg, meaning you supply low `0` to turn the digit on). If you're interested to learn more, read the tutorial from the original author about <a href="https://alchitry.com/io-element" target="_blank">Io Element</a>

#### Turning LEDs `off`

Notice how you have this part that sets the `io_led` to off. It is written using the **array builder**, basically we set 3 sets of 8-bit values represented in hex `h` as 0. See <a href="https://cdn.shopify.com/s/files/1/2702/8766/files/Lucid_Reference.pdf?5280018026990691420" target="_blank">Lucid Quick Reference Guide</a> guide.
{% raw %}
```verilog
io_led = 3x{{8h00}};  // turn LEDs off
```
{% endraw %}
But later on we seem to overwrite two of the LED's value to reflect `s` and `cout`:
```verilog
io_led[2][1] = fulladder.s;
io_led[2][0] = fulladder.cout;
```

During **synthesis**, the setting of `0` to `io_led[2][1]` and `io_led[2][0]` is simply ignored, meaning that it **wasn't** realised as a sub-circuit on the hardware. Its treated as if the assignment of these LEDs to `0` *never happened*. 


{: .important}
All in all, please do not forget that hardware programming is unlike our usual programming in high level languages like `C` or Python. Anything that you write in an `always` block describes hardware connections (functionality) in a machine you are trying to create. When you click build (the hammer symbol), Xilinx Vivado and various other tools will figure out this behaviour and **then create a circuit that matches these connections and behaviour**. 




## Building More Combinational Logic Devices

Once you have tested that your full adder works correctly, it is time to create a full-blown 8-bit ripple-carry full adder, using 8 of these units. The routine is pretty much the same. Create a file called `8_bit_full_adder.luc`, and define its input/output terminals:
```verilog
module eight_bit_adder (
	input x[8],
	input y[8],
	input cin,
	output s[8],
	output cout
)
```
Then, declare eight full adder units:
```verilog
{
full_adder fulladder[8];
}
```

In the always block, define the connections:
```verilog
{
full_adder fulladder[8];
always {
	fulladder.x = x;
	fulladder.y = y;
	fulladder.cin[0] = cin;
	fulladder.cin[7:1] = fulladder.cout[6:0];
	s = fulladder.s;
	cout = fulladder.cout[7];
	}
}
```
You can use the array representations to assign values in a **compact** way, for example: 
```cpp
fulladder.cin[7:1] = fulladder.cout[6:0];
```
is equivalent to:
```cpp
fulladder.cin[7] = fulladder.cout[6];
fulladder.cin[6] = fulladder.cout[5];
fulladder.cin[5] = fulladder.cout[4];
fulladder.cin[4] = fulladder.cout[3];
fulladder.cin[3] = fulladder.cout[2];
fulladder.cin[2] = fulladder.cout[1];
fulladder.cin[1] = fulladder.cout[0];
```

You can download `eight_bit_adder.luc`  <a href="https://github.com/natalieagus/SampleAlchitryProjects/blob/master/GettingStartedWithFPGA/source/eight_bit_adder.luc" target="_blank">here</a>


### Test with actual input/output

In `au_top.luc`, declare the 8-bit ripple carry full adder above the `always` block:
```cpp
eight_bit_adder eightbitadder;
```

and connect the terminals into these IO components at the end of the `always` block:
```cpp
eightbitadder.x = io_dip[0];
eightbitadder.y = io_dip[1];
eightbitadder.cin = io_dip[2][0];
io_led[1] = eightbitadder.s;
io_led[2][0] = eightbitadder.cout;
```

The simple circuit that's described by this code is: 
<br><img src="https://dropbox.com/s/3i5ax6btfrmdcqy/8bfa.png?raw=1"  class="center_seventy"  >

**Build** the program and **flash** to the Alchitry Au:
* We can use the **rightmost** and the middle 8 `io_dip` to set the `8-bit` `x` and `y` values, and `io_dip[2][0]` to set `cin`. 
* Observe that the output is ***correct***, e.g: the middle 8 `io_led` for `s` and `io_led[1][0]` for `cout` represents the correct summation value. 


## Building a ROM
Remember how we can also implement the full adder as ROM instead? Here's how it looks like and the truth table:
<br><img src="https://dropbox.com/s/mpgdm1d5isbc62r/romadd.png?raw=1"  class="center_fifty" >

You can say that implementing anything as ROM means that we **hardcode** the answer, instead of synthesizing it using basic logic components like the gates: `AND`, `XOR`, `OR`, etc. The benefit of implementing the output as ROM is to minimise the hassle in synthesizing the logic out, but at the cost of *space* and *money*. 

We can implement a ROM in the FPGA very easily. The following module shows an example of implementing a Full Adder as ROM:
```verilog
module full_adder_ROM (
	// 3 bit input,
	// address[2] is x, 
	// address[1] is y, 
	// address[0] is cin
	input address[3], 

	// 2 bit output,
	// value[0] is cout, 
	// value[1] is s
	output value[2] 
  ) 
{
  const FULL_ADDER = {b11, b01, b01, b10, b01, b10, b10, b00};
  
  always {
	value = FULL_ADDER[address];
  }
}
```

{: .warning-title}
> Indexing
> 
> Notice the indexing convention. `FULL_ADDER[000]` represents the rightmost element that is `b00`, and `FULL_ADDER[111]` represents the leftmost element that is `b11`. 
> 
> To elaborate further, let's use an example. If input `address = 001`, it means `x=0, y=0, cin=1`. This corresponds to the **second** entry from the right of the `FULL_ADDER` constant, *a.k.a: our ROM*. The output value of `FULL_ADDER[001]` is therefore `10`, which means that `s=1, cout=0` as per the full adder's truth table. 

You can download `full_adder_ROM.luc`  <a href="https://github.com/natalieagus/SampleAlchitryProjects/blob/master/GettingStartedWithFPGA/source/full_adder_ROM.luc" target="_blank">here</a>. 

## Building Multiplexer
A multiplexer can be easily implemented using the keyword `case` in Lucid. Consider a new combinational logic module that does left shifting with the following schematic (`a`, `b` are inputs, and `s` is output):
<br><img src="https://dropbox.com/s/ub55j7rdohnl0o6/shifter8.png?raw=1"  class="center_seventy" >

The module above can shift the 8-bit `a` input by `n` bits to the left where `n=0,...,7`, and pad the shifted digits with zeroes. In Lab 3, you implement the 32-bit version of this module.

The three multiplexers can be easily implemented as follows. First, declare the input and output terminals:

```verilog
module eight_bit_shiftleft (
	input a[8],
	input b[3],
	output s[8]
  ) 
```
And then declare the two 8-bit intermediary signals `w` and `x`. In the `always` block, we implement the three multiplexers using three `case`, depending on each bit of input `b`:
```verilog
{
  sig w[8];
  sig x[8];
  always {
 
	case(b[2]){
        b0:
            w = a;
        b1:
            w[7:4] = a[3:0];
            w[3:0] = 4b0; // this means 4 bits of 0, equivalent to b0000
        default:
            w = a;
        }
	
	case(b[1]){
        b0:
            x = w;
        b1:
            x[7:2] = w[5:0];
            x[1:0] = 2b0;
        default:
            x = w;
        }
	
	case(b[0]){
        b0:
            s = x;
        b1:
            s[7:1] = x[6:0];
            s[0] = b0;
        default:
            s = x;
        }
  }
}
```
Pretty sure you'd know by now how to declare this in `au_top.luc` and test its funcionality.

You can download `eight_bit_shiftleft.luc` <a href="https://github.com/natalieagus/SampleAlchitryProjects/blob/master/GettingStartedWithFPGA/source/eight_bit_shiftleft.luc" target="_blank">here</a>.

## Summary

By implementing this adder on the FPGA, we have learned:
* How to implement a **combinational logic module** in the `always` block via boolean expression, ROM, and specify its input/output terminals clearly. 
* How to assemble a bigger combinational module using smaller combinational modules.
* How to test them and assemble them in `au_top.luc`. 

Now of course if you have read the documentation, you can simply implement an addition using a `+` in Lucid without having to resort to basic boolean logic because the interpreter will implement the addition for you. Either way, the hardware circuitry is still the same. If you use `+`, then you are describing the **functionality** of the circuit. Vivado will then build the corresponding hardware unit (logically) by programming the FPGA. If you describe the adder's schematic explicitly, then you are doing what Vivado did when synthesizing a `+`. Either way, the final functionality is the **same**, which is *to add*.

You are highly encouraged to read <a href="https://alchitry.com/your-first-fpga-project" target="_blank">this tutorial</a>  to enhance your understanding afterwards. 

{: .important-title}
> About Using External IO
> 
> If you would like to use **external IO** with the custom `Br` board, jump to [this](https://natalieagus.github.io/50002/fpga_3.html#using-external-output) section right away and refer to this [Br pins](https://drive.google.com/file/d/1T3Vth8YpqDq1iOcPEW6TWjwVH0-h-59C/view?usp=sharing). 


