---
layout: default
permalink: /notes/cachedesignissues
title: Cache Design Issues
description: Deciding the optimum cache policy on various usage scenario
nav_order: 14
---

* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design

# Cache Design Issues
{: .no_toc}
[You can find the lecture video here.](https://youtu.be/2OARjqLK4io) You can also **click** on each header to bring you to the section of the video covering the subtopic. 

## [Overview](https://www.youtube.com/watch?v=2OARjqLK4io&t=0s)

Recall that  **cache** is a small and fast (and expensive, made of `SRAM`) memory unit assembled near the CPU core, which function is to reduce the **average** time and energy required for the CPU to access some requested data `Mem[A]` located in the Main Memory (RAM). 
> You know them commercially as the L1, L2, or L3 caches. We simplify them in this course by just referring to them as a single *cache*.

The cache contains  a **copy** of some recently or frequently used data `Mem[A]` and its address `A`. The hardware is assembled in such a way that the CPU will always look for that particular data in the cache first, and only look for the requested information in the Physical Memory if cache `MISS` occurs (and then the cache will be updated to contain this new information). 

> Note that the CPU is able to both **read** from the cache and **write** to the cache (like normal `LD` and `ST` to the RAM).

Without the presence of cache device, the CPU has to frequently access the RAM. Frequent `LD` and `ST` to the Physical Memory becomes the main *bottleneck* for CPU performance. This is because the time taken for a *write* and *read* in `DRAM`  is significantly longer than optimum  CPU `CLK` cycle. 

In this chapter, we will learn various cache design issues such as its (hardware) **parameters**, i.e: *block size,* cache size, *associativity*, and **management**, i.e: *write* policy and *replacement* policy.


## [Cache Design Issues](https://www.youtube.com/watch?v=2OARjqLK4io&t=374s)
The cache design issues are categorised as follows:
1.  **Associativity** : we need to determine how many *different* cache lines can one address be stored to.  It implies **choice** . Of course note that there can only be one copy of that address (tag) in the entire cache. 
	* For DM cache, there is no choice on which cache line is used or looked up. **A 1-to-1 mapping** between each combination of the last $$k$$ bit of the query address `A` to the cache line (entry) is required. Hence, the DM cache has **no associativity**.
	* An FA cache, as the name suggests: has **complete associativity**. We have `N` choices of cache lines in an FA cache of size `N`: any `Tag`-`Content` can reside on any cache line in FA cache. 

2.  **Replacement policy** : refers to the decision on which entry of the cache should we *replace* in the event of cache `MISS`. 

3.  **Block size** : refers to the problem on deciding *how many sets* of 32-bits data do we want to **write** to the cache at a time. 

4.  **Write policy** :  refers to the decision on **when** do we *write* (updated entries) from cache to the main memory. 



## [Comparing FA and DM Cache](https://www.youtube.com/watch?v=2OARjqLK4io&t=519s)

  
We compare the two designs via various metrics: 

|Metric|FA Cache|DM Cache|
|--|--|--|
|**`TAG` field** | All address bits |Higher `T` address bits |
|**`Content` field** |All N bits of Data: `Mem[A]` |All N  bits Data: `Mem[A]` |
|**`TAG` Indexing** |None | Lower `K` address bits |
|**Cache Size** | Any | $$2^K$$|
|**Memory Cell Technology**|SRAM| SRAM |
|**Performance** |Very fast (gold standard) |Slower than FA cache on average|
|**Contention Risk**|None | Inversely proportional to cache size|
|**Cost**| Expensive| Cheaper than FA|
|**Replacement policy**|LRU, FIFO, Random| Not Applicable|
|**Associativity**|Fully associative, any `Tag`-`Content` can be placed on any cache line|None. Each cache line can only contain matching lower `k`-bits `TAG`|


It is obvious that each design has its own pros and cons depending its application. FA cache is superior in certain applications where small cache size is sufficient. The DM cache suffers from severe contention when the cache size is small, but perform reasonably well on average when its size is large. 


## Improving Associativity 

In this section, we will learn a new cache design called the N-way set associative (NWSA) cache, which is a *hybrid* design between FA and DM cache architecture.

### Motivation

*  Although DM cache is cheap, it suffers from the **contention** problem.

	*  Contention mostly occurs within a certain block of addresses (called independent **hot-spots**), due to the **locality of reference** in each different address *range*.
	* For example, if instructions for Program A lies in memory address range `0x1000` to `0x1111`, and instructions for Program B lies in memory address range `0xB000` to `0xB111`,
	* and if `k=3` in the CPU DM cache, **concurrent execution** of Program A and B will cause major **contention**. 

*  Hence, *some degree* of associativity is needed. 				
	* Full associativity will be expensive, so we try to just have *some* of it. 


  

### [N-Way Set Associative Cache](https://www.youtube.com/watch?v=2OARjqLK4io&t=740s)


One solution is increase the associativity of a DM cache is to build an **`N`-way set associative cache** (NWSA cache). 
* NWSA cache will be *cheaper* to produce than FA cache (of the same storage capacity), but slightly more expensive than its full DM cache counterpart. 
* NWSA cache has less risk of contention (proportional to the value of `N`). 

The figure below illustrates the structure of an NWSA cache:

<img src="https://dropbox.com/s/jbg0b7ajjcn79mg/nway.png?raw=1"    >

  

*  An NWSA cache is made up of  `N` DM caches, connected in a *parallel* fashion.

* The cells in the same '*row*' marked in red is called as belonging in the same **set**.

* The cells in the same '*column*' of DM caches  is said to belong in the same **way**. Each **way** is basically a DM cache that has $$2^k$$ cache lines.

* Given a combination of `K`-bits lower address, the higher `T` bits `TAG` and its `Content` can be stored in **any** *of the N cache lines in the same set.*

*  Given a query address `A`:
	*  we will need to wait for the device to *decode* its last `K` bits and find the right set.  		
	* Then, the device will perform a **parallel** lookup operation for all `N` cache lines same set. 


  

##  [Replacement Policies](https://www.youtube.com/watch?v=2OARjqLK4io&t=1069s)

Cache replacement policy is required in both FA cache and NWSA cache.  In the event of cache `MISS`, we need to **replace** the *old* cache line 	`TAG`-`Content` field with this *newly requested* one. 

> In DM cache, do we need a replacement policy? Why or why not? 

There are three common cache replacement strategies. Usually they're implemented **in hardware**, and carries varying degree of *overhead*.

> Overhead: additional cost (time, energy, money) to maintain and implement.  
  
### [Least Recently Used (LRU)](https://www.youtube.com/watch?v=2OARjqLK4io&t=1132s)

**The idea:** To always replace the least recently used item in the cache. 

**Overhead computation:** 	
* To know which item is the least recently used, we need to **keep an ordered list** of `N` items in the cache (FA) or set *at all times*. This takes up $$\log(N)$$ bits *per cache line*. In total, there's `N` cache lines, hence we need to have some hardware of size $$N\log_2(N)$$ bits to contain the necessary information for  supporting LRU replacement policy. 

 * We also need a **complex logic unit** for implementing LRU algorithm and to re-order the LRU bits *after every cache access.* 


**Example:** Given an FA cache of size `N=4`, and the event where we request addresses in this sequence: `0x0004,0x000C,0x0C08,0x0004,0xFF00,0xAACC` at `t=0,1,2,3,4,5` respectively.

At `t=2`, the state of the FA cache with LRU as replacement policy will be:
 
> Assume the **smallest** LRU bit indicates the **most** recently accessed data

| TAG |Content  | LRU |
|--|--|--|
| `0x0004` | `Mem[0x0004]` | 10 |
| `0x000C` | `Mem[0x000C]` | 01 |
| `0x0C08` | `Mem[0x0C08]` | 00 |
| - | - | - |

At `t=3`, we access `A=0x0004` again. This **updates** all LRU bits: 

| TAG |Content  | LRU |
|--|--|--|
| `0x0004` | `Mem[0x0004]` | 00 |
| `0x000C` | `Mem[0x000C]` | 10 |
| `0x0C08` | `Mem[0x0C08]` | 01 |
| - | - | - |

At `t=5`, the entry `0x000C-Mem[0x000C]` is replaced because its the *least recently used* entry:

| TAG |Content  | LRU |
|--|--|--|
| `0x0004` | `Mem[0x0004]` | 10 |
| `0xAACC` | `Mem[0xAACC]` | 00 |
| `0x0C08` | `Mem[0x0C08]` | 11 |
| `0xFF00` | `Mem[0xFF00]` | 01 |

 The LRU bits is  updated at **every** cache **access**, regardless of whether there's a replacement or not. 
  

### [Least Recently Replaced (LRR)](https://www.youtube.com/watch?v=2OARjqLK4io&t=1580s)

  
**The idea:** To always replace the **oldest** recently used item in the cache, *regardless of the last access time*.  

**Overhead computation:** 	
* We need to know which is **oldest** cache line  in the device. 
* If there are `N` items in the cache, we need  to have a pointer of size $$O(\log_2 N)$$ bits that can point to the oldest cache line.
*  \+ (not as complex) logic unit to perform the LRR algorithm. 

**Example:** (Same example as above) Given an FA cache of size `N=4`, and the event where we request addresses in this sequence: `0x0004,0x000C,0x0C08,0x0004,0xFF00,0xAACC` at `t=0,1,2,3,4,5` respectively.

> Assume that we will always fill *empty* cache from the smallest index to the largest index.

At`t=2`, the state of the FA cache with LRR as replacement policy will be:
 
> The LRR is a pointer containing the index of the "oldest" item in the cache. 

`LRR: 00`

| TAG |Content  | 
|--|--|--|
| `0x0004` | `Mem[0x0004]` |
| `0x000C` | `Mem[0x000C]` | 
| `0x0C08` | `Mem[0x0C08]` |
| - | - | - |

At `t=3`, we  access `A=4` again, but the `LRR` pointer **will not be updated.** 

At `t=5`, the one that is replaced is `A=0x0004`, and the `LRR` pointer can be increased to be the next oldest entry (the next index): 
`LRR: 01`


| TAG |Content  | 
|--|--|--|
| `0xAACC` | `Mem[0xAACC]` |
| `0x000C` | `Mem[0x000C]` | 
| `0x0C08` | `Mem[0x0C08]` |
| `0xFF00` | `Mem[0xFF00]` | 



### [Random](https://www.youtube.com/watch?v=2OARjqLK4io&t=1765s) 

 **The idea:** Very simple -- to replace a random cache line.  

**Overhead computation:**
* We simply need some logic unit to behave like a  random generator, and we use this to select the cache line to replace when the cache is full. 

### [Comparing Between Strategies](https://www.youtube.com/watch?v=2OARjqLK4io&t=1795s)
There's no one superior replacement policy. One replacement policy can be better than the other *depending on our use case* i.e: pattern of addresses enquired. 

> Refer to Problem Set for various examples 

**LRU** conforms to locality of reference, and is excellent when `N` is small (since it is expensive to implement). **Random** method is good when `N` is large. **LRR** is good on specific pattern of usage where we don't frequently revisit oldest cached data. 

## [The Cache Block Size](https://www.youtube.com/watch?v=2OARjqLK4io&t=1860s)

We can further improve cache performance by **increasing the capacity of each cache line**. We can **fetch  `B` words of data at a time**, and this is especially useful if there's high locality of reference.  The figure below illustrates a cache line with block size of 4:
  

<img src="https://dropbox.com/s/ceamhyfon0dsofw/blocksize.png?raw=1"   class="center_seventy"  >

 The number of data **words** in each cache line is called the **block size** and is always a power of two.  

 Recall that `1 word = 32 bits`, and we address the entire word by its smallest byte address. 

Hence to index or address each word in the cache line, we need $$b = \log_2(B)$$ bits. In the example above, we need 2 bits to address each **column**, taken from `A[3:2]` (assuming that `A` uses byte addressing). 


There are tradeoffs in determining the block size of our cache, since we always fetch (and / or overwrite) `B` words -- the entire block -- together at a time: 

*  **Pros**: If high locality of reference is present, there's high likelihood that the words from the same block will be required together. Fetching a large block upon the first `MISS` will be beneficial later on, thus improving the average performance. 

*  **Cons**: Risk of fetching **unused** words. With a larger block size, we have to fetch more words on a cache `MISS` and the `MISS` penalty grows linearly with increasing block size if there's low locality of reference.


##  [Write Policies](https://www.youtube.com/watch?v=2OARjqLK4io&t=2120s)

When the CPU executes a `ST` instruction, it will first write the `TAG = Address`-`Content = new content` to the cache. We will then have to decide *when* to actually update the physical memory. 

> Sometimes we do not need to update the physical memory at each `ST` as what was stored might only be intermediary or temporary values. This is where the act of "writing to cache first" instead of directly to physical memory speeds up execution. 

To update the physical memory, the CPU must first fetch the data from the cache and then write it to the physical memory. This **pauses** execution of the ongoing program as the CPU will be busy writing to the physical memory and updating it. 

There are three common cache write strategies. 


### [Write-through](https://www.youtube.com/watch?v=2OARjqLK4io&t=2174s)

**The main idea:**  CPU writes are done in the cache first by setting `TAG = Address`, and `Content = new content` in an available cache line, and is also **immediately** written to the physical memory. 

This policy **stalls** the CPU until write to memory is complete, but memory always holds the "truth", and is never oudated.

### [Write-back](https://www.youtube.com/watch?v=2OARjqLK4io&t=2243s)
  
**The main idea:**: Similarly, CPU writes are done in the cache first by setting `TAG = Address`, and `Content = new content` in an available cache line, **but not immediately written to the main memory.** 

The contents in the physical memory can be "*stale*" (outdated). 

To support this policy, the cache needs to have a helper bit called the **dirty bit** (see next section for more information) for each cache line -- to indicate whether the corresponding copy of the content in the main memory is outdated. The CPU will write to the physical memory only if the data in cache line *needs to be replaced* and that the cache line is **dirty**. If the data is not dirty, then the cache line can simply be replaced without any writes. 

> There is no best overall policy. Think about the pros and cons of each policy, and think about specific cases where one policy is superior than the other. 

### [Write-behind](https://www.youtube.com/watch?v=2OARjqLK4io&t=2380s)

**The main idea:**: CPU writes are also done in the cache first by setting `TAG = Address`, and `Content = new content` in an available cache line, and write to the physical memory is **immediate** but **buffered** or **pipelined**. 

CPU will not stall and will be executing next instructions while writes are *completed in the background.* It also needs the dirty bit indicator that will be cleared once the background write finishes. 

This policy might require slightly complex hardware to implement as opposed to the other policies, e.g: the pipeline and the background, asynchronous write system. 

## [The Helper Bits](https://www.youtube.com/watch?v=2OARjqLK4io&t=2439s)

The cache device may need to store not just `Tag`-`Content` per cache line, but also some "helper bits" that are used to perform some write or replacement policy, and the overall caching algorithm.  

###  V: **Valid Bit** 

The valid bit (either `1` or `0`) is used to indicate whether the particular cache line  contains *valid* and *important* values (valid copy of data from memory unit) and not an *invalid* or *empty* or *redundant* in value. 

> Think about it: in electronics, information is encoded in voltage. The device do not know what is the difference in usage between valid information vs invalid gibberish in a memory cell until it attempts to **compute**  its value -- which takes *time*. 

> Also, it does not know the difference between redundant (old) information vs new information. Therefore the valid bit is used as a quick indicator whether the content in the cache line is important or not. 

The cache performance can be further sped up if it is made to check (compare `TAG`) if `V = 1` for the cache line -- and skip comparison of `TAG` when `V=0`. 

This allows for a faster `HIT` computation in the event of cache `MISS`. 

**The cost**: just 1 extra storage bit per cache line. For cache lines with block size larger than 1, there's still only one `V` bit per cache line (so the entire `b` block of words are either *present* or *not present*). 

### D: Dirty Bit

  
The dirty bit (`1` or `0`) is used to indicate whether we need to update the memory unit to reflect the new updated version in the cache. 

The dirty bit is set to `1` **iff** the cache line is updated (CPU writes new values to cache) but this new value **hasn't been stored** to the physical memory. In other words, the copy in the physical memory is *outdated*. 
  

### LRU: Least Recently Used Bits

The LRU bit is present in each cache line for FA and NWSA cache only regardless of the block size.  DM cache does not have a replacement policy. For a cache of size `N`, we need `N log N` bits per cache. 


The helper bits can be illustrated in a diagram like below. Below we have a sample of 3WSA cache with block size of `2`:
  

<img src="https://dropbox.com/s/jdzkblgoyb6dh7i/3way.png?raw=1"    >

> Test your understanding: How many LRU bits are needed? 

 



## [Word Addressing Convention](https://www.youtube.com/watch?v=2OARjqLK4io&t=2730s)

Previously, we learned that byte addressing is used by convention.

However **for ease of calculation in practice questions** and **problem sets**, we can use **word addressing** instead (we give an address for each word instead of each byte). 

Given a memory unit of fixed size `M`, can use 2 bits less if we were to use word addressing instead of byte addressing. 


For DM/NWSA cache with `B` blocks and **word addressing**, we need to divide the original requested address into the same **three segments**, but we don't have the default `00` in the lowest 2 bits of the address (as when byte addressing is used) anymore: 

<img src="https://dropbox.com/s/2dsjsjurxtndevq/wordbyte.png?raw=1" class="center_seventy"   >

* Lowest`b`-bits to index each word in a cache line block. 
* `K`-bits to index each cache line or set. 
* Highest (remainder) `T`-bits of the original requested address to be stored in the `TAG` field.

## [Cache Benchmarking](https://www.youtube.com/watch?v=2OARjqLK4io&t=2885s)
We can  compute **average cache performance** by counting how many `HIT`s  (and `MISS`) are there given `N` queries in sequence, and dividing the number of `HIT` with `N`, given its hardware specification such as block size, replacement policy, and cache size. 

If the query sequences repeat itself, we can compute the number of `HIT` and `MISS` from its **steady state**. 

### Example 
We want to measure the performance of an FA cache that has `4` cache lines with **LRR** replacement policy.

Assume that the cache is initially *empty* (or contains redundant values -- nothing relevant is cached before), we let the CPU execute the following program consisted of 9 `READ` (`LD`) requests for a few *rounds*:

`At t=0: 0x0014`
`At t=1: 0x0011`
`At t=2: 0x0022`
`At t=3: 0x0014`
`At t=4: 0x0043`
`At t=5: 0x0012`
`At t=6: 0x0014`
`At t=7: 0x00AB`
`At t=8: 0x0033`

> We repeat the same 9 input sequences again for the second "round":

`At t=9: 0x0014`
`At t=10: 0x0011`
`At t=11: 0x0022`
`At t=12: 0x0014`
`At t=13: 0x0043`
`At t=14: 0x0012`
`At t=15: 0x0014`
`At t=16: 0x00AB`
`At t=17: 0x0033`
...
And repeated again, for the third "round", and so on.

> For ease of computation, word addressing is used (you can also tell that this is true as the addresses no longer have the suffix `00`). 

To benchmark this cache, we need to count how many `MISS` and `HIT` are there at the **steady state.** Hence, *we need to figure out which rounds make up the steady state.* 

**At the first round**, `t=0` to `t=8`, we have:

`At t=0: 0x0014` $$\rightarrow$$ `MISS` (and cached)
> Cache content after:  **`0x0014`**, `EMPTY`, `EMPTY`, `EMPTY`. 
> Oldest entry is bolded. 

`At t=1: 0x0011` $$\rightarrow$$ `MISS` (and cached).
> Cache content after:  **`0x0014`,** `0x0011`, `EMPTY`, `EMPTY`. 

`At t=2: 0x0022` $$\rightarrow$$ `MISS` (and cached).
> Cache content after:  **`0x0014`**, `0x0011`, `0x0022`, `EMPTY`. 

`At t=3: 0x0014`$$\rightarrow$$ `HIT` 
`At t=4: 0x0043`$$\rightarrow$$ `MISS`  (and cached)
> Cache content after:  **`0x0014`**, `0x0011`, `0x0022`, `0x0043`. 

`At t=5: 0x0012` $$\rightarrow$$ `MISS`  (and cached by replacing oldest entry:`0x0014`)
> Cache content after:  **`0x0011`**, `0x0022`, `0x0043`, `0x0012`. 

`At t=6: 0x0014`$$\rightarrow$$ `MISS`  (and cached by replacing oldest entry:`0x0011`)
> Cache content after:  **`0x0022`**, `0x0043`, `0x0012`, `0x0014`. 

`At t=7: 0x00AB` $$\rightarrow$$ `MISS`  (and cached by replacing oldest entry:`0x0022`)
> Cache content after:  **`0x0043`**, `0x0012`, `0x0014`, `0x00AB`. 

`At t=8: 0x0033` $$\rightarrow$$ `MISS`  (and cached by replacing oldest entry:`0x0043`)
> Cache content after:  **`0x0012`**, `0x0014`, `0x00AB`, `0x0033`. 


Now during the **second round**, `t=10` to `t=19`, we have the same 9 input sequences. Let's observe the result:

`At t=10: 0x0014` $$\rightarrow$$ `HIT` 

`At t=11: 0x0011` $$\rightarrow$$ `MISS`  (and cached by replacing oldest entry:`0x0012`)
> Cache content after:  **`0x0014`**, `0x00AB`, `0x0033`, `0x0011`. 

`At t=12: 0x0022` $$\rightarrow$$ `MISS`  (and cached by replacing oldest entry:`0x0014`)
> Cache content after:  **`0x00AB`**, `0x0033`, `0x0011`, `0x0022`. 

`At t=13: 0x0014`$$\rightarrow$$ `MISS`  (and cached by replacing oldest entry:`0x00AB`)
> Cache content after:  **`0x0033`**, `0x0011`, `0x0022`, `0x0014`. 

`At t=14: 0x0043`$$\rightarrow$$ `MISS` (and cached by replacing oldest entry:`0x0033`)
> Cache content after:  **`0x0011`**, `0x0022`, `0x0014`, `0x0043`. 

`At t=15: 0x0012` $$\rightarrow$$ `MISS`  (and cached by replacing oldest entry:`0x0011`)
> Cache content after:  **`0x0022`**, `0x0014`, `0x0043`, `0x0012`. 

`At t=16: 0x0014`$$\rightarrow$$ `HIT` 

`At t=17: 0x00AB` $$\rightarrow$$ `MISS`  (and cached by replacing oldest entry:`0x0022`)
> Cache content after:  **`0x0014`**, `0x0043`, `0x0012`, `0x00AB`. 

`At t=18: 0x0033` $$\rightarrow$$ `MISS`  (and cached by replacing oldest entry:`0x0014`)
> Cache content after:  **`0x0043`**, `0x0012`, `0x00AB`, `0x0033`. 


Running the cache for **another round** (the third time) at `t=19` to `t=27` with the same 9 input sequences:

`At t=19: 0x0014` $$\rightarrow$$  `MISS`  (and cached by replacing oldest entry:`0x0043`) 
> Cache content after:  **`0x0012`**, `0x00AB`, `0x0033`, `0x0014`. 

`At t=20: 0x0011` $$\rightarrow$$ `MISS`  (and cached by replacing oldest entry:`0x0012`)
> Cache content after:  **`0x00AB`**, `0x0033`, `0x0014`, `0x0011`. 

`At t=21: 0x0022` $$\rightarrow$$ `MISS`  (and cached by replacing oldest entry:`0x00AB`)
> Cache content after:  **`0x0033`**, `0x0014`, `0x0011`, `0x0022`. 

`At t=22: 0x0014`$$\rightarrow$$ `HIT` 

`At t=23: 0x0043`$$\rightarrow$$ `MISS` (and cached by replacing oldest entry:`0x0033`)
> Cache content after:  **`0x0014`**, `0x0011`, `0x0022`, `0x0043`. 

`At t=24: 0x0012` $$\rightarrow$$ `MISS`  (and cached by replacing oldest entry:`0x0014`)
> Cache content after:  **`0x0011`**, `0x0022`, `0x0043`, `0x0012`. 

`At t=25: 0x0014`$$\rightarrow$$  `MISS`  (and cached by replacing oldest entry:`0x0011`)
> Cache content after:  **`0x0022`**, `0x0043`, `0x0012`, `0x0014`. 

`At t=26: 0x00AB` $$\rightarrow$$ `MISS`  (and cached by replacing oldest entry:`0x0022`)
> Cache content after:  **`0x0043`**, `0x0012`, `0x0014`, `0x00AB`. 


`At t=27: 0x0033` $$\rightarrow$$ `MISS`  (and cached by replacing oldest entry:`0x0043`)
> Cache content after:  **`0x0012`**, `0x0014`, `0x00AB`, `0x0033`. 

If we run it again for the *fourth* round, we will have the same `HIT` and `MISS` sequences as the *second* round. This implies that the result of running it for the *fifth* round will be identical to the *third* round.

Hence *on average* we can count the number of `HIT` for the second and third round: 3 `HIT` in total for 18 address calls. 

> We ignore results from the first round because that result will never repeat itself again as we begin with empty cache only once in the beginning. 

That means out of the 18 address calls, we have 15 `MISS`. The miss rate of this cache is therefore pretty high at $$83.33\%$$. 

> Test yourself: If the FA cache uses LRU, will it have a better performance? i.e: less miss rate. What about when DM cache of same size (4 cache lines) is used? *Which cache design is better for this particular program running in a loop*? 




## [The Caching Algorithm](https://www.youtube.com/watch?v=2OARjqLK4io&t=3070s)

The caching algorithm computes what the cache must do in general when:
* CPU sends a read or write request, 
* Cache is full and it has to make room for new items when its full based on the chosen replacement policy. 
* It needs to write updated values back to the physical memory, based on the chosen write policy. 

> The actual implementation of the caching algorithm is done via **hardware implementation** for fastest possible performance.  

### READ/LOAD request

```cpp
On CPU READ/LOAD request for address A:

	check for A in TAG field of cache lines with V==1

	if HIT: 
		update all helper bits necessary (e.g: if LRU used)
		return the corresponding content from cache to CPU
		
	else if MISS:
		if DM cache:
			selected cache line to replace 
			is cache line with index matching last K bits of A
		else if FA cache:
			selected cache line to replace 
			depends on replacement policy
		else if NWSA cache:
			selected cache line to replace 
			depends on replacement policy in the set with index matching last K bits of A
		
		if cache line is dirty:
			if write policy == WRITE-BACK:
				compute the content's address 
				and update physical memory
			else if write policy == WRITE-BEHIND: 
				wait until update is done

		// at this point, selected cache line is safe to be overwritten 
		
		fetch A and Mem[A] from physical memory
		
		if DM cache:
			write higher T bits of A to the 
			TAG field of the selected cache line, 
			and Mem[A] as its content

		if FA cache:
			write A to TAG field of the 
			selected cache line, and Mem[A] 
			as its content

			if replacement policy == LRU:
				update LRU bit
			else if replacement policy == LRR:
				update LRR pointer

		return Mem[A] to CPU
```

### WRITE/STORE request

```cpp
On CPU WRITE/STORE (new_content) request to address A:

	check for A in TAG field of cache lines with V==1
	
	if MISS:
		if DM cache:
			selected cache line to replace 
			is cache line with index matching last K bits of A
		else if FA cache:
			selected cache line to replace 
			depends on replacement policy
		else if NWSA cache:
			selected cache line to replace 
			depends on replacement policy in 
			the set with index matching last K bits of A
			
		if cache line is dirty:
			if write policy == WRITE-BEHIND:
				wait
			else if write policy == WRITE-BACK:
				compute the content's address 
				and update physical memory
		
		// at this point the cache line is safe to be overwritten
	if DM cache:
		write higher T bits of A to the 
		TAG field of the selected cache line, 
		and  new_content from CPU as its content

	if FA cache:
		write A to TAG field of the 
		selected cache line, 
		and new_content from CPU as its content

		if replacement policy == LRU:
			update LRU bit
		else if replacement policy == LRR:
			update LRR pointer
		
	if write policy == WRITE-THROUGH:
		compute the content's address 
		and update physical memory
		return to CPU
	else:
		set cache line's dirty bit to 1
		return to CPU
			
```

## [Summary](https://www.youtube.com/watch?v=2OARjqLK4io&t=3405s)
[You may want to watch the post lecture videos here. ](https://youtu.be/33N7Y9Iydb0)

The four cache design issues discussed in this chapter are: associativity, replacement policies, write policies, and block size. There is no *golden cache design*  that suits all kinds of situations. The performance of a cache depends on its use case. 

> For example, associativity is **less important** when `N` is large, because the risk for contention is inversely proportional to `N`. 

We can attempt to analyse cache performance by building intuition from simple examples or using computer simulations of cache behaviors on real programs. Through various analysis with different use cases, we can fine tune and establish the basis for cache design decisions. 







