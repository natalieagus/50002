---
layout: default
permalink: /notes/virtualmemory
title: Virtual Memory
description: Using a free part of the disk as an extension of the Memory
nav_order: 15
---

* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design

# Virtual Memory
[You can find the lecture video here.](https://youtu.be/19wS4GC6mbQ) You can also **click** on each header to bring you to the section of the video covering the subtopic. 
 
## [Overview](https://www.youtube.com/watch?v=19wS4GC6mbQ&t=0s)

The physical memory can contain all kinds of information, and is typically segmented as shown below to run a single process: 

> A **program** and a **process** are terms that are  very closely related. Formally, we refer to a **program** as a group of instructions made carry out a specified task whereas a process simply means *a program that is currently run* or *a program in execution*. We can open and run the same program `N` times simultaneously, forming `N` distinct processes (e.g: opening multiple instances of text editors). 

<img src="https://dropbox.com/s/m1vg38rki9m5z1i/memimage.png?raw=1" style="width: 70%;"  >

In the lower address (address `0` onwards), we typically have executable instructions loaded there (PC starts from `0`). 

**Stack** can grow during runtime mainly due to recursion and creation of *local* variables. There is another data structure called the **Heap**, that grows upwards (towards lower addresses) and is used to store *global* variables. 

> We don't go into too much details on how to maintain Heap during runtime in this course. For those who are interested, you may educate yourselves further with [external materials](http://www.enderunix.org/docs/memory.pdf).  

> Note that an *operating system* (OS) may not know in advance whether stack or heap will be used predominantly before the program is actually run. Therefore, an OS must layout these two memory regions in a way to guarantee **maximum space** for both.

The point of this illustration is to show that a single physical memory alone definitely is not enough to hold all information required to open too many programs at once. A typical size of physical memory in general-purpose computers is 4-32GB. 

We often open and run several programs **simultaneously**: multiple web browsers with gazzilion tabs, music player, video editor, photo editors, IDEs, video games, etc. 

When each of these programs are run, they're first **loaded** (copied) from disk onto the physical memory before they can be accessed and executed by the CPU. The total space required to contain all the information needed to run these programs at the same time is definitely more than 4-32GB. 

Hence, we need to "*borrow*" some free space on the Disk (*that are not used to store data*) to store the **state** of **currently-run programs**. This section is called the disk **swap space** and it serves as an *extension* to our physical memory. 

> Of course we have to *prioritize*. When `N` programs are opened at the same time, we do not necessarily use them all at once. There are some processes that are ***idling*** and **not currently in-use.**  These are the ones that are stored in the swap space . They will be loaded over to the physical memory again when users resume their usage on these programs. The part of the computer system that's responsible for process management is the *Operating System Kernel*. We will learn more about it next term. 

This motivates the idea of the **virtual memory**.

 *Virtual Memory* is a **memory management technique** that provides an **abstraction** of the storage resources so that :

1. It is **easier** for `N` processes to share the same *limited* physical storage without interfering with one another.

2. It allows for the **illusion** (to users) of a *very large physical memory space* without being limited by how much space that are *actually* available on the physical memory device. 

In virtual memory, we use a part of the disk as an *extension* to the physical memory, and let the programs *work* in the virtual address space instead of the physical (actual) address space. This is  so that it possible for *many programs* to *seemingly* loaded onto the physical memory and run *at the same time*, even when their total size exceeds the physical memory capacity. 


## [Memory Paging](https://www.youtube.com/watch?v=19wS4GC6mbQ&t=730s)

> An important concept to highlight before we dive into how virtual memory works is memory paging. 

**Paging** is a memory management scheme that is used to store and load data from the disk (large capacity secondary storage) for use in the physical memory efficiently. 

> For ease of explanation in this notes, you can assume that the word "disk" and "secondary storage" is synonymous. 

 A **page** is a fixed-size block of data that forms   *contiguous* physical memory addresses,  as illustrated in the figure below:

<img src="https://dropbox.com/s/janbxcdijndlhc4/page.png?raw=1" style="width: 60%;"   >
  
> It is very *useful* and *efficient* to transfer data in *pages* (instead of word by word) between the physical memory and disk due to **locality of reference.**

A **page** is identified by two things: 
* A Physical Page Number (`PPN`) 
	* This identifies the entire *page*
* \+ and `page offset` (`PO`)
	* This identifies the **word** line in a page

 `PPN + PO` actually makes up the entire Physical Address `PA` space.  

**The number of bits required for `PO`** depends on how many 32-bit words are there in a page (page size). 
**Example:**
 * Suppose we have 9 words of data for each page like the page size in the figure above. 
* The minimum bits required for `PO` is:
	 * $$\max(log_2(9)) = 4$$ bits if *word addressing* is used. 
	* $$\max(log_2(9)) + 2= 6$$ bits if *byte addressing* is used. 

**The number of bits required for `PPN`** depends on how many pages are there that can fit in the physical memory (physical memory size). 

**Example**: 
* Suppose there are only 20 pages in total that can fit in the physical memory. 
* The minimum bits required for `PPN` is $$\max(log_2(20)) = 5$$ bits. 

Common misunderstanding: It is easy to confuse between page size and block size and think that they are related. The truth is that: *page size* has nothing to do with *block size* we learned in the previous chapter. 
  

## [Virtual Memory](https://www.youtube.com/watch?v=19wS4GC6mbQ&t=1110s)
Before we begin, we need to remind ourselves that programs  are **loaded** to physical memory  **only when we open (run) them**, so that the CPU has *direct access to its instructions* for execution later on. 

> The majority of your installed programs *that are not opened and not run stays on disk.*

A computer can run many programs at a time, and therefore **all of them have to share** the same physical memory. 

For *ease of execution* and *security*, the burden of process management is passed to a very special program: the OS Kernel. 

> Each process does not know the existence of another process and everything else that lives in the physical memory. They don't have to keep track of which addresses in the physical is occupied or free to use, and one process wont be able to corrupt another. 

 This provides a layer of **abstraction**, as the OS Kernel is the only *program* that needs to be carefully designed to perform good memory management. 

The rest of the processes in the computer can proceed **as if they're the only process running in the computer**.  

This way we can say that each program has their own *memory*, that is the  **virtual memory**. 

*Recap: **Virtual memory is a memory management technique that provides abstraction**, in the sense that it allows the system to give each process an illusion that it is running on its own memory space isolated from other processes.* 


### [Virtual Address](https://www.youtube.com/watch?v=19wS4GC6mbQ&t=1288s)

When we open a program, OS Kernel allocates **a dedicated virtual address space** for all of its instructions (and data required for execution) -- spanning from low address `0` up to some high address.  

Therefore, the addresses requested by the `PC`  are actually *virtual addresses* (`VA`) instead of  *physical addresses* (PA).  

> **Physical address (PA)**: actual addresses of each (32 bit) word in the physical memory. 

Each `VA` has to be then mapped to a `PA`, so that the system may return the requested data to the CPU (upon instruction fetch, or `LD`), or complete the execution of `ST` related instructions. This mapping is done via the **memory management unit** (MMU). 

<img src="https://dropbox.com/s/s5mgxqim69a98o6/cpummu.png?raw=1"   >

> An MMU is a small hardware unit where  all *memory references* from the CPU  is *passed through itself,* and its primary function is to translate of `VA` to `PA`. Refer to the next section on MMU for further information 

> The CPU frequently makes memory references through instruction fetch from `PC`, or `LD` and `ST` related instructions. 

This arrangement allows for each program to have the ***same* set of `VA`,** e.g: its `PC` can always start from 0, but are in reality are physically separated from one another. 

The figure below illustrates this scenario:

<img src="https://dropbox.com/s/1h5q5heph7vp3yy/detailVM.png?raw=1">

> In the example above, there are two currently running programs: process `1` and process `2`, each running in its own VM. The actuall *content* of each VM may reside on physical memory, or disk swap space. 

> The contents of the virtual memory can either be in the  physical memory or at the disk swap space. The processes themselves **are not aware** that their actual *memory space* are *not contiguous* and **spans over two or more different storage hardware.** The virtual addresses however, are contiguous. 


**Although it goes without saying, it is worth reminding that only contents that reside on the physical memory has a physical address (PA).** 

> Contents that are on the disk swap space *does not have a `PA`*. If they are needed for access by the CPU, the OS Kernel needs to migrate a them over to the RAM first, so that they have a corresponding `VA`-`PA` translation and are **accessible** by the CPU.

  

### [Pagetable](https://www.youtube.com/watch?v=19wS4GC6mbQ&t=1715s)

The OS Kernel maintains a ***Pagetable*** (sometimes it is called *pagemap* too) that keeps track of the translation between each `VA` of each program to its corresponding `PA`. 

> The *Pagetable* contains **all possible combination of virtual address of a program**, but not all `VA` has corresponding `PA` at a time in the RAM (it may be in the disk).

The MMU utilizes the *Pagetable* to translate every memory reference requests from the CPU to an actual, physical address as illustrated below:

<img src="https://dropbox.com/s/rek05rsjagk2m43/mmuusage.png?raw=1"   >

* The *Pagetable* is stores mapping of the higher $$v$$ bits of virtual address (called the **`VPN`** - Virtual Page Number) to a corresponding **`PPN`** (physical page number).  

 The number of entries in the *Pagetable* is  $$2^v$$, because **exactly one entry** is needed *for every possible virtual page*. 

 The PO field of `VA` is **the same** as the PO field of its `PA`. If you always have `00` at the back of PO it simply means  BYTE ADDRESSING is used, but the number of bits of PO **includes** the last two bits. The figure above is just for **illustration purposes** only.

The MMU *is the device* that helps to perform these operations upon CPU memory reference requests: 
1. Extract `VPN` out of `VA`, 
2. Find the corresponding entry in the *Pagetable* 
3. Extract the `PPN` (if any)
4. Perform necessary tasks (**page-fault** handling) if the entry is *not resident* 
5. If `PPN` found, append PO with `PPN` to form a complete `PA` 
6. Pass `PA` to other relevant units so CPU request can be completed  


There are three other columns, `D`, `R`, and `LRU` (if `LRU` is the chosen replacement policy) in the Pagetable that contains helper bits, analogous to the ones we learned in cache before:
1. The Resident Bit `R`:
	* if `R==1`, then the requested *content* is in the physical memory -- `PPN` in the pagetable can be returned immediately for further processing to result in a complete `PA`. 
		> Note: "content" here refers to `Mem[PA]`. 
	
	* if `R==0`, then the requested *content* is not in the physical memory, but in the swap space of the disk.  **page-fault** exception occur and it has to be handled. 

2. The Dirty Bit `D`:
	* if `D==1`, then a write update of the *data* (to the secondary storage) has to be done before it is replaced / removed from the physical memory. 

3. The LRU Bit `LRU`: 
	* This bit is present only if replacement policy used is LRU. 
	* It indicates the LRU ordering of the *pages* **resident** in the physical memory. 
		> This information is used to decide which page in the physical memory can be *replaced* in the event that it is full and the CPU asks for a `VA` which actual *content* is not resident.  
	* The number of LRU bits *needed per entry in the pagetable* is $$v$$ (#VPN) bits, since the number of entries in the pagetable is $$2^v$$. We assume a vanilla, naive LRU implementation here, although in practice various optimisation may be done. The LRU bits simply behaves as a **pointer** to the row *containing* the LRU PPN, therefore we need at least $$v$$ bits and not $$#PPN$$ bits. 

#### [Pagetable Arithmetic](https://www.youtube.com/watch?v=19wS4GC6mbQ&t=1990s)

**Assuming we have byte addressing,** given a `VA` of `(v+p)` bits and a `PA` of `(m+p)` bits, we can deduce the following information:
*  The size of VM is: $$2^{v+p}$$ bytes 

*  The actual size of the physical memory is: $$2^{m+p}$$ 

*  The Pagetable must store $$(2 + m) \times 2^v$$ bits (please ignore the video's mistake in it stating $$2+m+v$$):
	* There are $$2^v$$ rows, 
	* each row stores `m` bits of `PPN`
	* plus helper bits:  `2` bits for `D` and `R`, `v` bits for `LRU` ordering
	* The $$v$$ VPN bits are *not exactly stored* as entries in the pagetable, but used as *indexing* (addressing, eg: using a decoder to select exactly one pagetable row using $$v$$ bits as the selector to the decoder)
	* Note that the $$v$$ bits is often drawn as the first column of the Pagetable. This is just to make your computation *easier*, but they're actually used for **indexing** only as explained in the point above. 

*  There are $$2^{p}$$ bytes per page.


  

#### [Pagetable Location](https://www.youtube.com/watch?v=19wS4GC6mbQ&t=2145s)

The *Pagetable* is **stored in the Physical Memory** for practical reasons *because of its rather large size*. 

> Given a `VA` of size `(v+p)` bits, the pagetable must store $$(2 + m) \times 2^v$$ bits at least, plus whatever helper bits required, depends on the policy. 

It is expensive to store it in SRAM-based memory device. The OS Kernel manages a portion of the physical memory, dedicated to store the pagetable. 

The MMU device has a component called the `Pagetable Pointer`, and it can be set to point *to the first entry* of the pagetable in the physical memory (see the figure in the next section for illustration).

There is only one problem with storing the Pagetable in the physical memory: It causes us to access the (slow) physical memory twice.
1.  Look up Pagetable to translate the `VA` to PA

1.  Access the Physical Memory again to get the content `Mem[PA]`. 

Therefore this *cheap* solution to utilize a portion of the Physical Memory to store the Pagetable *comes at the cost of reduced performance.* 

> But if we implement the entire Pagetable using SRAM, it is too expensive. 

The solution to this issue to build a small SRAM-based memory device to *cache*  a few of the most recently used entries of the Pagetable. This cache device is called the **Translation Lookaside Buffer** (TLB).

  

### [TLB: Translation Lookaside Buffer](https://www.youtube.com/watch?v=19wS4GC6mbQ&t=2350s)

The TLB is a small, FA-design cache to store a copy some recently used Pagetable entries, as shown in the figure below:

<img src="https://dropbox.com/s/g0ydenuirecwtwo/mmutlb.png?raw=1"   >

> We also use a hierarchy of memory devices here, just like what we learned in the previous chapter where we *cache* a few of the most recently used contents and its address: `A, Mem[A]` in another faster (but smaller) SRAM-based memory device to reduce the frequency of access to the slower (but larger) DRAM-based Physical Memory device. 

#### [Super Locality of Reference with TLB](https://www.youtube.com/watch?v=19wS4GC6mbQ&t=2400s)

 We know that there is *locality of reference* in *memory address* reference patterns. Therefore there is **super locality** of *page number* reference patterns (hit-rate of the TLB $$99\%$$ in practice).  

Also, note that the LRU bits in the TLB *is not the same* as the LRU bits in the Pagetable. 

> The reason is that the number of `N` entries in the TLB is always the `N` most recently accessed pages *out of* $$2^{v}$$ possible entries in the pagetable, where `N` < $$2^v$$ in practice. 
  

## [Demand Paging](https://www.youtube.com/watch?v=19wS4GC6mbQ&t=2495s)

Demand paging is a method of virtual memory management. This section explains how *demand paging* works. 

The OS Kernel is responsible in the implementation of demand paging, and it may vary from system to system. 

However, the main idea of demand paging is that *data is not copied from the swap space to the physical memory until they are needed or being demanded by some program.*

> We ignore the presence of *data cache* and TLB for now, for the sake of simplicity in explanation. We will add it back to the picture later on. 

*  ***At first*** (when the program has just been opened) its entire content is placed on the swap space of the disk. 

*  Pages will only be brought up to physical memory if the program code asks for it.

When a computer is turned off, every bits of information is stored in its non-volatile memory storage (disk, NAND flash, etc). 

> The physical memory is incapable of storing any information when it does not receive any power source.  

The OS Kernel is (*one of the*) first programs that is loaded onto the physical memory when our computer is started up.  It maintains an organised *array of pages on disk*. 

> Do not trouble yourself at this point at figuring out how *bootstrap* works, i.e: how to load the OS Kernel from the secondary storage to the physical memory. We will learn more about this next term.  

The moment a request to open a program is made,  the OS Kernel:
1. Allocates and prepares the *almost the entire virtual memory space* for this program on the disk's swap space, 
	> Only *a small subset*, essentially the program's *entry point* (elf table, main function, initial stack) is put onto the physical memory, and everything else is loaded later.

2. and *copies* contents required for execution over to this designated swap space from the *storage* part of the disk.

	> All *instructions* necessary for this program to run, its *stack space*, *heap space*, etc are nicely prepared by the OS Kernel before the program begins execution. 

Therefore, **almost all of its `VA` initially corresponds to some address on disk.** 

### [Page-Fault Exception](https://www.youtube.com/watch?v=19wS4GC6mbQ&t=2852s)
Upon execution of the first few lines of instruction of the program's entry point, the CPU will request to refer to some `VA`, and it will result in **page-fault** exception because almost all of its virtual addresses *aren't resident* in the physical memory yet at this point. 

The OS Kernel will then handle this "*missing*" page and start copying them over to the physical memory from the swap space, hence turning these pages to be **resident** -- and has a `PPN` assigned to it. 
> The kernel updates the corresponding entry of the Pagetable and the TLB.

Many page faults will occur as the program begins its execution **until most of the working set of pages are in physical memory** (not the entire program, as some programs can be way larger than the actual size of your physical memory, e.g: your video games. 

 In other words, the OS  Kernel bring only necessary pages that are going to be executed onto the physical memory  as the program runs, thus the name: ****demand paging**** for this technique.

### [Replacing Resident Pages](https://www.youtube.com/watch?v=19wS4GC6mbQ&t=2978s)
 
This process (of fetching new pages from swap space to the physical memory)  eventually fills up the latter. 

If a non-resident `VA` is enquired and the physical memory is **full**, the OS Kernel needs to *remove* some pages  (LRU/FIFO, depends on the replacement policy)  that are currently resident to make space for this newly requested page. 

If these to-be-removed pages are *dirty*, a **write** onto the disk swap space is required before they're being overwritten.


### Termination
Finally when the program terminates, the OS Kernel  and frees up all the space initially allocated for this program's VM (both on physical memory and disk swap space). 


### [An example](https://www.youtube.com/watch?v=19wS4GC6mbQ&t=3106s)
<img src="https://dropbox.com/s/r8nia46u4gdw6gk/vmexample.png?raw=1" style="width: 70%;"  >

The figure above shows a snapshot of the physical memory state at some point in time. There exist a pagetable with 16 entries and 8 pages of data labeled as `A` to `H` in the physical memory. LRU replacement policy with write back policy is used. **Lower** LRU means that the data is **more recently used.** 

Each *page* contains exactly 256 *bytes* of data. 

This information gives us five **clues**:
* `VPN` is `4` bits long 
* `PPN` is at least `3` bits long
* `PO` is `8` bits long
* `VA` is `8+4 = 12` bits long 
* `PA` is `3+8 = 11` bits long

We can assume that *instructions* are located at a separated physical memory (like our Beta), so we can spare ourselves the headache of resolving virtual to physical memory addresses on both instruction loading and data loading (`LD` and `ST` operations). **We assume for the sake of exercise in this course that we are looking at the portion of the RAM, Pagetable, and TLB that stores data only** and not instruction.  


**Example 1:** Now suppose the current instruction pointed by the PC is **`LD(R31, 0x2C8, R0)`**. 
> A memory reference to address `0x2C8` is required. 

`0x2C8` is *a virtual address*, and hence we need to obtain its physical address. Segmenting the `VA` into `VPN` and `PO`: 
* `VPN: 0x2` (higher 4 bits)
* `PO: 0xC8` (lower 8 bits)

Looking at the pagetable, we see that `VPN: 0x2` is **resident**, and can be translated into `PPN: 100`. The translated physical address is therefore `100 1100 1000`. In hex, this is `0x4C8`. The content that we are looking for exists within page `E`. 

**Example 2:**  Suppose the next instruction is **`ST(R31, 0x600, R0)`.** 

>This means a memory reference to address `0x600` is required:

We can segment the `VA` into:
* `VPN: 0x6` (higher 4 bits)
* `PO: 0x00` (lower 8 bits)

From the pagetable, we see that `VPN: 0x6` is **not resident.** 
> Even though `PPN: 5` is written at the row `VPN: 6`, we can *ignore* this value as the resident bit is `0`. **The values at the entry is irrelevant when `R=0`.** 

This memory reference request will result in  **page fault**. The OS Kernel will handle this exception, and bring the requested page (lets label it as  page `I`) into the RAM.

**Now suppose the RAM is currently full.** 
* We need to figure out which page can be *replaced*
* Since LRU policy is used, we need to find the *least recently used page* with the biggest `LRU` index
* This points to the last entry where `PPN:3`  (containing page `D`) and `LRU:7`. 

However, we cannot immediately *overwrite* page `D` since its dirty bit is activated. A **write** (from the physical memory to the swap space of page `D`) must be performed first before page `D` is replaced with the new page `I`. 

After page `D` write is done, the OS Kernel can copy page `I` over from the swap space to the physical memory, and **update the pagetable:**
* `VPN:F` dirty bit is cleared, and resident bit is set to `0`.
* `VPN:6` is updated, as now it is mapped to `PPN:3`. Its resident bit is set to `1`. 
* After *write* (`ST`), its dirty bit is also set to `1`. 
* All entries' LRU bits must be updated accordingly. 

The state of the physical memory after **both** instructions are executed in sequence is:
> `I'` is just a symbol of an updated page `I` after a `ST` instruction is completed

<img src="https://dropbox.com/s/mis63e6z0nm0n3b/vmexample-after.png?raw=1" style="width: 70%;"  >

The new changes are written in blue. 

> Enhance your understanding by adding TLB into the picture. If a TLB of size 2 (stores the 2 most recently used mapping) is used, what will its state be in the beginning? After **`LD(R31, 0x2C8, R0)`** is executed? Then after **`ST(R31, 0x600, R0)`** is executed next?  

## [Context Switch](https://www.youtube.com/watch?v=19wS4GC6mbQ&t=3411s)


A single core CPU is capable of running **many** programs -- seemingly *at the same time.* 

Actually, the CPU **switches** the execution of each programs from time to time; *so rapidly* that it *seems* like all programs are all running at once as if we have more than one CPU. **This technique is called rapid context switching.** 

**Context switch** refers to the procedure that a CPU must follow when changing the execution of one process with another. This is done to ensure that the process can be *restored* and its execution can be *resumed* again at a later point. 
> *A proper hardware support that enables rapid context switching **is crucial** as it enables users to multitask when using the machine.* 

**Recall that:**
* Each program *has its own virtual memory* (its like giving the illusion that each program has independent physical memory unit all for itself)

* Therefore every program can be written as if it has access to all memory, without considering where other programs reside. 

*  So for example, the `VA` of each program can start from `0x00000000` onwards but it actually points to different physical addresses on disk.




To distinguish between one program's `VA` address space with another, the OS Kernel assigns a unique identifier`C` called **context number** *for each program*. 

> "*Context*" is  **a set of mapping** of `VA` to `PA`.

The context number can be appended to the requested `VPN` to find its correct `PPN` mapping: 

* A register can be used (added to the MMU hardware) to hold the current context number `C`. 

* The TLB `TAG` field contains both `C` and `VPN`. 
* In the case of `MISS`, the Pagetable Pointer is updated to point to the *beginning* of the pagetable section for context `C`, and the index based on `VPN` finds the corresponding entry.  


<img src="https://dropbox.com/s/ckevn475pf7ar4s/mmuusagecontext.png?raw=1"   >



This way **we do not have to "flush" the TLB whenever the CPU changes *context*** -- that is *switching the execution of one program with another.* 

> It only needs to update the *pagetable pointer* so that it points to the start of the pagetable section for this new context. 

  



## [Using Cache with Virtual Memory](https://www.youtube.com/watch?v=19wS4GC6mbQ&t=3696s)

Recall that a *cache* is used to store copies of memory addresses and its content: `A, Mem[A]`, so that access to the physical memory can be reduced on average. 

There are two possible options on where to assemble the cache hardware, **before** or **after** the MMU, each having its pros and cons. 

  <img src="https://dropbox.com/s/j7l3t20a9cmt2ez/cacheMMU.png?raw=1"  style="width: 70%;" >

Note that if cache is placed before the MMU, then the cache stores `VA` (instead of PA) in its `TAG` field. 


Observe that if cache line selection is based on `PO` (unmapped, identical on both `VA` and PA), **then two computations can happen in parallel**:
1. `VPN` to `PPN` translation and, 
2. Finding the correct cache line in DM / NWSA cache 

 
Therefore we can arrange the components as such:

 <img src="https://dropbox.com/s/mdgucv6qubun01l/cachemmu2.png?raw=1"   style="width: 90%;">

Each cache line in the DW/NWSA used in the design above stores a *single word*  **(not pages)** in the `Content` field and its physical address in the `TAG` field.

The index of the tag in the cache is set to be the `PO` of the `VA` due to locality of reference. If higher order bit is used to index the cache lines then we will end up with **contention.** 

### Further Analysis
> What happens if the page is `Resident` but there's a cache `MISS`?

Cache *must be updated* by fetching the data from the Physical Memory. 

> What happens if the page is `Not Resident`? 

Page must be fetched from the swap space and copied over to the Physical Memory. Then, we *update* the cache. 

> Ask yourself these questions to enhance your understanding. 
> * What happens if the page is `Not Resident` and if Physical Memory is full? Assume LRU policy is used. 
> 
> * Which part of the TLB that we need to update on each memory reference request? What about the cache? Why? 
> 
> * What should be done if TLB `MISS` happens? 
> 
>* *Is it possible* for cache `HIT` to occur but the requested page is **not resident**? Why or why not?  


## [Summary](https://www.youtube.com/watch?v=19wS4GC6mbQ&t=4180s) 
[You may want to watch the post lecture videos here. ](https://youtu.be/oe_WHpAmgqM)

 *Virtual Memory* is a **memory management technique** that provides an **abstraction** of the storage resources so that programs can be written as if they have **full access** to the physical memory without having to consider where other programs reside . 

A small hardware called the **MMU** is used to implement support this technique. 

Since each program is running in an isolated manner from one another (in its own *virtual space*, unaware of the presence of other programs), the OS Kernel can switch execution between programs -- giving the users an *illusion* as if these programs are running **simultaneously** with just a single CPU. The procedure that allows for this to happen seamlessly is called **rapid context switching.**

Context switching allows for **timesharing** among several programs. 

> The OS Kernel simply loads the appropriate context number and pagetable pointer when switching among programs. This way, the CPU can have access to instructions or data required to execute each program and switch executions between program. 


In the next chapter we will learn more about how the OS Kernel is specially privileged program is responsible of managing hardware resources in a system and scheduling processes to share these limited resources, thus allowing each process  to run independently on its own ***virtual machine.*** 



  

  
