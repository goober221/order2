import {useEffect, useState} from 'react';
import ThreadCard from "../components/ThreadCard.tsx";
import {BoardData} from "../models/BoardData.ts";
import axios from "axios";
import useDarkMode from "../effects/udeDarkMode.ts";
import {hideThread} from "../helpers/thread-management.ts";

interface PageData {
    isMobile: boolean;
}

const Board:React.FC<PageData> = ({isMobile}) => {
    const [data, setData] = useState<BoardData | null >(null);
    const [isDarkMode, toggleDarkMode] = useDarkMode();

    const [hiddenThreads, setHiddenThreads] = useState<string[]>(() => {
        const storedThreads = localStorage.getItem('hiddenThreads');
        return storedThreads ? storedThreads.split(',') : [];
    });

    const handleToggleHide = (threadNumber: string) => {
        hideThread(threadNumber, setHiddenThreads);
    };

    const getNsfwMode = () => {
        return localStorage.getItem('nsfw') === "1";
    }

    const setNsfwModeAction = () => {
        const currentNsfw =  localStorage.getItem('nsfw') === "1";
        const newState = currentNsfw ? "0" : "1";
        setNsfwMode(newState === '1');
        console.log('nsfw mode new state: ' + newState)
        localStorage.setItem('nsfw', newState);
    }

    const [nsfwMode, setNsfwMode] = useState<boolean>(getNsfwMode());

    useEffect(() => {
        axios.get<BoardData>('/api/b/catalog.json')
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.log('Error fetching data from 2ch:', error);
            });
    }, []);

    return (
        <>
            <div className="w-full h-full bg-white dark:bg-black ">
                <button className="fixed top-0 right-0" onClick={setNsfwModeAction}>NSFW</button>
                <button
                    onClick={toggleDarkMode}
                    className="p-2 text-sm bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded-md"
                >
                    {!isDarkMode ?
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                             stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"/>
                        </svg>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                             stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"/>
                        </svg>
                    }
                </button>
                <div className="gap-4">
                    <p>aaa</p>
                    {data?.threads?.map((thread) => (
                        <ThreadCard onToggleHide={handleToggleHide} threadIsHidden={(hiddenThreads.find(t => t === thread.num.toString()) ?? []).length > 0 ?? false} isMobile={isMobile} key={thread.num} nsfwMode={nsfwMode} thread={thread}/>
                    ))}
                </div>
            </div>

        </>
    );
};

export default Board;