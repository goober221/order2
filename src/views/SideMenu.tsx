import React, {useEffect, useState } from "react";
import useDarkMode from "../effects/udeDarkMode.ts";
import {useSwipeable} from "react-swipeable";
import axios from "axios";
import {BoardData} from "../models/BoardData.ts";
import {favThread, parseFavedThreads, saveFavedThreads} from "../helpers/thread-management.ts";
import {FavedThread} from "../models/Thread.ts";

interface SideMenuProps {
    favedThreads: FavedThread[];
    setFavedThreads: React.Dispatch<React.SetStateAction<FavedThread[]>>;
}

const SideMenu:React.FC<SideMenuProps> = ({favedThreads, setFavedThreads}) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const [isDarkMode, toggleDarkMode] = useDarkMode();

    const getNsfwMode = () => {
        return localStorage.getItem('nsfw') === "1";
    }

    const [nsfwMode, setNsfwMode] = useState<boolean>(getNsfwMode());

    const setNsfwModeAction = () => {
        const currentNsfw = localStorage.getItem('nsfw') === "1";
        const newState = currentNsfw ? "0" : "1";
        setNsfwMode(newState === '1');
        console.info(`nsfwMode is ${nsfwMode ? 'off' : 'on'}`);
        localStorage.setItem('nsfw', newState);
    }

    const toggleMenu = () => {
        setFavedThreads(parseFavedThreads());
        setMenuOpen(!menuOpen);
        if (!menuOpen) {
            fetchThreadData();
        }
    };

    const handlers = useSwipeable({
        onSwipedLeft: () => setMenuOpen(false),
        onSwipedRight: () => setMenuOpen(true),
        trackMouse: true
    });

    useEffect(() => {
        if (menuOpen) {
            document.body.classList.add("no-scroll");
        } else {
            document.body.classList.remove("no-scroll");
        }
        return () => {
            document.body.classList.remove("no-scroll");
        };
    }, [menuOpen]);

    const handleToggleFav = (threadNumber: string, postCount: number, title?: string) => {
        favThread(threadNumber, postCount, title, setFavedThreads);
    };

    const fetchThreadData = () => {
        setFavedThreads(parseFavedThreads());
        const favedNums = favedThreads.map(thread => thread.num);
        favedNums.forEach(threadNum => {
            if (!threadNum) {
                return;
            }

            axios.get<BoardData>(`/api/b/res/${threadNum}.json`)
                .then((response) => {
                    const posts_count  = response.data.threads[0].posts?.length ?? 0;
                    const updatedData = favedThreads.map(thread => {
                        if (thread.num === threadNum) {
                            return {
                                ...thread,
                                posts_old:  thread.posts_old < posts_count ? posts_count : thread.posts_old,
                                posts_new: thread.posts_old < posts_count ? posts_count - thread.posts_old : 0,
                                title: thread.title
                            }
                        }
                        return {...thread};
                    });
                    saveFavedThreads(updatedData);
                })
                .catch((error) => {
                    if (error.status === 404) {
                        saveFavedThreads(favedThreads.filter(thread => thread.num !== threadNum));
                    }
                    console.log('Error fetching data from 2ch:', error);
                });
            setFavedThreads(parseFavedThreads());
        });
    };

    // Fetch thread data on component mount and every 60 seconds
    useEffect(() => {
        fetchThreadData();

        const interval = setInterval(() => {
            fetchThreadData();
        }, 60000);

        return () => clearInterval(interval);
    });

    return (
        <div className="relative"  {...handlers}>
            <div className="bg-transparent h-100vh w-1/5 fixed top-0 left-0"></div>
            <div
                className={`fixed top-4 p-2 z-50 rounded transition-all bg-black dark:bg-white dark:text-black bg-opacity-35 dark:bg-opacity-35 duration-300 transform ${
                    menuOpen ? "right-4" : "left-4 "
                }`}
                onClick={toggleMenu}
            >
                {menuOpen ?

                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/>
                    </svg>
                    :
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                             stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
                        </svg>
                }
            </div>

            <div
                className={`fixed top-0 left-0 h-full w-full dark:text-white bg-white dark:bg-gray-900 transform transition-transform duration-300 z-40 ${
                    menuOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
            <h1 className="mt-5 text-2xl text-black dark:text-white">Избранное</h1>
                <ul className="p-6 space-y-4 text-black dark:text-white">
                    {favedThreads.map((thread) => (
                        <li
                            key={thread.num}
                            className="flex items-center justify-between space-x-2 p-2 border-b dark:border-gray-700"
                        >
                            {/* Thread number and title */}
                            <div className="flex-1 overflow-hidden">
                            <span className="block text-start text-sm font-medium truncate">
                              {thread.title}
                            </span>
                                                </div>
                                                {/* Delete icon */}
                                                <span
                                                    className="cursor-pointer text-red-500 hover:text-red-700"
                                                    onClick={() => handleToggleFav(thread.num.toString(), 0)}
                                                >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                              <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </span>
                        </li>
                    ))}
                </ul>
                <div className="absolute bottom-2 w-full flex items-center justify-center">
                    <button className="mr-3 dark:text-white" onClick={setNsfwModeAction}>NSFW</button>
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 ml-3  text-sm bg-gray-200 dark:bg-gray-900 text-black dark:text-white rounded-md"
                    >
                        {!isDarkMode ?
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth={1.5}
                                 stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"/>
                            </svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth={1.5}
                                 stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"/>
                            </svg>
                        }
                    </button>
                </div>

            </div>

            {/* Overlay (optional) */}
            {menuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={toggleMenu}
                ></div>
            )}
        </div>
    );
};

export default SideMenu;