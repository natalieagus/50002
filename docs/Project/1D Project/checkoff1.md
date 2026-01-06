---
layout: default
title: Checkoff 1 (ALU)
permalink: /project/1d/checkoff-1
parent: 50.002 1D Project 
grand_parent: 1D&2D Project (Details)
nav_order: 1
---

* TOC
{:toc}

# Checkoff 1: ALU (3%)
{: .no_toc}

This checkoff requires you to implement a fully functional 32-bit ALU as per the specification written in the [ALU lab handout](/lab/lab5) on your Alchitry Au FPGA.

## The Task

**To implement a 32-bit ALU on Alchitry Au FPGA (hardware, not simulator)**: 

- **Input**: A[31:0], B[31:0], ALUFN[5:0]
- **Output**: ALU[31:0], **z, v, n**
- Follow [ALU Lab](/lab/lab5) **functionalities** and **modularity** format. 
- Note that the output of this FPGA ALU **MUST include z, v, n.**
- **Manually** able key in 32-bit A, 32-bit B, and ALUFN (easiest way is to use dip switches on the IO, but you’re free to be creative) and observe ALL 32 output bits on the Alchitry-IO (LED/7seg, or any output device of your choice) to check manually that the output is **correct. 
- [Automated ALU Tester](#automated-tester) using FSM

If you have completed the ALU Lab, then you would’ve completed majority of this checkoff. Consult the [rubric](#rubric) for more details.
  
## Constraints

Strictly <span class="orange-bold">no</span> usage of math and compare Lucid operators (see below) when implementing all 13 ALU operations stated in the lab handout: `ADD, SUB, MUL, SHL, SRA, SHR, CMPEQ, CMPLE, CMPLT, AND, OR, XOR, A`. 

> You can however use it for *other* purposes like array indexing and checking conditions in loops. 

For these 13 operations, follow the circuit schematic given in the lab handout. <span class="orange-bold">Failure to comply results in -2% of overall your grades</span>. 

Keep in mind that for your 1D project, you're NOT limited to just the 13 standard functionalities. You have the flexibility to implement additional features using Lucid or Verilog default mathematical and comparison operators. For instance, if you decide to include a division (`DIV`) operation, you can utilise the '/' operator. 

### List of Forbidden Comparison Operators

DO NOT use these operators to implement the **COMPARE** operators (CMPEQ, CMPLE, CMPLT):

| Function | Expression |
| --- | --- |
| Less than: | `EXPR` `<` `EXPR` |
| Greater than: | `EXPR` `>` `EXPR` |
| Less than or equal: | `EXPR` `<=` `EXPR` |
| Greater than or equal: | `EXPR` `>=` `EXPR` |
| Equal: | `EXPR` `==` `EXPR` |
| Not equal: | `EXPR` `!=` `EXPR` |

### List of Forbidden Math Operators

Do NOT use any of these operators to implement the **MATH** operators (ADD, SUB, MUL, SHL, SRA, SHR):

| Function | Expression |
| --- | --- |
| Negate: | `-EXPR` |
| Add: | `EXPR` `+` `EXPR` |
| Subtract: | `EXPR` `-` `EXPR` |
| Multiply: | `EXPR` `*` `EXPR` |
| Divide: | `EXPR` `/` `EXPR` |
| Shift right: | `EXPR` `>>` `NUM_BITS` |
| Signed shift right: | `EXPR` `>>>` `NUM_BITS` |
| Shift left: | `EXPR` `<<` `NUM_BITS` |
| Signed shift left: | `EXPR` `<<<` `NUM_BITS` |

### List of Forbidden Bool Operators

Do NOT use any of these operators to implement the BOOLEAN operators (OR, AND, XOR, A):

| Function | Expression |
| --- | --- |
| Bitwise AND | `EXPR` `&` `EXPR`|
| Bitwise OR | `EXPR` `\|` `EXPR`|
| Bitwise XOR | `EXPR` `^` `EXPR`|


## ALU Automated Tester

You can use an **FSM** and **ROM** to create an automated tester for your ALU if you want to score the highest category in the Testing Criteria of the rubric. <span class="orange-bold">Remember to still have the manual usage feature of the ALU available.</span>

### Expectations
We **expect** you to have hardcoded values of A, B, and ALUFN (operation), and correct answer stored as a ROM/constant in your FPGA. This is analogous to your adder automated tester built for in the Adder lab.

The FSM must **automatically** feed values of A, B, and ALUFN to your ALU <span class="orange-bold">at a human-visible rate</span>, and you must have a clear indicator (using IO Shield LED or external LEDs) **that your ALU output matches** your pre-computed answer as well as **the test case ID**.

#### Error Case Simulation
We **expect** you to **simulate** an **error** case. 

- Your ALU should **STILL** be correct (as is), and your pre-computed answer should also STILL be correct (true to the actual intended operation between A and B).
- What you can do is to add an **external** modification to the **OUTPUT** of the ALU to simulate an error

**For instance**: use a **switch** on the IO Shield to always invert the LSB of the ALU before feeding it back to the FSM checker, thus resulting in an error case because the post-processed ALU output no longer match the answer key.

{:.important}
DO NOT purposely create a wrong answer key and match it to the ALU output and say that an error “exists”. **This is fundamentally wrong**. 

Think about the **PURPOSE** of testing an object. A tester’s job is to be able to differentiate whether an output is **wrong** (does not match the **true** answer), and **NOT** to be able to detect **SPECIFIC** error via hardcoding. 

The latter is useless since in practice since there are infinitely many error scenarios, and it is futile to try to catch them by *matching* it to a list of hardcoded error values. 

What we want to see is that your tester is able to catch **wrong values** *because* they **DO NOT MATCH** the pre-computed answer key, and *not catch the wrong values by matching it with a set of known wrong values (this is a pretty useless tester).*

#### Test Case Indication
We **expect** you to indicate clearly in the IO Shield (using any LEDs, or 7 seg) or using external LEDs that an error **is** or **is not** happening with the current test case. We need to know the *id* of the test case.

#### Comprehensiveness
We **expect** your test cases to be **COMPREHENSIVE**: you should test **ALL** functionalities and **all** edge cases on top of the **regular** cases per functionality. 

For example: when testing the adder, we expect you to supply values of A and B that cause **positive** overflow and negative overflow on top of the **regular** addition/subtraction cases that don't cause an overflow.

#### Documentation

We **expect** to find documentation or relevant info about your ALU in your **Google Doc report**. It will be aiding your checkoff. We won’t read any other info elsewhere.

## Submission Procedure

**Submit the following at eDimension Week 8 tab**:

Paste the link to your github repo containing the code for your ALU so we have an entry on eDimension to key in your grades.


## Checkoff Schedule & Procedure
 
{:.highlight}
Find the timeslot for your group's checkoff in the course handout.

During the checkoff:
- You’re given 10-15 minutes per group
- **All group members must be present** unless you have valid LOA

We will scan your Google Doc report during Checkoff 1 (your ALU writeup), then give us your Alchitry Au (Hardware) with the ALU loaded into it, and allow us to check several operations **manually**. Answer questions when asked (related to operating the ALU).

Missing your slot will result in **zero marks**, we will not provide a make-up slot.

## Rubric

This checkoff is worth 3% of your total assessment grades.

| Criteria | Weight | Not Present | Minimal (20%) | Basic (40%) | Intermediate (60%) | Advanced (80%) | Exemplary (100%) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Functionality** | 25%  | ALU not implemented | ALU only has < 13 working functionalities listed in Lab 3: ALU | ALU has ALL working functionalities listed in Lab 3: ALU, but some are buggy (not more than 2) | ALU has ALL of the functionalities listed in Lab3: ALU, and they’re all working as intended | ALU has additional  functionalities other than the 13 functionalities found in Lab3: ALU | Proficient and additional functionalities are actually useful to the proposed 1D game (requires students to explain basic idea of the 1D game prototype) |
| Design | 25% | ALU not implemented. If you are not using an ALU, you will also get 0 on this category.  | ALU design is poor, not hierarchical and not modular, everything falls under top level file, e.g: `au_top.luc` and does not adhere to ALUFN given | ALU design adheres to ALUFN given, but everything is implemented under top level file, e.g: `au_top.luc` | ALU Design follows Lab3: ALU instructions, with SOME components being modular, e.g: `adder` is separated from `compare` but not for all components. | ALU Design follows Lab3: ALU instructions: hierarchical and modular for ALL components, i.e: every component placed as separated files.  | Proficient **and** additional functionalities are arranged in its proper component. This category cannot be scored if there’s no additional functionality for the ALU.  |
| **Testing** | 25% | No manual testing present, no automatic testing present | Students are only able to show some functionality of the ALU manually (<10) | Students are ready to demonstrate all 13 functionality of the ALU manually, but some bugs are present from instructor-given manual test case | Students are ready to manually   demonstrate all 13 functionality of the ALU without any bugs when instructor gives random test cases | Intermediate **and**  students are able to show ALL of the functionality of the ALU using a self-test circuit (FSM), with clear indication on **which test case** are currently happening at any point in time. Students can use 7Seg or LED (indexed test cases).  | Proficient **and** students can demo **cases of errors properly**, and test circuit can indicate these kinds of errors properly using either 7Seg or LED.  |
| Source Code and Documentation | 25%  | Code is not pushed to the Github Classroom Repository | No or little documentation on HDL source code, at least 30% of variable naming does not make sense.  | Comments are present but not properly written (with noticeable typos, >20%). Some variable naming and module naming are somewhat proper.  | ALL variable naming and module naming is somewhat proper, but source code is too excessively commented.  | ALL Variable naming and module naming is proper, comments are provided elegantly with good quality and not just bombarding of comments. Debug code is present and just commented out, cluttering the workspace. | Proficient **and** useless code is removed and not just commented out. Git commits are meaningful, periodical, and follows proper commit conventions (see [conventionalcommits.org](https://www.conventionalcommits.org/en/v1.0.0/)).  |

