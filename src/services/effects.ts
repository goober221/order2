export function scrollToDiv(divId: string) {
    const element = document.getElementById(divId);
    if (element && !checkVisibility(element)) {
        element.scrollIntoView({ behavior: 'instant' });
    }
}

function checkVisibility(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();

    const isVisible =
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth);

    return isVisible;
}