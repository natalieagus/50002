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
There's no pre-recorded video for this chapter as the file that was uploaded on YouTube was corrupted (no sound). Please attend the class instead as this chapter is very short and simple anyway. It is a precursor to what you'll learn in Term 5.  
  
## Overview

{: .note-title}
> Recap
> 
> A single Beta CPU can only execute one instruction per clock cycle. The OS Kernel allows users to *multitask*, by **performing rapid context switching** between processes in the system, and giving each process the abstraction of being in the only process running in its own (isolated) **virtual machine**. 

When we use our computers, we know that we can attach multiple I/O devices to a computer: *mouse, keyboard, hard disk, monitor, printer, etc.* 

Each I/O device actually independently of the CPU. They do not operate with the same clk as the CPU (asynchronous) and is **not controlled** by the CPU. 
* They have their own simple processing unit (logic devices), and memory units to contain temporary data, e.g: preset mouse clicks or custom keyboard key value that will eventually be fetched by the CPU. 
* They're typically orders of magnitude **slower** than a CPU in operation and data processing. 

> Further details on how I/O devices work are beyond the scope of this course. Right now it is sufficient to think of them as independent devices, asynchronous from the CPU. 

In this chapter, we will learn how I/O requests are **handled**. The main idea for asynchronous I/O handling is as follows:
* Each process that requires **usage** of I/O devices will  have to make a <span style="color:red; font-weight: bold;">supervisor call</span>. This **traps** to the Kernel mode, and the Kernel will handle this request. 
* Each I/O devices will invoke an (asynchronous) **interrupt request** when there's data in it that has to be fetched (mouse click, keyboard touch, touch screen input, incoming fax, etc). Whenever possible, the execution of the running process will be paused, and the Kernel will tend to this request. 

Upon completion (of either case), the Kernel will return control (of CPU) to the originating process (*resume the process*).  


## Recap: Operating System Kernel

The Kernel (the core of an OS) is **a set of instructions** that lives in the "*kernel space"* of the physical memory, and it manages the execution of all apps in the computer, as well as the hardware (including I/O). 

{: .note}
Note that the Kernel **is not** the entire OS. There are other parts of an OS (that is not run in kernel mode), and we will learn more about these other parts of the OS next semester. 

Kernel serves as an intermediary program between any I/O devices (hardware) and requesting user processes. It provides a level of **abstraction** such that programs can be written and run as if it has access to the entire machine to itself. 

<img src="https://dropbox.com/s/5p53t1w1towhslg/osview.png?raw=1"  class="center_seventy"  >


  

## The Supervisor Call

{: .new-title}
> SVC
> 
> The SVC is a 32-bit instruction that triggers an `ILLOP`, hence **trapping** the process onto the Kernel whenever it is executed. In $$\beta$$'s Tint OS , the `SVC` has the opcode: `000001` and the remaining 26 bits can be used to "*index*" the Kernel service requested.  

In our supplementary Lab (Tiny OS), we have only 8 service routines by default. Hence only 3 lower bits of the instruction will encode the index of the requested service routines. 

This special SVC instruction allows processes to "communicate" with the Kernel by trapping (stopping) its own operation and transferring CPU control to the Kernel (entered via the `ILLOP` handler). The `ILLOP` handler saves the states of the calling process, before it checks if the `OPCODE` of the instruction that triggers the trap is indeed `000001`. 

If its `OPCODE` is indeed `000001`, it will branch to a generic `SVC_handler`, else it will branch to error exception handler (which will probably terminate the calling process). 

### SVC Handler
The `SVC` handler does the following routine:
1. Examine the last faulting instruction, 
2. Extract its lower `N` bits and 
3. Branch to the appropriate service routine as requested by the calling process based on the value of `N`: 
   
Here's the extracted code snippet from the TinyOS lab ([`tinyOS.uasm` file](https://github.com/natalieagus/lab-tinyOS)):
```nasm
SVC_Handler: 
LD(XP, -4, R0)	| examine the faulting instruction
ANDC(R0, 0xN, R0) | mask out lower N bits
SHLC(R0, 2, R0) | make a word index
LD(R0, SVCtbl, R0) | load service table entry
JMP(R0) | jump to the appropriate handler
```

`SVCtbl` is a **label** for specific Kernel subroutines, such as writing output or fetching input from each devices. `UUO` is a macro that directs the PC to each subroutine: `HaltH`, `WrMsgH`. You can read `lab6.uasm` to for more details. 

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
One common example where `SVC` is made is when a process checks for keyboard input. Processes running in user mode do not have direct access to any of the hardware, so they cannot simply check the keyboard for new keystrokes. Moreover, the keyboard is **shared** for usage by many processes running in the system, for example: text editors, web browsers, video game, etc.  

For example, the execution of `getchar()` in C in the previous notes triggers a supervisor call. This means that the process needs to switch to the Kernel mode, and the Kernel helped to check if there's such input from the keyboard. 

The function `getchar()` is translated into `SVC(j)` (among other things):
> The value of `j` is OS dependent. 

`SVC(j)` **traps** the calling user process, switching it to the Kernel mode and execute Kernel `ILLOP` handler. It eventually examines the value of `j` and branch to the appropriate service **routine** that is able fetch the input for the keyboard: `GetKeyH`. Instructions in `GetKeyH` fetches the requested  (assuming there's an input), and  leave it in `Reg[R0]` 

`GetKeyH` returns to the  remaining of the `ILLOP` handler. It **restores** the state of the calling process and resume it. Finally, the calling process can now get the requested keyboard character from `Reg[R0]`

## Asynchronous Input Handling
Since I/O devices are asynchronous, an efficient way has to be devised to pass **new inputs**  to the CPU to be stored in the physical memory. 

{: .new-title}
> Asynchronous input
> 
> We **cannot guarantee** that there's any process that asks for an input at the **exact moment** *that new input* is detected by  the I/O devices. Therefore, the Kernel has to temporarily **store** these new inputs in the Kernel Space until there's some process that asks for it (and then it can be *cleared* from the Kernel Space).  

### Interrupt-Driven System
Most modern system is **interrupt-driven**, with the following characteristics. 

Any I/O device can *request* for an I/O interrupt;  in the presence of new input or update, etc. This will interrupt the execution of the current process in the CPU, causing the PC to switch to `XAddr` (*interrupt handler*). 

The interrupt handler does the following:
  1. **Saves** the states of the interrupted process,
  2. Examines the **cause** of the interrupt, and 
  3. Branch to an appropriate I/O interrupt handler (if the interrupt was caused by an I/O device). 

The **device-specific** I/O interrupt handler will fulfil the I/O Interrupt request, such as fetching new input from the requesting device and putting it to a dedicated buffer in the Kernel space. This value stays in the Kernel buffer until a process wants it by making an `SVC`. When an `SVC` is made, the Kernel fetches the  requested item from the buffer (if any) and put it in `Reg[R0]` before returning to the originating process, and clearing the Kernel buffer.

{: .important}
It is imperative to realise that when a process requests for a keystroke (e.g: a text editor waiting for key presses to arrive), it has to **wait** until a key is actually pressed by the user. The CPU clock cycle is very fast (3-4Ghz in mid-tier consumer computers made in 2023), way faster than human's capability to supply input. Therefore we cannot waste resources and **wait** until a key is pressed. We know that a text editor cannot resume execution until a key is pressed (simply idling), and so the Kernel must be written in such a way that the keystroke-requesting text editor is swapped out of the CPU, utilise the CPU to run other processes (e.g: Spotify in the background), and **RESUME** the text editor back the moment a new key stroke is received (provided that the text editor is currently selected/opened in the window). Hence the name: **asynchronous** interrupt handling -- because we see keystrokes being registered in a requesting text-editor as a two independent event that are not *intentionally* matched. The text editor will continue idling (and the rest of the processes in the computer can run) when no key is pressed, and the computer does not crash if we press any uneeded key while not focusing on the text editor.
  

## Real-Time I/O Handling

 <img src="https://www.dropbox.com/s/h0e8epak5kz505o/rth.png?raw=1"  class="center_seventy"  >

When I/O interrupt requests are made by devices, they may not be immediately **serviced** by the Kernel. The figure above illustrates a general timeline from when a particular **interrupt request** is first made to the moment it is serviced.

### Deadline
{: .new-title}
> Deadline
> 
> Each interrupt request usually have a <span style="color:red; font-weight: bold;">deadline</span>, and the Kernel has to finish servicing the request before the said deadline. 
 
For example, the Kernel has to service each keyboard input interrupt request **quick** enough (deadline should be within ~ms) so as to give the experience of a responsive system. 

### Latency

{: .new-title}
> Latency
> 
> Latency is defined as the amount of elapsed time from interrupt is first requested up until  the Kernel **BEGIN** servicing it. 


The Kernel scheduler in the kernel has to ensure that the interrupt request is serviced **before its deadline**. The amount of latency affects how "real-time" the machine reacts. The **shorter** the latency, the more **responsive** it will seem. 
  

## Scheduling multiple interrupts

The computer is connected to multiple I/O devices (disk, keyboard, mouse, printer, monitor, etc). Each device is capable of making asynchronous interrupt requests. Whenever multiple interrupt requests are invoked, the Kernel has to decide how to schedule these interrupt requests.

There are two different policies that can be adopted to handle I/O interrupts.

### Weak Policy
A **Weak policy** is non-preemptive. This means that the machine has a **fixed** ordering of device handling, but it will not pre-empt current service. It will only reorder requests in the interrupt **queue** based on the types of devices.  

For example, it will prioritise mouse click over keyboard presses by default at all times. However, if a request to handle mouse click comes and  the CPU is already handling keyboard press request, it will not interrupt the current keyboard press service. 

### Strong Policy
A **Strong policy** is **preemptive**.  This means that it allows interrupt **handlers** with lower priority to be interrupted **only** by other handlers with *higher* priority level. 

If the CPU runs a handler of lower priority, it will be forced to perform a **context switch** to run the handler with the higher priority (required to service the interrupt). The interrupted handler can be **resumed** later on (not completely restarted, as its old state was saved) after the interrupting higher has finished execution. 

{: .note}
Handlers of the same priority level **can never** interrupt each other.

### Setting Handler Priority Level
In the Beta CPU, the **priority level** for each interrupt handler can be implemented using the  higher `p` bits of `PC`. As an implication, the actual **location** of the handler in memory decides its priority level. Some hardware tweaks on the CPU is needed to support this feature, but we don't have to dwell too deep into that at this point. 

{: .note}
Note that other CPU architecture uses special registers that indicate handler priority level and not necesarily the `PC` register. This example is for illustration purposes only.

<img src="https://dropbox.com/s/7w7oy1jyaa5trnq/pc.png?raw=1"     class="center_fifty"  >

The number of bits of `p` depends on how many priority levels you want the machine to have, e.g: 3 bits for 8 priority levels.

{: .note}
This is analogous to what we have learned before. A system two mode: Kernel and User mode, is differentiated only with the MSB of the PC -- `1` for Kernel mode (hence enabling the highest privilege) and `0` for user mode. 

  
### Recurring Interrupts 

Some interrupts may arrive **periodically**, for example if we are expecting a huge incoming scanned data from a printer, the interrupts might occur periodically as the printer is ready to send the data chunk by chunk.

{: .important-title}
> The Consequence
> 
> If higher priority interrupts happen at a high rate, requests with lower priorities might be interrupted repeatedly -- potentially resulting in **starvation**. 

There is no easy solution to this issue, each scheduling policy has their own pros and cons. 

## Worked Example on Scheduling Policies

Each scheduling policy has its own pros and cons. Non-preemptive Kernel is simpler to develop, but without it the device with the slowest service time constraints response to the fastest devices. With preemption, latency for higher priority devices is not affected by service times of the lower priority devices. However, this additional feature will complicate the Kernel code. 

We will use some examples to understand how each policy works. 

### Setup
Consider a computer that has three devices: disk, keyboard and printer. Each has the following specs for service time, average period, and deadline: 

| Device | Service Time (ms) | Deadline (ms) | Period (ms) 
|--|--|--|--|
| Keyboard | 0.8 |3 | 10
| Disk | 0.5 |3 | 2
| Printer | 0.4 |3 | 1

{: .note-title}
> Sample Explanation
> 
> The keyboard will throw an interrupt once every 10ms (or 1000 times per second). It has to be **serviced** within 3ms from the time the interrupt occurs, and it requires 0.8ms for the CPU to service the request. The same idea works for Disk and Printer. 

### Case 1: Without scheduling

Without any scheduling measure, the worst case latency seen **by each device** is the total service time of the other devices, as the interrupt requests can arrive in <span style="color:red; font-weight: bold;">any</span> order.

| Device | Service Time (ms) | Deadline (ms) | Period (ms) | Worst-case Latency (ms)
|--|--|--|--|--|
| Keyboard | 0.8 |3 | 10 | 0.9 |
| Disk | 0.5 |3 | 2 | 1.2
| Printer | 0.4 |3 | 1 |1.3

{: .note-title}
> Sample Explanation
> 
> Without any scheduling, it is a first-come-first-serve basis. At t=0, all 3 requests arrive at the same time, but we don't know the exact ordering. For Keyboard, the worst case latency is that Disk and Printer arrived split second earlier than itself, hence it has to wait for the two devices to finish their service requests before Keyboard can start to be serviced. The same idea works for Disk and Printer. 


### Case 2: Weak, Non-Preemptive Policy

Assume now we have the following **hardware** priority ordering: **Disk $$>$$ Printer $$>$$ Keyboard.**

Recall that in this weak policy, we:
* **Cannot interrupt** whatever service that is currently going on, but 
* **Can** **re-order** other interrupt requests in the queue

The **worst case** latency for each device is: 

| Device | Service Time (ms) | Deadline (ms) | Period (ms) | Worst-case Latency (ms)
|--|--|--|--|--|
| Keyboard | 0.8 |3 | 10 | 0.9 
| Disk | 0.5 |3 | 2 | 0.8
| Printer | 0.4 |3 | 1 |1.3


{: .new-title}
> Why? 
> 
> The worst case latency for **disk** is 0.8ms despite having the highest priority, because it has to account for service time for the keyboard, if the keyboard service has just started when the request by disk arrives. Remember, although disk has higher priority than keyboard, it cannot interrupt a halfway-executed keyboard service since this policy is non-preemptive. 
> 
> The worst case latency for **printer** is 1.3ms because it has to take into account the scenario that the keyboard has just started when the interrupt by printer and disk arrive. It has lower priority than disk will have to wait for **both** disk and keyboard to finish execution before it can be serviced at worst case. 
> 
> The worst case latency for **keyboard**, with the **lowest** priority is the service time for disk + printer at worst case. 


### Case 3: Stricter Deadline with Weak Policy
Suppose we have the same hardware priority ordering: **Disk $$>$$ Printer $$>$$ Keyboard** (same as Case 2 above).

The only difference now is that we have a stricter **deadline**. The Weak scheduling policy results in the following worst-case latency:

| Device | Service Time (ms) | Deadline (ms) | Period (ms) | Worst-case Latency (ms)
|--|--|--|--|--|
| Keyboard | 0.8 |1.1| 10 | 0.9 
| Disk | 0.5 |0.8 | 2 | 0.8
| Printer | 0.4 |0.7 | 1 |1.3

{: .important-title}
> Deadline not met
> 
> We can see that the deadline for Disk will not be met, despite having the highest priority:
> * Its max latency is 0.8ms, and its service time is 0.5ms 
> * Adding the two, we have 1.3ms of (worst case) total time to service the disk. This <span style="color:red; font-weight: bold;">violates</span> the deadline that's set at 0.8ms. 

Therefore the weak, non-pre-emptive policy will <span style="color:red; font-weight: bold;">not</span> work for this system with a stricter deadline anymore. There's a need to somehow pre-empt the keyboard when the interrupt request for disk arrives so that the disk will not miss its deadline (see next section). 

  
### Case 4: Strong, Pre-emptive Policy
Suppose we have the same hardware priority ordering: **Disk $$>$$ Printer $$>$$ Keyboard** (same as Case 2 above). We keep the same stricter deadlines for each device as it is with Case 3 above.

The worst-case latency for each device is now:

| Device | Service Time (ms) | Deadline (ms) | Period (ms)| Worst-case Latency (ms)
|--|--|--|--|--|
| Keyboard | 0.8 |1.1| 10 | 0.9 
| Disk | 0.5 |0.8 | 2 | 0
| Printer | 0.4 |0.7 | 1 |0.5


{: .new-title}
> Why? 
> 
> The disk has zero latency because pre-emption is enabled and it has the **highest priority**, meaning that the moment interrupt request made by disk arrives, it will always preempt any ongoing service request that the CPU currently tends to.   
> 
> The keyboard with the lowest priority still has to wait for the disk and printer to complete at worst case. 
> 
> The printer has to wait for disk to finish its servicing at most, hence resulting in 0.5ms worst case latency. 

{: .important-title}
> Deadline still not met
> 
> The deadline for both Keyboard and Printer is still not met. The **worst case latency** only signifies the time taken from the moment the request arrives to the moment the service begins. It does not signifies anything about when the servicing will **complete**. Since Printer's worst case latency is 0.5ms and its service time is 0.4ms, it will surely <span style="color:red; font-weight: bold;">exceeds</span> the deadline of 0.7ms!. 
 
To understand this more clearly, let's draw an interrupt timeline diagram.

#### Interrupt Timeline
The interrupt requests from these devices are recurring with certain **frequency** (or period). For example, the keyboard interrupt occurs once every 10ms, and so on. 

We can draw the timeline of these interrupts as follows:
<img src="https://dropbox.com/s/vn644mg6ifqnqd1/irqstimeline.png?raw=1"  class="center_seventy"  >

Since the disk has the highest priority, it will be serviced first. Once finished, the printer will be serviced. 

After both disk and printer are serviced, the keyboard is serviced at `t=0.9`. However, it will be interrupted by the printer at `t=1`. Therefore, the keyboard service time is <span style="color:red; font-weight: bold;">spread</span> out due to interrupts from printer and disks: 

<img src="https://dropbox.com/s/5wodlj3hwpx9ltm/interruptsvc.png?raw=1"    >

{: .note}
The keyboard service time is spread out (red region) due to interrupts from printer and disks

{: .new-title}
> Think!
> 
> If we use **strong** policy, and priority ordering **Disk $$>$$ Printer $$>$$ Keyboard** (same as above), we know that disk can always pre-empt other ongoing services. Can disk request interrupt any ongoing disk request? Most importantly, is it possible for **two** or more requests from disk to be present at the same time (one in queue and one is currently serviced by the CPU)? Hint: compare disk's interrupt period with its service time.

#### Missing Deadline
The priority ordering Disk  > Printer  > Keyboard in Case 3 above **does not** fulfil the deadline for Printer or Keyboard when either **weak** or **strong** policy is used since the worst-case latency + service time for each Printer and Keyboard exceeds their deadline. 


{: .new-title}
> Think!
> 
> Suppose we have the same hardware priority ordering: **Disk $$>$$ Printer $$>$$ Keyboard** (same as Case 2 above).
> 
> What will be the **minimum deadline** for each device such that the **weak** policy can fulfil all devices' deadline?  What about if **strong** policy is used, what will be the minimum deadline for printer and keyboard be?
> 
> As further practice, ask yourselves if there exist **another** priority ordering such as Printer  > Disk  > Keyboard that can meet the **original** deadline with **strong policy**. 


### Effective Interrupt Load

{: .highlight}
A CPU is not doing actual computational work when it is servicing interrupt requests because it has to pause the execution of the currently running user process in order to tend to the interrupt request before the deadline arrives.

The effective **Interrupt Load** these devices impose to the CPU is computed by multiplying the maximum frequency of each device interrupt with its own **service time**. 

We can easily compute the max frequency of each device with our original example above:
* Keyboard: 100/s
* Disk: 500/s
* Printer: 1000/s

The Effective Interrupt Load (in %) from each device is therefore:
* Keyboard: $$100 \times 0.0008 = 0.08 = 8\%$$ 
* Disk: $$500 \times 0.0005 = 0.25 = 25.0\%$$
* Printer: $$1000 \times 0.0004 = 0.4 = 40.0\%$$
 
The total Interrupt load of these devices on the CPU is therefore the sum of those three: 73%. The remaining fraction: 27% is what is left for processes to use to do actual computation. A computer will not be able to run any other processes if the Interrupt load reaches 100%. This is one of the possible reasons on why your older computer "freezes" for a moment when you overwhelm it with inputs (e.g: backing up to external disk, typing furiously, opening hundreds of background processes at the same time).

 
## Summary
[You may want to watch the post lecture videos here. ](https://youtu.be/8ZzGgrGK3PY)

{: .note}
We used to have another chapter on process synchronisation using Semaphores, but it is taken out of our syllabus now. [You can still watch its brief video here](https://youtu.be/iQcPXj-wsGs). We will learn more about these next term in Computer System Engineering (CSE 50.005) instead.

In this final 50.002 chapter, we have learned that there are two parts of I/O handling:
1. **Device side:** input from the device is processed via asynchronous interrupt requests.
2. **Application (process) side:** input from the device is requested by a process via supervisor calls. 

The OS Kernel acts as an <span style="color:red; font-weight: bold;">intermediary</span> between requesting processes and the shared hardware. 

It has to carefully **schedule** real-time interrupt requests such that each can be serviced without violating the deadlines. We learned a couple of policies: weak (non-preemptive) and strong (pre-emptive) measure. Real-time constraints are **complex** to solve, and each policies have its own pros and cons. It is also not a trivial job to determine the best **priority ordering** for each device. 

We have come to the end of this course, and we have learned quite a great deal on how a computer is built,  what it means by having a "general-purpose" device and how to design an instruction set for it, along with memory and machine virtualisation. The OS Kernel is a program that enables machine abstraction; in a way such that each process can run in isolation from one another (great for both convenience in development and system security). To conclude that you have now known quite a fair bit of foundation as Computer Scientists, [give this video a watch](https://www.youtube.com/watch?v=-uleG_Vecis). 

Next term we will build on this knowledge and learn more about the fuller extent of the role of an OS Kernel: supporting interprocesses communcation, synchronizing between processes, and guarding shared resources between processes running in the system. 




