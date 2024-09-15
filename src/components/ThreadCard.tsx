import {Thread} from "../models/Thread.ts";
import '../styles/ThreadCard.css'
import React, {useState} from "react";
import SlideShow from "./SlideShow.tsx";
import {Link} from "react-router-dom";
import ImageWidget from "./ImageWidget.tsx";
import {scrollToDiv} from "../services/effects.ts";

interface ThreadCardProps {
    thread: Thread;
    isMobile: boolean;
    nsfwMode: boolean;
    threadIsHidden: boolean;
    onToggleHide: (threadNumber: string) => void;
}

const ThreadCard: React.FC<ThreadCardProps> = ({ thread, isMobile, nsfwMode, threadIsHidden, onToggleHide }) => {
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
        scrollToDiv(`thread-${thread.num}`);
        setIsExpanded(!isExpanded);
    };

    return (
        <>
            <div
                className={`thread-card  m-4 border-2 border-orange-600 dark:border-white flex flex-col p-3 ${threadIsHidden ? 'max-h-16' : 'min-h-40vh'}`}>
            {threadIsHidden ? (<div className="flex justify-between items-center">
                <span className="text-black dark:text-white text-start">Hidden thread №{thread.num}</span>
                <span className="text-black dark:text-white text-start cursor-pointer" onClick={() => {
                    onToggleHide(thread.num.toString())
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                         stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                    </svg>

                </span>
            </div>) : (
                <div>
                    <div
                        className={`summary flex justify-between ${isMobile ? 'flex-row text-xs break-keep' : 'w-1/2 text-xl'}`}>
                        <p className={`${isMobile ? 'text-xs' : 'text-base'} text-black dark:text-white`}>
                            <strong>№:</strong> {thread.num}
                        </p>
                        <p className={`${isMobile ? 'text-xs' : 'text-base'} text-black dark:text-white`}>
                            <strong>Постов:</strong> {thread.posts_count}
                        </p>
                        <p className={`${isMobile ? 'text-xs' : 'text-base'} text-black dark:text-white`}>
                            <strong>Создано:</strong> {thread.date}
                        </p>

                    </div>
                    <div>
                        <div className={`${isMobile ? '' : 'flex justify-start'}`}>
                            <ImageWidget nsfwMode={nsfwMode} isMobile={isMobile} files={thread.files}
                                         showSlideShow={openSlider}></ImageWidget>
                            {isSliderOpen && <SlideShow files={thread.files} selectedFileIndex={selectedFileId ?? '0'}
                                                        onClose={closeSlider}/>}

                            <div className="flex-1 text-left ju mt-5 md:mt-0 md:ml-5">
                                <p
                                    className={`comment mb-4 inline text-base text-black dark:text-white`}
                                    dangerouslySetInnerHTML={{__html: isExpanded ? fullComment : truncatedComment}}
                                ></p>
                                {fullComment.length > maxLength && (
                                    <span
                                        onClick={toggleExpand}
                                        className="bg-transparent text-blue-500 hover:underline focus:outline-none md:text-4xl lg:text-base cursor-pointer"
                                        style={{display: 'inline'}}
                                    >
                                                {isExpanded ? ' Скрыть' : ' Показать полный текст'}
                                            </span>
                                )}
                        </div>
                    </div>

                    <div className={`flex gap-3 right-2 items-center top-2 to-thread-link ${isMobile ? 'mb-3 justify-center' : 'justify-end'}`}>
                        <span className={`text-black dark:text-white cursor-pointer`} onClick={() => {
                            onToggleHide(thread.num.toString())
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="size-8" >
                              <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"/>
                            </svg>
                        </span>
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"/>
                            </svg>
                        </span>
                        <Link
                            to={'thread/' + thread.num}
                            className={`cursor-pointer text-indigo-700 hover:text-indigo-900 ${isMobile ? 'text-4xl' : null}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="size-8">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
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