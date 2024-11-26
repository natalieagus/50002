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

{:.highlight-title}
> Detailed Learning Objectives
>
> - **Identify the Functionality of I/O Devices in Relation to the CPU**
>   - Describe how I/O devices operate asynchronously and independently of the CPU.
>   - Justify the slower operation speed of I/O devices compared to the CPU.
> - **Outline I/O Request Handling by the Operating System**
>   - Explain how and why I/O requests are handled asynchronously by the OS Kernel.
>   - Describe the process of handling I/O requests through supervisor calls and interrupts.
> - **Describe the Mechanism of Supervisor Calls (SVC)**
>   - Explain the SVC instruction and its role in facilitating process requests for Kernel services.
>   - Analyze the execution flow from SVC invocation to service routine execution.
> - **Describe the Process of Asynchronous Input Handling**
>   - Discuss how the OS Kernel manages asynchronous inputs from various I/O devices.
>   - Explain the implementation and operation of an interrupt-driven system for I/O handling.
> - **Practice on Real-Time I/O Handling and Summarize its Challenges**
>   - Explain the concept of latency and deadlines in real-time I/O request handling.
>   - Discuss and apply strategies to manage multiple interrupt requests effectively using priority levels.
> - **Determine the Impact of Interrupt Load on System Performance**
>   - Calculate the effective interrupt load and its impact on CPU performance.
>   - Analyze scenarios where high interrupt loads might affect system responsiveness and process execution.
>
> These objectives are designed to provide a detailed understanding of how an operating system manages I/O devices and processes, emphasizing the kernel's role in multitasking and real-time system responsiveness.
 
## Overview

{: .note-title}
> Recap
> 
> A single Beta CPU can only execute one instruction per clock cycle. The OS Kernel allows users to *multitask*, by **performing rapid context switching** between processes in the system, and giving each process the abstraction of being in the only process running in its own (isolated) **virtual machine**. 

When we use our computers, we know that we can attach multiple I/O devices to a computer: *mouse, keyboard, hard disk, monitor, printer, etc.* 

Each I/O device actually independently of the CPU. They do not operate with the same clk as the CPU (asynchronous) and is **not controlled** by the CPU. 
* They have their own simple processing unit (logic devices), and memory units to contain temporary data, e.g: preset mouse clicks or custom keyboard key value that will eventually be fetched by the CPU. 
* They're typically orders of magnitude **slower** than a CPU in operation and data processing. 

{:.note}
Further details on how I/O devices work are beyond the scope of this course. Right now it is sufficient to think of them as independent devices, asynchronous from the CPU. 


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

Normal program execution is frequently <span class="orange-bold">interrupted</span> by various events that require immediate attention, such as **Supervisor Calls (SVC)**, which are **synchronous** traps made by programs to request kernel services, and **Interrupt Requests (IRQ)**, which are **asynchronous** signals from hardware devices indicating events like input from a keyboard or network packet arrivals. These interruptions are especially critical for real-time I/O handling, where the system must process data or respond to events promptly to ensure smooth operation. 

To manage these interruptions effectively, the kernel employs policies—ranging from **strong policies** that prioritize fairness and resource optimization to **weak policies** that prioritize speed and simplicity—to balance performance and responsiveness in diverse scenarios.

  

## Recap: Synchronous and Asynchronous Interrupts

### Synchronous Interrupt Handling
Synchronous interrupt handling occurs when the interrupt is generated by the currently executing process as a direct result of its instructions. It happens in a <span class="orange-bold">predictable</span> manner during program execution. The characteristics of synchronous interrupt handling are: 
- Triggered by **specific instructions** in the program, such as **Supervisor Calls (SVC)** or illegal operations (e.g., divide by zero).  
- Occurs at a **defined point** in the execution flow, making it deterministic.  
- The CPU immediately <span class="orange-bold">transfers</span> control to the kernel, which handles the interrupt and performs the requested operation (e.g., accessing I/O or managing resources).  
- Once resolved, the kernel <span class="orange-bold">restores</span> the process state and resumes execution from where it was interrupted. In the Beta CPU, the address (to resume the interrupted process execution) can be found at register `XP`. 

Synchronous interrupts are integral to controlled interactions between user programs and the kernel for services like I/O handling.

If you'd like a brief overview on how SVC is handled and implemented, give this [appendix](#the-supervisor-call) section a read. 

## Asynchronous Interrupt Handling

Asynchronous I/O handling occurs when input/output operations are initiated independently of the program's current execution flow, allowing the CPU to continue other tasks without waiting for the I/O operation to complete. The characteristics of asynchronous interrupt handling are: 
- **Triggered by hardware interrupts** (e.g., keyboard input, disk read/write completion).  
- In the Beta CPU, the CU immediately directs the PC to XAddr (generic interrupt handler) 
- The handling on **interrupt handlers** to process the I/O event and buffer data in the kernel until the requesting process retrieves it.  
- This kind of system is efficient as it allows the CPU to utilize idle time for running other processes.  

Asynchronous I/O handling is key to real-time systems and multitasking, ensuring responsiveness and efficient resource usage.

### Interrupt-Driven System
Most modern system is **interrupt-driven**, with the following characteristics. 

Any I/O device can *request* for an I/O interrupt;  in the presence of new input or update, etc. This will <span class="orange-bold">interrupt</span> the execution of the current process in the CPU, causing the PC to switch to `XAddr` (*interrupt handler*). 

The interrupt handler does the following:
  1. **Saves** the states of the interrupted process,
  2. Examines the **cause** of the interrupt, and 
  3. Branch to an appropriate I/O interrupt handler (if the interrupt was caused by an I/O device). 

The **device-specific** I/O interrupt handler will fulfil the I/O Interrupt request, such as fetching new input from the requesting device and putting it to a dedicated buffer in the Kernel space. This value stays in the Kernel buffer until a process wants it by making an `SVC`. When an `SVC` is made, the Kernel fetches the  requested item from the buffer (if any) and put it in `Reg[R0]` before returning to the originating process, and clearing the Kernel buffer.

{: .important}
It is imperative to realise that when a process requests for a keystroke (e.g: a text editor waiting for key presses to arrive), it has to **wait** until a key is actually pressed by the user. The CPU clock cycle is very fast (3-4Ghz in mid-tier consumer computers made in 2023), way faster than human's capability to supply input. Therefore we cannot waste resources and **wait** until a key is pressed. We know that a text editor cannot resume execution until a key is pressed (simply idling), and so the Kernel must be written in such a way that the keystroke-requesting text editor is swapped out of the CPU, utilise the CPU to run other processes (e.g: Spotify in the background), and **RESUME** the text editor back the moment a new key stroke is received (provided that the text editor is currently selected/opened in the window). Hence the name: **asynchronous** interrupt handling -- because we see keystrokes being registered in a requesting text-editor as a two independent event that are not *intentionally* matched. The text editor will continue idling (and the rest of the processes in the computer can run) when no key is pressed, and the computer does not crash if we press any uneeded key while not focusing on the text editor.
  

## Real-Time I/O Handling

 <img src="https://www.dropbox.com/s/h0e8epak5kz505o/rth.png?raw=1"  class="center_seventy"  >

When asynchronous or synchronous I/O interrupt requests are made they may not be immediately **serviced** by the Kernel. The figure above illustrates a general timeline from when a particular **interrupt request** is first made to the moment it is serviced.

{:.note}
Both asynchronous and synchronous interrupts may <span class="orange-bold">not</span> be immediately serviced if the system is handling a higher-priority task or another interrupt. In such cases, the interrupt is queued or delayed until the CPU is available, depending on the scheduling and priority policies of the operating system. However, because synchronous interrupts are predictable and tied to the execution flow of the program, they are typically serviced as soon as possible to maintain process continuity.

### Deadline

{: .note-title}
> Deadline
> 
> Each interrupt request usually have a <span style="color:red; font-weight: bold;">deadline</span>, and the Kernel has to finish servicing the request before the said deadline. 
 
For example, the Kernel has to service each keyboard input interrupt request **quick** enough (deadline should be within ~ms) so as to give the experience of a responsive system. 

### Latency

{: .note-title}
> Latency
> 
> Latency is defined as the amount of elapsed time from interrupt is first requested up until  the Kernel **BEGIN** servicing it. 


The Kernel scheduler in the kernel has to ensure that the interrupt request is serviced **before its deadline**. The amount of latency affects how "real-time" the machine reacts. The **shorter** the latency, the more **responsive** it will seem. 
  

## Scheduling multiple interrupts

The computer is connected to multiple I/O devices (disk, keyboard, mouse, printer, monitor, etc). Each device is capable of making asynchronous interrupt requests. Whenever multiple interrupt requests are invoked, the Kernel has to decide how to schedule these interrupt requests.

There are two different policies that can be adopted to handle I/O interrupts: weak and strong policy. 

{:.note}
We will only elaborate (in theory) each policy briefly. Please refer to the [appendix](#kernel-i/o-management) section if you'd like to know more about its implementation in the Kernel and the required hardware support. 

### Weak Policy
A **Weak policy** is non-preemptive. This means that the machine has a **fixed** ordering of device handling, but it will not pre-empt current service. It will only reorder requests in the interrupt **queue** based on the types of devices.  

For example, it will prioritise mouse click over keyboard presses by default at all times. However, if a request to handle mouse click comes and  the CPU is already handling keyboard press request, it will not interrupt the current keyboard press service. 

### Strong Policy
A **Strong policy** is <span class="orange-bold">preemptive</span>.  This means that it allows interrupt **handlers** with lower priority to be interrupted **only** by other handlers with *higher* priority level. 

If the CPU is currently running a handler of lower priority, it will be forced to perform a **context switch** to run the handler with the higher priority (required to service the interrupt). The interrupted handler can be **resumed** later on (not completely restarted, as its old state was saved) after the interrupting higher has finished execution. 

{: .note}
Handlers of the same priority level **can never** interrupt each other. Refer to the [appendix](#setting-beta-cpu-handler-priority-level) section on how the Beta CPU may set handler priority level. 

### Recurring Interrupts 

Some interrupts may arrive **periodically**, for example if we are expecting a huge incoming scanned data from a printer, the interrupts might occur periodically as the printer is ready to send the data chunk by chunk.

{: .important-title}
> The Consequence
> 
> If higher priority interrupts happen at a high rate, requests with lower priorities might be interrupted repeatedly -- potentially resulting in <span class="orange-bold">starvation</span>. 

There is no easy solution to this issue, each scheduling policy has their own pros and cons. 

## Worked Example on Scheduling Policies

Each scheduling policy has its own pros and cons. Non-preemptive Kernel (Weak Policy) is simpler to develop, but without it the device with the slowest service time constraints response to the fastest devices. With preemption (Strong Policy) latency for higher priority devices is not affected by service times of the lower priority devices. However, this additional feature will complicate the Kernel code. 

We will use some examples to understand how each policy works. 

### Setup
Consider a computer that has three devices: disk, keyboard and printer. Each has the following specs for service time, average period, and deadline: 

| Device | Service Time (ms) | Deadline (ms) | Period (ms) 
|--|--|--|--|
| Keyboard | 0.8 |3 | 10
| Disk | 0.5 |3 | 2
| Printer | 0.4 |3 | 1

{: .note-title}
> Period
> 
> The value of "period" indicates how often each device will trigger an async interrupt.
> 
> For instance, the keyboard will throw an interrupt once every 10ms (or 1000 times per second). It has to be **serviced** within 3ms from the time the interrupt occurs, and it requires 0.8ms for the CPU to service the request. The same idea works for Disk and Printer. 

### Case 1: Without scheduling

Without any scheduling measure, the worst case latency seen **by each device** is the total service time of the other devices, as the interrupt requests can arrive in <span style="color:red; font-weight: bold;">any</span> order.

| Device | Service Time (ms) | Deadline (ms) | Period (ms) | Worst-case Latency (ms)
|--|--|--|--|--|
| Keyboard | 0.8 |3 | 10 | 0.9 |
| Disk | 0.5 |3 | 2 | 1.2
| Printer | 0.4 |3 | 1 |1.3

{: .note-title}
> Explanation
> 
> Without any scheduling policy in place, it is a first-come-first-serve basis. At t=0, all 3 requests arrive at the same time, but we don't know the exact ordering. For Keyboard, the worst case latency is that Disk and Printer arrived split second earlier than itself, hence it has to wait for the two devices to finish their service requests before Keyboard can start to be serviced. The same idea works for Disk and Printer. 


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
> The deadline for both Keyboard and Printer is still not met. The **worst case latency** only signifies the time taken from the moment the request arrives to the moment the service begins. It does not signifies anything about when the servicing will **complete**. Since Printer's worst case latency is 0.5ms and its service time is 0.4ms, it will surely <span style="color:red; font-weight: bold;">exceeds</span> the deadline of 0.7ms! 
 
To understand this more clearly, let's draw an interrupt timeline diagram.

#### Interrupt Timeline Diagram
The interrupt requests from these devices are recurring with certain **frequency** (or period). For example, the keyboard interrupt occurs once every 10ms, and so on. 

We can draw the timeline of these interrupts as follows:
<img src="https://dropbox.com/s/vn644mg6ifqnqd1/irqstimeline.png?raw=1"  class="center_full"  >

Since the disk has the highest priority, it will be serviced first. Once finished, the printer will be serviced. 

After both disk and printer are serviced, the keyboard is serviced at `t=0.9`. However, it will be interrupted by the printer at `t=1`. Therefore, the keyboard service time is <span style="color:red; font-weight: bold;">spread</span> out due to interrupts from printer and disks: 

<img src="https://dropbox.com/s/5wodlj3hwpx9ltm/interruptsvc.png?raw=1"  class="center_full"   >

{: .note}
The keyboard service time is spread out (red region) due to preemptive interrupts from printer and disks

{: .new-title}
> Self Interrupt
> 
> If we use **strong** policy, and priority ordering **Disk $$>$$ Printer $$>$$ Keyboard** (same as above), we know that disk can always pre-empt other ongoing services. Can disk request interrupt any ongoing Disk request? Is it possible for **two** or more requests from disk to be present at the same time (one in queue and one is currently serviced by the CPU)? 
> 
> Hint: compare disk's interrupt period with its service time.

#### Missing Deadline
The priority ordering Disk  > Printer  > Keyboard in Case 3 above **does not** fulfil the deadline for Printer or Keyboard when either **weak** or **strong** policy is used since the worst-case latency + service time for each Printer and Keyboard exceeds their deadline. 

Therefore, this scenario is simply <span class="orange-bold">not feasible</span> and we need to relax one of the device's deadline. Give this [appendix](#missing-i/o-deadline) section a read if you'd like to know more about the real-world consequences of missing those deadlines.  


{: .new-title}
> New deadline
> 
> Suppose we have the same hardware priority ordering: **Disk $$>$$ Printer $$>$$ Keyboard** (same as Case 2 above).
> 
> What will be the **minimum deadline** for each device such that the **weak** policy can fulfil all devices' deadline?  What about if **strong** policy is used, what will be the minimum deadline for printer and keyboard be?
> 
> As further practice, ask yourselves if there exist **another** priority ordering such as Printer  > Disk  > Keyboard that can meet the **original** deadline with **strong policy**. 


If you're interested in reading more about *how* the values of deadline, max latency, and frequency (or period) is set in practice, give this section in [Appendix](#setting-i/o-requirements) a read. 

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
 
{:.highlight}
The total Interrupt load of these devices on the CPU is therefore the sum of those three: 73%. The remaining fraction: 27% is what is left for processes to use to do actual computation. 

A computer will <span class="orange-bold">not</span> be able to run any other processes if the Interrupt load reaches 100%. This is one of the possible reasons on why your older computer "freezes" for a moment when you overwhelm it with inputs (e.g: backing up to external disk, typing furiously, opening hundreds of background processes at the same time).

 
## Summary
[You may want to watch the post lecture videos here. ](https://youtu.be/8ZzGgrGK3PY)

{: .note}
We used to have another chapter on process synchronisation using Semaphores, but it is taken out of our syllabus now. [You can still watch its brief video here](https://youtu.be/iQcPXj-wsGs). We will learn more about these next term in Computer System Engineering (CSE 50.005) instead.

In this final 50.002 chapter, we have learned that there are two parts of I/O handling:
1. **Device side:** input from the device is processed via asynchronous interrupt requests.
2. **Application (process) side:** input from the device is requested by a process via supervisor calls. 

The OS Kernel acts as an <span style="color:red; font-weight: bold;">intermediary</span> between requesting processes and the shared hardware. 

It has to carefully **schedule** real-time interrupt requests such that each can be serviced without violating the deadlines. We learned a couple of policies: weak (non-preemptive) and strong (pre-emptive) measure. Real-time constraints are **complex** to solve, and each policies have its own pros and cons. It is also not a trivial job to determine the best **priority ordering** for each device. 

Here are key points from this notes:
1. **Importance of deadline and latency in real time I/O handling**: Deadline refers to absolute time of which a task must be done, while latency refers to the delay from when the task is first requested to the time when the task is finally serviced. Both are used to plan I/O scheduling policy. 
2. **I/O scheduling policies**: Weak and Strong scheduling policy are introduced. Weak policy (non-preemptive) refers to ordering of priority in the queue without interrupting the ongoing service, while strong policy (preemptive) allows interruption. Strong policy requires a more complex implementation because it involves **frequent** interruptions to handle I/O events, requiring the system to **store** and **restore** process states efficiently. This added overhead ensures that the CPU and I/O devices are effectively synchronized, which complicates the design and execution of scheduling algorithms.
3. **Effective interrupt load**: The computational <span class="orange-bold">burden</span> imposed by handling interrupts, including the time spent saving and restoring state, executing interrupt service routines, and managing context switches, which can impact the CPU's ability to perform other tasks efficiently.

## Next Steps
We have come to the end of this course, and we have learned quite a great deal on how a computer is built,  what it means by having a "general-purpose" device and how to design an instruction set for it, along with memory and machine virtualisation. The OS Kernel is a program that enables machine abstraction; in a way such that each process can run in isolation from one another (great for both convenience in development and system security). To conclude that you have now known quite a fair bit of foundation as Computer Scientists, [give this video a watch](https://www.youtube.com/watch?v=-uleG_Vecis). 

In the next term, we will build on this knowledge and learn more about the fuller extent of the role of an OS Kernel: supporting interprocesses communication, synchronizing between processes, and guarding shared resources between processes running in the system. 

# Appendix

## Supervisor Call Implementation

In both x86 and ARM architectures, a system call (also known as a supervisor call or SVC) allows user-mode applications to safely request services and perform operations that require higher privilege levels, typically provided by the operating system kernel. Here’s how system calls are implemented in these two architectures:

### x86 Architecture
In x86 systems, system calls can be made through several mechanisms, depending on the operating system and the specific processor features available:

1. **INT Instruction**: Traditionally, system calls in x86 were made using the software interrupt instruction `INT`. For example, on older versions of Microsoft Windows, `INT 0x2E` was used to invoke system services, while Linux used `INT 0x80`.

2. **SYSCALL/SYSRET Instructions**: Modern x86 processors provide the `SYSCALL` and `SYSRET` instructions, which are designed for fast system call entry and exit. These are used in modern Linux and Windows systems and offer a more efficient way to switch to kernel mode compared to software interrupts.

3. **SYSENTER/SYSEXIT Instructions**: Introduced by Intel as part of their SpeedStep technology, these instructions provide another method to perform fast system calls, optimized for quickly transitioning between user and kernel mode.

Each method involves switching the CPU to a higher privilege level (kernel mode), where the operating system kernel can safely execute the requested operation before returning to user mode.

### ARM Architecture
In ARM, the approach to system calls is somewhat different and can vary more significantly between processor models and operating systems:

1. **SVC Instruction**: The ARM architecture uses a specific instruction called `SVC` (Supervisor Call), previously known as `SWI` (Software Interrupt), for making system calls. This instruction causes the processor to switch from user mode to supervisor mode, triggering an exception that is handled by the kernel.

2. **Secure Monitor Call (SMC)**: In systems with TrustZone technology, `SMC` is used for secure system calls that involve switching to a secure execution environment.

The `SVC` instruction in ARM is followed by a number that typically serves as an index to the system call that the application wants to execute. For example, `SVC 0` might correspond to the system call for exiting a process. The kernel has a handler that interprets this number, performs the requested operation, and then returns control to user space.

### Piggybacking on Illegal Instructions
In some systems, especially older or more constrained environments, system calls can be piggybacked on illegal operation codes (opcodes). When an illegal opcode is executed, it triggers an undefined instruction exception that the kernel handles. The kernel then checks if the exception corresponds to a legitimate system call encoded in an illegal instruction, allowing the system to repurpose this mechanism for system calls. This method is less common and generally not used in modern general-purpose systems due to its inefficiency and the potential for confusing genuine illegal operations with system calls.

{:.note}
Both x86 and ARM have optimized these mechanisms over time to balance the security and performance implications of switching between user and kernel modes.

### RISCV Architecture
RISC-V, like ARM and x86, provides mechanisms for implementing system calls, but with its own unique approach consistent with its modular and extensible ISA (Instruction Set Architecture). Here’s how system calls are handled in RISC-V architectures:

#### Environment Call (ECALL) and Return (ERET)

1. **ECALL (Environment Call)**: In RISC-V, the system call mechanism is provided by the `ECALL` instruction. This instruction is used by user-mode applications to enter the supervisor or machine mode, depending on the current privilege level of the process, to request services performed by the operating system kernel.

2. **MRET and SRET (Machine/Supervisor Return)**: After the system call is processed, the kernel mode software uses either `MRET` (Machine Return) or `SRET` (Supervisor Return) instructions to return to the previous privilege level. These instructions help in returning to the user mode after the system call has been serviced, ensuring a smooth transition back to the process that made the call.

#### How ECALL Works

- **Triggering an Exception**: The `ECALL` instruction causes an immediate transfer of control to a predefined exception handler based on the current privilege level (e.g., from user to supervisor mode). This is similar to a trap or interrupt.
- **Exception Handling**: The processor jumps to an exception handler address specified in the `stvec` (Supervisor Trap-Vector Base-Address Register) or `mtvec` (Machine Trap-Vector Base-Address Register), where the kernel's system call dispatcher is located.
- **Dispatcher**: The kernel dispatcher examines registers to determine which system call is being requested. System call parameters are typically passed through registers, and the system call number might also be in a register, as defined by the ABI (Application Binary Interface).
- **Return**: After the system call is executed, control is returned to the user program via `SRET` or `MRET`, which also restores the relevant context.

#### Advantages of RISC-V's Approach

RISC-V’s approach to system calls via `ECALL` is designed to be simple yet efficient, aligning with the overall RISC-V philosophy of keeping the core instruction set minimal while allowing for extensions. This simplicity facilitates easier implementation and verification, essential for security and reliability in modern computing environments.

RISC-V continues to evolve, and its approach to system calls exemplifies its flexibility and adaptability, making it suitable for a wide range of applications from embedded systems to high-performance computing.

## Process Scheduling

When a process invokes a function like `getchar()`, which reads a character from standard input, there can be a situation where the character is not immediately available—for example, if the user has not yet pressed a key. Here's how the operating system, particularly its kernel, handles such a scenario:

- **Blocking the Process**: If the character data is not available, the kernel will block the process that called `getchar()`. This means the process is put into a waiting state where it does not consume CPU resources while it waits for the input to become available.

- **Context Switch**: With the process that called `getchar()` now blocked, the kernel performs a context switch. This switch involves saving the state of the currently running process and loading the state of another process that is ready to run. This ensures that the CPU is used efficiently, not wasting cycles on a process that is simply waiting.

- **Interrupt Handling**: Input from the keyboard is typically handled via interrupts. When the user finally presses a key, an interrupt is generated by the keyboard hardware. The kernel's interrupt handler will then process this interrupt.

- **Unblocking the Process**: Once the interrupt indicates that the key press has occurred and the character is available, the kernel will move the previously blocked process back to a ready state. This transition involves updating the process's status and placing it back in the queue for execution.

- **Resuming Execution**: When the scheduler next selects this process for execution, the state of the process is restored, and `getchar()` can now return the newly available character data to the process.

This mechanism of blocking, context switching, and unblocking allows the operating system to manage resources efficiently and ensure that the system remains responsive even when some processes are waiting for input or other events.

## Kernel I/O Management

The kernel's handling of asynchronous I/O (input/output) operations and priority implementations, whether weak or strong, involves complex mechanisms that ensure efficient system performance and resource utilization. Here’s a detailed look at how these concepts are managed:

### Asynchronous I/O Handling

Asynchronous I/O allows processes to perform other tasks without waiting for I/O operations to complete, enhancing overall system efficiency and responsiveness. Here's how it's typically handled:

1. **Non-Blocking Requests**: When a process initiates an asynchronous I/O request, it issues a non-blocking call that immediately returns control to the process. The process can continue executing while the I/O operation is handled in the background.

2. **Kernel I/O Scheduling**: The kernel manages these I/O requests through its I/O scheduler, which prioritizes I/O operations based on various factors, including the type of device and the urgency of the requests.

3. **Completion Notification**: Once the I/O operation is complete, the kernel notifies the process. This can be handled through different mechanisms, such as callbacks, signals, or polling. A callback involves the kernel executing a specified function when the I/O completes, while signals involve the kernel sending a signal to the process, and polling requires the process to periodically check the status of the operation.

### Priority Implementations (Weak vs. Strong)

Priority in process scheduling and resource allocation can be categorized as weak or strong priority implementations:

1. **Weak Priority**: In systems with weak priority, while processes are given priorities, these are used as suggestions rather than strict rules. Higher priority processes are generally scheduled before lower priority ones, but the system may occasionally allow lower priority processes to run to ensure fairness or prevent starvation.

2. **Strong Priority**: Systems with strong priority strictly adhere to the priority levels assigned to each process. A higher priority process will always preempt a lower priority process, and lower priority processes won't execute until all higher priority processes have completed their tasks or are blocked/waiting.

### Kernel's Role in Priority Management

- **Process Scheduler**: The kernel's scheduler uses priority information to determine the order of process execution. It allocates CPU time based on process priority, adjusting the scheduling as necessary to accommodate real-time requirements or user-configured priorities.

- **Real-Time Scheduling**: In systems that support real-time operations, the scheduler often implements strong priority policies to meet timing constraints. Real-time schedulers typically use algorithms like Rate Monotonic Scheduling (RMS) or Earliest Deadline First (EDF) to manage processes with strict execution requirements.

- **Resource Allocation**: Beyond CPU scheduling, priority may also influence other aspects of resource allocation, such as memory access, disk I/O prioritization, and access to peripheral devices.

The kernel's handling of asynchronous I/O and priority is critical for maintaining system performance and stability, especially in environments where multiple processes compete for limited resources or where real-time processing is required.

### Hardware Support for Handler Priority Level

The concept of I/O priority at the hardware level involves several mechanisms within the CPU and associated hardware that help the operating system kernel manage and prioritize I/O operations. This is crucial in systems where I/O performance can significantly impact overall system responsiveness and throughput. Here’s how I/O priority is typically handled at the hardware level:

### Hardware Support for I/O Priority

1. **DMA (Direct Memory Access) Controllers**:
   - DMA controllers enable devices to transfer data directly to/from main memory without constant CPU intervention, freeing up CPU resources for other tasks.
   - Some advanced DMA controllers support priority levels, allowing higher priority I/O operations to preempt lower priority ones. This can be crucial in systems where certain I/O operations are time-sensitive.

2. **Interrupt Controllers**:
   - Modern CPUs use advanced programmable interrupt controllers, such as the Advanced Programmable Interrupt Controller (APIC) in x86 architectures.
   - These controllers can prioritize interrupts from various I/O devices. Higher priority interrupts can be configured to preempt lower priority ones, ensuring that critical I/O operations are handled more promptly.

3. **I/O Schedulers in Storage Controllers**:
   - Storage controllers, especially in RAID configurations or enterprise-level SSDs, often have their own built-in I/O schedulers.
   - These schedulers can prioritize I/O operations based on predefined rules or dynamically based on system load and I/O operation characteristics.

4. **Network Interface Cards (NICs)**:
   - Modern NICs can prioritize network packets based on Quality of Service (QoS) parameters, which is especially important in network-intensive applications.
   - Some NICs also support offloading of certain network-related processing tasks from the CPU, effectively prioritizing network I/O at the hardware level.

### Integration with Operating System

- **Driver and Kernel Support**:
   - Device drivers play a critical role in implementing I/O priority by interacting directly with the hardware features. These drivers must be designed to take advantage of hardware capabilities like DMA prioritization and interrupt handling.
   - The kernel itself must support these features through its subsystems, such as the interrupt handling system and the block device layer.

- **I/O Priority in the Kernel**:
   - Operating systems often extend hardware I/O prioritization capabilities with software strategies. For example, Linux uses the Completely Fair Scheduler (CFS) for CPU scheduling and has several I/O schedulers (CFQ, Deadline, NOOP) that manage how block I/O operations are prioritized and dispatched.
   - The kernel can also manage I/O priority through its virtual memory system, by prioritizing page-in (reading from disk into RAM) and page-out (writing from RAM to disk) operations.

### Challenges and Considerations

- **Hardware Limitations**:
   - While hardware support can significantly improve I/O performance, the actual effectiveness depends on the specific capabilities and configurations of the hardware.
   - Compatibility between different hardware components and consistency in performance across different loads and conditions can also be challenging.

- **Complexity**:
   - Managing I/O priority at both the hardware and software levels adds complexity to system design and operation.
   - Ensuring that priority settings at the hardware level align with the overall system priorities set at the software level requires careful tuning and coordination.

In summary, I/O priority at the hardware level involves a mix of DMA prioritization, interrupt prioritization, and specialized controllers with built-in scheduling capabilities. Effective use of these features requires tight integration with the operating system's kernel and careful management to ensure that I/O operations contribute positively to system performance and responsiveness.

## Setting Beta CPU Handler Priority Level
In the Beta CPU, the **priority level** for each interrupt handler can be implemented using the  higher `p` bits of `PC`. As an implication, the actual **location** of the handler in memory decides its priority level. Some further hardware tweaks on the CPU is needed to support this feature, but we don't have to dwell too deep into that at this point. 

{: .note}
Note that other CPU architecture uses special registers that indicate handler priority level and not necesarily the `PC` register. This example is for illustration purposes only.

<img src="https://dropbox.com/s/7w7oy1jyaa5trnq/pc.png?raw=1"     class="center_fifty"  >

The number of bits of `p` depends on how many priority levels you want the machine to have, e.g: 3 bits for 8 priority levels.

{: .note}
This is analogous to what we have learned before. A system two mode: Kernel and User mode, is differentiated only with the MSB of the PC -- `1` for Kernel mode (hence enabling the highest privilege) and `0` for user mode. 

## Setting I/O Requirements
The period of interrupt, maximum latency, or deadlines for devices such as keyboards, printers, mice, and other peripherals are typically determined by a combination of device specifications, driver implementations, and operating system requirements. Here’s how these parameters are established and computed in the real world:

### Device Specifications

1. **Manufacturer Specifications**:
   - Device manufacturers define the base operational parameters of a device, including its capabilities and limitations regarding data transmission rates, response times, and interrupt frequencies. 
   - For example, a keyboard might be designed to generate an interrupt every time a key is pressed or released, while a printer might generate interrupts for status changes such as "ready" or "out of paper."

2. **Hardware Capabilities**:
   - The design of the hardware itself, including the microcontroller used in the device and its I/O interfaces, sets certain limitations and capabilities for handling interrupts.

### Operating System and Driver Implementation

1. **Driver Configuration**:
   - Device drivers, which serve as intermediaries between the operating system and the hardware, are configured to handle interrupts based on the device's specifications and the needs of the OS.
   - Drivers can implement buffering strategies, debouncing algorithms for keyboards, or flow control mechanisms, all of which can affect how interrupts are managed.

2. **OS Policies and Mechanisms**:
   - The operating system may have policies for managing device interrupts, which can include settings for priorities and handling mechanisms to ensure responsiveness or to meet real-time requirements.
   - For instance, an OS might prioritize mouse and keyboard interrupts over slower devices like printers to maintain a responsive user interface.

### Computation and Adjustment of Interrupt Periods

1. **Real-Time Operating System (RTOS) Requirements**:
   - In systems where timing is critical (real-time systems), the interrupt period might be carefully calculated to ensure that the system can meet specific deadlines. This involves real-time analysis and possibly simulations during the system design phase.
   - RTOSes often use a combination of static settings (defined at design-time based on worst-case scenarios) and dynamic adjustments (at runtime based on current system load and performance metrics).

2. **Empirical Testing and Performance Tuning**:
   - Device behavior under various conditions can be empirically tested to determine optimal interrupt frequencies and handling strategies.
   - Performance tuning might involve adjusting the interrupt rate based on observed system performance and application requirements.

3. **Feedback from the System**:
   - Some advanced systems implement feedback mechanisms where the device driver or the device itself can adjust the rate of interrupts based on feedback from the operating system about current load and performance.

### Example in Real-World Devices

- **Keyboard**: The interrupt period is typically determined by the hardware capability to detect key presses and the necessity to debounce mechanical switches to avoid multiple interrupts for a single press. The OS driver handles these interrupts by reading the key press data and possibly managing an internal queue to process inputs as they come.
  
- **Mouse**: Interrupts are generated based on movement detection or button presses. The frequency of interrupts can be adjusted (in some advanced mice) to balance responsiveness with system load.

- **Printer**: Interrupts might be less frequent, triggered by events such as job completion or error states. The system needs to ensure that these interrupts are handled in a timely manner to manage print jobs efficiently.

In summary, the decision on the period of interrupt and maximum latency is a multi-faceted process involving hardware capabilities, software implementation, and real-world testing and tuning to meet specific application needs and system performance requirements.

## Missing I/O Deadline 
Missing a deadline in systems that rely on timely computing can have varying consequences depending on the type of system and the criticality of the task. The impact of missing a deadline is often categorized into how it affects system functionality and user experience. Here’s an overview of what can happen:

### Soft Real-Time Systems
In soft real-time systems, deadlines are important but not absolutely critical. Missing a deadline can degrade system performance and user experience but doesn't cause catastrophic failure. Here are some examples:

- **Media Streaming**: If a video player misses frame rendering deadlines, the result might be decreased video quality or brief stutters. Although undesirable, this does not disrupt the primary function of the system.
- **Web Servers**: Slower response times due to missed deadlines can lead to poor user experience but typically don’t disrupt service availability.

### Hard Real-Time Systems
In hard real-time systems, deadlines are critical, and missing a deadline can lead to system failure or serious consequences. These systems are often safety-critical.

- **Automotive Systems**: In an automotive control system, such as a brake control system, missing a deadline might mean failing to apply brakes in time, potentially leading to an accident.
- **Aerospace and Aviation**: Control systems in aircraft must respond within specified time frames. Missing a deadline could disrupt the operation of the aircraft, leading to dangerous situations.

### Real-Time Financial Systems
In financial trading systems, missing a deadline might mean missing the best moment to execute a high-value trade, potentially resulting in significant financial loss.

### Consequences of Missing Deadlines

1. **Degraded Performance**: In less critical scenarios, missing deadlines might simply result in reduced system performance, which can affect efficiency and user satisfaction.

2. **System Instability**: In more severe cases, missing deadlines can lead to system instability. Tasks may accumulate, leading to a snowball effect where subsequent deadlines are also missed, worsening the situation.

3. **Safety Risks**: In systems where safety is a concern, missing deadlines can directly endanger human lives.

4. **Economic Impact**: Missed deadlines in commercial systems can lead to financial loss, either through direct operational impacts or due to the loss of customer trust and business reputation.

### Management Strategies
To mitigate the risks of missing deadlines, systems designers use several strategies:

- **Priority Scheduling**: Ensuring that the most critical tasks have the highest priority and preempt less critical tasks.
- **Redundancy**: Implementing redundant systems that can take over if one component fails to meet its deadline.
- **Time Budgeting**: Allocating sufficient time buffers and realistically assessing task completion times to ensure deadlines are met.
- **Load Shedding**: Temporarily reducing functionality or quality of service to maintain critical operations during high load periods.

Overall, the handling and prioritization of tasks in systems with stringent deadline requirements are crucial for maintaining operational integrity, safety, and user satisfaction. Missing a deadline is a significant event that system designers strive to avoid through careful planning and robust system design.

### The Supervisor Call

{: .new-title}
> SVC in Beta CPU
> 
> The SVC is a 32-bit instruction that triggers an `ILLOP`, hence **trapping** the process onto the Kernel whenever it is executed. In $$\beta$$'s Tint OS , the `SVC` has the opcode: `000001` and the remaining 26 bits can be used to "*index*" the Kernel service requested.  


This special SVC instruction allows processes to "communicate" with the Kernel by trapping (stopping) its own operation and transferring CPU control to the Kernel (entered via the `ILLOP` handler). The `ILLOP` handler saves the states of the calling process, before it checks if the `OPCODE` of the instruction that triggers the trap is some known value, e.g: `000001`.  If its `OPCODE` is indeed `000001`, it will branch to a generic `SVC_handler`, else it will branch to error exception handler (which will probably terminate the calling process). 

{:.note}
You may refer to this [Appendix](#supervisor-call-implementation) section to know how SVC is actually implemented in other architectures. The idea remains generally similar. 

#### SVC Handler
The `SVC` handler does the following routine:
1. Examine the last faulting instruction, 
2. Extract its lower `N` bits and 
3. Branch to the appropriate service routine as requested by the calling process based on the value of `N`

#### Sample Implementation of SVC Handler 
Here's a sample code snippet for an `SVC_Handler` function in Beta CPU: 
```nasm
SVC_Handler:  
LD(XP, -4, R0)	| examine the faulting instruction
ANDC(R0, Nx{b1}, R0) | mask out lower N bits, if N == 4, then we have 0xF, or if N is 7 then we have 0x7F
SHLC(R0, 2, R0) | make a word index
LD(R0, SVCtbl, R0) | load service table entry
JMP(R0) | jump to the appropriate handler
```

`SVCtbl` is a **label** for specific Kernel subroutines. It is a simple data structure containing entry points to many other SVC handlers, such as writing output or fetching input from each devices. `UUO` is a **macro** that directs the PC to each subroutine: `HaltH`, `WrMsgH`. 

```
.macro UUO(ADR) LONG(ADR+PC_SUPERVISOR)	| Auxiliary Macros

SVCTbl: UUO(HaltH) | SVC(0): User-mode HALT instruction
UUO(WrMsgH) | SVC(1): Write message
UUO(WrChH) | SVC(2): Write Character
UUO(GetKeyH) | SVC(3): Get Key
UUO(HexPrtH) | SVC(4): Hex Print
UUO(WaitH) | SVC(5): Wait(S), S in R3
UUO(SignalH) | SVC(6): Signal(S), S in R3
UUO(YieldH) | SVC(7): Yield()
```

#### Example SVC Application
One common example where `SVC` is made is when a process checks for keyboard input. Processes running in user mode do not have direct access to any of the hardware, so they cannot simply check the keyboard for new keystrokes. Moreover, the keyboard is **shared** for usage by many processes running in the system, for example: text editors, web browsers, video game, etc.  

For example, the execution of `getchar()` in C triggers a supervisor call. This means that the process needs to switch to the Kernel mode, and the Kernel helped to check if there's such input from the keyboard. 

The function `getchar()` is translated into `SVC(j)` (among other things). The value of `j` is OS dependent. 

`SVC(j)` **traps** the calling user process, switching it to the Kernel mode and execute Kernel `ILLOP` handler. It eventually examines the value of `j` and branch to the appropriate service **routine** that is able fetch the input for the keyboard: `GetKeyH`. Instructions in `GetKeyH` fetches the requested  (assuming there's an input), and  leave it in `Reg[R0]` 

`GetKeyH` returns to the  remaining of the `ILLOP` handler. It **restores** the state of the calling process and resume it. Finally, the calling process can now get the requested keyboard character from `Reg[R0]`.

{:.note-title}
> What if requested char is not available?
>
> When a process uses `getchar()`, the character it requests may not be immediately available if the user hasn't yet pressed a key. In such cases, the kernel may block the calling process—putting it on hold—and switch to running another process until the required keystroke occurs. You may read this [appendix](#process-scheduling) section to find out more.  