---
layout: default
permalink: /lab/lab4-part2
title: Lab 4 - Beta Processor with FPGA (Part 2)
description: Lab 4 handout covering topics from Beta Datapath
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
Written by: Natalie Agus (2023)

# Lab 4: Beta Processor with FPGA (Part 2)
{: .no_toc}

In this second part of the lab, we will learn about further implementations to **operate** our Beta CPU:
1. To run a tester code that demonstrate basic instructions: `OP/OPC`, control transfer (`BNE/BEQ/JMP`), and memory access (`LD/ST`) with a slowclock, faster clock, and manually
2. To view the system's states (e.g: `ma`, `ia`, `id`, etc) at the 7-seg as part of debug protocol
3. To view the system's output buffer at the 7-segment
4. To interact with the system (triggers hardware interrupt `irq`, handle I/O)
5. To trigger `ILLOP` (software interrupt) and demonstrate how it is handled 


## Beta Tester Source Code
We have written a simple 28-line tester code for your Beta inside `instruction_rom.luc`. Unfortunately, we don't have a nice auto-tester and auto-graded checkoff file like we have in `jsim`. We just need to either manually ensure that the outputs are correct by observing each **state** of the Beta (PC content, Regfile content, control signals, etc) at each instruction execution or write an automatic tester like you did for your ALU in Checkoff 1.

The instruction is as follows. Notice that the first instruction (address `0`) is placed at the bottom of the arrow to follow Verilog/Lucid array convention.

```verilog
   // Driver code, BR(reset) is the first instruction
  const INSTRUCTIONS = {
    32h6FE50000, // 0x06C JMP(R5)
    32hC0BF000C, // 0x068 ADDC(R31, 12, R5) --- reset handler, go to main in user mode 
    32h6FE50000, // 0x064 JMP(R5)
    32hC0BF000C, // 0x060 ADDC(R31, 12, R5) 
    32h649F000C, // 0x05C ST(R4, 0xC, R31) 
    32hC09F0001, // 0x058 ADDC(R31, 1, R4)
    32h649F000C, // 0x054 ST(R4, 0xC, R31) 
    32hC09F0002, // 0x050 ADDC(R31, 2, R4)
    32h649F000C, // 0x04C ST(R4, 0xC, R31) 
    32hC09F0003, // 0x048 ADDC(R31, 3, R4)
    32h649F000C, // 0x044 ST(R4, 0xC, R31) 
    32hC09F0004, // 0x040 ADDC(R31, 4, R4)
    32h649F000C, // 0x03C ST(R4, 0xC, R31) --- countdown 5, 4, 3, 2, 1 to be be displayed at beta_output
    32hC09F0005, // 0x038 ADDC(R31, 5, R4) --- illop handler, show generic countdown
    32h6FE50000, // 0x034 JMP(R5) --- execute main
    32hC0BF000C, // 0x030 ADDC(R31, 12, R5)  
    32h649F000C, // 0x02C ST(R4, 0xC, R31) --- store to output_buffer: Mem[12] to display the input
    32h609F0010, // 0x028 LD(R31, 16, R4) --- irq handler, load value from input_buffer: Mem[16]
    32h00000100, // 0x024 LONG(256) --- trigger illop when R3's value is eventually 0 after several loops to main_sub
    32h7BE3FFFB, // 0x020 BNE(R3, main_sub, R31) 
    32h607F0020, // 0x01C LD(R31, 32, R3) 
    32h643F0020, // 0x018 ST(R1, 32, R31)
    32h90410800, // 0x014 CMPEQ(R1, R1, R2) 
    32hC4210001, // 0x010 SUBC(R1, 1, R1) --- main_sub
    32hC03F0003, // 0x00C ADDC(R31, 3, R1) --- main
    32h77FF0007, // 0x008 BR(irq)
    32h77FF000C, // 0x004 BR(illop)
    32h77FF0019  // 0x000 BR(reset)
  };
```

Here's the equivalent instruction that can be run on bsim:

```nasm
.include beta.uasm

|| This code will not work as-is in bsim because in beta lucid we separate data memory and instruction memory
|| Edit the value of message and test_value below to run it in bsim

message = 0xC || replace to 0xCC for bsim, 0xC for lucid
test_value = 32 || replace to 128 for bsim, 32 for lucid

BEQ(R31, reset, R31) 	|| reset handler  0x00000000
BEQ(R31, illop, R31) 	|| illop handler  0x00000004
BEQ(R31, irq, R31)  	|| irq handler    0x00000008

||| USER PROGRAM |||
main: ADDC(R31, 3, R1)	|| main program
main_sub: SUBC(R1, 1, R1)
CMPEQ(R1, R1, R2)
ST(R1, test_value) 
LD(R31, test_value, R3) 
BNE(R3, main_sub, R31)
LONG(256) 		|| test trigger illop after 3 loops of main_sub
||||||||||||||||||||

|| IRQ HANDLER, KERNEL PROGRAM ||
irq: LD(R31, 16, R4)	|| load hardwired value at input_buffer (Mem[16])
ST(R4, message, R31)	|| store (display) input value at output_buffer (Mem[12])
ADDC(R31, 12, R5)	
JMP(R5)			|| jump to execute main program in user mode
|||||||||||||||||||||||||||||||||

|| ILLOP HANDLER, KERNEL PROGRAM ||
illop: ADDC(R31, 5, R4)	|| countdown: 5,4,3,2,1 to mimmick illop handling
ST(R4, message, R31)
ADDC(R31, 4, R4) 
ST(R4, message, R31)
ADDC(R31, 3, R4) 
ST(R4, message, R31)
ADDC(R31, 2, R4) 
ST(R4, message, R31)
ADDC(R31, 1, R4) 
ST(R4, message, R31)
ADDC(R31, 12, R5)
JMP(R5)			|| jump to execute main program in user mode
|||||||||||||||||||||||||||||||||||

|| RESET HANDLER, KERNEL PROGRAM ||
reset: ADDC(R31, 12, R5)
JMP(R5)			|| jump to execute main program in user mode
|||||||||||||||||||||||||||||||||||
```

{: .note}
We do not actually instantiate a memory unit with 32-bit addressing. Hence we do not physically separate Kernel program vs User program for this lab (demonstration purposes only). In reality, kernel program resides in the memory region with address MSB of `1`, and user program resides in the memory region with address MSB of `0`. To prevent User Program `main` from executing the `irq` handler that's placed right after it, we design the `main` to end with a constant `LONG(256)` which will **officially** trigger an `ILLOP` situation.


## Operating the Beta
It should be fairly easy for you to know what the tester program do. We have three handlers in address `0, 4, and 8` respectively to handle what has to be done in the event of `reset`, `illop`, and `irq`. The actual implementation of the handlers reside in label `reset`, `illo`, and `irq` respectively. 
1. When you have implemented the `beta_cpu` succesfully and compiled it, ensure that ALL switches are down. 
2. Load the compiled binary to the FPGA. At this point, your PC is pointing to `Mem[0x0]`. Use `io_dup[0]` to inspect the states of the Beta CPU. 
3. Press the `next` button: `io_button[5]` (right button) to execute the next instruction. 
4. Refer to `README.md` inside the repository for more information on how to operate the Beta CPU automatically.

### Debug Signals
As a reminder, `io_dip[0]` can be changed to "view" various states presented at `io_led[1]` and `io_led[0]` (16 bits of values at once). Simply set it to represent the values below, e.g: `0x3` means that `io_dip[0]` is set to `00000011` (turn the rightmost two switches on). Here are the exhaustive list:

1. `0x0`: MSB 16 bits of current instruction (id[31:16])
2. `0x1`: LSB 16 bits of current instruction (id[15:0])
3. `0x2`: LSB 16 bits of instruction address (ia[15:0])
4. `0x3`: LSB 16 bits of EA (this is also ALU output) (ma[15:0])
5. `0x4`: MSB 16 bits of EA (this is also ALU output) (ma[31:16])
6. `0x5`: LSB 16 bits of Mem[EA] (mrd[15:0])
7. `0x6`: MSB 16 bits of Mem[EA] (mrd[31:16])
8. `0x7`: LSB 16 bits of RD2 (mwd[15:0])
9. `0x8`: MSB 16 bits of RD2 (mwd[31:16])
10. `0x9`: LSB 16 bits of pcsel_out
11. `0xA`: LSB 16 bits of asel_out
12. `0xB`: LSB 16 bits of bsel_out
13. `0xC`: LSB 16 bits of wdsel_out
14. `0xD`: MSB 16 bits of instruction address. Useful to see PC31 (kernel/user mode) (ia[31:16])
15. `0xE`: LSB 16 bits of beta input buffer. This is a dff that's hardwired to reflect Mem[0x10]
16. `0xF`: LSB 16 bits of beta output buffer. This is a dff that's hardwired to reflect Mem[0xC]

We have also provided all this information in the repository's [readme](https://github.com/natalieagus/beta-fpga-starter). 

### The `slowclk`

{: .important}
The entire system runs on FPGA `clk`. However we need some other signal to **slow down** specifically the Beta CPU `PC` advancement so that we can **observe** the CPU's states like `id`,`ia`, `ma`, `mrd`, `mwd`, output of all muxes (pcsel mux, asel mux, bsel mux, and wdsel mux), as well as the value of I/O buffers. As such, we need <span style="color:red; font-weight: bold;">additional logics</span> to prevent the `PC` from advancing too fast.  

The Beta expects an input called `slowclk` so that you can slowly **observe** its execution (either by pressing `io_button[5]` or when `slowclock_edge` or `fastclock_edge` fires). The `slowclock_edge` turns `1` roughly once (for a single FPGA clock cycle) every 1.3s, and `fastclock_edge` is roughlt 4 times faster than `slowclock_edge`. You can use `io_dip[2][6]` to enable/disable `fastclock`.

{: .important}
It is <span style="color:red; font-weight: bold;">necessary</span> for `slowclock` and/or `fastclock` period to be at least <span style="color:red; font-weight: bold;">5 times longer</span> than Alchitry Au FPGA's because of how `fsm motherboard` is designed in `au_top.luc` (see next section). That is, the minimum index of `frequency_divider` in `au_top.luc` that can be used for `slowclock` and/or `fastclock` is `2`.

Right now in `au_top.luc`, we are using index `27` and `25` so that you have sufficient time to observe its output:

```verilog
    // driving the beta 
    slowclock_edge.in = frequency_divider.value[27];
    fastclock_edge.in = frequency_divider.value[25];
```

## User I/O
The system is designed to have the following input and output unit for user interaction:
- **Input**: `io_button[2:0]` triggers interrupt (hardwired). This is the up, middle, and down button. 
- **Output**: set `io_dip[0]` to: `00001111` (`0x0F`) and the output will be displayed at the 7seg. This is your "screen".

When `io_button[0]`, `io_button[1]`, or `io_button[2]` is pressed, we write some logic in `au_top.luc` to store its encoding to `system_input_buffer` and `system_output_buffer` (32 bit dff) defined in `motherboard.luc`.  

```verilog
    // in au_top.luc

    // connect hardware interrupt button 
    interrupt_button_conditioner.in = io_button[2:0];
    interrupt_button_edge.in = interrupt_button_conditioner.out;
    motherboard.irq = interrupt_button_edge.out; // IRQ as long as any of of the buttons[2:0] is pressed

    ...

    // display the content of output_buffer
    h0F: // LSB 16 bits of system_output_buffer 
      io_led[1:0] = {motherboard.output_buffer[15:8], motherboard.output_buffer[7:0]};
      seg.values = {motherboard.output_buffer[15:12], motherboard.output_buffer[11:8], motherboard.output_buffer[7:4],motherboard.output_buffer[3:0]}; 
```

```verilog
    // in motherboard.luc

    // store the button press to input buffer 
    if (|irq){
      if (irq[0]){
            system_input_buffer.d = 32hB0;
      }
      else if (irq[1]){
            system_input_buffer.d = 32hB1;
      }
      else if (irq[2]){
            system_input_buffer.d = 32hB2;
      }
    }
```

These buffers are then synchronized to a specific region in `memory_unit` so that your Beta CPU can access its values. 

## The Motherboard
In practice, a motherboard is the main printed circuit board in general-purpose computers It holds and allows communication between many of the crucial components of a system: the CPU, the memory unit, and provides **connectors** for peripheral (I/O) devices.

The module `motherboard.luc` is where we instantiate our major hardware components:
1. The Beta CPU 
2. The memory unit (both data and instruction)
3. System input and output buffer (`32` bits each). This serves as a buffer that holds current input or current output value. The motherboard is connected to actual buttons (input) and LEDs (output) in `au_top.luc`.
4. The instruction ROM (for initial loading of instruction)

We define their connections and added a simple `fsm motherboard` that <span style="color:red; font-weight: bold;">runs the Beta</span> and handle I/O:
1. Upon start up, `LOAD` instructions from instruction rom to the instruction memory part of the memory unit. We do not use the ROM directly to simulate a more realistic approach whereby upon boot up, we will load our data from **disk**  (signified by this ROM) to our physical memory. 
2. Once all instructions are loaded, we go to the `RUN` state. 
3. In the `RUN` state, we mostly "idle" and wait for the next `slowclk` to fire (advance the PC). 

### Storing to `REGFILE`
While waiting for the `slowclk`, our Beta has received `id` and `mrd` (whenever applicable). It is also continuously supplying all output to the `memory_unit`: `ia`, `wr`, `ma`, and `mwd`. In other words, it **continuously** execute the same instruction over and over for the duration of the period of `slowclk`. To avoid having <span style="color:red; font-weight: bold;">repercussions</span> we need to take care of the `werf` signal in the `regfile_unit`. 

It should **NOT** continuously write to `regfile_unit`. Notice this line in `regfile_unit.luc`:

```verilog
    // do not write anything to the regfile unless PC advances 
    regfile.write_enable = 0;
    if (slowclk) {
      regfile.write_enable = werf;
    }
```

The purpose of this line is to avoid instructions that read from and write to the <span style="color:red; font-weight: bold;">same register</span> e.g: `ADDC(R0, 1, R0)` to not be executed many times for the duration of the `slowclock` period. Remember that <span style="color:red; font-weight: bold;">all our sequential logic devices still run on</span> `clk`, which is the actual FPGA clock signal. We simply add additional logic in the `pc_unit.luc` so that we *advance* our instruction when `slowclk` fires. Suppose for each period of `slowclk`, 200 FPGA `clk` cycles has passed. If we do not set `regfile.write_enable = 0`, we are effectivelly running the instruction `ADDC(R0, 1, R0)` for 200 times (instead of once!) and we will have the value 200 inside `R0` instead of `1` as per the instruction. 

{: .warning}
For most instruction, it is okay to **repeatedly** execute that instruction many times, once per `clk` cycle while waiting for the next `slowclk` rising edge so at first blush it seems hard to come up with the conclusion that `regfile.write_enable` must be set to 1 for just exactly one `clk` cycle and `0` otherwise. For instance, `ADD(R1, R2, R3)` will repeatedly write the content of `R1` + `R2` and store it at R3, and `ST(R5, destination, R31)` will repeatedly store the content of `R5` to `Mem[destination]`. The value in `R3` for the `ADD` instruction will remain the same even though we execute this instruction many times. The same works for the `ST` instruction. However, if we read-and-modify the same memory region in the same clock cycle as we do with the Regfile: `ADD(R0, R0, R0)`, or `MULC(R0, 3, R0)`, then we need to strictly run this instruction exactly <span style="color:red; font-weight: bold;">once</span>. Notice that only arithmetic `OP` and `OPC` will suffer from this bug. This bug is not possible in `ST/LD/LDR` because we can't `ST` to and `LD` from the same memory region in the same cycle.


Finally, when `slowclk` turns `1` (rising edge), `PC` is set to advance <span style="color:red; font-weight: bold;">in the next FPGA clock cycle</span>. In this current cycle (the `clk` cycle when `slowclk` just had its rising edge), we are still executing the <span style="color:red; font-weight: bold;">current</span> instruction. This is when we <span style="color:red; font-weight: bold;">capture</span> the computed arithmetic output from the current instruction into the REGFILE.  


### Memory-Mapped I/O

We use [Memory-Mapped I/O](https://www.baeldung.com/cs/memory-mapped-vs-isolated-io) design to access input/output values as opposed to Isolated-Mapped (also known as port-mapped) IO. 

As a result, we need to systematically **update** some region of the `memory_unit` to reflect the contents of `system_input_buffer`, and update `system_output_buffer` to reflect the content of a certain memory region in the `memory_unit`. 

{: .note}
We choose `memory_unit` address `0xD` as the region to hold the input value, and we choose `memory_unit` address `0xC` as the region to hold the current output value. 

That is if we were to `STORE` any value to `Mem[0xC]`, it will reflected at the "output" of the motherboard. In practice, this will be the buffer containing values to be displayed at your screen. Similarly, if any input button `io_button[2:0]` is pressed, it will trigger an <span style="color:red; font-weight: bold;">INTERRUPT</span>, and you can find the **encoding** of the currently pressed button in `Mem[0xD]`. In practice, this will be the buffer containing the currently received input (e.g: keyboard keypress). 

## Sample Run

This section illustrates what should be observed on your FPGA IO Shield. When you compile the program above and flash it to your FPGA for the first time with **all** of its dip switches down, you will see the following as the first 16 bit of your instruction:

<img src="{{ site.baseurl }}//assets/images/lab4-part2/2023-03-16-17-39-55.png"  class="center_fifty"/>

This corresponds to `BR(reset): 0x77FF0019`. Pressing the `next` button (`io_button[4]`) will bring you to address `0x068` which is the `reset` handler.

{: .note}
We assume you know which dip switch to set to view these states: `ia`, `id`, etc. 

<img src="{{ site.baseurl }}//assets/images/lab4-part2/2023-03-16-17-42-30.png"  class="center_fifty"/>

The first line of instruction in the `reset` handler is `ADDC(R31, 12, R5): 0xC0BF000C`: 

<img src="{{ site.baseurl }}//assets/images/lab4-part2/2023-03-16-17-43-35.png"  class="center_fifty"/>

Press `next` one more time and confirm you're met with the `JMP(R5)` instruction (the MSB 16):

<img src="{{ site.baseurl }}//assets/images/lab4-part2/2023-03-16-17-44-42.png"  class="center_fifty"/>

At this point, the content of `Reg[R5]` is address `0x00C`. Pressing `next` will bring your PC to point to this address with instruction `ADDC(R31, 3, R1): 0xC03F0003`.

<img src="{{ site.baseurl }}//assets/images/lab4-part2/2023-03-16-17-46-06.png"  class="center_fifty"/>

<img src="{{ site.baseurl }}//assets/images/lab4-part2/2023-03-16-17-46-34.png"  class="center_fifty"/>

Continuously press `next` until you reach address `0x020`, the `BNE(R3, main_sub, R31)` instruction:  

<img src="{{ site.baseurl }}//assets/images/lab4-part2/2023-03-16-17-47-01.png"  class="center_fifty"/>

At this point, the content of `R3` is 2, which means that you will be looped back to `main_sub` (adress `0x010`). Press `next` to confirm the content of PC is indeed `0x010`:

<img src="{{ site.baseurl }}//assets/images/lab4-part2/2023-03-16-17-48-05.png"  class="center_fifty"/>

### Triggering `ILLOP`

The content of `R3` will be reduced by 1 in each loop to `main_sub`, until eventually its content is `0`. This will cause `BNE(R3, main_sub, R31)` to not branch, and the PC will execute instruction at address `0x024` instead:

<img src="{{ site.baseurl }}//assets/images/lab4-part2/2023-03-16-17-49-45.png"  class="center_fifty"/>

The instruction at address `0x024` is `LONG(256)`, which is <span style="color:red; font-weight: bold;">not a valid Beta instruction</span>. Executing this will trigger an `ILLOP`. When you press `next`, you will be brought to address `0x004` which contains instruction `BR(illop)`. 

<img src="{{ site.baseurl }}//assets/images/lab4-part2/2023-03-16-17-50-52.png"  class="center_fifty"/>

The `illop_handler` resides at address `0x038`. Surely enough when you press `next`, the PC will point to address `0x038`, which is the beginning of the `illop_handler`:

<img src="{{ site.baseurl }}//assets/images/lab4-part2/2023-03-16-17-52-06.png"  class="center_fifty"/>

### The `ILLOP` handler

The ILLOP handler does a very simple thing, which is simply storing the value `5, 4, 3, 2, 1` to a particular memory address `message`.

{: .note}
`message` is set to be `0xC` in our FPGA, which is a memory-mapped region to showcase our "output" to the `system_output_buffer`. 

```nasm
|| ILLOP HANDLER, KERNEL PROGRAM ||
illop: ADDC(R31, 5, R4)	|| countdown: 5,4,3,2,1 to mimmick illop handling
ST(R4, message, R31)
ADDC(R31, 4, R4) 
ST(R4, message, R31)
ADDC(R31, 3, R4) 
ST(R4, message, R31)
ADDC(R31, 2, R4) 
ST(R4, message, R31)
ADDC(R31, 1, R4) 
ST(R4, message, R31)
ADDC(R31, 12, R5)
JMP(R5)			|| jump to execute main program in user mode
|||||||||||||||||||||||||||||||||||
```

Advance to address `0x040`. 

<img src="{{ site.baseurl }}//assets/images/lab4-part2/2023-03-16-17-57-00.png"  class="center_fifty"/>

Then set `io_dip[0] = 0xF` to view the content of `system_output_buffer`. You shall see the value `5` there. 

<img src="{{ site.baseurl }}//assets/images/lab4-part2/2023-03-16-17-57-09.png"  class="center_fifty"/>

{: .note}
To witness it going from `5` to `4, 3, 2, 1`, simply switch up `io_dip[2][7]`. This triggers the `auto` execution mode with the **slow** clock. If you are impatient, you can switch up `io_dip[2][6]` as well and it will advance the PC at a faster rate. 
