---
layout: default
title: Checkoff 3 (Live Demo)
permalink: /project/checkoff-3
parent: 50.002 1D Project 
grand_parent: 1D&2D Project (Details)
nav_order: 3
---

# Checkoff 3: Live Demo (12%)
{: .no_toc}

## Task

You will need to present a live demo of your working EHP at the Multi Purpose Hall (MPH, near hostel) and exhibit your prototype at your designated booth. You are also expected to man your booth throughout the event and allow visitors to try your prototype.

{:.important}
If you do not show up for the exhibition, **OR** did not bring any prototype (partially working prototype is OK), **or did NOT** utilise ALU in your implementation, you will **instantly obtain 0% for your project grade regardless** of your previous checkoff values.

Consult the [rubric](#rubric) for more details.

## Checkoff Procedure

Be present at the exhibition venue throughout the event, and set up your booth between 9-10 AM.

The event will officially start at 10AM.
- At least one person should man the booth at all times
- The entire group should be present during your own checkoff slot (15 mins, consult course handout for schedule)
  - ALL group members must be present (unless LOA, or HASS) **during your checkoff slot.** 
  - Missing your slot entirely will result in zero marks.

It is important to **test** your prototype extensively before the extension so that your works throughout the day. Visitors should be allowed to interact with your prototype.
- We ***might*** ask you to compile and load your code from this last commit during the demo in Week 13, this is to ensure fairness.

Standby with your project code (your repo) open in one of your laptops in case we have any questions

**Allow the instructors to interact with your prototype,** and **answer our questions** as we fill up part of the Checkoff 3 rubrics. **No presentation slides required**.

We will read your report and code later to obtain detailed answer.


## Submission

**Submit the following necessary documents for Checkoff 3 in eDimension Week 12 tab.** 

- Github link to your code repo **(Checkoff 3, 12%)** for grading entry
- Poster, Video, filled Project template summary for Live Exhibition **(Checkoff 4, 2%)**

{:.important}
No more commits **after Checkoff 3 deadline** (consult course handout for exact date & time) can be made afterwards. **Your write rights will be revoked.**


## Budget Check

We will also justify your budget during this checkoff. We do not want any pay-to-win kind of project, so if you’re severely over-budget, we will penalise 2% of your overall grade. Some of you might have existing LED matrix that you can use, or monitor (if you chose to output VGA), these are still acceptable. We will justify on a case-by-case basis should your prototype look like it costs >> $80 and inform your team accordingly.


## Rubric

| Criteria | Weight | Not Present | Novice (20%) | Beginner (40%) | Intermediate (60%) | Proficient (80%) | Expert (100%) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ALU Utilisation | 10% | ALU is not utilised in the game at all **This will trigger a 0% grade in the project**. 
   | Only 1 basic ALU function is used in the game,but with direct access to its output and not utilising proper datapath (treated like standard arithmetic operation).  | Novice **and** 2 basic  ALU functions are utilised | Beginner **and** majority of the operation is used in ALU, about 50-60%. Datapath uses some arithmetic when it could be used by ALU.  | ALU is utilised for at least 80% of arithmetic-related operations.  | Proficient & ALL operations that can be done using the ALU is utilised by the FSM. A*dditional **ALU functionality*** presented in Checkoff 1 are utilised in the game |
| Electronics Design (FPGA) | 30% | The prototype does not work and does not turn on at all, zero interaction, only the casing is brought.  | There’s no structural design and no modularity in the code, only that the prototype somewhat works | Able to show some parts to be modular and containing hierarchy (e.g: `alu` in a separate module, `driver` in another), but bulk of the code is placed under a single file | Able to show most of the design in terms of blocks/hierarchy, with modularity. Design has a proper data path and control circuitry **around** a single ALU.  | Intermediate **and** there exist proper data path and control circuitry around the input driver and the output driver.  | Proficient and careful consideration (modularity, hierarchical) is placed over **all** components of the project, not just the main control datapath but also the peripheral modules  **** |
| Testing | 30% | No prototype brought to the exhibit. **This will trigger a 0% grade in the project regardless of your previous checkoff value.**   | Prototype (hardware enclosure) is present, but it does not work with the FPGA | Are able to show the prototype working as intended for somewhat 50% of the functionality | Prototype is working for the main game logic, with some noticeable bugs (e.g: unable to restart unless restarting the FPGA, some score calculation is wrong, winning condition is not triggered properly, some LEDs are not lit up, buttons are not wired) | Prototype is working as intended, all game rules are properly implemented and games can be played as per normal. All output displays the correct outcome, and inputs are properly registered for 95% of the time | Proficient **and** is robust against intentional rule breaking, e.g: pressing P2 buttons when it’s P1 turn does not rig the game, or pressing all 3 buttons at once when only 1 button should be pressed does not crash the game |
| Game Functionality and Reliability | 15% | No prototype brought to the exhibit. **This will trigger a 0% grade in the project regardless of your previous checkoff value.**  | Game is barely functional with numerous reliability issues. Only the core mechanic is somewhat working but I/O is unreliable.  | Basic game functions with noticeable issues impacting reliability. | Reliable functionality for the most part, with minor issues unrelated to the main game functionality such as loose output wires that have to be fixed manually.  | Consistently reliable and functional with rare issues. | Perfect functionality and reliability, no observed issues. |
| UI and Exhibit Presentation | 15% | No prototype brought to the exhibit. **This will trigger a 0% grade in the project**.  | The prototype is poorly displayed, users cannot access game rules and description easily. UI is difficult to use.  | There’s some attempt to display the prototype properly (some enclosure, some stray wires). UI is functional, but does not necessarily suit the game design.  | The prototype is reasonably displayed, users can access game description and rules easily. UI suits the game design and functional.  | The prototype is well displayed, no visible stray wires (from front view), and no need to “operate” the prototype by opening the back of it and access stray wires, etc. UI has clear input and output, game rules are accessible to user with some guidance if needed.  | Proficient **and** the prototype is excellently displayed, looks reasonably professional with zero stray wires and high degree of robustness. UI is intuitive enough, simple, and suits the game design.  |


