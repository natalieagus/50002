---
layout: default
title: Data Structure and Hardware Optimisation
permalink: /project/2d/dat-struct
parent: 50.002 2D Project 
grand_parent: 1D&2D Project (Details)
nav_order: 1
---

* TOC
{:toc}

# Data Structure and Hardware Optimisation
{: .no_toc}

{:.note}
This is largely related to **OBJECTIVE 1.**


Optimizing data structures within the realm of FPGA-based game development, particularly in scenarios involving ALUs, datapaths, and instruction set architectures (ISAs), presents a distinct challenge. Unlike the methodologies employed in higher-level programming languages, such as object-oriented programming (OOP), classes, and abstraction, the approach in FPGA context demands a different, **more hardware-oriented strategy**.

Here are some suggested  approaches to consider. You are free to come up with your own. 


### Custom Data Structures for Game Logic

Tailor your data structures specifically for the game’s logic. For instance, if the game involves grid-based movements or operations, a well-optimized grid data structure can be more effective than a standard list or array.

If your game uses large data sets (like maps or complex game states), consider **data encoding and compression** techniques to reduce the size of these data structures.

### Simplify Circuit Design

Aim to simplify the circuit design without compromising functionality. This might involve **minimizing** the number of components, using **multi-function components**, or redesigning the circuit for more **efficient logic**.

**For example:** Suppose you need to implement a circuit that produces a "1" output (high) when the input is a 3-bit binary number that falls within the range 2 to 6 (inclusive) and a "0" output (low) for all other inputs. In other words, you want to detect whether the input is in the range [2, 6].

One way to implement this logic circuit is by using a combination of numerous AND, OR, and NOT gates. For example, you could create a complex logic circuit with multiple gates like this:

```verilog
out = (in[0] & ~in[1] & in[2]) |
      (~in[0] & in[1] & in[2]) |
      (in[0] & in[1] & in[2]) |
      (~in[0] & ~in[1] & in[2]) |
      (in[0] & in[1] & ~in[2]) |
      ...
      (~in[0] & ~in[1] & ~in[2])
```

If you convert the above boolean expression into a **minimal** sum of product, you’d get:

```verilog
out = ~in[2] & in[1] & in[0];
```

This simplified logic circuit efficiently detects whether the input falls within the range [2, 6] using just three logic gates, and it's much easier to understand than the convoluted logic example.

Another example: Suppose you want to check if 3 numbers: A, B, and C are **equivalent**. You can use bitwise `XOR` and bitwise `AND` , and reduction `AND` to compute it in a single step. 

> **Note that you should prioritize your ALU instead**, this example is made in the case that you need to do so in peripheral units.

```verilog
// out is 0 only if all 3 numbers are equal, and 1 otherwise. 
out = |((A ^ B) | (B ^ C) | (A ^ C))
```


### State Machine Efficiency

You might utilise state machines for control logic. Ensure that state transitions are **efficient**, possibly by reducing the complexity of the data involved in each state. 

You can look at various **State Minimization Algorithms** that aims to reduce the number of states **without** changing its functionality. Create **Algorithmic State Machine (ASM) Charts** to visualise and simplify your state machine logic. 

> ***Advanced tip:** The Quine-McCluskey algorithm and the Karnaugh Map method are two classical approaches for state minimization. Please do some research.*


You can also choose an **efficient way to encode the states.** It significantly reduce the complexity of the state machine. 

- One common method is Binary Encoding,
- but more efficient methods like **One-hot Encoding** or **Gray Code** can be used depending on the specific requirements of the design.

Consider whether a **Moore or Mealy state machine** is more appropriate for your application. Moore machines can be simpler since their outputs depend only on states, not inputs. However, Mealy machines can sometimes have fewer states since their outputs can change with inputs.

Apart from that, consider **hierarchical state machines** by breaking down complex state machines into a hierarchy of simpler state machines. This can make the overall design more **manageable** and can **reveal opportunities** for optimization.

In some cases, designing a **custom algorithm** tailored to the specific logic and requirements of your game can be the most efficient approach.

**Remember to pick the BEST sounding approach to your application, please do NOT attempt to do all of the above.**


### Leverage on FPGA capabilities and Pipeline Optimization

In FPGA design, **pipelining** can significantly speed up the processing. Design your data structures to fit well with a pipelined approach, where each stage of the pipeline can efficiently access and process the data. This is useful not only in terms of computation speed but also project management standpoint. A well designed and pipelined FPGA design aids rapid prototyping and efficient debugging.

First, you **should** divide the overall task into smaller, manageable stages that can be executed in **sequence**. Each stage should perform a part of the task and pass its result to the next stage. This is similar to an **assembly line** where each stage contributes to completing the overall process. This involves **inserting registers (DFFs)** at intermediate stages to break down long paths into shorter, more manageable segments.

You should also ensure that each stage of the pipeline takes approximately the **same amount of time to prevent bottlenecks** (that is you don’t need to significantly slow the clock for your prototype, and may use the default 100Mhz clock onboard). 

- **Recall:** If one stage is significantly slower than others, it will limit the overall throughput of the pipeline.
- Also, please the optimal depth of the pipeline. A deeper pipeline can increase throughput but may also add latency and complexity. Find a balance based on the specific requirements of your application.

In cases where the task can be divided into independent sub-tasks, configure multiple **parallel** pipelines. This can significantly increase throughput, especially for data-intensive tasks. **Note that this does not always apply to all cases**.

You can consider **using D Flip Flops (DFF), ROM and BRAM Effectively**: DFF, ROM (Read-Only Memory) and BRAM (Block RAM) are essential components in FPGA for storing data and instructions. Efficient use of these memory components is crucial in pipeline design for several reasons:

- ROM can store **unchanging** data or instructions, which can be quickly accessed by different stages of the pipeline.
- BRAM, being a form of **volatile** memory, is suitable for **storing** and **retrieving** large amount data that might change during the operation of the pipeline. It's faster than external memory solutions, which is beneficial for high-throughput pipelines.
- DFFs are **storage** elements that consume FPGA resources more than ROM/BRAM, but fastest to access. Each DFF typically consists of multiple logic elements, such as LUTs (Look-Up Tables), and consumes more area than simple memory elements like ROM or BRAM. By using ROM or BRAM instead of DFFs for storage of constant data or lookup tables, you can save **valuable FPGA resources** (read: **less compile time!**) and reduce the overall area utilization of your design.

You can consider **encoding** your data in a more efficient way. Only use DFFs when **necessary** for **sequential** logic and **state** **storage**. Carefully **consider** how many DFFs are required in your **REGFILE** unit so as not to waste resources: 

- **Memory Element Addressing**: In cases where you use ROMs or BRAMs, the addressing scheme for these memory elements can affect resource usage. An efficient encoding for the memory addresses can minimize the number of address lines required, reducing the overall logic complexity and improving performance.
- **Signal Encoding and Data Compression**: Efficient encoding of data and signals can help reduce the number of DFFs needed to store or process that data. Data compression techniques or using a more compact representation can result in fewer DFFs and more efficient resource utilization.

You may also attempt to implement your 1D project as **an ISA (Instruction Set Architecture).** An ISA in FPGA context relates to the design of **custom processors** or specific control logic within the FPGA. You can start with implementing Beta ISA (like in Week 9 & 10 Lab), and expand to to involve: 

- **Defining custom instruction**s that are tailored to the specific tasks of your pipeline, thereby optimizing the processing stages.
- Efficiently handling these instructions in different stages of the pipeline, which might include **decoding**, **executing**, and **managing** the results.

If you are implementing an ISA, you **shall consider carefully** how input and output values are accessible by the processing units. In some cases, **designing custom instructions** specifically for input/output operations can streamline these processes, making them more efficient. Here are a few approaches:

1. **Memory-Mapped I/O**:
    - In this method, certain blocks of the FPGA’s addressable memory space are dedicated to I/O operations.
    - When the processor writes to or reads from these specific memory addresses, it's actually interacting with external devices or ports.
    - This approach allows the use of standard memory instructions for I/O operations, simplifying the programming model.
    - It's particularly useful for complex I/O operations where multiple data registers or control registers are involved.
2. **Direct I/O Access**:
    - Direct I/O access involves **dedicated custom instructions** in the ISA for input and output operations.
    - This method bypasses the regular memory space, using special I/O instructions that directly interact with the I/O ports.
    - It can be more efficient for simple I/O operations but might require more complex instruction decoding.
3. **Interrupt Handling or Polling**:
    - In systems where I/O operations need to be event-driven, implementing an interrupt system can be beneficial.
    - Interrupts can signal the processor within the FPGA to handle I/O events, improving the efficiency of the system.
    - You can also consider **polling** where the CPU periodically checks for the presence of input in the device buffer or dedicated memory address. You should choose your approach based on your own use cases.