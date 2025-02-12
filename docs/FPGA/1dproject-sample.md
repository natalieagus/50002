---
layout: default
permalink: /fpga/project-sample
title: 50.002 Project Sample
parent: 1D&2D Project (FPGA)
nav_order:  3
---

* TOC
{:toc}


# 50.002 Project Sample
{: .no_toc}

{:.note}
This project involves implementing an **FSM** and **datapath** for a specific game using LEDs as output and buttons as inputs. It is a **fixed** machine. Note that you can also implement an ISA to design a **programmable** machine for your project. [The complete code for this project can be found here](https://github.com/natalieagus/sample-1d-project-alchitry-v2). 


## Introduction

**Recall** that a **datapath** is the hardware component of a digital system responsible for performing operations on data, including *arithmetic*, *logic*, *storage*, and data **movement**. It works alongside the control unit (implemented as an **FSM**) to execute tasks.

If the control unit is implemented as a traditional FSM, it means the machine is fixed-purpose, as the FSM is **hardcoded** to transition between a finite set of predefined states for specific operations. <span class="orange-bold">This alone is sufficient for your project</span>.

{:.highlight}
In contrast, a **programmable** machine has a control unit that can interpret and execute instructions from **memory**. You can folow Lab 4: Beta if you're interested to implement an ISA for your project. 

For this project, you are required to implement the **datapath** and **FSM** in an FPGA, with buttons/switches and LEDs connected as input and output interfaces. The buttons/switches will serve as **control inputs** for the players' **actions**, while the LEDs will **visually** represent the current game state (score, player lives, time left, status indicators, etc). 

Your prototype must be housed in a suitable **enclosure** to ensure it functions as a <span class="orange-bold">complete</span> and <span class="orange-bold">user-ready</span> **electronic hardware game**. This game will be showcased during **ISTD Exhibition Day**, allowing attendees to play it.

{:.important-title}
> Reference only
> 
> This handout provides a sample game idea, along with its FSM and datapath, intended for **reference** purposes only.

## The Game: Score Snatchers

Score snatchers is a a fast-paced, 30-second competitive game where two players strategically **collect** and **reset** a randomly increasing counter to maximize their score within three attempts.

**Game procedure:**
* **Two players** compete in a 30-second game where they monitor a **counter** that increases at a random, varying rate. 
* Each player can "collect" the current counter value, **resetting** it to zero and earning the points displayed. 
* Players can only collect **three** times during the game. 
* The player with the highest total score at the end wins. 
* If both players have the same score, it's a draw.


## UI & IO 

<img src="{{ site.baseurl }}/docs/FPGA/images/1d-diagram.drawio-2.png"  class="center_seventy"/>

Above shows the rough sketch of the prototype. Here's the breakdown:
1. **Input**: 2 buttons, one for each player (60mm arcade button)
2. **Outputs**:
   * 3 sets of 2-digit 7-segment (standard red, 0.56" size): P1 score, P2 score, and time remaining
   * 2 large 7-segment (standard red, 2.7" size): current score to collect 
   * 3 blue 10mm LED: remaining collection attempt for P1
   * 3 red 10mm LED: remaining collection attempt for P2
3. Enclosure material: recycled cardboard box 

Consult [Appendix](#appendix) for screenshots of products. 

## Feasibility 
We assume that we connect all device's **ground** to the common **ground** (FPGA's & Battery's ground).

### Output connections

<span class="orange-bold">Common Anode</span> 2-digit 7-segment: 10-pinout each (3 sets)
* 2 selector pins (supply `1` to activate, `0` to deactivate a digit)
* 8 segment pins (supply `1` to activate, supply `0` to deactivate a segment)

<span class="orange-bold">Common Anode</span> 1-digit 7-segment: 10-pinout each (2 sets)
* Common anode pin (connect to VDD)
* 8 segment pins (supply `0` to activate, supply `1` to deactivate a segment)

6xLED (3 blue, 3 red): 
* 6 anode legs (positive)
* 6 ground legs (can be soldered together to common ground) 

Button LED:
* 2 anode legs (positive)

#### Multiplex all 7-segments
Without any optimisation, we need 56 pinouts from the Br. This is <span class="orange-bold">infeasible</span>. 

We will simplify by connecting all **matching** segment pins together since they are all <span class="orange-bold">common anode</span> 7-segments. This leaves us with 8 segment connections for all 7-segment units. For the selector, we have 8 selector pins, each **hot encoded** to activate one out of the 8 digits. 

**Multiplexing logic**:
1. Activate only one selector pin at a time (e.g., Set 1, Digit 1).
2. Output the desired segment pattern to the 8 segment pins.

{:.highlight}
Total: **24** output connections from the Br board (16 for all 7-segments, 8 for LEDs).

#### Separate power supply
The common anodes of the smaller 7-segment displays should connect to the Br Board GPIO pins (which will source ~3.6V or logic `1`). However, the common anodes of the larger 7-segment displays should connect to 9V or 12V battery supply.

* We use a **PNP BJT transistor** for each common anode pin of the larger 7-segment displays
* Connect the <span class="orange-bold">emitter</span> to an external supply (e.g: 9V/12V battery)
* Connect the <span class="orange-bold">base</span> with Br board GPIO  + resistor (~3.5kΩ).
  * When the GPIO drives the PNP transistor base low `0`, the transistor turns **ON**, connecting the 9V/12V supply to the common anode pin of the display.
* Connect the <span class="orange-bold">collector</span> to the common anode of large 7-segment displays.
* 500-600Ω resistors are placed on **each** segment to <span class="orange-bold">limit</span> the current from the common anode through the LEDs to the Br GPIO pins.

{:.note-title}
> Resistor at base of PNP transistor
>
> The resistor at the base of the PNP transistor is there to limit the current flowing from the emitter (positive voltage supply, e.g., 12V) into the base and through to the GPIO pin (which is set to **low**). Without the resistor, this current could become too large and potentially damage the GPIO pin or the transistor. 
> 
> BJT is not MOSFET. In BJT, current physically flows from the emitter to the base (through the GPIO pin), so a base resistor is essential to limit this current. However in a MOSFET, the gate of a MOSFET is insulated from the drain and source by a thin layer of oxide (hence the name Metal-Oxide-Semiconductor FET)

The diagram below illustrates a simple schematic showing how to connect an external battery to a 7-segment display, driven by GPIO pins:

<img src="{{ site.baseurl }}/docs/FPGA/images/1d-diagram-pnp.drawio.png"  class="center_seventy"/>

*Not drawn: SEG 2 - SEG 8 connection to Br Board. Each requiring a resistor, analogous to SEG 1 sample above.*

### Input connections

Each Arcade button has 3 pins:
1. Shared **ground** between the switch and the button's LED
2. LED pin (positive/anode), belongs to output (previous section)
3. Signal pin for switch (active high)

{:.highlight}
**Total**: 2 input connection to the Br Board. 


## Datapath Planning
It is recommended that you follow a generic simplified  **custom** $$\beta$$-like structure (without the PC and RAM unless you want to design a generic instruction set):
1. You have a **REGFILE** system, where it stores a bunch of registers inside that's addressable. It's up to you to define how many combinational read ports and how many sequential write ports. 
2. **Combinational Logic Unit:** **You must utilize a 16-bit ALU (pre 2025), so you have no choice on this.** Therefore this makes your datapath to be a 16-bit architecture by default. <>
3. You have a **Control Unit**, which is simply an FSM that gives out different control signals at various time step. 

{:.important}
ALL sequential parts that requires CLK is fed with the **SAME default Alchitry CLK defined in the alchitry.acf file.** This value is 100Mhz (you can change it but only in the constraint file). You can create other submodules to be plugged into your datapath to act as frequency divider (slowing down the clock cycle) but  <span style="color:red; font-weight: bold;">DO NOT MESS with the .clk</span> input of the REGFILE and FSM **unless you are a very experienced FPGA developer.**  <>

### Designing the `REGFILE`
The first step in designing a datapath is to think about **how much storage** you will need, and how many bits of data your machine can support at each cycle? 

Since we are using a **32-bit** ALU, it automatically makes your custom game machine a 32-bit architecture. So we shall choose to use 32-bit dffs. 

For this simple game, we need the following values to be stored:
1. Score of P1 
2. Score of P2 
3. Number of times P1 has clicked its button
4. Number of times P2 has clicked its button
5. Current collectible number (**counter**)
6. Seconds (time) left for the game

Therefore we want a REGFILE unit that contains *8* **32-bit dffs** (3-bit addressable). We can set some register addresses to be fixed:
* **0x0** : P1 Score Reg
* **0x1** : P2 Score Reg
* **0x2** : P1 Button Count Reg
* **0x3** : P2 Button Count Reg
* **0x4** : Current Counter Reg
* **0x5** : Timer Reg
* **0x6** & **0x7** : Temp Regs


In general, a `REGFILE` system **must** have combinational read ports and sequential write ports. It is up to you to decide how many ports for each, depending on your use case. This affect the amount of input and output terminals you need to make to your regfile.

**For each read port we need to:** 
* Specify a read address `rax`: the number of bits depends on how many dffs are there in the REGFILE (3 in this case). 
* Specify a data out port `rdx`: the number of bits depend on the size of each register can store (32 in this case)

**For each write port we need to:**
* Specify a write address `Rx`: the number of bits depends on how many dffs are there in the REGFILE (3 in this case). 
* Specify a write enable: `WE` signal
* Specify data to write `WD`: Number of bits depend on the number of bits each register can store (32 in this case). 


For this example, we follow the $$\beta$$: to have 2 read ports and 1 write ports. One possible REGFILE schematic for this custom game datapath is as such:
<img src="{{ site.baseurl }}/docs/FPGA/images/1d-diagram-regfile.drawio.png"  class="center_seventy"/>

### Implementing the `REGFILE` 

Coding a `REGFILE` on an FPGA is not an issue after you have a clear idea about its addressing system, and input/output ports of the module. This `REGFILE` should be implemented as a single file, e.g: `regfile.luc`. 

```verilog
// regfile.luc
module game_regfiles (
    input clk,  // clock
    input rst,  // reset
    input wa[3], // write address
    input we, // write enable
    input data[32], // data in
    
    input ra1[3], // read address port 1
    input ra2[3], // read address port 2
    output rd1[32], // read data port 1
    output rd2[32], // read data port 1
    
    // states
    output timer_out[32],
    output p1_score_out[32],
    output p2_score_out[32],
    output p1_button_press_out[32],
    output p2_button_press_out[32],
    output counter_out[32],
    
) 

{
    .clk(clk){
        .rst(rst){
            dff p1_score[32](#INIT(0))
            dff p2_score[32](#INIT(0))
            dff p1_button_press[32](#INIT(0))
            dff p2_button_press[32](#INIT(0))
            dff current_counter[32](#INIT(0))
            dff temp_var[32](#INIT(0))
            dff current_timer[32](#INIT(0))
        }
    }
    
    always {
        
        //write port
        if (we){
            case(wa){
                d0 : p1_score.d = data
                d1 : p2_score.d = data
                d2 : p1_button_press.d = data
                d3 : p2_button_press.d = data
                d4 : current_counter.d = data
                d5 : current_timer.d = data
                d6 : temp_var.d = data
            }
        }
        
        
        //read port a
        case(ra1){
            d0 : rd1 = p1_score.q
            d1 : rd1 = p2_score.q
            d2 : rd1 = p1_button_press.q
            d3 : rd1 = p2_button_press.q
            d4 : rd1 = current_counter.q
            d5 : rd1 = current_timer.q
            d611 : rd1 = temp_var.q
            default : rd1 = 0
        }
        
        //read port b
        case(ra2){
            d0 : rd2 = p1_score.q
            d1 : rd2 = p2_score.q
            d2 : rd2 = p1_button_press.q
            d3 : rd2 = p2_button_press.q
            d4 : rd2 = current_counter.q
            d5 : rd2 = current_timer.q
            d6 : rd2 = temp_var.q
            default : rd2 = 0
        }

        p1_score_out = p1_score.q
        p2_score_out = p2_score.q
        p1_button_press_out = p1_button_press.q[1:0]
        p2_button_press_out = p2_button_press.q[1:0]
        timer_out = current_timer.q
        counter_out = current_counter.q
 
    }
}
```

### Designing the ALU and support datapath

Drawing inspiration from the $$\beta$$ CPU, we add the selector muxes to dictate the kinds of data that can be fed to the ALU:
* `ASEL` mux: to decide what's fed into the `A` port of the ALU
* `BSEL` mux: to decide what's fed into the `B` port of the ALU
* `WDSEL` mux: to decide what's fed into the `wd` port of the REGFILE

Planning what other values that should enter the ALU is tightly depends on the FSM ([next section](#designing-the-control-logic-fsm)). 

{: .highlight}
We can choose to expand the `ASEL/BSEL/WDSEL` muxes to receive more inputs (constants) that best suit our game. 

How many inputs should `ASEL/BSEL/WDSEL` mux handle? This affects how many bits the control signals should be. The source of inputs to each mux can either be from **other registers**, or **other combinational logic units**, or a **constant** that's **relevant** for your game. 

For this game, we need a few constants and so we **hardcode** it as inputs to `ASEL` and `BSEL` muxes:
* The value "30" to **reset** the timer: `0x1E` at the `ASEL` mux
* The value "3" to **compare** against current player's button press: `0x3` at the `BSEL` mux
* "1" and "0" as **standard** constants to perform comparison in **both** muxes

For the `WDSEL` mux, we can hardcode some fixed signal:
* `0xFFFF` signifies the "winning signal", 
* `0x0000` signifies the "losing signal", and 
* `0xF` signifies the "draw signal". 

The purpose of having these constant values at WDSEL mux is so that we can load these to the **score** registers when the game ends to indicate who wins the game.

<img src="{{ site.baseurl }}/docs/FPGA/images/1d-diagram-alu.drawio.png"  class="center_fifty"/>


## Designing the Control Logic FSM

The control logic unit is an FSM. This sample project demonstrate a fixed machine. Note that for this project you also can design an **instruction set** like the actual $$\beta$$. 

{:.important}
The FSM and datapath are <span class="orange-bold">tightly coupled</span>, with the FSM controlling the sequence of operations while the datapath performs the actual computations. Together, they enable the execution of game logic by coordinating inputs, outputs, and intermediate data processing through components like the ALU, registers, and multiplexers. It is <span class="orange-bold">common</span> to iterate between the FSM and datapath design because they are interdependent.



The number of states depends on how complicated your game is. You can typically begin your planning by starting with *four generic state groups:*
* `START` state: prepare necessary values when game begins.
* `IDLE` state: this is where your machine will be spending most of their time at. In this state, it **waits** for any input and direct the system to an appropriate handling state.
* `GAMEOVER` state: displays the endgame score and wait for reset button.
* `HANDLER` states: a series of states used to handle specific **events**, that are entered/invoked from the `IDLE` state. 

There are four major **events**, color coded in the FSM diagram below (please open it in a separate tab so you can see the content clearly):
* `BUTTON PRESS` event (black)
* `INCREASE COUNTER`	event (red)
* `DECREASE TIMER`	event (blue)
* `COMPUTE WINNER` event (purple)

<img src="{{ site.baseurl }}/docs/FPGA/images/fsm-1d.png"  class="center_seventy"/>

### Button Press Event
`BUTTON PRESS` **event** is invoked when the control unit **receives button press signal** from either player.

When any player press a button, we want to check if the player's **current** button press is less than 3. 
* If yes, increment the button count, and increment the player's score based on the current collectible number in the counter, and then reset the counter. 
* If no, then no score update / counter reset is done. 

We also have to check if both players have pressed their buttons for 3 times **each** as well. The game is supposed to end early if all players have used up their button presses regardless of time left. 
* If yes, proceed to `COMPUTE WINNER` **event**. 
* Otherwise, go back to `IDLE` state. 

### Counter Increment Handling
`INCREASE COUNTER` event accounts for the fact that the control unit should receive some "random/varying" increment signal input from another unit called `VARIABLE_TIMER_CLOCK`. Whenever this variable clock produces a `1`, we need to handle this event by increasing the counter reg, and going back to the `IDLE` state. 

The final output displayed to the user is as if the counter increases at an unpredictable rate.

The implementation of the variable counter clock can be found [here](https://github.com/natalieagus/sample-1d-project-alchitry-v2/blob/main/source/variable_timer.luc). 

### Timer Decrement Handling
`DECREASE TIMER` event accounts for the fact that the control unit should also receive some signal from a slow game timer unit called `GAME_TIMER_CLOCK` and decrement the timer register accordingly. `GAME_TIMER_CLOCK` emits a `1` every second. 

```verilog
    counter game_timer_clock(#SIZE(1),#DIV(SLOW_CLOCK_DIV), .rst(rst)) 
```

A **check** on whether the timer register has reached zero has to be performed at the beginning of this event, and if so, proceed to `COMPUTE WINNER` event instead of decreasing the timer further. 

{: .note}
Each **state** is logically equivalent to a **single** instruction in a regular program and an **event** is like a function which is a collection of repeatable *instructions*; comprised of many states. Within each state, you need to decide the value of the appropriate **all control signals**.

### Sample Explanation
**Look at `CHECK_P1_BUTTON_COUNT` state**. It is *triggered* (from `IDLE`) if `P1 Button` is pressed, and output the following control signals:
* `alufn = CMPLT`
* `asel = b00`
* `bsel = b11`
* `regfile_we = b1` 
* `regfile_ra1 = d2` (p1 button count reg)
* `regfile_ra2 = --`
* `regfile_wd = d6` (temp reg)
* `wdsel = b00`
* `7-seg = b00` 


During this state, we are comparing (set the ALUFN to `CMPLT`) the content of `Reg[0x2]` (*P1 Button Count Reg*), with the constant `3` that can be routed into the `B` port of the ALU when `bsel = b11`. 

The output of the ALU is stored at the **temp** register 6 (`R6`). We do not use the output from the `regfile_rd2` port of the regfile and therefore it doesn't matter what value `ra2` is. 

In the **next cycle**, we will arrive at the state `BRANCH P1 BUTTON` which will look at the content of `R6` and decide whether to return to `IDLE` or update P2's score. 

{: .highlight}
The same logic applies for any other state. 

### Implementation
The lucid file is too long to be pasted here. You can view it [here](https://github.com/natalieagus/sample-1d-project-alchitry-v2/blob/main/source/game_cu.luc) instead. 

## The Complete Datapath

The figure below shows the complete datapath for this game project: 

<img src="{{ site.baseurl }}/docs/FPGA/images/1d-diagram-datapath.drawio.png"  class="center_full"/>



The lucid implementation is as follows, describing connections between regfile, alu, and control unit:

```verilog
// datapath.luc
module game_datapath#(
    SLOW_CLOCK_DIV ~ 26 : SLOW_CLOCK_DIV > 0,
    FAST_CLOCK_DIV ~ 21 : FAST_CLOCK_DIV > 0
)(
    input p1_button,
    input p2_button,
    
    input clk,  // clock
    input rst,  // reset
    
    // output to LEDs/7segments
    output p1_score_out[32],
    output p2_score_out[32],
    output p1_button_press_out[32],
    output p2_button_press_out[32],
    output current_counter_out[32],
    output timer_out[32],
    output slow_clock_out,
    output variable_clock_out,
        
    // add appropriate debug signals as necessary
) {
    
    //temp variables
    sig input_alu_a[32]
    sig input_alu_b[32]
    
    alu game_alu
    
    .clk(clk){
        variable_timer variable_timer_clock(#FAST_CLOCK_DIV(FAST_CLOCK_DIV), .rst(rst))
        counter game_timer_clock(#SIZE(1),#DIV(SLOW_CLOCK_DIV), .rst(rst)) 
        
        // edge detector declaration & connection with counters
        edge_detector edge_detector_variable_timer (#RISE(1), #FALL(0), .in(variable_timer_clock.out))
        edge_detector edge_detector_game_timer(#RISE(1), #FALL(0), .in(game_timer_clock.value))
        
        game_cu game_cu(
            .p1_button(p1_button),
            .p2_button(p2_button),
            .rst(rst),
            .increase_counter(edge_detector_variable_timer.out),
            .decrease_timer(edge_detector_game_timer.out)
            
        )
        
        game_regfiles game_regfiles(
            .we(game_cu.regfile_we), 
            .wa(game_cu.regfile_wa), 
            .ra1(game_cu.regfile_ra1), 
            .ra2(game_cu.regfile_ra2),
            .rst(rst)
        )
    }
    always {
       
        
        // bootstrap rd2 output to CU for convenient branching conditions
        game_cu.regfile_rd2 = game_regfiles.rd2
        
        // asel mux
        case(game_cu.asel){
            b00  : input_alu_a = game_regfiles.rd1
            b01  : input_alu_a = 1 
            b11  : input_alu_a = 30
            default : //b10 unused
                input_alu_a = 0
        }
        
        // bsel mux
        case(game_cu.bsel){
            b00 : input_alu_b = game_regfiles.rd2
            b01 : input_alu_b = 1
            b11 : input_alu_b = 3
            b10 : input_alu_b = 0
            default: //necessary to init
                input_alu_b = 0
            
        }
        
        // alu
        game_alu.a = input_alu_a
        game_alu.b = input_alu_b
        game_alu.alufn_signal = game_cu.alufn
        
        // wdsel mux
        case (game_cu.alu_out_sel){
            b01 : game_regfiles.data = hFFFF
            b10 : game_regfiles.data = hF
            b11 : game_regfiles.data = 0
            default : 
                game_regfiles.data = game_alu.out
        }
        
        current_counter_out = game_regfiles.counter_out
        timer_out = game_regfiles.timer_out
        p1_score_out = game_regfiles.p1_score_out
        p2_score_out = game_regfiles.p2_score_out
        p1_button_press_out = game_regfiles.p1_button_press_out
        p2_button_press_out = game_regfiles.p2_button_press_out
        variable_clock_out = variable_timer_clock.out
        slow_clock_out = game_timer_clock.value
        
    }
}
```


### Further Details 
The datapath interfaces with buttons (`p1/p2_button`) and output signals to the LEDs or 7 segments. Interfacing with external devices is tricky, and may be frustrating at first. So it is important for you to finish ALL basic the other [basic FPGA tutorials](https://natalieagus.github.io/50002/fpga/lucid-v2/intro). 

#### Game Timer Clock and Variable Timer Clock
In particular, you need to know how to do smaller sub-components that are **crucial** to your project. For example, in this project you need to know how to:
1. **Debounce** a button press, and only producing a value `1` ONCE per button press **using an edge detector.** 
   * Refer to [Lab 2 materials](https://natalieagus.github.io/50002/lab/lab2#task-4-process-button-presses) again if you have forgotten how to do so. 
2. Create a simple sequential logic module to produce a value of `1`  ONCE every second (denoted as `GAME TIMER CLOCK`). You can use a basic `counter` module set with `DIV`: 
	* `counter game_timer_clock(#SIZE(1), #DIV(SLOW_CLOCK_DIV), .rst(rst)) `
	* And use  an **edge detector**
	* `edge_detector edge_detector_game_timer(#RISE(1), #FALL(0), .in(game_timer_clock.value))`
	* Refer to [Lab 2 materials](https://natalieagus.github.io/50002/lab/lab2#generate-the-slow-clock-signal) again if you have forgotten how to do so.
3. Create a sequential logic module that randomly produce a value of `1` (denoted as `VARIABLE TIMER CLOCK`)

#### Variable Timer Clock 

The implementation for this module is as follows:

```verilog
// variable_timer.luc
module variable_timer 
#(
    SEED = 678120348,
    FAST_CLOCK_DIV ~ 10
)
(
    input clk,  // clock
    input rst,
    output out,
    output debug[16]
) {
    
    const GENERATE_NUMBER_CLOCK_SPEED = FAST_CLOCK_DIV + 1
    .clk(clk){

        .rst(rst){
            counter seed_clock(#SIZE(1),#DIV(FAST_CLOCK_DIV)) 
            counter generate_next_number_clock(#SIZE(1), #DIV(GENERATE_NUMBER_CLOCK_SPEED))
            pn_gen random_number
        }
        
        edge_detector edge_detector_next(.in(generate_next_number_clock.value))
        edge_detector edge_detector_seed(.in(seed_clock.value))
        dff seed[16] // not globally reset
        
    }
    
    sig pointer[5]
    
    always {
        out = 0
        random_number.seed = seed.q
        random_number.next = edge_detector_next.out
        pointer = random_number.num[4:0] // select lower 8 bits as pointer
        
        debug = random_number.num[15:0]
        
        if(edge_detector_seed.out){
            seed.d = seed.q + 1
        }
        
        out = random_number.num[pointer] // select the nth bit of the current random number to increase/decrease the counter
        
    }
}
```

Main idea:
* `variable_timer` to produce `out` signal of `1` at unpredictable timings
* `pn_gen`: `random_number` will produce a new 32-bit number each time `edge_detector_next.out` is `1`
*  We select the nth bit of `random_number.num` as `out` signal of `variable_timer` 
*  n varies, depending on the value of `pointer`, which is simply just the last 5 bits of `random_number.num` itself 
  
For instance, if current value of `random_number.num` is `0xABCDEF11`, then `pointer` value is `b10001`, and `out` will be the 17th bit of `random_number.num`, which is `1`. 


#### Bootstrap `RD2` to Control Unit FSM
Notice the **bootstrapped** `REGFILE` output: all 32-bits `RD2` straight to the FSM. This is similar to the `Z` unit in $$\beta$$ used for **branching** after a comparison check in the previous state.  You can also use this to branch and *perform next check* in **1 cycle**. The relevant state illustration and its sample lucid code is:<br>

<img src="{{ site.baseurl }}//docs/FPGA/images/1dproject-sample/2025-01-16-17-55-25.png"  class="center_fourty"/>

```verilog
    GameStates.BRANCHCHECK_P1P2BUTTONCOUNT:
        regfile_ra2 = d6            // temp reg
        if(regfile_rd2[0]){  
            alufn = b110011         // CMPEQ 
            regfile_ra1 = d2        // P1 button reg
            bsel = b11              // constant 3
            regfile_we = 1
            regfile_wa = d6         // temp reg
            game_fsm.d = GameStates.BRANCH_P1BUTTONCOUNT  
        }
        else{
            game_fsm.d = GameStates.IDLE
        }
```

{: .new-title}
> Tips
> 
> If you are a beginner, then perhaps it is easier to debug if you simplify your states (even though you end up with more states).
>
> If you're experienced, You may take such shortcuts if it makes your FSM simpler.

When you brainstorm for a game, try to keep two very **important** things in mind:
1. **Ideation:** A good game doesn't have to be complicated. It can be a very simple math-based game, or strategy game. You can find inspiration using simple arcade games in the 1990s. 
2. **Think about the external I/O devices that you have to manage.**

## Selecting I/O Devices
This project utilises simple 7 segments, LEDs, and arcade buttons as its interface. This is sufficient to score full marks on your project if executed seamlessly. 

{:.note}
A highly recommended plan for I/O is to simply use a bunch of buttons for **input** and small coloured LEDs, or small 7 segments as output so that you don't have to use external batteries. You won't be penalised even if you go for this simple route. 

If you're feeling adventurous, we list out some upgrades below. Remember that this will <span class="orange-bold">not</span> significantly impact your 1D project grade. 

### Some Upgrade: Bigger Buttons and RGB LEDs
You can buy bigger buttons, LEDs or 7 segments, and buy **transistors** (simple, cheap BJT ones) to be used as **amplifiers** using external power source if the voltage from the Au is not strong enough. This is what's proposed in this instructor sample project.

#### More Upgrade: LED Strips
You can buy LED strips (e.g: WS2812B), and **read the specifications**: typically the type of serial data and clock cycles required to set the lights. The specification of the model that you buy **must be CLEAR**, complete with details on how to encode information to light up your LEDs. [See this datasheet for WS2812B](https://www.dropbox.com/s/7kj6aa9n6817tid/WS2812.pdf?dl=0). You can find a [sample driver code for this model here (in LucidV1, please adapt it for LucidV2 on your own)](https://github.com/natalieagus/ws2812b). 

#### Even More Upgrade: LED Dotmatrix, LED Matrix
You can buy LED matrix if you're confident with your Lucid skills. There are TWO types: a simple up to 8x8 dot matrix,
<img src="https://dropbox.com/s/9fq8jdfe4n5h0zp/dot.png?raw=1"  class="center_thirty"  >
<br>
Or, a **bigger** bit-addressable matrix like this (e.g; Adafruit matrix LED),<br>
<img src="https://dropbox.com/s/8nfp3inp8yi1t4v/bigmatrix.png?raw=1" class="center_thirty"   >
<br>

For the dotmatrix, you can use easy registers / dff to manage the data. For the big matrix, **you need to use some kind of RAM module** (you can use simple RAM default component in Alchitry) to store your data for the matrix to display at all times.[ You can find a sample driver code for the bit-addressable matrix (Adafruit LED matrix or equivalent) here. This code is in LucidV1, please adapt it for LucidV2 on your own ](https://github.com/natalieagus/rgbledmatrix)

{: .important}
**NEVER use dff** for massive storage of data to be read by the big matrix! Your compile time is going to take a bizarrely long time or fail altogether because the FPGA does not have enough logic unit!  

#### Beastly upgrade: To use VGA + screen output and USB gamepads. 
{: .warning}
This is <span class="orange-bold">not</span> recommended unless you have had prior experience.

If you're new to this, then it will waste a lot of your time, and it is very risky with little value-add to your project because the focus of this project is to design a programmable data path, and not to produce a fancy output per se. Note that we also will not tend to any request to teach how to use the VGA output or read USB input. We will prioritise other more important requests instead. <span style="color:red; font-weight: bold;">If you choose to go down this path, you are on your own</span>.

{: .new-title}
> Prioritize functionality
> 
> Please prioritize making your project work first before adding any fancy features & I/O. 


## Summary 

The sample project demonstrates how to design a fixed machine using an FSM and datapath implemented on an FPGA.  The key learning point is to **plan carefully** before starting to code. The datapath and FSM sample above serve as a high quality example for your **Checkoff 2** submission.

Players interact with the game using arcade buttons, with LEDs and 7-segment displays providing visual feedback. The game mechanics involve players collecting points from a randomly increasing counter while adhering to constraints such as limited button presses and a countdown timer. 

You can use this guide as a **benchmark**  to plan and execute your project. 

# Appendix 

7-segments for timer, P1 score, P2 score (2-digit):
<img src="{{ site.baseurl }}/docs/FPGA/images/7seg-2digit.png"  class="center_seventy"/>

7-segments for current score to collect:
<img src="{{ site.baseurl }}/docs/FPGA/images/7seg-large.png"  class="center_seventy"/>

Player collection buttons: 
<img src="{{ site.baseurl }}/docs/FPGA/images/arcade-blue.png"  class="center_seventy"/>
<img src="{{ site.baseurl }}/docs/FPGA/images/arcade-red.png"  class="center_seventy"/>

Player "collection-attempt-remaining" LED (x3):
<img src="{{ site.baseurl }}//docs/FPGA/images/1dproject-sample/2025-01-15-13-32-55.png"  class="center_seventy"/>
<img src="{{ site.baseurl }}//docs/FPGA/images/1dproject-sample/2025-01-15-13-33-15.png"  class="center_seventy"/>
