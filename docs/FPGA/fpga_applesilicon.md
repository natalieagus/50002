---
layout: default
permalink: /fpga/fpga_applesilicon
title: Running Vivado on Apple Silicon mac 
description: This document gives a brief overview of how you can run Vivado on Apple Silicon mac with UTM 
parent: FPGA
nav_order:  7
---
* TOC
{:toc}


# Running Vivado on Apple Silicon mac
{: .no_toc}

As of early 2024, there's no officially supported way to run Vivado on Apple Silicon mac. We have managed to run Vivado + Alchitry lab on Debian 12 + Rosetta, running on UTM (virtual machines for mac). This document shares how you can download the prepared image and run it using UTM. 

## System Requirement 
Apple Silicon mac with least 8 GB of RAM and 150GB of free space. 

{: .note}
This method is tested on **M2 Max Mac Studio**. 

## Installation Steps
### Download UTM
You need to first [download UTM](https://mac.getutm.app). You can also use `brew` for this: 

```
brew update 
brew install --cask utm
```

### Download Image and Unzip
After that, download the image [from here](https://sutdapac-my.sharepoint.com/:u:/g/personal/natalie_agus_sutd_edu_sg/EREWxcAFtTNJlrEpiurTAyQB5JhhgQW-tfepEhhtqMqk1A?e=u00edO).
* You need to be <span className="orange-bold">signed in to your SUTD account</span> 
* This image comes with Debian 12, Rosetta, Vivado 2023.2 and Alchitry Labs 1.2.7 pre-installed 

Then **unzip** the downloaded file, either using Finder or CLI: 
```
unzip debian-12-rosetta-vivado.utm.zip
```

This process will take about **30-50 minutes** because the size of the image is huge (approx 124 GB). You might want to move it out of your Downloads folder and put it somewhere more logical. This image will contain all your virtual machine's data. 

### Start the VM
Once done, open UTM and import the image. Start the VM and login with the password `debian`. Note that `sudo` password is also `debian`. You can start alchitry labs by opening terminal from the bottom menu of the desktop (press windows / command image if the dock isn't visible) and type `alchitry` command. Use alchitry labs as usual. 

### Shared Directory 

After compiling your code, you will need to load the binary to your FPGA. There's no USB passthrough with the VM (it's not the usual QEMU), so you will need to migrate `PROJECT_PATH/work/alchitry.bin` to your host machine and flash it to your FPGA using [Alchitry Loader part of the Alchitry Labs](https://new.alchitry.com/Alchitry-Labs-V2/download.html).

<img src="{{ site.baseurl }}/docs/FPGA/images/fpga_applesilicon/2024-03-18-14-34-46.png"  class="center_seventy"/>

You can **share directories** with your mac (host machine) by setting the desired shared directory in your host machine here. In this example we use `Documents/alchitry-utm` in our host machine as shared directory: 
<img src="{{ site.baseurl }}/assets/images/shared-dir.png"  class="center_seventy"/>

Then in Debian (your VM), you can access this directory via the path `/media/share/DIRECTORY_NAME`, in this case it will be `/media/share/alchitry-utm`.



