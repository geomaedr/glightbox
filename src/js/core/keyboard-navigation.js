/**
 * Keyboard Navigation
 * Allow navigation using the keyboard with standard HTML accessibility
 *
 * @param {object} instance
 */

import { addEvent } from '../utils/helpers.js';

export default function keyboardNavigation(instance) {
    if (instance.events.hasOwnProperty('keyboard')) {
        return false;
    }

    instance.events['keyboard'] = addEvent('keydown', {
        onElement: window,
        withCallback: (event, target) => {
            event = event || window.event;
            const key = event.keyCode;
            
            // Only handle keyboard events if the lightbox is open
            if (!instance.lightboxOpen) {
                return;
            }
            
            // Don't interfere with focus trap's Tab handling
            // The focus trap utility handles Tab key navigation
            
            // Arrow key navigation for slides
            if (key == 39) { // Right arrow
                instance.nextSlide();
            }
            if (key == 37) { // Left arrow  
                instance.prevSlide();
            }
            if (key == 27) { // Escape
                instance.close();
            }
            
            // Space or Enter to activate focused button
            if (key == 32 || key == 13) { // Space or Enter
                const activeElement = document.activeElement;
                if (activeElement && activeElement.classList.contains('gbtn')) {
                    event.preventDefault();
                    activeElement.click();
                }
            }
        }
    });
}
