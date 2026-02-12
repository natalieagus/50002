---
layout: default
title: 50.002 1D Project 
permalink: /project/1d/intro
has_children: true
parent: 1D&2D Project (Details)
nav_order: 1
---

* TOC
{:toc}

# 50.002 1D Project
{: .no_toc}

**Duration: Week 1-12**

## Background

**ALUnatics Industries,** an emerging tech company, has been working on a new 32-bit ALU called SIGMA-32. They've finished the design, but they haven't built a working version yet. The main reason is the cost: *building a prototype is expensive, and they've been looking for investors to help fund it.*

**Sand Saltman, the CEO of YouTwitFace**, finds out about SIGMA-32. He's always interested in new tech and thinks SIGMA-32 could be something **special**. However, before he decides to invest, he wants to see a working prototype. He thinks it would be great to have an electronic game using SIGMA-32 at YouTwitFace's headquarters for VIP guests. 

This is a big opportunity for ALUnatics Industries, but it also means they have more challenges ahead. They need to figure out how to build an  interesting electronic hardware prototype that showcase the strength of SIGMA-32 in a meaningful way. Their team of **engineers** consisted of **50.002 students** proceeded to draft a plan to create a working electronic game prototype that demonstrates the capabilities of the ALU. 

{:.highlight}
The game could be educational, targeting skills in logic, math, or motor functions, or it could be a casual game, drawing inspiration from classic games.

They have approximately a couple of months before they bring their prototype for trial at YouTwitFace HQ, and potentially seal a deal that would change the course of their company's future.


## The Task

{:.highlight}
> **Design and build a prototype of an electronic game using SIGMA-32**: a 32-bit ALU implemented using Alchitry Au FPGA.
> 
> The primary focus here is on the **technical execution**: the game must not only **function seamlessly** but also **effectively showcase** the ALU's potential.


The 1D project is separated into 5 checkoffs. Click each section to view the rubrics and details for each checkoff:

- [Checkoff 1: ALU, 3% (Week 9)]({{ site.baseurl }}/project/1d/checkoff-1)
- [Checkoff 2: Datapath, 5% (Week 10)]({{ site.baseurl }}/project/1d/checkoff-2)
- [Checkoff 3: Live Demo and Exhibition, 12% (Week 13)]({{ site.baseurl }}/project/1d/checkoff-3) 
- [Checkoff 4: Writeup, Poster & Video, 2% (Week 13)]({{ site.baseurl }}/project/1d/checkoff-4)
- [Checkoff 5: Peer Review, 8% (Week 13, via **TEAMMATES**)]({{ site.baseurl }}/project/1d/checkoff-5)

## Constraints

{:.important-title}
> Non-negotiable Project Constraints
> 
> You can only use the **Alchitry Au FPGA** and you only can have **ONE 32-bit ALU** in your prototype. 
>
> You also **MUST** utilise your 32-bit ALU to perform **at least 1 arithmetic operation** in your **prototype**. Finally, you **must** have a **working** prototype to **some extent**, however minor that is. **Failure to comply will result in instant 0% of EHP project grade regardless of the final prototype state**.

To be exact, no other **general purpose microcontrollers**: **any programmable / versatile IC** 

**This means: No Arduino, ESP, Raspberry Pi, PIC , or equivalent microcontrollers that have *complex* microprocessors or capability to decode pre-programmed animations (or sound)**.

### Usage of Selected Serial to Parallel Interface

You CAN use a selected **serial** to **parallel** **interface** to make your life easier, such as **74HC595**, **HUB75**, or *equivalent*. You **can also use** MAX7219 but with its decode functionality disabled. When in doubt, send your inquiries to our instructors.

However, you **NEED** to write your own drivers to interface with these parallel or serial interfaces. We have some custom drivers written in LucidV2 under [this resource tab (look at the side bar)]({{ site.baseurl }}/fpga/lucid-v2/intro).

You are **strongly encouraged** to use **basic** LEDs / LED strips / LED matrix as your **output**, and simple buttons or switches as your **input**. It is your choice to use more complex I/O devices: keyboard, mouse, VGA output, USB output, *but you are on your own (find your own resources, etc)*

Remember, you **cannot use any pre-programmed general purpose microcontrollers** to perform read / write to these devices. There will be **NO BONUS GRADES** even if you use these complex I/O devices.

## Cost & Project Budget

Each team is allocated a **budget of SGD 80** for any additional component they might require, for instance: 

- I/O units: RGB LEDs, Arcade Buttons, LED matrices or strips
- **Soldering Iron**

The person-in-charge in each group will receive the cash, and you’re FREE to utilise the budget for the project. There's no need to keep track of receipt etc.

**For inquiries:**

- Technical or login access matters on Lab Computers: [help-it@sutd.edu.sg](mailto:help-it@sutd.edu.sg)
- Finance, student claims and reimbursements: [studentpayable@sutd.edu.sg](mailto:studentpayable@sutd.edu.sg)
- 1D-Kit (FPGA) related issues: [sarah_fonseka@sutd.edu.sg](mailto:sarah_fonseka@sutd.edu.sg)


{:.note}
The cost of your electronic game shall **NOT** exceed **SGD 80,** if it does, a **1% grade penalty is imposed**. Any equipment borrowed (e.g: spare buttons you have from your previous project) is allowable on a case-by-case basis. Please check with the instructors during Checkoffs. 

## Past Year Samples

You may view past year samples here **(please use WiFi for this, poster quality is not optimised for mobile view)**: 

- [**2025**](https://natalieagus.net/2025/term4-design-exhibition/)
- [**2024**](https://natalieagus.net/2024/term4-design-exhibition/)
- [**2023**](https://natalieagus.net/2023/term4-design-exhibition/)
- [**2022**](https://natalieagus.net/2022/term4-design-exhibition/)

## FPGA Guide (Installation and Programming)

You will need Xilinx Vivado Toolkit to program the FPGA. You can find useful guide in our [course website](https://natalieagus.github.io/50002/fpga/installation). We will also guide you on FPGA programming during regular lab sessions. 

## Summary

For both 1D and 2D projects, you are to:

1. **Implement** 32-bit ALU design on Alchitry Au FPGA
2. **Test the functionality** of the 32-bit ALU
3. **Design an electronic game** that utilizes the 32-bit ALU 
4. Build a **hardware** **prototype** of the game
5. Showcase your prototype on Week 13 
6. Write a **report** (group) on the Google Doc Given 

Submission links on eDimension will only be available from Week 3 Friday 12 PM onwards, since we need to manually key in your 1D groupings to create the links. Refer to **class calendar in course handout** for actual due dates.






