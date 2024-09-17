// Utility function to check if an element is visible in the viewport
export function isElementInViewport(el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    return rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);
}