---
layout: default
permalink: /notes/virtualmachine
title: Virtual Machine
description: To give each process the illusion that they can operate in the whole address space and use the entire machine to itself, while in fact, we are sharing the machine among multiple processes.
nav_order: 16
parent: Software Related Topics
---

* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design

# Virtual Machine (Virtual Processor)
{: .no_toc}
[You can find the lecture video here.](https://youtu.be/4pizOgCT11k) You can also **click** on each header to bring you to the section of the video covering the subtopic. 

{:.highlight-title}
> Detailed Learning Objectives
>
> - **Understand the Concept of a Virtual Processor**
>   - Explain the operational model where each process perceives itself as operating on a dedicated machine.
>   - Discuss how this abstraction benefits multitasking and resource management.
> - **Describe the Role of the Operating System Kernel**
>   - Detail the OS kernel's role in process management and resource allocation.
>   - Highlight the kernel's responsibilities in maintaining system security and process isolation.
> - **Explain Process Context and Isolation**
>   - Define the components that make up a process context and their importance in the OS.
>   - Explain how the OS uses process context to maintain each process in isolation from others.
> - **Identify the Mechanisms Supporting Dual Mode Operation**
>   - Describe the functions and importance of Kernel and User modes in operating systems.
>   - Discuss how these modes prevent unauthorized access and ensure system stability.
> - **Detail OS Multiplexing and Context Switching Techniques**
>   - Explore how operating systems share hardware resources among processes.
>   - Describe the role of context switching and how asynchronous interrupts facilitate this process.
> - **Explore Hardware Requirements for OS Multiplexing**
>   - Analyze the essential hardware features that support OS multiplexing.
>   - Discuss the mechanisms like interrupts and dual mode operation that ensure efficient process management.
> - **Understand Synchronous and Asynchronous Interrupts**
>   - Differentiate between synchronous and asynchronous interrupts and their roles in system operations.
>   - Describe how these interrupts interact with the OS to handle program execution and error management.
>
> These learning objectives are designed to give a comprehensive understanding of how virtual machines function within operating systems, emphasizing the essential roles of the OS kernel and necessary hardware support.

## [Overview](https://www.youtube.com/watch?v=4pizOgCT11k&t=0s)

{: .highlight}
The term "Virtual Machine" in this chapter does not refer to the regular commercial virtual machines like VirtualBox or VMWare Fusion. 

Suppose we have 10 processes running in our computer right now: Web Browser, Spotify, Telegram, etc (in fact, the number of running processes at any given time in a typical computer is definitely more than 10 in day-to-day use, check your activity monitor or task manager to confirm). 

There has to be some kind of **manager** program that oversees the execution of these processes because we only have limited amount of resources: CPU cores, RAM size, cache size, etc. This **manager** program is called the Operating System. Specifically, the part of the OS that is responsible for process management is the **operating system kernel**.

The role of the OS Kernel is to provide an environment such that each **process** is under the **illusion** that it has the whole machine (I/O devices, resources like CPU and RAM) to itself, while the truth is that we are actually sharing these hardware resources amongst many processes.

### [The Operating System Kernel](https://www.youtube.com/watch?v=4pizOgCT11k&t=95s)
The Operating System (OS) Kernel is a *special* program that is written to **manage** and **oversees** the execution of all other processes in system. It has the **highest privilege** in computer system, i.e: it can terminate any program, has access to all kinds of hardware resources (Physical Memory, I/O devices). 


A few of its important role include memory management, I/O handling, and process scheduling. There are many other roles of the OS Kernel that is not discussed here. We will learn more about them next term. 


### [A Process Context](https://www.youtube.com/watch?v=4pizOgCT11k&t=336s)
In the previous chapter, we learned that each process has its own *`VA` to `PA`mapping* we call as part of a process **context**, hence allowing it to run on its own *virtual memory*. Each process also needs to have its own **context**.

{:.new-title}
> Definition
>
> The term "process context" refers to the set of information that represents a process's state at any given time, enabling the operating system to save and restore its state as needed, especially during a switch from one process to another. 

Assigning a separate context for each process has two crucial benefits:

1.  Allows **timesharing** among processes so that user can multitask even in  a single-core system. It facilitates switching the execution of multiple programs in a single CPU core. 

2.  Allows each process to run in **isolation**. Every program can be **written** as if it has **access to all memory** and hardware resources, without considering where other programs **reside**. 

The Kernel need to store  more information about a process (and not just its `VA` to `PA` mapping), so that it can pause any given process and resume any of them later on without any conflict. 

A more complete list of components that make up a process **context** are:
* Values of `R0, R1, ... R30`
* `VA` to `PA`mapping
* PC value
* Stack state
* Program (and shared code)
* Virtual I/O devices (console, etc)

In the Figure below, we illustrate `N` processes that are present in the system: `P1, P2, ..., P3` -- each having its own **context**: 

{: .note}
These processes are **isolated** from one another, meaning that `Pi` cannot access (or corrupt) the memory space of other process  `Pj` because each of them run on a separate virtual memory. 

<img src="https://dropbox.com/s/fvo6fllqrwwg2qr/context.png?raw=1"  class="center_fourty"  >

### Writing a Kernel 
Writing an Operating System Kernel is not a trivial task as one has to take into consideration a plethora of issues (security, performance, memory management, scheduling, etc). However with its presence, it makes easier to write all other programs. 

{: .note-title}
> Abstraction
> 
> An OS Kernel provides a layer of **abstraction**, allowing each program to run on a  **virtual machine**, devoid of any knowledge and care about any other processes.


## [Building a Virtual Processor ](https://www.youtube.com/watch?v=4pizOgCT11k&t=710s)

###  [Hardware Supported Kernel Mode and User Mode](https://www.youtube.com/watch?v=4pizOgCT11k&t=798s)
To support a safe virtual machine for each process, we need to establish the notion of **dual mode system**, that is a system that has a **Kernel Mode** (privileged mode) and a **User Mode** (non-privileged mode): 

* The OS Kernel runs in *full privilege* mode called the **Kernel Mode**, and it's code is made with the ability to oversee the execution of all processes in the computer system, handles real I/O devices, and emulate virtual I/O device for each process. 

* All other programs do **not** have such *privileged* features like the kernel. We call these programs as running in *non-privileged* **mode** called the **User Mode** with limited access to any hardware resources:
	* No direct access to actual hardware 
	* No direct access other process' address space
	* No knowledge about other processes' context and processor state

The Kernel will **handle** the need of these programs running in user mode for access to various hardware resources: access to I/O devices, interprocess communication, allocation/deallocation of  shared memory space, etc.  

{:.note}
This is a **major benefit**: programs can be easily written as if they have *absolute* access to *all* hardware resources (not just the physical memory), without having to worry about sharing them with other running processes. 



## [OS Multiplexing and Context Switching](https://www.youtube.com/watch?v=4pizOgCT11k&t=1080s)

{: .new-title}
> Multiplexing
> 
> **Multiplexing** is a method of sharing the resources in a computer **system** for multiple running programs at the same time. The OS kernel handles the multiplexed execution of various running programs in a single CPU -- **switching between *contexts* so rapidly** -- so that for the users, the computer is seemingly able to run multiple processes in "*parallel*". 

The main idea of OS multiplexing is illustrated below using two processes `P1` and `P2`, sharing a single system:

<img src="https://dropbox.com/s/p5r7q2uit6vbdkz/process.png?raw=1"  class="center_seventy"  >
  
The arrow illustrates the flow of execution in time:
1. At first, the CPU runs some task from `P1`. 
2.  After some time `t`, imagine that a *timed  interrupt* (caused by other asynchronous hardware, e.g: a *timer*) occurs. This causes the CPU to execute part of the kernel program that handles such **asynchronous interrupt**, hence *pausing* the execution of `P1`. 
3. The interrupt handler (part of the Kernel) takes control of the CPU when hardware interrupt occurs, and **saves** the  current **context** (PC, Registers, etc)  of P1 to a dedicated space **(Kernel Stack)** in the Memory Unit  (*so that P1's progress is not lost and can be resumed later on*) before performing a **context switch**.
4. After the context switch is complete, `P2` runs and progresses for some time `t` before another *hardware interrupt* occurs. The entire context switch process is repeated to pause `P2`, resume `P1`, and so forth. 

Refer to [appendix](#timer-interrupt) section if you'd like to know how this timer interrupt is set. 

{: .note}
Note that some books might call a process' **context** (PC, Registers, Stack, etc) as its **state** as well. 

During **context switch** from `P1` context to `P2` context, two things should happen:
1. The Kernel loads the context of `P2` to the CPU (and also the required resources, mapping, etc), and
2. Resume the execution of `P2`. 


In practice, the interrupt handler will examine the <span class="orange-bold">cause</span> of the asynchronous interrupt. In the event of **periodic** interrupt caused by a timer, the handler will delegate the task to the  **kernel scheduler** whose job is to decide which process to run next, and prepare the **necessary** information and context to load this process back into the CPU so that the selected process may resume smoothly. When the scheduler returns to the handler, the handler resumes execution of the CPU by simply setting `PC` $$\leftarrow$$ `Reg[XP] - 4`. 

The key hardware that allows for OS Multiplexing is the **asynchronous hardware interrupt**. We will simply call asynchronous interrupt as just "interrupt" for simplicity. There also exist a synchronous interrupt which we call as "trap" instead (see the later chapters). 

{: .note-title}
> Async Interrupt
> 
> The term **asynchronous** comes from the fact that the interrupt will **NOT** be synchronised with the CPU clock. It can come at any moment. Inputs that causes these async interrupts include keyboard presses, mouse clicks, and scheduler's timer. On the other hand, there are interrupts that are **sychronous** (with the CPU clock), for example **faulty instructions** will trigger a synchronous interrupt (trap). Unlike mouse clicks that can arrive at any time, execution of (faulty) instruction is **synchronous** with the CPU clock. 
  

## [Hardware Support for OS Multiplexing ](https://www.youtube.com/watch?v=4pizOgCT11k&t=1285s)

To allow for proper multiplexing, **four** things must be supported **in the hardware level**:

1.  There has to be a way to **asynchronously interrupt** a currently running program periodically since that program is currently using the CPU and will not stop voluntarily. That means there has to be some kind of external timer system that will fire up an interrupt signal (to the Control Unit) when that current running process time quanta is up.

2.  The hardware has to know how to **direct** the `PC` to the right handler program when **interrupt** occurs. This address is hardwired to `XAddr` in our Beta. 

3.  **Two execution modes** must be supported in the system. In our Beta CPU, this mode is signified as `PC31`. 
	* **Kernel mode**: that allows the CPU to have ultimate access to all hardware and data, so that it can perform crucial process management tasks such as "*saving*" the states (Register contents, stack, PC, etc) of the interrupted process (to be resumed safely later on). 
	* **User mode**: a non-privileged mode that disallow programs to corrupt illegal memory space of other programs or hijack resources.  

4.  Other interrupts must be **disabled** when the Kernel is saving the context (state) of an interrupted process (otherwise data will be lost). 


### $$\beta$$ Asynchronous Interrupt Hardware

Recall the **asynchronous interrupt** datapath as shown in the figure below: 

<img src="/50002/assets/contentimage/beta/irq.png"  class="center_seventy"/>

One of the inputs that is received by the Control Unit is `IRQ` (1-bit).  In the event of asynchronous interrupt, that `IRQ` value will be `1`. For instance, whenever a user clicks the mouse, or press a keyboard key, or the scheduler timer fires, `IRQ` will be set to `1`. 

Part of a Kernel program is a **scheduler** that will typically configure some system timer to fire at some interval. This timer runs **asynchronously** with the CPU, and sets the `IRQ` signal to `1` each time it fires.

At each CLK cycle, the Control Unit always checks whether `IRQ` is `1` or `0`. 

{: .note-title}
> `IRQ` is Asynchronous
> 
> Note that `IRQ` may turn to be `1` asynchronously, e.g: in the "*middle*" or even towards the end of a particular CPU CLK cycle.  However the Control Unit is synchronised with CPU CLK. Therefore, this may only *trigger* an interrupt in the next CPU CLK tick. The exact implementation is <span class="orange-bold">hardware dependent</span>, but here's a general idea:
> * If `IRQ==0`, the Control Unit produces all control signals as dictated by `OPCODE` received.
> * Else if `IRQ==1`, the Control Unit *traps* the PC onto the interrupt handler located at `XAddr`, by setting `PCSEL` value into `100`; *so that the PC points to `XAddr` in the next clock cycle.* 
>	* At the same time, it stores the address of the *next* instruction (`PC+4`) at Register `XP` (`R30`).  
> 	* `R30` is a **special register** (also labeled as Reg XP) that is **always** used to hold the *return address* in the event of interrupt (or illegal operation) so that the system knows how to resume the interrupted program later on. 


Beta's interrupt hardware configuration **forces** the PC CPU to execute the interrupt handler at `XAddr` in the next cycle each time the timer *fires*. 

The register transfer language that describes what happens in the datapath when `IRQ==1` is:

```cpp
If (IRQ==1 && PC31 == 0):
	Reg[XP] <- PC + 4`
	PC <- Xaddr
```

### [Asynchronous Interrupt Handler ](https://www.youtube.com/watch?v=4pizOgCT11k&t=1664s)

The asynchronous interrupt handler is part of the Kernel's code which <span style="color:red; font-weight: bold;">ENTRY POINT</span> must be located at `XAddr`, which is usually pre-determined memory address. In $$\beta$$ CPU, `XAddr` is set at `0x8000 0008`. Since `XAddr` is just one word of instruction, it is typically a `BR` to another address in memory that contains the instruction for the rest of the handler. 

The first few instructions of the interrupt handler typically saves current process states (`R0` to `R30` contents, PC state, stack, and others) in the **process table**. 

#### Process Table
{: .new-title}
> Process Table
> 
> **Process table:** a Kernel data structure that stores all the states of running processes in the machine. It lives in the Kernel memory space. The kernel keeps track on which process is currently scheduled to run in the CPU. 


<img src="https://dropbox.com/s/ypgac0w1uotc471/proctable.png?raw=1"   class="center_fifty" >

Afterwards, the handler will figure out which specific **service routine** needs to be called to service the interrupt, e.g: scheduler, or I/O routines. Afterwards, the service routine returns back to this interrupt handler. The handler finally sets  `PC` $$\leftarrow$$ `Reg[XP]-4`. 

{: .new-title}
> Think!
> 
> What is the value of `Reg[XP]-4`? 

<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
`Reg[XP]` contains the **next** address of the interrupted instruction. When we resume the interrupted process, we would like to re-execute this interrupted instruction. Hence, `Reg[XP]-4` **always** contains the address of that interrupted instruction that the CPU should execute when the interrupt handler returns. 
</p></div><br>




  
### [Dual Mode Hardware Support](https://www.youtube.com/watch?v=4pizOgCT11k&t=1971s)

Since the OS Kernel is a program that manages the execution of all other processes in the system, it is **crucial** to restrict access to the Kernel for **safety reasons**. We need to prevent a normal program from jumping to the address in memory that contains Kernel code and <span style="color:red; font-weight: bold;">compromise</span> the system.    

This **prevention** is done via **hardware**. The few sections below summarise how CPU hardware prevents access to restricted *Kernel* space (the memory region where the Kernel program resides).

#### PC31: Kernel and User Mode

{: note}
Note that using PC31 as Kernel/User mode indicator is specific to Beta CPU. Other CPU architecture such as the x86 and ARM uses special registers ([FLAGS](https://en.wikibooks.org/wiki/X86_Assembly/X86_Architecture) register for x86 and [CPSR for certain ARM architecture](https://developer.arm.com/documentation/den0013/d/ARM-Processor-Modes-and-Registers)) for this purpose. The details about other CPU architecture is out of our syllabus, but the concept is similar. 

Firstly, we need to establish some notion: 
* We call the  **MSB** (most significant bit) of the PC register as the **Supervisor Bit**. 
* Whenever the PC executes any code in an address where its MSB is `1`, it means that the CPU is running in the **Kernel Mode**. 
* Otherwise, if the MSB of the content in PC Register MSB is 0, the CPU is said to be running in the **User Mode**.

#### Kernel and User Space
That means we can divide the physical memory address space into two sections: 
* **User space**: Addresses which MSB is `0`: from `0x0000 0000` to `0x7FFF FFFF`
* **Kernel space**: Addresses which MSB is `1`: from `0x8000 0000` to `0xFFFF FFFF`.

Kernel program and kernel data (privileged information, data structures, etc) are stored in the **kernel space**. The rest of the program in the system live in the **user space**. 


#### User Mode Restrictions

##### Restricted Branch
Programs running in user mode (`PC31 == 0`) can **never** branch or jump to instructions in the kernel space placed at higher memory address (`0x8000000` onwards). Computations of next instruction address in`BEQ`, `BNE`, and `JMP` cannot change `PC31` value from `0` to `1`. 

##### Restricted Memory Access
Programs runing in user mode (`PC31 == 0`) can never load/store to data from/to the kernel space. Computations of addresses in `LD`, `LDR` and `ST` **ignores** the MSB. 

##### Restricted Kernel Mode Entry

Entry to the kernel mode can only be done via restricted entry points. In $$\beta$$, there are only **three** entry points:
1. Interrupts (setting PC to `Xaddr: 0x8000 0008`), 
2. Illegal operations (setting PC to `ILLOP: 0x8000 0004`), or
3. Reset (setting PC to `RESET: 0x8000 0000`)

{:.important}
We may also assume that we will never use the entire 32-bit address space for the $$\beta$$ CPU, thereforew we can utilise its MSB as a "status" flag. However, we lose the address "space" protection. Suppose we place Kernel code at address `0x00ABCC00`. There's nothing that can stop a user program from branching directly to this address (unlike if we place the kernel code at address `0x80ABCC00`). This is just one of the <span class="orange-bold">consequences</span> of using `PC31` as the CPU status. There has to be other additional hardware unit in place to protect the kernel space in the RAM. 



## [Synchronous Interrupt: Trap and Exception](https://www.youtube.com/watch?v=4pizOgCT11k&t=2120s)
Both Trap and Exception falls under **synchronous interrupt** category. This is a situation when the CPU executes a **faulty** instruction. This include illegal operations (instructions with `OPCODE` that doesn't correspond to the ISA), and **exceptions**: division by zero, invalid memory access, invalid transfer of control (`BR/JMP`).  

Executing any of these faulty instructions caused any process running in user mode to **trap** itself into the kernel mode because the `PC` will be directed to execute the trap handler (e.g: `PC` $$\leftarrow$$ `ILLOP`). This handler is part of the Kernel code, and it will examine the cause of the trap. It will also perform the appropriate action that will "handle" this faulty event: e.g: crash (terminate) the calling process or other services. 

### Trap

{: .new-title}
> Definition
> 
> A user process may intentionally execute an **illegal instruction** to **trap** itself to the kernel mode and gain access to its **services**. This is also known as making a **Supervisor Call** or a **System Call**. Control to the trap-calling process will be return after the requested service is completed. We will learn more about this next term. 

I/O devices **are actually shared** among all processes in the system, but  their programs are written with complete disregard for other processes in the memory. Therefore, user processes may utilise **traps** to synchronously interrupt themselves, and *legally* switch to the Kernel mode whenever they need access to the I/O devices (or other kernel services).  

User processes do not have *privileged* access, meaning that they do not directly control the use of* any hardware (I/O) devices, such as getting keyboard input, mouse click, perform disk saves, etc. It needs to **trap** itself to the Kernel program and execute **specific** parts of the Kernel code to obtain access to these I/O devices. 


As said above, the event of transferring control of the CPU to OS Kernel synchronously / voluntarily when a process needs Kernel's services is known as the **system call** (a.k.a: **SVC**, or **supervisor call**). This can be done by leaving the index of the requested service at `Reg[R0]` and executing a specific illegal operation (an instruction with `OPCODE` not corresponding to any other instruction in the ISA). In `bsim`, this `OPCODE` is chosen to be `1`. 

There are many types of Kernel services, one of them includes read/write access from/to the I/O devices. They are typically indexed, and the process needs to leave the index of the needed system call in `Reg[R0]` before trapping itself to the Kernel Program. 

The datapath in the event of *illegal operation* is:

<img src="/50002/assets/contentimage/beta/illop.png"  class="center_seventy"/>

During this event, 
* Control unit sets `PCSEL = 011`, and saves `PC+4` into `Reg[XP]`
* The PC will execute the instruction at location `ILLOP` in the next cycle where the illegal operation handler resides.   
* The illop handler will  look at `Reg[R0]` and invoke the right service routine to provide the requested service. 
	* Upon returning, the service routine will put its return the result in `Reg[R0]`. 
* The illop handler resumes the execution of the originating process:
	* `JMP[XP]`

{:.note} 
There's no need to do `Reg[XP] = Reg[XP]-4` because we don't wish to re-invoke the Trap / SVC when we return to the calling process.

#### Trap Example
One common scenario where a process running in user mode needs the Kernel service is when it asks for keyboard / mouse input, for example:

```cpp
int c;
c = getchar();
printf("%s", c);
```

The function  `getchar` contains several instructions that perform a **supervisor call** in order to fetch any character input from the keyboard. When translated into **assembly**, the supervisor call is made by trapping the process into the illop handler, thus **transferring** CPU control to the Kernel so that it can fetch any character input from the keyboard. The process execution can be **resumed** only after the  `getchar` task is done. That is why we notice that our process "hangs" (didn't execute the next `print` line until a user entered an input with a return carriage). 

Finally, this C process stores the character input left at `Reg[R0]` by the Kernel into memory location `c`. 

### Exceptions
The details about exceptions are out of this syllabus, and you will learn more about this next term. The major difference between Exceptions and Trap is that Exceptions are caused by **truly** faulty instructions and the program causing these exceptions are typically <span style="color:red; font-weight: bold;">terminated</span> by the Kernel. We commonly understand this phenomenon as "crashing" programs.

  

## [Summary](https://www.youtube.com/watch?v=4pizOgCT11k&t=2495s)
[You may want to watch the post lecture videos here. ](https://youtu.be/uG1HEKdJpxY)

Virtual machines are crucial in modern computing, allowing multiple processes to run simultaneously on a single physical machine. This is achieved through a combination of hardware and software optimizations, including the use of a virtual processor for each process. The operating system kernel plays a pivotal role in this setup, managing resources, ensuring security, and maintaining process isolation. Advanced hardware support, such as dual mode operation and specialized interrupt handling, further enables the efficient multiplexing of resources and smooth context switching. This not only enhances system stability and performance but also ensures that applications run seamlessly without interfering with each other.

This chapter covers various aspects of how operating systems manage multiple processes using virtualization technology, in particular: how the presence of OS Kernel and hardware support provide an abstraction for each running process, thus allowing them to run in an isolated manner; on their own virtual machine. Here are the key points:


1. **Concept of a Virtual Processor**: Discusses how each process operates as if it has its own dedicated hardware, facilitated by the operating system.
2. **Operating System Kernel**: Explains the kernel's role in managing resources, ensuring security, and isolating processes.
3. **Process Context and Isolation**: Details the structure that allows processes to operate independently and securely.
4. **Dual Mode Operation**: Outlines the mechanisms that distinguish between kernel and user modes, ensuring proper access control.
5. **OS Multiplexing and Context Switching**: Describes how the OS handles multiple processes, sharing hardware resources efficiently through context switching.
6. **Hardware Support**: Analyzes the hardware requirements that enable efficient multitasking and resource allocation among processes.


The Kernel **manages**  the execution of all processes, as well as all I/O devices, and provides **services** to all these processes. There are two ways to transfer CPU control between user programs to kernel programs:
* Firstly, is through **asynchronous interrupt**: `IRQ` is set to `1` 
* Secondly, is through **synchronous interrupt**: when the process generates an **exception** hence **trapping** itself to the handler and enters Kernel mode. 

During either case of interrupt, `PC+4` is stored at `Reg[XP]` so that the system knows how to resume the process later on. 

The $$\beta$$ Kernel called the [TinyOS](https://github.com/natalieagus/lab-tinyOS) that you will encounter in 50005 is **non-reentrant** (the CPU cannot be interrupted while in Kernel Mode). It is a simple Kernel. In practice, most modern [UNIX Kernels are reentrant](https://www.oreilly.com/library/view/understanding-the-linux/0596002130/ch01s06.html). Careful writing and construction of the Kernel program is required. 

# Appendix

## Timer Interrupt
The kernel uses a hardware timer to enforce context switches, ensuring that no single process monopolizes the CPU, thus allowing for efficient multitasking and fair CPU time distribution among all processes. Here’s how this is typically set up and managed:

### Setting the Timer for Context Switches:

1. **Timer Configuration**: The kernel configures a hardware timer to generate an interrupt at regular intervals. This interval is often referred to as the "time slice" or "quantum". The duration of this time slice can vary depending on the scheduling policy of the operating system.

2. **Timer Interrupt**: When the timer interval expires, the hardware timer generates an interrupt that is handled by the CPU.

3. **Interrupt Service Routine (ISR)**: This interrupt triggers an Interrupt Service Routine (ISR) managed by the kernel. The ISR is a special function within the kernel that responds to the timer interrupt.

4. **Context Switch**: During the ISR, the kernel performs several tasks, including saving the state (context) of the currently running process and determining which process to run next based on the scheduling algorithm. The kernel then loads the context of the next process to be executed, effectively performing a context switch.

5. **Resuming Execution**: After the context switch, the newly selected process begins or resumes execution, using the CPU until the next timer interrupt occurs or until the process voluntarily relinquishes the CPU (e.g., waiting for I/O operations to complete).

### Placement and Types of Timers:

- **Hardware Timer**: The timer used for context switching is a physical hardware timer on the computer’s motherboard or integrated into the CPU itself. Common types include programmable interval timers (PIT), high precision event timers (HPET), and advanced programmable interrupt controllers (APIC).

- **Dedicated Timer Chips**: Some systems may use dedicated timer chips like the Intel 8253 or 8254, which have historically been used in PC architectures.

- **System-on-Chip (SoC) Timers**: In more integrated systems, such as those in embedded devices or modern PCs and servers, timers might be part of the SoC alongside the CPU, memory controllers, and other peripherals.

This hardware timer is crucial because it ensures that the operating system maintains control over the CPU and can enforce its scheduling policies, keeping the system responsive and stable by preventing any single process from running too long without interruption.



### An example with Beta CPU 

As mentioned above, to support timesharing, there has to be some sort of mechanism that will periodically interrupts the execution of an ongoing process so that another process can be swapped in. For instance, if we have a single core CPU and two running processes P1 and P2, we would like to run P1 for `n` clock cycles, and then *pausing it*. Afterwards, the Kernel scheduler will run P2 for another `n` clock cycles before pausing P2 as well and resume the execution of P1. This round robin scheduling will be repeated until one of the processes terminate. If `n` is small and the CPU clock frequency is large enough, there will be the illusion that P1 and P2 (to the eyes of the user) runs in the single core CPU **simultaneously**. 

{: .highlight}
**Rapid context switching** between P1 and P2 gives the illusion of **parallel execution**. This phenomenon is called **concurrency**.

In this section, we illustrate an example of how a basic Kernel Scheduler works with the support of the timer hardware. A timer is commonly implmented as an `M`-bit counter (a separate hardware unit) with frequency of `Y` Hz that runs **asynchronously** with the CPU. This counter will be used as a timer for process scheduling. For example, suppose we have a `16`-bit counter with frequency of `50`Hz. This timer is **connected** to the `IRQ` line of the CPU. 

The Kernel typically can set the `IRQ` signal to point to the any arbitrary bit of the counter (but we need more hardware to "clean" this counter signal, read below). 

{: .warning-title}
> IRQ 
> 
> There's one more detail: we can't let the `IRQ` signal to **always** point to the `n`th bit of the counter because it will cause `IRQ` to be `1` for **more than 1 CPU clock cycle**. 
> 
> **Let's use an example**: suppose we have a CPU running on 100Hz clock, and a timer with 50Hz clock (so the timer is asynchronous of the CPU), and we select the `IRQ` to always point to the **5th** bit of the timer. This 5th bit of the timer will alternate between `0` and `1` every 16 cycles (or 0.32s). 
> 
> This means that the IRQ signal will be `1` for the first time after 16 cycles of the timer clock (0.32s), and it will **remain** `1` for *another* 0.32s before turning `0`. We do <span style="color:red; font-weight: bold;">not</span> what IRQ signal for 0.32s, that's 32 cycles of the CPU clock! We only want it to be `1` just **ONCE**, exactly just for 1 cycle of the CPU clock. As a result, we need to pass the 5th bit of the timer into a rising **edge detector** driven with the CPU clock before connecting it to the `IRQ` line of the CPU. 

With the rising edge detector, it means that the `IRQ` value will be `1` **once** every 0.64 seconds. 


If at first the CPU is executing instructions of Program `P1`:
1.  After 0.64 seconds, `IRQ` turns to `1`. This triggers an interrupt, and the control signals will cause the PC will execute the interrupt handler instruction at `XAddr` in the next cycle (and saving the *supposed* *next* instruction at `Reg[XP]`). 
2. The handler at `XAddr` must *save register states*, branch to the *scheduler*, and resume the program after the scheduler returns. Note that `Reg[XP]` may or may not be the same as when *before* `BR(scheduler_handler, LP)` is executed. 
   
```nasm
X_addr : ST(R0, save_location) || save register states at an allocated address
ST(R1, save_location+4)
ST(R2, save_location+8)
ST(R3, save_location+12)
....
ST(R30, save_location+30*4) 

CMOVE(kstack, SP) || use kernel stack
BR(scheduler_handler, LP) || branch to the scheduler

|| return instruction from scheduler
LD(save_location,R0) ||  restore register states
LD(save_location+4,R1)   
...
LD(save_location+30*4, R30)

SUBC(XP, 4, XP) || Reduce XP by 4 to re-execute the instruction that was interrupted by the timer
JMP(XP)  || Resume execution
```

Although not written,  `save_location` is a label, representing an address to store P1's states. 

{: .highlight-title}
> Observation
> 
> In this simple example, the handler is written such that it *always branches to the scheduler*. In practice, there are many kinds of hardware interrupts (not just from a timer) that needs to be handled differently depending on its *type*. We will have a hands-on experience about this in Lab 8, and also in the next term. 
  


## [Reentrancy](https://www.youtube.com/watch?v=4pizOgCT11k&t=2045s) 

When the CPU is in the kernel mode (`PC31 == 1`), i.e: handling an interrupt, it is important to consider whether or not we should allow **more interrupts** to occur. 

{: .highlight}
Handlers which are interruptible are said to be **re-entrant**.

$$\beta$$ CPU's handlers are set to be **non re-entrant**. Interrupts are **disabled** when it is in kernel mode and `IRQ` signal is <span style="color:red; font-weight: bold;">ignored</span> in the hardware when `PC31 == 1`.

This means that while user programs are interruptible, kernel programs are **not**. The reason behind disabling interrupt while being in the Kernel mode is to prevent the Kernel from **corrupting** itself. 

{: .new-title}
> Why?
> 
> Consider the scenario where the interrupt handler is in the middle of saving program states. Allowing another interrupt to occur in the middle of a save might cause data **loss** (corruption). 

The **drawback** to an uninterruptible kernel is that there's no way to get the system to work again if the kernel is buggy and runs into an infinite loop, except via hard reset. **The kernel program has to be written very carefully so as not to contain such bugs**. In practice, kernel bugs exists and we often know this as [*kernel panic* or the *blue screen of death*](https://en.wikipedia.org/wiki/Kernel_panic). 

