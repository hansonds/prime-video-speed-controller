# Prime Video & Hotstar Speed Controller 🎬⚡

A lightweight Tampermonkey userscript that adds a clean, smart, on-screen control panel to **Amazon Prime Video** and **Disney+ Hotstar**, allowing you to easily adjust playback speeds without digging through menus. 

Created by **Hanson** | [phoenicx.org](https://phoenicx.org)

## Features
* **Multi-Platform Support:** Works seamlessly on both Amazon Prime Video and Disney+ Hotstar.
* **Custom Playback Speeds:** Instantly switch between 1x, 1.25x, 1.5x, and 2x speeds.
* **Smart Auto-Hide UI:** The sleek, semi-transparent control panel automatically fades out after 2.5 seconds of mouse inactivity so it doesn't block your movie. Move your mouse to wake it instantly.
* **True Fullscreen Support:** Dynamically attaches to the active viewing layer, meaning your controls won't disappear when you enter fullscreen mode.
* **Persistent Speed Enforcement:** Actively prevents Prime Video and Hotstar from stealthily resetting your speed back to 1.0x between episodes. 
* **Visual Feedback:** The currently active speed stays highlighted, and a brief notification toast confirms when the speed has been successfully changed.

## Prerequisites
To use this script, you need a userscript manager installed in your web browser. 
* **Chrome / Edge / Safari:** [Tampermonkey](https://www.tampermonkey.net/)
* **Firefox:** [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) or Tampermonkey

## Installation

**Method 1: Direct Install (Easiest)**
1. Ensure you have Tampermonkey installed in your browser.
2. Click this link to install the script automatically:
   👉 **[Install Script](https://raw.githubusercontent.com/hansonds/prime-video-speed-controller/main/prime-video-speed.user.js)** *(Note: Ensure this filename matches your repository)*
3. A Tampermonkey tab will open. Click **Install**.

**Method 2: Manual Install**
1. Click the Tampermonkey extension icon in your browser and select **Create a new script...**
2. Delete the default code in the editor.
3. Copy all the code from the `.user.js` file in this repository.
4. Paste it into the Tampermonkey editor.
5. Go to **File > Save** (or press `Ctrl+S` / `Cmd+S`).

## How to Use
1. Open any movie or TV show on [Prime Video](https://www.primevideo.com/) or [Hotstar](https://www.hotstar.com/).
2. Once the video starts playing, hover your mouse over the screen. Look at the **top-left corner** to see the control panel fade in.
3. Click the desired speed button (1x, 1.25x, 1.5x, 2x). The active speed will turn white.
4. Stop moving your mouse, and the UI will gracefully fade away. Enjoy watching at your preferred speed!

## Support
If you find this script useful, check out more of my work at [phoenicx.org](https://phoenicx.org).
