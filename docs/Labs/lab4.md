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

### Submission
Complete the Lab 4 **checkoff** (3%) with your Cohort TA before the next lab session ends. You should demonstrate the required task under the [Checkoff](#checkoff) section below. The checkoff is assessed **AS A GROUP** as it requires the FPGA hardware.

Complete **questionnaire** on eDimension as well (1%).

## Automated Registered Adder Tester (Hardware)

Up to this point, you have:
* A registered adder that updates on a controlled clock or button.
* A sense of how clocking produces **stable, periodic** outputs.
* A testbench that confirms that your adder works *in theory*.

Now, you shall turn the FPGA hardware into a small **self-checking tester** for your adder. This is related to 1D Checkoff 1, where you are required to build an automated tester for your ALU, a crucial part of your 1D project. 

Instead of manually choosing `a` and `b` via DIP switches, we will *automatically*:

1. Store a fixed list of test vectors in **constant arrays**.
2. Use a small **index register** to step through them one by one.
3. Drive your adder automatically with these vectors.
4. Compare the adder’s output with the expected sum.
5. Show `a`, `b`, and `s` on the LEDs, plus an “error” indicator.

{:.highlight}
This is the same idea as a [testbench](#testbench), but running on real hardware.

### Suggested design

You are to test the functionality of your **Registered** 8-bit RCA automatically here.

You can create constants that stores the following:
* `A_INPUTS[i]`: the i-th test value for operand `a`.
* `B_INPUTS[i]`: the i-th test value for operand `b`.
* `SUMS[i]`: the expected sum `A_INPUTS[i] + B_INPUTS[i]`.
* `index`: a DFF that stores which test case we are currently applying.

> Note that if you have `N` test cases, then `A_INPUTS`, `B_INPUTS`, and `SUMS` are all `N` by `8` array. `index` has the size of `log2(N)` bits.

On each **slow** clock tick (for example 1 Hz):

* `index` increments by 1 (wrapping around at the end).
* The current `a` and `b` inputs to `registered_rca_en` are taken from `A_INPUTS[index.q]` and `B_INPUTS[index.q]`.
* The adder computes `s`.
* Hardware compares `s` with <span class="orange-bold">pipelined</span> `SUMS[index.q]`.
* The LEDs display `a`, `b`, `s`, and an error flag.

### `$is_sim()`

The real FPGA hardware has 100Mhz onboard clock. As such, you need to set the `DIV` of the `slow_clock` into `28` or `29` to make the *hardware* human-readable.

You can conditionally set the `DIV` of the `slow_clock` to `9` or `28` using inbuilt function `$is_sim()` depending on whether we are running simulation in software or hardware:

```verilog
 counter slow_clock(#DIV($is_sim()? 9 : 28), .clk(clk), .rst(rst), #SIZE(1))
```

### Test on Simulator First

Before building your project, you shall test your tester in the simulator first.

You can set the following interface: `io_led[0]`, `io_led[1]`, `io_led[2]` are 8-bit rows for `A_INPUTS[index.q]`, `B_INPUTS[index.q]`, `s` (your adder's sum), and `led[0]` is an error LED (lights up when the result is wrong).

Here's a sample demo using the simulator. The usage of seven segment is optional. For now, it represents the current test index ID. 
- In this demo, we have 16 test cases.
- `io_dip[2][7]` will force bit-flip the adder's output and induce and error, to demonstrate that our tester can show error. This is a <span class="orange-bold">forced</span> error.


<img src="{{ site.baseurl }}/docs/Labs/images/Screen Recording 2025-12-01 at 10.08.50 AM.gif"  class="center_seventy"/>


### Build and flash to FPGA

Once your tester works in the simulator, you should **build** the project and **flash** it to the FPGA. To do this, you will need to have Vivado installed. Refer to the [installation](https://natalieagus.github.io/50002/fpga/installation) guideline if you have not read them. It explains:
- How to install Vivado
- How to **build** your project
- How to **flash them** to your FPGA

## Checkoff

You should be able to demonstrate the following functionality of your automated tester in the **REAL** FPGA hardware:
1. The adder is driven automatically by a sequence of test vectors (no manual DIP changes needed during the demo).
2. `io_led[0]` shows the current test case value `a`, `io_led[1]` shows the current test case  `b`, and `io_led[2]` shows the computed sum `s`.
3. The tester steps through at least 8 different `(a, b)` pairs at a slow, human-visible rate (about 1 Hz).
4. The `error` indicator LED remains **off** for all test cases when the adder is implemented correctly.
5. If you intentionally break the adder (for example, force one bit of the sum to 0), the `error` LED turns **on** for at least one test case.

