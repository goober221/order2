import React, {useEffect } from "react";
import useDarkMode from "../effects/udeDarkMode.ts";
import {useSwipeable} from "react-swipeable";
import axios from "axios";
import {favThread, parseFavedThreads, saveFavedThreads} from "../helpers/thread-management.ts";
import {FavedThread, ThreadInfoObj} from "../models/Thread.ts";

interface SideMenuProps {
    favedThreads: FavedThread[];
    menuOpen: boolean;
    isScrolled: boolean;
    setFavedThreads: React.Dispatch<React.SetStateAction<FavedThread[]>>;
    setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideMenu:React.FC<SideMenuProps> = ({favedThreads, setFavedThreads, menuOpen, setMenuOpen, isScrolled}) => {
    const [isDarkMode, toggleDarkMode] = useDarkMode();

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
            axios.get<ThreadInfoObj>(`/api/api/mobile/v2/info/b/${threadNum}`)
                .then((response) => {
                    const posts_count  = response.data.thread.posts ?? 0;
                    const updatedData = favedThreads.map(thread => {

                        if (thread.num === threadNum) {
                            return {
                                ...thread,
                                posts_old:  thread.posts_old < posts_count ? posts_count : thread.posts_old,
                                posts_new: thread.posts_old < posts_count ? posts_count - thread.posts_old + thread.posts_new : 0,
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

    useEffect(() => {
        fetchThreadData();

        const interval = setInterval(() => {
            fetchThreadData();
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative"  {...handlers}>
            <div className="bg-transparent h-100vh w-1/5 fixed top-0 left-0"></div>
            <div
                className={`fixed top-3 p-2 z-50 rounded transition-all duration-300 transform 
                left-3`}

            >
                {menuOpen ?
                    <div className={`flex gap-2 text-orange-600 dark:text-white`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                             stroke="currentColor" className="size-8" onClick={toggleMenu}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                             stroke="currentColor" className="size-8" onClick={fetchThreadData}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"/>
                        </svg>
                    </div>
                    :
                    <div className={`text-orange-600 dark:text-white bg-opacity-90 dark:bg-opacity-90 ${isScrolled && !menuOpen ? 'text-white' : ''}`}
                         onClick={toggleMenu}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                             stroke="currentColor" className="size-8">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
                        </svg>
                    </div>
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
                            <div className="flex-1 overflow-hidden">
                            <span className="block text-start text-sm font-medium truncate">
                              {thread.title}
                            </span>
                            </div>
                            <div className="flex overflow-hidden gap-2">
                                <div className='h-1/2 w-10'>
                                    <p className='text-black dark:text-white'>{thread.posts_new}</p>
                                </div>
                                <span
                                    className="cursor-pointer text-red-500 hover:text-red-700"
                                    onClick={() => handleToggleFav(thread.num.toString(), 0)}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-6 h-6">
                                      <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                </span>
                            </div>

                        </li>
                    ))}
                </ul>
                <div className="absolute bottom-2 w-full flex items-center justify-center">
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