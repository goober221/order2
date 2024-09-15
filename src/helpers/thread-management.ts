
// Function to hide or show a thread
import {enqueueSnackbar} from "notistack";

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

// Function to check if a thread is hidden
export function checkThreadIsHidden(threadNumber: string): boolean {
    const hiddenThreads = localStorage.getItem('hiddenThreads');
    if (hiddenThreads) {
        let threadsArray: string[] = hiddenThreads.split(',');
        return threadsArray.includes(threadNumber);
    }
    return false;
}

function snackbarActions(message: string) {
    enqueueSnackbar(message, {
        preventDuplicate: true,
        anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
        }
    })
}