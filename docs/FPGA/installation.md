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
2. [Alchitry Lab V2 IDE](https://alchitry.com/alchitry-labs),
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

{:.important}
Alchitry IDE can be installed and run on Windows, macOS (Apple Silicon), Linux, but Vivado can only be run on Windows & Linux. 

## Alchitry Lab Installation 

### Windows / Linux 
Download Alchitry Lab 2 from [here](https://alchitry.com/alchitry-labs/). For windows users, it might be more reliable if you download it from [Microsoft Store](https://apps.microsoft.com/detail/9mvzrn9dbj3c?hl=en-GB&gl=SG). This is your IDE.

{:.important-title}
> Version
>
> Updated 29 Jan 2025: Version 2.0.25 BETA is recommended. 

Once installed, open the app and you can create a **new** project. Select the template for Alchitry Au board and choose one of the basic template project: 

<img src="{{ site.baseurl }}//docs/FPGA/images/installation/2024-10-16-11-09-33.png"  class="center_seventy no-invert"/>

### macOS 
This application does not prove its origin with a developer signature. To open it:

1. Click the download button.
2. Note: Do not use the Launchpad to perform the following steps as it will not allow you to access the shortcut menu.
3. Open the Finder and locate the application in your Downloads folder.
4. Control-click the app icon, then choose Open from the shortcut menu.
5. You will see a security warning stating the identity of the app author is unknown. Click Open.

At this point, you can test your code with Alchitry lab with the simulator, but not building the binary to load to the FPGA. 

## Vivado Installation 


Vivado is used to **synthesize** high-level hardware description code (in Verilog or Lucid translated to Verilog) into a netlist of logical gates. This netlist is then further **processed** through implementation steps, such as place-and-route, to produce a bitstream or **binary file** for programming the FPGA.

{:.highlight}
Vivado is available to install only on Windows / Linux x86. 

### 🍎 Apple Silicon Mac 
You <span class="orange-bold">cannot</span> natively install Vivado on Apple Silicon macs. Xilinx Vivado doesn’t officially support ARM as of early 2025. Current workaround utilises UTM + Debian 12 + Rosetta, [read this guide here](http://natalieagus.github.io/50002/fpga/fpga_applesilicon). 

You can however install the IDE and use the simulator on macOS (Apple Silicon). Skip to [this](#alchitry-lab-installation) section. 

### Windows x86-64 or Linux x86-64

#### x86: Utilise a VM
You can choose to install natively ([next section](#installing-natively)) or [utilise this VM (Windows 10 + Vivado 2024.2)](https://sutdapac-my.sharepoint.com/:u:/g/personal/natalie_agus_sutd_edu_sg/EZSy-DSoR6hKg4Url7eLgTIBzniiBAKnvlkbTRbaeaKBww?e=Z77ojU). You need to be logged into your SUTD email account to access.

**Required space**: 100-120GB. 

You can use VM like [VirtualBox](https://www.virtualbox.org) or [VMWare Fusion](https://www.vmware.com/products/desktop-hypervisor/workstation-and-fusion) (free pro personal license) and then [import the .ova file downloaded to VirtualBox](https://docs.oracle.com/cd/E26217_01/E26796/html/qs-import-vm.html) (or to [VMWare Fusion](https://www.tutorials24x7.com/mac/how-to-import-ovf-virtual-machine-on-vmware-fusion), or any other VM you use). You can immediately use the VM without installing anything. 

{:.highlight}
The login password for the Windows VM is `user`. 

If you have USB-C port with USB 4/Thunderbolt 3 or 4/USB 3 Gen 2x2 or Gen 2 connection or *better*, you can use an external SSD to store the VM image, and load it from there **directly** so it does not have to take up space in your internal SSD.  Both your external SSD and your laptop/desktop must support the same high-speed USB-C standard for optimal performance. 

#### Shared Folders 

Shared folders allow **seamless** file transfer between your host OS and your VM without using USB drives or network sharing. The steps highly depends on which hypervisor you used. Search on Google (or other search engines) for the most updated guides. 
* In VirtualBox, this feature requires **Guest Additions**, 
* In VMware, it requires VMware Tools

Once enabled, the shared folder appears as a **mounted** **drive** or network location inside the VM, allowing easy access to host files. This is useful for file exchange, for example: you can create a Lucid V2 project in this shared folder and code in your host OS using Alchitry Labs (less lag). Then switch to your VM for [**building** the project](#create-a-test-project-and-build) using Vivado. Finally, switch back to your host OS to [load the binary to the FPGA using Alchitry loader](#using-alchitry-loader). 

{:.note}
When possible, configure your virtual machine to **access a USB device** so you can load the binary to the FPGA after compilation. Search on Google (or other search engines) for the most updated guides. 

#### x86: Installing Natively 
We recommend you to install [Vivado ML Edition - 2023.2](https://www.xilinx.com/support/download/index.html/content/xilinx/en/downloadNav/vivado-design-tools/2023-2.html). You are free to install the [latest](https://www.xilinx.com/support/download/index.html/content/xilinx/en/downloadNav/vivado-design-tools/2024-2.html) version too: Vivado 2024.2. 

{:.highlight}
Please just choose one and just install one version.

This guide assumes you select Vivado ML Edition - 2023.2. 

#### Vivado ML Edition - 2023.2 
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


#### Set Vivado Location

Set the Vivado installation location you did earlier in Alchitry Lab. It should be something like this `[VIVADO_INSTALLATION_DIRECTORY ]/Vivado/[VERSION]`. In this example, we installed Vivado ML Edition 2023.2 in `/mnt/vivado`, and hence the location to select in Alchitry is `/mnt/vivado/Vivado/2023.2`. 

<img src="{{ site.baseurl }}//docs/FPGA/images/installation/2024-10-16-11-10-22.png"  class="center_seventy no-invert"/>
<img src="{{ site.baseurl }}//docs/FPGA/images/installation/2024-10-16-11-12-16.png"  class="center_seventy no-invert"/>

### Create a test project and build
After Vivado location is set, you can **test build** a project by creating a basic project from any given template:

{:.important}
Ensure you select Alchitry Au as the board, and not Alchitry Au V2!

<img src="{{ site.baseurl }}/docs/FPGA/Lucid V2/images/Screenshot 2025-02-04 at 11.50.59 AM.png"  class="center_seventy"/>


If Vivado location is set properly, you should see the message `Starting Vivado...`:

<img src="{{ site.baseurl }}//docs/FPGA/images/installation/2024-10-16-11-15-07.png"  class="center_seventy no-invert"/>

{:.important}
Synthesis takes quite some time (3-10 minutes). This is normal. 

When synthesis is done, you should see the message `Finished building project`:

<img src="{{ site.baseurl }}//docs/FPGA/images/installation/2024-10-16-11-15-46.png"  class="center_seventy no-invert"/>

{:.note-title}
> Debug Log 
>
> If project building fails, copy the debug log and search for the word `ERROR`. This might give you some clue on which module went wrong.

### Load to FPGA 

Connect the FPGA board to your computer. It should detect the board **automatically**. 

You can **load** the binary to the Alchitry Au FPGA using the **solid** arrow button (load flash, persistent) or the *hollow* arrow button (load RAM, not persistent upon reboot of FPGA). 

<img src="{{ site.baseurl }}//docs/FPGA/images/installation/2024-10-16-11-17-20.png"  class="center_fifty no-invert"/>

### Using Alchitry Loader 

<img src="{{ site.baseurl }}//docs/FPGA/images/installation/2024-10-16-11-18-24.png"  class="center_fifty no-invert"/>

You can also load the binary to your FPGA using **Alchitry Loader**. It works the same as pressing the arrow button in Alchitry Labs. 
* Alchitry Loader is **useful** for macOS users who cannot synthesise the binary natively, and can only **load** flash/RAM after synthesizing the binary elsewhere. 
* It is also useful for users that use VMs to compile the binary using Vivado from the VM, and then load the compiled binary (**in the shared folder**) using Alchitry Loader

