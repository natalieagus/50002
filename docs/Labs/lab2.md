---
layout: default
permalink: /lab/lab2
title: Lab 2 - Combinational and Sequential Logic with FPGA
description: Lab 2 handout covering topics from sequential logic and introduction to FPGA
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

# Lab 2: Combinational and Sequential Logic with FPGA 
{: .no_toc}

## Starter Code
There's no starter code for this lab. You simply need to have [Alchitry Labs V2](https://alchitry.com/alchitry-labs/) installed. You don't need Vivado for this lab, we are only going to run simulations. 

## Related Class Materials
The lecture notes on **[sequential logic](https://natalieagus.github.io/50002/notes/sequentiallogic)** and **[logic synthesis](https://natalieagus.github.io/50002/notes/logicsynthesis)** are closely related to this lab.

## Introduction to FPGA Development 

In this chapter, we'll explore combinational and sequential logic using FPGAs. 

{:.important}
Unlike software simulations, FPGAs let you directly program hardware, giving you a real-world, hands-on understanding of how digital systems work. 

FPGAs offer:

1. Flexibility: Easily reprogram and experiment with different designs.
2. Real-time Feedback: See your circuits in action, running in parallel.

You have been given the **Alchitry Au FPGA development kit**, which includes I/O ports for **easy** connections to external devices. It’s a cost-effective option compared to full-scale Xilinx boards, making it **ideal** for education. 

To program the FPGA, we'll use the **[Lucid V2](https://alchitry.com/tutorials/lucid-reference/)** hardware description language (HDL), which is simpler (in syntax) than traditional HDLs like Verilog, making it easier to learn. **[Alchitry Labs](https://alchitry.com/alchitry-labs/)** will be our development environment (IDE), converting Lucid into Verilog for synthesis in Vivado. 

{:.note-title}
> Why not Vivado + Verilog?
> 
> Vivado is the industry-standard tool for FPGAs. However, both Vivado and Verilog have <span class="orange-bold">steep</span> learning curves, especially for beginners. It is not suitable for 50.002 because we need to cover a lot of foundational topics—ranging from MOSFETs and transistors to operating systems. Alchitry Labs, will handle the conversion to Verilog in the background, so you can <span class="orange-bold">focus</span> on **learning the core concepts without diving into the complexities of Verilog or Vivado**.

When you "program" an FPGA, you are configuring its logic cells and connections to implement your desired digital circuit or design. This is <span class="orange-bold">different</span> from programming software, as you are actually defining hardware behavior within the FPGA.


### Create New Project

Create a new project with Blinker Demo as a template. Choose Alchitry Au. This is our FPGA development board.

<img src="{{ site.baseurl }}//docs/Labs/images/lab2/2024-10-19-08-27-05.png"  class="center_seventy no-invert"/>

There a few Lucid (`.luc`) source files created: 
1. `alchitry_top.luc`: This is like the "main" file. You can interact with I/O (LEDs, buttons, switches) defined in the **constraint** file. 
2. `blinker.luc`: this is a custom module containg the logic of LED blinking 
3. `reset_conditioner.luc`: this is a module obtained from Alchitry component library. It synchronizes the reset button so that all modules in the FPGA can receive the reset signal **at the same time**. 
4. `Constraint files: alchitry.acf`: a constraint file **maps** the FPGA I/O pin with a logical name that you can define in `alchitry_top.luc`, so that you can define the logic to control these I/Os.

### Module 

This section briefly explains basic Lucid V2 syntax. Lucid V2 is a great language to program **simple** behavior on the FPGA which is sufficient for 50.002. 

{:.important}
You are <span class="orange-bold">strongly</span> recommended to give the [official reference guide a read](https://alchitry.com/tutorials/lucid-reference/) to obtain further information. 

Modules are the core building blocks of any Lucid project. They encapsulate specific functionality, allowing you to design complex circuits by breaking them into smaller, manageable components. Each module can have parameters and ports that define how it interacts with other parts of the design. The general structure for a module declaration in Lucid is:

```verilog
module module_name #(
    // optional parameter list
)(
    // port list
) {
    // module body
}
```

{:.note}
By organizing your design into modules, you create **reusable**, **testable** blocks that can be **combined** to form larger systems.

For instance, the `blinker.luc` module is written as follows:

```verilog
module blinker (
    input clk,   // clock
    input rst,   // reset
    output blink // output to LED
) {
    dff counter[26](.clk(clk), .rst(rst))
    
    always {
        blink = counter.q[25]
        counter.d = counter.q + 1
    }
}
```

It is designed to create a **blinking** signal that can drive an LED, **toggling** it on and off at a set interval. It uses a clock signal (`clk`) and a reset signal (`rst`) to control the timing of the blink.

#### Port List 
- **Inputs**: 
  - `clk`: 1 bit clock signal, which drives the timing of the module.
    - By default, the FPGA supplies 100MHz clock (defined in the constraint file)
  - `rst`: 1 bit reset signal, which sets the counter back to its initial state when triggered.
  
- **Output**: 
  - `blink`: 1 bit output signal that drives the LED, toggling it on and off.

#### Module Body (module instances)
- **Counter**: The module uses a 26-bit **flip-flop-based counter** (`dff counter[26]`), which **increments** its value on each clock cycle. When instantiating the `dff` module, we connect the `clk` and `rst` input signal to the dff's port. This is so that counter’s (dff) state is updated based on the clock (`clk`) and can be reset using the reset signal (`rst`).

#### Module Body (always block: internal logic)
- **Blink Control**: 
  - The **blink** signal is assigned the value of the 25th bit of the counter. This effectively divides the clock by $$2^{25}$$, slowing down the frequency to a human-visible rate for blinking.

{:.note}
Dividing 100 MHz by $$2^{25}$$ results in a frequency of approximately 2.98 Hz, meaning that the signal toggles 3 times per second. Each time the signal toggles, it goes from **on to off** *or* **off to on**. Since this toggle happens 3 times per second, the LED will change its state (on to off, or off to on) at that rate. Therefore, the blink will turn on and off once every 0.67 seconds, with both the on and off states taking about 0.33 seconds each.

- **Incrementing the Counter**: 
  - The counter's value (`counter.d`) is updated by adding 1 to the current value (`counter.q + 1`), causing it to increment on **each** clock cycle.


With this logic, `blinker` module uses a 26-bit counter to divide the clock signal down, and the 25th bit is used to toggle the `blink` output. As the counter increments, the `blink` signal toggles between high and low, creating a blinking effect that can be used to drive an LED.

### The `always` Block: Unlike Sequential Programming

{:.warning-title}
> The always block
> 
> In hardware description languages like Lucid, the **`always` block** represents **continuous and parallel execution**, <span class="orange-bold">unlike</span> traditional sequential programming where instructions are executed one after the other. It is used to define connections and relationships between different signals happening in parallel, rather than executing sequential instructions like in software programming.

In the `blinker` module, the **`always` block** ensures that certain operations happen **simultaneously** on <span class="orange-bold">every clock cycle</span>:
- **`blink = counter.q[25]`** constantly updates the `blink` output to match the 25th bit of the counter.
- **`counter.d = counter.q + 1`** continuously increments the counter by 1 on each clock cycle.
- The counter increments on each clock cycle.
- The blink output is continuously updated based on the 25th bit of the counter.
- Both operations (updating blink and incrementing counter) happen in parallel on every clock edge.
- **No explicit loop is needed—everything updates with the clock signal.**

This is inherently different from sequential programming where instructions are executed in a specific order, one after another. In sequential programming, the logic is executed step-by-step, and you would need an explicit loop to simulate the continuous behavior. Here's the same functionality in Python:

```py
def blinker():
    counter = 0
    blink = 0
    while True:
        blink = (counter >> 25) & 1  # Update blink based on the 25th bit of the counter
        counter += 1  # Increment the counter
        time.sleep(1 / clock_frequency)  # Simulate clock delay
```

In the code above:
* The counter is incremented **manually** in each iteration of the loop.
* The blink value is **recalculated** after every iteration based on the 25th bit of the counter.
* This code runs in a <span class="orange-bold">sequential</span> loop, step by step, with a delay (time.sleep()) to simulate the clock.
* Operations are sequential: first, the counter increments, then the blink value is updated, then the process pauses before repeating.

{:.highlight-title}
> Timing
>
> In hardware, the timing is inherently tied to the clock signal, which runs as long as the circuit is powered. In software, you need to introduce artificial delays (e.g., `time.sleep()`) to mimic clock behavior.


Let's compare that again with Lucid’s/HDL `always` block:
- Both lines of code are evaluated in **parallel** on each clock cycle.
- The operations happen in a **non-blocking** manner, meaning the update of the counter and the assignment to the `blink` output are done concurrently, not one after the other.

*This parallelism is key to understanding how digital logic works—everything inside an FPGA is happening at the same time, driven by the clock, unlike the step-by-step flow of traditional programming.*

### `alchitry_top`

This is the main file that interfaces with the I/O ports. 

```verilog
module alchitry_top (
    input clk,              // 100MHz clock
    input rst_n,            // reset button (active low)
    output led[8],          // 8 user controllable LEDs
    input usb_rx,           // USB->Serial input
    output usb_tx           // USB->Serial output
)
```

The `blinker` module is instantiated here and then connected to `led`, which is the 8 LEDs connected to the side of the Alchitry Au Board. The reset button is also situated there. The input `clk` is powered by the FPGA, defaulted to `100MHz`. 

<img src="{{ site.baseurl }}//docs/Labs/images/lab2/2024-10-23-14-11-25.png"  class="center_seventy no-invert"/>

> You can ignore `usb_rx` and `usb_tx`. You are not required to use them in this course. 


### Simulate
Alchitry Lab V2 offers the feature of **simulation** with a much slower clock (1000Hz) to test your design before spending a few minutes synthesizing it. You can click the Simulate button to view the simulator:

<img src="{{ site.baseurl }}//docs/Labs/images/lab2/2024-10-19-08-52-08.png"  class="center_seventy no-invert"/>

Right now you won't see the LED blinking because the simulation clock **runs** on 1000Hz clock instead of 100MHz. We are dividing 1000Hz clock by $$2^{25}$$, which results in a frequency of  0.0000298 Hz, or about 1 toggle every  33,554  seconds (around 9.32 hours). We need to change the value "25" into something else more suitable for the simulator such as 9 so that it divides the 1000Hz clock by $$2^{9}$$: $$\frac{1000}{2^{9}} = 1.95 Hz$$, or 1 toggle every 0.5 seconds. 

Add this line of code in `blinker.luc`:

```verilog
    always {
        blink = counter.q[$is_sim() ? 9 : 25] // set value conditionally
        counter.d = counter.q + 1
    }
```

This means that we will use the value `25` when we synthesize the code for the FPGA, and the value `9` during simulation. 

You should now see the LED blinks in the simulation: 

<img src="{{ site.baseurl }}/docs/Labs/images/blinker.gif"  class="center_seventy no-invert"/>

## Dynamic Counter Control System

Our goal in this section is to create a Dynamic Counter Control System . Here's its behavior: 
- The dynamic counter system begins counting from 0.
- The counter increases by a set value, which starts at 1 but can be adjusted.
- You can increase or decrease the amount by which the counter increments.
- The **speed** at which the counter adds the value can be controlled, allowing for faster or slower counting.
- The system can be **started**, **paused**, or **reset** at any time, and its behavior can be modified based on user inputs.

Here's some constraints:
1. The counter's value (`SIZE` bits) should be **clamped** to zero and shall not become negative. It should not have positive overflow either. 
2. The counter shouldn't be increased by a value larger than `SIZE-1` or smaller than `-SIZE`

The gif below summarizes the expected output: 

<img src="{{ site.baseurl }}/docs/Labs/images/demo-lab2.gif"  class="center_seventy no-invert"/>

We need the following components to build this counter system:
1. **Adder** (combinational logic device): to compute value of the counter and check for overflow or negative value
2. Several **DFFs** (sequential logic device): to hold the counter, incremeter, and speed control pointer
3. **FSM** (sequential logic device): to control the overall operation of the counter system, including starting, stopping, and adjusting the speed or increment values based on button inputs
4. **Multiplexers** (combinational logic device):  to **select** between different inputs (e.g., choosing when to add or subtract from the incrementer, or when to increase or decrease the counter speed).

{:.higlight}
Each section below elaborates how to do it in Lucid and how to **test** your code in the Simulator. **Create a new project** with **Base Project** as your template. Then follow this guide. 

### Task 1: Adder
An adder unit is a digital circuit used to perform addition of binary numbers. 
- Adders are fundamental building blocks in arithmetic logic units (ALUs), processors, and many other digital systems. 
- They are essential for executing operations such as addition, subtraction (using two's complement), multiplication, and division in digital circuits.
- This adder unit can be set to perform addition or subtraction, and check for overflow or negative value. 

{:.note}
An adder is a **combinational** logic device. This means that its output depends solely on the current inputs, and it does not have any memory or feedback loops.

**Create an adder module in your project.** 
- This module requires a **parameter list**:
  - `SIZE`: determines the size of the adder  
- In the **port list**:
  - Define the inputs: `a` and `b` (`SIZE` bit each),  `subtract` (1 bit, `0` to add, `1` to sub)
  - Define the output: `s` (`SIZE` bit, computing the add/sub output), `v` (1 bit, indicating overflow), `n` (1 bit, indicating negative output)
- In the **module body**:
  - There's no need to instantiate any module
  - Write the adder logic in the `always` block 

#### Hints 

The output `s` should be set to `a+b` or `a-b` depending on the value of `subtract`. You can use the [if-statement](https://alchitry.com/tutorials/lucid-reference/#if) for this. if-statement are equivalent to **multiplexers**. 
- `-` and `+` **operators** are called **expressions** in HDL. 
- More precisely, they are **arithmetic expressions**
- Lucid supports similar expressions to Verilog and common programming languages. Give this [reference guide](https://alchitry.com/tutorials/lucid-reference/#expressions) a read. 

To compute `v`, you should consider how overflow happens:
1. **Positive overflow**: the result `s` is out of range of the positive number
2. **Negative overflow**: the result `s` is out of range of the negative number 

For instance:

```
  // assume SIZE = 4
  a = 4b1000 // -8 
  b = 4b1111 // -1 
  subtract = 0 
```

`s` becomes `4b0111` (7) when it's supposed to be `5b10111` (`-9`). This is **negative overflow**. 

Computing `n` is straightforward: connect it to the MSB of `s`. However, since `s` is an output port of the adder, you can't connect an output port to another output port:

```
  n = s[SIZE-1] // NOT ALLOWED 
```

You can "name" an intermediary signal using the [`sig` type](https://alchitry.com/tutorials/lucid-reference/#types). This is the format:

```verilog
sig sig_name

always {
    sig_name = expression
}
```

For instance, you can do this:

```verilog
sig addition_result[SIZE]

always{
  addition_result = a + b
  s = addition_result
  n = addition_result[SIZE-1]
}
```


{:.important}
The statements are evaluated top-down. This means <span class="orange-bold">lower</span> statements take precedent over higher ones. For more information, read the [reference](https://alchitry.com/tutorials/lucid-reference/#always-blocks) guide on always blocks. 

For example, if you have **accidentally** set `s` to be `0` at the bottom of the always block, it will be set as `0` regardless of what you set above. Remember that the `always` block defines **connections** that are evaluated in **parallel** in each clock cycle.

```verilog
always{
  s = a + b
  // other logic 
  
  s = 0 // s will always be zero 
}
```

### Test With I/O & Simulate

The I/O shield comes with 24 dip switches, 24 io led, 4 7-segment units, and 5 io buttons as follows: 

To access it, add the IO constraints from the component library. Open the component library window: 
<img src="{{ site.baseurl }}//docs/Labs/images/lab2/2024-10-23-13-20-53.png"  class="center_seventy no-invert"/>

Then select the Io constraint: 

<img src="{{ site.baseurl }}//docs/Labs/images/lab2/2025-01-17-16-19-02.png"  class="center_seventy no-invert"/>
Then add the access ports at `alchitry_top`:

```verilog
module alchitry_top (
    input clk,              // 100MHz clock
    input rst_n,            // reset button (active low)
    output led[8],          // 8 user controllable LEDs
    input usb_rx,           // USB->Serial input
    output usb_tx,           // USB->Serial output
    output io_led[3][8],     // LEDs on IO Shield
    output io_segment[8],        // 7-segment LEDs on IO Shield
    output io_select[4],        // Digit select on IO Shield
    input io_button[5],      // 5 buttons on IO Shield
    input io_dip[3][8]       // DIP switches on IO Shield
)
```

What the `.acf` file do is to give a logical name to the FPGA pins so that we can program its behavior. For instance, `B28` is used as an **input** pin with a **pulldown** internal resistor set. This means that if we don't supply a high voltage at pin `B28`, it will register as `0` (digital low). Activating this input requires a high voltage supply, and thus we also call this input as being **active high**. 

<img src="{{ site.baseurl }}//docs/Labs/images/lab2/2025-01-17-16-21-05.png"  class="center_seventy no-invert"/>

The pins without `pulldown` are output pins. You can physically connect this to LED bulbs via the Br Board. <span class="orange-bold">Our Br board has custom schematic</span> that you can find [here](https://natalieagus.github.io/50002/resources#custom-br-board-reference). Here's a copy of it: 

<img src="{{ site.baseurl }}//docs/Labs/images/lab2/2024-10-23-14-50-33.png"  class="center_seventy no-invert"/>

Here's where each LED/button are situated:

<img src="{{ site.baseurl }}/docs/Labs/images/lab2/Screenshot 2024-10-23 at 5.46.23 PM.png"  class="center_seventy no-invert"/>

{:.note-title}
> The 7 Segment
>
> `io_select` uses a hot encoding to select which of the 4 segments to light up, and `io_segment` uses hot encoding to control which of the 8 LEDs within the selected segment are illuminated. This means that only **one** segment can be illuminated at a time. 
> 
> `io_select` rapidly switches between the 4 segments to give the illusion that all segments are illuminated simultaneously, even though only one segment is lit at any given time.

Right now your `alchitry_top` should contain some errors because you have not set the output of the `io_led`, `io_segment`, and `io_select`. Add the following code into the `always` block:

```verilog
  io_led = 3x{ {8h00} }
  io_select = 4hF
  io_segment = 8h00
```


When you press **simulate**, you should see the `io_shield` being shown stacked on top of the fpga. 

With this, you can test your adder. Instantiate an N-bit adder in your alchitry_top:

```
    const SIZE = 8 // set SIZE to any number you want
    adder adder(#SIZE(SIZE))
```

Then connect its I/O in the `always` block:

```
    adder.a = io_dip[0] 
    adder.b = io_dip[1] 
    adder.subtract = io_dip[2][0]
    io_led[0] = adder.s 
    led[2:0] = c{adder.z, adder.v, adder.n} // signal concatenation 
```

When you click simulate, you can manually test the adder using the io dips and observe its output at the io_led and led.

<img src="{{ site.baseurl }}/docs/Labs/images/adder.gif"  class="center_seventy no-invert"/>

{:.note-title}
> Concatenation and Duplication
>
> [Concatenation](https://alchitry.com/tutorials/lucid-reference/#concatenation) provides a way to **merge** two or more arrays. It takes the form `c{ expr1, expr2, ... }` where all `expr` are arrays or bits.
> 
> [Duplication](https://alchitry.com/tutorials/lucid-reference/#duplication) provides a way to **concatenate** a single value **many** times with itself. It takes the form `const_expr x{ expr }` where `const_expr` is a constant expression indicating how many times to duplicate `expr`.
>
> For instance, `io_led = 3x{ {8h00} }` is equivalent to a two dimensional array: `{8h00, 8h00, 8h00}` (3 by 8 bits).


### Task 2: dff 

From our lectures, we learned that A **dff** is a sequential logic circuit that <span class="orange-bold">captures</span> the input value (`d`) on the **rising** edge of the clock and stores it as the output (`q`), <span class="orange-bold">synchronizing</span> the stored value with the clock signal.

{:.note-title}
> Recap 
>
> The **dff** updates its output `q` with the input `d` on **every** rising clock edge.

We need 6 dffs to hold the following value:
1. The **state** of the counter: increase, decrease, faster, slower, or idle 
2. The current value of the counter 
3. The current value of the *increment* (how much to increment the counter with)
4. The speed control pointer (how fast to increment the counter)
5. The state of the slow clock (enabled/disabled)
6. A counter dff (to generate slow clock signal)

The FSM diagram for this machine is roughly as follows. Let's work towards creating it in `alchitry_top.luc`:

<img src="{{ site.baseurl }}/docs/Labs/images/cs-2025-dynamic-counter.drawio.png"  class="center_seventy"/>

{:.note}
You will formally learn about FSM next week during lecture. We shall tap on abstracted FSM knowledge obtained from DDW 10.020 for now. 


#### Generate the Slow Clock Signal 
You should tackle the simplest feature first: to generate the slow clock signal. The FPGA clock is 100MHz, which is too fast for the human eye. We can create a `slow_clock` using two dffs: the slow clock dff and the speed control pointer dff. 

The FPGA clock runs at 100MHz and if we start our counter with this clock, it will increase **too fast** for the human eye to catch. We can create a **slow clock** using two dffs: 
1. `counter` dff: an N bit dff which value is always increased by 1 each time the FPGA clock rises 
2. `speed_pointer` dff: a `log2(N)` bit dff which **points** to certain bit of the `counter` dff, effectively producing a slow clock signal 

This is also known as a **frequency divider**. You have seen this in the **blinker** project. Generate this signal in your project now. You can instantiate the dffs as such in lucid:

```verilog
  sig slow_clock 

  const SIZE = 8 // set SIZE to any value you want
  const SLOW_CLOCK_DEFAULT_SPEED = $is_sim() ? 8 : 28 // put 8  for sim, 28 for hardware

  .clk(clk){
    .rst(rst){
      dff counter[SIZE]
      dff speed_pointer[$clog2(SIZE)](#INIT(SLOW_CLOCK_DEFAULT_SPEED))
    }
  }
```

{:.note}
We use [**connection blocks** ](https://alchitry.com/tutorials/lucid-reference/#connection-blocks)to connect `clk` and `rst` signal required by both dffs. Later in the always body, you should set the `.d` port input of each dff:

```verilog
always{

  counter.d = counter.q + 1 // by default: always increment by 1 
  speed_pointer.d = speed_pointer.q // by default: leave it unchanged

}
```

#### Edge Detector 
You need to pass the `slow_clock` signal through an `edge_detector` so that you will increment/decrement the counter **exactly once** each time the slow clock rises. Alchitry comes with edge detector as a standard component. Add the `edge_detector` under **Pulses**:

<img src="{{ site.baseurl }}//docs/Labs/images/lab2/2024-10-23-13-21-31.png"  class="center_seventy no-invert"/>

You can then use the edge detector as follows:

```verilog
  .clk(clk){
    edge_detector slow_clock_edge(#RISE(1), #FALL(0))
  }

  always{

    slow_clock_edge.in = slow_clock
  
  }
```

#### Toggle the counter 
The next thing to do is to start/stop the counter. Since we use the **toggle** feature (using io button 0 to start and stop), we need to rely on some external value: **slow clock enabled**. This value should be stored in a 1-bit dff. This dff's output then determine whether we shall feed in actual `slow_clock` to the edge detector or a `0` signal (to stop it):

<img src="{{ site.baseurl }}/docs/Labs/images/cs-2025-slow-clock-enable.drawio.png"  class="center_seventy"/>

```verilog

  .clk(clk){
    .rst(rst){
      dff slow_clock_enable(#INIT(0))
    }
  }

  always{

    // default connection
    slow_clock_enable.d = slow_clock_enable.q 

    // this is a mux deciding whether we stop the clock or set it with certain speed 
    case (slow_clock_enable.q){
            0:
                slow_clock_edge.in = 0 // always don't increment or decrement
            1: 
                slow_clock_edge.in =  slow_clock 
            default:
                slow_clock_edge.in = 0
    }

  }
```

{:.note-title}
> Case 
>
> The [case statement](https://alchitry.com/tutorials/lucid-reference/#case) provides a way to cleanly write a group of conditional statements that depend on the value of a single expression. Case statements are also equivalent to **multiplexers**.


### Task 3: FSM 

Up until this point, we have created 3 dffs: `counter`, `speed_pointer` and `slow_clock_enable`. It is now time to create the FSM dff to hold our 8 states. We can use  [`enum`](https://alchitry.com/tutorials/lucid-reference/#enum) in Lucid to name the states conveniently:

```verilog
    enum States {
        RUN,
        STOP,
        FASTER,
        SLOWER,
        INCREASE,
        DECREASE,
        UPDATE,
        IDLE
    }
```

Then we create a 3-bit dff to "hold" these states. While we're at it, create the remaining two dffs that hold the current counter value and the increment value: 

```verilog
  dff states[$width(States)](#INIT(States.IDLE))
  dff current_value[SIZE](#INIT(0))
  dff current_delta[$clog2(SIZE)+1](#INIT(1)) // increment is initially 1, maxed at SIZE
```

In the always block, we can then **decide** what to do depending on `states.q`. For instance, in `States.RUN` and `States.STOP` we change the value of `slow_clock_enable` dff accordingly to start/stop the clock signal entering the edge detector. 

```verilog
always{

  // default: no change in dff values
  // these are placed at the top of the always block, may be overriden later
  states.d = states.q 
  current_delta.d = current_delta.q
  current_value.d = current_value.q

  // other code

  case(states.q){
    States.IDLE:
      // watch out for button presses / slow clock signal, transition to different states accordingly 
      
      // this takes precedence, placed as the first clause
      if (slow_clock_edge.out)
      {
          states.d = States.UPDATE
      }
      else ... (other triggers such as button presses)

    States.UPDATE:
        // simple update, did not consider overflow or negative value
        current_value.d = current_delta.q // adds current_value dff by current_delta
        states.d = States.IDLE   

    States.RUN: 
      slow_clock_enable.d = 1 
      states.d = States.IDLE 

    States.SLOWER: 
        // clamp to 31st bit at max
        if (speed_pointer.q < SIZE-1){
            speed_pointer.d = speed_pointer.q + 1
        }
        states.d = States.IDLE 

    States.DECREASE:
       // simple subtraction, did not consider negative overflow
       current_delta.d = current_delta.q - 1 
       states.d = States.IDLE 

    // other states

  }
}
```

{:.important}
Note how each state always returns to IDLE in the next FPGA clock cycle. This arrangement makes the FSM neat and easy to debug.


### Task 4: Process Button Presses

We <span class="orange-bold">cannot</span> simply do this in the IDLE state:

```verilog

  case(states.q){
    States.IDLE:
      // watch out for button presses / slow clock signal, transition to different states accordingly 
      
      // this takes precedence, placed as the first clause
      if (slow_clock_edge.out)
      {
          states.d = States.UPDATE
      }
      else if(io_button[1]){
        if (~|slow_clock_enable.q){ // if slow_clock is not currently enabled, run
            states.d = States.RUN
        }
        else{
            states.d = States.STOP
        }
      }
      else if(io_button[0]){
        states.d = States.FASTER
      }
      // other clauses 

```

{:.important-title}
> Managing button presses 
> 
> We can't use button presses directly to trigger the FSM because of the significant speed difference between human reactions and the FPGA clock (100 MHz). When a button, such as `io_button[i]`, is pressed, it will remain in the `1` state for many clock cycles, as a typical button press lasts milliseconds, while each clock cycle occurs in nanoseconds. As a result, the FSM will rapidly toggle between states (e.g., between `RUN` and `STOP`) multiple times during a single press, instead of transitioning just once as intended.


We need to use **edge detectors** to detect a down press (falling edge), as well as **button conditioner** to **clean the signal**. 

{:.highlight-title}
> Button Conditioner
> 
> Button Conditioner: This module will synchronize and debounce a button input so that you can reliably tell when it is pressed 

Add **Button Conditioner** component to your project, then use it as follows:

```verilog
  const CLK_FREQ = $is_sim() ? 1000 : 10000000 // put 1000 only for sim, 10M on hardware

  .clk{

      // instantiate 5 edge detectors, one for each button 
      edge_detector io_button_edge[5](#RISE(5x{{1}}), #FALL(5x{{0}}))
      // instantiate 5 conditioners, one for each button
      button_conditioner io_button_cond[5](#CLK_FREQ(5x{{CLK_FREQ}})) 
      
      .rst(rst){
        // other code
      }
  }

  always{

      // condition the io buttons, then take **rising** edges only
      io_button_cond.in = io_button
      io_button_edge.in = io_button_cond.out

  }
```

Now you can use `io_button_edge[i].out` to trigger state transition during the `IDLE` state. Complete your FSM logic for state: `IDLE, STOP, FASTER`, and `INCREASE`. 


### Task 5: Test the simple FSM with I/O 

You can set the `io_led` to see the contents of the `current_value` dff and `current_delta` dff to check if you have set the states correctly:

```verilog
  led = c{slow_clock, 2b0, speed_pointer.q} // led[7] shows the `slow_clock` signal, led[5:0] shows the content of speed_pointer dff
  io_led = {c{2b0,current_delta.q} ,current_value.q[SIZE-1:SIZE-8], current_value.q[7:0]}
```

You should observe the following:
1. `current_value` is increased/decreased by `current_delta` steadily as per `slow_clock` signal when `io_button[1]` is toggled (center io button)
2. When the counter is enabled, pressing  `io_button[0]` (up button) or `io_button[1]` (down button) will increase/decrease the speed of the counter. The value of `speed_pointer` in `led{5:0} should change accordingly 
3. Pressing `io_button[3]` (left button) or `io_button[4]` will increase or decrease the value of `current_delta` accordingly. When enabled, the `current_value` should increase/decrease by `current_delta` 

At this point we have a working dynamic counter but the two constraints are not yet met:
1. The counter's value (`SIZE` bits) should be **clamped** to zero and shall not become negative. It should not have positive overflow either. 
  - This means `current_value` dff should not be made negative, even if we attempt to decrease it
2. The counter shouldn't be increased by a value larger than `SIZE-1` or smaller than `-SIZE`
  - This means `current_delta` dff should not overflow

### Task 6: Incorporate the constraints 

Like any software projects, we should add the constraints only after we get the basic functionality going.

We can utilise the `adder` unit we create earlier to **check** if increasing or decreasing the value of `current_value` and `current_delta` will violate the two constraints above. Here's one example in the state `INCREASE`:

```verilog
    // instantiation
    adder delta_adder(#SIZE($clog2(SIZE)+1))

    // always block 
    States.INCREASE:
        // check overflow
        delta_adder.a = current_delta.q
        delta_adder.b = 1 
        // only update current_delta if it does not overflow
        if(~delta_adder.v){
            current_delta.d = delta_adder.out
        }
        states.d = States.IDLE 
```

#### Sign extension 

You might be tempted to do the following to test if updating `current_value` will result in positive overflow: 

```verilog
  // instantiation
  adder value_adder(#SIZE(SIZE))

  // always block 
  States.UPDATE:
    value_adder.a = current_value.q // current_value is of size SIZE 
    value_adder.b = delta_adder.q // delta_adder is of size $clog2(SIZE)+1 

    // check for overflow and negative value
    if (~adder.n & ~adder.v){
      // update current_value 
      current_value.d = adder.out 
    }
```

However, since the number of bits of `delta_adder` and `current_value` is **not** the same (`log2(SIZE)` vs `SIZE`), you won't have the intended behavior when checking for overflow or negative value. 

For example, if `delta_adder.q` is `-1`: `111` and `current_value.q` is `8h0`, adding the two of them results in: `8h0 + 8h07 = 8h07` which is **not** the desired value of `0 + -1 = -1`. 

{:.highlight}
**Sign extension** is the process of increasing the bit-width of a signed binary number while preserving its value and sign. When extending the bit-width of a number, the most significant bit (MSB), which represents the sign in two's complement representation, is replicated in the new bits. This ensures that the value and sign of the number remain consistent.

For example:
- A 4-bit signed number `1010` (which represents -6 in two's complement) can be sign-extended to 8 bits as `11111010`, keeping the value as -6.

This is crucial when performing arithmetic operations between values of different bit-widths to maintain correctness in signed operations.

You would need to **sign extend** `current_delta`. That is to take the MSB of `current_delta` and extend it to make up to `SIZE` bits, which is the size of `current_value`. You can do this using [**concatenation**](https://alchitry.com/tutorials/lucid-reference/#concatenation) and [**duplication**](https://alchitry.com/tutorials/lucid-reference/#duplication) in Lucid. 

## Checkoff 

You can work as your 1D group and obtain checkoffs from your TA by the stipulated due date (next week). You may demonstrate the simulation over Teams call or in-person. You can also **build** the project and demonstrate it on your FPGA. 

You should demonstrate the following behavior:
1. The counter can be started and stopped at any time 
2. `current_delta` can be increased or decreased, and not overflow 
3. `current_value` will not suffer from positive overflow, and clamped at 0 (will not go negative)
4. You can vary the speed of the counter 

Only 1 rep per group will do for the checkoff, but there will be QnA. Hence, it is up to you if you want to send more people for the checkoff. 

## Bonus: utilizing the 7 Segment 

You can **display** the value of the counter using the 7 segment. The problem is that you need to **convert** the binary value of `current_value` into decimal value.

Alchitry has a component to do this called *Binary to Decimal*. Add this to your project:

<img src="{{ site.baseurl }}//docs/Labs/images/lab2/2024-10-23-23-11-02.png"  class="center_seventy no-invert"/>

We also need a 7 segment controller to **multiplex** it. Create a new file called `multi_seven_seg` with the following content:

```verilog
module multi_seven_seg #(
    DIGITS = 4 : DIGITS > 0,
    DIV = 16 : DIV >= 0
)(
    input clk,                // clock
    input rst,                // reset
    input values[DIGITS][4],  // values to show
    output seg[7],            // LED segments
    output sel[DIGITS]        // Digit select
) {
    
    // number of bits required to store DIGITS-1
    const DIGIT_BITS = $clog2(DIGITS)
    
    .clk(clk), .rst(rst) {
        counter ctr (#DIV(DIV), #SIZE(DIGIT_BITS), #TOP(DIGITS-1)) 
    }
    
    seven_seg seg_dec                        // segment decoder
    decoder digit_dec (#WIDTH(DIGIT_BITS)) // digit decoder
    
    always {
        seg_dec.char = values[ctr.value]    // select the value for the active digit
        seg = seg_dec.segs                  // output the decoded value
        
        digit_dec.in = ctr.value           // decode active digit to one-hot
        sel = digit_dec.out                // output the active digit
    }
}
```

Now we are ready to use it in `alchitry_top`:

```
  const SEVEN_SEG_DIV = $is_sim() ? 3 : 16

  // instantiation
  .clk(clk){
    .rst(rst){
      multi_seven_seg seg(#DIV(SEVEN_SEG_DIV)) 
    }
  }

  bin_to_dec decimal_renderer(#DIGITS(4), #LEADING_ZEROS(1))

  // always block 
  decimal_renderer.value = current_value.q // convert the binary output to decimal value 
  seg.values = decimal_renderer.digits // plug the decimal digits into 7seg controller
  
  io_segment = ~seg.seg
  io_select = ~seg.sel
```

## Summary 

The goal of this lab is to give you an overview of crucial Lucid syntaxes. It is important that you give the [reference](https://alchitry.com/tutorials/lucid-reference/) guide a read yourself, and read the components library for more samples. 

Here's what we have covered in this lab thus far:  
1. Basic Alchitry lab **navigation**: creating a new project, adding components, running simulation 
2. Module structure: **parameters**, module **body** (instantiation), and `always` block (logic implementation)
3. How`always` block works in HDL
4. Accessing **I/O**  via `alchitry_top`
5. **Constraint** file: purpose and relationship with the I/O pins 
   1. Understanding active `low` (`pullup`) vs active `high` (`pulldown`)
6. Creating a **basic** module: adder (combinational logic device). In doing this, we learn a few things about Lucid's syntax:
   1. **Parameter** type: `SIZE` for the adder 
   2. **`sig` type**
   3. Statement **evaluation** in Lucid: **top-down **
   4. Array **concatenation** and **duplication**
7. Creating and using `dff` 
8. Slowing down the default 100 MHz FPGA clock by creating a **frequency divider**: a basic counter `dff` and a speed pointer `dff` 
   1. FPGA Clock (100MHz) and Simulation Clock (1000Hz) is different
9.  Instantiating several modules at once with **connection blocks**
10. Implementing **multiplexers** using **if**-statement or **case**-statement
11. Creating FSM using `enum` and `dff` (sequential logic device) 
12. Using **inbuilt** functions: `$clog2()`, `$is_sim()`, `$width()`
13. Cleaning up button press signals using `button_conditioner` and `edge_detector` components
14. Using inbuilt 7-segment 

Ensure that you revisit this lab if any of the points above still sound unfamiliar to you. Afterwards, you <span class="orange-bold">need</span> to give [these tutorials (made by the original author)](https://alchitry.com/tutorials/) a read and try on your own time. Consult your instructor/TAs if you have any enquiries. It is imperative that you start early and not let your doubts snowball! 

