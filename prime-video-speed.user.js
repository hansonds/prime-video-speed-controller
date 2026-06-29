// ==UserScript==
// @name         Prime Video Speed Controller
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adds on-screen buttons to control playback speed on Amazon Prime Video (Auto-hiding)
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
    let fadeTimeout;

    // Function to change the video speed
    function setSpeed(speed) {
        targetSpeed = speed;
        const videos = document.querySelectorAll('video');
        if (videos.length > 0) {
            videos.forEach(video => {
                video.playbackRate = targetSpeed;
            });
            updateButtonColors(); // Refresh active colors
            showToast(`Speed set to ${speed}x`);
        } else {
            showToast('No video found playing right now.');
        }
    }

    // Function to visually highlight the selected speed button
    function updateButtonColors() {
        const container = document.getElementById('pv-speed-controller');
        if (!container) return;
        
        const buttons = container.querySelectorAll('.speed-btn');
        buttons.forEach(btn => {
            const btnSpeed = parseFloat(btn.dataset.speed);
            if (btnSpeed === targetSpeed) {
                // Active color (Lighter)
                btn.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
                btn.style.borderColor = '#ffffff';
                btn.style.color = '#ffffff';
            } else {
                // Inactive color
                btn.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                btn.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                btn.style.color = 'rgba(255, 255, 255, 0.8)';
            }
        });
    }

    // Function to wake up the UI when the mouse moves
    function wakeUpUI() {
        const ui = document.getElementById('pv-speed-controller');
        if (ui) {
            ui.style.opacity = '1';
            ui.style.pointerEvents = 'auto'; // Re-enable clicks when visible
            
            clearTimeout(fadeTimeout);
            
            // Hide after 2.5 seconds of inactivity
            fadeTimeout = setTimeout(() => {
                ui.style.opacity = '0';
                ui.style.pointerEvents = 'none'; // Prevent invisible clicks
            }, 2500); 
        }
    }

    // Listen for mouse movement anywhere on the page to wake up the UI
    document.addEventListener('mousemove', wakeUpUI);

    // Function to display a temporary notification
    function showToast(message) {
        let toast = document.getElementById('pv-speed-toast');
        const container = document.fullscreenElement || document.body;

        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'pv-speed-toast';
            Object.assign(toast.style, {
                position: 'absolute',
                top: '70px',
                left: '20px',
                zIndex: '2147483647',
                backgroundColor: 'rgba(0, 168, 225, 0.9)', 
                color: '#ffffff',
                padding: '10px 15px',
                borderRadius: '5px',
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'opacity 0.3s ease-in-out',
                pointerEvents: 'none',
                opacity: '0'
            });
        }
        
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
        if (existingUI) existingUI.remove();

        const wrapper = document.createElement('div');
        wrapper.id = 'pv-speed-controller';

        Object.assign(wrapper.style, {
            position: 'absolute',
            top: '20px',
            left: '20px',
            zIndex: '2147483647',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '8px',
            borderRadius: '8px',
            display: 'flex',
            gap: '8px',
            backdropFilter: 'blur(5px)',
            alignItems: 'center',
            transition: 'opacity 0.4s ease', // Smooth fade in/out
            opacity: '1' 
        });

        const speeds = [1, 1.25, 1.5, 2];
        speeds.forEach(speed => {
            const btn = document.createElement('button');
            btn.innerText = speed + 'x';
            btn.className = 'speed-btn'; // Class for easy selection
            btn.dataset.speed = speed;   // Store speed value on the element

            Object.assign(btn.style, {
                padding: '5px 12px',
                cursor: 'pointer',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 'bold',
                fontFamily: 'Arial, sans-serif',
                transition: 'all 0.2s',
                borderStyle: 'solid',
                borderWidth: '1px'
            });

            // Hover effects (only apply if it's not the currently active button)
            btn.onmouseover = () => {
                if (parseFloat(btn.dataset.speed) !== targetSpeed) {
                    btn.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                }
            };
            btn.onmouseout = () => updateButtonColors(); // Reset to standard/active state

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                setSpeed(speed);
            });

            wrapper.appendChild(btn);
        });

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
        
        // Initialize the correct button colors and set the initial fade timer
        updateButtonColors();
        wakeUpUI();
    }

    // Master Enforcement Loop
    setInterval(() => {
        const videos = document.querySelectorAll('video');
        const activeContainer = document.fullscreenElement || document.body;
        const uiExists = document.getElementById('pv-speed-controller');

        if (videos.length > 0) {
            videos.forEach(v => {
                if (v.playbackRate !== targetSpeed) {
                    v.playbackRate = targetSpeed;
                }
            });

            if (!uiExists || uiExists.parentElement !== activeContainer) {
                injectUI(activeContainer);
            }
        } else if (uiExists) {
            uiExists.remove();
        }
    }, 1000);

})();
