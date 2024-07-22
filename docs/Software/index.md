---
layout: default
title: Software Related Topics
permalink: /software
has_children: true
nav_order: 19
---

# 50.002 Software Related Topics
{: .no_toc}

These topics are taught after the recess week. They are **tested** during our Final examination. Below we list the **learning objectives** of each topic. 
## [Beta CPU Diagnostics](https://natalieagus.github.io/50002/notes/betadiagnostics)
1. Handle synchronous and asynchronous interrupts. 
2. Analyze the Beta Datapath structure and function.
3. Identify anomalies within the Beta CPU Architecture.
4. Practice with testing and troubleshooting techniques for the Beta CPU.
5. Implement alternative correcting measures in faulty Beta Datapath.

## [Software Abstraction & Assembly Language](https://natalieagus.github.io/50002/notes/assemblersandcompilers)
1. Explain the concept and purpose of software abstraction 
2. Write more complex programs using Beta Assembly language in bsim (Beta Simulator), utilising labels and macros
3. Hand compile basic C code expressions (int, arrays, conditionals, loops) into Beta assembly language


## [Stack and Procedures](https://natalieagus.github.io/50002/notes/stackandprocedures)
1. Understand the necessity of functions and stacks for reusable program execution.
2. Explain the role and functions of the linkage pointer, base pointer, stack pointer, and activation record.
3. Describe the Beta procedure linkage convention in its entirety.
4. Demonstrate the ability to draw the stack frame details of a procedure call.
5. Analyze and draw the stack frame details of a recursive procedure call.
6. Analyze and inspect a function stack paused during execution, accounting for each content.

## [Memory Hierarchy](https://natalieagus.github.io/50002/notes/memoryhierarchy)
1. Recognise the motivation behind memory hierarchy 
2. Present the workings behind simple SRAM and DRAM technologies
3. Compare and contrast the pros and cons between cache, physical/main memory (RAM) and secondary memory (disk)
4. Explain the concept locality of reference
5. Explain the caching idea
6. Identify two different cache designs: FA and DM and justify its benefits and drawback

## [Cache Design Issues](https://natalieagus.github.io/50002/notes/cachedesignissues)
1. Explain various cache design issues
2. Explain the differences between fully-associative cache, direct-mapped cache, and n-way set-associative cache
3. Evaluate various cache policies: write and replacement
4. Synthesise basic caching algorithm in the event of HIT or MISS
5. Recognise the differences between byte and word addressing
6. Benchmark various cache designs

## [Virtual Memory](https://natalieagus.github.io/50002/notes/virtualmemory)
1. Describe how virtual memory works
2. Explain simple page map design
3. Calculate page map arithmetic given a page map specification
4. Explain the role of translation look-ahead buffer 
5. Describe how demand paging works
illustrates the workings of context switching
6. Analyse the benefits and drawbacks of context switching

## [Virtual Machine](https://natalieagus.github.io/50002/notes/virtualmachine)
1. Explain the high level concept of virtual machine as processes in isolation
2. Justify the role of an operating system kernel in supporting the idea of virtual machines via multiplexing
3. Explain the significance of hardware support for OS multiplexing
4. Recognise the dual mode of operation 
5. Recognise the differences between synchronous and asynchronous interrupts
6. Explain the differences  between user and kernel mode

## [Asynchronous I/O and Device Handlers](https://natalieagus.github.io/50002/notes/asyncio)
1. Explain the role of OS for scheduling processes related to I/O
2. Define interrupt latency and explain interrupt enable/disable bit
3. Explain various scheduling policies (weak, strong)  and their impact on latency
4. Demonstrate real-world applications on recurring interrupts
5. Design suitable scheduling policies based on various deadlines