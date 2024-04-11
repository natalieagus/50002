---
layout: default
permalink: /problemset/assemblersandcompilers
title: Assemblers and Compilers
description: Practice questions containing topics from Assembler and Compilers
parent: Problem Set
nav_order: 8
---

* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design

# Assemblers and Compilers
{: .no_toc}

Each topic's questions are grouped into **three** categories: basic, intermediate, and challenging. You are recommended to do all basic problem set before advancing further. 

{: .note}
The amount of practice problems in this set is smaller than usual because the topics learned this week is mainly to **set up** the knowledge required for the next topic. You will have more practice hand-assembling C instructions during our **lab**. 



## Byte Memory Array Loading (Basic)
The memory is loaded as a byte array `{14, 00, 3F, 60, 18, 00, 5F, 60, 00, 10, 01, 80, 1C, 00, 1F, 64, 00, 00, 00, 00, 02, 00, 00, 00, 04, 00, 00, 00, 00, 00, 00, 00}` before starting execution. 

For example, this means that `MEM[0] = 0x14` and `MEM[2] = 0x3F` and so on.

What is the WORD at memory address `0xC`? And what is the word at memory address `0x14`? 

<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
<code>MEM[0xC] = 64 1F 00 1C</code>, and <code>MEM[0x14] = 00 00 00 02</code>.
</p></div><br>




