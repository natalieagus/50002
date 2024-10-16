---
layout: default
permalink: /fpga/fpga_applesilicon
title: Running Vivado on Apple Silicon mac 
description: This document gives a brief overview of how you can run Vivado on Apple Silicon mac with UTM 
parent: Lucid V2 
grand_parent: 1D&2D Project (FPGA)
nav_order:  10
---
* TOC
{:toc}


# Running Vivado on Apple Silicon mac
{: .no_toc}

As of early 2025, there's no officially supported way to run Vivado on Apple Silicon mac. We have managed to run Vivado + Alchitry lab on Debian 12 + Rosetta, running on UTM (virtual machines for mac). This document shares how you can download the prepared image and run it using UTM. 

## System Requirement 
Apple Silicon mac with least 8 GB of RAM and **280GB** of free space for both downloading and unzipping (final free space needed: 160GB). 

{: .note}
This method is tested on **M2 Max Mac Studio** and **15" M2 Macbook Air**. 

## Installation Steps
### Download UTM
You need to first [download UTM](https://mac.getutm.app). You can also use `brew` for this: 

```
brew update 
brew install --cask utm
```

### Download Image and Unzip
After that, download the image from here (TBC)
* You need to be <span className="orange-bold">signed in to your SUTD account</span> 
* This image comes with Debian 12, Rosetta, Vivado 2023.2, Alchitry Labs 1.2.7 (legacy) and Alchitry Labs 2 pre-installed (current)

Then **unzip** the downloaded file, either using Finder or CLI: 
```
unzip <source.zip> -d <destination_directory>
```

It is recommended that you **download** this to an external drive, and then unzip and store the unzipped `.utm` file to your computer. This process will take about **30-50 minutes** because the size of the image is huge (approx 130 GB). You might want to move it out of your Downloads folder and put it somewhere more practical. This image will contain all your virtual machine's data. 

### Start the VM
Once done, open UTM and import the image. 

<img src="{{ site.baseurl }}/docs/FPGA/images/fpga_applesilicon/shared-dir.png"  class="center_full no-invert"/>

{: .warning}
> Check that there are **TWO** drives: sized approx 64 GB and 80 GB respectively in your `.utm` file. Right click on your `.utm` file and click **Show package contents**. You should see the following under `Data/`: 
> <img src="{{ site.baseurl }}/docs/FPGA/images/fpga_applesilicon/2024-03-18-17-47-02.png"  class="center_full no-invert"/>

### Share Directories with Host Machine 

You can **share directories** with your mac (host machine) by setting the desired shared directory in your host machine here. In this example we use `Documents/alchitry-utm` in our host machine as shared directory: 
<img src="{{ site.baseurl }}/docs/FPGA/images/fpga_applesilicon/shared-dir.png"  class="center_full no-invert"/>

Then in Debian (your VM), you can access this directory via the path `/media/share/DIRECTORY_NAME`, in this case it will be `/media/share/alchitry-utm`.

### Login as `debian`

{:.important}
Start the VM and login with the **password** **`debian`**. The `sudo` password is also `debian`.

Ensure that your desktop looks like this. If it doesn't it means that what you have downloaded might be corrupted. Ensure you have enough space (280GB in total)!

<img src="{{ site.baseurl }}/docs/FPGA/images/fpga_applesilicon/2024-03-25-17-35-03.png"  class="center_full no-invert"/>

### Launching Alchitry Labs 2
You can start alchitry labs by opening terminal from the bottom menu of the desktop (press windows / command image if the dock isn't visible) and type `a2` command (an alias that launches the Alchitry Labs V2 binary). 

Key in `debian` as password when prompted.

```
debian@debian:~$ a2
[sudo] password for debian: [debian]
```

<img src="{{ site.baseurl }}//docs/FPGA/Lucid%20V2/images/fpga_applesilicon/2024-10-16-11-23-16.png"  class="center_seventy no-invert"/>

It will prompt you to create/open new project (first time) or open your last opened project (subsequently).

{:.note}
The VM also comes with **legacy** Alchitry Labs 1.2.7 (using Lucid V1). You can use command `alchitry` to spawn it. See `~/.bashrc` for details.


## Loading .bin from your mac to Alchitry Au FPGA

After **building** your code, you will need to load the binary to your FPGA. There's no USB passthrough with the VM (it's not the usual QEMU), so you will need to <span class="orange-bold">migrate</span> `PROJECT_PATH/build/alchitry_au.bin` to your host machine and flash it to your FPGA using [Alchitry Loader part of the Alchitry Labs IDE for Apple Silicon](https://alchitry.com/Alchitry-Labs-V2/download.html).

If you have set up the [shared directory](#share-directories-with-host-machine) above, simply navigate to this location.

### Install Alchitry Labs V2 in your mac

From this link, [install](https://alchitry.com/alchitry-labs/) the Alchitry Labs V2 IDE. Follow the installation guide properly and open the app. Here's the important steps:
This application does not prove its origin with a developer signature. To open it:

1. Click the download button.
2. Note: Do not use the Launchpad to perform the following steps as it will not allow you to access the shortcut menu.
3. Open the Finder and locate the application in your Downloads folder.
4. Control-click the app icon, then choose Open from the shortcut menu.
5. You will see a security warning stating the identity of the app author is unknown. Click Open.

### Alchitry Loader
Then switch to Alchitry Loader first: 

<img src="{{ site.baseurl }}/docs/FPGA/images/fpga_applesilicon/2024-03-18-14-34-46.png"  class="center_full no-invert"/>

Find the synthesized binary and load it to your Alchitry Au FPGA: 

<img src="{{ site.baseurl }}//docs/FPGA/images/fpga_applesilicon/2024-10-07-11-22-40.png"  class="center_full no-invert"/>





