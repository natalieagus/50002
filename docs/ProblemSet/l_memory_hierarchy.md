---
layout: default
permalink: /problemset/memoryhierarchy
title: The Memory Hierarchy
description: Practice questions containing topics from Memory Hierarchy 
parent: Problem Set
nav_order: 10
---


* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design

# The Memory Hierarchy
{: no_toc}

Each topic's questions are grouped into **three** categories: basic, intermediate, and challenging. You are recommended to do all basic problem set before advancing further. 

## RAM Hardware (Basic)
Take a look at the following memory cells. The rightmost bit line corresponds to the LSB, and the leftmost bit line corresponds to the MSB.
<img src="https://dropbox.com/s/472uv0zpzuuwtyf/ramtech.png?raw=1" class="center_fifty"  >

1. Are these cells made up of SRAM or DRAM? 
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	SRAM.
	</p></div><br>
2. According to the diagram above, how many bits are there per word line? 
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	4
	</p></div><br>
3. What is the output when word line 1 is activated? 
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	<code>0010</code>
	</p></div><br>
4. What is the output when word line 2 is activated? 
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	<code>1100</code>
	</p></div><br>
	
## Cache Exercise (Basic)

The following is a sequence of address references given as **word** addresses (given from left to right):
```cpp
2,3,11,16,21,13,64,48,19,11,3,22,4,27,6,11
```

1. Show the hits and misses and final cache contents for a fully associative cache with **one-word blocks** and a **total size** of 16 words. Assume **LRU** replacement.

	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	The key to answering this question is to be mindful which address reference is the <i>least recently used</i>. We need to update the LRU index after every address reference.<br><br>
	The following is the state of the cache after each address reference call:<br>
	2: miss, cache now holds: 2 <br>
	3: miss, cache now holds: 3, 2<br>
	11: miss, cache now holds: 11, 3, 2<br>
	16: miss, cache now holds: 16, 11, 3, 2<br>
	21: miss, cache now holds: 21, 16, 11, 3, 2<br>
	13: miss, cache now holds: 13, 21, 16, 11, 3, 2<br>
	64: miss, cache now holds: 64, 13, 21, 16, 11, 3, 2<br>
	48: miss, cache now holds: 48, 64, 13, 21, 16, 11, 3, 2<br>
	19: miss, cache now holds: 19, 48, 64, 13, 21, 16, 11, 3, 2<br>
	11: hit, cache now holds: 11, 19, 48, 64, 13, 21, 16, 3, 2<br>
	3: hit, cache now holds: 3, 11, 19, 48, 64, 13, 21, 16, 2<br>
	22: miss, cache now holds: 22, 3, 11, 19, 48, 64, 13, 21, 16, 2<br>
	4: miss, cache now holds: 4, 22, 3, 11, 19, 48, 64, 13, 21, 16, 2<br>
	27: miss, cache now holds: 27, 4, 22, 3, 11, 19, 48, 64, 13, 21, 16, 2<br>
	6: miss, cache now holds: 6, 27, 4, 22, 3, 11, 19, 48, 64, 13, 21, 16, 2<br>
	11: hit, cache now holds: 11, 6, 27, 4, 22, 3, 19, 48, 64, 13, 21, 16, 2 <br>
	</p></div><br>

2. Show the hits and misses and final cache contents for a fully associative cache with **four-word blocks** and a **total size** of 16 words. Assume **LRU** replacement.
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	With a N-word block of data for each cache entry, note that the N words in a cache entry will have <strong>consecutive memory addresses</strong> starting with a word address that’s a <i>multiple</i> of N.<br><br>
	The following is the state of the cache after each address reference call:<br>
	2: miss, cache now holds: 0-3 <br>
	3: hit, cache now holds: 0-3 <br>
	11: miss, cache now holds: 8-11, 0-3<br>
	16: miss, cache now holds: 16-19, 8-11, 0-3<br>
	21: miss, cache now holds: 20-23, 16-19, 8-11, 0-3<br>
	13: miss, cache now holds: 12-15, 20-23, 16-19, 8-11<br>
	64: miss, cache now holds: 64-67, 12-15, 20-23, 16-19<br>
	48: miss, cache now holds: 48-51, 64-67, 12-15, 20-23<br>
	19: miss, cache now holds: 16-19, 48-51, 64-67, 12-15<br>
	11: miss, cache now holds: 8-11, 16-19, 48-51, 64-67<br>
	3: miss, cache now holds: 0-3, 8-11, 16-19, 48-51<br>
	22: miss, cache now holds: 20-23, 0-3, 8-11, 16-19<br>
	4: miss, cache now holds: 4-7, 20-23, 0-3, 8-11<br>
	27: miss, cache now holds: 24-27, 4-7, 20-23, 0-3<br>
	6: hit, cache now holds: 4-7, 24-27, 20-23, 0-3<br>
	11: miss, cache now holds: 8-11, 4-7, 24-27, 20-23<br>
	</p></div><br>

## Cache Performance (Basic)

1. If a cache access requires **one** clock cycle and handling cache misses stalls the processor for an additional **five** cycles, what cache hit rate comes **closest** to achieving an **average** memory access of 2 cycles?
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	2 cycle average access = (1 cycle for cache) + (1 - hit rate) * (5 cycles stall). This means the hit rate is **80%**.
	</p></div><br>

2. Why is **LRU** an effective cache replacement strategy?
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	Due to <strong>locality of reference</strong>. Locality implies that the probability of accessing a location decreases as the time since the last access increases. By choosing to replace locations that haven’t been used for the longest time, the least-recently-used replacement strategy should, in theory, be replacing locations that have the lowest probability of being accessed in the future.
	</p></div><br>

3. What would be the reasons behind improved caching performance when increasing the block size of a cache?
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	Increased block size means that more words are fetched when filling a cache line after a miss on a particular location. If this leads to increased performance, then the nearby words in the block must have been accessed by the program later on, ie, the program is exhibiting **locality of reference**.
	</p></div><br>


## Miswiring The Beta (Intermediate)

A student has miswired the address lines going to the memory of an unpipelined $$\beta$$ CPU. The wires in question carry a 30-bit word address to the memory subsystem, and the hapless student has in fact reversed the order of all 30 address bits. Much to his surprise, the machine continues to **work perfectly.**

1. Explain why the miswiring doesn’t affect the operation of the machine.
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	Since the Beta reverses the order of the 30 bit address in a **consistent** manner for all memory access related instructions, it will **still** be able to utilise the **reversed** address as per normal. Thus, the operation of the machine will not be affected. </p></div><br>

2. The student now replaces the memory in his miswired $$\beta$$ with a supposedly higher performance unit that contains both a fast fully associative cache and the same memory as before. The reversed wiring still exists between the $$\beta$$ and this new unit. To his surprise, the new unit does not significantly improve the performance of his machine. In desperation, the student then fixes the reversal of his address lines and the machine’s performance improves tremendously. **Explain why this happens.**
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	Caches take advantage of **locality of reference** by reading in an entire block of related data at one time, thereby reducing main memory accesses. By reversing the order of the 30 bit address, locality of the memory addresses is disrupted. The low-order bits that would normally place related data close to one another are instead the high-order bits and related data is more **spread** out through the main memory. This reduction in locality reduces cache performance significantly. When the student fixes the address line reversal problem, locality of the memory is restored, and the cache can perform as intended
	</p></div><br>

