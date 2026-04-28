---
layout: default
permalink: /problemset/virtualmachine
title: Virtual Machine
description: Practice questions containing topics from Virtual Machine
parent: Problem Set
nav_order: 13
---

* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design

# Virtual Machine
{: .no_toc}

Each topic's questions are grouped into **three** categories: basic, intermediate, and challenging. You are recommended to do all basic problem set before advancing further. 

## Why Kernel and User Mode? (Basic)

An SUTD student claims: *"User mode restrictions are unnecessary. The compiler can simply refuse to emit `LD` or `ST` whose address is in the kernel range, and refuse to emit branches that cross `PC31`."*
 
Give **two** distinct technical arguments rebutting this claim. Each argument should identify a class of attacks the compiler approach <span class="orange-bold">cannot</span> prevent.
 
<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
<strong>1. Trust boundary:</strong> The compiler is part of the user toolchain. A malicious user can use a different compiler, hand write assembly, patch the binary after compilation, or simply use a hex editor. Any safety property whose enforcement lives in software the attacker controls is not enforcement at all, it is a request. Hardware is the only place a rule can be made binding on code the attacker chose to run.
</p><p>
<strong>2. Computed addresses:</strong> Many memory and control instructions take an address from a register that is computed at runtime: <code>LD(Ra, k, Rc)</code> loads from <code>Reg[Ra] + k</code>, and <code>JMP(Rc)</code> jumps to <code>Reg[Rc]</code>. The compiler in general cannot know the runtime value of <code>Reg[Ra]</code> (it may depend on user input, on a pointer from a data structure, on the result of an arithmetic loop). Even a perfectly cooperative compiler cannot statically refuse to emit a load whose address turns out to be in the kernel range, because the compiler does not know what that address will be. The check has to happen when the value is actually formed, which is **in the datapath, in hardware**.
</p></div><br>

## Two Protection Mechanisms (Basic)
 
A user mode process is executing at $$\text{PC} = \texttt{0x00400000}$$. The register file holds $$\text{Reg}[R30] = \texttt{0x80001234}$$ and $$\text{Reg}[R2] = \texttt{0x80000020}$$.
 
The next two instructions in the user program are:
 
```nasm
JMP(R30, R0)
LD(R2, 0x10, R3)
```
 
Answer the following questions:
 
1. What value lands in `PC` after `JMP(R30, R0)` executes? What value lands in `Reg[R0]`?
   <div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
    The candidate next PC from JMP is <code>Reg[R30] = 0x80001234</code>. In user mode (<code>PC31 = 0</code>), the hardware masks the top bit of any value being written into PC, so the actual write is <code>0x00001234</code>. The link register receives <code>PC + 4 = 0x00400004</code>, with no masking needed since that value already has MSB 0.
    </p></div><br>
2.  Suppose in alternate ISA, a `JMP` initiated to kernel space that failed caused the  user program continues with the next instruction at the user side. What address does the memory unit see when `LD(R2, 0x10, R3)` executes, and what does `Reg[R3]` receive?
    <div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
     The address adder computes <code>Reg[R2] + 0x10 = 0x80000030</code>. The Beta spec defines <strong>no masking</strong> for <code>LD</code> or <code>ST</code> on the EA path: the full 32 bit sum is presented to the memory unit. So the memory unit sees <code>0x80000030</code>, and <code>Reg[R3]</code> receives <code>M[0x80000030]</code>, which is in the kernel address range.</p><p>The Beta spec as written does <strong>not</strong> prevent this access. The supervisor bit (<code>PC31</code>) lives only in the PC and governs execution mode and it does not propagate into the data memory path. The only spec level masking on a memory operation is in <code>LDR</code>, where <code>PC31</code> is masked when computing <code>EA = (PC &amp; 0x7FFFFFFF) + 4 + 4*SEXT(literal)</code>. That masking exists so a supervisor mode <code>LDR</code> resolves into user space, which is a different concern from kernel protection.</p><p>Closing this discrepancy requires an MMU that checks the privilege of every <code>LD</code>/<code>ST</code> against the target page. Bare Beta has no such check.
   </p></div><br>
3. The two questions above involve two **different** hardware mechanisms that both <span class="orange-bold">protect</span> the kernel. Name where in the datapath each mechanism lives, and explain in one sentence why a single mechanism cannot cover both cases.
    <div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
     The <code>JMP</code> case <strong>is</strong> protected. The mechanism lives at the PC register write path: <code>new_PC31 = old_PC31 AND JT31</code>. Whatever 32 bit value the user constructs in <code>Reg[Ra]</code>, its MSB is ANDed with the current <code>PC31</code> before it lands in the PC. In user mode <code>PC31 = 0</code>, so the AND forces the new <code>PC31</code> to 0 regardless of the register contents. The same masking applies to <code>BEQ</code>/<code>BNE</code> branch targets on the next PC path.</p><p> The <code>LD</code> case <strong>is not</strong> protected. The mechanism that would be needed (a comparator on the EA path that checks user mode against the address MSB) does not exist in the Beta spec. The EA adder produces <code>0x80000030</code> and the memory unit receives it unmodified. There is no place in the bare Beta datapath where a privilege check on data accesses occurs. </p><p>A single mechanism cannot cover both because the two paths produce addresses for <strong>different consumers</strong> at different stages: the JMP/branch target feeds the PC register, while the LD/ST EA feeds the memory unit. Masking at the PC input does nothing for memory accesses, and masking at the EA path does nothing for control transfers. To protect both, you need <strong>two</strong> separate checks, and Beta only specifies one of them. The data memory check is what an MMU adds.
   </p></div><br>

## Adjusting `XP` (Basic)

The asynchronous interrupt handler at `XAddr` ends with
 
```nasm
SUBC(XP, 4, XP)
JMP(XP)
```
 
The `ILLOP` handler, used for SVC and exceptions, ends with:
 
```nasm
JMP(XP)
```
 
with no `SUBC`. Both handlers entered kernel mode via the same hardware mechanism: the Control Unit set `Reg[XP] <- PC + 4` and forced `PC` to a fixed entry address.
 
Answer the following questions:

1. Pick a concrete user address, say `PC = 0x00002040`, and explain what `Reg[XP]` contains at the moment each handler begins executing, for the case where the user instruction at `0x00002040` was the one that caused the entry.
 
    <div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
    In both cases the hardware writes <code>Reg[XP] &lt;- PC + 4 = 0x00002044</code> at the moment of entry. The hardware does not know or care whether the trigger was async or sync; it always saves the address of the <em>next</em> instruction.
    </p></div><br>
 
 
2. For each handler, state the address at which the user program resumes after the handler returns. Show that the async handler's resume address is correct and the ILLOP handler's resume address is also correct, given the *purpose* of each.
 
    <div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
    <strong>Async return</strong> computes <code>Reg[XP] - 4 = 0x00002040</code> and jumps there. This re-executes the instruction at <code>0x00002040</code>, which is what we want: that instruction was <em>interrupted</em> before it could commit, so it has not yet had its effect, and we need it to run.
    </p><p>
    <strong>ILLOP return</strong> jumps directly to <code>Reg[XP] = 0x00002044</code>. This skips the instruction at <code>0x00002040</code>, which is also what we want: that instruction was an <code>SVC</code> (or other illegal opcode used as a supervisor call), and its entire purpose was to trap into the kernel. Re-executing it would just trap again. The kernel has now serviced the request, so we move past it.
    </p></div><br>
    
3. What would go wrong, in one sentence each, if you swapped the two endings: the async handler used `JMP(XP)` alone, and the ILLOP handler used `SUBC(XP, 4, XP); JMP(XP)`?
 
    <div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
    <strong>Async with <code>JMP(XP)</code> alone:</strong> the resumed user program silently skips the instruction it was actually running when the timer fired, losing whatever side effect that instruction was supposed to produce.
    </p><p>
    <strong>ILLOP with <code>SUBC(XP, 4, XP); JMP(XP)</code>:</strong> the resumed user program lands back on the <code>SVC</code> instruction, which traps again, and the process is stuck in an infinite trap loop never making progress past the syscall.
    </p></div><br>

## Classify and Trace (Intermediate)
 
For **each** of the five events below, answer in three things:
 
1. Is the event a **synchronous** or **asynchronous** interrupt?
2. Which Beta entry point does the hardware jump to: `RESET`, `ILLOP`, or `XAddr`?
3. What value does the hardware write into `Reg[XP]`, expressed in terms of the program counter at the moment of the event?
 
| Event | Explanation |
|---|-------|
| A | A user program executing at PC = `0x00001000` issues `SVC(0)` to call `getchar`. |
| B | A user program executing at PC = `0x00001100` divides by zero. (Assume Beta treats this as an illegal instruction.) |
| C | The user presses a key on the keyboard while a user program is in the middle of a long `MUL` loop. |
| D | The system is powered on. |
| E | A user program executing at PC = `0x00001200` performs `JMP(R5)` with `Reg[R5] = 0x00ABCD00`, where `0x00ABCD00` happens to contain a word that is not a valid Beta opcode. |
 
Then: in which two of these events is `Reg[XP] - 4` the address the kernel should resume at, and in which two is `Reg[XP]` itself the right resume address? <span class="orange-bold">Justify the leftover case.</span>
 
<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
<strong>Classification table:</strong>
</p>
<table>
<thead><tr><th>Event</th><th>Sync / Async</th><th>Entry point</th><th><code>Reg[XP]</code></th></tr></thead>
<tbody>
<tr><td>A</td><td>Synchronous</td><td><code>ILLOP</code> (<code>0x80000004</code>)</td><td><code>0x00001004</code></td></tr>
<tr><td>B</td><td>Synchronous</td><td><code>ILLOP</code> (<code>0x80000004</code>)</td><td><code>0x00001104</code></td></tr>
<tr><td>C</td><td>Asynchronous</td><td><code>XAddr</code> (<code>0x80000008</code>)</td><td>current PC + 4, wherever the MUL loop happened to be</td></tr>
<tr><td>D</td><td>Neither (reset is not an interrupt)</td><td><code>RESET</code> (<code>0x80000000</code>)</td><td>undefined / not used</td></tr>
<tr><td>E</td><td>Synchronous</td><td><code>ILLOP</code> (<code>0x80000004</code>)</td><td><code>0x00ABCD04</code></td></tr>
</tbody>
</table>
<p>
The classification rule is the one stated in the notes: synchronous interrupts are caused by the instruction the CPU is currently executing (faulty opcode, divide by zero, SVC, bad branch target), while asynchronous interrupts come from hardware unrelated to the instruction stream (timer, keyboard, mouse).
</p><p>
<strong>Note for event E:</strong> by the time the trap fires, the CPU has already fetched from <code>0x00ABCD00</code> and discovered the opcode is invalid, so <code>PC</code> at the moment of the trap is <code>0x00ABCD00</code> and <code>Reg[XP]</code> becomes <code>0x00ABCD04</code>. The fact that the user <em>jumped</em> to that address is irrelevant; the trap is attributed to the bad fetch, not to the JMP.
</p><p>
<strong>Resume addresses:</strong>
</p>
<ul>
<li><code>Reg[XP] - 4</code> is correct for <strong>C</strong> only. Asynchronous interrupts pause an instruction that had not yet committed, so the kernel must re-execute it.</li>
<li><code>Reg[XP]</code> itself is correct for <strong>A</strong> and <strong>B</strong>. In A the SVC has done its job (trap into the kernel) and should not run again. In B the divide by zero is a fatal exception; the kernel will most likely terminate the process, but if for some reason it chose to resume, it must resume <em>past</em> the faulting instruction, otherwise the same fault recurs immediately.</li>
<li><strong>D</strong> is the leftover case. Reset is not a resume at all. There is no interrupted process, no saved state, and <code>Reg[XP]</code> is meaningless. The kernel boots from scratch.</li>
<li><strong>E</strong> is interesting: it is an illegal opcode that the user program reached by an otherwise legal jump. The kernel will almost certainly terminate the process (this is an exception, not a deliberate SVC), so there is no resume. If for some reason the kernel did try to resume, it would have to resume at <code>Reg[XP]</code> itself, since re-executing the bad opcode would just trap again.</li>
</ul>
</div><br>
 


## Timer Quantum, Edge Detection, and Scheduler Overhead (Challenging)
 
A Beta CPU runs at $$f_\text{cpu} = 25$$ MHz. The OS **scheduler** uses an <span class="orange-bold">asynchronous</span> free running counter that is 24 bits wide, clocked at $$f_\text{tmr} = 100$$ kHz. Bit $$k$$ of this counter is fed through a rising edge detector that is itself clocked by the CPU clock, and the output of that edge detector drives the `IRQ` line of the Control Unit.

{:.note}
The purpose of this scheduler is to perform context switching.
 
Here's an illustration of the setup:

<img src="{{ site.baseurl }}/docs/ProblemSet/images/cs-2026-50002-asynctimer-clock.drawio.png"  class="center_seventy"/>

Answer the following questions.

1. Derive an expression for the quantum $$T_k$$ (the wall clock time *between* two consecutive `IRQ` pulses) as a function of $$k$$ and $$f_\text{tmr}$$. Compute $$T_k$$ in milliseconds for $$k = 10$$.
 
    <div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
    Bit <code>k</code> of a free running counter toggles every <code>2^k</code> counter ticks, so its period is <code>2^(k+1)</code> counter ticks. Each counter tick lasts <code>1/f_tmr</code> seconds, so:
    </p><p>
    <code>T_k = 2^(k+1) / f_tmr</code>
    </p><p>
    For <code>k = 10</code> and <code>f_tmr = 100</code> kHz: <code>T_10 = 2048 / 10^5 ≈ 20.48 ms</code>.
    </p></div><br>
 

2. The statement above stresses that the rising edge detector be clocked by the **CPU** clock, <span class="orange-bold">not</span> the timer clock. Explain the precise failure mode that occurs if the detector is clocked by the timer clock instead. Your answer should refer to how the Control Unit samples `IRQ` and to the duration of the resulting pulse measured in CPU cycles.
 
    <div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
    The Control Unit samples <code>IRQ</code> once per CPU clock edge. For correct behaviour the pulse on <code>IRQ</code> must be high for exactly one CPU cycle, otherwise the Control Unit will see <code>IRQ = 1</code> on multiple consecutive cycles and re-trap to <code>XAddr</code> repeatedly.
    </p><p>
    If the edge detector is clocked by the slower timer clock (100 kHz here), its output pulse lasts one <strong>timer</strong> cycle, which is <code>f_cpu/f_tmr = 250</code> CPU cycles wide. The Control Unit will therefore see <code>IRQ = 1</code> on roughly 250 consecutive CPU cycles. Each of those cycles either (1) re-asserts the trap (setting <code>Reg[XP] &lt;- PC + 4</code> and <code>PC &lt;- XAddr</code>) or (2) if <code>PC31</code> is now 1 and the CPU masks <code>IRQ</code> (or disable interrupt), it might re-trigger interrupt again after it leaves the interrupt handler, if the interrupt handler takes less than 250 CPU cycles. In the unmasked case, `Reg[XP]` gets overwritten 250 times, and it ends up pointing into the handler itself rather than into the interrupted user program. This means the interrupted process is unrecoverable.
    </p></div><br>
 
 
3. Suppose one full context switch (entry to `XAddr`, register save, scheduler decision, register restore, return) costs $$C = 200$$ CPU cycles. This means we have an <span class="orange-bold">overhead</span> of 200 CPU cycles. Using the result from the first question with $$k = 10$$, compute the fraction of CPU time spent on context switching overhead. Then determine the smallest $$k$$ for which this overhead is strictly below 0.1%.
 
    <div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
    Number of CPU cycles per quantum is <code>N_k = T_k x f_cpu = 2^(k+1) x f_cpu / f_tmr = 2^(k+1) x 250</code>.
    </p><p>
    For <code>k = 10</code>: <code>N_10 = 2048 x 250 = 512,000</code>. Overhead is <code>200 / 512,000 ≈ 0.039%</code>.
    </p><p>
    For overhead below 0.001 we need <code>200 / (2^(k+1) x 250) &lt; 0.001</code>, that is <code>2^(k+1) &gt; 800</code>. Since <code>2^10 = 1024 &gt; 800</code> and <code>2^9 = 512 &lt; 800</code>, the *smallest* acceptable value is <code>k+1 = 10</code>, so <code>k_min = 9</code>.
    </p><p>
    We can easily prove this by computing more cases: at <code>k = 9</code>, <code>N_9 = 1024 x 250 = 256,000</code> and <code>200/256,000 ≈ 0.078% &lt; 0.1%</code>. At <code>k = 8</code>, <code>N_8 = 128,000</code> and overhead is <code>≈ 0.156%</code>.
    </p></div><br>
 
 
4. The scheduler handler return sequence ends with `SUBC(XP, 4, XP)` followed by `JMP(XP)`. A student proposes *swapping* them, on the grounds that "JMP is one cycle, SUBC is one cycle, and reordering saves nothing but is also harmless". Is the student correct? Explain in two sentences, and state the *semantic* purpose of the `SUBC` step.
 
    <div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
    The student is wrong. <code>JMP(XP)</code> transfers control immediately, so the <code>SUBC</code> that follows it never executes; the program counter is already pointing elsewhere.
    </p><p>
    The <code>SUBC</code> exists because the hardware saves <code>PC + 4</code> (the address of the instruction <em>after</em> the interrupted one) into <code>Reg[XP]</code>, but on resume we want to <strong>re-execute</strong> the interrupted instruction itself, whose address is <code>Reg[XP] - 4</code>.
    </p></div><br>

 
5. Consider an alternative ISA in which, on an asynchronous interrupt, the hardware saves the **current** PC (not PC + 4) into `Reg[XP]`. Describe how the return code changes, and identify the new constraint this places on the hardware regarding the interrupted instruction's side effects. Is this constraint stricter, looser, or equivalent to Beta's?
 
    <div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
    The handler return becomes simply <code>JMP(XP)</code> with no decrement, which is slightly cleaner.
    </p><p>
    The constraint is identical to Beta's, just packaged differently. In both schemes the interrupted instruction must **not** have committed any architectural side effects (no register write, no memory store, no flag update), because both schemes resume by re-executing it. Beta saves PC + 4 and in turn, it must decrements on return (of interrupt), while the alternative ISA saves PC directly so it doesn't have to decrement upon return from interrupt handler. Either way the hardware must abort the instruction cleanly. The constraint is therefore <em>equivalent</em>. The only real difference is that Beta forces every handler to **remember** the decrement, which is one more place a kernel programmer can introduce a bug.
    </p><p>
    **Note**: If this alternate ISA also saves `PC` on `ILLOP`, then it must **increment** `XP` by `4` before `JMP(XP)` and returning to the calling process. Otherwise, the trap/SVC will be re-executed.
    </p></div><br>




## Who Should Adjust `XP`? (Basic)

A scheduler's final routine should "return to user" (resume a process). This procedure needs to know whether the process being resumed was last suspended by an asynchronous interrupt or by an SVC, because the former requires `SUBC(XP, 4, XP)` and the latter does not. **Propose** a concrete way for the kernel to record this in the process table, and **explain** why mixing the two cases up is a **correctness** bug, not merely a performance bug. **Describe** the visible symptoms in each direction of mistake.
 
<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
There are multiple viable answer to this. Here's one proposed method</p><p>

Add a one bit field, call it <code>resume_kind</code>, to each process table entry. The async interrupt entry handler at <code>XAddr</code> writes <code>resume_kind = 1</code> (meaning "decrement XP on resume") immediately after saving registers. The ILLOP entry handler writes <code>resume_kind = 0</code> (meaning "do not decrement"). The restore stub branches on this bit and conditionally executes the <code>SUBC</code>.
</p><p>
Mixing the two up is a correctness bug:
</p>
<ul>
<li><strong>SVC suspended process resumed with the decrement.</strong> <code>Reg[XP]</code> was set to the address of the instruction <em>after</em> <code>SVC</code>, namely <code>0x00002008</code>. Decrementing gives <code>0x00002004</code>, which is the <code>SVC</code> itself. On resume, the user re-executes the supervisor call, which traps back into the kernel, which resumes again with the decrement, and so on forever. The visible symptom is an infinite trap loop. The user program never makes progress past the syscall.</li>
<li><strong>Async suspended process resumed without the decrement.</strong> The hardware saved <code>PC + 4</code>, where <code>PC</code> was the address of the interrupted instruction. Without the decrement, the resume jumps to <code>PC + 4</code>, which is the instruction <em>after</em> the one that was interrupted. The interrupted instruction is silently skipped. The visible symptom depends on what that instruction was: a missing register update, a missing store, an arithmetic result that never happened. Often the program does not crash immediately but produces wrong results much later, which is the worst kind of bug.</li>
</ul>
<p>
Neither symptom is "the program ran a bit slower". Both change observable behaviour, so the bit is mandatory.
</p></div><br>
 

## Implications of `PC31` as Status Bit (Intermediate)

A user mode program executing at \\(\text{PC} = \texttt{0x00400000}\\) contains the instruction

```
LD(R0, 0x1000, R1)
```

with `Reg[R0]` holding the value `0x80000000`. **Trace what actually happens** per the Beta spec: what address is presented to the memory unit, what value lands in `Reg[R1]`, and is the kernel data nominally stored at `0x80001000` <span class="orange-bold">protected</span>? Then state what additional hardware would be required for this access to actually <span class="orange-bold">fault</span>.


<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
    The effective address computed by the adder is <code>Reg[R0] + 0x1000 = 0x80001000</code>. The Beta spec defines no masking on the <code>LD</code> EA path, so the value sent to the memory unit is <code>0x80001000</code> as is, and <code>Reg[R1]</code> receives <code>M[0x80001000]</code>, which is whatever kernel data happens to live at that address. The kernel data was <strong>not</strong> protected.
</p><p>
    This is not covered in the Beta ISA spec. The supervisor bit (<code>PC31</code>) controls execution mode and exists only in the PC. It is not visible to the data memory access path, so <code>LD</code> and <code>ST</code> have no privilege check. A user mode program in bare Beta can read and write any kernel address it can construct in a register. The only spec level masking on a memory operation is in <code>LDR</code>, but that masks <code>PC31</code> (not <code>Reg[Ra]31</code>) and exists to ensure supervisor mode <code>LDR</code> resolves into user space, which is a separate concern.
</p><p>
    To make a user access to <code>0x80001000</code> fault outright, the implementation needs an <strong>MMU</strong> that:
</p><p>
    1. Intercepts the EA on every <code>LD</code>/<code>ST</code>.<br>
    2. Looks up the privilege level associated with the page containing EA.<br>
    3. Compares it against the current execution mode (<code>PC31</code>).<br>
    4. Raises a synchronous trap (routes <code>PC</code> to <code>ILLOP</code>) when a user mode access targets a kernel page.
</p><p>
    Real architectures (x86, ARM, RISC-V) all provide this in hardware. Beta as specified does not, as it is just a simplified CPU used for pedagogy. 
</p></div><br>
 
A user mode program executes `BEQ(R0, label, R1)` where the computed branch target $$\text{PC} + 4 + 4 \cdot \text{SXT(literal)}$$ has MSB `1`. **Describe** the hardware mechanism in Beta that <span class="orange-bold">prevents</span> this from entering kernel mode. Then contrast with `JMP(R31)` when `Reg[R31]` contains `0x80004000`. Are both protected by the same mechanism, and **at what stage** of the datapath?
 
<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
For both instructions the protection is enforced at the <em>write</em> to the PC register itself, not at the adder or at the register file. The general rule is: when in user mode (<code>PC31 == 0</code>), the bit that would land in <code>PC[31]</code> on the next clock edge is forced (or ANDed) to 0.
</p><p>
For <code>BEQ</code>, the branch target adder may compute any 32 bit value, including one with MSB <code>1</code>. The MSB of that value is masked before it is muxed into the PC.
</p><p>
For <code>JMP</code>, the target comes from <code>Reg[R31]</code> which the user has free reign over (so <code>Reg[R31] = 0x80004000</code> is fine to store). Again, the MSB is masked on the path from the register file output to the PC input.
</p><p>
So yes, both are protected by the same mechanism (masking <code>PC[31]</code> on the next-PC path) and at the same stage (the PC write). The masking happens <em>after</em> whatever computation produced the candidate next PC, which is what makes it impossible for the user to escape via a clever target value.
</p></div><br>
 

Our lecture notes name three legal entry points to kernel mode: `RESET` (`0x80000000`), `ILLOP` (`0x80000004`), and `XAddr` (`0x80000008`). **Why** is it a design choice that these addresses be **hardwired** into the CPU rather than being soft configurable by the kernel at boot? 
 
<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
Hardwiring guarantees that the <strong>very first</strong> instruction executed after any privileged transition is one chosen by the kernel author at assembly time. The kernel author places the handler at the agreed address of <code>XAddr</code> or <code>ILLOP</code>, and the CPU's hardwired entry point is chosen to match. The property the hardware needs to give the OS is: <em>if <code>PC31</code> transitions from <code>0</code> to <code>1</code>, the new PC is one of three known kernel addresses</em>. Hardwiring is the simplest way to provide that property.
</p><p>
There are three reasons to prefer hardwiring these entry points on Beta:
</p>
<ol>
<li><strong>Bootstrap necessity for <code>RESET</code>.</strong> <code>RESET</code> <em>must</em> be hardwired because it is the address the CPU fetches from at power-on, before any code has run. There is nothing that could have set it. This is a chicken and egg problem: you would need kernel code to configure <code>RESET</code>, but <code>RESET</code> is how you get to kernel code in the first place. Hardwiring breaks the dependency.</li>
<li><strong>Simplicity of the datapath.</strong> Making <code>XAddr</code> and <code>ILLOP</code> writable would add a register, a write port, and a mux for each entry point, plus the control logic to protect those registers from user mode writes. Hardwiring reduces all of this to three constant values embedded in the Control Unit.</li>
<li><strong>One fewer thing for the kernel to get right.</strong> A writable entry register is a new initialisation step in the boot sequence, and therefore a new way for a buggy kernel to fail. Hardwiring eliminates that class of bug entirely: there is no initialisation to forget and no register to accidentally overwrite later.</li>
</ol>
<p>
Note that hardwiring is *not* the only valid design choice. Real architectures such as x86 (with the <code>IDTR</code> register) and ARM (with <code>VBAR</code>) make the interrupt vector base <em>writable</em> by privileged code. This buys flexibility such as a relocatable kernel, multiple handler tables, and virtualization support, at the cost of the extra hardware and the discipline to set the register early in boot. For a teaching CPU like Beta, the hardwired approach is the right tradeoff; for a production CPU, the writable approach usually wins.
</p></div><br>
 





## Trap, System Call, and Context Switch Trace (Challenging)
 
A user process P1 is executing a C statement `int c = getchar();`. The relevant assembly is:
 
```nasm
0x00002000:  ADDC(R31, 3, R0)    || service index 3 = read keyboard
0x00002004:  SVC(0)              || illegal opcode 1, traps to ILLOP
0x00002008:  ST(R0, c, R31)      || store returned char available at `R0` into c
```
 
`SVC(0)` is an instruction with an opcode that does not correspond to any real Beta instruction, used by convention to make a supervisor call (generic). Suppose P1 is at `PC = 0x00002004` when the `SVC` is fetched. The `ILLOP` handler at `0x80000004` reads `R0`, dispatches to a keyboard read service routine because it found the value `3` in `R0` (note that these values are arbitrary). The service routine marks P1 as blocked (waiting for input) and calls the scheduler. The scheduler picks a different ready process P2 to run.
 

**Trace**, in order, every write to `PC` and `Reg[XP]` from the moment the `SVC` is fetched until `P2` begins executing its first instruction. For each write, label it as **hardware** (datapath does it automatically) or **software** (an explicit instruction in some handler does it).
 
<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer">
<ol>
<li><strong>Hardware</strong> (cycle that fetches <code>SVC(0)</code> at <code>0x00002004</code>): the Control Unit decodes the illegal opcode, asserts <code>PCSEL = 011</code>, writes <code>Reg[XP] &lt;- PC + 4 = 0x00002008</code>, and writes <code>PC &lt;- 0x80000004</code> (<code>ILLOP</code>). The next fetch will be from the kernel, with <code>PC31 = 1</code>.</li>
<li><strong>Software</strong> (in the ILLOP handler): Just like callee entry procedure, it should save <code>R0</code> through <code>R30</code> of P1 into P1's slot in the process table. The currently held value <code>Reg[XP] = 0x00002008</code> is saved as part of this, so P1 **remembers** where to resume.</li>
<li><strong>Software</strong> (handler dispatch logic): reads <code>Reg[R0] = 3</code>, calls the keyboard read service routine, e.g: `KBD_READ`. </li>
<li><strong>Software</strong> (keyboard service routine): The service routine marks P1 as blocked and calls the scheduler to start P2. No <code>PC</code> or <code>XP</code> writes happen here, just ordinary subroutine linkage between one kernel code to another kernel code.</li>
<li><strong>Software</strong> (scheduler): selects P2 from the ready queue. Note that while the scheduler is running, <code>PC31 = 1</code>, so any timer interrupt that fires now is <strong>ignored</strong> by the hardware (Beta is non reentrant).</li>
<li><strong>Software</strong> (scheduler restore P2's context, also known as *stub*): loads <code>R0</code> through <code>R30</code> for P2 from P2's process table slot. This includes loading P2's saved return address into <code>Reg[XP]</code>.</li>
<li><strong>Software</strong> (final instruction of the restore procedure): executes <code>JMP(XP)</code> to resume P2. This is assuming that `XP` has already been adjusted properly prior to this.</li>
<li><strong>Hardware</strong> (the <code>JMP(XP)</code>): writes <code>PC &lt;- Reg[XP]</code> (with <code>PC[31]</code> masked to 0 because the destination is in user space). On the next cycle P2 fetches its first resumed instruction with <code>PC31 = 0</code>.</li>
</ol>
</div><br>
 

In the lecture notes, we state that Beta disables interrupt when `PC31 = 1`. This is called non reentrant: while `PC31 = 1`, `IRQ` is *masked* (ignored) in hardware. **Identify TWO specific moments** in the trace you did in the previous part above at which an asynchronous timer interrupt, if not masked, would **corrupt** the system. For each, describe the corruption concretely (what register or memory location ends up holding what wrong value).
 
<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
<strong>Moment 1: while the ILLOP handler is saving P1's registers.</strong> Suppose the handler has already executed <code>ST(R0, save_location)</code> and <code>ST(R1, save_location + 4)</code>, and is about to save <code>R2</code>. A timer interrupt fires. The hardware traps to <code>XAddr</code>, writing <code>Reg[XP] &lt;- PC + 4</code>, where <code>PC</code> is now somewhere inside the ILLOP handler. The original <code>Reg[XP] = 0x00002008</code> (P1's resume address) is <strong>overwritten</strong> and lost. The new `XAddr` handler then begins saving "registers", but the register file by this point holds a mix: some entries are still P1's, others have been clobbered by handler scratch work. The state written to the process table is **meaningless**, and on the eventual resume P1 sees garbage register contents and a <code>Reg[XP]</code> pointing into kernel code.
</p><p>
<strong>Moment 2: while the scheduler is restoring P2's registers.</strong> Suppose the restore loop has loaded <code>R0</code> through <code>R10</code> of P2 but has not yet loaded <code>R11</code> through <code>R30</code>. A timer interrupt fires. The hardware traps to <code>XAddr</code>. The new handler invocation now saves the <strong>current</strong> register file as if it were a meaningful process state. But the current register file is half P2 (<code>R0</code> through <code>R10</code>) and half whoever ran previously, perhaps the scheduler's own working values in <code>R11</code> through <code>R30</code>. This Frankenstein state is written into some process table slot. On its eventual resume, P2 (or whichever process the kernel believes that slot belongs to) sees registers that no real execution ever produced. If the restore loop happened to have already touched <code>XP</code>, the saved <code>XP</code> of this spurious trap points into the middle of the scheduler's restore loop, and "resuming" it would re-enter the scheduler at an arbitrary instruction.
</p><p>
In both cases the deeper failure is the same: the process table entry that represents a process must always reflect a **consistent** snapshot of one process at one moment in time, and the save and restore code achieves that only by virtue of running **atomically**. You might want to search what "atomic" means. We will dive deeper into this next term.
</p></div><br>
 




 