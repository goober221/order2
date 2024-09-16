
// Function to hide or show a thread
import {enqueueSnackbar} from "notistack";
import {isElementInViewport} from "./utilities.ts";

export function hideThread(threadNumber: string, setHiddenThreads: React.Dispatch<React.SetStateAction<string[]>>) {
    setHiddenThreads(prev => {
        let updatedThreads = [...prev];
        if (updatedThreads.includes(threadNumber)) {
            updatedThreads = updatedThreads.filter(i => i !== threadNumber);
            snackbarActions('Тред показан.')
            return updatedThreads;
        } else {
            updatedThreads = [...updatedThreads, threadNumber];
        }
        localStorage.setItem('hiddenThreads', updatedThreads.join(','));
        snackbarActions('Тред скрыт.')
        return updatedThreads;
    });
}

// Method to scroll the thread card into view if it's not fully visible
export function scrollToThreadIfNotVisible(threadNumber: string) {
    const threadCard = document.getElementById(`thread-${threadNumber}`);
    if (threadCard && !isElementInViewport(threadCard)) {
        threadCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

export function favThread(threadNumber: string, setHavedThreads: React.Dispatch<React.SetStateAction<string[]>>) {
    setHavedThreads(prev => {
        let updatedThreads = [...prev];
        if (updatedThreads.includes(threadNumber)) {
            updatedThreads = updatedThreads.filter(i => i !== threadNumber);
            snackbarActions('Тред удален из избранного.')
            return updatedThreads;
        } else {
            updatedThreads = [...updatedThreads, threadNumber];
        }
        localStorage.setItem('favedThreads', updatedThreads.join(','));
        snackbarActions('Тред добавлен в избранное.')
        return updatedThreads;
    });
}

// Function to check if a thread is hidden
export function checkThreadIsHidden(threadNumber: string): boolean {
    const hiddenThreads = localStorage.getItem('hiddenThreads');
    if (hiddenThreads) {
        const threadsArray: string[] = hiddenThreads.split(',');
        return threadsArray.includes(threadNumber);
    }
    return false;
}

function snackbarActions(message: string) {
    enqueueSnackbar(message, {
        preventDuplicate: true,
        anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
        }
    })
}