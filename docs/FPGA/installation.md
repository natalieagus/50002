---
layout: default
permalink: /fpga/installation
title: Installation Guide
parent: 1D&2D Project (FPGA)
nav_order:  0
---

* TOC
{:toc}


# FPGA Tools Installation Guide
{: .no_toc}

Software to install: 
1. **Vivado ML Edition - 2023.2** or any later version  
2. [Alchitry Lab IDE](https://alchitry.com/alchitry-labs) (version TBC),
3. [**Latest** Java Development Kit](https://www.oracle.com/sg/java/technologies/downloads/)

{:.important}
**Total additional space required: ~80GB**. You may want to install these to an external drive. 

## Preface 
The Alchitry IDE is used to **write** hardware designs in the Lucid programming language, offering a higher-level abstraction for FPGA development. 

<img src="{{ site.baseurl }}//docs/FPGA/images/installation/2024-10-16-11-04-09.png"  class="center_seventy no-invert"/>

Once the code is ready, you can press **build 🔨** button and the IDE translates Lucid to Verilog and utilizes Vivado (configured with its binary location) to synthesize and generate the bitstream file. 

<img src="{{ site.baseurl }}//docs/FPGA/images/installation/2024-10-16-11-04-47.png"  class="center_thirty no-invert"/>

The bitstream file can be found under `[PROJECT_DIR]/build/alchitry_au.bin`:
<img src="{{ site.baseurl }}//docs/FPGA/images/installation/2024-10-16-11-05-51.png"  class="center_seventy no-invert"/>

This bitstream is then **loaded** onto the FPGA, which is connected to the computer via USB for deployment.

<img src="{{ site.baseurl }}//docs/FPGA/images/installation/2024-10-16-11-06-23.png"  class="center_seventy no-invert"/>


## Vivado Installation 

### Windows x86-64 or Linux x86-64

Vivado is used to **synthesize** high-level hardware description code (in Verilog or Lucid translated to Verilog) into a netlist of logical gates. This netlist is then further **processed** through implementation steps, such as place-and-route, to produce a bitstream or **binary file** for programming the FPGA.


We recommend you to instal Vivado ML Edition - 2023.2. You are free to try older version (see [archive](https://www.xilinx.com/support/download/index.html/content/xilinx/en/downloadNav/vivado-design-tools/archive.html)) Vivado Design Suite - HLx Editions - 2020.2 or the latest version: Vivado ML Edition - 2024.1. 

{:.highlight}
Please just choose one and just install one version.

This guide assumes you select Vivado ML Edition - 2023.2. 

### 🍎 Apple Silicon Mac 
You <span class="orange-bold">cannot</span> natively install Vivado on Apple Silicon macs. Xilinx Vivado doesn’t officially support ARM as of early 2025. Current workaround utilises UTM + Debian 12 + Rosetta, [read this guide here](http://natalieagus.github.io/50002/fpga/fpga_applesilicon). 


### Vivado ML Edition - 2023.2 
[Create an AMD account](https://www.amd.com/en/registration/create-account.html?custtarg=aHR0cHM6Ly9hY2NvdW50LmFtZC5jb20vZW4vcHJvZmlsZS5odG1s) first. 

Then, download [Vivado ML Edition - 2023.2 self-extracting web installer](https://www.xilinx.com/support/download/index.html/content/xilinx/en/downloadNav/vivado-design-tools/2023-2.html) (Windows / Linux)

<img src="{{ site.baseurl }}//docs/FPGA/images/installation/2024-10-16-09-54-29.png"  class="center_seventy no-invert"/>

**Windows users:** Extract and open the downloaded installer as per normal. 

**Linux users:** Once the installer is downloaded, open Terminal and type the following to make the `.bin` executable, and run it.

```sh
cd ~/Downloads 
chmod +x FPGA[press TAB for autocompletion]

# then run 
./FPGA[press TAB]
```
Sign in with the AMD account you created earlier:

<img src="{{ site.baseurl }}//docs/FPGA/images/installation/2024-10-16-09-59-32.png"  class="center_seventy no-invert"/>

Then select Vivado: 

<img src="{{ site.baseurl }}//docs/FPGA/images/installation/2024-10-16-09-59-57.png"  class="center_seventy no-invert"/>

Choose Vivado ML Standard (this is the **free** version):

<img src="{{ site.baseurl }}//docs/FPGA/images/installation/2024-10-16-10-00-26.png"  class="center_seventy no-invert"/>

Only tick these packages to install (we don't need everything, you can save some space):
- Vivado Design Suite: Vivado, Vitis HLS
- DocNav
- Artix-7

<img src="{{ site.baseurl }}//docs/FPGA/images/installation/2024-10-16-10-01-04.png"  class="center_seventy no-invert"/>

Next, tick all the license agreements:

<img src="{{ site.baseurl }}//docs/FPGA/images/installation/2024-10-16-10-01-24.png"  class="center_seventy no-invert"/>

Then create installation an directory. Here we create a new folder called Xilinx under ~/Documents:

<img src="{{ site.baseurl }}//docs/FPGA/images/installation/2024-10-16-10-01-53.png"  class="center_seventy no-invert"/>

<img src="{{ site.baseurl }}//docs/FPGA/images/installation/2024-10-16-10-02-14.png"  class="center_seventy no-invert"/>

After that click **install**: 

<img src="{{ site.baseurl }}//docs/FPGA/images/installation/2024-10-16-10-02-29.png"  class="center_seventy no-invert"/>

{:.important}
It might take approximately 2-3 hours for installation to complete. 

<img src="{{ site.baseurl }}//docs/FPGA/images/installation/2024-10-16-10-03-04.png"  class="center_seventy no-invert"/>

Finally, ensure that Vivado is installed properly (you can open the app afterwards):

<img src="{{ site.baseurl }}//docs/FPGA/images/installation/2024-10-16-10-12-21.png"  class="center_seventy no-invert"/>

## Alchitry Lab Installation 

Download Alchitry Lab 2 from [here](https://alchitry.com/alchitry-labs/). This is your IDE.

Once installed, open the app and you can create a **new** project. Select the template for Alchitry Au board and choose one of the basic template project: 

<img src="{{ site.baseurl }}//docs/FPGA/images/installation/2024-10-16-11-09-33.png"  class="center_seventy no-invert"/>

### Set Vivado Location

Set the Vivado installation location you did earlier in Alchitry Lab. It should be something like this `[VIVADO_INSTALLATION_DIRECTORY]/Vivado/[VERSION]`. In this example, we installed Vivado ML Edition 2023.2 in `/mnt/vivado`, and hence the location to select in Alchitry is `/mnt/vivado/Vivado/2023.2`. 

<img src="{{ site.baseurl }}//docs/FPGA/images/installation/2024-10-16-11-10-22.png"  class="center_seventy no-invert"/>

### Build the project
After vivado location is set, you can **test build** the project:

<img src="{{ site.baseurl }}//docs/FPGA/images/installation/2024-10-16-11-12-16.png"  class="center_seventy no-invert"/>

If vivado location is set properly, you should see the message `Starting Vivado...`:

<img src="{{ site.baseurl }}//docs/FPGA/images/installation/2024-10-16-11-15-07.png"  class="center_seventy no-invert"/>

{:.important}
Synthesis takes quite some time (3-10 minutes). This is normal. 

When synthesis is done, you should see the message `Finished building project`:

<img src="{{ site.baseurl }}//docs/FPGA/images/installation/2024-10-16-11-15-46.png"  class="center_seventy no-invert"/>

{:.note-title}
> Debug Log 
>
> If project building fails, copy the debug log and search for the word `ERROR`. 

### Load to FPGA 

Connect the FPGA board to your computer. It should detect the board **automatically**. 

You can **load** the binary to the Alchitry Au FPGA using the solid arrow button (load flash, persistent) or the hollow arrow button (load RAM, not persistent upon reboot of FPGA). 

<img src="{{ site.baseurl }}//docs/FPGA/images/installation/2024-10-16-11-17-20.png"  class="center_fifty no-invert"/>

### Using Alchitry Loader 

<img src="{{ site.baseurl }}//docs/FPGA/images/installation/2024-10-16-11-18-24.png"  class="center_fifty no-invert"/>

You can also load the binary to your FPGA using Alchitry Loader. It works the same. Alchitry Loader is **useful** for macOS users who cannot synthesise the binary natively, and can only **load** flash/RAM after synthesizing the binary elsewhere. 

