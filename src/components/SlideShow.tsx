import '../styles/SlideShow.css'
import {ThreadFile} from "../models/File.ts";
import React, {useEffect, useRef, useState} from "react";
import 'react-medium-image-zoom/dist/styles.css';
import { useSwipeable } from 'react-swipeable';

interface SlideShowProps {
    files: ThreadFile[];
    onClose: () => void;
    selectedFileIndex: string;
}

const SlideShow: React.FC<SlideShowProps> = ({ files, onClose, selectedFileIndex }) =>{
    const [currentIndex, setCurrentIndex] = useState(+selectedFileIndex);
    const mediaRef = useRef<HTMLDivElement>(null);
    const [zoomScale, setZoomScale] = useState(1);
    const [isDragging, setIsDragging] = useState(false); // State for dragging
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 }); // Starting drag position
    const [position, setPosition] = useState({ left: 0, top: 0 }); // Position of the container
    const baseURL = '/api/';

    const handlers = useSwipeable({
        onSwipedLeft: () => handleNext(),
        onSwipedRight: () => handlePrev(),
        trackMouse: true,
    });

    const handleNext = () => {

        setCurrentIndex((prev) => {
            const newIndex = prev === files.length - 1 ? 0 : prev + 1;
            return newIndex;
        });
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => {
            const newIndex = prev === 0 ? files.length - 1 : prev - 1;
            return newIndex;
        });
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging && mediaRef.current) {
            const dx = e.clientX - dragStart.x;
            const dy = e.clientY - dragStart.y;
            setPosition((prev) => ({
                left: prev.left + dx,
                top: prev.top + dy,
            }));
            setDragStart({ x: e.clientX, y: e.clientY });
        }
    };

    const handleOverlayClick = (e: MouseEvent) => {
        if (mediaRef.current && !mediaRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    const handleOverlayClickWrapper = (e: MouseEvent) => {
        handleOverlayClick(e);
    };

    const handleWheel = (e: WheelEvent) => {
        if (mediaRef.current) {
            setZoomScale((prev) => Math.max(1, prev + e.deltaY * -0.001));
            e.preventDefault();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOverlayClickWrapper);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        if (mediaRef.current) {
            mediaRef.current.addEventListener('wheel', handleWheel);
        }

        return () => {
            document.removeEventListener('mousedown', handleOverlayClickWrapper);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            if (mediaRef.current) {
                mediaRef.current.removeEventListener('wheel', handleWheel);
            }
        };
    }, [isDragging, dragStart]);


    const currentFile = files[currentIndex];

    return (
        <div className="slider-overlay">
            <button className="slider-close" onClick={onClose}>
                &times;
            </button>
            <div className="slider-content"
                 style={{
                     left: `${position.left}px`,
                     top: `${position.top}px`,
                     transform: `scale(${zoomScale})`,
                     cursor: isDragging ? 'grabbing' : 'grab',
                 }}
                 onMouseDown={handleMouseDown} {...handlers} ref={mediaRef}>
                <div className="slider-navigation relative">
                    <div className="absolute h-full w-1/3" onClick={handlePrev}></div>
                    <div className="absolute h-full w-1/3 right-0" onClick={handleNext}></div>
                    <div className="slider-media"
                    >
                        {currentFile.type === 1 || currentFile.type === 2 ? (
                            <img
                                src={baseURL + currentFile.path}
                                alt={currentFile.displayname}
                                className="slider-image"
                            />
                        ) : (
                            <video
                                key={currentFile.path}
                                controls
                                className="slider-video"
                                autoPlay={true}
                            >
                                <source src={baseURL + currentFile.path} type={'video/' + currentFile.path.split('.').pop()}/>
                                Your browser does not support the video tag.
                            </video>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SlideShow