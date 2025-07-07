/**
 * Focus Trap Utility
 * Manages focus within a modal to prevent focus from escaping
 * Ensures proper accessibility for keyboard users
 */

/**
 * Get all focusable elements within a container
 * @param {Element} container 
 * @returns {Array} Array of focusable elements
 */
function getFocusableElements(container) {
    var focusableSelectors = [
        '.gbtn:not(.disabled)',
        'a[href]',
        'area[href]',
        'input:not([disabled]):not([type="hidden"])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'button:not([disabled])',
        'iframe',
        'object',
        'embed',
        '[contenteditable]',
        '[tabindex]:not([tabindex^="-"])'
    ].join(',');

    return Array.from(container.querySelectorAll(focusableSelectors)).filter(el => {

        // Check if element is visible and not hidden
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && 
               style.visibility !== 'hidden' && 
               el.offsetWidth > 0 && 
               el.offsetHeight > 0 ;
    });
}

/**
 * Focus Trap Class
 * Manages focus trapping within a modal
 */
export class FocusTrap {
    constructor(container) {
        this.container = container;
        this.previouslyFocusedElement = null;
        this.isActive = false;
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    /**
     * Activate the focus trap
     * @param {Element} triggerElement - The element that opened the modal
     */
    activate(triggerElement = null) {
        if (this.isActive) return;
        
        // Store the previously focused element
        this.previouslyFocusedElement = triggerElement || document.activeElement;
        
        // Add event listener for Tab key
        document.addEventListener('keydown', this.handleKeyDown);
        
        // Set initial focus
        this.setInitialFocus();
        
        this.isActive = true;
    }

    /**
     * Deactivate the focus trap and restore focus
     */
    deactivate() {
        if (!this.isActive) return;
        
        // Remove event listener
        document.removeEventListener('keydown', this.handleKeyDown);
        
        // Restore focus to the previously focused element
        if (this.previouslyFocusedElement && typeof this.previouslyFocusedElement.focus === 'function') {
            // Use setTimeout to ensure the modal is fully closed before restoring focus
            setTimeout(() => {
               // this.previouslyFocusedElement.focus();
            }, 100);
        }
        
        this.isActive = false;
        this.previouslyFocusedElement = null;
    }

    /**
     * Set initial focus when modal opens
     */
    setInitialFocus() {
        const focusableElements = getFocusableElements(this.container);
        
        if (focusableElements.length > 0) {
            // Focus the first focusable element (typically a button)
            focusableElements[0].focus();
        } else {
            // If no focusable elements, focus the container itself
            this.container.focus();
        }
    }

    /**
     * Handle Tab key navigation
     * @param {KeyboardEvent} event 
     */
    handleKeyDown(event) {
        if (event.key !== 'Tab') return;
        
        const focusableElements = getFocusableElements(this.container);
        
        if (focusableElements.length === 0) {
            // If no focusable elements, prevent tabbing
            event.preventDefault();
            return;
        }
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (event.shiftKey) {
            // Shift + Tab (backward)
            if (document.activeElement === firstElement || !this.container.contains(document.activeElement)) {
                event.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab (forward)
            if (document.activeElement === lastElement || !this.container.contains(document.activeElement)) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    }
}

export default FocusTrap; 