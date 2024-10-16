---
layout: default
permalink: /fpga/fpga_3
title: FPGA Tutorial for Children
description: Getting Started with FPGA Part 3 - Reset and I/O
parent: Lucid V1 
grand_parent: 1D&2D Project (FPGA)
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
**Natalie Agus (Fall 2020)**

# Getting Started with FPGA: Part 3
{: .no_toc}
This is the final document in the series. It mainly shows how to handle I/O units, namely **reset**, **input button presses**, and **routing output to external LEDs**.  We will utilize all the parts we have learned before: combinational logic modules, sequential modules (with `dff` and `fsm`), usage of `counter` to slow the clock, and ROM. Finally, we will try to write our own constraints `.acf` file to connect our board to external LED outputs (or button/switch inputs). 

{: .note}
We won't be discussing how to use the 7 segment here. 

There are lots of <a href="https://alchitry.com/tutorials/lucid_v1/io-element/" target="_blank">online tutorial</a> on how to operate a 7-segment. **The Io Element Base template** itself also already contain a sample on how to use the 7-segment, so please study it. 

## External 7 Segment
If you do buy an external 7-segment, please take note of the required **supply voltage**. Also pay attention whether you're buying a <a href="https://www.electronics-tutorials.ws/blog/7-segment-display-tutorial.html" target="_blank">cathode or anode</a>  7-segment. 

The Au board can only supply up to 5V, so if it needs more than that then you need to use an **external power supply**. . Grab some BJT (NPN for Cathode type or PNP for Anode type typically, but either works) transistors to amplify the input signal from the Au Board. You can read some easy online tutorials on how to <a href="https://www.electronics-tutorials.ws/transistor/tran_4.html" target="_blank">use transistors as a switch</a>.

## Resetting Modules with Custom Clock
In this section we will discuss <span style="color:red; font-weight: bold;">issues of reset</span> if you supply a custom clock as the `clk` input to your synchronous logic units:
1. The standard `reset` button will not work anymore to reset this unit with custom clock, so you have to perform a **manual reset.**  
2. There's **no easy way** to synchronize the reset of this unit with custom clock and the reset of other units with FPGA clock. Depending on your design, it might be *problematic* if some units come out of reset earlier / later than others. 

{: .warning}
By definition, a system `reset` must reset ALL components synchronously.

### Manual Reset with Another Button
 
In part 2, we declared an instance of `seq_plus_two.luc` module using a "slowclock" so that we can actually **see** the output changes with our eyes:
```cpp
counter slowclock(#SIZE(1),#DIV(26), .clk(clk), .rst(rst));
seq_plus_two seqplustwo(.clk(slowclock.value), .rst(rst));
```
Notice that you will be <span style="color:red; font-weight: bold;">unable</span> to **reset** the unit, e.g: restart the sequences into `2,4,6,...` again even when the `reset` button is pressed. We also use `slowclock` for `seq_plus_vary.luc`, so it can't be `reset` either at this point. 

The quick reason on why reset doesn't work anymore is because   the `dff` inside `seq_plus_two.luc` module <span style="color:red; font-weight: bold;">is no longer synchronised</span> with the actual FPGA clock. The `reset` signal **and** all other modules (like the `slowclock`) are synchronised with the FPGA clock.  

{: .important}
The `slowclock`  **produces** a bunch of **zeroes** when `reset` button is pressed, and this *stops* `seq_plus_two.luc` from advancing -- **its like *time is frozen* for `seq_plus_two.luc` when `reset` button is pressed.**

Now you may think that we can easily add this line in  the always block of `seq_plus_two.luc` to manually reset the unit:

```verilog
if (rst == b1){
	register_1.d = b0;
}
```
But again this won't work precisely because `slowclock` is **frozen** (produces `0`) for as long as `rst == 1` (`reset` button is pressed), so nothing gets loaded to `register_1`. 

The fix to this is actually fairly simple: don't use the `reset` button to reset `seq_plus_two`. Simply use another button to be fed into the reset: 

```verilog
seq_plus_two seqplustwo(.clk(slowclock.value), .rst(io_button[0]));
```

And keep this line in  the always block of `seq_plus_two.luc` to **manually** reset the unit:

```cpp
if (rst == b1){
	register_1.d = b0;
}
```

Now if you **hold** `io_button[0]` **long enough** then the output is reset back to start at `2` onwards. However, this is still <span style="color:red; font-weight: bold;">not a good idea</span>. 

### Manual Reset Issue

Consider the following time-plot of `reset`, `slowclock` and actual FPGA `clk`:

<img src="https://dropbox.com/s/u8hh5xcjpej97yl/timesync.png?raw=1"   class="center_fifty"  >

It is **entirely possible** for the slowclock (rising edge) to entirely <span style="color:red; font-weight: bold;">miss</span> the "reset" button (in our example, we used `io_button[0]` as manual reset) press *if the press isn't covering the shaded region* (depending on how slow the clock is).  

Plus, if it happens to *change* at the shaded region then we might run into <span style="color:red; font-weight: bold;">metastability</span> problem.  Even worse, since we don't know how button input from external source will change in relation to the rising edge of the clock (be it system or custom), it is possible that some flip flops are reset and some others aren't. <span style="color:red; font-weight: bold;">This is disastrous!</span>

{: .highlight}
Bottomline is that external inputs are **unreliable**, and can be disastrous if its used to trigger important events like a `reset`. We need to rely on a better system called the Reset Conditioner. 

### Reset Conditioner

Normally, we can entirely avoid the **metastability** and **desynchronisation** problem using the built-in component provided by AlchitryLab: `reset_conditioner`.

The `reset_conditioner` in `au_top.luc` **synchronises** the reset signal **with the actual FPGA clock** so that all synchronous units in the FPGA will come out of reset at once, so that there won't be a case where some `dff` stay reset one cycle longer than the other.  You can read more about `reset_conditioner`  at the end of <a href="https://alchitry.com/tutorials/lucid_v1/synchronous-logic/" target="_blank">this</a> tutorial and <a href="https://learn.sparkfun.com/tutorials/external-io-and-metastability/all" target="_blank">this</a> tutorial as well.

For our `seq_plus_two.luc` unit, we used a custom clock and a separate manual reset from the rest of the units implemented in the FPGA.  While for this case seems fine (because it works for the **limited** number of times you tested it manually), it is a bad idea because if you have a more complicated system **it can be** **disastrous**:
 * If you manually reset each and every one of them without any kind of conditioner unit, then there's no way to ensure that all units come out of the reset at the same time. 
 * The only way to ensure that its all "reset" at the same time would be to **switch off and on** the device again, which is rather **unprofessional**. 

**So how do we tackle this?** How can we **slow down** the output of the unit (so that we can observe the output with the naked eye) without having to use a different clock?


{: .important}
> The Bottomline
> 
> If you need to `reset` your module for any purpose, **it is a bad idea  to use another clock other than the original FPGA clock** -- unless of course you're very experienced in this field. 


## Slowing Modules with FPGA Clock
A **better** way to sort of **slow down** the output of a module is to put certain **logic** condition in the `always` block instead and still supplying the original hardware `clk` and `rst` signal to it. Components that should be used to slow within sequential modules without messing with the `clk` are the **counter** and **edge_detector**. 

### Slowing the output rate and enabling system `reset` for `seq_plus_two.luc`
Since what we want is to perform `+2` only around **once** per second (so that we can see the output in effect), we need the same slow counter device be used within `seq_plus_two` instead:

```verilog
counter slowClock(#DIV(26), .clk(clk), .rst(rst));
```

We need another module called the `edge_detector` because we just want to have that trigger to +2 **once** every 1 second.

{: .note}
In 1 second, 100 million cycles of the FPGA clock have passed. We only want ONE out of the 100 million cycles to trigger the +2.  

The time diagram below illustrates how an edge detector work:
<img src="https://dropbox.com/s/f6jzjq0smatdb5r/edge.png?raw=1"    class="center_fifty" >

Add the edge-detector component (under Pulse Manipulation), and declare it in `seq_plus_two.luc`:
```verilog
edge_detector slowClockEdge(.clk(clk));
```



Modify the `always` block to be as such:
```verilog
{
	dff register_1[8](#INIT(0), .clk(clk), .rst(rst));
	eight_bit_adder plus_two;
	counter slowClock(#SIZE(1), #DIV(26), .clk(clk), .rst(rst));
	edge_detector slowClockEdge(#RISE(1), #FALL(0), .clk(clk));

  always {
    slowClockEdge.in = slowClock.value;
  	plus_two.y = 8h02;
  	plus_two.x = register_1.q;
  	plus_two.cin = b0;
    
	 
    if (slowClockEdge.out == b1){ //only add when MSB of slowCLock == 1
     register_1.d = plus_two.s;
    }
	  out = plus_two.s;
  }
```

In the first line of the `always` block, we pass the output of the `slowClock` to the edge detector so that it will produce a value of `1` once (within 1 clk cycle of the FPGA clock) at every rising edge. Then we only update `register_1` to store the current output of the adder when `slowClockEdge.out == b1`. 

We now can supply the hardware clock `clk` and `rst` signal when declaring it at `au_top.luc`, and no longer supply a custom clock into it:
```verilog
seq_plus_twoSlow seqplustwo(.clk(clk), .rst(rst));
```
You can find the final implementation <a href="https://github.com/natalieagus/SampleAlchitryProjects/blob/master/GettingStartedWithFPGA/source/seq_plus_twoSlow.luc" target="_blank">here</a>.

### Slowing the output rate and enabling system reset for `seq_plus_vary.luc`

Similarly for this unit, we can use the slowcounter and edge detector to trigger the state change only when the output of the edge detector is `1`.

Another way to use the counter is to create an `N` bit counter, and feed in the MSB as the input of the edge detector: 

{: .note}
Notice that the  LSB of the output of an `N` bit counter fed with system clock will be incremented by 1 as fast as the system clock cycle. The second LSB will be incremented half as fast as the LSB. The third LSB will be incremented half as fast as the second LSB, and so on. We can utilise this observation to create a slow-clock by utilizing the higher bits of the counter. 

```verilog
const SLOWCLOCK_SIZE = 27;
counter slowClock(#SIZE(SLOWCLOCK_SIZE), .clk(clk), .rst(rst));
edge_detector slowClockEdge(#RISE(1), #FALL(0), .clk(clk));

....// inside always block
slowClockEdge.in = slowClock.value[SLOWCLOCK_SIZE-1];
``` 

The updated `always` block of `seq_plus_vary.luc` is as follows, where we perform state transition or loading of output of adder to `register_1` only when the edge detector's output produces a `1`:

```verilog
  always {
	adder.y = 8h00;
	adder.x = register_1.q;
	adder.cin = b0;

  slowClockEdge.in = slowClock.value[SLOWCLOCK_SIZE-1];
  
	case (y_controller.q){
  	y_controller.S0:
      adder.y = 8h02;
      if (slowClockEdge.out == b1){ //only trigger change when slowClockEdge gives a 1
      	    y_controller.d = y_controller.S1;
      }
  	y_controller.S1:
      adder.y = 8h07;
      if (slowClockEdge.out == b1){
      	y_controller.d = y_controller.S2;
      }
  	y_controller.S2:
      adder.y = 8h0C;
      if (slowClockEdge.out == b1){
      	y_controller.d = y_controller.S0;
      }
    }

    if (slowClockEdge.out == b1){
	    register_1.d = adder.s;
    }
    
    out = adder.s;
	
  }
```

Similarly, we now can supply the hardware clock `clk` and `rst` signal when declaring it at `au_top.luc`, and no longer supply a custom clock into it:
```cpp
seq_plus_varySlow seqplusvary(.clk(clk), .rst(rst));
```

You can find the complete script <a href="https://github.com/natalieagus/SampleAlchitryProjects/blob/master/GettingStartedWithFPGA/source/seq_plus_varySlow.luc" target="_blank">here</a>.

## Conditioning Button Presses
Just like the reset button, input from external button presses are also <span style="color:red; font-weight: bold;">unreliable</span>. If you're trying to "capture" the input of a button press using a `dff`, then you need to ensure that it doesn't cause metastability using a built-in module called the **`button_conditioner`** (you can find it under **Miscellaneous** category):

```verilog
button_conditioner buttoncond[4](.clk(clk));

...//inside always block
buttoncond.in = io_button[3:0];
```

You can then use `buttoncond.out` as an input to some module that requires button presses as its input. 

## Using Button Presses as Triggers

There's **two** usages for button inputs in general:
1. You just want a user to *trigger* something **once** by pressing it.
2. You need a user to press and **hold** continuously.

Regardless of your needs, you need to know that since the system clock is running so fast at 100MHz, a button press will result in a value of `1` being produced as `buttoncond.out` **for at least thousands of clock cycles**. In other words, if you were to load this as an input to some register,
```verilog
register_1.d = buttoncond.out
```
...then you'd be loading the value of `1` for <span style="color:red; font-weight: bold;">many many clock cycles</span> to the same register. This is alright if your use case is case **(2)** above, that is if you use it as an input to some combinational logic unit,
 ```verilog
some_combi_logic.input = buttoncond.out
```
...but using `buttoncond.out` plainly, then it will <span style="color:red; font-weight: bold;">not</span> work if you intend to use the button press as a trigger that's supposed to happen **ONCE per PRESS**. 

In order to trigger the system **once per press**, you need to use the edge detector (don't forget to specify `#RISE` or `#FALL` or both, that is if you want `1` to be produced at each rising edge, or falling edge or both):
```verilog
edge_detector buttondetector[4](#RISE(1), #FALL(0),.clk(clk)); //detect on rising edge only
``` 
and then use it as such:
```verilog
buttoncond.in = io_button[3:0];
buttondetector.in = buttoncond.out;
some_system.trigger_input = buttondetector.out;
```
Then in the `always` block of that `some_system`, you can simply check if `trigger_input == 1b` and describe what should happen accordingly. 

## Storing Button Press Sequences
Suppose we want to create a unit whereby we need to key in a sequence of button presses and we want to know if this matches some predefined answer. You know, like the logic of the [wordle](https://en.wikipedia.org/wiki/Wordle) game. 

To do this, we need to apply all the knowledge that we have learned before:
* Creating combinational modules
* Creating sequential modules
* Using button conditioners and edge detectors 
* Using FSM and dff 

The plan is that given one button press at a time, we need to store its sequence so far and compare it against our answer key: another fixed sequence. We then need to display whether the presses entered so far matches the fixed sequence.

Create a new source file and name it `sequence_checker.luc` with the following input and output terminals:
```verilog
module sequence_checker (
	input buttons[4],
	input clk, // clock
	input rst, // reset
	output out_result[3],
	output out_buttonseq[4]
)
```

Here's the explanation for each terminal:
* `buttons[4]`: is a 4-bit button press indicator. Each digit `i` that is `1`(high) represents that button `i` is pressed, hence in total there's 4 different possible buttons that can be pressed. 
* `out_result`:  3-bit indicator that shows whether the button presses matches the sequence. It will be `111` if you're correct, and `100` if you're wrong. Actually 1-bit is sufficient to indicate whether the result is *right* or *wrong* but for clarity we use 3-bits instead. 
* `out_buttonseq` : just to debug. We will explain that later. 


### Planning 

Assume that this module's job is to receive **two** button presses, and each press can be from either of the four button: `io_button[0]`,  `io_button[1]`, `io_button[2]`,   `io_button[3]` (we can easily expand the idea to store and check more sequences of button presses, but lets start with two). 

We need to design a way to store these presses. Since each press can be one of the four buttons, we need 2-bits to indicate (*index*) each button press, e.g:
* `b00` for when `io_button[0]` is pressed
* `b01` for when `io_button[1]` is pressed
* `b10` for when `io_button[2]` is pressed
* `b11` for when `io_button[3]` is pressed

And then we need a memory unit to **store** the button index for each press. Since we have two presses, we can have a 4-bit dff to store the first press in the last 2-bits, and to store the second press in the next 2-bits. 

{: .new-title}
> Example
> 
> If `io_button[2]` is pressed first and  `io_button[3]` is pressed next, the content of this dff should be `b1110`. 

Then, we also need an `fsm` so that we can switch between some states like  waiting for button press, storing button presses, and checking the sequence after two presses are entered. 

Finally, we need a `constant` to match the sequence button presses against. 

### Declaring the modules
Based on our planning above, we can declare these modules:
```verilog
dff sequence[4](#INIT(0), .clk(clk), .rst(rst));
dff result[3](#INIT(0),.clk(clk), .rst(rst));

const MATCH = {b10, b11}; // press button 4, then 3

fsm brain(.clk(clk), .rst(rst)) = {
	WAITFIRSTPRESS,
	WAITSECONDPRESS,
	CHECKPRESS
};
```

The implementation is simple, during state `WAITFIRSTPRESS` and `WAITSECONDPRESS` we either wait for button-press and stay in the state, or if there's any button press, we store it to `sequence` registers and advance to the next state:
```verilog
always{     
    case (brain.q)
    {
      brain.WAITFIRSTPRESS:
        if (buttons[3] | buttons[2] | buttons[1] | buttons[0]){ //if any button is pressed
            if (buttons[3]){
              //fourth button pressed 
              sequence.d[1:0] = b11;
            }
          else if (buttons[2]){
              //third button pressed 
              sequence.d[1:0] = b10;
            }
          else if (buttons[1]){
              //second button pressed 
              sequence.d[1:0] = b01;
            }
          else if (buttons[0]){
              //first button pressed 
              sequence.d[1:0] = b00;
            }           
            brain.d = brain.WAITSECONDPRESS;
            // reset result 
            result.d = b000;
        }
        else{
            brain.d = brain.WAITFIRSTPRESS; //if no press, loop 
        }
      
    
      brain.WAITSECONDPRESS:       
          if (buttons[3] | buttons[2] | buttons[1] | buttons[0]){ //if any button is pressed
            if (buttons[3]){
              //fourth button pressed 
              sequence.d[3:2] = b11;
            }
          else if (buttons[2]){
              //third button pressed 
              sequence.d[3:2] = b10;
            }
          else if (buttons[1]){
              //second button pressed 
              sequence.d[3:2] = b01;
            }
          else if (buttons[0]){
              //first button pressed 
              sequence.d[3:2] = b00;
            }        
            brain.d = brain.CHECKPRESS;
           }
          else{
            brain.d = brain.WAITSECONDPRESS; //if no press, loop 
          }
   
      brain.CHECKPRESS:
        if (sequence.q[1:0] == MATCH[0] && sequence.q[3:2] == MATCH[1]){
            result.d = b111; //RIGHT
        }
        else{
            result.d = b100; //WRONG
        }
        brain.d = brain.CHECKPRESS;
    }
    
    out_result = result.q;
    out_buttonseq = sequence.q;

}
}
```

{: .note}
Yes, there's a lot of boilerplate "code" in there, but readable. There's better ways to make the code more compact but it doesn't really matter in terms of performance because its not like they're "evaluated" line by line anyway. What's more important is, if you're a beginner, to plan your schematic properly before you start coding. 

You can find the complete code <a href="https://github.com/natalieagus/SampleAlchitryProjects/blob/master/GettingStartedWithFPGA/source/sequence_checker.luc" target="_blank">here</a>.

### Testing
In `au_top.luc`, let's declare the necessary modules:
```verilog
sequence_checker sc(.clk(clk), .rst(rst));
button_conditioner buttoncond[4](.clk(clk));
edge_detector buttondetector[4](#RISE(1), #FALL(0),.clk(clk)); //detect on rising edge only
```

...and in the `always` block of `au_top.luc`, we connect the input and output terminals of the `sequence_checker`:
```verilog
io_led[0][3:0] = io_button[3:0];
buttoncond.in = io_button[3:0];
buttondetector.in = buttoncond.out;

sc.buttons = buttondetector.out;
io_led[2] = sc.out_buttonseq; //debug
io_led[1][2:0] = sc.out_result; //result
```

When you have built and run the program, try pressing some of the `io_button` and observe the output. If you press `io_button[3]` then `io_button[2]`, it will match the `const MATCH` and all three bits of `io_led[1][2:0]` will light up. 



## Using External Output
Finally, we will try to show the result `sc.out_result` on an external LED instead. You need to use the `Br` board for this (the middle board in the stack). Take a look  our custom <a href="https://drive.google.com/file/d/1T3Vth8YpqDq1iOcPEW6TWjwVH0-h-59C/view?usp=sharing" target="_blank">Br board schematic</a>. You can route your signals to any pin that supports IO and define them in the **constraints file.** 

Create a new **constraint** file (at the osconstraint folder) and name it `custom` (or any other name that you want, as long as the extension is `.acf`) .

{: .important}
You are recommended to just have ONE constraint file. If you need the default I/O terminals on Alchitry Io, then copy over the contents of the other two acf files, <code>io.acf</code> and <code>alchitry.acf</code> and paste it to <code>custom.acf</code>, and delete the former two so you just simply have <code>custom.acf</code>.  Delete ALL other <code>.acf</code> afterwards. <>

### I/O Error

Here's a very common I/O error that your AlchitryLab IDE might report:
```verilog
ERROR: [DRC NSTD-1] 
Unspecified I/O Standard: N out of 57 logical ports use I/O standard (IOSTANDARD) value 'DEFAULT', instead of a user assigned specific value.
This may cause I/O contention or incompatibility with the board power or connectivity affecting performance, ...
...
ERROR: [DRC UCIO-1]: Unconstrained Logical Port: N out of 57 logical ports have no user assigned specific location constraint (LOC).
To correct this violation, specify all pin locations. 
This design will fail to generate a bitstream unless all logical ports have a user specified site LOC constraint defined.
```

 
This can be fixed if we specify <strong>all</strong> pins on Alchitry Br (recommended), but that will be quite troublesome. You can however choose to ignore them by doing the following:

* **Create** a new file under "Constraints" (right click >> New File) with name `filename.xdc` (name it anything you want as long as the extension is <code>.xdc</code>). It should fall under "User Constraint" option. 
* **Paste** the content of original <code>au.xdc</code> to it, and
* **Add** three more lines to ignore the warning and allow unconstrained bistream: 

```verilog
  set_property SEVERITY {Warning} [get_drc_checks NSTD-1]
  set_property SEVERITY {Warning} [get_drc_checks UCIO-1]
  set_property BITSTREAM.General.UnconstrainedPins {Allow} [current_design]
```
* **Delete** the original <code>au.xdc</code>.




You can then define **output** pins in `custom.acf` in the following format,
```verilog
pin <pin name> <Br terminal pin name>
```

{: .warning}
Ensure that your custom pins do not use any other pins that's already been used on your IO Shield, or other custom pins. Each declaration must be **unique**.

For example, if you'd like to use the Br pins `C49, C48, C2` as an **output** port to display the 3-bit `results`, you can define them as such in `custom.acf`:
```verilog
pin customout[0] C49;
pin customout[1] C48;
pin customout[2] C2;
```
... and then declare them in `au_top.luc`: `output customout[3]`. In the `always` block of `au_top.luc`, connect them to the output of the `sequence_checker`:
```verilog
customout = sc.out_result; //result to external led
```

{: .note}
If you do not delete the original two `.acf` files and simply added `custom.acf` with these three pin descriptions, then you won't be able to compile successfully. 

Then connect the 3 LEDs on a breadboard with some resistors. If you don't know how breadboard, resistors, or LED works, you can start with some <a href="https://computers.tutsplus.com/tutorials/how-to-use-a-breadboard-and-build-a-led-circuit--mac-54746" target="_blank">basic</a>  circuitry tutorials:
* **Connect** the **short** leg of the LED to **ground** (cathode)
* **Connect** the **long** leg of the LED to the **output** pin (`C49, C48,` and `C2` for each LED)  (anode, voltage high)
* **Connect** the **resistor** anywhere within the circuit loop. 

All three LEDs should light up if you key in the right sequence: 
<img src="https://dropbox.com/s/d4il3wbpcvtshx9/outputvalues.png?raw=1"   class="center_seventy"  >

Likewise, you can define an **input** pin in the following format,
```verilog
pin <pin name> <Br terminal pin name> pulldown
``` 
or:
```verilog
pin <pin name> <Br terminal pin name> pullup
```  


Input pins with default <code>pulldown</code> resistor will produce a <code>0</code> and input pins with default <code>pullup</code> will produce a <code>1</code>  if there's no external value fed into it.

{: .new-title}
> Recap about pulldown and pullup
> 
> The `pulldown` and `pullup` internal resistors are made to ensure that there won't be "*floating*" or "*invalid*" input values that's fed to your system when there's nothing that's fed to it (i.e: switched off). Read <a href="https://www.electronics-tutorials.ws/logic/pull-up-resistor.html" target="_blank">this</a> if you'd like to know more about pull-up and pull-down resistors. 


## Summary


This document builds up on some of the things we learned before in Part 1 and 2, and it mainly focuses on how to use external I/O devices and reset the whole system properly. You may find the complete project used in all three parts of this introduction to FPGA <a href="https://github.com/natalieagus/SampleAlchitryProjects" target="_blank">here</a>.  

You are recommended to read further on (if they're applicable to your project of course) :
1.  **How <a href="https://alchitry.com/tutorials/lucid_v1/io-element/" target="_blank">7-Segment works</a>** (you can learn using the onboard 7-segment on Alchitry Io first before buying external units). **7-Segment component** is useful to display numbers, e.g: display score, time left, etc. 
   
2. **How LED Strips work** (e.g: WS2812B, or SK6812 LEDs). You can refer to online tutorials like  <a href="https://vivonomicon.com/2018/12/24/learning-how-to-fpga-with-neopixel-leds/" target="_blank">this</a> one. Then read the [**datasheet**](https://www.dropbox.com/s/7kj6aa9n6817tid/WS2812.pdf?dl=0), see here for WS2812B datasheet so you understand how to send the low bits and the high bits to encode an LED color. We have some sample LED writers that's Au and WS2812B compatible <a href="https://github.com/natalieagus/ws2812b" target="_blank">here</a>  to get you started. 
   
3. How you can utilize another powerful **storage device:** the **default RAM component**. You can find the <a href="https://alchitry.com/tutorials/lucid_v1/hello-your-name-here/" target="_blank"> tutorial</a> written by the original author here (there's single-port and dual-port RAM). 

	 <strong>RAM component</strong> is <strong>especially useful</strong> if you need to store a **large** amount of data <>, e.g data to be rendered out to large (32x32 or 64x32, etc) LED matrices. It is convenient to use the `dff` for small data storages, but you will run out of logic units real fast if you were to create thousands of dffs (not to mention the bizzare amount of time needed to compile the code). 

4. **How RGB LED Matrix works**. Some <a href="https://learn.adafruit.com/fpga-rgb-matrix/overview" target="_blank">online tutorials</a> can be a good starting point. You need to have some pretty good understanding about sending clocked serial data though. We have some sample RGB Matrix writer  <a href="https://github.com/natalieagus/rgbledmatrix" target="_blank">here</a> (64x32 compatible, simply adjust the parameter if you have other dimensions, double check the clock and addressing, this follows strictly [adaFruit matrix LED](https://learn.adafruit.com/32x16-32x32-rgb-led-matrix/new-wiring)).  You can use it with some simple RAM modules (2 units of 64x16 cells, each cell containing 3 bits, each unit to drive one-half of the matrix). You can instantiate a simple_ram module like this:

```verilog
ADDRESS_SIZE = 4 : ADDRESS_SIZE > 0, //width of the address field (ABCD signals for matrix_led)
  MATRIX_WIDTH = 64 : MATRIX_WIDTH > 0 //number of LEDs per row in the matrix
  
const RAMSIZE = $pow(2,ADDRESS_SIZE) * MATRIX_WIDTH;
simple_ram ram_top(#SIZE(3), #DEPTH(RAMSIZE));
simple_ram ram_bottom(#SIZE(3), #DEPTH(RAMSIZE))
```


Once you're comfortable with some basic FPGA programming, you can begin designing the datapath for your game and implement the modules required. You may refer to <a href="https://natalieagus.github.io/50002/1D_programmable_machine.html" target="_blank">this tutorial</a> for clues on how to begin if needed. 

## Final note: Test Wisely
To save you some pain and time, it always good to  <strong>TEST</strong> your <strong>hardware</strong> AND <strong>connections</strong> first <strong>BEFORE</strong> testing them together with your implementation:
1. **Test** whether every single segment of your 7-segment device is **working**. Use really simple stuffs like jumper wires, voltage source and ground. No programming or extra tools needed. 
3. **If you use LED strips, test whether each LED** **works**. Write some simpler tester code to light up all the LEDs, light them up to with alternating colors, light them up with different colors, etc. 
4. Do the **same** as point (2) above for **LED matrices**, or even basic **single LED lights**, whichever LEDs you use for your project. 
5. Check if the **buttons** or any input device you bought is working by capturing its presses and showing it out on an LED on Alchitry Io. Also, ensure that the button press is **crisp** and not wonky. 
6. If you're using the **breadboard**, make sure the breadboard itself works fine. If you're soldering on the PCB, always test your connection first using some voltage source, ground, and jumper wires. 

  
{: .warning}
**ONLY** and **ABSOLUTELY ONLY** proceed to make more complex modules when you are 100% sure that your smaller components are free of bugs. Nobody can safe you otherwise, and you might do better by just redoing the entire project again if you find too many bugs in a complex system. 







 
