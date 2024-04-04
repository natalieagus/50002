---
layout: default
permalink: /notes/virtualmemory
title: Virtual Memory
description: Using a free part of the disk as an extension of the Memory
nav_order: 15
parent: Software Related Topics
---

* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design

# Virtual Memory
{: .no_toc}
[You can find the lecture video here.](https://youtu.be/19wS4GC6mbQ) You can also **click** on each header to bring you to the section of the video covering the subtopic. 
 
## [Overview](https://www.youtube.com/watch?v=19wS4GC6mbQ&t=0s)

The physical memory can contain all kinds of information. The memory image of a single **process** typically contains the following segments: 

<img src="https://dropbox.com/s/m1vg38rki9m5z1i/memimage.png?raw=1" class="center_fifty" >

{: .new-title}
> Program vs Process
> 
> A **program** and a **process** are terms that are  very closely related. Formally, we refer to a **program** as a group of instructions made to carry out a specified task whereas a process simply means *a program that is currently running* or *a program in execution*. We can open and run the same program `N` times simultaneously, forming `N` distinct processes (e.g: opening multiple instances of text editors). In this course, we relax this strict distinction and use them *interchangeably* to explain certain concepts easily.

We typically have **executable** instructions loaded in the lower address segment (PC starts from `0` when a process just started running). 

The **stack** portion (of the process) can grow during runtime mainly due to function calls (especially recursive ones): storing arguments at `BP-N` addresses, storing old register values; and creation of *local* variables usually placed at fixed addresses of `BP+M`. 

> There is also another data structure called the **Heap**, that grows upwards (towards lower addresses) and is used to store *global* variables. We don't go into too much details on how to maintain Heap during runtime in this course. For those who are interested, you can read these [external materials](http://www.enderunix.org/docs/memory.pdf).  

Note that an *operating system* (OS) may not know in advance whether stack or heap will be used predominantly before the program is actually running. Therefore, an OS must layout these two memory regions in a way to guarantee **maximum space** for both. The point of this illustration is to show that the physical memory alone (in the size of 8-32GB these days in personal computers) definitely is not enough to hold all data required to open too many processes at once. 

{: .highlight}
For instance, a size of the PC game Assassin's Creed Valhalla is at least 77 GB. How is it possible that you can run this game while running the web browser and whatsapp at the same time if your physical memory is only 32 GB in size? 

### Utilising the Swap Space
We often open and run several processes **simultaneously**: multiple web browsers with gazzilion tabs, music player, video editor, photo editors, IDEs, video games, etc. 

When each of these processes are running, they're first **loaded** (copied) from disk onto the physical memory before they can be accessed and executed by the CPU. The total space required to contain all the information needed to run these processes at the same time is definitely more than 4-32GB. 

Hence, we need to **borrow** some free space on the Disk (*that are not used to store data*) to store the **state** of **currently-run programs**. This section is called the disk **swap space** and it serves as an extension to our physical memory. 

{: .highlight}
Of course we have to <span style="color:red; font-weight: bold;">prioritize</span>. When `N` programs are opened at the same time, we do not necessarily use them *all at once*. 

There are some processes that are ***idling*** and **not currently in-use.**  <span style="color:red; font-weight: bold;">These are the ones that are stored in the swap space</span>. They will be loaded over to the physical memory again when users resume their usage on these programs. 

{: .note-title}
> Operating System Kernel
> 
> The part of the computer system that's responsible for process management is the Operating System Kernel. We will learn more about it next term. 

### Definition
Using some empty space on our disk as an extension of the RAM motivates the idea of the **virtual memory**.

{: .new-title}
> Definition
> 
> Virtual Memory is a **memory management technique** that provides an **abstraction** of the storage resources so that:
> 1. It is **easier** for `N` processes to share the same *limited* physical storage without interfering with one another.
> 2. It allows for the **illusion** (to users) of a *very large physical memory space* without being limited by how much space that are *actually* available on the physical memory device. 

In virtual memory, we use a part of the disk as an extension to the physical memory, and let processes work in the virtual address space instead of the physical (actual) address space. This makes it possible for many processes to seemingly be loaded onto the physical memory at address `PC=0` all at once, and having the illusion that it's run simultaneously, even when their total size exceeds the physical memory capacity. 


## [Memory Paging](https://www.youtube.com/watch?v=19wS4GC6mbQ&t=730s)
An important concept to highlight before we dive into how virtual memory works is **memory paging**. 

{: .new-title}
> Paging
> 
> **Paging** is a memory management scheme that is used to store and load data from the disk (large capacity secondary storage) for use in the physical memory efficiently. 

For ease of explanation in this notes, you can assume that the word "disk" and "secondary storage" is **synonymous**. 

### Page
A **page** is a fixed-size block of data that forms   *contiguous* physical memory addresses,  as illustrated in the figure below:

<img src="https://dropbox.com/s/janbxcdijndlhc4/page.png?raw=1" class="center_fourty"   >
  
>It is very useful and efficient to transfer data in bulk as pages (instead of word by word) between the physical memory and disk due to the **locality of reference.**

A particular word in a **page** is addressable by two things: 
* A Physical Page Number (`PPN`) 
	* This identifies the entire *page*
* A Page Offset (`PO`)
	* This identifies the **word** line in a page

{: .highlight}
 `PPN + PO` makes up the full address of a word in memory.  

**The number of bits required for `PO`** depends on how many 32-bit words are there in a page (page size). 
**Example:**
 * Suppose we have 9 words of data for each page like the page size in the figure above. 
* The minimum bits required for `PO` is:
	 * $$\max(log_2(9)) = 4$$ bits if *word addressing* is used. 
	* $$\max(log_2(9)) + 2= 6$$ bits if *byte addressing* is used. 

### PPN Bits
The number of bits of `PPN` depends on how many pages there are that can fit in the physical memory (physical memory size). 

For instance, suppose we have physical memory of 20GB in size, and that the size of 1 page is 1GB. There are only 20 pages in total that can fit in the physical memory, hence minimum bits required for `PPN` is $$\max(log_2(20)) = 5$$ bits. 

{: .warning-title}
> Common Misunderstanding
> 
> It is easy to confuse between page size and block size and think that they are related. The truth is that: *page size* has nothing to do with *block size* that we learned in the previous chapter (cache). 
  

## [Virtual Memory](https://www.youtube.com/watch?v=19wS4GC6mbQ&t=1110s)
Before we begin, we need to remind ourselves that programs are **loaded** to physical memory **only when we open (run) them**, so that the CPU has *direct access to its instructions* for execution later on. The majority of your installed programs that are not opened and not run stays on disk.

A computer can run many processes at a time, and therefore **all of them have to share** the same physical memory. For *ease of execution* and *security*, the burden of process management is passed to a very special program: the OS <span style="color:red; font-weight: bold;">Kernel</span>. 

### Process Isolation
Each process does not know the existence of another process and everything else that lives in the physical memory. They don't have to keep track of which addresses in the physical is occupied or free to use, and one process wont be able to corrupt another. 

This provides a layer of **abstraction**, as the OS Kernel is the only *program* that needs to be carefully designed to perform good memory management. 

The rest of the processes in the computer can proceed **as if they're the only process running in the computer**.  

This way we can say that each process has their own *memory*, and that is the **virtual memory**. 

{: .new-title}
> Virtual Memory
> 
> **Virtual memory is a memory management technique that provides abstraction**, in the sense that it allows the system to give each process an illusion that it is running on its own memory space isolated from other processes.* 


### [Virtual Address](https://www.youtube.com/watch?v=19wS4GC6mbQ&t=1288s)

When we open a program, OS Kernel allocates **a dedicated virtual address space** for all of its instructions (and data required for execution); spanning from low address `0` up to some **fixed** high address. This program hence becomes a **process** once its begun its execution. The addresses requested by the `PC`  are actually *virtual addresses* (`VA`) instead of  *physical addresses* (PA). The same applies for `LD/ST`. The CPU frequently makes memory references through instruction fetch from `PC`, or `LD` and `ST` related instructions. 

#### Physical Address and MMU
**Physical address (PA)** are **actual** addresses of each (32 bit) word in the physical memory. Each `VA` has to be mapped to a `PA`, so that upon instruction fetch, or `LD`, the Memory may return the requested data to the CPU. Similarly, upon `ST` related instructions the CPU should also be able to store the data into the correct `PA`. This mapping between `VA` to `PA` is done via the **memory management unit** (MMU). 

<img src="https://dropbox.com/s/s5mgxqim69a98o6/cpummu.png?raw=1" class="center_fifty"  >

{: .new-title}
> The MMU 
> 
> An MMU is a **hardware** unit that sits on the CPU board, along with the CPU itself and the cache. It consists of a **context** register, a **segment** map and a **page** map. Virtual addresses from the CPU are translated into intermediate addresses by the segment map, which in turn are translated into physical addresses by the page map. Its primary function is to process all *memory references* request from the CPU (`ST`/`LD`) and translate  `VA` into `PA`. 

#### How VA Works
Systems that support Virtual Addressing allow for each process to have the ***same* set of `VA`,** e.g: its `PC` can always start from 0, but in reality they are **physically** separated from one another. 

The figure below illustrates this scenario:

<img src="https://dropbox.com/s/1h5q5heph7vp3yy/detailVM.png?raw=1" class="center_seventy"  >

In the example above, there are two currently running processes: process `1` and process `2`, each running in its own VM. The actual contents of the virtual memory can **either** be in the  physical memory **or** at the disk swap space. 

The processes themselves **are not aware** that their actual memory space are not contiguous and **spans over two or more different hardware**. The virtual addresses however, are contiguous. 

{: .highlight}
It is worth reminding that only contents that reside on the physical memory has a physical address (PA).

Contents that are stored on the disk swap space does **not** have a `PA`. If they are needed for access by the CPU, the OS Kernel needs to migrate them over to the Physical Memory/RAM first, so that they have a corresponding `VA`-`PA` translation and are **accessible** by the CPU.

  
### [Pagetable](https://www.youtube.com/watch?v=19wS4GC6mbQ&t=1715s)
The OS Kernel maintains a **Pagetable** (sometimes it is called **pagemap** too) that keeps track of the translation between each `VA` of each **process** to its corresponding `PA`. It stores mapping of the higher $$v$$ bits of virtual address (called the **`VPN`** - Virtual Page Number) to a corresponding **`PPN`** (physical page number). 

{: .new-title}
> Pagetable
> 
> The *Pagetable* contains **all possible combination of virtual address of a process**, but not all `VA` has corresponding `PA` at a time in the RAM (it may be in the disk).

The MMU utilizes the Pagetable to **translate** every memory reference requests from the CPU to an actual, physical address as illustrated below:

<img src="{{ site.baseurl }}/assets/contentimage/mmu-cache.png"  class="center_seventy"/>

#### Details
The number of entries in the *Pagetable* is $$2^v$$, because **exactly one entry** is needed *for every possible virtual page*. 

The PO field of `VA` is **the same** as the PO field of its `PA`. If you always have `00` at the back of PO it simply means  BYTE ADDRESSING is used, but the number of bits of PO **includes** the last two bits. The figure above is just for **illustration purposes** only.

The MMU is a piece of hardware located on the CPU board that helps to perform these operations upon CPU memory reference requests: 
1. Extract `VPN` out of `VA`, 
2. Find the corresponding entry in the *Pagetable* 
3. Extract the `PPN` (if any)
4. Perform necessary tasks (**page-fault** handling) if the entry is *not resident* 
5. If `PPN` found, append PO with `PPN` to form a complete `PA` 
6. Pass `PA` to other relevant units so CPU request can be completed  

#### Pagetable Helper Bits
There are three other columns, `D`, `R`, and `LRU` (if `LRU` is the chosen replacement policy) in the Pagetable that contains helper bits, analogous to the ones we learned in cache before.

#### Resident Bit
The Resident Bit `R` signifies two cases:
* if `R==1`, then the requested *content* is in the physical memory -- `PPN` in the pagetable can be returned immediately for further processing to result in a complete `PA`. 
> Note: "content" here refers to `Mem[PA]`, that is the content of the Physical Memory at address `PA`. 
* if `R==0`, then the requested *content* is not in the physical memory, but in the swap space of the disk.  **page-fault** exception occur and it has to be handled. 

#### Dirty Bit
The Dirty Bit `D==1`, then the content of the memory with address `PA` cannot simply be overwritten. `Mem[PA]` has to be stored on disk swap space before it's overwritten by new data. 

#### LRU Bit
This bit is present only if replacement policy used is LRU. Just like in cache, it indicates the LRU ordering of the *pages* **resident** in the physical memory. 

This information is used to decide which page in the physical memory can be replaced in the event that the RAM is full and the CPU asks for a `VA` which actual *content* is not resident.  

The number of LRU bits needed **per entry** in the pagetable is $$v$$ (#VPN) bits, since the number of entries in the pagetable is $$2^v$$. We assume a vanilla, naive LRU implementation here, although in practice various optimisation may be done. The LRU bits simply behaves as a **pointer** to the row *containing* the LRU PPN, therefore we need at least $$v$$ bits and not #$$PPN$$ bits. 

#### [Pagetable Arithmetic](https://www.youtube.com/watch?v=19wS4GC6mbQ&t=1990s)

{: .warning}
This section is difficult and requires patience and practice to excel. Take it easy.

Suppose our system conforms to **byte addressing** convention. Given a `VA` of `(v+p)` bits and a `PA` of `(m+p)` bits, we can deduce the following information (assume byte addressing):
*  The size of VM is: $$2^{v+p}$$ bytes 
*  The actual size of the physical memory is: $$2^{m+p}$$ bytes
*  The Pagetable must store $$(2 + m) \times 2^v$$ bits *plus* however many helper bits depending on the replacement policy, because:
	* There are $$2^v$$ rows, 
	* Each row stores `m` bits of `PPN`
	* Each row also has a few helper bits:  `2` bits for `D` and `R`, *and* `v`* bits for `LRU` ordering (if LRU is used)
    	* Note that actual implementation might vary, e.g: LRU might be implemented in a separate unit 
	* The $$v$$ VPN bits are *not exactly stored* as entries in the pagetable, but used as indexing (addressing, eg: using a **decoder** to select exactly one pagetable row using $$v$$ bits as the selector to the decoder)
*  There are $$2^{p}$$ bytes per page.

{: .note}
The $$v$$ bits is often drawn as the first column of the Pagetable. This is just to make illustration *easier*, but they're actually used for **indexing** only as explained in the paragraph above. 

  

#### [Pagetable Location](https://www.youtube.com/watch?v=19wS4GC6mbQ&t=2145s)

The Pagetable is **stored in the Physical Memory** for practical reasons because of its rather large size. It is **expensive** to store it in SRAM-based memory device. 

{: .note}
Given a `VA` of size `(v+p)` bits, the pagetable must store $$(2 + m) \times 2^v$$ bits at least, plus whatever helper bits required, depends on the policy. 


The OS Kernel manages this pagetable portion in the physical memory. The MMU device has a component called the `Pagetable Pointer`, and it can be set to point to the **first** entry of the pagetable in the physical memory (see the figure in the next section for illustration).

##### Issue
There is one problem with storing the Pagetable in the physical memory. 

It causes us to access the (slow) physical memory **twice**:
1.  Look up Pagetable to translate the `VA` to PA
2.  Access the Physical Memory again to get the content `Mem[PA]`. 

Therefore this cheap solution to utilize a portion of the Physical Memory to store the Pagetable comes at the cost of reduced performance. If we were implement the entire Pagetable using SRAM, it is going to be too expensive (in terms of monetary cost).

{: .important-title}
> Solution
> 
> The solution to this issue to build a small SRAM-based memory device to **cache** a few of the **most recently used** entries of the Pagetable. This cache device is called the **Translation Lookaside Buffer** (TLB).

  

### [TLB: Translation Lookaside Buffer](https://www.youtube.com/watch?v=19wS4GC6mbQ&t=2350s)

The TLB is a small, FA-based design cache to store a copy some recently used Pagetable entries, as shown in the figure below:

<img src="https://dropbox.com/s/g0ydenuirecwtwo/mmutlb.png?raw=1"  class="center_seventy" >

{: .new-title}
> Caching the Pagetable
> 
> We also use a hierarchy of memory devices here, just like what we learned in the previous chapter where we *cache* a few of the most recently used contents and its address: `A, Mem[A]` in another faster (but smaller) SRAM-based memory device to reduce the frequency of access to the slower (but larger) DRAM-based Physical Memory device. 

#### [Super Locality of Reference with TLB](https://www.youtube.com/watch?v=19wS4GC6mbQ&t=2400s)

We know that there exist a locality of reference in memory address reference patterns, which is why the concept of memory hierarchy (using cache, RAM, and portion of the disk as swap space) is effective. Due to this, there exist a **super locality** of **page** number reference patterns (hit-rate of the TLB $$99\%$$ in practice).  

Also, note that the LRU bits in the TLB <span style="color:red; font-weight: bold;">is not the same</span> as the LRU bits in the Pagetable. The reason is that the number of `N` entries in the TLB is always the `N` most recently accessed pages *out of* $$2^{v}$$ possible entries in the pagetable, where `N` < $$2^v$$ in practice. 


## [Demand Paging](https://www.youtube.com/watch?v=19wS4GC6mbQ&t=2495s)

{: .new-title}
> Definition
> 
> Demand paging is a **method** of virtual memory **management**. 

The OS Kernel is responsible for the implementation of demand paging, and it may vary from system to system. However, the main idea of demand paging is that data is not copied from the swap space to the physical memory **until they are needed** by the CPU. 

For now, let's ignore the presence of *data cache* and TLB for the sake of simplicity in explanation. We will add it back to the picture later on. 

When a computer is turned off, every bits of information is stored in its non-volatile memory storage (disk, NAND flash, etc). The physical memory is incapable of storing any information when it does not receive any power source.  The OS Kernel is one of the first programs that is loaded onto the physical memory when our computer is started up.  It maintains an **organised** array of pages on disk. 

{: .note}
Do not trouble yourself at this point at figuring out how *bootstrap* works, i.e: how to load the OS Kernel from the secondary storage to the physical memory. We will learn more about this next term.  

The moment a request to execute a program is made,  the OS Kernel:
1. **Allocates** and **prepares** the virtual memory space for this program on the disk's swap space, 
	* Only a small subset, essentially the program's entry points (elf table, main function, initial stack) is put onto the physical memory, and everything **else** is loaded **later**.
2. And the OS Kernel **copies** contents required for execution over to this designated **swap** space from the **storage** part of the disk.
	* This includes all *instructions* necessary for this program to run, its *stack space*, *heap space*, etc are nicely prepared by the OS Kernel before the program **begins** execution. 

Therefore, almost all of its `VA` initially corresponds to some location on the disk's swap space. As the process runs longer, more and more of its content (data/other instructions) are stored on RAM. 


{: .note-title}
> Summary
> 
> Let's summarise how demand paging works in a nutshell: 
> *  ***At first*** (when the process has just been opened), majority of its content is placed on the swap space of the disk and only its entry point is loaded to the RAM to be executed by the CPU. 
> *  Subsequent pages belonging to that process will only be brought up to physical memory if the process instruction asks for it.


### [Page-Fault Exception](https://www.youtube.com/watch?v=19wS4GC6mbQ&t=2852s)
Upon execution of the first few lines of instruction of the process's entry point, the CPU will request to refer to some `VA`, and it will result in **page-fault** exception because almost all of its virtual addresses are <span style="color:red; font-weight: bold;">not</span> resident in the physical memory yet at this point. 

The OS Kernel will then handle this "missing" page and start copying them over to the physical memory from the swap space, hence turning these pages to be **resident**, which means that it has a `PPN` assigned to it. The kernel then updates the corresponding entry of the Pagetable and the TLB.

{: .highlight}
Many page faults will occur as the process begins its execution **until most of the working set of pages are in physical memory** (not the entire process, as some processes can be way larger than the actual size of your physical memory, e.g: your video games. 

In other words, the OS  Kernel bring only necessary pages that are going to be executed onto the physical memory as the process runs, abd thus the name **demand paging** for this technique.

### [Replacing Resident Pages](https://www.youtube.com/watch?v=19wS4GC6mbQ&t=2978s)

This process (of fetching new pages from swap space to the physical memory) eventually fills up the physical memory to the point that we need to replace **stale** ones. 

If a non-resident `VA` is enquired and the physical memory is **full**, the OS Kernel needs to *remove* some pages  (LRU/FIFO, depends on the replacement policy)  that are currently resident to make space for this newly requested page. 

If these to-be-removed pages are **dirty** (its copy in the disk swap space is not the same as that in the RAM), a **write** onto the disk swap space is required before they're being overwritten. The kernel maintains a **data structure** that keeps track of the status of each resident page in the physical memory. This data structure is often referred to as the "page frame database" or "page table". It contains information such as the VPN, PPN, and the access status (clean or dirty) of each page. 

When a page is marked as dirty, it indicates that its contents have been modified in the RAM and differ from the contents in the swap space. In such cases, before the dirty page can be replaced, the kernel writes the updated contents back to the swap space to ensure data consistency. Once the dirty page has been written back to the swap space, the kernel can then safely replace it with the newly requested page in the physical memory. This process of replacing resident pages helps maintain an efficient utilization of the available memory and ensures that only the most relevant and frequently accessed pages are kept in the physical memory, while the less frequently accessed pages are stored in the swap space.


### Process Termination
Finally when the process terminates, the OS Kernel frees up all the space initially allocated for this process's VM (both on physical memory and disk swap space). 

### Mapping VA to Swap Space
{: .important}
This section is out of syllabus, and written just to complete your knowledge.

The Pagetable holds more information than just VPN to PPN translation, but also some information about where that VPN is saved in the swap space (if any). This section is also called the *swap table* (depending on OS).  Recall that **Page Table Entry** is not removed when the corresponding page is swapped out of memory onto the swap space. The page table **must always** have `2^VPN` entries. (each VPN corresponds to an entry). There exist a **reference** to the **swap block** (a region containing the swapped out page on disk) for non-resident VPN which page exists only in the swap space. The actual implementation of the "pointer" that can directly access the disk swap space is **hardware dependent**.

The **size** of the swap space depends on the OS setting. In Linux OS, the size of the swap space is set to be **double** of the RAM space by default. You can read [this site](https://www.kernel.org/doc/gorman/html/understand/understand014.html) to learn more about swap space management in Linux. 

> Sometimes you might have this misunderstanding that Virtual Address is *equal to* "swap space address". In reality, the relationship between virtual pages and swap space is managed through a series of mappings and tables (such as page tables, swap tables, and others) that track whether a page is in physical memory, on disk, or not currently allocated. The mapping also handles the translation between virtual addresses and physical addresses or swap space locations. These details are essential for understanding the full complexity of virtual memory systems, but are abstracted in 50.002.


### [An example](https://www.youtube.com/watch?v=19wS4GC6mbQ&t=3106s)
<img src="https://dropbox.com/s/r8nia46u4gdw6gk/vmexample.png?raw=1" class="center_fifty"  >

The figure above shows a **snapshot** of the physical memory state at some point in time. There exist a pagetable with 16 entries and 8 pages of data labeled as `A` to `H` in the physical memory. LRU replacement policy with write back policy is used. **Lower** LRU means that the data is **more recently used.** Each *page* contains exactly 256 *bytes* of data. 

The above information gives us five **clues**:
* `VPN` is `4` bits long 
* `PPN` is at least `3` bits long
* `PO` is `8` bits long
* `VA` is `8+4 = 12` bits long 
* `PA` is `3+8 = 11` bits long

We can assume that *instructions* are located at a separated physical memory (like our Beta), so we can spare ourselves the headache of resolving virtual to physical memory addresses on both instruction loading and data loading (`LD` and `ST` operations). 

{: .note-title}
> Assumption
> 
> We assume *for the sake of this exercise only* that we are looking at the portion of the RAM, Pagetable, and TLB that stores data only and *NOT* instruction. Please read the questions carefully in quizzes or exams/tests. 

#### Example 1
Now suppose the current instruction pointed by the PC is **`LD(R31, 0x2C8, R0)`**. This means a memory reference to address `0x2C8` is required. 

We know that `0x2C8` is *a virtual address* (because now our CPU operates in the `VA` space), and hence we need to obtain its physical address. Segmenting the `VA` into `VPN` and `PO`: 
* `VPN: 0x2` (higher 4 bits)
* `PO: 0xC8` (lower 8 bits)

Looking at the pagetable, we see that `VPN: 0x2` is **resident**, and can be translated into `PPN: 100`. The translated physical address is therefore `100 1100 1000`. In hex, this is `0x4C8`. The content that we are looking for exists within page `E`. 

#### Example 2
Suppose the next instruction is **`ST(R31, 0x600, R0)`.** This means a memory reference to address `0x600` is required.

We can segment the `VA` into:
* `VPN: 0x6` (higher 4 bits)
* `PO: 0x00` (lower 8 bits)

From the pagetable, we see that `VPN: 0x6` is **not resident.** Even though `PPN: 5` is written at the row `VPN: 6`, we can <span style="color:red; font-weight: bold;">ignore</span> this value as the resident bit is `0`. 

This memory reference request will result in  **page fault**. 
* The OS Kernel will handle this exception, and 
* Bring the requested page (lets label it as  page `I`) into the RAM.

Now suppose the RAM is currently full. We need to figure out which page can be replaced.
* Since LRU policy is used, we need to find the *least recently used page* with the biggest `LRU` index
* This points to the last entry where `PPN:3`  (containing page `D`) and `LRU:7`. 

However, we cannot immediately *overwrite* page `D` since its <span style="color:red; font-weight: bold;">dirty</span> bit is activated. A **write** (from the physical memory to the swap space of page `D`) must be performed first before page `D` is replaced with the new page `I`. 

After page `D` write to its corresponding location in swap space is done, the OS Kernel can copy page `I` over from the swap space to the physical memory, and **update the pagetable:**
* `VPN:F` dirty bit is cleared, and resident bit is set to `0`.
* `VPN:6` is updated, as now it is mapped to `PPN:3`. Its resident bit is set to `1`. 
* After *write* (`ST`), its dirty bit is also set to `1`. 
* All entries' LRU bits must be updated accordingly. 

The state of the physical memory after **both** instructions are executed in sequence is as shown. The new changes are illustrated in blue:

{: .note}
`I'` is just a symbol of an updated page `I` after a `ST` instruction is completed

<img src="https://dropbox.com/s/mis63e6z0nm0n3b/vmexample-after.png?raw=1" class="center_seventy"  >


{: .new-title}
> Think!
> 
> Enhance your understanding by adding TLB into the picture. If a TLB of size 2 (stores the 2 most recently used mapping) is used, what will its state be in the beginning? After **`LD(R31, 0x2C8, R0)`** is executed? Then after **`ST(R31, 0x600, R0)`** is executed next?  


## [Context Switching](https://www.youtube.com/watch?v=19wS4GC6mbQ&t=3411s)
A single core CPU is capable of giving the illusion that it is running **many** processes at the same time. 

What actually happens is that the CPU **switches** the execution of each process from time to time. It is done so rapidly that it seems like all processes are all running at once as if we have more than one CPU. **This technique is called rapid context switching.**  

{: .highlight}
This is analogous to how animated videos tricks the eye: each frame is played only for a fraction of a second such that the entire video appears "continuous" to us. 


{: .new-title}
> Context Switching
> 
> **Context switching** refers to the procedure that a CPU must follow when changing the execution of one process with another. This is done to ensure that the process can be *restored* and its execution can be *resumed* again at a later point. A proper hardware support that enables rapid context switching **is crucial** as it enables users to multitask when using the machine. We learn about this in more depth next term.

### Processes in Isolation
Each process that are running in our computers have the following properties: 
* Each has its own virtual memory (its like giving the illusion that each process has independent physical memory unit all for itself)
* Therefore every process can be written as if it has access to all memory, **without** considering where other processes reside. 

For example, the `VA` of each process can start from `0x00000000` onwards but it actually points to different physical addresses on disk.

### Context Number
To distinguish between one process's `VA` address space with another, the OS Kernel assigns a unique identifier `C` called **context number** *for each program*. 

{: .note}
The word **context** refers to  **a set of mapping** of `VA` to `PA`.

The context number can be appended to the requested `VPN` to find its correct `PPN` mapping: 
* A **register** can be used (added to the MMU hardware) to hold the current context number `C`. 
* The TLB `TAG` field contains both `C` and `VPN`. 
* In the case of `MISS`, the Pagetable Pointer is updated to point to the *beginning* of the pagetable section for context `C`, and the index based on `VPN` finds the corresponding entry.  


<img src="https://dropbox.com/s/ckevn475pf7ar4s/mmuusagecontext.png?raw=1" class="center_seventy"  >

With context numbering, we do not have to **flush** (reset) the TLB whenever the CPU changes context, that is when switching the execution of one process with another. It only needs to **update** the pagetable pointer so that it points to the start of the pagetable section for this new context. 

{: .highlight}
**Recall**: Pagetable Pointer is a piece of hardware (implemented using DFFs or equivalent) that is part of the MMU. It gives the MMU access to the **pagetable** to perform `VA` to `PA` translation.

  

## [Using Cache with Virtual Memory](https://www.youtube.com/watch?v=19wS4GC6mbQ&t=3696s)

We know that a cache is used to store copies of memory addresses and its content: `A, Mem[A]`, so that CPU access to the physical memory can be reduced on average. There are two possible options on where to assemble the cache hardware, **before** or **after** the MMU, each having its pros and cons. 

<img src="https://dropbox.com/s/j7l3t20a9cmt2ez/cacheMMU.png?raw=1"  class="center_fifty" >

{: .note}
If a cache is placed **before** the MMU, then the cache stores `VA` (instead of PA) in its `TAG` field. Otherwise, it will store `PA` instead of `VA`. 

However, both `VA` and `PA` share the **same** Page Offset `PO`. If a cache line selection is based on `PO`, then two computations can happen in parallel:
1. `VPN` to `PPN` translation and, 
2. Finding the correct cache line in DM / NWSA cache 

 
We can leverage on this fact by creating a **hybrid** arrangement: 
 <img src="https://dropbox.com/s/mdgucv6qubun01l/cachemmu2.png?raw=1"   class="center_fifty">

Each cache line in the DW/NWSA used in the design above stores:
1. The data word  (**(not pages)**) in its `Content` field and 
2. The **physical** address in the `TAG` field.

The **index** of the tag in the cache is set to be the `PO` of the `VA` due to <span style="color:red; font-weight: bold;">locality of reference</span>. If higher order bit is used to index the cache lines then we will end up with cache **contention**.  

{: .new-title}
> Think!
> 
> Why is it not practical if we use the higher order bits to index the cache line? 

### Further Analysis

What happens if the a requested page is `Resident` but results a cache `MISS`?
<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
The cache **must** be updated by fetching the new data from the Physical Memory. 
</p></div><br>


What happens a requested page is `Not Resident`? 
<div cursor="pointer" class="collapsible">Show Answer</div><div class="content_answer"><p>
Page must be fetched from the swap space and copied over to the Physical Memory. This triggers an update to the Pagetable and TLB. Afterwards, we have update the cache. 
</p></div><br>

{: .new-title}
> Practice
> 
> Ask yourself these questions to further enhance your understanding:
> * What happens if the page is `Not Resident` and if Physical Memory is full? Assume LRU policy is used. 
> * Which part of the TLB that we need to update on each memory reference request? What about the cache? Why? 
> * What should be done if TLB `MISS` happens? 
> * Is it possible* for cache `HIT` to occur but the requested page is **not resident**? Why or why not?  


## [Summary](https://www.youtube.com/watch?v=19wS4GC6mbQ&t=4180s) 
[You may want to watch the post lecture videos here. ](https://youtu.be/oe_WHpAmgqM)

As a summary, *virtual Memory* is a **memory management technique** that provides an **abstraction** of the storage resources so that programs can be written as if they have **full access** to the physical memory without having to consider where other processes reside. 

A small hardware called the **MMU** is created as part of the CPU board to support this technique. 

Since each process is running in an **isolated** manner from one another (in its own *virtual space*, unaware of the presence of other processes), the OS **Kernel** can switch execution between programs -- giving the users an *illusion* as if these processes are running **simultaneously** with just a single CPU. The procedure that allows for this to happen seamlessly is called **rapid context switching.**

{: .highlight}
Context switching allows for **timesharing** among several processes, that is to share the CPU amongst multiple process executions. 

The OS Kernel simply loads the appropriate context number and pagetable pointer when switching among processes. This way, the CPU can have access to instructions or data required to execute each process and switch executions between processes. 

In the next chapter we will learn more about how the OS Kernel is specially privileged **program** (not a process, but you may not be able to understand this statement fully now and that's okay) is responsible of managing hardware resources in a system and scheduling processes to share these limited resources, thus allowing each process  to run independently on its own ***virtual machine.*** 



  

  
