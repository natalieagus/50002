---
layout: default
title: Software Related Topics
permalink: /software
has_children: true
nav_order: 19
---

# 50.002 Software Related Topics
{: .no_toc}

## [Software Abstraction & Assembly Language](https://natalieagus.github.io/50002/notes/assemblersandcompilers)
* explain the concept of software abstraction 
* write more complex programs using Beta Assembly language in bsim, utilising labels and macros
* compile C code expressions (int, arrays, conditionals, loops) into Beta assembly language


## [Stack and Procedures](https://natalieagus.github.io/50002/notes/stackandprocedures)
* evaluate the necessity of functions and stack for reusable program execution
* explain what linkage pointer, base pointer, stack pointer, and activation record are and describe their functions
* explain the entirety of Beta procedure linkage convention
* draw stack frame detail of a procedure call
* draw stack frame detail of a recursive procedure call
* inspect a function stack paused during execution and account for each of its content

## [Memory Hierarchy](https://natalieagus.github.io/50002/notes/memoryhierarchy)
* recognise the motivation behind memory hierarchy 
* present the workings behind simple SRAM and DRAM technologies
* compare and contrast the pros and cons between cache, physical/main memory (RAM) and secondary memory (disk)
* explain the concept locality of reference
* explain the cache idea
* identify two different cache designs: FA and DM and justify its benefits and drawback

## [Cache Design Issues](https://natalieagus.github.io/50002/notes/cachedesignissues)
* explain various cache design issues
* explain the differences between fully-associative cache, direct-mapped cache, and n-way set-associative cache
* evaluate various cache policies: write and replacement
* synthesise basic caching algorithm in the event of hit or miss
* recognise the differences between byte and word addressing
* benchmark various cache designs

## [Virtual Memory](https://natalieagus.github.io/50002/notes/virtualmemory)
* describe how virtual memory works
* explain simple page map design
* calculate page map arithmetic given a page map specification
* explain the role of translation look-ahead buffer 
* describe how demand paging works
* illustrates the workings of context switching
* analyse the benefits of context switching 

## [Virtual Machine](https://natalieagus.github.io/50002/notes/virtualmachine)
* explain the high level concept of virtual machine as processes in isolation
* analyse the role of an operating system kernel in supporting the idea of virtual machines via multiplexing
* explain the significance of hardware support for OS multiplexing
* recognise the dual mode of operation 
* recognise the differences between synchronous and asynchronous interrupts
* explain user mode restrictions 

## [Asynchronous I/O and Device Handlers](https://natalieagus.github.io/50002/notes/asyncio)
* explain the role of OS for scheduling processes related to I/O
* define interrupt latency and explain interrupt enable/disable bit
* explain various scheduling policies (weak, strong)  and their impact on latency
* demonstrate real-world applications on recurring interrupts
* design suitable scheduling policies based on various deadlines