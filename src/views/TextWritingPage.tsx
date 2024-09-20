import React, { useState, useEffect, useRef } from "react";
import TextEditor from "../components/TextEditor.tsx";
import {useSwipeable} from "react-swipeable";

interface TextWritingPageProps {
    isMobile: boolean;
    text: string;
    setText: React.Dispatch<React.SetStateAction<string>>;
}

const TextWritingPage: React.FC<TextWritingPageProps> = ({
                                                             isMobile,
                                                             text,
                                                             setText
                                                         }) => {
    const [editorHeight, setEditorHeight] = useState(0);
    const editorRef = useRef<HTMLDivElement>(null);

    const setRefs = (...refs: any[]) => (element: HTMLDivElement) => {
        refs.forEach(ref => {
            if (typeof ref === 'function') {
                ref(element);
            } else if (ref) {
                ref.current = element;
            }
        });
    };

    const swipeHandlers = useSwipeable({
        onSwipedDown: () => {
            if (editorHeight > 0) {
                setEditorHeight(0);
            }
        },
        preventScrollOnSwipe: true,
        trackMouse: true,
    });

    useEffect(() => {
        if (editorHeight > window.innerHeight * 0.5) {
            document.body.classList.add("no-scroll");
        } else {
            document.body.classList.remove("no-scroll");
        }
    }, [editorHeight]);

    const toggleTextEditor = () => {
        if (editorHeight === 0) {
            setEditorHeight(window.innerHeight);
        } else {
            setEditorHeight(0);
        }
    };

    return (
        <div className="relative h-screen w-screen">
            <div
                ref={setRefs(editorRef, swipeHandlers.ref)}
                className={`fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 border-t-2 ${editorHeight !== 0 ? 'border-orange-600 dark:border-white' : ''} transition-all duration-300 ease-in-out`}
                style={{ height: `${editorHeight}px` }}
            >
                <TextEditor text={text} setText={setText} isMobile={isMobile} />
            </div>

            <div
                className="fixed bottom-4 right-4 bg-orange-600 dark:bg-white rounded-full p-3 cursor-pointer z-50"
                onClick={toggleTextEditor}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white dark:text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    {editorHeight === 0 ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                             stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"/>
                        </svg>
                    ) : (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                        />
                    )}
                </svg>
            </div>
        </div>
    );
};

export default TextWritingPage;
