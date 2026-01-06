---
layout: default
title: Enhanced Game Features 
permalink: /project/2d/game-feat
parent: 50.002 2D Project 
grand_parent: 1D&2D Project (Details)
nav_order: 2
---

* TOC
{:toc}

# Enhanced Game Features 
{: .no_toc}

{:.note}
This is largely related to OBJECTIVE 2. 


To apply gameplay enhancement to the electronic game being implemented on an FPGA (Field-Programmable Gate Array) for the 1D project, you can consider several strategies that align with the constraints and capabilities of FPGA technology. They mainly revolve around how well you can integrate your prototype hardware with your game design, that is how well you present your game in such a way that is enjoyable to use and play. Note that this may be subjective, and can commonly be seen by how much audience enjoys the prototype

### Upgrade **Game Complexity and Logic**

One of the simpler steps to take is by enhancing your game with the addition of more sophisticated game rules or algorithms, with the purpose of making the game challenging and engaging (and not just to make it trivially different from existing game idea). For example, introduce new levels with increased difficulty, add puzzles or logic challenges that require players to think **critically**.

For example: consider a simpler electronic game, "Whack-A-Mole" and explore how to enhance it for implementation on an FPGA using buttons for input and LEDs for output.

**Existing Game Rule (Whack-A-Mole):**

- The game consists of a series of LEDs lined up in a row or a matrix.
- One LED lights up at a time in a random order, representing a “Mole”
- The player's goal is to press a particular button when the target LED is lit. If the player presses the button at the right time, they score a point.
- The game speeds up gradually, making it more challenging.

To enhance this basic "Whac-A-Mole" concept for implementation on an FPGA using buttons and LEDs, consider the following upgrades:

> *Note that these are some suggestions, you need not implement all of it, select 1 or 2 meaningful ones*
> 
1. **Speed Modes**: Introduce various speed settings that players can select from, increasing the game's difficulty as their reaction time improves.
2. **Sequential Hits**: Create sequences where specific LEDs light up in an order, and the player must hit them in that exact sequence.
3. **False Signals**: Occasionally, flash LEDs in a pattern that should not be responded to, adding a layer of decision-making to the game.
4. **Time Challenges**: Implement timed rounds where players must hit as many correct LEDs as possible within a set time frame.
5. **Scoring System with Multipliers**: Develop a scoring system where consecutive successful hits increase a point multiplier, encouraging accuracy and consistency.
6. **Random 'Bonus' LEDs**: Occasionally, light up a special LED that offers extra points or additional game time when hit correctly.

### **Real-Time Response and Feedback**

You can also improve real-time interactions in the game. This can include **faster response** to user inputs, **smoother** animations, and **immediate** feedback to actions, making the game feel more interactive and lively.

In the case of a “Whack-A-Mole” example above:

1. Ensure that the game registers button presses immediately when an LED is lit. This instant feedback is crucial in a game based on reaction times. The FPGA can be programmed to minimize any delay between the player's action and the game's response.
2. Create **smooth transition effects for the LEDs**, such as **fading** in and out or **blinking** **patterns** when they are hit or missed. These visual cues provide immediate feedback and make the game more engaging.
3. You can **add sound effects** that correspond to the players' actions, such as a distinct sound for a hit, a miss, or hitting a special bonus LED using piezoelectric components. 
4. **Score and Time Display**: Implement a real-time scoring and timer system using LEDs and/or 7 segments.


### **Multiplayer Features**

This can be in the form of **cooperative** play, where players work together to achieve a common goal, or **competitive** play, where players compete against each other. This can be a **significant enhancement**, as it adds a social aspect to the game. Think about the set of inputs that are required for each player: such as whether they need to take turn, or do you have another set of buttons for the other player(s). 

Using the “Whack-A-Mole” example above, we have the following multiplayer options: 

1. **Two-Player Competitive Mode**: Design the game board with two sets of LEDs and buttons, one for each player. In this mode, players compete against each other to hit more moles (LEDs) than their opponent within a set time limit. The FPGA can track and compare scores in real time.
2. **Cooperative Mode**: In this mode, two players work together to hit a target number of moles. Here, the game can be designed to light up LEDs in a way that requires coordination between players, like lighting up LEDs at opposite ends of the board simultaneously.
3. **Turn-Based Play**: Implement a turn-based system where players alternate rounds. The FPGA can keep track of each player's score, and at the end of a set number of rounds, the player with the highest score wins.
4. **Challenge Rounds**: Introduce special rounds where players face an increased difficulty level or unique challenges. For example, in these rounds, LEDs could light up much **faster** or in more **complex** patterns.
5. **Head-to-Head Rounds**: Design rounds where both players' LEDs light up **simultaneously**, and they must race to hit their respective LEDs first. The FPGA can judge which player responded more quickly.
6. **Score Sharing and Display**: Use a **central display** or LED array to show both players' scores in real-time, fostering a competitive atmosphere.
7. **Team Modes**: If you have the capability to extend the game to more than two players, you can create team modes where players are grouped into teams, and each team's combined score determines the winner.
8. **Penalty and Boost Systems**: Introduce penalties for wrong hits and boosts for consecutive successful hits. In multiplayer mode, these can add strategic depth to the game, as players must decide whether to aim for speed or accuracy.
