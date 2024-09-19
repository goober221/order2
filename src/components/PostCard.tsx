import '../App.css'
import React, {useState} from "react";
import {Post} from "../models/Post.ts";
import ImageWidget from "./ImageWidget.tsx";
import SlideShow from "./SlideShow.tsx";

interface PostCardProps {
    isMobile: boolean;
    nsfwMode: boolean
    // isScrolled: boolean;
    // loading: boolean;
    // setNsfwMode: React.Dispatch<React.SetStateAction<boolean>>;
    // setIsScrolled: React.Dispatch<React.SetStateAction<boolean>>;
    post: Post
}

const PostCard: React.FC<PostCardProps> = ({post, isMobile,nsfwMode}) => {
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
    const fullComment = post.comment || "";
    const truncatedComment = fullComment.length > maxLength + tolerance
        ? fullComment.substring(0, maxLength) + "..."
        : fullComment;

    const toggleExpand = () => {
        const scrollableDiv = document.getElementById(`post-${post.num}`);
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
                id={`post-${post.num}`}
                className={`thread-card  m-4 border-2 border-orange-600 dark:border-white flex flex-col p-3`}>

                    <div>
                        <div
                            className={`summary flex justify-between ${isMobile ? 'flex-row text-xs break-keep' : 'text-xl'}`}>
                            <p className={`${isMobile ? 'text-xs' : 'text-base'} text-black dark:text-white`}>{post.num}</p>
                            <p className={`${isMobile ? 'text-xs' : 'text-base'} text-black dark:text-white`}>{post.number}</p>
                            <p className={`${isMobile ? 'text-xs' : 'text-base'} text-black dark:text-white`}>{post.date}</p>
                        </div>
                        <div>
                            <div className={`${isMobile ? '' : 'flex justify-start'}`}>
                                {post.files && <ImageWidget nsfwMode={nsfwMode} isMobile={isMobile} files={post.files}
                                                            showSlideShow={openSlider}></ImageWidget>}

                                {isSliderOpen && post.files &&
                                    <SlideShow files={post.files} selectedFileIndex={selectedFileId ?? '0'}
                                               onClose={closeSlider}/>}

                                <div className="flex-1 text-left ju mt-5 md:mt-0 md:ml-5">
                                    <p
                                        className={`comment mb-4 inline text-base text-black dark:text-white`}
                                        dangerouslySetInnerHTML={{__html: isExpanded ? fullComment : truncatedComment}}
                                    ></p>
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
                        </div>
                    </div>
            </div>
        </>
    );
};

export default PostCard