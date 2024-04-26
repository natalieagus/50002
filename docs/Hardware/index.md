---
layout: default
title: Hardware Related Topics
permalink: /hardware
has_children: true
nav_order: 18
---

# 50.002 Hardware Related Topics 
{: .no_toc}

These topics are taught before the recess week. They are **tested** during our Midterm examination. Below we list the **learning objectives** of each topic. Please find the detailed learning objective on the respective notes.  

## [Basics of Information](https://natalieagus.github.io/50002/notes/basicsofinformation)
1. Calculate the amount of information received in bits (probability)
2. Encode information and calculate the minimum number of bits
3. Convert numbers from and to decimal-binary, binary-hex, decimal-hex
4. Apply 2's complement
5. Model information in terms of bits

## [Digital Abstraction](https://natalieagus.github.io/50002/notes/digitalabstraction)
1. Explain the advantage of digital abstraction
2. Define what combinational logic is 
3. Rationalise static discipline of combinational logic
4. Define what noise margin is
5. Calculate and analyse noise margin and noise immunity requirement
6. Draw and analyse the VTC graph

## [CMOS Technology](https://natalieagus.github.io/50002/notes/cmostechnology)
1. Explain types of MOSFETs: PFETs and NFETs
2. Explain how to build CMOS inverter from field effect transistor (FET)
3. Experiment with the mechanism of pull up and pull down transistors
4. Explain how CMOS works and the importance of its complementary nature 
5. Construct simple boolean equations given some CMOS circuits
6. Compute propagation delay and contamination delay
7. Calculate and analyse timing specification of a combinational circuit

## [Logic Synthesis](https://natalieagus.github.io/50002/notes/logicsynthesis)

1. Write the truth table given a functional specification of a combinational device
2. Write the sum-of-products of a boolean expression given a truth table or combinational logic, and vice versa
3. Draw the combinational logic using NAND and NOR gates given the sum-of-products or truth table
4. Simplify boolean expression using boolean algebra and Karnaugh map
5. Explain the workings and applications of multiplexer
6. Use multiplexer as a universal gate implementation
7. Implement boolean expression in read-only memory (ROM)

## [Sequential Logic](https://natalieagus.github.io/50002/notes/sequentiallogic)
1. Draw the model of sequential logic consisting of memory device and combinational logic
2. Explain high level working of a D-latch
3. Explain high level working of edge-triggered flip-flop 
4. Rationalise dynamic discipline of sequential logic in terms of t1 and t2 constraints
5. Analyse the relationship between setup time, hold time, contamination delay, and propagation delays
6. Comprehend The Dynamic Discipline
7. Analyse timing requirements, focusing on the roles of Tsetup and Thold 
8. Utilize understanding of propagation delay, contamination delay, and the dynamic discipline to evaluate and propose solutions for real-world problems in sequential logic circuits.
9. Reflect on the importance of timing in circuit design (Metastable State)

## [Finite State Machine](https://natalieagus.github.io/50002/notes/fsm)
1. Define finite state machine and its purpose
2. Draw a valid state transition diagram given a specification
3. Derive FSM equivalence and FSM reduction
4. Identify two different types of state machine and their pros and cons: Moore and Mealy
5. Implement finite state machine in a hardware

## [Programmability and Computability](https://natalieagus.github.io/50002/notes/turingmachine)
1. Explain the workings of hypothetical Turing Machine
2. Derive the concept of programmability in Turing machine
3. Recognize the connection between Turing Machines and functions, and how functions can be computable 
4. Justify the significance of the computer science revolution

## [Beta Instruction Set Architecture](https://natalieagus.github.io/50002/notes/instructionset)
1. Describe Von Neumann model of computer architecture
2. Recognise the difference between an Instruction Set Architecture (ISA) and its implementation
3. Explain how basic representation of Beta machine model (ISA) and instruction encoding works
4. Describe memory addressing conventions
5. Illustrate two basic Beta instruction formats in terms of bits allocations
6. Convert Beta assembly instruction to its binary representation and vice versa

## [Building the Beta](https://natalieagus.github.io/50002/notes/betacpu)
1. Implement the datapath for Beta ISA
2. Explain different types of datapaths: ALU operation, Load & Store operation, and the Control Unit
3. Construct the complete Beta CPU datapath for all instruction classes
4. List the output of control logic for different instructions
5. Synthesise new beta instructions with given existing datapath
6. Benchmark the performance of Beta CPU


