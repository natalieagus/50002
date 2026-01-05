---
layout: default
title: UI/UX Enhancement 
permalink: /project/2d/ui-ux
parent: 50.002 2D Project 
grand_parent: 1D&2D Project (Details)
nav_order: 3
---

# UI/UX Enhancement
{: .no_toc}

{:.note}
This is largely related to OBJECTIVE 2. 

UX in gaming focuses on how players interact with the game, including the ease of understanding the game's controls, the feedback they receive from their actions, and the overall aesthetic and sensory experience. You can do this either by enhancing the input/output presentation of the game or adding certain game features or scoring system that is intuitive enough to understand so that our players can focus on the experience of play rather than dealing with nitty gritty details on how to operate your prototype. 

## Background

### What is the difference between UI/UX? 
UI (User Interface) and UX (User Experience) are **closely** related but distinct concepts in design:

1. **UI (User Interface)**: This refers to the specific elements that users interact with in a **product**, such as **buttons**, **switches**, and **visual** **elements**. It's about how the product is laid out and **how it looks**. For instance: Your choice on which *type* of buttons to buy (arcade button, various sizes, with/without LED) and the placement on the buttons on the hardware enclosure directly impacts UI. Your choice on which 7seg to buy (which color, what’s the size) also directly impacts UI quality. 
2. **UX (User Experience)**: UX is about the **overall** experience a user has when **interacting** with a product. It encompasses how **easy or difficult** it is to interact with the UI elements, but also includes the user's **emotions** and **attitudes** about **using** the product. UX design is concerned with the entire process of acquiring and integrating the product, including aspects of gameplay design, aesthetics, usability, and function.

*In summary, UI is about the **tangible** elements that enable people to interact with a product, while UX is about the **emotional** and **experiential** aspects associated with **using the product**.*

### Does a Good UI imply a Good UX? 

A well-designed UI (User Interface) focuses on the layout, visual elements, and interactive components of a product, making it intuitive and easy to use. However, a good UX (User Experience) encompasses a broader range of factors including usability, efficiency, emotional satisfaction, and the overall enjoyment of using the product. While an effective and aesthetically pleasing UI is a **crucial component** of good UX, it's **not the only factor**. UX also includes aspects like the **value** the prototype provides, its **reliability**, and how well it **meets the user's needs and expectations (as a game hardware).**

**An example of an FPGA hardware game prototype with a good UI but poor UX could be as follows:**

**Good UI**: The game has a **well-designed** interface - clear and brightly lit LEDs, **responsive** **buttons** in logical ****positions, and a small screen displaying scores and levels with cute graphics, topped with aesthetically pleasing enclosure made out of shiny black acrylic. The physical layout is appealing and straightforward, making interactions feel smooth.

**Poor UX**: Despite the well-designed interface, the game suffers from long loading times and frequent crashes, leading to frustration. The rules are overly complex or poorly explained, making it difficult for users to understand how to play or progress in the game. Additionally, the game lacks engaging content or variety, resulting in a monotonous and unenjoyable experience, despite the ease of interacting with the interface. This disconnect between a well-designed UI and a less satisfying overall user experience illustrates how good UI does not always guarantee good UX.

### What's this Criteria About?
This could involve **improving** the game's **visuals**, improving the prototype’s **aesthetics**, adding simple audio effects, or user interface to make it more **appealing** and **user-friendly.** Since you are free to select any input or output devices of your choice for your 1D project, such as simple LED lights, RGB LED strips (various arrangements), LED matrices of various kinds, buttons with different types of switches, etc, **make sure to select a combination that complements the functionality of your game.** 

- Consider the size and feel of the chosen button, whether it is appropriate for the game (depending on the frequency of presses required from the player throughout the duration of the game)
- Consider the **brightness** of the output devices, whether or not you need to **diffuse** it or increase the **contrast**

## Suggested Approaches

### Visual Feedback and Aesthetics

Use a **variety** of colors for the LEDs to make the game visually appealing and to differentiate between different types of game elements (e.g., regular targets, bonus targets, penalty targets).

Implement **patterns or sequences of light** that guide the player's attention or signal different game states (like start, end, bonus round).


### Ergonomic Button Design

Ensure that the buttons are comfortably sized and placed for players of **target** ages. The tactile feel of the buttons can also **enhance** the experience. Consider using different **shapes** or **textures** for buttons to add to the **tactile** experience.

Some groups in the past also custom-made padded button designs for games inspired by [Jubeat](https://en.wikipedia.org/wiki/Jubeat).


### Good Score Display

Include an easy-to-read score display that updates in real time. This could be realised through various LEDs, RGB LEDs, 7segments, or even a small digital screen. For multiplayer modes, ensure that each player's score is clearly displayed and distinguishable from the other's.

### Responsive Design

Design the game to be responsive to the players’ actions. For instance, the speed of the LEDs or the game's response to button presses should feel intuitive and not laggy. Scores should be immediately captured, and some buffer should be added when player takes “damage” to avoid instant death. 

### Accessibility Features

Whenever applicable, consider adding features that make the game more accessible to a wider range of players, such as adjustable speed settings for players with slower reaction times, or make the game accessible for the visually impaired.
