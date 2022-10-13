---
layout: default
permalink: /problemset/problemset7
title: Problem Set 7
description: Week 10 practice questions containing topics from Memory Hierarchy and Cache Issues
parent: Problem Set
nav_order: 7
---


* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design

# Problem Set 7
{: .no_toc}
This page contains all practice questions that constitutes the topics learned in <ins>Week 10</ins>:  **Memory Hierarchy**, **Cache Issues**.

Each topic's questions are grouped into **three** categories: basic, intermediate, and challenging. You are recommended to do all basic problem set before advancing further. 

## RAM Hardware (Basic)
Take a look at the following memory cells. The rightmost bit line corresponds to the LSB, and the leftmost bit line corresponds to the MSB.
<img src="https://dropbox.com/s/472uv0zpzuuwtyf/ramtech.png?raw=1"  >

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

1. If a cache access requires **one** clock cycle and handling cache misses stalls the processor for an additional **five** cycles, which of the following cache hit rates comes **closest** to achieving an **average** memory access of 2 cycles?
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	2 cycle average access = (1 cycle for cache) + (1 - hit rate)(5 cycles stall). This means hit rate = 80%.
	</p></div><br>

2. Why is **LRU** an effective cache replacement strategy?
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	Due to <strong>locality of reference</strong>. Locality implies that the probability of accessing a location decreases as the time since the last access increases. By choosing to replace locations that haven’t been used for the longest time, the least-recently-used replacement strategy should, in theory, be replacing locations that have the lowest probability of being accessed in the future.
	</p></div><br>

3. What would be the reasons behind improved caching performance when increasing the block size of a cache?
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	Increased block size means that more words are fetched when filling a cache line after a miss on a particular location. If this leads to increased performance, then the nearby words in the block must have been accessed by the program later on, ie, the program is exhibiting locality of reference.
	</p></div><br>


## Miswiring The Beta (Intermediate)

A student has miswired the address lines going to the memory of an unpipelined $$\beta$$ CPU. The wires in question carry a 30-bit word address to the memory subsystem, and the hapless student has in fact reversed the order of all 30 address bits. Much to his surprise, the machine continues to **work perfectly.**

1. Explain why the miswiring doesn’t affect the operation of the machine.
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	Since the Beta reverses the order of the 30 bit address in the same manner for each memory access, the Beta will use the same reversed address to access a particular memory location for both stores and loads. Thus, the operation of the machine will not be affected. </p></div><br>

2. The student now replaces the memory in his miswired $$\beta$$ with a supposedly higher performance unit that contains both a fast fully associative cache and the same memory as before. The reversed wiring still exists between the $$\beta$$ and this new unit. To his surprise, the new unit does not significantly improve the performance of his machine. In desperation, the student then fixes the reversal of his address lines and the machine’s performance improves tremendously. **Explain why this happens.**
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	Caches take advantage of locality of reference by reading in an entire block of related data at one time, thereby reducing main memory accesses. By reversing the order of the 30 bit address, locality of the memory addresses is disrupted. The low-order bits that would normally place related data close to one another are instead the high-order bits and related data is more spread out through the main memory. This reduction in locality reduces cache performance significantly. When the student fixes the address line reversal problem, locality of the memory is restored, and the cache can perform as intended
	</p></div><br>


## Cache Competition (Basic)
The following questions ask you to evaluate alternative cache designs using patterns of memory references taken from running programs. Each of the caches under consideration has a total capacity of 8 (4-byte) words, with one word stored in each cache line. The cache designs under consideration are:
* DM: a direct-mapped cache.
* S2: a 2-way set-associative cache with a least-recently-used replacement policy.
* FA: a fully-associative cache with a least-recently-used replacement policy.

The questions below present a sequence of addresses for memory reads. You should assume the sequences repeat from the start whenever you see ”...”. **Keep in mind that byte addressing is used; addresses of consecutive words in memory differ by 4**.

Each question asks which cache(s) give the best hit rate for the sequence. Answer by considering the steady-state hit rate, i.e., the percentage of memory references that hit in the cache after the sequence has been repeated many times.

1. Which cache(s) have the best hit rate for the sequence 0, 16, 4, 36, ...?
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	<strong>DM:</strong> locations 4 and 36 collide, so each iteration has 2 hits, 2 misses.<br><br>
	<strong>S2:</strong> 100% hit rate. 0 and 16 map to the same cache line, as do 4 and 36, but since the cache is 2-way associative they don’t collide.<br><br>
	<strong>FA:</strong> 100% hit rate. The cache is only half filled by this loop.
	</p></div><br>

2. Which cache(s) have the best hit rate for the sequence 0, 4, 8, 12, 16, 20, 24, 28, 32, ...?
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	<strong>DM:</strong> locations 0 and 32 collide, so each iteration has 7 hits, 2 misses.<br><br>
	<strong>S2:</strong> locations 0, 16 and 32 all map to the same cache line. The LRU replacement strategy replaces 0 when accessing 32, 16 when accesing 0, 32 when accessing 16, etc., so each iteration has 6 hits, 3 misses.<br><br>
	<strong>FA:</strong> has 0% hit rate in the steady state since the LRU replacement strategy throws out each location just before it’s accessed by the loop
	</p></div><br>


3. Which cache(s) have the best hit rate for the sequence 0, 4, 8, 12, 16, 20, 24, 28, 32, 28, 24, 20, 16, 12, 8, 4, ...?
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	All caches perform the same. Locations 0 and 32 trade places in the caches, so each iteration has 14 hits and 2 misses.
	</p></div><br>

4. Which cache(s) have the best hit rate for the sequence 0, 4, 8, 12, 32, 36, 40, 44, 16, ...?
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	<strong>DM:</strong> 32 collides with 0, 36 with 4, 40 with 8, 44 with 12, so each iteration has only 1 hit and 8 misses.<br><br>
	<strong>S2:</strong>  locations 0, 16 and 32 trade places in the cache, so each iteration has 6 hits and 3 misses.<br><br>
	<strong>FA:</strong> 0 hits since LRU throws out each location just before it’s accessed by the loop.<br><br>
	</p></div><br>

5. Assume that a cache access takes 1 cycle and a memory access takes 4 cycles. If a memory access is initiated only after the cache has missed, what is the maximum miss rate we can tolerate before use of the cache actually slows down accesses?

	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	If accesses always go to Memory, it takes 4 cycles per access. With the cache, the <strong>average</strong> number of cycles per access is 1 + (miss rate)*4. Hence if the miss rate is larger than 75% then the average number of cycles per access is more than 4. Our maximum miss rate is therefore <strong>75%</strong>.
	</p></div><br>


## DM Cache Arithmetic (Basic)
The diagram below illustrates a blocked, direct-mapped cache for a computer that uses 32-bit data words and 32-bit byte addresses. Assume that memory location `0x0012347B` was present in the cache.
<img src="https://dropbox.com/s/z5hvlhyk97wa2xa/QnCache.png?raw=1"  class="center_seventy">

1. Using the row and column labels from the figure, in what cache location could we find the data from that memory location? You may assume that e.g: Row 15 means index `0xF`, Row 14 means index `0xE`, and so on. 
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	Expanding the last 8-bit of the memory location we have <code>0111 1011</code>. There are two bits for block indexing and four bits for row indexing. Since last two bits are disregarded as indicted in the image, the block index is `10` and the row index is `0111`. This corresponds to `DATA 10` column and `Row 7` row. 
	</p></div><br>

2. Can data from locations `0x0012347B` and `0x00123470` be present in the cache at the same time?
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	Expanding the last 8-bit of the memory location we have <code>0111 1011</code> and <code>0111 0000</code> respectively. So <strong>yes</strong>, they can be both present in the cache at the same time. <code>0x0012347B</code> stays at `DATA 10` column and <code>0x00123470</code> stays at `DATA 00` column, and both resides in `Row 7`.
	</p></div><br>

## 3-Way Set Associative Cache Arithmetic (Intermediate)

Take a look at the following 3-way set associative cache:

<img src="https://dropbox.com/s/eou2p0yh6j56s3k/3w.png?raw=1" class="center_seventy" >

The shaded region indicates that the tag-data cells are filled with some data. For the LRU bit, the higher value means that the item is more recently used. Assume that **word** addressing is used unless stated otherwise, and each instruction is 32-bit long. The label A, B, C, and 0 to 7 drawn in the picture is for you to identify which corresponding set and DM cache a particular data resides. According to the diagram, we have 8 sets, indexed from 0 to 7, and three DM caches (A to C) in total.

For each of the question below, assume higher bits of the address is zero and therefore isn't written. 

1. The computer now requests for `Mem[0x1304]`, and results in **cache miss**. It accesses the memory and write it onto the cache above. Where can `Mem[0x1304]` reside at?
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	It can reside in either A4, B4, or C4.
	</p></div><br>

2. The computer now requests for `Mem[0x1305]`, and results in another **cache miss**. It accesses the memory and write it onto the cache above. Where can `Mem[0x1305]` reside at?
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
		It can reside at B5 only.
	</p></div><br>

3. The computer now requests for `Mem[0xB317]`, and results in yet another cache miss. It accesses the memory and write it onto the cache above. Where can `Mem[0xB317]` reside at?
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
		It replaces A7 and resides at A7.
	</p></div><br>
	
4. How many bits of data can be contained in this 3-way set associative cache in total? 
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
		768.
	</p></div><br>
	
5. What is the value of t (i.e: the number of bits stored in the 'Tag' column) if this 3- way set associative cache is used with a **Beta CPU?**
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
		27, since Beta uses byte addressing.  
	</p></div><br>
	
Another engineer would like to expand this 3-way set associative cache such that its block size is two.

1. What is the value of k now? 
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	Still 3, doesn't change since the number of sets remain the same. 
	</p></div><br>
	
2. What is the value of t now? i.e: How many bits are stored in the 'Tag' column of the cache? 
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	28, since now we need 1 bit to index the block, but k remains at 3 bits. 
	</p></div><br>
	
3. How many bits of data can be stored in this 3-way set associative cache in total if it is used with a **Beta CPU** but we don't ignore the last two bits as usual? (see the diagram above, we don't offset the last two bits of the address JUST FOR THIS QUESTION, for thought experiment sake).
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	It is natural to think that the capacity is doubled, to be 1536 bits. However, the Beta CPU uses byte addressing, so only 25% of the cache is useful. That leaves with 384 bits. 
	</p></div><br>
