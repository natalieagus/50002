---
layout: default
permalink: /fpga/debugging
title: Debugging for the Frantic
description: Getting familiar with Alchitry Lab's debug feature
parent: FPGA
nav_order:  6
---


* TOC
{:toc}

**50.002 Computation Structures**
<br>
Information Systems Technology and Design
<br>
Singapore University of Technology and Design
<br>
**Ian Goh (Spring 2022)**

# Debugging the FPGA
{: .no_toc}
This document is written to guide you with debugging the FPGA using **Alchitry Lab's builtin debug feature**. That being said, there's nothing wrong using outputs such as the LEDS or 7-segment display to debug. Use whichever method you prefer.


### Debug Project
Start by selecting the `Debug Project` (bug looking icon) in the toolbar.

<img src="/50002/assets/contentimage/debug_fpga/debug_icon.png"  class="center_full"/>


### Select Signals
Select the signals you would like to capture during debugging by ticking the respective checkboxes. Here are two sample scenarios:

Example to debug `FSM` current state (`0`-indexed in output):

<img src="/50002/assets/contentimage/debug_fpga/game_fsm.png"  class="center_seventy"/>


**Example** to debug `REGFILE` read addresses and output:

<img src="/50002/assets/contentimage/debug_fpga/regfile.png"  class="center_seventy"/>

### Build Project
Build the project by clicking on `Debug`.

Wait patiently... very patiently...

### Load Project
Once the build has completed, load the project onto the FPGA by clicking the `Program (Flash)` button.

<img src="/50002/assets/contentimage/debug_fpga/flash_icon.png"  class="center_full"/>

### Wait
Wait for the FPGA to start up.

### Open Wave Capture
Open the `Wave Capture` tab by going to `Tools > Wave Capture`.

<img src="/50002/assets/contentimage/debug_fpga/wave_capture.png"  class="center_full"/>

### Connect and Capture
Click on `Connect` (left button) followed by `Capture` (right button).

<img src="/50002/assets/contentimage/debug_fpga/conn_capture.png"  class="center_full"/>

### View Signals
You should now be able to view the signals you selected earlier. Hover over the signal lines to view the values in decimal or expand the view to see each individual bit.

<img src="/50002/assets/contentimage/debug_fpga/wave_capture_signals.png"  class="center_full"/>

### Capture At Will
You are now able to capture the signals at any point in time during execution by clicking on the `Capture` button in the `Wave Capture` tab.


***Good luck debugging!***






