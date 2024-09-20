import {FavedThread} from "../models/Thread.ts";

export function hideThread(threadNumber: string, setHiddenThreads: React.Dispatch<React.SetStateAction<string[]>>) {
    setHiddenThreads(prev => {
        let updatedThreads = [...prev];
        if (updatedThreads.includes(threadNumber)) {
            updatedThreads = updatedThreads.filter(i => i !== threadNumber);
        } else {
            updatedThreads = [...updatedThreads, threadNumber];
        }
        localStorage.setItem('hiddenThreads', updatedThreads.join(','));
        return updatedThreads;
    });
}

export function favThread(threadNumber: string, postCount: number | undefined, title: string | undefined, setFavedThreads: React.Dispatch<React.SetStateAction<FavedThread[]>>) {
    setFavedThreads(prev => {
        let updatedThreads = [...prev];

        if (updatedThreads.find(t => t.num === threadNumber)) {
            updatedThreads = updatedThreads.filter(t => t.num !== threadNumber);
        } else {
            const newThread: FavedThread = {
                num: threadNumber,
                posts_old: postCount ?? 0,
                posts_new: 0,
                title: title
            }
            updatedThreads = [...updatedThreads, newThread];
        }
        saveFavedThreads(updatedThreads);
        return updatedThreads;
    });
}

export function checkThreadIsHidden(threadNumber: string): boolean {
    const hiddenThreads = localStorage.getItem('hiddenThreads');
    if (hiddenThreads) {
        const threadsArray: string[] = hiddenThreads.split(',');
        return threadsArray.includes(threadNumber);
    }
    return false;
}

export const parseFavedThreads = (): FavedThread[] => {
    const favedThreads = localStorage.getItem('favedThreads');
    if (!favedThreads) return [];
    return JSON.parse(favedThreads) as FavedThread[];
};

export const saveFavedThreads = (threads: FavedThread[]) => {
    localStorage.setItem('favedThreads', JSON.stringify(threads));
};