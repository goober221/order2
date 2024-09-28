import {ThreadObj} from "../models/Thread.ts";
import '../styles/ThreadCard.css'
import React, {useState} from "react";
import SlideShow from "./SlideShow.tsx";
import {Link} from "react-router-dom";
import ImageWidget from "./ImageWidget.tsx";

interface ThreadCardProps {
    thread: ThreadObj;
    isMobile: boolean;
    nsfwMode: boolean;
    threadIsHidden: boolean;
    threadIsFaved: boolean;
    onToggleHide: (threadNumber: string) => void;
    onToggleFav: (threadNumber: string, postCount: number, title?: string) => void;
}

const ThreadCard: React.FC<ThreadCardProps> = ({ thread, isMobile, nsfwMode, threadIsHidden, onToggleHide, threadIsFaved, onToggleFav }) => {
    const [isSliderOpen, setIsSliderOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

    const openSlider = (fileId: string) => {
        setIsSliderOpen(true);
        setSelectedFileId(fileId);
    };

    const closeSlider = () => {
        setIsSliderOpen(false);
        setSelectedFileId(null);
    };

    const maxLength = isMobile ? 500 : 800;
    const tolerance = isMobile ? 10 : 30;
    const fullComment = thread.comment || "";
    const truncatedComment = fullComment.length > maxLength + tolerance
        ? fullComment.substring(0, maxLength) + "..."
        : fullComment;


    const toggleExpand = () => {
        const scrollableDiv = document.getElementById(`thread-${thread.num}`);
        if (scrollableDiv) {
            const previousScrollHeight = scrollableDiv.scrollHeight;
            const previousScrollTop = scrollableDiv.scrollTop;

            setIsExpanded(prevState => {
                const isExpanding = !prevState;
                const newExpandedState = !prevState;

                setTimeout(() => {
                    if (isExpanding) {
                        const newScrollHeight = scrollableDiv.scrollHeight;
                        scrollableDiv.scrollTop = previousScrollTop + (newScrollHeight - previousScrollHeight);
                    }
                }, 0);

                return newExpandedState;
            });
        }
        setIsExpanded(!isExpanded);
    };

    return (
        <>

            <div
                id={`thread-${thread.num}`}
                className={`thread-card  m-4 border-2 border-orange-600 dark:border-white flex flex-col p-3 ${threadIsHidden ? 'max-h-16' : 'min-h-40vh'}`}>
            {threadIsHidden ? (<div className="flex justify-between items-center">
                <span className="text-black dark:text-white text-start">Hidden thread №{thread.num}</span>
                <span className="text-black dark:text-white text-start cursor-pointer" onClick={() => {
                    onToggleHide(thread.num.toString())
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                         stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/>
                    </svg>
                </span>
            </div>) : (
                <div>
                    <div
                        className={`summary flex justify-between ${isMobile ? 'flex-row text-xs break-keep' : 'text-xl'}`}>
                        <p className={`${isMobile ? 'text-xs' : 'text-base'} text-black dark:text-white`}>{thread.num}</p>
                        <p className={`${isMobile ? 'text-xs' : 'text-base'} text-black dark:text-white`}>Постов: {thread.posts_count}</p>
                        <p className={`${isMobile ? 'text-xs' : 'text-base'} text-black dark:text-white`}>{thread.date}</p>
                        <span className={`text-black dark:text-white cursor-pointer`} onClick={() => {
                            onToggleHide(thread.num.toString())
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5"/>
                            </svg>

                        </span>
                    </div>
                    <div>
                        <div className={`${isMobile ? '' : 'flex justify-start'}`}>
                            <ImageWidget nsfwMode={nsfwMode} isMobile={isMobile} files={thread.files}
                                         showSlideShow={openSlider}></ImageWidget>
                            {isSliderOpen && <SlideShow files={thread.files} selectedFileIndex={selectedFileId ?? '0'}
                                                        onClose={closeSlider}/>}

                            <div className="flex-1 text-left ju mt-5 md:mt-0 md:ml-5">
                                <p
                                    className={`comment mb-4 text-sm inline text-base text-black dark:text-white`}
                                    dangerouslySetInnerHTML={{__html: isExpanded ? fullComment : truncatedComment}}
                                >
                                </p>
                                {fullComment.length > maxLength && (
                                    <span
                                        onClick={toggleExpand}
                                        className=" bg-transparent text-blue-500 hover:underline focus:outline-none md:text-4xl lg:text-base cursor-pointer"
                                        style={{display: 'inline'}}
                                    >
                                                {isExpanded ? ' Скрыть' : ' Показать полный текст'}
                                            </span>
                                )}
                            </div>
                        </div>

                        <div
                            className={`flex gap-3 mt-2 right-2 items-center top-2 to-thread-link ${isMobile ? 'mb-3 justify-center' : 'justify-end'}`}>
                        <span className={`text-orange-600 dark:text-white cursor-pointer `} onClick={() => {
                            onToggleFav(thread.num.toString(), thread.posts_count, thread.subject)
                        }}>
                            {threadIsFaved ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                     className="size-8">
                                    <path fillRule="evenodd"
                                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                          clipRule="evenodd"/>
                                </svg>) : (
                                <svg xmlns="http://www.w3.org/2000/svg"
                                     fill="none" viewBox="0 0 24 24"
                                     strokeWidth={1.5}
                                     stroke="currentColor" className="size-8">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"/>
                                </svg>
                            )}

                        </span>
                            <Link
                                to={'thread/' + thread.num}
                                className={`cursor-pointer text-indigo-700 hover:text-indigo-900 ${isMobile ? 'text-4xl' : null}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth={1.5}
                                     stroke="currentColor" className="size-8">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"/>
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </>
    );
};

export default ThreadCard