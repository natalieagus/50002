---
layout: default
permalink: /fpga/fpga_2
title: FPGA Tutorial for Toddlers
description: Getting Started with FPGA Part 2 - Sequential Logic and FSM
parent: FPGA
nav_order:  2
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

# Getting Started with FPGA: Part 2
{: .no_toc}
This document introduces the steps on how we can create **basic** **sequential logic modules**, that is any module that utilises `dff` (D flip-flops). 

{: .note}
You are recommended to read this document only after you have understood  Week 3 materials, namely the **synchronous logic** and **FSM**.

The Alchitry Au board comes with **100MHz** on-board clock. When used properly, connections defined in the `always` block of sequential logic modules is set by default to **receive new set of values** at *every* **positive clock edge**. It is imperative for dynamic discipline to be satisfied within a clock period. Designs that fail to pass timing but are used anyway will result in unpredictable output. 

## Sequential Logic Module

<br><img src="https://dropbox.com/s/7ynz6v0w3u95zud/counter.png?raw=1" class="center_fifty"  ><br>

Above is a sample schematic of a simple sequential logic module. Assuming the D Flip-Flop `R1` is triggered at each positive clock edge, then:
* The **combinational** logic unit applies some function $$f$$ to its input `QR1`.
* At the **first** cycle, the value loaded to `R1` is `INIT`, and hence at the signal at `CL out` = $$f($$`INIT`$$)$$
* At the **second** cycle, we apply $$f$$ again, resulting in `CL out` = $$f(f($$`INIT`$$))$$, and so on. 

We need to ensure that **dynamic discipline** is obeyed, meaning that $$t1$$ and $$t2$$ timing constraints are satisfied. 
* Typically this isn't much of an issue, unless you perform intensive computations in the combinational logic unit such that its `tpd` gets too large and violates the $$t2$$ constraint. 
* Alchitry Lab will <span style="color:red; font-weight: bold;">warn</span> you if timing contraints are violated, which means you need to break down the combinational logic unit into smaller parts and adding more DFFs in between. 

To make things simple, let's use the **8-bit ripple-carry adder** unit that we made in *Part 1*, to **increment the value of `INIT` by the constant `2` at each clock cycle**:

<br><img src="https://dropbox.com/s/50qvdip2wuq1njg/seqadder.png?raw=1" class="center_fifty"  ><br>

Notice some details:
* The output `cout` is grounded because we don't need it.
* The system has 8-bit `CL out` as output. There's no external input to the system. 
* When the system starts, it will  add `2` to `INIT` value at each clock cycle.
* If we connect each bit of  `CLout` to an LED, then  the output sequence we should observe (changing at each CLK cycle) is: `2, 4, 6, 8, ...` (in binary, of course). 

## `dff` in Lucid

A DFF serves as a fundamental unit of memory and is commonly utilized to interface between segments of combinational logic, thereby enabling the creation of sequential logic devices. In Verilog, this is equivalent to the `reg` type. It captures the value of its input at the moment of a clock edge (usually the rising edge) and stores that value.  The `dff` in Lucid has four ports: clk, rst, d (input), and q (output).

{:.note-title}
> `reg` in Verilog 
>
> The `reg` type is used to model data storage elements that hold binary values (0 or 1) and are typically used within procedural blocks (such as initial or always blocks) to hold temporary values and implement storage elements like flip-flops or latches.


We already have the 8-bit ripple-carry adder module ready from our previous chapter, but not the D Flip-Flop. Fortunately, Lucid's built in `dff` + additional `reset` mux built into it that you can use by **declaring** each unit with the keyword `dff` **before the always block.** 

**Create** a new module and name it `seq_plus_two.luc`. This time round, we accept input `clk` and `rst` signal as per the default `.luc` script. These two signals are fed by the hardware, where `clk` is typically the onboard clock, and `rst` signal is `1` when the `reset` button on Alchitry Au (not Alchitry Io!) is pressed. 

<br><img src="https://dropbox.com/s/c8bx99dmnu1zsku/au.png?raw=1"  class="center_fifty" >

To use a `dff` properly, you need to **initialise** the following parameters:
1. The `clk` signal, 
2. The `rst` signal (optional), and 
3. The `INIT` value (optional) 

{: .note}
All of the above must be done **BEFORE** the always block to take desired effect. 

The syntax to define the so-called *initial parameters* to `dff` during declarations are very simple -- use the bracket `()` separated by commas. An 8-bit `dff` is basically 8 copies of 1-bit `dff` (declared as an array with the square `[]` brackets): 
```verilog
module seq_plus_two (
	input clk,  // clock
	input rst,  // reset
	output out[8]
  ) 
  {
  dff register_1[8](#INIT(0), .clk(clk), .rst(rst));
  }
``` 

{: .note}
`.clk(clk)` means to connect the `clk` signal of the `dff` with the `clk` signal of `seq_plus_two` (supplied as input from the on-board clock hardware).* There one other way to declare the `clk` and the `rst` signal before the always block -- a <a href="https://alchitry.com/synchronous-logic" target="_blank">nested</a>  way. It works the same, just probably is easier to type when you have many modules to declare that receives the same `clk` and `rst` signal. 

The `dff` has **two** important terminals: `.d` for **input** and `.q` for **output**. We simply have to **connect** them with the adder. Let's declare the adder module as well and connect them:

```verilog
{
  dff register_1[8](#INIT(0), .clk(clk), .rst(rst));
  eight_bit_adder plus_two;
 
  always {
	plus_two.y = 8h02;
	plus_two.x = register_1.q;
	plus_two.cin = b0;
	register_1.d = plus_two.s;
	out = plus_two.s;
  }
``` 

You can download `seq_plus_two.luc` <a href="https://github.com/natalieagus/SampleAlchitryProjects/blob/master/GettingStartedWithFPGA/source/seq_plus_two.luc" target="_blank">here</a>.

{:.error-title}
> ⛔️ Do NOT use `sig` or `var` if you intend to *store* something 
> 
> Variable declarations (`var`) are used to define one or more variables that can be used later. Variables are used to store temporary integer values that you won’t see in your actual design. The most common use for them is as the index in a for statement. They <span class="orange-bold">will not work the way `var` works in Javscript or higher level programming language</span>!
>
> Signal declarations (`sig`) are used to define one or more signals. Signals should be thought of as wires in your design; they are used to carry a value from one expression to another. Inside an always block, they can be read and written. Their value will be whatever was last written in the always block, and they must be written before being read.


## Testing Your Sequential Logic Module

If you declare the `seq_plus_two` module in `au_top`:
```verilog
seq_plus_two seqplustwo(.clk(clk), .rst(rst));
```

And connect its output to the LED,
```verilog
io_led[0] = seqplustwo.out;
```
**You won't see any discernible blinking on `io_led[0]`. It will just flicker really fast and you can't see. anything that resembles some 8-bit binary values that are incremented by 2.**

{: .important-title}
> `.clk` is too fast
> 
> **Why?** Its not because that `seq_plus_two.luc` is buggy, but its because the `clk` is too fast, running at 100MHz (100 million cycles per second). The `+2` addition is done so fast that your eyes cannot see any discrete values shown on `io_led[0]`. 

We cannot change the on-board clock speed, but we can  **slow down**   the `clk` signal fed to `seqplustwo`. However, we can utilize this in-built **component** called **counter**. Right-click on `Components` on the left and add the counter component. 

<br><img src="https://dropbox.com/s/mcv80rkkcglrozm/countercomp.png?raw=1" class="center_fourty"  >

You should see a new script called `counter.luc` added under `Components` afterwards. This unit is a synchronous logic unit that receives the following initial parameters:
* `#SIZE(n)` : defining how many bits is its output
* `clk` signal that synchronizes this unit 
* `rst` signal 
* `#DIV(i)` value (optional): number of bits used as the *divisor*. 

The output of the counter is `n` bits as defined by the `SIZE` parameter. Without any `DIV`, then the counter will produce an output that's incremented by 1 at every `clk` cycle. 

If `i` is set to be nonzero, then the counter will produce an `n` bit output that is incremented by 1 at a **slower** clock rate -- `clk` is slowed down by $$2^i$$ times. **Therefore, we can use a 1-bit counter as a <a href="https://reference.digilentinc.com/learn/programmable-logic/tutorials/use-flip-flops-to-build-a-clock-divider/start" target="_blank">frequency divider</a>  -- i.e: produce a clock signal with slower rate.** 

{: .note}
You don't have to read the details if you are running low on time. Just know that you can use a `counter` component with `#DIV` set to produce a clock signal with slower rate. 

Therefore we can declare our `counter` as follows:
```verilog
counter slowclock(#SIZE(1),#DIV(26), .clk(clk), .rst(rst));
```
And use its output as a **slower clock** for `seqplustwo` module:
```verilog
seq_plus_two seqplustwo(.clk(slowclock.value), .rst(rst));
```

Don't forget to connect `seqplustwo`'s output to `io_led` in the `always` block.
```verilog
io_led[0] = seqplustwo.out;
```

Now you should be able to see that the LEDs are lighted up and they resembles bits of data that's incremented by 2 periodically. 

{: .new-title}
> Experiment Further
>
> When you click the reset button, it will **not** restart the addition back from `0` again! Can you guess why? Don't worry about it for now. We will tackle this problem in Part 3  of the tutorial.

Also, to **enhance** your understanding in creating synchronous / sequential logic modules, **it is important for you** to read <a href="https://alchitry.com/synchronous-logic" target="_blank">this</a>  tutorial written by the original author. 


## Creating a Finite State Machine 

Now suppose we want to vary the `y` input signal to the 8-bit adder in `seq_plus_two`  into the following values in turn every clock cycle (on repeat):
* `8h02` (+2)
* `8h07` (+7)
* `8h0C` (+12) 


So the value `out` will be the following at each clock cycle:
* At `t=0`: `out = 0`
* At `t=1`: `out = 2`
* At `t=2`: `out = 9`
* At `t=3`: `out = 21`
* At `t=4`: `out = 23`
* At `t=5`: `out = 30`
* At `t=6`: `out = 42`
* At `t=7`: `out = 44`
... *you get the idea.*

We can supply these `y` values using an FSM, having the following simple transition diagram and starting state `S0`:
<img src="https://dropbox.com/s/erkav0dr0jsht2b/fsmdiag.png?raw=1"  class="center_thirty" ><br><br>

The schematic of the updated sequential logic device (its no longer a plus 2 only now) is: 
<img src="https://dropbox.com/s/dwc8fl78ibykw22/fsmeg.png?raw=1"  class="center_fourty"><br>

We now have that **additional** FSM unit that controls the value of `y` instead of just feeding it with the constant `2` like we did previously. 

### `fsm` in Lucid
Thankfully Lucid comes with a built-in `fsm` declaration, so we don't have to define that FSM by ourselves. `fsm` is similar to `dff` except that it is used to store **state** and not a value. Think its a little overkill to create an FSM just for this feature of toggling the values of `b`?  Well, there are many other ways to do this. One possible way is to create a ROM to store the 3 versions of **values**:

```verilog 
const Y_VALUES = {8h0, 8h0C, 8h07, 8h02} 
```

{: .note}
`Y_VALUES[0]` is `8h02` **and not** `8h0`.

Then, use a 2-bit `dff` whose output value is used as an  input `address` to the ROM. We increment the content of the `dff` by 1 at each clock cycle, and reset it back to `00` once it reaches `10` (because we don't need `11`):

```verilog
dff counter[2](.clk(clk), .rst(rst));
eight_bit_adder adder; 

...
// somewhere inside always
adder.y = Y_VALUES[counter.q]
if (counter.q == 2b10){
	counter.d = 2b00;
}
else{
	counter.d = counter.q + 1;
}
...// set other connections for adder
```

Sounds like so much hassle. Technically we can see the `dff` as storing a *state* too, so let's be a little extra and use `fsm` module instead -- because... why not?

#### Declaring `fsm`
We can declare our FSM by setting its `clk` and `rst` signal, along with the list of **states** before the `always` block:
```verilog
fsm y_controller(.clk(clk), .rst(rst)) = {S0, S1, S2};
```

Then in the `always` block, we describe the hardware connections of this module, and the logic for the FSM: **to describe what output should be set at each fsm state, and the next state values**. The code is pretty descriptive and straightforward. 

Create a new module and name it `seq_plus_vary.luc` to contain this code:
```verilog
module seq_plus_vary (
	input clk,  // clock
	input rst,  // reset
	output out[8]
  ) 
{
  dff register_1[8](#INIT(0), .clk(clk), .rst(rst));
  fsm y_controller(.clk(clk), .rst(rst)) = {S0, S1, S2};
  eight_bit_adder adder;
 
  always {
	adder.y = 8h00;
	adder.x = register_1.q;
	adder.cin = b0;
	
	case (y_controller.q){
		y_controller.S0:
			adder.y = 8h02;
			y_controller.d = y_controller.S1;
		y_controller.S1:
			adder.y = 8h07;
			y_controller.d = y_controller.S2;
		y_controller.S2:
			adder.y = 8h0C;
			y_controller.d = y_controller.S0;  	
	}
    
	adder.cin = b0;
	register_1.d = adder.s;
	out = adder.s;

  }
}
```
The line `case (y_controller.q)` **switches** the behaviour of the fsm depending on the current state produced at the output of the fsm `y_controller.q`.

At each state, we define what the **output** should be. For example when `y_controller.S0` case happens, that's when the current state is `S0`. It will output `8h02` as the signal to the `y` input port of the adder. 

At each state, we also define the **next state** should be:
* The line `y_controller.d = y_controller.S1;` sets `S1` to be the next state of the fsm.
* Therefore in the **next positive clock edge**, the FSM is at `S1`. 
	
The Tools (Vivado, Alchitry) will intrepret this code and **synthesize** an appropriate logic circuitry for it on the Au: 
* By setting a bunch of  logic cells in the Au  (LUT) to implement your machine's logic. Read <a href="https://www.fpga4fun.com/FPGAinfo2.html" target="_blank">here</a> for fun facts on how FPGA works. 
* Plus some other *magic*, we don't really know how the proprietary software does it exactly other than it will utilize some of the 33280 logic cells of the Alchitry Au. So although we have more than enough cells on the Au to emulate reasonable school projects, we can't really say that it can emulate *any* hardware (of any size). 

### Testing 
As usual, declare `seq_plus_vary` instance in `au_top.luc` with the **slower clock**, and connect its output to some LED on the Io Shield. 

You can download `seq_plus_vary.luc` <a href="https://github.com/natalieagus/SampleAlchitryProjects/blob/master/GettingStartedWithFPGA/source/seq_plus_vary.luc" target="_blank">here</a>.
## Summary

In this document, we are given a glimpse on how to create a synchronous / sequential logic circuit. Please also read <a href="https://alchitry.com/synchronous-logic" target="_blank">this tutorial</a> to enhance your understanding. We were also introduced into two new types: `dff` and `fsm`. You are recommended to read more about FSM <a href="https://alchitry.com/roms-and-fsms" target="_blank">here</a>. 

It is important to always remind yourself that the `always` block contains the **hardware description** of your device. It is **NOT** a piece of code that is sequentially executed by a processor like our usual Python and C code (there's no processor here!). They're *interpreted* by Xilinx and Alchitry tools sequentially, but not evaluated sequentially. **You should always remind yourself that everything in an always block as being evaluated continuously.** 

{: .important}
Be careful when using `for` loops in Lucid. `for` statements provide a **compact** way to write something that is **otherwise repetitive**, but in any case it does NOT work as how `for` loops in Python or C does. 

Refer to <a href="https://cdn.shopify.com/s/files/1/2702/8766/files/Lucid_Reference.pdf?5280018026990691420" target="_blank">Lucid Reference Guide</a> frequently, and do not assume that they work the same way as Python or C.  Also, don't forget to incrementally test your modules:
* Make small modules, define clear input/output terminals
* Test each small module ***thoroughly***: all combinations of input and output must be **correct**.  
* Then make bigger modules


