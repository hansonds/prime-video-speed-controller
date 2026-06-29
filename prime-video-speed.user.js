// ==UserScript==
// @name         Prime Video Speed Controller
// @namespace    http://tampermonkey.net/
// @version      1.1
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

    // Function to change the video speed
    function setSpeed(speed) {
        const video = document.querySelector('video');
        if (video) {
            video.playbackRate = speed;
            showToast(`Speed set to ${speed}x`);
        } else {
            showToast('No video found playing right now.');
        }
    }

    // Function to display a temporary notification
    function showToast(message) {
        let toast = document.getElementById('pv-speed-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'pv-speed-toast';
            // Styling the notification
            Object.assign(toast.style, {
                position: 'fixed',
                top: '70px',
                left: '20px',
                zIndex: '9999999',
                backgroundColor: 'rgba(0, 168, 225, 0.9)', // Prime Video Blue
                color: '#ffffff',
                padding: '10px 15px',
                borderRadius: '5px',
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'opacity 0.3s ease-in-out',
                pointerEvents: 'none'
            });
            document.body.appendChild(toast);
        }
        
        toast.innerText = message;
        toast.style.opacity = '1';
        
        clearTimeout(window.toastTimeout);
        window.toastTimeout = setTimeout(() => {
            toast.style.opacity = '0';
        }, 2000);
    }

    // Function to build and inject the UI panel
    function injectUI() {
        if (document.getElementById('pv-speed-controller')) return;

        const container = document.createElement('div');
        container.id = 'pv-speed-controller';
        
        // Styling the control panel
        Object.assign(container.style, {
            position: 'fixed',
            top: '20px',
            left: '20px',
            zIndex: '9999998',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            padding: '8px',
            borderRadius: '8px',
            display: 'flex',
            gap: '8px',
            backdropFilter: 'blur(5px)',
            transition: 'opacity 0.3s',
            alignItems: 'center'
        });

        // Add Speed Buttons
        const speeds = [1, 1.25, 1.5, 2];
        speeds.forEach(speed => {
            const btn = document.createElement('button');
            btn.innerText = speed + 'x';
            
            // Styling the buttons
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

            // Hover effects
            btn.onmouseover = () => btn.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            btn.onmouseout = () => btn.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';

            // Click event to change speed
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                setSpeed(speed);
            });

            container.appendChild(btn);
        });

        // Add "Created by Hanson" credit link
        const credit = document.createElement('a');
        credit.innerText = 'by Hanson';
        credit.href = 'https://phoenicx.org';
        credit.target = '_blank'; // Opens in a new tab
        
        // Styling the credit link
        Object.assign(credit.style, {
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '12px',
            fontFamily: 'Arial, sans-serif',
            textDecoration: 'none',
            marginLeft: '5px',
            transition: 'color 0.2s'
        });

        // Hover effect for the link
        credit.onmouseover = () => credit.style.color = '#ffffff';
        credit.onmouseout = () => credit.style.color = 'rgba(255, 255, 255, 0.5)';

        container.appendChild(credit);
        document.body.appendChild(container);
    }

    // Prime Video is a Single Page Application (SPA), so we periodically check 
    // if a video is present to inject the UI.
    setInterval(() => {
        const video = document.querySelector('video');
        const uiExists = document.getElementById('pv-speed-controller');
        
        if (video && !uiExists) {
            injectUI();
        } else if (!video && uiExists) {
            // Hide/remove the UI if the user leaves the video player
            uiExists.remove();
        }
    }, 2000);

})();