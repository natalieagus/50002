---
layout: default
permalink: /notes/turingmachine
title: Turing Machine and Programmability
description: A more powerful machine than the Finite State Machine
nav_order: 8
parent: Hardware Related Topics
---


* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design


# Turing Machine and Programmability
{: .no_toc}
[You can find the lecture video here.](https://youtu.be/cmfDBAiogA0) You can also **click** on each header to bring you to the section of the video covering the subtopic. 

{:.highlight-title}
> Detailed Learning Objectives
>
> 1. **List out the Limitations of Finite State Machines (FSMs)**
>    - Explain that FSMs are limited by their lack of memory beyond the current state
>    - Explain that FSMs are unable to solve problems requiring knowledge of state visitation history, such as detecting palindromes or checking balanced parentheses.
> 2. **Describe the Concept and Functionality of Turing Machines**
>    - Explain what Turing Machine is. 
>    - Defend the Turing Machine as a mathematical model capable of performing computations that FSMs cannot, including handling infinitely long inputs via its tape mechanism.
>    - Defend how Turing machines as a more capable model of computation as opposed to FSMs.
> 3. **Explain the Basic Operation of a Turing Machine**
>    - Explain how a Turing Machine reads, writes, and manipulates data on an infinitely long tape using a set of defined states and transitions.
> 4. **Illustrate the Process of Operating a Turing Machine**
>    - Illustrate the step-by-step process of how a Turing Machine moves through its tape, processes data, and utilizes its halt and start states effectively.
> 5. **Analyze Specific Examples of Turing Machine Applications**
>    - Examine detailed examples such as an Increment Machine and a Coin Counter Machine to see how Turing Machines handle complex computations and scenarios beyond the capability of FSMs.
> 6. **Outline with the Concept of a Universal Turing Machine**
>    - Explain how a Universal Turing Machine simulates any other Turing Machine, representing the theoretical foundation for modern general-purpose computers.
> 7. **Explain Church’s Thesis and Computable Functions**
>    - Discuss the implications of Church's Thesis regarding the capabilities of Turing Machines and the definition of computable functions.
> 8. **Identify Examples of Uncomputable Functions**
>    - List out functions that cannot be computed by any algorithm, illustrating the limits of computational theory.
> 9. **Evaluate the Impact of Turing Machines on Computer Science**
>    - Assess how the development of Turing Machines and their universal capabilities have revolutionized approaches to computational tasks and machine design.
> 10. **Summarize the Principle of Programmability in Computing**
>    - Summarize the significance of the programmable nature of computers, facilitated by the conceptual framework provided by Turing Machines and their ability to emulate an infinite set of instructions.
>
> These learning objectives equip students with a deep understanding of computational models, particularly focusing on the capabilities and limitations of Finite State Machines and Turing Machines, thereby providing a solid foundation in theoretical computer science that underpins modern computing technologies and concepts.

## [Overview](https://www.youtube.com/watch?v=cmfDBAiogA0&t=0s)

A Finite State Machine does not keep track of the number of states it *visited*, it is only aware of the current state *it is in*. Therefore it is unable to solve problems like detecting palindrome or checking balanced parenthesis. There is no way to tell whether you have visited a state for the first time, or for the $$n^{th}$$ time. 

The Turing Machine is a **mathematical** model of computation that defines an abstract **machine**, invented by Alan Turing in 1936. It is a machine that is able to implement **any** functionalities that FSM can implement, and it doesn't face this limitation that FSM has. 

{: .note}
The Turing Machine is loosely referred to as an "infinite state machine" due to its ability to move along an infinite tape. The tape, theoretically, has an unlimited length, allowing the Turing machine to transition between an infinite number of states. **However**, this is **not** to be confused with certain context of infinite state machine: systems with continuous state spaces, allowing for a continuous range of values such as analog machines or continuous systems in control theory.

## [Basics of Turing Machine](https://www.youtube.com/watch?v=cmfDBAiogA0&t=111s)

<figure class="center_full">
<img src="/50002/assets/contentimage/others/slice1.png" class="center_seventy" />
<figcaption style="text-align: center;">Dino-themed TM, courtesy of Beverley, a 50002 (2022) student.</figcaption>
</figure>

A Turing Machine is often represented as an "arrow" and a series of input written on a "tape", as drawn in the figure below:
 
<img src="https://dropbox.com/s/n41r5z8o2p5dpea/tmeg.png?raw=1"  class="center_fifty" >

### How it Works
The idea is to **imagine** that we have a physical machine (like a typewriter machine or something), called the Turing Machine, which can read a sequence of inputs written on an *infinitely long* "*tape*" (its basically an array).


We can write onto the currently pointed location of the tape  (and also read from it).
Like an FSM, the Turing Machine also has a **specification**, illustrated by the truth table above. Building a Turing Machine with specification $$K$$ allows it to behave based on $$K$$ when fed any array of inputs. 

The **pointer** of the machine (black arrow)  represents our current input read on the tape. 
To operate the machine, we can *move the tape* left and right to shift the arrow, or you can *move the arrow* left and right. They are the same. 

There exists  a **HALT** state which signifies the end state, and a **START** state similar to FSM. 

{: .note}
In order to move the arrow  to the **right**, we need to equivalently move the tape to the **left**. **In practice**, we move the tape, not the arrow.  



### Operating a Turing Machine

Referring to the figure above, we know that the start state is $$S_0$$, and as shown the black arrow is reading an input: $$1$$.

Then look at the **functional** specification table to know where to go next.
- **Step 1**: From the **diagram**, our **current** state is $$S_0$$ and input is $$1$$. 
  - From the **table**, this corresponds to the **first** row -- it tells us that we can write $$1$$ to the tape,
- **Step 2**: And then *move the **tape*** to the *right* (or equivalently move the **arrow** to the *left*).

{: .important}
It is important to write first, and then move the tape/arrow, not the other way around. So the sequence at each time step is: *read*-***write***-*move*. 

Repeat step (1) and (2) until we arrive at a **HALT** state. Depending on what we write onto the tape, we will end up with a different sequences on the tape (different than the starting sequence) when we reach a **HALT** state. 


## Example 1: [An Increment Machine](https://www.youtube.com/watch?v=cmfDBAiogA0&t=274s)

Consider a machine whose job is to add $$1$$ to any *arbitrary* length input and present that as the output. An FSM can do this as well if the number of bits of input is **finite**, but it will run into a problem if the input bit is *too* *large*. An example of a 3-bit counter FSM is:

<img src="https://dropbox.com/s/j6p4riuu67t8l6l/fsm_cntr.png?raw=1" class="center_fifty"  >

{: .note-title}
> Key Feature
> 
> The key feature for a Turing Machine is this *infinite* tape (hence its capability of processing arbitrary input).

A Turing Machine with the following specification can easily solve the problem and is capable to accept any **arbitrarily** long input with **less number of states**:

<img src="https://www.dropbox.com/s/2ljstii81t6nn7b/tmincr.png?raw=1"  class="center_seventy" >

With this sample input, the Turing Machine runs as follows:
<img src="https://dropbox.com/s/34dxvi3tdwz1shu/tmi1.png?raw=1" class="center_fifty"  >

### Initial Condition and Overview
At `t=0` The **initial** state of the machine is `S_0`, and the machine is currently reading $$*$$ as an input (beginning of string). According to the first row of the table, it should write back a $$*$$, and then move the tape to the left.  In fact, the machine keeps moving the tape to the left until the end of the string (+) is found: 
<img src="https://dropbox.com/s/dnnziq8lk0uukj9/tmi2.png?raw=1"  class="center_fifty" >

### First Iteration
The machine then starts adding 1, and moving the tape to the right, keeping track of the *carry over* value: 
<img src="https://dropbox.com/s/gr4kh2zof2ubwxx/tmi3.png?raw=1"  class="center_fifty" >

### The "Loop"
This **continues** until it reads back the beginning of the string (*):
<img src="https://dropbox.com/s/oqqxqejul2zcoef/tmi4.png?raw=1"  class="center_fifty" >

### Halt
The **final** output is written on the tape, and we should have this output in the end when the machine halts:
<img src="https://dropbox.com/s/m58690zk66gzj9q/tmiend.png?raw=1"   class="center_fifty">

## Example 2: [A Coin Counter Machine](https://www.youtube.com/watch?v=cmfDBAiogA0&t=690s)

Suppose now we want to implement a machine that can receive a series of 10c coins, and *then* a series of 20c coins (for simplicity, we can't key in 10c coins anymore once the first 20c coin is given). We can then press an END button in the end once we are done and the machine will:
* `ACCEPT (1)` if the value of 10c coins inserted is equivalent to the value of 20C coins inserted, or
* `REJECT (0)` otherwise. 

A sample input will be:
* `10 10 10 20 20 20 20 END` (`REJECT`)
* `10 10 10 10 20 20 END` (`ACCEPT`)

For simplicity, an input as such `10 20 10 20 END` will not be given (although we can also create a Turing machine to solve the same task with this input type, but the logic becomes more complicated). 

We cannot implement an FSM to solve this problem because there's no way an FSM can *keep track* how many 10s are keyed in so far (or 20s), and we can't possibly create a state for each possible scenario,

<img src="https://dropbox.com/s/f3nqor85tmotr35/fsm_fail.png?raw=1"  class="center_seventy" >

However, a Turing machine with the following specification can solve the problem:
<img src="https://dropbox.com/s/xrz0i5o8246ay7r/tmcounter.png?raw=1"  class="center_seventy"  >

### Initial State
Given an input as follows and starting state at `S_0` (at `t=0`):
<img src="https://dropbox.com/s/d87trx48ssoefnl/tm1.png?raw=1"   class="center_fifty">

### The "Loop"
The state of the machine is as follows at `t=2`:
<img src="https://dropbox.com/s/zse8nwcf94c5u6o/tm2.png?raw=1"  class="center_fifty" >

It will try to find the first '20', and has this outcome and state at `t=5` once the first '20' is found:
<img src="https://dropbox.com/s/httistkevl5a6i8/tm3.png?raw=1"  class="center_fifty" >
  
It will then try to find the leftmost unprocessed '10':
<img src="https://dropbox.com/s/5tzhbeplzr8k39v/tm4.png?raw=1"  class="center_fifty" >

The whole process is repeated until there's no more 10. The Machine now will try to find `END`:
<img src="https://dropbox.com/s/w96o00c9cx15oro/tm5.png?raw=1" class="center_fifty"  >

### Halt
Once found, it halts and wrote the final value (`ACCEPT`):
<img src="https://dropbox.com/s/4t9kyrtvlsfjh7m/tm6.png?raw=1"  class="center_fifty" >

{: .new-title}
> Practice!
>
> You can try the running the machine using another set of input that will result in a `REJECT`. Can you solve the problem with **less** states? Why or why not?

## [Turing Machine as a Function](https://www.youtube.com/watch?v=cmfDBAiogA0&t=1211s)

  
Given a Turing Machine with a particular specification $$K$$ (symbolised as $$T_K$$), and a tape with particular input sequence $$x$$ (lets shorten it by calling it simply Tape $$x$$), we can define  $$T_K[x]$$ as running $$T_K$$ on tape $$x$$, 
-  We can **produce** $$y = T_K[x]$$, where $$y$$ is the output of a series of binary numbers on that corresponding Tape $$x$$ after running $$T_K$$ on $$x$$. 
-  **Running** $$T_K[x]$$ therefore can be seen as calling a *function* that takes in input $$x$$ and produces output $$y$$. 

{: .new-title}
> Think!
>
> **What kind of functions can Turing Machine compute**? Or more generally, *what* can be computed and what *type*(s) of machines can compute them? 


## [Church's Thesis and Computable Function](https://www.youtube.com/watch?v=cmfDBAiogA0&t=1350s)

The Church's Thesis states that: **Every discrete function computable by any *realisable* machine is computable by some Turing machine $$i$$**.

### Computable Function

{: .new-title}
> Computable Function
>
> A function is **computable** if there exists an *algorithm* that can do the job of the function, i.e. given an input of the function domain it can return the corresponding output. Any computable function can be incorporated into a *program* using `while` **loops**. 

### Inputs

The input to this function can be anything *discrete* (integers):
- A list of numbers $$\rightarrow$$ can be encoded large integer
- A list of characters $$\rightarrow$$ also can be encoded a large integer
- A matrix of pixels $$\rightarrow$$ also  can be encoded a large integer 
- etc, you get the idea.

Hence whatever inputs $$x$$ we put at the tape, ultimately we can see them as *a very large integer*.

{: .highlight}
Can't wrap your head around it? Look up ASCII encoding and try to translate "Hello World" into binary.  You probably will get an output like:
`01001000 01100101 01101100 01101100 01101111 00100000 01010111 01101111 01110010 01101100 01100100`. Now convert this into decimal, its a very large integer isn't it?

### Realisable Machines

A realisable machine is **literally** any machine that can take a physical form which we **can use**. There are so many examples: any machine that help you sort, search, re-order objects, find maximum or minimum (of something), perform mathematical operations (multiply, add, comparisons, etc), the list goes on.

### Wrapping it up
So what Church's Thesis tell us is that there always exist a Turing Machine $$i$$ that can compute *any function* that is computable by any *realisable* (i.e: able to be achieved or happen, or any mechanical) machine. 

## Uncomputable Function
Any function which we can solve by writing a program is a computable function as we seen above. For instance, obviously simple functions like $$f(x) = 1$$ is **computable** using the assignment: `x=1`, and $$f(x)=x+1$$ is computable using the assignment `x = x + 1`. 

Just as there are infinitely many computable functions, there are also infinitely many **uncomputable** functions. Not every well-defined (integer) function is computable. 

{: .new-title}
> Uncomputable Function
>
> Simply put, functions that cannot be computed by any algorithm are uncomputable functions. If we can't write a program for a computer to solve it, then it is an uncomputable function. 

A few famous examples are the as follows: 
- The `n`-state [Busy Beaver Problem](https://catonmat.net/busy-beaver): what is the largest finite number of `1`s that can be produced on blank tape using a Turing machine with `n` states? 
- [The Tiling Problem](https://sites.pitt.edu/~jdnorton/teaching/paradox/chapters/impossible_computation/impossible_computation.html): determine whether a set of tiles—constrained by rules that the colors on their edges have to match—can be positioned so that they completely fill the plane. 
- [Post Correspondence Problem](https://en.wikipedia.org/wiki/Post_correspondence_problem): A kind of puzzle that is best to be explained using examples [here](https://www.geeksforgeeks.org/post-correspondence-problem/).
- And of course: the Halting Function: Determine whether a program will "crash" (or halt) on a given input, like some kind of *crash detector*.

{: .note}
You are <span style="color:red; font-weight: bold;">NOT</span> required to come up with a proof on whether a given function is computable or uncomputable. Do look up any of the examples above and trace its proofs **out of your own hobby**. You can also read about the Halting Function in the [appendix](#the-halting-function) below. It is a classic example of uncomputable function. 


## [Universal Function](https://www.youtube.com/watch?v=cmfDBAiogA0&t=2561s)

{: .new-title}
> Definition
> 
> The universal function is defined as:
> 
> $$ f_{U}(K,j) = T_K[j]$$ 

Let's say we can write a specification $$U$$ that realises this function. This means that a Turing Machine that runs $$U$$ is a Turing machine that is capable of ***simulating* an arbitrary Turing machine on arbitrary input**. This is called a **Universal Turing Machine**.

The universal machine essentially achieves this by reading both the specification of the machine $$K$$ that we are going to **simulate** as well as the input $$j$$ to that machine from its own tape. A more familiar term for this "specification" is simply a *program*.

{: highlight}
The universal function is a model of our **general purpose computers**. **Our computers are essentially a machine that simulates other machine**: it is a calculator, a gaming console, a video player, a music player, a telephone, a chatting device, and many others. 

Our computer can emulate and be **any** machine when we task it to run any program and its input. It can be a text editor, video game emulator, video player, music player, radio, telephone, camera, and many more. 

### Example

Back to the notion of universal function $$U$$ above, a Universal function has two inputs $$K$$, and $$j$$. Let's build a Turing machine with this specification, and symbolise it as $$T_U(K, j)$$. 

* The "specification" $$K$$ is basically a **program** that specifies which computable functions we want to simulate.  
* $$j$$, is the data tape $$T_K$$ is going supposed to read.

We can create  a Turing Machine $$K$$ to run on input $$j$$: $$T_K[j]$$, but of course **this machine $$T_K$$ can only perform function $$K$$.**  Meanwhile, $$T_U$$: our universal machine, **interprets** the data, $$K$$ and $$j$$  is **capable of emulating the behavior of  $$T_K[j]$$** (without having to build $$T_K$$). 

Therefore with $$T_U$$, we no longer need to make any other Turing Machine $$T_K$$ that can only compute function $$K$$**, because $$T_U$$ can emulate the behavior of any Turing Machine**. As mentioned above, the closest actual realisation of $$T_U$$ is basically our **general purpose computer**. It can run programs and perform computations just as intended.  We can simply write any new program $$K$$, and execute it on $$T_U$$ using some input $$j$$. 

{:.highlight-title}
> General Purpose Computer 
> 
> We no longer need different machines to accomplish different tasks: watch TV shows, listen to music, and chat with our friends. We just need our computer to do all of these different tasks.

### That Infinitely Long Tape
**Where is that "infinitely long tape" in our computers?**

Well, technically, our computers have *a very long tape* (i.e: its RAM or Memory), where its programs and inputs (and outputs) are stored. It is large enough to make us feel like it is infinite when it is not. By definition, a computer can in fact be realised using an FSM (not strictly a Turing Machine because infinitely long tape doesn't exist), just that we probably would need **billions** of states to do so. 

  
## [The Computer Science Revolution](https://www.youtube.com/watch?v=cmfDBAiogA0&t=2875s)


Imagine the hassle and inconvenience if we need to build a different physical machine $$T_M$$ each time we need to compute a new function $$f_M$$ (again these are not just algebraic functions, but more like "tasks": decoding video format, browsing the internet, etc).

For example, suppose we want to make a **physical machine** that can perform **sorting** where it receives an array of integer as an input. 

We probably need other "simpler" (physical) machines that can perform comparison, addition, shifting, etc because all these parts are required to do the former tasks. This is very complex to do as we have many things to consider:
* How do we **connect** these machines together? Do we solder thousands of wires manually?
* How **big** or heavy, or costly is this final machine going to be?
* If we need to add or compare $$N$$ terms together, how many "adder" machines do we need? Can we reuse them? Or do we order $$N$$ duplicates of these physical adder machine? 

In order to be efficient, we need to **replace** each of these hardwares with a *coded description* of that piece of hardware (i.e: a software), then it's easy to cut, change, mix, and modify them around. Writing a merge-sort algorithm is so much easier compared to building a physical machine that can perform sorting. Also, programs can easily receive another program as input and output other programs. 

**This is the universal Turing Machine:** a <span class="orange-bold">*coded description*</span> of a piece of hardware. It allows us to migrate from a hardware paradigm into a software paradigm. People are no longer spending their time sitting in workshops making physical systems but they are now sitting in front of computers writing programs.

{: .highlight}
To tie things up, here we have learned how Turing machine works, and  its advantage over  FSM. Our final goal is to realise a **Universal Turing machine**, that is a machine that is **programmable** so that it can be used for a **general purpose**.

## [Summary](https://www.youtube.com/watch?v=cmfDBAiogA0&t=3197s)
[You may want to watch the post lecture videos here. ](https://youtu.be/p0plIDiBEj0)

A Turing machine is a **theoretical** computing machine invented by Alan Turing in 1936, which is used to model the logic of any computer algorithm. Here are the key characteristics of a Turing machine:

1. **Infinite Tape**: The Turing machine uses an infinite tape as its memory. This tape is divided into cells, each capable of holding a single symbol. This tape acts both as the device's memory and as a mechanism for moving data.

2. **Read/Write Head**: The machine has a head that can read and write symbols on the tape and move the tape left or right one cell at a time. This allows the machine to modify its input data and to store the output data.

3. **Finite Set of States**: Similar to a finite state machine, a Turing machine has a finite number of states. At any given moment, the machine is in one of these states.

4. **Initial State**: The operation of a Turing machine begins from an initial state, which is predefined.

5. **Transition Function**: This function dictates the behavior of the machine. It determines what the machine does based on its current state and the symbol it reads on the tape. Specifically, it tells the machine which symbol to write, which direction to move the tape (left, right, or stay), and what the next state should be.

6. **Accepting and Rejecting States**: The Turing machine can have special states called accepting (or final) and rejecting states. Reaching an accepting state means the machine has successfully completed the computation and accepted the input. Reaching a rejecting state means the computation has finished but the input is not accepted.

7. **Universality and Computability**: A Turing machine can simulate any other Turing machine. This concept, known as the universality of Turing machines, implies that any computational problem that can be solved by some algorithm can be solved by a Turing machine. This forms the basis for the Church-Turing thesis, which posits that the Turing machine can model any computation that can be performed by a "reasonable" computing device.

8. **Non-determinism (in some variants)**: While the classical Turing machine is deterministic, there are variants like the non-deterministic Turing machine where the transition function allows for multiple possible actions from the same state with the same input symbol. This does not increase the computational power (in terms of what can be computed) but can affect the complexity and efficiency of the computation.

The Turing machine remains a central object of study in the theory of computation and is fundamental in understanding what it means for a function to be computable. The concept of a universal Turing Machine is an *ideal abstraction*, since we can never create a machine with infinitely long tape. However, physically creating something that is "infinite" is not possible. We can only create a very long "tape" such that it appears "infinite" to some extent. 

If we manage to create a physical manifestation of Universal Turing Machine, we need to ensure that this machine is **programmable**. A programmable machine is a device that can perform a sequence of operations or tasks according to a **set of instructions or software**. These instructions can be **changed**, allowing the machine to carry out different tasks at different times. The concept is <span class="orange-bold">central to the idea of computers and automation</span>. Here are the key characteristics of a programmable machine:

1. **Hardware and Software Separation**: Programmable machines consist of both hardware (the physical components) and software (the instructions or programs). The software instructs the hardware on what tasks to perform and how to perform them. This separation allows the same hardware to perform different functions depending on the software it runs.

2. **Memory for Storage**: These machines have memory where they can store the program instructions, operational data, and intermediate results. Memory might be volatile (such as RAM) or non-volatile (such as hard drives or flash memory).

3. **Processing Unit**: A central processing unit (CPU) or processor executes the instructions provided by the software. It performs basic arithmetic, logic, controlling, and input/output operations as directed by the instructions.

4. **Input/Output Mechanisms**: Programmable machines have ways to receive input and produce output. Inputs can be from keyboards, sensors, network connections, or other data sources. Outputs might be to displays, actuators, other machines, or network connections.

5. **Programmability**: The defining feature of these machines is their programmability. They can be programmed to perform a wide range of tasks, from simple repetitive operations to complex algorithms involving decision-making and optimization.

6. **Control System**: They often include a control system that manages the execution of the program, handling tasks such as fetching instructions, decoding them, executing them, and then handling the next instruction cycle.

7. **Flexibility and Versatility**: Due to their programmability, these machines can adapt to different functionalities and requirements. This makes them versatile tools in numerous applications, from household appliances to complex industrial machinery.

8. **Automation Capability**: Programmable machines can automate processes. Automation can increase efficiency, reduce human error, and perform tasks that might be too complex, dangerous, or tedious for humans.

Programmable machines form the basis of modern computing and are fundamental to various fields, including robotics, manufacturing, communications, and consumer electronics. Their development and enhancement continue to drive innovation across industries.

### Instruction Set

The Turing machine's theoretical model of computation highlights the universal capability to execute any computable function, serving as a conceptual ancestor to modern programmable machines, which operate based on <span class="orange-bold">practical instruction sets</span>. These instruction sets provide the specific **commands** that programmable machines use to manipulate data and perform operations, embodying the abstract principles of the Turing machine in tangible, operational systems.

{: .new-title}
> Instruction Set
> 
> An instruction set is a set of standard *basic* commands that we can use as **building blocks** so that we can write a bigger programs that will cause the machine running it to emulate complex tasks. We are probably familiar with some examples: `x86` and `ARM64`. More examples can be found [here](https://en.wikipedia.org/wiki/Comparison_of_instruction_set_architectures). 


For **example**, we are familiar with high level programming languages, such as C/C++, Java, and Python.  You can write a program using any of these languages, lets say a calculator app. When we *compile* or *interpret*, and then *run* the program, our code is translated into **a set of instructions** that are understandable by our computers (we call this an **executable**), hence turning it into a calculator. We can also write another program, lets say a music player app, and translate it to yet another **set of instructions** that are understandable by our computers. When we run this program, our computer turns into a music player. 

Therefore, we can say that our computer is **programmable**, because the program that we wrote is translated into **a set of instructions** that our machine can understand. 
* It is **reconfigurable**, and is able to perform a plethora of different tasks depending on what apps we make, install, and run on it
* It commonly has **undefined** function at the time of manufacture: some people buy computers to watch movies, to browse, to edit photos, to code, to write books, to play games, etc. 
  * This is different from simple washing machines that comes with preset functions 

In the next chapter, we will learn further on how our general purpose computer is programmable by designing a proper **instruction set** for it. 

# Appendix

## Sample Manifestation of a Turing Machine

This section tells us one of the ways to realise the incrementer Turing Machine sample above as an actual machine using hardware components that we have learned in the earlier weeks.

First, we need to encode the logic of the machine in terms of binary values. We can use 2 bits to represent the state: `S_0`, `S_1`, and `HALT` and 2 bits to represent the input/output characters: `0`, `1`, `*` and `+` each. 
<img src="https://dropbox.com/s/uowbhzkfjyu3ysx/encodedTM.png?raw=1"   class="center_seventy">

We also must create a kind of *addressable input tape (**memory unit** that stores the data)*. Imagine that we can address each bit in the input tape as such, where `ADDRS` is an `n-bit` arbitrary starting address:
<img src="https://dropbox.com/s/vhfx5fxt48syi2t/addressableInput.png?raw=1"  class="center_seventy" >

Since we want to read and write **two** bits of input and output at a time (i.e: *at each clock cycle*), we can "move the tape" by advancing or reducing the value of `Current Address` *(that we supply to the addressable memory unit)* by 2 at each clock cycle. 

{: .note}
It is impossible to have "infinitely large" memory unit, so in practice we simply have a **large enough** memory unit such that it appears infinite for the particular usage. 
 
We can then construct some kind of *machine control system* (the unit represented as the *arrow* in the TM diagram). This is similar to how we build an FSM using combinational logic devices to **compute** the TM's 2-bit output data, next `address`, and the next state, given current `address`, current state,  and 2-bit input data based on the functional specification stated in the truth table above. 

<img src="{{ site.baseurl }}/assets/contentimage/turing_machine/tm-realise.png"  class="center_fifty"/>
The diagram above shows a rough schematic on how we can realise the abstract concept of a Turing Machine with a specification that does *increment* by building a (*non-programmable*) physical machine that can only do this **one task**. 


## The Halting Function

{: .warning}
This section is <span style="color:red; font-weight: bold;">difficult</span>, and is solely written for a <span style="color:red; font-weight: bold;">deeper understanding</span> about uncomputable function. You are **not required** to derive this proof during exams.

### The simpler explanation 

{: .note-title}
> The Halting Function
>  
> A function that determines whether Turing Machine that's run with specification $$K$$ will halt when given a tape containing input $$j$$. 
> What is a "halt"? For example, we can write a program as an input to our machine (computers). 
>
>The program: `print("Hello World")` halts, while this program: `while(True): print("Hello World")` does not halt. 

{% raw  %}

The **Halting function** is <span class="orange-bold">uncomputable</span>. Here's why it is uncomputable: 
1. **Suppose `HALT` exists**: We assume we have a program called `HALT` that can analyze any other program, `P`, with some input, `X`, and tell us if `P` will stop (halt) or run forever (loop) when given that input.

2. **Create a Paradox Program (`PARADOX`)**: Now, let’s write a new program, `PARADOX`, that does something unusual:
   - It uses `HALT` to check if *itself* (`PARADOX`) will halt when given its own code as input.
   - `PARADOX` is set up to do the opposite of what `HALT` predicts:
     - If `HALT` says `PARADOX` will halt, then `PARADOX` goes into an infinite loop.
     - If `HALT` says `PARADOX` will loop, then `PARADOX` halts immediately.

3. **The Contradiction**: 
   - If `HALT` says that `PARADOX` halts, then `PARADOX` should loop (by its own instructions), which contradicts `HALT`'s prediction.
   - If `HALT` says that `PARADOX` loops, then `PARADOX` should halt immediately, again contradicting `HALT`'s prediction.

This contradictory setup shows that **`HALT` cannot make a correct prediction about every possible program, including `PARADOX`**. In other words, this paradox proves that a universal `HALT` program cannot exist, because it would lead to logical contradictions when applied to programs that reference themselves.

This self-referential concept is similar to a paradox in natural language, like "This statement is false." If the statement is true, then it must be false, but if it’s false, it must be true. The Halting Problem uses a similar type of self-reference to show that a universal halting-decider is impossible.

### The in-depth explanation

Let's symbolise the halting function (suppose it exists) as $$f_H(K,j)$$, and give it a definition:

$$
\begin{aligned}
f_H(K,j) = &1 \text{ if } T_K[j] \text{ halts}\\
&0 \text{ otherwise}
\end{aligned}
$$

{% endraw %}


If $$f_H(K,j)$$ is computable, then there should be a  specification $$H$$ that can solve this.

**Lets symbolise a Turing machine with this specification as $$T_{H}[K,j]$$**. 

Now since there's no assumption on what $$j$$ is, $$j$$ can be a *machine* (i.e: program) as well. So the function $$f_H(K,K)$$ should work as well as $$f_H(K,j)$$. 

{: .highlight-title}
> In Laymen Terms
> 
> Inputting a machine to another machine is like putting a program as an input to another program. Lots of programs do this: compilers, interpreters, and assemblers all take programs as an input, and turn it into some other program. Remember, $$T_K$$ is basically a Turing machine with specification $$K$$. We can have a Turing machine that runs with specification $$K$$ with input **that is its own specification** (instead of another input string $$j$$, symbolised as $$T_K[K]$$. 

With this new information (and assumption that $$f_H(K,j)$$ is computable), lets define another specification $$H'$$ that implements this function:

$$\begin{aligned}
f_{H'}(K) = f_{H}(K, K) = &1 \text{ if } T_K[K] \text{ halts}\\
&0 \text{ otherwise}
\end{aligned}$$

**Lets symbolise a Turing machine with this specification as $$T_{H'}[K]$$ (there's no more $$j$$).** 


Finally, if we assume that $$f_{H'}(K)$$ is computable, then we can define another specification  $$M$$ that implements the following function: 

$$\begin{aligned}
f_M(K) = &\text{loops forever} \text{ if } (f_{H'}(K)== 1) \\
&halts \text{ otherwise}
\end{aligned}$$

**A Turing machine running with specification M is symbolised as $$T_M[K]$$.**

{: .new-title}
> Let's Pause!
> *  $$K$$ is an arbitrary Turing Machine specification, $$T_K$$ is a machine built with this specification. 
> * $$j$$ is an arbitrary input
> * $$H$$ is the specification that "solves" the halting function: $$f_H(K,j)$$. $$T_H$$ is a machine built with this specification.  
> * $$H'$$ is the specification that "solves" a special case of halting problem: $$f_{H}(K,K)$$,  i,e: when $$T_K$$ is fed $$K$$ as input (instead of $$j$$). $$T_{H'}$$ is a machine built with this specification. 
> * $$M$$ is the specification that tells the machine running it to loop if $$f_{H'}$$ returns 1, and halts otherwise. $$T_{M}$$ is a machine built with this specification. 

To **summarise**, $$T_M$$ loops if $$T_K[K]$$ halts (hence the output of $$T_{H'}[K]$$ is 1), and vice versa. 

Now since $$K$$ is an arbitrary specification, we can make $$K=M$$, and fed the function $$f_M$$ with itself:

$$\begin{aligned}
f_M(M) = &\text{loops forever} \text{ if } (f_{H'}(M)== 1) \\
&halts \text{ otherwise}
\end{aligned}$$


Running $$T_M[M]$$ will call these **chain of events.** We explain it in terms of "function calls" instead of Turing machine *running* (although they are equivalent) because it may be easier to understand.

When we call $$f_M(M)$$ (running $$T_M[M]$$), it needs to call $$f_{H'}(M)$$ (run $$T_{H'}[M]$$)  because it depends on the latter's output. $$f_{H'}(M)$$  depends on $$f_H(M,M)$$: the original halting function that outputs 1 if $$T_M[M]$$ halts, and 0 otherwise. That means, we need to call $$f_H(M, M)$$ to find out its output, so that $$f_{H'}(M)$$  can return. Calling $$f_H(M, M)$$ requires us to run a Turing Machine with specification $$M$$ on input $$M$$ (run $$T_M[M]$$ for another time), identical with what we did in step (1) above (just like recursive function call here). 

Now here is the <span style="color:red; font-weight: bold;">contradiction</span>: 
* If the  running of $$T_M[M]$$ from step (4) **halts**, then it will cause $$T_{H′}​[M]$$ to return $$1$$. If $$T_{H′}​[M]$$ returns 1, then the running of $$T_M[M]$$ from step (1) **loops forever.** 
* But, if the  running of $$T_M[M]$$ from step (4) **loops forever**, then it will cause $$T_{H′}​[M]$$ to return $$0$$. If $$T_{H′}​[M]$$ returns 0, then the running of $$T_M[M]$$ from step (1) **halts.**

<span style="color:red; font-weight: bold;">Neither can happen.</span>

Therefore, specification $$M$$ **does not exist** and it is **not** realisable. And by extension, everything falls apart: specification $$H'$$ and $$H$$ do not exist either. This means that $$f_H(K,j)$$ **is not computable.** 

{: .new-title}
> Still Confused?
> 
> That's okay. This [video](https://www.youtube.com/watch?v=92WHN-pAFCs) contains some simple animation to help you understand, give it a try. 

### Simple Intuition
By intuition, we know we can't build such **crash detection** machine because there are very simple programs for which no one knows whether they halt or not. For example, the following Python program will **HALT** if and only if [Goldbach’s conjecture](https://en.wikipedia.org/wiki/Goldbach%27s_conjecture) is `false`.

{: .note-title}
> Goldbach's Conjecture
> 
> Every even natural number greater than 2 is the **sum** of two prime numbers.

It's so easy to write this program in Python,
```python
def isprime(p):
    return all(p % i for i in range(2,p-1))

def Goldbach(n):
    return any( (isprime(p) and isprime(n-p))
           for p in range(2,n-1))

n = 4
while True:
    if not Goldbach(n): break
    n+= 2
```

However, we won't know if this program will ever stop or not. You may need to run it until *forever* ends (which is impossible).
