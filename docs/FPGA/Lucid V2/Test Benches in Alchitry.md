---
layout: default
permalink: /fpga/fpga_9_2024
title: Debugging Strategies
description: How to use test bench modules
parent: Lucid V2
grand_parent: 1D&2D Project (FPGA)
nav_order: 9
---


* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design

## Test Bench Modules

This document is written to guide you with debugging the FPGA using **Alchitry Lab v2 test bench modules**.  Using test bench is way faster than building and flashing into the FPGA, and is able to display more information than the simulation HUD.
## Creating a test bench 

To start create a test bench modules under the create file tab:
<img src="{{ site.baseurl }}//docs/FPGA/Lucid%20V2/images/test_bench_images/Pasted image 20250417192506.png"  class="center_seventy no-invert"/>




It should create a new file under your source files. And when opened it looks something like this:
<img src="{{ site.baseurl }}//docs/FPGA/Lucid%20V2/images/test_bench_images/Pasted image 20250417192745.png"  class="center_seventy no-invert"/>

In Alchitry Lab v2 there's exist functions that can only be used in test bench modules that are very useful for debugging.  

| Function                   | Argument Type                                                                                                                                                     | Purpose                                                                                                                                                                                                                                   |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `$tick()`                  | None                                                                                                                                                              | Propagates all signal changes and captures the state.                                                                                                                                                                                     |
| `$silent_tick()`           | None                                                                                                                                                              | Propagates all signal changes.                                                                                                                                                                                                            |
| `$assert(expr)`            | Any expression, typically a [comparison](https://alchitry.com/tutorials/lucid-reference/#comparison).                                                             | Checks that `expr` is non-zero (true). If it is zero the simulation is halted and an error is printed indicating the failed assert.                                                                                                       |
| `$print(expr)`             | Any expression                                                                                                                                                    | Prints the value of `expr`. If `expr` is a [string literal](https://alchitry.com/tutorials/lucid-reference/#strings), it prints the string. Otherwise, it prints `expr = value` where `expr` is the text and `value` is the actual value. |
| `$print(format, exprs...)` | `format` is a [string literal](https://alchitry.com/tutorials/lucid-reference/#strings) and `exprs` is a variable number of expressions depending on the `format` | Prints the string `format` with the values of the provided `exprs` replaced where applicable. Valid format flags are `%d` for decimal, `%h` for hex, `%b` for binary, `%nf` for fractional where `n` is the number of fractional bits.    |

*Table source from https://alchitry.com/tutorials/lucid-reference


## How to use: (basic)

The best way to use test bench is to use it on each individual modules you create be it adder, multiplier or any custom modules you  plan to use. The purpose of test bench is to make sure your modules work as expected before integrating into your data path.
<img src="{{ site.baseurl }}//docs/FPGA/Lucid%20V2/images/test_bench_images/Pasted image 20250417194003.png"  class="center_seventy no-invert"/>

To test, implements your module like how you would in a normal lucid file with the required **PARAMETER** and assign their **INPUT** and **OUTPUT**. 

Once you fully implement the your test modules (no error detected), a play button should appear at the top of the test block. Which means that your test bench is ready to run. Go ahead and click on it.
<img src="{{ site.baseurl }}//docs/FPGA/Lucid%20V2/images/test_bench_images/Pasted image 20250417195100.png"  class="center_seventy no-invert"/>

Once  Alchitry Lab finish loading your test case, it will open a new tab with the expected output. 
<img src="{{ site.baseurl }}//docs/FPGA/Lucid%20V2/images/test_bench_images/Pasted image 20250417195337.png"  class="center_seventy no-invert"/>

On the graph, if you hover your mouse, you can see your values of the INPUT and OUTPUT ports as well as the values in a SIGNAL and DFF at the first clock cycle. 
With this you can test your modules to check if the given input values are returning the correct expect outputs and potentially see if there is any error when with the logic. 

### Advancing clock cycle
Now maybe if you want to advance to the next clock cycle to check if your DFF is storing/outputting the correct values in the modules.  
We can go back to the test bench and cycle the clock twice.
<img src="{{ site.baseurl }}//docs/FPGA/Lucid%20V2/images/test_bench_images/Pasted image 20250417201608.png"  class="center_seventy no-invert"/>

The best way to do so is to use the tick_clock function provided. We can cycle the clock how many we want by writing how many times we want to capture a cycle. For this example we only want to see 2 cycle so we can write $tick_clock() twice under the test block. 
<img src="{{ site.baseurl }}//docs/FPGA/Lucid%20V2/images/test_bench_images/Pasted image 20250417202306.png"  class="center_seventy no-invert"/>

If we run the test block, we can now see 2 clock cycle outputs. As you can see on the first cycle the `dff store` takes in input 7 while the out put remains 0. Only on the second cycle , `dff store` is outputting the stored value 7. 

We can actually test multiple test cases in one go too, by separating each test case with the clock function.
<img src="{{ site.baseurl }}//docs/FPGA/Lucid%20V2/images/test_bench_images/Pasted image 20250417204225.png"  class="center_seventy no-invert"/>
And that's the basic of using test bench, with this you should be able to use test bench for testing any modules. 

## How to use: (advance)
Under this section I will explain how to use the built in function for test bench as well as how to create your own function. 

So in test bench modules, there are 3 built in function that I haven't explain. 

| `$assert(expr)`            | Any expression, typically a [comparison](https://alchitry.com/tutorials/lucid-reference/#comparison).                                                             | Checks that `expr` is non-zero (true). If it is zero the simulation is halted and an error is printed indicating the failed assert.                                                                                                       |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `$print(expr)`             | Any expression                                                                                                                                                    | Prints the value of `expr`. If `expr` is a [string literal](https://alchitry.com/tutorials/lucid-reference/#strings), it prints the string. Otherwise, it prints `expr = value` where `expr` is the text and `value` is the actual value. |
| `$print(format, exprs...)` | `format` is a [string literal](https://alchitry.com/tutorials/lucid-reference/#strings) and `exprs` is a variable number of expressions depending on the `format` | Prints the string `format` with the values of the provided `exprs` replaced where applicable. Valid format flags are `%d` for decimal, `%h` for hex, `%b` for binary, `%nf` for fractional where `n` is the number of fractional bits.    |

### `$assert(expr)`

This function is use to halt/notify any unexpected values shows up, something like your throws exceptions in java. 
<img src="{{ site.baseurl }}//docs/FPGA/Lucid%20V2/images/test_bench_images/Pasted image 20250417215400.png"  class="center_seventy no-invert"/>
As you can see, the clock cycle only advance once even though the tick_clock function was called 3 times. Because the `$assert` function after the first cycle halt the clock immediately when it fails the check. 
### `$print(expr)`
For `$print`, you can use them like how you would use them in python or java, where you can print a string or any output value. The printed statement would appear in the terminal below.
<img src="{{ site.baseurl }}//docs/FPGA/Lucid%20V2/images/test_bench_images/Pasted image 20250417215831.png"  class="center_seventy no-invert"/>

### `print(format, exprs...)`
For `$print` with format, it allows you to format and variable into a print statement just like in any programming language.
<img src="{{ site.baseurl }}//docs/FPGA/Lucid%20V2/images/test_bench_images/Pasted image 20250417220241.png"  class="center_seventy no-invert"/>


### Creating custom functions

To create custom test function we use the `fun` syntax like the provided `fun tick_clock()` . 

You can create a simple function like this just to test your modules outputs.
<img src="{{ site.baseurl }}//docs/FPGA/Lucid%20V2/images/test_bench_images/Pasted image 20250417222547.png"  class="center_seventy no-invert"/>


Or a more useful function that use the test modules, like the example below that concatenate 2 5 bit value then assign to signal a and b for the adder module. FYI you can use the repeat function like a for loop in test bench **IF** you include a clock advancement in the repeat function. 
<img src="{{ site.baseurl }}//docs/FPGA/Lucid%20V2/images/test_bench_images/Pasted image 20250417225419.png"  class="center_seventy no-invert"/>

Another useful but simple function to create is:
<img src="{{ site.baseurl }}//docs/FPGA/Lucid%20V2/images/test_bench_images/Pasted image 20250417230034.png"  class="center_seventy no-invert"/>

Which would advance the clock cycle by a specified amount, so instead of writing a bunch of `$tick_clock`, you could just use one function. 

## Debugging & Tips forTest Bench

- Make sure all other lucid modules **do not** have error (highlighted red), else the run button will not show up

- If you want to use the output value of a module make sure to capture it after clock advancement, not before; else your output value would be 1 cycle behind.<img src="{{ site.baseurl }}//docs/FPGA/Lucid%20V2/images/test_bench_images/Pasted image 20250417230931.png"  class="center_seventy no-invert"/>

- If the terminal is stuck at running test bench, just close and reopen Alchitry Lab, it should not take more than a few seconds to run. Unless you advance the clock more than 20 times, then it will start to slow down. 

- You can simulate button presses by assigning the input 1 in 1 cycle and 0 the next cycle<img src="{{ site.baseurl }}//docs/FPGA/Lucid%20V2/images/test_bench_images/Pasted image 20250417232103.png"  class="center_seventy no-invert"/>
-  When creating a function remember to add the bit size for your arguments.