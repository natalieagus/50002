---
layout: default
permalink: /notes/asyncio
title: Asynchronous Handling of IO Devices
description: A brief introduction to interrupt-driven asynchronous handling of input output
nav_order: 17
parent: Software Related Topics
---

* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design

# Asynchronous Handling of I/O Devices
{: .no_toc}
There's no pre-recorded video for this chapter as the file that was uploaded on YouTube was corrupted (no sound). Please watch the stream session instead, this chapter is very short and simple anyway. It is a precursor to what you'll learn in Term 5.  
  
## Overview

  
A single CPU can only do *one thing at a time*: execute an operation, load from one memory location, branch to another location, store to one memory location, attend to I/O requests (fetch input or write output to other devices), etc. 

The OS Kernel allows users to *multitask*, by **performing rapid context switching** between processes in the system, and giving each process the abstraction of being in the only process running in its own (isolated) **virtual machine**. 

We can attach multiple I/O devices to a computer: *mouse, keyboard, hard disk, monitor, printer, etc.* 

 Each I/O device runs *independently* of the CPU. They're asynchronous and is **not controlled** by the CPU. 
* They have their own simple processing unit (logic devices), and memory units to contain temporary data, e.g: input values such as mouse click or keyboard key presses -- that will eventually be fetched by the CPU. 
* They're typically orders of magnitude **slower** than a CPU in operation and data processing. 

> Further details on how I/O devices work are beyond the scope of this course. Right now it is sufficient to think of them as independent devices, asynchronous from the CPU. 

In this chapter, we will learn how I/O requests are handled. The main idea for asynchronous I/O handling is follows:
* Each process that requires usage of I/O devices will  have to make a supervisor call. This **traps** to the Kernel mode, and the Kernel will handle this request. 

* Each I/O devices will invoke an (asynchronous) **interrupt request** when there's data in it that has to be fetched (mouse click, keyboard touch, touch screen input, incoming fax, etc). Whenever possible, the execution of the running process will be paused, and the Kernel will tend to this request. 

Upon completion (of either case), the Kernel will return control (of CPU) to the originating process (*resume the process*).  

  

## Recap: Operating System Kernel

 

The Kernel (the core of an OS) is **a set of instructions** that lives in the "*kernel space"* of the physical memory, and it manages the execution of all apps in the computer, as well as the hardware (including I/O). 

> Note that the Kernel **is not** the entire OS. There are other parts of an OS (that is not run in kernel mode), and we will learn more about these other parts of the OS next semester. 

Kernel serves as an *intermediary* between any I/O devices (hardware) and user processes. It provides a level of abstraction such that programs can be written and run as if it has access to the entire machine to itself. 

<img src="https://dropbox.com/s/5p53t1w1towhslg/osview.png?raw=1"    >


  

## The Supervisor Call


SVC is a 32-bit instruction that  triggers an *illop* exception, hence trapping the process onto the Kernel whenever it is executed.

In $$\beta$$ ISA, the `SVC` has the opcode: `000001`. 

It has the following format:
`000001` `26 SVC-bits`,
where up to lower 26 bits can be used to "*index*" the Kernel service requested.  

> In Lab 8, we have only 8 service routines by default, so only 3 lower bits of the instruction will encode the index of the requested service routines. 

This instruction allows processes to "*communicate*" with the Kernel by interrupting its own operation and transferring CPU control to the Kernel (*illop* handler)

The Illop handler saves the states of the calling process, before it checks if the Opcode of the instruction that triggers the trap is `000001`. 

If so, it will branch to a generic `SVC_handler` (else it will branch to error exception handler). 

`SVC_handler` does the following:
1.  Examine the last faulting instruction, 
2. Extract its lower `N` bits and 
3. Branch to the appropriate service routine as requested by the calling process based on the value of `N`: 
```
SVC_Handler: 
LD(XP, -4, R0)	| examine the faulting instruction
ANDC(R0, 0xN, R0) | mask out lower N bits
SHLC(R0, 2, R0) | make a word index
LD(R0, SVCtbl, R0) | load service table entry
JMP(R0) | jump to the appropriate handler
```

`SVCtbl` is a label for specific Kernel subroutines, such as writing output or fetching input from each devices. 

> `UUO` is a macro that directs the PC to each subroutine: `HaltH`, `WrMsgH`. You can read `lab8.uasm` to for more details. 

```
SVCTbl: UUO(HaltH) | SVC(0): User-mode HALT instruction
UUO(WrMsgH) | SVC(1): Write message
UUO(WrChH) | SVC(2): Write Character
UUO(GetKeyH) | SVC(3): Get Key
UUO(HexPrtH) | SVC(4): Hex Print
UUO(WaitH) | SVC(5): Wait(S), S in R3
UUO(SignalH) | SVC(6): Signal(S), S in R3
UUO(YieldH) | SVC(7): Yield()
```

### Example SVC
One common example where `SVC` is made is when a process checks for *keyboard input*. 
> Processes running in user mode do not have *direct* access to any of the hardware, so they cannot simply check the keyboard for new keystrokes. Moreover, the keyboard is shared for usage by many processes running in the system, for example: text editors, web browsers, video game, etc.  

*  For example, the execution of `getchar()` in C.

*  This means that the process needs to switch to the Kernel mode, and the Kernel helped to check if there's such input from the keyboard. 

*  The function `getchar()` is translated into `SVC(j)` (among other things):
	> The value of `j` is OS dependent. 

* `SVC(j)` traps the user process, switching it to the Kernel mode and execute Kernel *illop* handler. 

* It eventually examines the value of `j` and branch to the appropriate service routine that is able fetch the input for the keyboard: `GetKeyH`. 

*  Instructions in `GetKeyH` fetches the requested  (assuming there's an input), and  leave it in `Reg[R0]` 

*  `GetKeyH` returns the *illop* handler. The handler  restores the state of the calling process and resume it. 

*  The process can now get the requested keyboard character from `Reg[R0]`

## Asynchronous Input Handling

Since I/O devices are asynchronous, an efficient way has to be devised to pass **new inputs**  to the CPU to be stored in the physical memory. 

> Asynchronous input: We **cannot guarantee** that there's any process that asks for an input at the **exact moment** *that new input* is detected by  the I/O devices. Therefore, the Kernel has to temporarily **store** these new inputs in the Kernel Space until there's some process that asks for it (and then it can be *cleared* from the Kernel Space).  

Most modern system is **interrupt-driven**. That is, devices may request for *interrupts*:

*  Any I/O device can *request* for an I/O interrupt;  in the presence of new input or update, etc. 

* This will *interrupt* the execution of the current process in the CPU, causing the PC to switch to `XAddr` (*interrupt handler*). 
	> Recall how `IRQ` works in $$\beta$$.  

* The interrupt handler does the following:
	* **Saves** the states of the interrupted process,
	* Examines the **cause** of the interrupt, and 
	* Branch to an appropriate I/O interrupt handler (if the interrupt was caused by an I/O device). 

*  The **device-specific** I/O interrupt handler will fulfil the request, e.g: fetching new input from the device and putting it to a dedicated buffer in the Kernel space. This value stays in the Kernel buffer until a *related* `SVC` is made. 

*  When an `SVC` is made, the Kernel fetches the  requested item from the buffer (if any) and put it in `Reg[R0]` before returning to the originating process. 

  

## Real-Time I/O Handling

 <img src="https://www.dropbox.com/s/h0e8epak5kz505o/rth.png?raw=1"    >

When I/O interrupt requests are made by devices, they may not be immediately serviced by the Kernel. The figure above illustrates a general timeline from when a particular **interrupt request** is first made to the moment it is serviced.

Each interrupt request usually have a **deadline**, and the Kernel has to service the request before the said deadline. 

> For example, the Kernel has to service each keyboard input interrupt request quick enough so as to give the experience of a responsive system. 

*Latency* is defined as the amount of elapsed time from interrupt is first requested up until  the Kernel **BEGIN** servicing it. 

The Kernel scheduler in the kernel has to ensure that the interrupt request is serviced **before its deadline**. 

The amount of *latency* affects how "*real-time*" the machine reacts. The shorter the latency, the more responsive it will seem. 

  

## Scheduling multiple interrupts

The computer is connected to multiple I/O devices (disk, keyboard, mouse, printer, monitor, etc). Each device is capable of making asynchronous interrupt requests. Whenever multiple interrupt requests are invoked, the Kernel has to decide how to schedule these interrupt requests.

There are two different policies that can be adopted to handle I/O interrupts:
1.  **Weak, non-preemptive measure**: The machine has a *fixed ordering of device handling*, but it will not pre-empt current service. It will only **reorder** requests in the interrupt queue based on the types of device.  

2.  **Strong, preemptive measure**: Allow interrupt **handlers** with *lower* priority to be interrupted **only** by other handlers with *higher* priority level. 
	* Handlers of the same priority level **can never** interrupt each other.
	* If the CPU runs a handler of lower priority, it will be *forced* to perform a **context switch** to run the handler with the higher priority (required to service the interrupt). 
		* The interrupted handler can be **resumed** later on (*not restarted*, as its old state was saved) after the interrupting higher has finished execution. 
		* We call this type of Kernel that permits **context switch** even when the CPU is running in Kernel mode as **preemptive Kernel** (but not *reentrant*) -- and it requires more complex development as opposed to non-preemptive ones. 
	> A *reentrant* kernel is made such that it allows multiple processes (running in different cores) to be executing in the kernel mode *at any given point of time* without causing any consistency problems among the kernel data structures.

### Setting Handler Priority Level
The **priority level** for each interrupt handler can be illustrated using the  higher `p` bits of PC -- meaning that the *location* of the handler in memory *matters*; it defines the handler's priority level.  
> Some hardware tweaks on the CPU is needed to support this feature, but we don't have to dwell too deep into that at this point. 

<img src="https://dropbox.com/s/7w7oy1jyaa5trnq/pc.png?raw=1"     class="center_seventy"  >

* The value `p` depends on how many priority levels you want the machine to have, e.g: 3 bits for 8 levels.

> This is analogous to what we have learned before. A system two mode: Kernel and user mode, is differentiated only with the MSB of the PC -- `1` for Kernel mode (hence enabling the highest privilege) and `0` for user mode. 

  
### Recurring Interrupts 

Some interrupts may happen periodically, or at a bounded rate. 

> For example: a system autosave feature that requires periodic disk writes, periodic timer, maximum mouse interrupt per second, etc. 

*Consequence*: If higher priority interrupts happen at a high rate, requests with lower priorities might be interrupted repeatedly -- potentially resulting in *starvation*. 

  

  

## Worked Example on Scheduling Policies

Each scheduling policy has its own pros and cons. Non-preemptive Kernel is simpler to develop, but without it the device with the slowest service time constraints response to the fastest devices. 

With preemption, latency for higher priority devices is not affected by service times of the lower priority devices. However, this additional feature will complicate the Kernel code. 

We will use some examples to understand how each policy works, and justify whether there's any one that is better than the other. 

### Setup
Consider a computer that has three devices: disk, keyboard and printer. 

Each has the following specs for service time, average period, and deadline: 

| Device | Service Time (ms) | Deadline (ms) | Period (ms) 
|--|--|--|--|
| Keyboard | 0.8 |3 | 10
| Disk | 0.5 |3 | 2
| Printer | 0.4 |3 | 1


### Case 1: Without scheduling

  Without any scheduling measure, the worst case latency seen **by each device** is the total service time of the other devices, as the interrupt requests *can arrive in any order.*

| Device | Service Time (ms) | Deadline (ms) | Period (ms) | Worst-case Latency (ms)
|--|--|--|--|--|
| Keyboard | 0.8 |3 | 10 | 0.9 |
| Disk | 0.5 |3 | 2 | 1.2
| Printer | 0.4 |3 | 1 |1.3

<br>
### Case 2: Weak, Non-Preemptive Policy

Assume now we have the following hardware priority ordering: **Disk $$>$$ Printer $$>$$ Keyboard.**

Recall that in this weak policy, we
* **Cannot interrupt** whatever service that is currently going on, but 
* Can **re-order** other interrupt requests in the queue

The **worst case** latency for each device is: 

| Device | Service Time (ms) | Deadline (ms) | Period (ms) | Worst-case Latency (ms)
|--|--|--|--|--|
| Keyboard | 0.8 |3 | 10 | 0.9 
| Disk | 0.5 |3 | 2 | 0.8
| Printer | 0.4 |3 | 1 |1.3

<br>

*   The worst case latency for *disk* is 0.8ms despite having the highest priority, because it has to account for service time for the *keyboard*, if the keyboard service has just started when interrupt by disk arrives. 

*  The worst case latency for *printer* is 1.3ms because it has to take into account the scenario that the *keyboard* has just started when the interrupt by *printer* and *disk* arrive. 
	> The printer, which has lower priority than disk will have to wait for both disk and keyboard to finish execution before it can be serviced. 

*  The worst case latency for keyboard, with the lowest priority is the service time for *disk* + *printer*. 

  

<br>
### Case 3: Stricter Deadline with Weak Policy
Suppose the system requires a stricter **deadline** as shown in the table below. 

The hardware priority ordering: **Disk $$>$$ Printer $$>$$ Keyboard** with *weak policy* results in the following worst-case latency:

| Device | Service Time (ms) | Deadline (ms) | Period (ms) | Worst-case Latency (ms)
|--|--|--|--|--|
| Keyboard | 0.8 |1.1| 10 | 0.9 
| Disk | 0.5 |0.8 | 2 | 0.8
| Printer | 0.4 |0.7 | 1 |1.3

<br>

We can see that the deadline for Disk will not be met, despite having the highest priority:
* Its max latency is 0.8ms, and its service time is 0.5ms 
* Adding the two, we have 1.3ms of (worst case) total time to service the disk. This violates the deadline that's set at 0.8ms. 

Therefore the weak, non-pre-emptive policy will not work for this specification anymore. 
> There's a need to somehow pre-empt the keyboard when the interrupt request for disk arrives so that the disk will not miss its deadline (see next section). 

  
### Case 4: Strong, Pre-emptive Policy
Suppose we have the following interrupt handler priority ordering: **Disk handler $$>$$ Printer  handler$$>$$ Keyboard handler**. 

The worst-case latency for each device is now:

| Device | Service Time (ms) | Deadline (ms) | Period (ms)| Worst-case Latency (ms)
|--|--|--|--|--|
| Keyboard | 0.8 |1.1| 10 | 0.9 
| Disk | 0.5 |0.8 | 2 | 0
| Printer | 0.4 |0.7 | 1 |0.5

<br>
The disk has *zero* latency because pre-emption is enabled. 

The *keyboard* with the lowest priority still has to wait for the disk and printer to *complete* regardless.


The interrupt requests from these devices are recurring with certain frequency. For example, the keyboard interrupt occurs once every 10ms, and so on. 

We can draw the timeline of these interrupts as follows:

<img src="https://dropbox.com/s/vn644mg6ifqnqd1/irqstimeline.png?raw=1"    >


Since the *disk* has the highest priority, it will be serviced first. Once finished, the *printer* will be serviced. 

After both *disk* and *printer* are serviced, the *keyboard* is serviced at `t=0.9`. However, it will be interrupted by the printer at `t=1`. Therefore, the keyboard service time is spread out due to interrupts from printer and disks: 

<img src="https://dropbox.com/s/5wodlj3hwpx9ltm/interruptsvc.png?raw=1"    >

*  The keyboard service time is spread out (red region) due to interrupts from printer and disks

#### Missing Deadline
The strong priority ordering Disk  > Printer  > Keyboard as explained above **does not** fulfil the deadline for Printer or Keyboard, since the worst-case latency + service time for each Printer and Keyboard exceeds their deadline. What will be the **minimum deadline** for printer and keyboard in this case, so that the strong priority ordering of  Disk  > Printer  > Keyboard can fulfil all deadlines? 

> To test your understanding, ask yourselves if another priority ordering such as **Printer handler > Disk handler > Keyboard handler** is *plausible* with the original deadlines?  Why or why not? In fact, is there any strong priority ordering that will work with such tight deadline combinations? 

### Effective Interrupt Load

The effective **Interrupt Load** these devices impose to the CPU is computed by multiplying the *maximum frequency* of each device interrupt with its own **service time**. 

We can easily compute the max frequency of each device:
* Keyboard: 100/s
* Disk: 500/s
* Printer: 1000/s


The load % from each device is therefore:
* Keyboard: $$100 \times 0.0008 = 0.08 = 8\%$$ 
* Disk: $$500 \times 0.0005 = 0.25 = 25.0\%$$
* Printer: $$1000 \times 0.0004 = 0.4 = 40.0\%$$
 
The total Interrupt load of these devices on the CPU is 73%. The remaining fraction, 27% is what is left for processes to use to do *work* (computation). 

> The computer will not be able to run any other processes if the Interrupt load reaches 100 %.

 
## Summary
[You may want to watch the post lecture videos here. ](https://youtu.be/8ZzGgrGK3PY)
> We used to have another chapter on process synchronisation using Semaphores, but it is taken out of our syllabus now. [You can still watch its brief video here](https://youtu.be/iQcPXj-wsGs). We will learn more about these next term in Computer System Engineering (CSE 50.005) instead.

In this chapter, we have learned that there are two parts of *device interface*:
1. **Device side:** via asynchronous interrupt requests.
2. **Application (process) side:** via supervisor calls. 

The OS Kernel acts as an intermediary between processes and shared hardware. 

It has to carefully schedule real-time interrupt requests such that each can be serviced without violating the deadlines. We learned a couple of policies: weak non-preemptive and strong pre-emptive measure. Real-time constraints are however complex to solve, and each policies have its own pros and cons. It is also not a trivial job to determine the best priority ordering for each device or handler. 

We have come to the end of this course, and we have learned quite a great deal on how a computer is built,  what it means by having a "general-purpose" device and how to design an instruction set for it, along with memory and machine virtualisation. The OS Kernel is a program that enables machine abstraction; in a way such that each process can run in isolation from one another (great for both convenience in development and system security). 

In the next term, we will build on this knowledge and learn more about the fuller extent of the role of an OS Kernel: supporting interprocesses communcation, synchronizing between processes, and guarding shared resources between processes running in the system. 




