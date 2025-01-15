---
layout: default
permalink: /fpga/project-sample
title: 50.002 Project Sample
parent: 1D&2D Project (FPGA)
nav_order:  1
---

* TOC
{:toc}


# 50.002 Project Sample
{: .no_toc}

{:.note}
This project involves implementing an **FSM** and **datapath** for a specific game using LEDs as output and buttons as inputs. It is a **fixed** machine. Note that you can also implement an ISA to design a **programmable** machine for your project. 


## Introduction

**Recall** that a **datapath** is the hardware component of a digital system responsible for performing operations on data, including *arithmetic*, *logic*, *storage*, and data **movement**. It works alongside the control unit (implemented as an **FSM**) to execute tasks.

If the control unit is implemented as a traditional FSM, it means the machine is fixed-purpose, as the FSM is **hardcoded** to transition between a finite set of predefined states for specific operations. <span class="orange-bold">This alone is sufficient for your project</span>.

{:.highlight}
In contrast, a **programmable** machine has a control unit that can interpret and execute instructions from **memory**. You can folow Lab 4: Beta if you're interested to implement an ISA for your project. 

For this project, you are required to implement the **datapath** and **FSM** in an FPGA, with buttons/switches and LEDs connected as input and output interfaces. The buttons/switches will serve as **control inputs** for the players' **actions**, while the LEDs will **visually** represent the current game state (score, player lives, time left, status indicators, etc). 

Your prototype must be housed in a suitable **enclosure** to ensure it functions as a <span class="orange-bold">complete</span> and <span class="orange-bold">user-ready</span> **electronic hardware game**. This game will be showcased during **ISTD Exhibition Day**, allowing attendees to play it.

{:.important-title}
> Reference only
> 
> This handout provides a sample game idea, along with its FSM and datapath, intended for **reference** purposes only.

## The Game: Score Snatchers

**Game procedure:**
* **Two players** compete in a 30-second game where they monitor a **counter** that increases at a random, varying rate. 
* Each player can "collect" the current counter value, **resetting** it to zero and earning the points displayed. 
* Players can only collect **three** times during the game. 
* The player with the highest total score at the end wins. 
* If both players have the same score, it's a draw.
