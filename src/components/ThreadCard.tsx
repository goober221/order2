import {Thread} from "../models/Thread.ts";
import '../App.css'
import React, {useState} from "react";
import SlideShow from "./SlideShow.tsx";
import {Link} from "react-router-dom";
import ImageWidget from "./ImageWidget.tsx";

interface ThreadCardProps {
    thread: Thread;
}

const ThreadCard: React.FC<ThreadCardProps> = ({ thread }) => {
    const [isSliderOpen, setIsSliderOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const openSlider = () => setIsSliderOpen(true);
    const closeSlider = () => setIsSliderOpen(false);

    const maxLength = 500;
    const fullComment = thread.comment || "";
    const truncatedComment = fullComment.length > maxLength
        ? fullComment.substring(0, maxLength) + "..."
        : fullComment;

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <>
            <div className="relative m-2 bg-amber-400 border-2 border-indigo-600 flex flex-col md:flex-row p-3">
                <div className="absolute right-2 top-2">
                    <Link
                        to={'thread/' + thread.num}
                        className="text-lg md:text-xl cursor-pointer text-indigo-700 hover:text-indigo-900"
                    >
                        В тред
                    </Link>
                </div>
                <ImageWidget files={thread.files} showSlideShow={openSlider}></ImageWidget>

                {isSliderOpen && <SlideShow files={thread.files} onClose={closeSlider} />}

                <div className="flex-1 mt-5 md:mt-0 md:ml-5">
                    <div>
                        <p
                            className="text-left text-sm md:text-base mb-4 s:text-2xl"
                            dangerouslySetInnerHTML={{ __html: isExpanded ? fullComment : truncatedComment }}
                        ></p>

                        {fullComment.length > maxLength && (
                            <button
                                onClick={toggleExpand}
                                className="bg-transparent text-blue-500 hover:underline focus:outline-none"
                            >
                                {isExpanded ? 'Скрыть' : 'Показать полный текст'}
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row justify-between mt-auto">
                        <p className="text-sm md:text-base">
                            <strong>Постов:</strong> {thread.posts_count}
                        </p>
                        <p className="text-sm md:text-base">
                            <strong>Создано:</strong> {thread.date}
                        </p>
                        <p className="text-sm md:text-base">
                            <strong>№:</strong> {thread.num}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ThreadCard