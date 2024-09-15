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
}

const ThreadCard: React.FC<ThreadCardProps> = ({ thread, isMobile, nsfwMode }) => {
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

    const maxLength = isMobile ? 500 : 1200;
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
                className="thread-card min-h-40vh m-4 border-2 border-indigo-600 flex flex-col p-3">

                <div className={`summary flex justify-between ${isMobile ? 'flex-row text-xs break-keep' : 'w-1/2 text-xl'}`}>
                    <p className={`${isMobile ? 'text-xs' : 'text-base'}`}>
                        <strong>№:</strong> {thread.num}
                    </p>
                    <p className={`${isMobile ? 'text-xs' : 'text-base'}`}>
                        <strong>Постов:</strong> {thread.posts_count}
                    </p>
                    <p className={`${isMobile ? 'text-xs' : 'text-base'}`}>
                        <strong>Создано:</strong> {thread.date}
                    </p>

                </div>
                <div>
                    <div className={`${isMobile ? '' : 'flex justify-start'}`}>
                        <ImageWidget nsfwMode={nsfwMode} isMobile={isMobile} files={thread.files} showSlideShow={openSlider}></ImageWidget>
                        {isSliderOpen && <SlideShow files={thread.files} selectedFileIndex={selectedFileId ?? '0'} onClose={closeSlider}/>}

                        <div className="flex-1 text-left ju mt-5 md:mt-0 md:ml-5">
                            <p
                                className={`comment mb-4 inline text-base`}
                                dangerouslySetInnerHTML={{__html: isExpanded ? fullComment : truncatedComment}}
                            ></p>
                            {fullComment.length > maxLength && (
                                <span
                                    onClick={toggleExpand}
                                    className="bg-transparent text-blue-500 hover:underline focus:outline-none md:text-4xl lg:text-base cursor-pointer"
                                    style={{display: 'inline'}}  // Ensure it's inline to stay on the same line
                                >
                            {isExpanded ? ' Скрыть' : ' Показать полный текст'}
                        </span>
                            )}
                        </div>
                    </div>

                    <div className={`right-2 items-center top-2 to-thread-link ${isMobile ? 'mb-3' : null}`}>
                        <Link
                            to={'thread/' + thread.num}
                            className={`cursor-pointer text-indigo-700 hover:text-indigo-900 ${isMobile ? 'text-4xl' : null}`}
                        >
                            В тред
                        </Link>
                    </div>
                </div>

            </div>
        </>
    );
};

export default ThreadCard