# Compiled OpenAuto Build Instructions
([PopupRobots](http://www.norfolkjs.org/) on [March 15, 2018](https://www.meetup.com/NorfolkJS/events/246940328/))

The instructions I have here are just the build instructions from [aasdk](https://github.com/f1xpl/aasdk/wiki/Build-instructions) and [OpenAuto](https://github.com/f1xpl/openauto/wiki/Build-instructions) put into one slightly easier to follow set of instructions. The instructions here are largely the same as the ones on the official pages, outside of some rewording and notes I felt were worth including. 
Feel free to just ignore me and go to the official pages if it's been some time since this was built, or if you just don't trust me. It's cool, I understand. (Jerk. I'm just kidding, we're all good <3) 
*Instruction list was built on 3/15/2018.*

## Requirements
- Raspberry PI 3
- Stable power supply with a current of at least 2A.
- Micro SD card 8GB or larger.
- [Raspbian Stretch Desktop](https://www.raspberrypi.org/downloads/raspbian/)
- 256MB of GPU memory (configure Memory split via raspi-config).
- Touchscreen (not actually required, but highly recommended for ease of use in my experience)
### Suggestions and Accessories
- USB Sound card with microphone input + microphone (Better audio out and allows use of voice commands)
- Bluetooth 4.0 USB dongle (if you want to use HFP/A2DP bluetooth features)
- Touchscreen or mouse (if you want to use touch feature)
- Keyboard (if you want to use buttons)
- Powered usb hub (helps give attached devices more power with less draw from the PI)


# Build Guide
## aasdk
*Software and Packages Needed (Installed in first step)*
- CMake
- OpenSSL
- Boost libraries 1.61 or higher
- libusb 1.0.0 or higher
- Protocol buffers 3.0 or higher
- C++ compiler with support of C++14 standard

### Instructions
* *I highly recommend running `sudo apt-get update` prior to continuing to prevent issues with installing packages. Especially if this is from scratch.* 

1. Install needed packages and software
`$ sudo apt-get install -y libboost-all-dev libusb-1.0.0-dev libssl-dev cmake libprotobuf-dev protobuf-c-compiler protobuf-compiler`

2. Clone aasdk repository
`$ cd`
`$ git clone -b master https://github.com/f1xpl/aasdk.git`

3. Create aasdk_build directory at the same level as aasdk dir
`$ mkdir aasdk_build`
`$ cd aasdk_build`

4. Generate cmake files
`$ cmake -DCMAKE_BUILD_TYPE=Release ../aasdk`

5. Build aasdk
`$ make`

## OpenAuto
*Software and Packages Needed (Installed in step 6 or built above)*
- aasdk (Which we built in steps 1-5 above)
- Qt libraries (multimedia, bluetooth, connectivity)

### Instructions
6. Install needed software
`$ sudo apt-get install -y libqt5multimedia5 libqt5multimedia5-plugins libqt5multimediawidgets5 qtmultimedia5-dev libqt5bluetooth5 libqt5bluetooth5-bin qtconnectivity5-dev pulseaudio`

7. Build ilclient from Raspberry PI 3 firmware
`$ cd /opt/vc/src/hello_pi/libs/ilclient`
`$ make`

8. Clone openauto repository
`$ cd`
`$ git clone -b master https://github.com/f1xpl/openauto.git`

9. Create openauto_build directory at the same level as openauto dir
`$ mkdir openauto_build`
`$ cd openauto_build`

10. Generate cmake files
Note: If needed, adjust paths accordingly to your aasdk and aasdk_build directories location.

`$ cmake -DCMAKE_BUILD_TYPE=Release -DRPI3_BUILD=TRUE -DAASDK_INCLUDE_DIRS="/home/pi/aasdk/include" -DAASDK_LIBRARIES="/home/pi/aasdk/lib/libaasdk.so" -DAASDK_PROTO_INCLUDE_DIRS="/home/pi/aasdk_build" -DAASDK_PROTO_LIBRARIES="/home/pi/aasdk/lib/libaasdk_proto.so" ../openauto`

11. Build openauto
`$ make`

12. Run openauto
Note: Not sure if you actually need to run it yet since it is still missing the audio 
`$ /home/pi/openauto/bin/autoapp`

## udev rules (Adding USB Permissions)
In order to use OpenAuto with Linux-based OS (e.g. Raspbian) with udev, you must create a rule to allow communication with USB devices in R/W mode. The simplest rule can look like below one:
> SUBSYSTEM=="usb", ATTR{idVendor}=="*", ATTR{idProduct}=="*", MODE="0660", GROUP="plugdev"

In order to add this rule to udev, enter the following commands:
`$ cd /etc/udev/rules.d`
`$ sudo touch openauto.rules`
`$ sudo nano openauto.rules`

then paste the above rule, save the file, and reboot your device.

**Please notice that above rule allows to open any USB device in R/W mode by any app installed on the system. Consider it as insecure and create your own secure rules.*

## Pulseaudio Configuration
AndroidAuto's audio packets are delivered in very small chunks. Due this adjustments of PulseAudio configuration might be needed to avoid audio glitches.

Add/override below lines in `/etc/pulse/daemon.conf`
> default-fragments = 8
> default-fragment-size-msec = 5

then go to `/etc/pulse/default.pa` and add `tsched=0` at the end of the line `load-module module-udev-detect` so it looks like this:
> load-module module-udev-detect tsched=0

After the config changes you must restart your pulseaudio instance. 
You can do so by entering the `pulseaudio -k` command in the terminal.


## Optional Configurations

### Add OpenAuto to autorun
1. Open autostart file
`$ sudo nano /home/pi/.config/lxsession/LXDE-pi/autostart`

2. Add the following line at the end of autorun file:
> @/home/pi/openauto/bin/autoapp

### Keyboard Button Bindings
*I'm not sure if these are default bindings or suggested ones, but I figured I should include it for completeness*

* Enter -> [Enter]
* Left -> [Left]
* Right -> [Right]
* Up -> [Up]
* Down -> [Down]
* Back -> [Esc]
* Home -> [H]
* Phone -> [P]
* Call end -> [O]
* Play -> [X]
* Pause -> [C]
* Previous track -> [V] / [Media Previous]
* Next track -> [N] / [Media Next]
* Toggle play -> [B] / [Media Play]
* Voice command -> [M]
* Wheel left -> [1]
* Wheel right -> [2]

### HFP and A2DP setup for Raspberry PI 3


### Enable Mouse Pointer Visibility in OpenAuto
*This wasn't working for me but I probably did something wrong, so go for it if you want.*

If you do not have touchscreen yet and want to test OpenAuto with your TV or any other display without touch capabilities, visibility of mouse pointer will be useful indeed.

In order to make mouse pointer visible you must do the following:
1. Connect keyboard to your RPi
2. Start OpenAuto and use `tab` key to select "Toggle mouse cursor" button. When the button is highlighted use the `spacebar` to activate it.
3. Go to the OpenAuto Settings -> Video Tab and change value of OMX Layer to 0.
4. Save settings and connect your phone.
5. Mouse cursor should be visible now.

### Shutdown Raspberry PI 3 when phone is disconnected

1. Open openauto.rules file
`$ sudo nano /etc/udev/rules.d/openauto.rules`

2. Add the following lines at the end of the openauto.rules file:
> SUBSYSTEM=="usb", ACTION=="remove", ENV{ID_VENDOR_ID}=="18d1", ENV{ID_MODEL_ID}=="2d00", RUN+="/sbin/halt -p"
> SUBSYSTEM=="usb", ACTION=="remove", ENV{ID_VENDOR_ID}=="18d1", ENV{ID_MODEL_ID}=="2d01", RUN+="/sbin/halt -p"