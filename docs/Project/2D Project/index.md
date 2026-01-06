---
layout: default
title: 50.002 2D Project 
permalink: /project/2d/intro
has_children: true
parent: 1D&2D Project (Details)
nav_order: 2
---


* TOC
{:toc}

# 50.002 2D Project: Efficient and Sustainable Design for Cost-Effective Prototyping (6%)
{: .no_toc}

**Duration: Week 9-12**

## Background

As the successful creation of the working prototype made by ALUnatics Industries garners acclaim within the tech industry, the project enters its **next critical phase** under YouTwitFace 2D division, known for its expertise in **optimization** and **user engagement**. 

This division operates at the intersection of technology and user-centric design, focusing on hardware **optimisation** and refining the game feel and look for an eleveated user experience. **The goal now shifts from mere functionality to creating an engaging, sustainable, and user-friendly gaming experience.**

In this critical phase, the engineers at ALUnatics are faced with the **multifaceted** task of refining the prototype. Their mission extends creating a mere **functional prototype.** **The task now embraces a threefold focus:**

1. **Hardware Enhancement:** One of your priorities is to refine the hardware. This involves optimizing the FPGA for more efficient data processing around the ALU, enhancing the game's speed and resource utilization. The objective is to streamline the prototype's development and maintenance, reducing both cost and technical complexities.
2. **User Appeal**: Concurrently, your team is charged with elevating the game's allure for potential players. This means revamping the game's design and interface, ensuring it's not only functional but also user-friendly and visually appealing. CEO Saltman envisions a game that's engaging and responsive, offering an immersive experience to YouTwitFace's VIP users.
3. **Sustainability and Inclusivity**: Integral to these efforts is the commitment to sustainability and diversity. Your team must integrate eco-friendly practices in hardware development and adopt inclusive design principles in the game's interface, ensuring it resonates with and is accessible to a diverse user base. This holistic approach aims to deliver a game that's not just technologically advanced, but also environmentally conscious and socially inclusive.

This 2D phase is crucial because it's about finding the **right mix** of technical improvements and design upgrades. The team wants to create a game that's not only well-made and runs smoothly but is also fun to play and keeps players interested. This is what CEO Sand Saltman is looking for before making his investment decision.


## Efficient and Sustainable Design for Cost-Effective Prototyping

> *Innovating Games for Maximized User Retention*

In this **2D component of 50.002**, you, as employees of ALUnatics Industries are tasked by YouTwitFace 2D division to **enhance** your team’s hardware prototype utilising **SIGMA-32** from the 1D project. Building on the **threefold** focus established in our background strategy above, your enhancement objectives are as follows:

{:.highlight-title}
> **OBJECTIVE 1: Streamlining Efficiency and Costs** 
> 
> Done by improving the FPGA’s efficiency and circuit design, reflecting our hardware enhancement goal. This involves reducing technical and financial challenges in creating and maintaining sustainable prototypes.

{:.note-title}
> **OBJECTIVE 2: Enhancing User Engagement** 
> 
> Done by upgrading gameplay and UI/UX, directly addressing our aim to make the game more appealing and engaging, as envisioned by CEO Saltman.

{:.new-title} 
> **OBJECTIVE 3: Upholding Sustainability, Diversity, and Inclusion** 
> 
> Done by continuously integrating sustainable practices and inclusive design, reinforcing our commitment to these values in the project's development as you work on the first two objectives.

Your challenge involves refining the game's existing elements, such as its **risk/reward system,** **optimizing the datapath to reduce lag**, usage of **efficient** data structures, or **improving the I/O presentation**. 

You must cover ALL objectives but the *extent* of cover on each objective is entirely up to you. You may consult the [rubric](#rubric) to strategize.

Your performance will be **evaluated** based on how effectively you implement these cost-effective, sustainable, and user-retention focused improvements, demonstrating your capability to **innovate** within the **technical** and **financial** parameters provided.


## User Guide

{:.note}
You won’t be able to start on this 2D project without completing at least 60% of your 1D project, **hence**, we recommend to only start working on 2D from Week 9 onwards, *after* **1D Checkoff 2**.


In these sections, we outline a few basic approaches that you can start with, grouped by categories: 
1. [Data Structure and Hardware Optimisation (OBJECTIVE 1)](/project/2d/dat-struct)
2. [Enhanced Game Features (OBJECTIVE 2)](/project/2d/game-feat)
3. [UI/UX Enhancement (OBJECTIVE 2)](/project/2d/ui-ux)
4. [Sustainability (OBJECTIVE 3)](/project/2d/sus)

We suggest that you focus on **one specific solution for each objectives**. Please do **NOT** implement everything. However, please **keep in mind the sustainability aspect of your solution**. We do not encourage electronic waste or wasteful power consumption.

## Submission and Report

{:.note}
Remember that you are **not** limited to the suggestions linked above. Anything that falls in line with each **OBJECTIVE** is welcome. This project is meant to be **open ended**.


In your **project report (the same one for 1D, Google Docs),** include a **dedicated section titled "2D & Sustainability"** where you detail the **measures** taken to meet **OBJECTIVE 1** and **OBJECTIVE 2,** as well **OBJECTIVE 3**: the sustainability impact of your prototype. 

Aim for a comprehensive writeup of around 5 pages maximum, including relevant figures and captions. Ensure that ALL information is systematically presented, including thorough **descriptions** of your **implementation strategies** (e.g: steps taken to improve minimise your FSM for instance) and their **rationale**. Include visual aids like **photos** or **diagrams** where they can **effectively illustrate your points**. This structured approach should **clearly communicate the efforts and thought process behind your 2D project implementation**.

You might also be asked by your instructors to explain your measures during Checkoff 3 (Live Demo & Exhibition). 

{:.highlight}
<span class="orange-bold">No</span> additional slides or tools required to convey your work, simply explain them verbally to us or open your report and explain in person if time permits.


## Rubric

There are two parts in this grading of 2D project: **Optimisation & Sustainability**. Ensure that you highlight your points clearly in your report. 

### Optimisation (4%)

Note that the total weightage for this section is 150%, but your grades will be capped at 100%, then mapped to 4% (4pts) of overall assessment grades. For instance:

1. Scored 20% (Novice) on Hardware Optimisation, 60% (Intermediate) on Game Design and Quality, and 40% (Beginner) on Upgrades in UI/UX  
2. Total marks: 2.4 out of 4 pts

$$
\left( \frac{20}{100} + \frac{60}{100} + \frac{40}{100}\right) \times \frac{50}{100} \times 4 = 2.4 \text{pts}
$$

| Criteria | Weight | Not Present | Novice (20%) | Beginner (40%) | Intermediate (60%) | Proficient (80%) | Expert (100%) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Hardware Optimisation** | 50%  | **No working prototype present.**  | Although code is modular, there’s **minimal**  effort to improve hardware efficiency or reduce costs. Any improvements appear **incidental** and **don't contribute significantly** to the project's context. For example: **trivial hardware improvements like minor logic gate optimizations** that don't significantly impact the game's performance. | **Minor** improvements in efficiency or cost reduction, but lacks considerable impact. For example:  small changes like efficient data storage in FPGA registers, reducing numbers of LED used to slightly speed up the game process but with **limited** overall impact. | Clear efforts in improving efficiency and reducing costs, with some noticeable effects. For example: **maximising** the FPGA's clock speed (no need to slow down at all) for better game responsiveness, minimising states in the FSM and **positively** affecting efficiency. | Significant improvements in both efficiency and cost reduction, showing deep understanding and effective implementation. **Some successful attempts in implementing a basic ISA** (but **not integrated** with the rest of the system) falls under this category. | Outstanding and innovative improvements, setting a new standard in hardware efficiency and cost-effectiveness. **Successful implementation of ISA**, complete with elegant **integration** with **I/O units** falls under this category.  |
| **Game Design & Quality**   | 50%  | **No working prototype present.**  | Have a working prototype (at least for the main game logic), but the game is **too simplistic**: leaving players with little to no  motivation to play. For instance,  turning light on or off, or guessing randomly generated number between 1 and 1 million with no reward | Able to translate  simple game to the prototype with *some* motivation to **encourage** user engagement, for example: guess random number between 1 to 10, single player game, with a highscore implemented, or a **timed** 3x3 tic-tac-toe.  | Able to translate existing (and reasonably interesting, challenging) game to the prototype, rules are easy to learn. No modification from the original existing game is added. For example: implementing whack-a-mole game with sufficient buttons to press with highscore implemented.  | Intermediate **but** with at least **some minor modificatio**n of the game rule added. The modification must be impactful, that is to make the game **subjectively** more fun to play to **increase** user engagement. For example: addition of **multiple levels** of **increasing** difficulty.  | Proficient **but** the modification is more than just **minor** (something more substantial, such to add additional **multiplayer** **functionality** with **combos** enabled). Note that it has to be impactful (and not just for the “sake” of it), it should incorporates elements of good game design.  |
| **Upgrades in User Interface and User Experience (UI/UX)** | 50%  | **No working prototype present.**  | Negligible or no attempts to design good UI, leading to poor UX. For example: the buttons are awkwardly placed due to short wires, making it difficult to play the game, or the LED layout is confusing, leading to a frustrating user experience. | Some improvements in the UI: parts of it designed to **complement** the gameplay, but limited in elevating user experience. For example: Basic LED indicators are implemented for feedback, but they don't significantly enhance the experience.  | Noticeable effort in designing the prototype’s UI/UX, contributing positively to user experience. For example: The prototype features a well-organized button layout and clear LED displays that align with the game's functionality. There are visual cues that help players understand the game state. | Greatly enhancing user interaction and satisfaction. For example: The prototype includes intuitive button placement and LED arrangements that enhance gameplay. Additional features like color-coded LEDs for different game modes or vibration feedback for certain actions are included, improving interaction. | Innovatively designed UI, setting a high standard in user experience and satisfaction. For example:  Ergonomic placement of buttons and multi-colored LEDs for easy gameplay and clear state indication, clear display of scores and information on appropriately sized 7segments, or distinct audio feedback for actions.  |

### Sustainability and Inclusivity (2%) 

| **Criteria**  | **Weight** | **Minimal (20%)** | **Basic (40%)** | **Intermediate (60%)** | **Advanced (80%)** | **Exemplary (100%)** |
| --- | --- | --- | --- | --- | --- | --- |
| **Environmental Impact** | 30% | Little to no consideration of environmental impacts. No clear actions taken to minimize environmental harm. | Acknowledges environmental impacts but limited actions taken. Some basic measures may be implemented, but they are not comprehensive. | Demonstrates a good understanding of environmental impacts. Implements several measures to reduce environmental harm effectively. | Strong focus on minimizing environmental impact. Implements a reasonable range of effective and innovative measures. | Exceptional focus on reducing environmental impact. Goes beyond standard practices to innovate and implement creative sustainability measures. |
| **Resource Efficiency** | 30% | Resources are used with little to no concern for efficiency. High levels of waste or resource misuse. | Some effort to use resources efficiently, but efforts are sporadic and not fully effective. | Consistently applies resource-efficient practices. Good management of resources with noticeable reduction in waste. | Strong commitment to resource efficiency. Utilizes resources in a highly efficient manner, significantly reducing waste and maximizing utility. | Innovates in the use of resources, achieving the highest level of waste reduction and resource optimization. |
| **Overall Integration** | 40% | Little to no integration of sustainability and diversity. No clear efforts to incorporate environmental, social, or inclusive design principles. | Acknowledges sustainability and diversity but with limited practical application. Some effort to include these aspects, but they are not well-integrated into the core of the project. | Good integration of sustainability and diversity. The project demonstrates a conscious effort to incorporate environmental considerations or accessibility and inclusivity for diverse groups. | Strong, comprehensive integration of sustainability and diversity. The project actively combines environmental responsibility with inclusive design, ensuring accessibility and consideration of diverse perspectives. | Exceptional and innovative integration of sustainability and diversity. The project seamlessly blends environmental, social, and inclusive design principles, serving as a model for holistic and responsible project development. |