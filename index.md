---
layout: default
title: Home
nav_order: 1
description: "Full stack development starts here."
permalink: /
---

* TOC
{:toc}

# 50.002 Computation Structures
{: .no_toc}

## Hello World!
<strong>*Full stack development starts here.*</strong>

**50.002** introduces the **architecture** of digital systems, emphasising **structural** principles common to a wide range of technologies. In specific, the course develops:
* A hierarchical set of **building blocks** that make up a digital system  (logic gates, combinational and sequential circuits, finite state machines, processors, and complete systems)
* Understanding of the operation of a moderately complex digital system; a simple RISC-based computer we called the $$\beta$$ using the building blocks above, and ability to specify, implement and **debug** its components.
* Exploration of both **hardware** and **software** mechanisms through a series of design examples (labs and 1D/2DC projects)

According to the [IEEE/ACM Computer Curriculum 2008](https://www.acm.org/binaries/content/assets/education/curricula-recommendations/computerscience2008.pdf), prepared by the Joint Task Force on Computing Curricula of the IEEE (Institute of Electrical and Electronics Engineers) Computer Society and ACM (Association for Computing Machinery):

> ***The computer lies at the heart of computing**. Without it most of the computing disciplines today would be a branch of theoretical mathematics. To be a **professional** in any field of computing today, one should <span class="orange-bold">not</span> regard the computer **as just a black box** that executes programs by magic. All students of computing **should acquire some understanding** and appreciation of a computer system’s functional components, their characteristics, their performance, and their interactions.There are practical implications as well. Students need to understand computer architecture in order to structure a program so that it runs more **efficiently** on a real machine. In selecting a system to use, they should be able to understand the tradeoff among various components, such as CPU clock speed vs. memory size.*
>
> *The term **architecture** is taken to include instruction set architecture (the programmer’s abstraction of a computer), organization or microarchitecture (the internal implementation of a computer at the register and functional unit level), and system architecture (the organization of the computer at the cache and bus level). Students should also understand the **complex trade-offs** between CPU clock speed, cache size, bus organization, number of core proces- sors, and so on. Computer architecture also underpins other areas of the computing curriculum such as operating systems (input/ output, memory technology) and high-level languages (pointers, parameter passing).*

{:.note}
The IEEE/ACM Computer Curriculum is a **comprehensive educational framework** developed by the Joint Task Force on Computing Curricula, a collaboration between the IEEE Computer Society and the Association for Computing Machinery (ACM). The curriculum is widely recognized as a foundational reference for universities worldwide, ensuring consistent and high-quality education in the rapidly evolving computing field. The newer version, Computer Science Curricula 2023 (CS2023) **underscores** that a <span class="orange-bold">comprehensive</span> grasp of computer architecture is essential for students to effectively design, implement, and optimize software and hardware systems.

By the end of this course, you're expected to:
* Be familiar with flaws and limitations in simple systems using the **static discipline**, **clocked** registers and async inputs.
* Implement a simple RISC-based CPU architecture
* Apply architectural support and tackle instruction set design issues for contemporary software structures.
* Analyse of potential concurrency, precedence constraints, and performance measures.

All lesson materials: **lecture notes**, **problem sets**, and **FPGA tutorials** can be found in this site. Please refer to the **50.002 course handout** (link in edimension) to obtain the links to our lab handouts. 

We have also recorded [lecture videos](https://www.youtube.com/playlist?list=PLklpDKpv-EBj1agIq4vB1iB6ahMT8_2A_) and [post-lecture videos](https://www.youtube.com/playlist?list=PLklpDKpv-EBhCVUAZDDRWEGZzR_It-FSo) for each topic. The links to the individual videos can be found in the respective lecture notes. 

## The Blind Men and an Elephant

Computer Architecture is indeed an underrated topic of study for web developers and programmers. Understanding the low level concepts of the system on which you are implementing binary trees and hash tables and making web applications, and *how they actually run on your PC is just as important as actually implementing them.*

That being said, is often really difficult to visualise why we learn certain topics in 50.002. Each weekly topic is a **building block** to understand how **digital systems** work (a.k.a your computers). By itself, it is **not obvious** why it is an integral part to learn in your journey as a computer scientist. It's like the parable of a [**blind men and an elephant**](https://en.m.wikipedia.org/wiki/Blind_men_and_an_elephant).

> *The parable of the blind men and an elephant is a story of a group of blind men who have **never** come across an elephant before and who learn and imagine what the elephant is like by touching it. Each blind man feels a **different** part of the elephant's body, but only one part, such as the side or the tusk. They then describe the elephant based on their limited experience and their descriptions of the elephant are different from each other. In some versions, they come to suspect that the other person is dishonest and they come to blows. The moral of the parable is that humans have a tendency to claim **absolute** truth based on their **limited**, subjective experience as they ignore other people's limited, subjective experiences which may be equally true.*

We ask you to be patient and **bear with us** as you go through this Term. Lots of **frustration**, **confusion**, and even **exasperation** is common but not unmanaged. Talk to your TAs and Instructors for guidance at any moment in time, and **try to avoid snowballing** of work as much as possible. 



## Job Prospects
Before you read this section, see our [roadmap](https://natalieagus.github.io/50002/notes/roadmap) first.

From that you can obtain the bird's eyeview of 50.002. Then let's briefly go through possible job prospects that you can have should you equip yourselves with the knowledge of **how computers work**.
> *Yes, there are more Computer Science related jobs out there than web developers*.

### System Security Engineer
If you're planning to take [50.044](https://istd.sutd.edu.sg/undergraduate/courses/50044-system-security) in the future and work in system security related field, pay great attention to 50.002. As a system security expert, you're expected to protect the security of users, individual computer systems, including personal computers, smart cards and embedded platforms. You **need** to know how digital systems are made and work down to the hardware level before even beginning to protect it. 

### Hardware and Embedded System Engineer, CPU and Platform Architect 
Every year, major tech companies always release their new, cutting edge technologies, be it new CPU architecture, better and faster motherboard, etc. Terms like **unified memory**, **z-nm transistors**, basic CPU specs like **L-cache, overclocking, TDP rating, clock speed** should sound really familiar to you. Would you like to be the ones who contribute in their development? 

### System on Chip Engineer
System on Chip (SOC) is the integration of functions necessary to implement an electronic system onto a single substrate and contains at least one processor. It is a **popular** field as of today (2023) due to its unprecendented efficiency. Have you ever wondered why? 

### Cybersecurity Expert
Any career in cybersecurity requires a deep technical knowledge on how digital systems (that you're protecting) work. Obviously, you can't professionally protect a house without knowing its schematic, materials, weak points, etc. 

### Operating System Engineer 
Building the next-generation Operating System? Surely you need to be familiar with the architecture of the CPU you're building it for. 

### Tech Lead, DevOps Engineer
Any good fullstack software engineer needs to have a pretty good idea about the Operating System, Network, and Security. In order to appreciate the knowledge in these domains, it is fundamental to understand basic principles of how our computers work, all the way down to its ISA. You'll never know when you'll be faced with some very weird bugs that requires systematic debugging, or needing to fix major vulnerability in your system. 

### Contributing to Open Source Project
Thinking of contributing to improve the Linux Kernel? Or writing the next-generation debugger? Contributing by making merge requests to fix open issues in famous backend/frontend framework? How about making an efficient front-end framework by yourself? Maybe you'll also want to create your own game engine, or simply answer questions in StackOverflow. Yep, think big.  

### Other Fields and Application
Other non-directly related fields that require you to work with **hardware and software optimisation**, deep diving into **assembly code** or making a tweak or two to your compiler requires the basic building blocks taught in 50.002. Knowing how digital systems work really equip you with all of the necessary knowledge to **troubleshoot** and **debug** almost anything.

