---
layout: default
permalink: /fpga/fpga_applesilicon
title: Running Vivado on Apple Silicon mac 
description: This document gives a brief overview of how you can run Vivado on Apple Silicon mac with UTM 
parent: 1D&2D Project (FPGA) 
nav_order:  2
---
* TOC
{:toc}


# Running Vivado on Apple Silicon mac
{: .no_toc}

As of early 2026, there's no officially supported way to run Vivado on Apple Silicon mac. We have managed to run **Vivado + Alchitry Lab V2 on Debian 12 + Rosetta**, running on UTM (virtual machines for Apple Silicon mac). This document shares how you can download the prepared image and run it using UTM. 


## System Requirement 
Apple Silicon mac with least 16 GB of RAM and **200GB** of free space for both **downloading** and **unzipping** (final free space needed: 140GB). You can use an external SSD + thunderbolt connection for this, directly store the VM image for usage, no need to migrate it to your machine. 

{: .note}
This method is tested on **M2 Max Mac Studio** and **15" M2 Macbook Air**. 

## Installation Steps
### Download UTM
You need to first [download UTM](https://mac.getutm.app). You can also use `brew` for this: 

```sh
brew update 
brew install --cask utm
```

### Download the VM Image 
After that, [download the VM Image from here](https://sutdapac-my.sharepoint.com/:f:/g/personal/natalie_agus_sutd_edu_sg/IgCvF5fdaeAsSZpf0VFA_o5_ATzvnyHRygV-_eXPNAeptVU?e=CeySho)
* You need to be <span className="orange-bold">signed in to your SUTD account</span> 
* This image comes with Debian 12, Rosetta, Vivado 2025.2, Alchitry Labs V2 pre-installed (2.0.52 Beta)

### Unzip
Then **unzip** the downloaded file, either using Finder or CLI: 
```sh
unzip <source.zip> -d <destination_directory>
```

It is recommended that you **download** this to an external drive, and then unzip and store the unzipped `.utm` file to your computer. This process will take about **10-20 minutes** because the size of the image is rather large (approx 40GB). You might want to move it out of your Downloads folder and put it somewhere more practical. This image will contain all your virtual machine's data. 

### Start the VM
Once done, open UTM and import the image. 

<img src="{{ site.baseurl }}//docs/FPGA/images/fpga_applesilicon/2026-02-10-09-30-19.png"  class="center_seventy no-invert"/>

### Share Directories with Host Machine 

You can **share directories** with your mac (host machine) by setting the desired shared directory in your host machine. You can view the steps [here](https://docs.getutm.app/basics/basics/).

Then in Debian (your VM), you can access this directory via the path `/media/share/DIRECTORY_NAME`, in this case it will be `/media/share/alchitry-utm`.

### Login as `debian`

{:.important}
Start the VM and login with the **password** **`debian`**. The `sudo` password is also `debian`.

Ensure that your desktop looks like this. If it doesn't it means that what you have downloaded might be corrupted. 

<img src="{{ site.baseurl }}/docs/FPGA/images/fpga_applesilicon/2024-03-25-17-35-03.png"  class="center_full no-invert"/>

### Launching Alchitry Labs 2

Upon login, a terminal window should automatically appear. If not, you can press the **CMD** button and select it from the dock, or via activities menu on the top left.


<img src="{{ site.baseurl }}//docs/FPGA/Lucid%20V2/images/fpga_applesilicon/2025-01-28-02-41-23.png"  class="center_thirty no-invert"/>

<img src="{{ site.baseurl }}//docs/FPGA/Lucid%20V2/images/fpga_applesilicon/2025-01-28-02-52-41.png"  class="center_seventy no-invert"/>


You can start alchitry labs by typing the `a2` command (an [alias](#run-alchitry-labs-with-local-jre) that launches the Alchitry Labs V2 binary). 

Key in `debian` as password when prompted.

```
debian@debian:~$ a2
[sudo] password for debian: [debian]
```

<img src="{{ site.baseurl }}//docs/FPGA/Lucid%20V2/images/fpga_applesilicon/2024-10-16-11-23-16.png"  class="center_seventy no-invert"/>

It will prompt you to create/open new project (first time) or open your last opened project (subsequently).

{:.note}
The VM also comes with **legacy** Alchitry Labs 1.2.7 (using Lucid V1). You can use command `alchitry` to spawn it. See `~/.bashrc` for details.

### Update Alchitry Labs V2

Update the IDE to the latest version (whenever you download the VM). See [this](#updating-alchitry-labs-in-the-vm) section.



## Loading .bin from your mac to Alchitry Au FPGA


After **building** your code, you will need to load the binary to your FPGA. There's no USB passthrough with the VM (it's not the usual QEMU), so you will need to <span class="orange-bold">migrate</span> `PROJECT_PATH/build/alchitry_au.bin` to your host machine and flash it to your FPGA using [Alchitry Loader part of the Alchitry Labs IDE for Apple Silicon](https://alchitry.com/Alchitry-Labs-V2/download.html).

If you have set up the [shared directory](#share-directories-with-host-machine) above, simply navigate to this location.

### Install Alchitry Labs V2 in your host macOS

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


## Updating Alchitry Labs in the VM 

### Delete the old version
Open terminal, navigate to `Downloads`, and remove the old version of alchitry labs:

```sh
cd ~/Downloads
rm -rf alchitry-labs-2*
```

### Download the new version
The VM image you download above comes with Alchitry Labs V2 `2.0.24`. It is **likely** that the author will bump the version from time to time. To download the latest build, go to the [download](https://alchitry.com/Alchitry-Labs-V2/download.html) page.  



Click the `Download.tar.gz` (<span class="orange-bold">not</span> the .deb!):

<img src="{{ site.baseurl }}//docs/FPGA/Lucid%20V2/images/fpga_applesilicon/2025-01-28-02-19-04.png"  class="center_seventy no-invert"/>

Afterwards, open the terminal and cd to `Downloads`, and unzip the tarball, and remove the old tarball once done: 


```sh
cd ~/Downloads
tar -xvzf *linux-amd64.tar.gz
rm *linux-amd64.tar.gz 
```

You should see a new folder created corresponding to the version of the alchitry labs:
<img src="{{ site.baseurl }}//docs/FPGA/Lucid%20V2/images/fpga_applesilicon/2025-01-28-02-45-35.png"  class="center_seventy no-invert"/>

### Run Alchitry Labs with local JRE 

You can run Alchitry Labs as per normal using the command `a2`. It is an alias, defined in `~/.bashrc`.

```sh
# ~/.bashrc
alias a2='sudo java \
-Dapp.dir=$(find /home/debian/Downloads/alchitry-labs* -maxdepth 0 -type d)/lib/runtime \
-Djava.library.path=$(find /home/debian/Downloads/alchitry-labs* -maxdepth 0 -type d)/lib/runtime/lib \
-cp "$(find /home/debian/Downloads/alchitry-labs* -maxdepth 0 -type d)/lib/app/*" \
com.alchitry.labs2.GUIKt'
```

> Note that you can't just run the binary listed under `/bin` because it will use the pre-bundled JRE, and it causes some problems with Vivado 2025.2. Therefore we aliased the command `a2` to run the `.jar` file with the local JRE.

{:.important}
Ensure that in `~/Downloads` you have **deleted** the old alchitry labs directory and only has the most recent one


### Updating Java Version

The newest Alchitry Labs V2 requires Java 22 or newer at the time of this writing. The VM comes with Java 22. However, should it require newer version of Java, then you might need to upgrade your java version to run it. First, go to [Oracle website](docs/FPGA/images/Screenshot 2025-02-13 at 4.03.48 PM.png) and download the latest java <span class="orange-bold">for x64 architecture</span> (not ARM64!):

<img src="{{ site.baseurl }}/docs/FPGA/images/Screenshot 2025-02-13 at 4.03.48 PM.png"  class="center_seventy"/>

The compressed file should be downloaded to `~/Downloads` directory. From there, extract it and move to `/usr/lib/jvm`:

```bash
cd ~/Downloads
sudo tar -xvzf jdk-VERSION_linux-x64_bin.tar.gz -C /usr/lib/jvm
```


Then update `update-alternatives`:

{:.important}
Replace `VERSION` with whatever version you are downloading, e.g: `23.0.2`


```bash
sudo update-alternatives --install /usr/bin/java java /usr/lib/jvm/jdk-VERSION/bin/java 1
sudo update-alternatives --install /usr/bin/javac javac /usr/lib/jvm/jdk-VERSION/bin/javac 1
sudo update-alternatives --install /usr/bin/jar jar /usr/lib/jvm/jdk-VERSION/bin/jar 1
```

Then set the new JDK as default:

```bash
sudo update-alternatives --config java
``` 

You’ll see a list of installed JDKs—choose the number corresponding to `/usr/lib/jvm/jdk-VERSION/bin/java`. 

## Running Vivado

You can run Vivado directly in the VM using the command `vivado`:

<img src="{{ site.baseurl }}//docs/FPGA/images/fpga_applesilicon/2026-02-10-09-39-13.png"  class="center_seventy no-invert"/>

`vivado` is really just an alias to run Vivado binary using `sudo`:

```bash
# defined in bashrc
alias vivado ="sudo ~/Xilinx/2025.2/Vivado/bin/vivado"
```

### Open a Sample Project

You can open the given sample project `vivado-base-2025-2` located at `~/Desktop/2025.2`. This is a starter project provided to program the Alchitry Au FPGA, complete with the constraint file and demo code (it's basically the `io_demo_v1_pulldown` template):

Opening the project should give you this window.

<img src="{{ site.baseurl }}//docs/FPGA/images/fpga_applesilicon/2026-02-10-09-40-52.png"  class="center_seventy no-invert"/>

You can try to Generate Bitstream (bottom left of the window) to compile the sources. After synthesis and implementation is completed, you should find the binary `alchitry.bin` under the directory `<PROJECT_DIR>/<PROJECT_NAME>.runs/impl_1/alchitry_top.bin`:

<img src="{{ site.baseurl }}//docs/FPGA/images/fpga_applesilicon/2026-02-10-09-42-36.png"  class="center_seventy no-invert"/>

Migrate the `.bin` file to your host macOS and use [Alchitry Loader](#alchitry-loader) to load that to your FPGA.

