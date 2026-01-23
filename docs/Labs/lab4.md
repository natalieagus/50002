---
layout: default
permalink: /lab/lab4
title: Lab 4 - Control Sequencing
description: Lab 4 handout covering topics from FSM and Datapath
parent: Labs
nav_order:  6
---

* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design
<br>

# Lab 4: Control Sequencing
{: .no_toc}

### Objectives

By the end of this lab, we should be able to:
* Explain how an FSM acts as a **controller** that issues sequencing decisions to a datapath.
* Separate a hardware design cleanly into **datapath** (storage, operations, comparison) and **controller** (state transitions and control signals).
* Describe why a self-checking tester requires registered inputs, pipelined expected outputs, and synchronised control.
* **Implement** a multi-state FSM in Lucid with correct state encoding, output logic and next-state logic.
* Use a `slow clock`, `edge detector`, and `button conditioner` to **control** transitions cleanly on hardware.
* Build an automated tester that increments test cases, samples inputs over multiple cycles, compares pipelined outputs, halts on mismatch, and restarts reliably via a button press.

### Submission
Complete the Lab 4 **checkoff** (2%) with your Cohort TA before the end of next Friday, 6PM (unless otherwise stated). You should demonstrate the required task under the [Checkoff](#checkoff) section below. Unlike the previous labs, from this lab onwards, the checkoff is assessed **AS A GROUP** as it requires the FPGA hardware. 

Complete **questionnaire** on eDimension as well (2%).


### Starter Code
There's no starter code for this lab. You simply need to have [Alchitry Labs V2](https://alchitry.com/alchitry-labs/) installed. You will also need **Vivado** for this lab. Refer to the [installation](https://natalieagus.github.io/50002/fpga/installation) guideline if you have not read them.


### Related Class Materials
The lecture notes on **[FSM](https://natalieagus.github.io/50002/notes/fsm)** and [Turing Machine](https://natalieagus.github.io/50002/notes/turingmachine)  are closely related to this lab.

| Lecture notes topic                                                                            | Lab 4 part                                                                                                                                  |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **FSM formal model**: states, transitions, Moore vs Mealy, state registers, next-state logic   | Implementing the tester FSM (`IDLE`, `INIT`, `WAIT_1`, `WAIT_2`, `CHECK`, `HALT`) with a `state` DFF and case-based transitions             |
| **FSM as “control logic” separate from datapath**                                              | Using control signals (`index_load_zero`, `index_inc`, `sample_enable`, `running`) to drive datapath behaviour each slow-clock tick         |
| **Deriving control outputs from state**                                                        | Writing deterministic control actions under each state bubble: initialise, feed, wait, compare, halt                                        |
| **Recognising the need for timing boundaries**                                                 | Understanding why sampling `(a, b)` and capturing `s` require two distinct WAIT cycles, not one                                             |
| **FSM responsiveness and clocking discipline**: synchronous inputs, metastability, debouncing  | Using `button_conditioner` and `edge_detector` so button presses become single clean events; ensuring transitions wait for slow-clock edges |
| **Transition conditions from datapath signals** (`equal`, `last_index`, error flags)           | Wiring comparator output and index-boundary logic into the FSM to decide when to increment or halt                                          |
| **Turing Machine conceptual link**: sequencing through symbolic steps with a simple controller | Mapping “control of a procedure” to the hardware tester sequence: initialise >> feed >> delay >> check >> branch (continue or halt)             |
| **Finite programs encoded as state graphs**                                                    | Designing the 7-state “hardware program” that steps through test vectors and terminates on mismatch                                         |
| **Modular design principles**: keep computation inside datapath, keep sequencing in controller | Datapath contains the RCA, pipeline registers, ROM arrays, comparator; the FSM never performs arithmetic, only drives control wires         |
| **Hazards from asynchronous events**                                                           | Explaining why raw button signals break the FSM and why conditioning + edge detection is required                                           |

## Control Sequencing with Finite State Machines

Up to Lab 3, most of the circuits you built were data driven:
* You wired an adder to some inputs
* You added registers so values update on each clock
* You used a **testbench** to supply the inputs and read the outputs

In this lab, you will add a small controller whose job is to decide: *“What should the circuit do on this clock tick?”*

{:.highlight}
> This kind of controller is none other than a **Finite State Machine (FSM)**.

### Automated Registered Adder Tester (Hardware)

We shall turn the FPGA hardware into a small **self-checking tester** for your adder. **This is related to 1D Checkoff 1**, where you are required to build an automated tester for your ALU, a crucial part of your 1D project. 

Instead of manually choosing `a` and `b` via DIP switches, we will *automatically*:

1. Store a fixed list of test vectors in **constant arrays**.
2. Use a small **index register** to step through them one by one.
3. Drive your adder automatically with these vectors.
4. Compare the adder’s output with the expected sum.
5. Show `a`, `b`, and `s` on the LEDs, plus an “error” indicator.
6. Artificially induce errors via the dip switches
7. Stop the tester when an "error" is encountered.

{:.highlight}
This is the same idea as a [testbench](#testbench), but running on real hardware.

We will separate the **datapath** (the hardware that carries data, which is your implementation of the adder itself) from the **controller** (the FSM that decides what to do each cycle).


### What are we actually controlling?

{:.highlight}
We are controlling a tester module automatically with an FSM.

At a high level, the FSM controller is in charge of **WHEN** the **tester** moves and **WHAT** it does on each slow clock tick. You can think of it as answering **three** questions:

1. **Which test case are we on right now**?
   - Use an `index` register and the test vector arrays.
2. **When do we take a new test vector into the pipeline**?
   - Use a `sample_enable` signal that tells the registered adder and expected sum pipeline to capture new inputs.
3. **When do we stop and report failure**?
   - Use an `error_flag` and the decision to enter the `HALT` state.


There are two components to a controller: the *datapath* and the *control unit* (FSM, containing the *states*). Here's the big picture:

<img src="{{ site.baseurl }}/docs/Labs/images/cs-2026-50002-datapath-fsm.drawio.png"  class="center_seventy"/>

## Datapath
Before thinking about the controller and how many states it should have + logic, it helps to be very explicit about the **datapath** (hardware) that the controller (FSM) will drive. The datapath for this **automated tester** we are building should contain:

1. **Registered Adder Block** (you can use either with or without write enable)
   * Your `registered_rca` that takes `a[7:0]`, `b[7:0]` and produces a registered sum `s[7:0]`.
   * Internally, it already has:
     * Input registers for `a` and `b`.
     * A combinational RCA.
     * An output register for `s`

2. **Test Vector Storage (ROM-like constants)**
   * Three constant arrays:
     * `A_INPUTS[i]` – list of `a` test values.
     * `B_INPUTS[i]` – list of `b` test values.
     * `SUMS[i]` – expected sums `A_INPUTS[i] + B_INPUTS[i]`.
   * These behave like a tiny read-only memory indexed by a **test index**.

3. **Test Index Register**
   * A `dff` called `index` that stores which test case we are currently running.
   * Width is `log2(N)` bits if you have `N` test vectors.
   * The controller can:
     * Reset `index` to 0.
     * Increment `index` by 1, with wraparound at `N`.

4. **Expected Sum Pipeline**
   * From Lab 3, you should already know that since the adder output `s` is registered, there is a latency between:
     * When a new `(a, b)` is applied, and
     * When the corresponding `s` becomes valid.
   * To compare fairly, the expected sum must go through the **same number of register stages** as the real sum.

5. **Comparator and Error Flag**
   * A combinational comparator that checks `s == expected_s`.
   * This comparator outputs an  flag that is `1` if `s != expected_s`.

6. You should also have a **forced error mask** driven by a DIP switch, which flips one bit of the adder output before comparison, so that you can demonstrate that the tester *is actually checking something*.

7. **LED Outputs** (optional, good for debugging)
   * `io_led[0]` shows the current `s` test value.
   * `io_led[1]` shows the current adder's sum `s` value.
   * A dedicated LED shows `error_flag`, etc


The datapath should also receive a regular hardware clock (100Mhz) and *not* run on a human-visible slow clock. 

{:.important-title}
> Datapath big idea
> 
> If you change the control strategy, the datapath can stay exactly the same. **That is the point of this lab.**

{:.highlight}
You should be able to draw the datapath of the system above. Try it on your own. Alternatively, you can see the proposed datapath in the [appendix](#proposed-datapath). 



## FSM controller

Now we give this datapath a small **finite state controller**. 

This controller is the *brain* of the tester: 
- It outputs <span class="orange-bold">control signals</span> that **decide** what each part of the datapath does on each clock. 
- It should receive `slow_clock` signal as input to indicate when we should change state, and button presses from user such as `start_button`, etc.

From the FSM notes, recall that the controller itself can be implemented as a Moore-style machine:
* It has a **state register** that stores the current state encoded in a few bits.
* It looks at some input flags from the datapath and decide what to do.
* It produces control outputs that **drive** the datapath.

{:.note}
Transition condition is written at the arrows (**inputs**), and the **output** signals at each state is written below the state bubble. The start state in the diagram below is `IDLE`.

A natural set of states for this automated tester is:

<img src="{{ site.baseurl }}/docs/Labs/images/cs-2026-50002-fsm.drawio-2.png"  class="center_full"/>

You can think of this as a tiny “hardware program” with 7 instructions: `IDLE`, `INIT`, `INC`, `WAIT_1`, `WAIT_2`, `CHECK`, and `HALT`.

{:.note}
The output signals written under each bubble is called **control** signals: they control and drive the datapath. Think of it like a *train conductor's action*. The datapath is the *railway system*, it's already built and all rails are already there. The conductor's brain (FSM) decide what to do and their action is translated into *control signals* that drive the **train** (data).

## Control Signals

{:.highlight}
These are the <span class="orange-bold">wires that cross the boundary</span> between the FSM controller and the datapath hardware described earlier.

Each **control signal** answers a very concrete question like:

* Should I advance to the next test vector now?
* Should the adder sample new inputs this cycle?
* Should I restart the tester?

We group them by the datapath component they talk to as defined in the [datapath section](#datapath) above.

### Control signals for the test index register

From the datapath we have:

{:.new-title}
> **Test Index Register**
> 
> A `dff` called `index` that stores which test case we are currently running. The controller can reset `index` to `0` and increment it with wraparound.

To do this, the FSM should output two control signals:

* `index_load_zero`: *connects to the `index` register next-value logic*
  * When `1` for a cycle, the next value of `index` becomes `0`.
  * Used in `INIT` to “start from test 0”.

* `index_inc`: *also connects to the `index` next-value logic*
  * When `1` for a cycle, the next value of `index` becomes `index + 1` (with wraparound if needed).
  * Used in `CHECK` when a test passes and we want to move on.

**Inside the datapath**, we will typically implement a small **mux** to implement this `if-else` logic. The FSM never touches `index` directly. It only set `index_load_zero` and `index_inc`.

### Control signals for the registered adder and expected sum pipeline

From the datapath we have:

{:.highlight}
> **Registered Adder Block**: `registered_rca` with internal input and output registers.
> 
> **Expected Sum Pipeline**: must advance in sync with the adder.

Both should take a **NEW** test vector at the same time. The controller (fsm) needs to produce one:

* `sample_enable`: *connects to the `enable` input of `registered_rca`, and you can also use it as the write enable for the expected sum pipeline*
  * When `1`, on the next `clk` edge:
    * The adder registers produces *new* `a` and `b` from `A_INPUTS[index]` and `B_INPUTS[index]`.
    * The expected sum pipeline produces *previous* `SUMS[index]`.
  * When `0`, both keep their **current** values.
  * It is important to keep `sample_enable` `1` for TWO cycles (which is what `WAIT_1` and `WAIT_2` states are doing)
  * In `WAIT_1`, the `a` and `b` registers sample the test values
  * In `WAIT_2`, the `s` registers sample the adder's sum output


### Control for “running” or “halt” status

From the FSM diagram:

{:.highlight}
> `HALT` keeps the failing case frozen and ignores further clock ticks.

You can make this explicit with a simple flag that can be routed to the LED so user knows whether the tester is *running* or not:

* `running`: *can be used to gate some datapath activity or to drive a status LED.*
  * `running = 1` in `INC`, `WAIT_1/2`, `CHECK`.
  * `running = 0` in `HALT`, `IDLE`, `INIT`.

You are free to use `running` in different ways:
* As a signal to a status LED so humans can see “tester is alive”.
* As an extra condition on some control:
  * `index_inc_effective = running && index_inc`
  * `sample_enable_effective = running && sample_enable`


### Inputs to the FSM from the datapath or top module

These are self-explanatory. They are the inputs that trigger FSM transitions.
* `rst`
  * Comes from the global reset button.
  * Typically resets both FSM state and datapath registers.

* `equal`
  * Comes from the comparator that checks the **possibly masked** `s` against `expected_s`.
  * `equal = 1` means “this test case passed”.

* `last_index`
  * Comes from simple logic on the `index` register:
    ```verilog
    last_index = (index.q == N-1);
    ```
  * Lets the FSM decide how to behave at the end of the test list (wrap around, stop on success, etc).
* `clk` and `slow_clock`
  * To transition states accordingly
  
* `start_press`
  * Remember to have button presses conditioned + passed through rising edge detector before used as FSM transition (see later sections for more information)

### Summary 

* The **datapath** has:

  * Registers: `index`, `a`, `b`, `s`, and expected sum pipeline
  * Combinational logic: ROM-like arrays, RCA, comparator, small muxes.

* The **FSM controller** has:

  * A state register that stores seven states: `IDLE`, `INIT`, `FEED`, `WAIT_1`, `WAIT_2`, `CHECK`, `HALT`.
  * Next-state logic that uses `rst`, `equal`, `last_index`, `slow_clock`, and `clk`
  * Output logic that produces the control signals:
    * `index_load_zero`
    * `index_inc`
    * `sample_enable`
    * `error`
    * `running`

The control signals live exactly *on those arrows* from the FSM block to the datapath block in the [diagram](#fsm-controller). They are the “verbs” that make the datapath “do something” every slow clock tick.

## Implementing an FSM in HDL

Implementing an FSM in HDL is pretty straightforward: you use a `dff` that holds your states and depending on **status** flags, decide whether to go to the next state or not.

Here's a simple implementation.

### List out the states

You can use [`enum`](https://alchitry.com/tutorials/lucid-reference/#enum) in Lucid to encode each state. 
```verilog
    enum States {
        START,
        LOOP, 
        CHECK_RESULT, 
        HALT
    }
```

They will be auto computed as `b00, b01, b10, b11`.

### Create the state `dff`

{:.note-title}
> The `$width` function and `$clog2` function
> 
> The `$width` function can be used on an `enum` to get the **minimum** number of bits to store a state value. If you have 8 states, then `$width(States)` returns `3`. Alternatively, you can use `$clog2(NUM_STATES)` if you know `NUM_STATES` from the start.



```verilog
    dff states[$width(States)](#INIT(States.START), .clk(clk), .rst(rst))
```

### Write the FSM logic

In the `always` body, all you need to do is to use the `case` statement to set the value of the `state dff` in the **next** cycle based on `status` flags, and produce outputs accordingly.

You can implement any logic you want in each state, but best if you stick to if-else or boolean logic so as not to blow up your design. Here's an example of a simple FSM with 4 states, that increment some `index` register 3 times before going to `HALT`.

It has two outputs: 8-bit `led_indicator` and 2-bit `index_value` that determines the transition logic (whether to continue `LOOP` or `HALT`):


```verilog
module simple_fsm (
    input clk,  // clock
    input rst,  // reset
    output led_indicator[8],
    output index_value[2]
) {
    
    enum States {
        START,
        LOOP, 
        CHECK_RESULT, 
        HALT
    }
    
    dff states[$width(States)](#INIT(States.START), .clk(clk), .rst(rst))
    dff index[2](.clk(clk), .rst(rst), #INIT(0))
    always {
        index_value = index.q
        states.d = states.q
        index.d = index.q
        led_indicator = 0
        
        case(states.q){
            States.START:
                led_indicator = 8h01
                index.d = 0
                states.d = States.LOOP
            
            States.LOOP:
                led_indicator = 8h0F
                index.d = index.q + 1
                states.d = States.CHECK_RESULT
            
            States.CHECK_RESULT:
                led_indicator = 8hF0
                if (~|(index.q ^ b10)){
                    states.d = States.HALT
                }
                else{
                    states.d = States.LOOP
                }
                
            States.HALT:
                led_indicator = 8hFF
              
        }
    }
}
```

For more examples, you're encouraged to read this [Alchitry official tutorial](https://alchitry.com/tutorials/roms-and-fsms/).

{:.note}
> Curb the urge to overcomplicate things. 
> 
> An FSM is **super simple**: you only need a `state dff` and a whole bunch of `case` statements. Within the `case` statement, you should specify ALL output signals. 
> 
> Ideally, you should have minimal logic within the FSM `cases`, that is: <span class="orange-bold">avoid</span> the urge to perform complex arithmetic operations like addition and multiplication there. This should be done in the datapath. You will learn more about this in the following weeks.

### Test the FSM in Simulator

If you utilise the FSM as such, with onboard clock:

```verilog
    // alchitry_top
    simple_fsm simple_fsm(.clk(clk),.rst(rst))


    always{
        // other code

        io_led[0] = simple_fsm.led_indicator
        io_led[1] = simple_fsm.index_value
    }
```

You will notice that the FSM runs so fast that it `HALT`s *immediately*:

<img src="{{ site.baseurl }}/docs/Labs/images/Screen Recording 2025-12-03 at 8.32.21 AM.gif"  class="center_seventy no-invert"/>

This is because the `clk` supplied is at `1000Hz` in the simulator, which is way TOO FAST for human eye to see. You need to **slow down** the fsm's clock considerably to be able to view the state transition manually.

### Slowing down the FSM clock

There are TWO ways to do this:
1. Supply `slow_clock` signal (from `counter`) to the `.clk` port of `simple_fsm`, OR
2. Add `slow_clock` signal as `input` to the `simple_fsm` and perform transition or modification of ANY `dff` ONLY if `slow_clock` is 1

We will present BOTH ways to you and the pros and cons of each.

#### Method 1: use `slow_clock` as `.clk` that drives the FSM

```verilog
    counter slow_clock(
        #DIV(9),
        .clk(clk),
        .rst(rst))
    
    simple_fsm simple_fsm(.clk(slow_clock.value),.rst(rst))

```

**Pros**: You can see the state transitions well, with minimal mental gymnastics to implement.

**<span class="orange-bold">Cons</span>**: You lose the global reset [for this reason](https://natalieagus.github.io/50002/fpga/fpga_1_2024) and you basically make your FSM *unresponsive* by running on such a **SLOW** clock.

<img src="{{ site.baseurl }}/docs/Labs/images/Screen Recording 2025-12-03 at 8.37.21 AM.gif"  class="center_seventy no-invert"/>

**Workaround**: If you'd like to reset the `simple_fsm`, you need to pass it as an input signal that you check at the end of your always block.

```verilog
    // simple_fsm
    module simple_fsm (
        ...
        input manual_reset, 
    ) {
        // instances

        always
        {
            // FSM cases

            // place this at the end to take precedence
            if (manual_reset){
                states.d = States.START
                index.d = 0
            }

        }
    }

    // alchitry_top
    simple_fsm simple_fsm(
        .clk(slow_clock.value),
        .rst(rst),
        .manual_reset(io_button[0])) // link to a button
```

You would have to <span class="orange-bold">press and hold</span> `io_button[0]` for at least of 1 `slow_clock` period to reset (the FSM *feels* unresponsive):

<img src="{{ site.baseurl }}/docs/Labs/images/Screen Recording 2025-12-03 at 8.43.18 AM.gif"  class="center_seventy no-invert"/>

{:.highlight}
The `io_button[0]` manual reset signal should be valid across *rising edge* of `slow_clock` signal to be captured and propagated to `simple_fsm`. Otherwise, if it is only valid briefly in-between rising `slow_clock` edges, then it will be ignored. This is the behavior of sequential logic.


#### Method 2: use `slow_clock` with `edge_detector` as `input` to the FSM

{:.highlight}
This method is your instructors' **preferred** way, but it has way higher learning curve to master.

In this method, we run `simple_fsm` with the original `clk` signal, but add conditional logic to **transition** within each case only when `slow_clock` <span class="orange-bold">edge</span> is `1`. This way our FSM remains *responsive* and only conditionally transition when `slow_clock` is `1`.

{:.highlight}
To do this, we need to pass `slow_clock` signal through an edge detector. Do you know *why*?


{:.note-title}
> Edge detector
>
> An edge detector produces a valid `1` when detecting a rising edge of its input signal for as long as one `clk` period.

This diagram illustrates the concept:
- Whenever the `slow_clock` signal turns from `0` to `1` (pink highlight),
- The edge detector will output a `1` for as long as `1` `clk` period in the next nearest one (blue highlight)

<img src="{{ site.baseurl }}/docs/Labs/images/cs-2026-50002-edge detector.drawio-3.png"  class="center_seventy"/>

{:.important-title}
> Race Condition
>
> Notice how in the diagram above, for illustration purposes, we show that the slow clock produces a `1` in clk cycle `t` and edge detector produces a `1` in the **same** cycle `t`. This behavior might differ depending on the simulator use and might behave differently in hardware as well. This is called a **race condition**.
> 
> A synchronous FF samples its input at the clock edge. If you also change the input at the exact same edge in simulation, you are modeling an impossible or undefined physical situation (setup/hold violation). In real hardware this is not a clean “either-or”, it can produce metastability. In simulation it shows up as nondeterminism based on event ordering.
>
> In short, the edge detector might produce a `1` in this clock cycle `t` or at cycle `t+1`. However, since the onboard clk runs really fast, it won't affect the usability of your hardware. It's a minor difference of whether the button press is detected in *this* cycle or the next.        

Add this component to your project:
<img src="{{ site.baseurl }}//docs/Labs/images/lab4/2025-12-03-08-47-49.png"  class="center_seventy no-invert"/>

Then instantiate it in your `simple_fsm`, and use it in each of the `case` logic to allow transition + permanent `dff` changes ONLY when `slow_clock` is `1`.

```verilog
// simple_fsm
module simple_fsm (
    // other ports
    input slow_clock
) {
    
    edge_detector rising_edge(.clk(clk),.in(slow_clock),#RISE(1),#FALL(0))
}

always {
        // other code

        case(states.q){
        States.START:
            led_indicator = 8h01
            index.d = 0
            if (rising_edge.out)
                states.d = States.LOOP
        
        States.LOOP:
            led_indicator = 8h0F
            
            if (rising_edge.out){
                index.d = index.q + 1 // this should be inside the if-clause, it can't be outside
                states.d = States.CHECK_RESULT
            }
                
        
        States.CHECK_RESULT:
            led_indicator = 8hF0
            if (~|(index.q ^ b10)){
                if (rising_edge.out)
                    states.d = States.HALT
            }
            else{
                if (rising_edge.out)
                    states.d = States.LOOP
            }
            
        States.HALT:
            led_indicator = 8hFF        
            
    }

}
```

Then use it as such:

```verilog
// alchitry_top
simple_fsm simple_fsm(.clk(clk),.slow_clock(slow_clock.value),.rst(rst))
```

This way, your global reset still works (and is responsive! No more press and hold to reset), but you end up with lots of **inevitable boilerplate**: repeatedly checking (`if rising_edge.out)` in each case where `dff` assignment happens.

<img src="{{ site.baseurl }}/docs/Labs/images/Screen Recording 2025-12-03 at 9.06.30 AM.gif"  class="center_seventy no-invert"/>

Conceptually, you allow the FSM to **REMAIN IN STATE**, until `rising_edge.out == 1`. For instance:
- the FSM would stay at state `LOOP` and the `led_indicator` shows `8h0F`. It is actually "looping" at every `clk` cycle, that is the value of `dff` state is repeatedly written as `States.LOOP`
- When `rising_edge.out == 1`, we woudl finally write a different value into `states` dff and `index` dff, allowing the fsm to "advance" at that exact moment
- the FSM is actually still "**responsive**", running at `clk` frequency

This is inherently <span class="orange-bold">different</span> from method 1, where you slow down the entire FSM with `slow_clock`, rendering it  rather *unresponsive* as it will only be able to *detect* input (like the `manual_reset` button) if its held long enough, roughly covering one period of `slow_clock`.

### Common mistakes when dealing with FSM clock

#### Mistake 1: tried to "refactor" by moving the if-clause out of the cases

This mistake is very *subtle*, and you will only realise that you lose certain functionalities **if** you try to incorporate some button presses.

Take a look at this example and try it out:

```verilog
module simple_fsm (
    input clk,  // clock
    input rst,  // reset
    input slow_clock,
    output led_indicator[8],
    output index_value[2]
) {
    
    enum States {
        START,
        LOOP, 
        CHECK_RESULT, 
        HALT
    }
    
    dff states[$width(States)](#INIT(States.START), .clk(clk), .rst(rst))
    dff index[2](.clk(clk), .rst(rst), #INIT(0))
    
    edge_detector rising_edge(.clk(clk),.in(slow_clock),#RISE(1),#FALL(0))

    always {
        index_value = index.q
        states.d = states.q
        index.d = index.q
        led_indicator = 0

        if(rising_edge.out){    // this can be disastrous
            case(states.q){
                States.START:
                    led_indicator = 8h01
                    index.d = 0
                    states.d = States.LOOP
                    
                States.LOOP:
                    led_indicator = 8h0F
                    index.d = index.q + 1
                    states.d = States.CHECK_RESULT
                    
                States.CHECK_RESULT:
                    led_indicator = 8hF0
                    if (~|(index.q ^ b10)){
                        states.d = States.HALT
                    }
                    else{
                        states.d = States.LOOP
                    }
                    
                States.HALT:
                    led_indicator = 8hFF
            }
        }
        
        
        
    }
}
```

Observation:
- It seems like the fsm runs but you lose your status `led_indicator` (seemingly)
- Global reset works (makes sense, because you are using global clock still)

<img src="{{ site.baseurl }}/docs/Labs/images/Screen Recording 2025-12-03 at 9.25.42 AM.gif"  class="center_seventy no-invert"/>

The problem becomes worse if you try to add "interaction" to the FSM, for instance, a START button that results in transition from `HALT` to `START` **once** per press.

{:.important}
Typically, we send interactive button presses through an **edge detector** so that each physical press produces a <span class="orange-bold">single</span>, one-cycle pulse. This lets the circuit respond to the moment the button is pressed, *rather than the entire time it is held down*, so a held button does not **retrigger** the action on every clock cycle.

```verilog
// simple_fsm
module simple_fsm (
    input clk,  // clock
    input rst,  // reset
    input slow_clock,
    input start,
    output led_indicator[8],
    output index_value[2]
) {
    
    enum States {
        START,
        LOOP, 
        CHECK_RESULT, 
        HALT
    }
    
    dff states[$width(States)](#INIT(States.START), .clk(clk), .rst(rst))
    dff index[2](.clk(clk), .rst(rst), #INIT(0))
    
    edge_detector rising_edge(.clk(clk),.in(slow_clock),#RISE(1),#FALL(0))
    edge_detector rising_edge_start(.clk(clk), .in(start), #RISE(1), #FALL(0))
    always {
        index_value = index.q
        states.d = states.q
        index.d = index.q
        led_indicator = 0

        if(rising_edge.out){        // this might be disastrous
            case(states.q){
                States.START:
                    led_indicator = 8h01
                    index.d = 0
                    states.d = States.LOOP
                    
                States.LOOP:
                    led_indicator = 8h0F
                    index.d = index.q + 1
                    states.d = States.CHECK_RESULT
                    
                States.CHECK_RESULT:
                    led_indicator = 8hF0
                    if (~|(index.q ^ b10)){
                        states.d = States.HALT
                    }
                    else{
                        states.d = States.LOOP
                    }
                    
                States.HALT:
                    led_indicator = 8hFF
                    if(rising_edge_start.out){ // this might go undetected
                        index.d = 0
                        states.d = States.START
                    }
            }
        }
        
        
        
    }
}
```

Use it as such:
```
// alchitry_top
simple_fsm simple_fsm(.clk(clk),.slow_clock(slow_clock.value),.rst(rst),.start(io_button[1]))
```

The logic might seem "right" but it won't even work. Towards the end of the gif below, we show what the "correct behavior" should be:
1. The "start" button triggers transition from `HALT` to `START` only, not from other states to `START`
2. Global reset works as per normal
3. This happens because we move back the `if` (slow clock edge rise detected) clause within each `case` and utilise a **button conditioner** (see [later](#button-conditioner) section)

<img src="{{ site.baseurl }}/docs/Labs/images/Screen Recording 2025-12-03 at 9.38.52 AM.gif"  class="center_seventy no-invert"/>


{:.new-title}
> Checkoff
>
> Why is this so? Figure it out as a team. This might be one of the checkoff questions asked by your TA. 


#### Mistake 2: not using an edge detector

Try this code and notice that we NEVER have this transition: `CHECK_RESULT` to `LOOP` as `index_register` seemingly goes straight from `0` to `2` (skipping `1`).

```verilog 
// simple_fsm
module simple_fsm (
    input clk,  // clock
    input rst,  // reset
    input slow_clock,
    output led_indicator[8],
    output index_value[2]
) {
    
    enum States {
        START,
        LOOP, 
        CHECK_RESULT, 
        HALT
    }
    
    dff states[$width(States)](#INIT(States.START), .clk(clk), .rst(rst))
    dff index[2](.clk(clk), .rst(rst), #INIT(0))

    always {
        index_value = index.q
        states.d = states.q
        index.d = index.q
        led_indicator = 0
        
        case(states.q){
            States.START:
                led_indicator = 8h01
                index.d = 0
                if (slow_clock)
                    states.d = States.LOOP
            
            States.LOOP:
                led_indicator = 8h0F
                
                if (slow_clock){
                    index.d = index.q + 1
                    states.d = States.CHECK_RESULT
                }
                    
            
            States.CHECK_RESULT:
                led_indicator = 8hF0
                if (~|(index.q ^ b10)){
                    if (slow_clock)
                        states.d = States.HALT
                }
                else{
                    if (slow_clock)
                        states.d = States.LOOP
                }
                
            States.HALT:
                led_indicator = 8hFF
              
        }
        

    }
}
```

<img src="{{ site.baseurl }}/docs/Labs/images/Screen Recording 2025-12-03 at 9.16.44 AM.gif"  class="center_seventy no-invert"/>


{:.new-title}
> Checkoff
>
> Why is this so? Figure it out as a team. This might be one of the checkoff questions asked by your TA.

## Processing Button Presses

This is the final piece of knowledge required to operate your FSM controller.

{:.important-title}
> Managing button presses 
> 
> We can't use button presses directly to trigger the FSM because of the significant speed difference between human reactions and the onboard FPGA clock `clk` (100 MHz on hardware, 1000Hz on simulator). 
> 
> When a button, such as `io_button[i]`, is pressed, it will remain in the `1` state for <span class="orange-bold">MANY</span> default `clk` cycles, as a typical button press lasts milliseconds, while each clock cycle occurs in nanoseconds. 
> 
> As a result, the FSM *might* rapidly toggle between states multiple times during a single press, instead of transitioning just once-per-press as intended.


In video games, this has the same logic:
- You would detect a jump trigger (press space once)
- Then your character will jump exactly once
- If you continue holding space, no further jump is made

It is **almost always** the case to use an `edge_detector` (rising/falling, depending on which press you are detecting, down or release) **AND** a `button_conditioner` to make button presses works properly for FSM driven by the regular `clk`.


### Button Conditioner

{:.highlight-title}
> Button Conditioner
> 
> Button Conditioner: This module will synchronize and debounce a button input so that you can reliably tell when it is pressed 

When you connect a **physical** pushbutton directly to your FPGA, the signal you see on the input pin is *not* a clean, single transition from `0` to `1`. Two big problems show up:

1. **Mechanical bounce**: When you **press** or **release** the button, the contacts literally bounce for a few milliseconds. Electrically, this looks like a **fast** sequence of `0` → `1` → `0` → `1` → `0` before it finally settles. If you sample this with a fast clock, your circuit thinks you pressed the button **many** times.

2. **Asynchronous to the clock**: The button is controlled by a *human*, so it changes value at arbitrary times relative to the FPGA clock and might not fulfil `tsetup` and `thold`. If you feed that straight into sequential logic, you can get **metastability** and **unpredictable** behaviour.

Here's a simplified illustration:

<img src="{{ site.baseurl }}/docs/Labs/images/cs-2026-50002-button-cond-ori.drawio.png"  class="center_seventy"/>

The raw signal typically has:
* Long low level (0)
* Around the press moment, several fast 0/1 transitions before it settles high
* Long high level (1) while the button is held
* Around the release moment, again several fast 0/1 transitions before it settles low

A **Button Conditioner** solves both issues:

- It first **synchronizes** the RAW button signal into the FPGA clock domain using a **small chain** of D flip flops. This makes sure downstream logic only ever sees changes that are **aligned** with clock edges (pink highlight in figure above).
- It then **debounces** the signal by WAITING (blue highlight in the figure above) until the input has stayed stable (all `0` or all `1`) for a certain number of clock cycles *before* accepting the new value. Short spikes due to bouncing are filtered out.


### Button Conditioner + Edge Detector

As mentioned before, the conditioner also used with **edge detector** that converts the debounced level into a **ONE** cycle pulse on each press. That pulse is easier to use as a discrete “press event” in an FSM or counter.

With this setup, a button conditioner turns a noisy, asynchronous, human controlled signal into a clean, clock aligned signal where one press is equal to one event signal that your digital logic can safely use.

<img src="{{ site.baseurl }}/docs/Labs/images/cs-2026-50002-button-cond.drawio-3.png"  class="center_seventy"/>

{:.important}
> You must run the button through the synchronizer/debouncer <span class="orange-bold">before</span> feeding it into the default Alchitry edge detector.
>
> Based on its implementation, the Alchitry default `edge_detector` outputs a `1` in *this* clock cycle since its output is *combinational*. That means it should receive an `in` signal that's synchronized with the `clk`, otherwise the output will be asynchronous.
> 
> See [appendix](#alchitry-edge-detector) for more detail.

### Using button presses properly in an FSM

Assume you want to process a `start` signal to transition from `HALT` to `START` state. You should pass the conditioned `start` signal through an edge detector:

```verilog
module simple_fsm (
    input clk,  // clock
    input rst,  // reset
    input slow_clock,
    input start, // assume already conditioned
    output led_indicator[8],
    output index_value[2]
) {
    
    enum States {
        START,
        LOOP, 
        CHECK_RESULT, 
        HALT
    }
    
    dff states[$width(States)](#INIT(States.START), .clk(clk), .rst(rst))
    dff index[2](.clk(clk), .rst(rst), #INIT(0))
    
    edge_detector rising_edge(.clk(clk),.in(slow_clock),#RISE(1),#FALL(0))
    edge_detector rising_edge_start(.clk(clk), .in(start), #RISE(1), #FALL(0))
    
    always {
        index_value = index.q
        states.d = states.q
        index.d = index.q
        led_indicator = 0
        
        case(states.q){
            States.START:
                led_indicator = 8h01
                index.d = 0
                if(rising_edge.out)
                    states.d = States.LOOP
                
            States.LOOP:
                led_indicator = 8h0F
                if(rising_edge.out){
                    index.d = index.q + 1
                    states.d = States.CHECK_RESULT
                }
                
            States.CHECK_RESULT:
                led_indicator = 8hF0
                if (~|(index.q ^ b10)){
                    if(rising_edge.out){
                        
                        states.d = States.HALT
                    }
                }
                else{
                    if(rising_edge.out){
                        states.d = States.LOOP
                    }
                }
                
            States.HALT:
                led_indicator = 8hFF
                // always detected
                if(rising_edge_start.out){
                    index.d = 0
                    states.d = States.START
                }
        }
    }
}
```

The "conditioning" is typically done in the top module, as it is part of "input cleanup" and not system logic:

```verilog
    // alchitry_top
    button_conditioner start_button(.clk(clk), #CLK_FREQ(1000), .in(io_button[1])) // simulator clock
    simple_fsm simple_fsm(.clk(clk),.slow_clock(slow_clock.value),.rst(rst),.start(start_button.out))
```

Here's the result with button conditioning (reliable outcome):

<img src="{{ site.baseurl }}/docs/Labs/images/Screen Recording 2025-12-03 at 10.44.06 AM.gif"  class="center_seventy no-invert"/>

And here's the result *without* button conditioning (unreliable start button press detection):
<img src="{{ site.baseurl }}/docs/Labs/images/Screen Recording 2025-12-03 at 10.45.02 AM.gif"  class="center_seventy no-invert"/>

## Building the Automated Register Adder Tester
### Suggested design

You are to test the functionality of your **REGISTERED** 8-bit RCA (registers a, b, and s are required!) automatically here by using an fsm. You may choose to use **write-enabled register** or *not*. Your implementation should adapt accordingly.

Similar to the previous lab, you can create constants that stores the following:
* `A_INPUTS[i]`: the i-th test value for operand `a`.
* `B_INPUTS[i]`: the i-th test value for operand `b`.
* `SUMS[i]`: the expected sum `A_INPUTS[i] + B_INPUTS[i]`.
* `index`: a DFF that stores which test case we are currently applying.

{:.note}
If you have `N` test cases, then `A_INPUTS`, `B_INPUTS`, and `SUMS` are all `N` by `8` array. `index` has the size of `log2(N)` bits.

On each **slow** clock tick (for example near 1 Hz):
* `index` increments by 1 (wrapping around at the end).
* The current `a` and `b` inputs to `registered_rca_en` are taken from `A_INPUTS[index.q]` and `B_INPUTS[index.q]`.
* The adder computes `s`.
* Hardware compares `s` with <span class="orange-bold">pipelined</span> `SUMS[index.q]`.
* The LEDs display `a`, `b`, `s`, and an error flag.

### `$is_sim()`

The real FPGA hardware has 100Mhz onboard clock. As such, you need to set the `DIV` of the `slow_clock` into `28` or `29` to make the *hardware* output human-readable.

You can conditionally set the `DIV` of the `slow_clock` to `9` or `28` using inbuilt function `$is_sim()` depending on whether we are running simulation in software or hardware:

```verilog
    button_conditioner start_button(.clk(clk), #CLK_FREQ($is_sim() ? 1000 : 100000000), .in(io_button[1]))
    counter slow_clock(#DIV($is_sim()? 9 : 28), .clk(clk), .rst(rst), #SIZE(1))
```

### Test on Simulator First

Before building your project, you shall test your tester in the simulator first.

You can set the following interface: 
- `io_led[0]`: index register value
- `io_led[1]`: registered adder `s` value
- `io_led[2]`: expected `s` value from the sum pipeline
- `led[5:0]`: indicates the states we are at (optional):
  - `IDLE`: `00001`
  - `CHECK`: `00010`
  - `HALT_ERROR`: `00011`
- `led[7]`: indicates the `error` bit

<img src="{{ site.baseurl }}/docs/Labs/images/Screenshot 2025-12-04 at 10.27.16 AM.png"  class="center_seventy no-invert"/>

Here's a sample demo using the simulator. The usage of seven segment is optional. For now, it represents the current test index ID. 
- In this demo, we have 16 test cases.
- `io_button[0]` is used to start/restart the tester
- `io_dip[2][7]` will force bit-flip the adder's output and induce and error, to demonstrate that our tester can show error. This is a <span class="orange-bold">forced</span> error.
- Once error is induced, the tester **stops** at the test-case index of that error
- You can restart again by pressing `io_button[0]`

<img src="{{ site.baseurl }}/docs/Labs/images/Screen Recording 2025-12-04 at 10.30.44 AM.gif"  class="center_seventy no-invert"/>



### Build and flash to FPGA

Once your tester works in the simulator, you should **build** the project and **flash** it to the FPGA. To do this, you will need to have Vivado installed. Refer to the [installation](https://natalieagus.github.io/50002/fpga/installation) guideline if you have not read them. It explains:
- How to install Vivado
- How to **build** your project
- How to **flash them** to your FPGA

You should be able to demo using the hardware exactly what you see in the simulator:  

<img src="{{ site.baseurl }}/docs/Labs/images/IMG_1395.gif"  class="center_seventy no-invert"/>

## Checkoff 

This checkoff (2%) is done as a group. 
- It consists of hardware FPGA demo (1%) and QnA (1%). 
- **Contact** your cohort TAs and make appointment to meet them **in-person** (outside of class hour). 

{:.note}
For checkoff, your **group** must show the automated tester working on the FPGA : it steps through multiple test cases automatically, shows correct values for a working adder, turns on the error indicator and **freezes on the failing case** when you inject an error, and cleanly restarts with a button press once the fault is removed.

Details:
1. The adder is driven automatically by a sequence of test vectors (no manual DIP changes needed during the demo).
2. `io_led[0]` shows the current test case value `a`, `io_led[1]` shows the current test case  `b`, and `io_led[2]` shows the computed sum `s`.
3. The tester steps through at least 8 different `(a, b)` pairs at a slow, human-visible rate (about 1 Hz).
4. The `error` indicator LED remains **off** for all test cases when the adder is implemented correctly.
5. If you intentionally break the adder (for example, force one bit of the sum to 0), the `error` LED turns **on** for at least one test case
   1. Then, the tester should `HALT` and show the current test case id (it can either be in decimal or binary format)
   2. User can restart the tester and it should run as per normal again once forced error is removed
6. TAs will ask you two questions (same protocol as lab 2) about any code written in your project


## Summary

In this lab, we move from ad-hoc testbenches to a **self-checking hardware tester** built using the classic **controller–datapath** structure. The datapath becomes a fixed circuit containing registers, the registered RCA, constant test-vector arrays, a pipelined expected sum, and a comparator. The controller becomes a small FSM that decides *when* data moves. This is the same architectural pattern we will use next week when we introduce a simple ISA and build the datapath of a toy CPU.

The datapath holds test vectors (`A_INPUTS`, `B_INPUTS`, `SUMS`) and steps through them with an index register. Each pair flows through the registered RCA, the expected sum is delayed to match the adder’s latency, and the outputs are compared. We can flip bits deliberately to prove that the tester detects errors, and we expose the key signals on LEDs or seven-segment displays for easy observation.

The FSM runs on the fast clock but only performs meaningful transitions on slow-clock edges. To support clean interaction, we debounce and synchronise button inputs with a `button_conditioner` and convert presses into one-cycle pulses using an `edge_detector`.
A few key control responsibilities:

* Reset or increment the test index.
* Enable sampling of new `(a, b)` values and expected sum.
* Decide when to halt on mismatch, and when to restart on a button press.



## Appendix

### Proposed Datapath
<img src="{{ site.baseurl }}/docs/Labs/images/cs-2026-50002-datapath-lab4.drawio-4.png"  class="center_full"/>

### Alchitry Edge Detector

The edge detector provided by Alchitry Labs is:

```verilog

/*
   Edge Detector: This module will detect when there is an edge on 'in' and will
   set 'out' high for that clock cycle. You can specify what type of edge you
   want to look for by setting 'RISE' to 1 for rising edges and/or 'FALL' to 1
   for falling edges.
*/

module edge_detector #(
    RISE = 1 : RISE == 0 || RISE == 1,
    FALL = 1 : FALL == 0 || FALL == 1
)(
    input clk,  // clock
    input in,   // input signal
    output out  // edge detected
) {

    // need to save the previous state of 'in'
    dff last(.clk(clk))

    always {
        out = 0 // default to 0

        last.d = in // save the input

        // if looking for rising edges
        if (RISE)
        // if there is a rising edge
            if (in == 1 && last.q == 0)
                out = 1 // set output flag

        // if looking for falling edges
        if (FALL)
        // if there is a falling edge
            if (in == 0 && last.q == 1)
                out = 1 // set output flag
    }
}
```


The subtlety is in **WHEN** `in` is allowed to change.

* `last.q` is the **previous** value of `in`, sampled on the last rising edge of `clk`.
* `out` is **combinational**, computed from the current `in` and the stored `last.q`.

So in terms of logic:

```text
out = RISE &  in & ~last.q   OR
      FALL & ~in &  last.q
```

### Case 1: input is synchronous (what you want with a button conditioner)

If `in` only changes **on rising edges of `clk`** (for example it is the debounced button output or any flop output on the same clock), then:

* At the clock edge where `in` goes `0` to `1`, `last.q` still holds `0`.
* Immediately after that edge, the condition `in == 1 && last.q == 0` is true, so `out` becomes 1.
* `out` stays 1 for the whole cycle, until the next rising edge updates `last.q` to 1. After that, `in == 1 && last.q == 0` is false again, so `out` goes back to 0.

So with a **synchronous** input the pulse is exactly **one full clock period** long, aligned with the cycle where the edge happened.

That matches the module description: “set `out` high for that clock cycle”.

### Case 2: input changes in the middle of the clock period

{:.new-title}
> The big question
> 
> If an input `in` becomes `1` in the *middle* of the current clock cycle, is the edge detector 1 for the next rising edge fully 1 period or just from now till next edge?

With this implementation:

* Suppose `in` was `0` at the last clock edge, and in the **middle** of the cycle it flips to `1`.
* `last.q` is still `0` until the **next** rising edge.
* As soon as `in` flips to 1, the condition `in == 1 && last.q == 0` becomes true, so `out` becomes `1` **immediately**, and stays `1` **until** the next rising edge, where `last.q` updates to `1` and makes the condition false.

So physically:

* `out` is `1` from “now” until the next edge, <span class="orange-bold">not a full period</span>.
* At the next rising edge, downstream flip flops will see `out = 1` at that instant, then almost immediately after that edge, `out` drops to `0` again, but still fulfils dynamic discipline at the *next* clock cycle (feeding a `1`)

From the point of view of any **synchronous** logic that samples `out` on clock edges, this *probably still* behaves like a one-cycle pulse.

<img src="{{ site.baseurl }}/docs/Labs/images/cs-2026-50002-desync-edge-detector.drawio.png"  class="center_seventy"/>

### Summary
If **button conditioner** is used with an **edge detector**, button conditioner's output is **synchronized** to the clock.

{:.note}
The edge detector raises `out` (produce a `1`) for exactly **one** clock cycle when the debounced button changes from `0` to `1` (or `1` to `0`). **Downstream** logic that is clocked by the same `clk` will see a single-cycle pulse for each press.

For asynchronous inputs, the pulse width is “from the edge until the next clock” and you should not rely on it.

That is precisely why you must run the button through the synchronizer/debouncer before feeding it into this edge detector.




