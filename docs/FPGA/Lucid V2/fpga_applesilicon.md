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
After that, download the image from [here](https://sutdapac-my.sharepoint.com/:u:/g/personal/natalie_agus_sutd_edu_sg/ETc9Zr6Np4hBioSaB_ojFNEBaphgzJVUBxi89k3H6gpWmQ?e=0j0viS)
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
You can start alchitry labs by opening terminal from the bottom menu of the desktop (press **command** if the dock isn't visible to show it, or the top left **activity** button). Then select Terminal from the dock:


<img src="{{ site.baseurl }}//docs/FPGA/Lucid%20V2/images/fpga_applesilicon/2025-01-28-02-41-23.png"  class="center_thirty no-invert"/>

<img src="{{ site.baseurl }}//docs/FPGA/Lucid%20V2/images/fpga_applesilicon/2025-01-28-02-52-41.png"  class="center_seventy no-invert"/>

 and type `a2` command (an alias that launches the Alchitry Labs V2 binary). 

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


## Updating Alchitry Labs in the VM 

### Delete the old version
Open terminal, navigate to `Downloads`, and remove the old version of alchitry labs:

```
cd ~/Downloads
rm -rf alchitry-labs-2*
```

### Download the new version
The VM image you download above comes with Alchitry Labs V2 `2.0.24`. It is **likely** that the author will bump the version from time to time. To download the latest build, go to the [download](https://alchitry.com/Alchitry-Labs-V2/download.html) page.  



Click the `Download.tar.gz` (not the .deb!):

<img src="{{ site.baseurl }}//docs/FPGA/Lucid%20V2/images/fpga_applesilicon/2025-01-28-02-19-04.png"  class="center_seventy no-invert"/>

Afterwards, open the terminal and cd to `Downloads`, and unzip the tarball, and remove the old tarball once done: 


```
cd ~/Downloads
tar -xvzf *linux-amd64.tar.gz
rm *linux-amd64.tar.gz 
```

You should see a new folder created corresponding to the version of the alchitry labs:
<img src="{{ site.baseurl }}//docs/FPGA/Lucid%20V2/images/fpga_applesilicon/2025-01-28-02-45-35.png"  class="center_seventy no-invert"/>

### Run Alchitry Labs with local JRE 

You can run Alchitry Labs as per normal using the command `a2`. 


```
# ~/.bashrc
alias a2='sudo java \
-Dapp.dir=$(find /home/debian/Downloads/alchitry-labs* -maxdepth 0 -type d)/lib/runtime \
-Djava.library.path=$(find /home/debian/Downloads/alchitry-labs* -maxdepth 0 -type d)/lib/runtime/lib \
-cp "$(find /home/debian/Downloads/alchitry-labs* -maxdepth 0 -type d)/lib/app/*" \
com.alchitry.labs2.GUIKt'
```

> Note that you can't just run the binary listed under `/bin` because it will use the pre-bundled JRE. We aliased the command `a2` to run the `.jar` file with the local JRE:

{:.important}
Ensure that in `~/Downloads` you have **deleted** the old alchitry labs directory and only has the most recent one




<!-- 
For some reason, you cannot use the pre-compiled Linux binary from the [**release**](https://github.com/alchitry/Alchitry-Labs-V2/releases) page (linux-amd64) because the JRE that comes with it just couldn't execute Vivado at 

### Pull the latest changes 
Alchitry Labs is **installed** on this directory: `/home/debian/Alchitry-Labs-V2`. Navigate there and run `git pull` to clone the latest change: 

```
cd /home/debian/Alchitry-Labs-V2
git pull
```

### Merge Conflicts
You might be met with some conflict as follows:

<img src="{{ site.baseurl }}//docs/FPGA/Lucid%20V2/images/fpga_applesilicon/2025-01-28-01-38-07.png"  class="center_seventy no-invert"/>

Open the file causing the conflict using `nano`:

`nano src/main/kotlin/com/alchitry/labs2/project/Locations.kt`


Scroll down until you see some kind of conflict beginning with `>>>>>>` and ending with `<<<<<<`:

<img src="{{ site.baseurl }}//docs/FPGA/Lucid%20V2/images/fpga_applesilicon/2025-01-28-01-40-59.png"  class="center_seventy no-invert"/>

Edit them completely so the declarations above look like this:

<img src="{{ site.baseurl }}//docs/FPGA/Lucid%20V2/images/fpga_applesilicon/2025-01-28-01-47-54.png"  class="center_seventy no-invert"/>

Then, exit `nano` using `Ctrl + X`. 

### Compile 
Then run  `./gradlew clean createDistributable` to recompile the project. It should take 3-5 minutes. 

You should see `BUILD SUCCESSFULL` message at the end:

<img src="{{ site.baseurl }}//docs/FPGA/Lucid%20V2/images/fpga_applesilicon/2025-01-28-02-05-53.png"  class="center_seventy no-invert"/>

### Run Alchitry Labs V2 

Once compiled, you should be able to run Alchitry Labs V2 as per normal using the `a2` command. 

{:.highlight}
Contact Natalie if you found any issue(s) with the installation. -->
