---
layout: default
permalink: /problemset/cacheissues
title: Cache Design Issues
description: Practice questions containing topics from Cache Issues
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

# Cache Issues
{: .no_toc}

Each topic's questions are grouped into **three** categories: basic, intermediate, and challenging. You are recommended to do all basic problem set before advancing further. 

## Cache Competition (Basic)
The following questions ask you to evaluate alternative cache designs using patterns of memory references taken from running programs. Each of the caches under consideration has a total capacity of 8 (4-byte) words, with one word stored in each cache line. The cache designs under consideration are:
* **DM**: a direct-mapped cache.
* **S2**: a 2-way set-associative cache with a least-recently-used replacement policy. Note that since we have a **total** capacity of 8 words, it means we have 4 sets for **S2**.
* **FA**: a fully-associative cache with a least-recently-used replacement policy.

The questions below present a **sequence** of addresses for memory reads. You should assume the sequences repeat from the start whenever you see ”...” 

{: .highlight}
**Keep in mind that byte addressing is used; addresses of consecutive words in memory differ by 4**. 

Each question asks which cache(s) give the best hit rate for the sequence. Answer by considering the steady-state hit rate, i.e., the percentage of memory references that hit in the cache after the sequence has been repeated many times.

1. Which cache(s) have the best hit rate for the sequence 0, 16, 4, 36, ...? The "..." means that we repeat the sequences: 0, 16, 4, 36, 0, 16, 4, 36, ... and so on. This applies to all other questions below.
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	<strong>DM:</strong> locations 4 and 36 collide, so each iteration has 2 hits, 2 misses.<br><br>
	<strong>S2:</strong> 100% hit rate. 0 and 16 map to the same set, as do 4 and 36, but since the cache is 2-way associative they don’t collide.<br><br>
	<strong>FA:</strong> 100% hit rate. The cache is only half filled by this loop.
	</p></div><br>

2. Which cache(s) have the best hit rate for the sequence 0, 4, 8, 12, 16, 20, 24, 28, 32, ...?
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	<strong>DM:</strong> locations 0 and 32 collide, so each iteration has 7 hits, 2 misses.<br><br>
	<strong>S2:</strong> locations 0, 16 and 32 all map to the same set. The LRU replacement strategy replaces 0 when accessing 32, 16 when accesing 0, 32 when accessing 16, etc., so each iteration has 6 hits, 3 misses.<br><br>
	<strong>FA:</strong> has 0% hit rate in the steady state since the LRU replacement strategy throws out each location just before it’s accessed by the loop
	</p></div><br>


3. Which cache(s) have the best hit rate for the sequence 0, 4, 8, 12, 16, 20, 24, 28, 32, 28, 24, 20, 16, 12, 8, 4, ...?
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	**All** caches perform the same. Locations 0 and 32 trade places in the caches, so each iteration has 14 hits and 2 misses.
	</p></div><br>

4. Which cache(s) have the best hit rate for the sequence 0, 4, 8, 12, 32, 36, 40, 44, 16, ...?
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	<strong>DM:</strong> 32 collides with 0, 36 with 4, 40 with 8, 44 with 12, so each iteration has only 1 hit and 8 misses.<br><br>
	<strong>S2:</strong>  locations 0, 16 and 32 trade places in the cache, so each iteration has 6 hits and 3 misses.<br><br>
	<strong>FA:</strong> 0 hits since LRU throws out each location just before it’s accessed by the loop.<br><br>
	</p></div><br>

5. Assume that a cache access takes 1 cycle and a memory access takes 4 cycles. If a memory access is initiated only after the cache has missed, what is the maximum miss rate we can tolerate before use of the cache actually slows down accesses?

	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	If accesses always go to Memory, it takes 4 cycles per access. With the cache, the <strong>average</strong> number of cycles per access is 1 + (miss rate) * 4. Hence if the miss rate is larger than 75% then the average number of cycles per access is more than 4. Our maximum miss rate is therefore <strong>75%</strong>.
	</p></div><br>


## DM Cache Arithmetic (Basic)
The diagram below illustrates a blocked, direct-mapped cache for a computer that uses 32-bit data words and 32-bit byte addresses. Assume that memory location `0x0012347B` was present in the cache.
<img src="https://dropbox.com/s/z5hvlhyk97wa2xa/QnCache.png?raw=1"  class="center_fifty">

1. Using the row and column labels from the figure, in what cache location could we find the data from that memory location? You may assume that Row `15` means index `0xF`, Row `14` means index `0xE`, and so on. 
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

The **shaded** region indicates that the tag-data cells are filled with some data. For the **LRU** bit, the higher value means that the item is more recently used. Assume that **word** addressing is used unless stated otherwise, and each instruction is 32-bit long. The label A, B, C, and 0 to 7 drawn in the picture is for you to identify which corresponding set and DM cache a particular data resides. 

According to the diagram, we have 8 sets, indexed from 0 to 7, and three DM caches (A to C) in total.
{: .highlight}

For each of the question below, assume higher bits of the address is zero and therefore isn't written. 

1. The computer now requests for `Mem[0x1304]`, and results in **cache miss**. It accesses the memory and write it onto the cache above. Where can `Mem[0x1304]` reside at?
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	It can reside in either `A4`, `B4`, or `C4`.
	</p></div><br>

2. The computer now requests for `Mem[0x1305]`, and results in another **cache miss**. It accesses the memory and write it onto the cache above. Where can `Mem[0x1305]` reside at?
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
		It can reside in `B5` only.
	</p></div><br>

3. The computer now requests for `Mem[0xB317]`, and results in yet another cache miss. It accesses the memory and write it onto the cache above. Where can `Mem[0xB317]` reside at?
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
		It replaces `A7` and resides at `A7`.
	</p></div><br>
	
4. How many bits of data can be contained in this 3-way set associative cache in total? 
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
		768. This is obtained from 24 (cache lines) times 32 bits of data each.
	</p></div><br>
	
5. What is the value of `t` (i.e: the number of bits stored in the 'Tag' column) if this 3- way set associative cache is used with a **Beta CPU?**
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
		27, since Beta uses byte addressing.  
	</p></div><br>
	
Another engineer would like to expand this 3-way set associative cache such that its **block size** is **two**.

1. What is the value of `k` now? 
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	Still 3, doesn't change since the number of sets remain the same. 
	</p></div><br>
	
2. What is the value of `t` now? i.e: How many bits are stored in the 'Tag' column of the cache? 
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	28, since now we need 1 bit to index the block, but `k` remains at 3 bits. 
	</p></div><br>
	
3. How many bits of data can be stored in this 3-way set associative cache in total if it is used with a **Beta CPU** but we don't ignore the last two bits as usual? (see the diagram above, we don't offset the last two bits of the address JUST FOR THIS QUESTION, for thought experiment sake).
	<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
	It is natural to think that the capacity is doubled, to be 1536 bits. However, the Beta CPU uses **byte** addressing, so only 25% of the cache is useful. That leaves us with 384 bits. 
	</p></div><br>
