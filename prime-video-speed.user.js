// ==UserScript==
// @name         Prime Video Speed Controller
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds on-screen buttons to control playback speed on Amazon Prime Video
// @author       Hanson
// @homepageURL  https://phoenicx.org
// @match        *://*.primevideo.com/*
// @match        *://*.amazon.com/*
// @match        *://*.amazon.co.uk/*
// @match        *://*.amazon.de/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let targetSpeed = 1.0;

    // Function to change the video speed
    function setSpeed(speed) {
        targetSpeed = speed;
        const videos = document.querySelectorAll('video');
        if (videos.length > 0) {
            videos.forEach(video => {
                video.playbackRate = targetSpeed;
            });
            showToast(`Speed set to ${speed}x`);
        } else {
            showToast('No video found playing right now.');
        }
    }

    // Function to display a temporary notification
    function showToast(message) {
        let toast = document.getElementById('pv-speed-toast');
        const container = document.fullscreenElement || document.body;

        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'pv-speed-toast';
            Object.assign(toast.style, {
                position: 'absolute', // Changed to absolute for better fullscreen compatibility
                top: '70px',
                left: '20px',
                zIndex: '2147483647', // Max z-index
                backgroundColor: 'rgba(0, 168, 225, 0.9)', 
                color: '#ffffff',
                padding: '10px 15px',
                borderRadius: '5px',
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'opacity 0.3s ease-in-out',
                pointerEvents: 'none'
            });
        }
        
        // Ensure it's in the right container (handles fullscreen toggling)
        if (toast.parentElement !== container) {
            container.appendChild(toast);
        }

        toast.innerText = message;
        toast.style.opacity = '1';

        clearTimeout(window.toastTimeout);
        window.toastTimeout = setTimeout(() => {
            toast.style.opacity = '0';
        }, 2000);
    }

    // Function to build and inject the UI panel
    function injectUI(container) {
        const existingUI = document.getElementById('pv-speed-controller');
        if (existingUI) existingUI.remove(); // Clean up before re-injecting

        const wrapper = document.createElement('div');
        wrapper.id = 'pv-speed-controller';

        Object.assign(wrapper.style, {
            position: 'absolute', // Absolute binds it to the relative fullscreen container
            top: '20px',
            left: '20px',
            zIndex: '2147483647', // Max z-index
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '8px',
            borderRadius: '8px',
            display: 'flex',
            gap: '8px',
            backdropFilter: 'blur(5px)',
            alignItems: 'center'
        });

        // Add Speed Buttons
        const speeds = [1, 1.25, 1.5, 2];
        speeds.forEach(speed => {
            const btn = document.createElement('button');
            btn.innerText = speed + 'x';

            Object.assign(btn.style, {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '5px 12px',
                cursor: 'pointer',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 'bold',
                fontFamily: 'Arial, sans-serif'
            });

            btn.onmouseover = () => btn.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            btn.onmouseout = () => btn.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                setSpeed(speed);
            });

            wrapper.appendChild(btn);
        });

        // Add "Created by Hanson" credit link
        const credit = document.createElement('a');
        credit.innerText = 'by Hanson';
        credit.href = 'https://phoenicx.org';
        credit.target = '_blank';

        Object.assign(credit.style, {
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '12px',
            fontFamily: 'Arial, sans-serif',
            textDecoration: 'none',
            marginLeft: '5px',
            transition: 'color 0.2s'
        });

        credit.onmouseover = () => credit.style.color = '#ffffff';
        credit.onmouseout = () => credit.style.color = 'rgba(255, 255, 255, 0.5)';

        wrapper.appendChild(credit);
        container.appendChild(wrapper);
    }

    // Master Enforcement Loop
    setInterval(() => {
        const videos = document.querySelectorAll('video');
        const activeContainer = document.fullscreenElement || document.body;
        const uiExists = document.getElementById('pv-speed-controller');

        if (videos.length > 0) {
            // 1. Force the speed constantly (overrides Prime Video's auto-reset)
            videos.forEach(v => {
                if (v.playbackRate !== targetSpeed) {
                    v.playbackRate = targetSpeed;
                }
            });

            // 2. Ensure UI is always in the active viewing layer (handles fullscreen)
            if (!uiExists || uiExists.parentElement !== activeContainer) {
                injectUI(activeContainer);
            }
        } else if (uiExists) {
            // Clean up if no video is on screen
            uiExists.remove();
        }
    }, 1000); // Check every second

})();
