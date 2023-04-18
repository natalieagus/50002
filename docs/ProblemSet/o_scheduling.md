---
layout: default
permalink: /problemset/scheduling
title: Asynchronous I/O Handling
description: Practice questions containing topics from Async I/O Handling
parent: Problem Set
nav_order: 11
---

* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design

# Asynchronous I/O Handling 
{: .no_toc}

Each topic's questions are grouped into **three** categories: basic, intermediate, and challenging. You are recommended to do all basic problem set before advancing further. 

## Priority Scheduling Part 1 (Basic)

A real-time operating system with priority interrupts has three interrupt handlers – Printer (P), Disk (D), Keyboard (K) – each running at a different priority level. However, you <span style="color:red; font-weight: bold;">don’t know</span> the order or priority for each device, or whether it is using the STRONG or WEAK scheme.

The handlers are invoked by the Printer, Disk, and Keyboard interrupts, marked as ↑ in the execution timelines. You can assume that the **service time** for each interrupt request is the same, as indicated by the same length of service time in the diagram below.

For example, the following execution timeline shows the printer handler running to completion after a printer interrupt request, followed by execution of the disk handler, running to completion after the disk interrupt request. The same happens with keyboard.

<img src="{{ site.baseurl }}//assets/images/o_scheduling/2023-04-03-13-56-34.png"  class="center_seventy"/>

Obviously from the diagram above, you can’t tell whether strong or weak priority scheduling policy is used, and neither can you tell its priority ordering. You stay to observe the system for a while more and obtain the following information:

<img src="{{ site.baseurl }}//assets/images/o_scheduling/2023-04-03-13-56-48.png"  class="center_seventy"/>

Based on the above observed state, which of the following scheduling policy(ies) is /are possible?
1. Weak scheme: Printer > Disk > Keyboard
2. Strong scheme: Printer > Disk > Keyboard
3. Strong scheme: Disk > Printer > Keyboard
4. Weak scheme: Keyboard > Disk > Printer
5. Strong scheme: Keyboard > Printer > Disk
6. Weak scheme: Disk > Printer > Keyboard


<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
1, 2, and 6.
</p></div><br>


## Priority Scheduling Part 2 (Basic)

{: .note}
This question is a continuation from the above question.

You continue to observe the system from the previous question and obtain the following information.
Based on this new information, can you tell which exact scheduling scheme is used by the system? Only one answer is allowed. If you think insufficient information is given, select “can’t tell”.

<img src="{{ site.baseurl }}//assets/images/o_scheduling/2023-04-03-13-58-32.png"  class="center_seventy"/>

Here are the options:
1. Weak scheme: Printer > Disk > Keyboard
2. Strong scheme: Printer > Disk > Keyboard
3. Strong scheme: Disk > Printer > Keyboard
4. Weak scheme: Keyboard > Disk > Printer
5. Strong scheme: Keyboard > Printer > Disk
6. Weak scheme: Disk > Printer > Keyboard
7. Can’t tell

<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
The answer is option 2.
</p></div><br>

## Priority Scheduling Part 3 (Basic)

{: .note}
This question is a continuation from the above question.

The following table summarizes the service time, frequency, and deadline (counted from the occurrence of interru request) for each device:


Device | Service Time (s) | Deadline (s) | Frequency (Hz)
---------|----------|---------|---------
Printer | 0.1 | X | 2 
Disk | 0.1 | Y | 4
Keyboard | 0.1 | Z | 1 

If Weak scheme with priority: Printer > Disk > Keyboard is used, select all possible values of X, Y, and Z (deadline for each device). 
1. `X = 0.1, Y = 0.1, Z = 0.1`
2. `X = 0.3, Y = 0.2, Z = 0.1`
3. `X = 0.2, Y = 0.3, Z = 0.3`
4. `X = 0.3, Y = 0.3, Z = 0.4`
5. `X = 0.4, Y = 0.5, Z = 0.2`

<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
Only values 3 and 4 are possible.
</p></div><br>
