---
layout: default
permalink: /lab/lab6
title: (Ungraded) Tiny OS
description: Tiny OS Lab handout covering topics from Virtual Machine, Asynchronous IO Handling, Kernel, and OS Services
parent: Labs
nav_order:  6
---

* TOC
{:toc}

**50.005 Computer System Engineering**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design
<br>
*Materials Adapted from MIT 6.004*

# Tiny OS
This Lab will be used in 50.005 Computer System Engineering in Term 5 (Week 1-2) to gently bridge your knowledge from the last 3 weeks of 50.002 to the first 2 weeks of 50.005. You are free to read around if you'd like to get started early. 

## Starter Code
Download the following file and place it inside your `/50002/` folder. This is what you're going to open and modify or study for this lab, then submit (unless otherwise stated):
- [`tinyOS_submit.uasm` ](https://www.dropbox.com/s/t6zhpy30cx0o8fe/tinyOS_submit.uasm?dl=1)


## Related Class Materials
The lecture notes on [Virtual Machine](https://natalieagus.github.io/50002/notes/virtualmachine), and [Asynchronous handling of I/O Devices](https://natalieagus.github.io/50002/notes/asyncio) are closely related to this lab. 

<br>Related sections in [Virtual Machine](https://natalieagus.github.io/50002/notes/virtualmachine):
* [The OS Kernel](https://natalieagus.github.io/50002/notes/virtualmachine#the-operating-system-kernel): The "TinyOS" in this lab represents a very simple kernel that timeshare the execution of three processes: P0, P1, and P2. It keeps track of the execution of these processes via a process table 
* [OS Multiplexing and Context Switching](https://natalieagus.github.io/50002/notes/virtualmachine#os-multiplexing-and-context-switching): Round robin execution of P0, P1, and P2 in the lab 
* [Asynchronous Interrupt Hardware](https://natalieagus.github.io/50002/notes/virtualmachine#beta-asynchronous-interrupt-hardware): Input from Keyboard and Mouse will interrupt the current process while safely saving the current process' context for later execution
* [Asynchronous Interrupt Handler](https://natalieagus.github.io/50002/notes/virtualmachine#asynchronous-interrupt-handler): the TinyOS is in charge of handling asynchronous Keyboard and Mouse interrupt from the user
* [Trap or Synchronous Interrupt](https://natalieagus.github.io/50002/notes/virtualmachine#trap): A process can ask for user input or OS Services via an ILLOP, thereby forcing a synchronous interrupt or *trap* for the TinyOS to handle

<br>Related sections in [Asynchronous handling of I/O Devices](https://natalieagus.github.io/50002/notes/asyncio): 
* [The Supervisor Call](https://natalieagus.github.io/50002/notes/asyncio#the-supervisor-call): More details on *trap*
* [Asynchronous Input Handling](https://natalieagus.github.io/50002/notes/asyncio#asynchronous-input-handling) and [Real time I/O Handling](https://natalieagus.github.io/50002/notes/asyncio#real-time-io-handling): More details on *async IO* due to Keyboard and Mouse interrupt, as well as timer interrupt



## Introduction: The Tiny OS
`tinyOS_submit.uasm` is a program that implements a minimal Kernel supporting a simple **timesharing** system. Use BSim to load this file, assemble, and then run `tinyOS_submit.uasm`. The following prompt should appear in the console pane of the BSim Display Window:

<img src="/50002/assets/contentimage/lab6/1.png"  class=" center_full"/>

As you type, each character is echoed to the console and when you hit **return** the whole sentence is translated into Pig Latin and written to the console:

<img src="/50002/assets/contentimage/lab6/2.png"  class=" center_full"/>

The hex number `0x000711BC` written out in the screenshot above as part of the prompt is a **count** of the **number of times** one of the user-mode processes (**Process 2**) has been **scheduled** while you typed in the sentence or leave the program idling.

### Asynchronous Interrupts
`tinyOS_submit.uasm` implements the following functionality to support Asynchronous Interrupts: 
- Kernel-mode **vector interrupt routine** for handling input from the keyboard, clock, reset, and illegal instruction (trap).  
  
```cpp
||| Interrupt vectors:

. = VEC_RESET
	BR(I_Reset)	| on Reset (start-up)
. = VEC_II
	BR(I_IllOp)	| on Illegal Instruction (eg SVC)
. = VEC_CLK
	BR(I_Clk)	| On clock interrupt
. = VEC_KBD
	BR(I_Kbd)	| on Keyboard interrupt
. = VEC_MOUSE
	BR(I_BadInt)	| on mouse interrupt
```

- A keyboard key press causes the asynchronous interrupt to occur, which results in the execution of a keyboard interrupt handler labelled `I_Kbd`. Incoming characters are stored in a kernel buffer called `Key_State` for subsequent use by user-mode programs.
  
```cpp
Key_State: LONG(0)			| 1-char keyboard buffer.

I_Kbd:	ENTER_INTERRUPT()		| Adjust the PC!
	ST(r0, UserMState)		| Save ONLY r0...
	RDCHAR()			| Read the character,
	ST(r0,Key_State)		| save its code.
	LD(UserMState, r0)		| restore r0, and
	JMP(xp)				| and return to the user.
```

- The same logic applies for `I_Reset`, `I_Illop`, and `I_Clk`. You can inspect the relevant instructions under these labels in `tinyOS_submit.uasm`. 

### Synchronous Interrupts
`tinyOS_submit.uasm` implements the a few functionalities to support Synchronous Interrupts (also known as *trap* or *supervisor call*). **Kernel-mode supervisor call** dispatching and a repertoire of call handlers that provide simple I/O services to user-mode programs include:
* `Halt()` – **stop** a user-mode process (equivalent to closing or killing the process)
* `WrMsg()` – write a null-terminated `ASCII` string to the console.  The string immediately follows the `WrMsg()` instruction; execution resumes with the instruction following the string.  For example:
  
```cpp
WrMsg()
.text “This text is sent to the console…\n”
* …next instruction…
```
* `WrCh()` – write the `ASCII` character found in `R0` to the console
* `GetKey()` – return the next `ASCII` character from the keyboard in `R0`; this call **does not return**  to the user (blocks) **until there is a character available.**
* `HexPrt()` – convert the value passed in R0 to a hexadecimal string and output it to the console.
* `Wait()` – implement **atomic** `WAIT` operation on the integer semaphore whose address is passed in `R3`.
* `Signal()` – implement **atomic** `SIGNAL` operation on the integer semaphore whose address is passed in `R3`.
* `Yield()` – immediately **schedule** the next user-mode program for execution.  Execution will resume in the usual fashion when the round-robin scheduler chooses this process again.

Supervisor calls are actually **unimplemented** instructions that cause the expected trap when executed.  Any illegal instruction will cause the ILLOP handler to be executed:

```cpp
I_IllOp:
	SAVESTATE()		| Save the machine state.
	LD(KStack, SP)		| Install kernel stack pointer.

	LD(XP, -4, r0)		| Fetch the illegal instruction
	SHRC(r0, 26, r0)	| Extract the 6-bit OPCODE
	SHLC(r0, 2, r0)		| Make it a WORD (4-byte) index
	LD(r0, UUOTbl, r0)	| Fetch UUOTbl[OPCODE]
	JMP(r0)			| and dispatch to the UUO handler.


.macro UUO(ADR) LONG(ADR+PC_SUPERVISOR)	| Auxiliary Macros
.macro BAD()	UUO(UUOError)

UUOTbl:	BAD()		UUO(SVC_UUO)	BAD()		BAD()
....
```


The illegal instruction trap handler looks for illegal instructions it knows to be supervisor calls and calls the appropriate handler defined in `SVC_UUO`, which makes use of the `SVC_Tbl` to branch to the appropriate trap handler based on the service call being made:

```cpp
SVC_UUO:
	LD(XP, -4, r0)		| The faulting instruction.
	ANDC(r0,0x7,r0)		| Pick out low bits,
	SHLC(r0,2,r0)		| make a word index,
	LD(r0,SVCTbl,r0)	| and fetch the table entry.
	JMP(r0)

SVCTbl:	UUO(HaltH)		| SVC(0): User-mode HALT instruction
	UUO(WrMsgH)		| SVC(1): Write message
	UUO(WrChH)		| SVC(2): Write Character
	UUO(GetKeyH)		| SVC(3): Get Key
	UUO(HexPrtH)		| SVC(4): Hex Print
	UUO(WaitH)		| SVC(5): Wait(S) ,,, S in R3
	UUO(SignalH)		| SVC(6): Signal(S), S in R3
	UUO(YieldH)		| SVC(7): Yield()
```

The translation between `SVC(0)` to `Halt()`, `SVC(1)` to `WrMsg()` and so on is declared as `macros` to interface with the Kernel code. 

```cpp
||| Definitions of macros used to interface with Kernel code:

.macro Halt()	SVC(0)		| Stop a process.

.macro WrMsg()	SVC(1)		| Write the 0-terminated msg following SVC
.macro WrCh()	SVC(2)		| Write a character whose code is in R0

.macro GetKey()	SVC(3)		| Read a key from the keyboard into R0
.macro HexPrt()	SVC(4)		| Hex Print the value in R0.

.macro Yield()	SVC(7)		| Give up remaining quantum
```

Note that this is just for **convenience**. The macro declarations are made so that we can conveniently write `Halt()` as part of our instruction instead of the more primitive instruction of `SVC(0)`. 

### Scheduler
The timesharing system is supported by **a round-robin scheduler**,

```cpp
Scheduler:
	PUSH(LP)
	CMOVE(UserMState, r0)
	LD(CurProc, r1)
	CALL(CopyMState)		| Copy UserMState -> CurProc

	LD(CurProc, r0)
	ADDC(r0, 4*31, r0)		| Increment to next process..
	CMPLTC(r0,CurProc, r1)		| End of ProcTbl?
	BT(r1, Sched1)			| Nope, its OK.
	CMOVE(ProcTbl, r0)		| yup, back to Process 0.
	
Sched1:	ST(r0, CurProc)			| Here's the new process;

	ADDC(r31, UserMState, r1)	| Swap new process in.
	CALL(CopyMState)
	LD(Tics, r0)			| Reset TicsLeft counter
	ST(r0, TicsLeft)		|   to Tics.
	POP(LP)
	JMP(LP)				| and return to caller.
```
..and the necessary kernel data structures to support multiple user-mode programs such as the **process table** that saves the states of the paused process so we can resume them later when it is their turn to run again:

```cpp
ProcTbl:
	STORAGE(29)		| Process 0: R0-R28
	LONG(P0Stack)		| Process 0: SP
	LONG(P0Start)		| Process 0: XP (= PC)

	STORAGE(29)		| Process 1: R0-R28
	LONG(P1Stack)		| Process 1: SP
	LONG(P1Start)		| Process 1: XP (= PC)

	STORAGE(29)		| Process 2: R0-R28
	LONG(P2Stack)		| Process 2: SP
	LONG(P2Start)		| Process 2: XP (= PC)

CurProc: LONG(ProcTbl)
```

The scheduler is invoked by **periodic clock interrupts** or when a user-mode program makes a `Yield()` supervisor call. Notice that we use the clock option in the beginning of the script:

```cpp
.options clock
```

This `clock` will cause asynchronous interrupt that calls `BR(I_Clk)` on every rising edge. This handler labelled `I_Clk` decides whether a **process swap** swap is needed or not. 

```cpp
||| Each compute-bound process gets a quantum consisting of TICS clock
|||   interrupts, where TICS is the number stored in the variable Tics
|||   below.  To avoid overhead, we do a full state save only when the
|||   clock interrupt will cause a process swap, using the TicsLeft
|||   variable as a counter.

Tics:	LONG(2)			| Number of clock interrupts/quantum.
TicsLeft: LONG(0)		| Number of tics left in this quantum

I_Clk:	ENTER_INTERRUPT()	| Adjust the PC!
	ST(r0, UserMState)	| Save R0 ONLY, for now.
	LD(TicsLeft, r0)	| Count down TicsLeft
	SUBC(r0,1,r0)
	ST(r0, TicsLeft)	| Now there's one left.
	CMPLTC(r0, 0, r0)	| If new value is negative, then
	BT(r0, DoSwap)		|   swap processes.
	LD(UserMState, r0)	| Else restore r0, and
	JMP(XP)			| return to same user.

DoSwap:	LD(UserMState, r0)	| Restore r0, so we can do a
	SAVESTATE()		|   FULL State save.
	LD(KStack, SP)		| Install kernel stack pointer.
	CALL(Scheduler)		| Swap it out!
	BR(I_Rtn)		| and return to next process.
```

## User Programs
`tinyOS_submit.uasm` also contains code for three programs each of which runs in a separate user-mode process.

### Process 0
**Process 0** prompts the user for new lines of input in `P0Read`.  It then reads lines from the keyboard in `P0RdCh` using the `GetKey()` supervisor call and sends them to **Process 1** in `P0PutC` using the `Send()` procedure.  


```cpp
Prompt:	semaphore(1)		| To keep us from typing next prompt
				| while P1 is typing previous output.

P0Start:WrMsg()
	.text "Start typing, Bunky.\n\n"

P0Read:	Wait(Prompt)		| Wait until P1 has caught up...
	WrMsg()			| First a newline character, then
	.text "\n"
	LD(Count3, r0)		| print out the quantum count
	HexPrt()		|  as part of the count, then
	 WrMsg()		|  the remainder.
	.text "> "

	LD(P0LinP, r3)		| ...then read a line into buffer...

P0RdCh: GetKey()		| read next character,

	WrCh()			| echo back to user
	CALL(UCase)		| Convert it to upper case,
	ST(r0,0,r3)		| Store it in buffer.
	ADDC(r3,4,r3)		| Incr pointer to next char...

	CMPEQC(r0,0xA,r1)	| End of line?
	BT(r1,P0Send)		| yup, transmit buffer to P1

	CMPEQC(r3,P0LinP-4,r1)	| are we at end of buffer?
	BF(r1,P0RdCh)		| nope, read another char
	CMOVE(0xA,r0)		| end of buffer, force a newline
	ST(r0,0,r3)
	WrCh()			| and echo it to the user

P0Send:	LD(P0LinP,r2)		| Prepare to empty buffer.
P0PutC: LD(r2,0,r0)		| read next char from buf,
	CALL(Send)		| send to P1
	CMPEQC(r0,0xA,r1)	| Is it end of line?
	BT(r1,P0Read)		| Yup, read another line.

	ADDC(r2,4,r2)		| Else move to next char.
	BR(P0PutC)

P0Line: STORAGE(100)		| Line buffer.
P0LinP: LONG(P0Line)

P0Stack:
	STORAGE(256)
```

`Send()` implements a **bounded buffer synchronized** through the use of **semaphores** . It is not required for you now to fully understand what *semaphore* is, except that it is a service provided by the Kernel so that two isolated processes running on a Virtual Machine can **communicate** and **synchronize**. 

> You can read Appendix 1 below for more details. 

```cpp

Chars:	semaphore(0)		| Flow-control semaphore 1
Holes:	semaphore(FIFOSIZE)	| Flow-control semaphore 2

||| Send: put <r0> into fifo.
Send:	PUSH(r1)		| Save some regs...
	PUSH(r2)
	Wait(Holes)		| Wait for space in buffer...
    ...
```

There are other auxiliaries created for the user programs, such as to convert char in r0 to upper case (`UCase`) and test if `R0` is a vowel; put boolean answer into `R1` (`VowelP`). You can read their instructions near the end of `P0` instructions in `tinyOS_submit.uasm`.

### Process 1
Process 1 **reads** lines of inputs from the bounded buffer (using the `Rcv()` procedure):

```cpp
||| Rcv: Get char from fifo into r0.

Rcv:	PUSH(r1)
	PUSH(r2)
	Wait(Chars)		| Wait until FIFO non-empty

	LD(OUT,r1)		| OUT pointer...
    ....
```

Then, **translates** them into Pig Latin and types them out on the console (using the `WrMsg()` and `WrCh()` supervisor calls). You can scan through the relevant instructions here:

```cpp
P1Start:
	LD(P1BufP, r9)		 | Buffer pointer in r9.

P1Word: MOVE(r9,r5)		| Read initial consonants.
P1Cons: CALL(Rcv)
	CALL(VowelP)		| Is it a vowel?
	BT(r1,P1Vowl)		| yup, move on.
	CMPLEC(r0,' ',r1)	| Is it white space?
	BT(r1,P1Spc)

	ST(r0,0,r5)		| Else store it into buffer...
	ADDC(r5,4,r5)		| ... and bump pointer.
	BR(P1Cons)		| Back for more.

P1Vowl: WrCh()			| Output the vowel,
	CALL(Rcv)		| then check again.
	CMPLEC(r0,' ',r1)	| White space?
	BF(r1,P1Vowl)

P1Spc:	MOVE(r0,r3)		| Save input char, then
	MOVE(r9,r4)		| Output initial consonant.
P1Spc2: CMPEQ(r4,r5,r1)		| Any left?
	BT(r1,P1Spc1)		| nope...
	LD(r4,0,r0)		| Fetch next char,
	ADDC(r4,4,r4)		| (next time, next char)
	WrCh()			| and write it out.
	BR(P1Spc2)

P1Spc1:	WrMsg()			| Add the "AY" suffix.
	.text "AY"
	MOVE(r3,r0)		| Then the saved input char.
	WrCh()
	CMPEQC(r3,0xA,r0)	| Was it end-of-line?
	BF(r0,P1Word)		| nope.

	Signal(Prompt)		| it was; allow proc 0 to re-prompt.
	BR(P1Word)		| ... and start another word.

P1Buf:	STORAGE(100)		| Line buffer.
P1BufP: LONG(P1Buf)		| Address of line buffer.
P1Stack: STORAGE(256)		| Stack for process 2.
```

### Process 2
Each time this process is executed, it simply **increments** a counter and uses the `Yield()` supervisor call to give up the remainder of its quantum.  

```cpp
P2Start:
	LD(Count3, r0)		| Another quantum, incr count3.
	ADDC(r0,1,r0)
	ST(r0,Count3)
	Yield()			| Invoke scheduler
	BR(P2Start)		| return here after others run.

P2Stack: STORAGE(256)

Count3: LONG(0)
```

This process is the reason why we can see the value `0x000711BC` appearing in the prompt screenshot above. 

This count is used as part of the **prompt** displayed by Process 0:

```cpp
...
P0Read:	Wait(Prompt)		| Wait until P1 has caught up...
	WrMsg()			| First a newline character, then
	.text "\n"
	LD(Count3, r0)		| print out the quantum count
    ...
```

## Task A: Add mouse interrupt handler
When you **click** the mouse over the **console pane**, BSim generates an **interrupt**, forcing the PC to `0x800000010` and saving `PC+4` of the interrupted instruction in the `XP` register. 

Note that as mentioned in the section above, the Beta in this lab implements a **vectored interrupt** scheme where different types of interrupts force the PC to different addresses (rather than having all interrupts for the PC to `0x80000008` like we did for our basic Beta Processor in the previous lab). The following table shows how different exceptions are mapped to PC values:

```cpp
0x80000000	reset
0x80000004	illegal opcode
0x80000008	clock interrupt (must specify “.options clk” to enable)
0x8000000C	keyboard interrupt (must specify “.options tty” to enable)
0x80000010	mouse interrupt (must specify “.options tty” to enable)
```

This means that the first five instructions in `tinyOS_submit.uasm` contains instructions to branch out to the respective handler

```cpp
. = VEC_RESET   | This is loaded at address 0x80000000
	BR(I_Reset)	| on Reset (start-up)
. = VEC_II      | This is loaded at address 0x80000004
	BR(I_IllOp)	| on Illegal Instruction (eg SVC)
. = VEC_CLK     | This is loaded at address 0x80000008
	BR(I_Clk)	| On clock interrupt
. = VEC_KBD     | This is loaded at address 0x8000000C
	BR(I_Kbd)	| on Keyboard interrupt
. = VEC_MOUSE   | This is loaded at address 0x80000010
	BR(I_BadInt)	| on mouse interrupt
```

Recall that **only user-mode programs** can be **interrupted**. Interrupts signaled while the Beta is running in kernel-mode (e.g., handling another interrupt or servicing a supervisor call) **have no effect** until the processor returns to user-mode.

The original `tinyOS_submit.uasm` prints out “Illegal interrupt” and then halts if a mouse interrupt is received:

<img src="/50002/assets/contentimage/lab6/3.png"  class=" center_full"/>

**Change** this behavior by:
1. Adding an interrupt handler that **stores** the click information in a new kernel memory location and then,
2. **Returns** to the **interrupted process**.  
 
You might find the keyboard interrupt handler `I_Kbd` a good model to follow.

### The CLICK() instruction
For this Lab, we added a **new** Beta instruction your interrupt handler can use to retrieve information about the last mouse click: `CLICK()`

* This instruction **can only be executed when in kernel mode** (e.g., from **inside** the mouse click interrupt handler).  
* It returns a value in `R0: -1` if there has not been a mouse click since the last time `CLICK()` was executed, or 
* A **32-bit integer** with:
    * The `X` coordinate of the click in the **high-order** 16 bits of the word, and 
    * The `Y` coordinate of the click in the **low-order** 16 bits. 
    * The coordinates are **non-negative** and relative to the **upper left hand corner** of the console pane. 
    * In our scenario, `CLICK()` should only be called **AFTER** a mouse click, so we should never see `-1` as a return value.

### Testing Your Implementation with .breakpoint
Insert a `.breakpoint` instruction right before the `JMP(XP)` at the end of your mpouse interrupt handler, run the program and click the mouse over the console pane. 

If things are working correctly the simulation should **stop** at the breakpoint and you can **examine** the kernel memory location where the mouse info was stored to verify that it is correct. In the sample below, we name the memory location as `Mouse_State`, and the value in the red box signifies the coordinates of the mouse click made in the console pane. 

<img src="/50002/assets/contentimage/lab6/4.png"  class=" center_full"/>

Continuing execution (click the “Run” button in the toolbar at the top of the window) should return to the interrupted program. **When you’re done remember to remove the breakpoint.**


## Task B: Add Mouse() Supervisor Call

Now our job is to **retrieve** the mouse click coordinates that is stored in the Kernel variable `Mouse_State` in the sample screenshot above. Implement a `Mouse()` supervisor call that returns the coordinate information from the most recent mouse click (i.e., the information stored by the mouse interrupt handler).

Like `GetKey()` supervisor call to retrieve keyboard press, a user-mode call to `Mouse()` should **consume** the available click information:
* If no mouse click has occurred since the previous call to Mouse(), the supervisor call should **“hang”** (block execution) until new click information is available. 
* “Hang” means that the supervisor call should back up the saved PC so that the next user-mode instruction to be executed is the `Mouse()` call and then **branch** to the **scheduler** to run some other user-mode program. 
* Thus when the calling program is **rescheduled** for execution at some later point, the `Mouse()` call is **re-executed** and the whole process repeated. 
* From the user’s point of view, the `Mouse()` call **completes** execution only when there is **new** click information to be returned. 
* The `GetKey()` supervisor call is a good model to follow.


To define a new supervisor call `Mouse()`, add the following definition just after the definition for `.macro Yield()	SVC(7)`:

```cpp
.macro Mouse()   SVC(8)
```

This is the **ninth** supervisor call and the current code at `SVC_UUO` was tailored for processing exactly **eight** supervisor calls, so you’ll need to make the appropriate modifications to `SVC_UUO` instructions:

```cpp
||| Sub-handler for SVCs, called from I_IllOp on SVC opcode:

SVC_UUO:
	LD(XP, -4, r0)		| The faulting instruction.
	ANDC(r0,0x7,r0)		| Pick out low bits, should you modify this to support more supervisor calls? 
	SHLC(r0,2,r0)		| make a word index,
	LD(r0,SVCTbl,r0)	| and fetch the table entry.
	JMP(r0)
```

### Testing Your Implementation
Once your `Mouse()` implementation is complete, add a `Mouse()` instruction **just after P2Start**.  If things are working correctly, this user-mode process should now **hang** and `Count3` should **not** be incremented even if you type in several sentences (i.e., the prompt should always be “00000000>”).  

<img src="/50002/assets/contentimage/lab6/5.png"  class=" center_full"/>

* Now click the mouse once over the console pane and then type more sentences  
* The prompt should read `00000001>`

<img src="/50002/assets/contentimage/lab6/6.png"  class=" center_full"/>

When you are done, remember to **remove** the `Mouse()` instruction you added.

## Task C: Add fourth user-mode process P3 that reports mouse clicks
In this task, we would have to **modify** the **kernel** to add support for a **fourth user-mode process**. Add user-mode code for the new process that calls `Mouse()` and then prints out a message of the form:

<img src="/50002/assets/contentimage/lab6/7.png"  class=" center_full"/>

Each click message **should** appear on its own line (i.e., it should be preceded and followed by a newline character). You can use `WrMsg()` and `HexPrt()` to send the message; see the code for **Process 0 **for an example of how this is done. Write the instruction for P3 below P2:

```cpp
||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
||| PART 3: USER MODE Process 3 -- Display Mouse info click
||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||


P3Start:

	| .breakpoint, debugging

	GetMouse()		| PART 3 -- get mouse info and store to r0
    ... your answer here
```

You also need to modify the Kernel's process table to support the **scheduling** of four processes instead of three:

```cpp
||| The kernel variable CurProc always points to the ProcTbl entry
|||  corresponding to the "swapped in" process.

ProcTbl:
	STORAGE(29)		| Process 0: R0-R28
	LONG(P0Stack)		| Process 0: SP
	LONG(P0Start)		| Process 0: XP (= PC)

	STORAGE(29)		| Process 1: R0-R28
	LONG(P1Stack)		| Process 1: SP
	LONG(P1Start)		| Process 1: XP (= PC)

    STORAGE(29)		| Process 2: R0-R28
	LONG(P2Stack)		| Process 2: SP
	LONG(P2Start)		| Process 2: XP (= PC)

    .. add more process table here
```

## Task D: Synchronize mouse reporting with other I/O using Semaphores
Using **semaphores**, **coordinate** the operation of the user-mode processes so that click messages only appear after the prompt has been output but before you have started typing in a sentence to be translated. 
* In other words, once you start typing in a sentence, click messages should be **delayed** until after the next prompt. 
* If the user clicks *multiple* times after they have started typing, only a SINGLE click message needs to be displayed (describing either the **first** or **last** click, your **choice**).

### Testing your implementation
Start typing in a **sentence**, then **click** the mouse. The click message should be printed **after** the translation and the following prompt has been printed.

<img src="/50002/assets/contentimage/lab6/8.png"  class=" center_full"/>

### Hints

You may declare a mouse semaphore in P3, and immediately `Wait` (attempt to decrease) for the Semaphore:

```cpp
MouseSemaphore: semaphore(0)	| Semaphore for mouse, Part D, initialised from zero 

P3Start:

	| .breakpoint, debugging
	Wait(MouseSemaphore) 	| proceed only when prompt has shown -- Part D
	GetMouse()		| Part C -- get mouse info and store to r0

    ... implement printing of click coordinates here

    Signal(Prompt) | signal the prompt so it will print another prompt

    ... continue implementation

```


You may also need two more supervisor calls to check for keyboard press and check for mouse click that is **non blocking** because we need to know whether we have typed something (and block the mouse click printout in P3):

```cpp
.macro CheckMouse() SVC(9) 	| Part D: TO CHECK MOUSE CLICK, NON BLOCKING
.macro CheckKeyboard() SVC(10) 	| Part D: TO CHECK KEYBOARD CLICK, NON BLOCKING
```

Update the corresponding `SVC_tbl` to support these two:

```cpp
SVCTbl:	UUO(HaltH)		| SVC(0): User-mode HALT instruction
	UUO(WrMsgH)		| SVC(1): Write message
    ...
	UUO(CheckMouseH)| SVC(9) : CheckMouse()
	UUO(CheckKeyH)	| SVC(10) : CheckKeyboard()
```

The implementation of the two service handlers above is suggested to be as follows:
```cpp
||| Part D: add new handler to check keyboard state, but doesn't clear it and doesn't block the calling process
CheckKeyH: 
	LD(Key_State, r0)
	ST(r0,UserMState)		| return it in R0.
	BR(I_Rtn)			| and return to user.

||| Part D: add new handler to check mouse state, but doesn't clear it and doesn't block the calling process
CheckMouseH: 
	LD(Mouse_State, r0) 	| put the content of Mouse_State to R0
	ST(r0,UserMState)		| return it in R0 of the user state since UserMState points to the R0 of the user reg value
	BR(I_Rtn)			| and return to user
```

And then, somewhere in P0 **after** the prompt is printed out, you should check whether there exist mouse click **OR** keyboard click, and `signal` (increase) the semaphore accordingly:
```cpp
P0Read:	Wait(Prompt)		| Wait until P1 has caught up...
	WrMsg()			| First a newline character, then
	.text "\n"
	LD(Count3, r0)		| print out the quantum count
	HexPrt()		|  as part of the count, then
	 WrMsg()		|  the remainder.
	.text "> "
	LD(P0LinP, r3)		| ...then read a line into buffer...

|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| 
||||| Part D TO SYNCHRONISE, busy wait 
beginCheckMouse: CheckMouse() 
    BEQ(R0, beginCheckKeyboard) | go and check for keyboard press if there's no mouse click
                                | If there's no mouse click, P3 is stuck at GetMouse() anyway
    Signal(MouseSemaphore)		| if there mouse click, give signal for P3 to continue
    Yield()         | stop execution
    BR(P0Read)		| and restart process

beginCheckKeyboard: CheckKeyboard()
    BEQ(R0, beginCheckMouse)
||||| END OF Part D
|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| 

P0RdCh: GetKey()		| read next character,
	WrCh()			| echo back to user
    ...
```

> Fun fact: P0 doesn't have to confirm until P3 has finished its one round of execution (printing of x, y coordinate) before restarting to `BR(P0Read)` because we **know** that the round robin scheduler will **surely** execute P3 for a round once P0 calls `Yield()`. Thanks to the scheduler's round robin policy and long enough quanta dedicated for each process, there won't be the undesirable condition whereby P0 `Yield()` immediately returns execution to P0 again, **before** P3 resumes and then `Signal` the `MouseSemaphore` the **second** time (because it hasn't been cleared by P3 that hasn't progressed!). 
> If this happens, `MouseSemaphore` value might accidentally be increased to 2 and we might have a future `Click` message printed out at the same time **while** typing some messages at the console, violating the condition required for this Part 4. To fix this, we might have to check that a new mouse click is *actually made* in `CheckMouseH` by storing the *previous* history of mouse click at all times. 

If all three parts are working correctly the appropriate message should be printed out whenever you click the mouse over the console pane as shown in the screenshot above. You may find it necessary to use `.breakpoint` commands to debug your user-mode code.

## Appendix 1: Kernel Semaphore
A semaphore is a **variable**  used to **control access** to a common resource by multiple processes. In other words, it is a **variable** controlled by the Kernel to allow two or more processes to synchronise. The semaphore can be seen as a generalised mutual exclusion (mutex) lock. It is implemented at the kernel level, meaning that its **execution** (`WaitH`, and `SignalH`) requires the **calling** process to change into the **kernel** mode. 

> In its simplest form, it can be thought of as a data structure that contains a guarded integer that represents the number of resources available for the pool of processes that require it. 

The instructions in `tinyOS_submit.uasm` that implements Semaphore is as follows:

```cpp
WaitH:	LD(r3,0,r0)		| Fetch semaphore value.
	BEQ(r0,I_Wait)		| If zero, block..

	SUBC(r0,1,r0)		| else, decrement and return.
	ST(r0,0,r3)		| Store back into semaphore
	BR(I_Rtn)		| and return to user.

||| Kernel handler: signal(s):
||| ADDRESS of semaphore s in r3.


SignalH:LD(r3,0,r0)		| Fetch semaphore value.
	ADDC(r0,1,r0)		| increment it,
	ST(r0,0,r3)		| Store new semaphore value.
	BR(I_Rtn)		| and return to user.
```

> Note that unlike real-world applications, this lab does **not** actually have **physical** separation in the **memory** between Kernel  and User **space** in memory (although it has dual **mode** to prevent interrupts in Kernel mode) due to simplification. We can still perform a `LD` to Kernel variables in User Mode in this lab. 
