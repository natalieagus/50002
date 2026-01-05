---
layout: default
title: Checkoff 2 (Datapath)
permalink: /project/checkoff-2
parent: 50.002 1D Project
grand_parent: 1D&2D Project (Details)  
nav_order: 2
---

# Checkoff 2: Datapath (5%)
{: .no_toc}

In this checkoff, you are to submit your draft of electronic game design.

## Task

Download and fill up this [pre-checkoff 2 template document](https://docs.google.com/document/d/1MRvjhEAcC_AYG3d2mh4CRTveKwmYL-SDq0kEX77kktI/edit?usp=sharing), then submit it to eDimension. It **does not have to be final**, but it shouldn’t grossly deviate from what you will present in the actual checkoff day.  

{:.important}
**Late submission warrants 1% grade penalty**. Check out the due date on eDimension. 

Consult the [rubric](#rubric) for more details.

## How to start

{:.note-title}
> Instructor's Sample
> 
> You are strongly recommended to see Instructor sample game datapath and FSM [here](/project/1d/project-sample) before beginning this task. This instructor sample warrants 100% of Checkoff 2 marks.


## Submission

**Submit the following documents at eDimension Week 9 tab:**
- Submit p[re-checkoff 2 document](https://docs.google.com/document/d/1MRvjhEAcC_AYG3d2mh4CRTveKwmYL-SDq0kEX77kktI/edit?usp=sharing) to facilitate the checkoff
- Due date and details in the course handout

## Checkoff Procedure

 
{:.highlight}
Find the timeslot for your group's checkoff in the course handout.

During the checkoff:
- You’re given 10-15 minutes per group
- **All group members must be present** unless you have valid LOA


We expect to find the draft or relevant info about your game idea, UI & UX, electronic game design datapath and FSM in the **pre-checkoff document**. We will give it a read *BEFORE the checkoff* and it will be aiding your checkoff. 
* We won’t read any other info elsewhere, not even your Google Doc Report for this checkoff
* No slides needed.

We will give feedback at the end of the session, and after confirmation, you might want to migrate the refined information from the pre-checkoff document to your Google Doc Report for final report submission later on.


Missing your slot will result in **zero marks**, we will not provide a make-up slot.



## Rubric

| Criteria | Weight | Not Present | Novice (20%) | Beginner (40%) | Intermediate (60%) | Proficient (80%) | Expert (100%) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Electronic Design Datapath | 40%  | Diagram not present  | No structural design and not modular. No usage of ALU in the functionality | Able to show the rough design of the circuit and utilise the ALU, but datapath is not modular (e.g: ALU is used directly by FSM and treated as a substitute for arithmetic operation) | Datapath is modular: control signals are used to activate parts of the circuit, put a lot of thoughts in utilising the ALU for >80% arithmetic operations | Intermediate **and** there exist usage of addressable REGFILES, clear path for reset and loading of data from user input. | Proficient **and** able to show clear datapath to produce output signals to the interface. For instance: have a clear idea which `dff` (in the REGFILE) or `bram` used to which value /  signals.  |
| User Interface | 10%  | Description not present | User interface is only verbally explained with no diagram provided, no sense of “how big” or “how small” the prototype is | User interface is functional, but with difficult access to input or output, e.g: it has a big 30x30cm enclosure but uses a small 4-digit 7 segment as main display | User interface is functional and suits the game design | Intermediate **and** there exist some thoughts of removing impediments (restart button present, buttons are big enough) | Elegant design of the user interface, e.g: simple input and output, very straightforward or suits the game design: **consistent**, visibility without clutter |
| Game Idea | 20% | No game idea selected | Only have a rough idea on the game with **no** detailed rules (player number unknown, winning condition unknown, game progression unknown) | Able to discuss one game idea  **but** one of these crucial rule is missing: winning condition, game procedure, number of interactive inputs and outputs | Beginner, **but two game ideas or more** are present  | Able to discuss one game idea with detail, such as number of players, winning condition, game resources, procedure, and other general game rules | Proficient **and** able to show **one** unique modification to add originality to the idea.  E.g: not plain 3x3 tic tac toe |
| FSM  | 30% | No FSM Diagram provided | FSM is too abstracted, with only states and **no** control signals provided | Only parts of the main game logic FSM is provided, with minimal control signals and some degree of ALU utilisation.  | The main game logic is illustrated in the FSM diagram, with complete control signals that theoretically make sense. ALU is utilised for some operation.  | >70% FSM control signals for the main game logic  are provided. They must theoretically make sense to implement the main game mechanic. However, ALU is NOT utilised efficiently, e.g: some FSM states perform equality comparison directly with == instead of utilising CMPEQ from ALU | >90% FSM control signals are provided for the ENTIRE game (including main game logic, reset, loading of data, output of data, etc). ALU is utilised for ALL arithmetic related operation  |


## Post-Checkoff

Between Week 10-12, you are to **build your hardware** and debug.

Consultations available on per-request basis. 
- Search edstem for FAQ before making appointment to avoid repeated questions
- We cannot **debug** your code for you: hardware programming is difficult, we likely are not able (due to constraint of time and manpower) to help you debug your code
- Come prepared with **expected case**, **observed case**, and **your suspicion** (on what might go wrong)