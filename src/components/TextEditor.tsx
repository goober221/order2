import React, { useState, useRef, ChangeEvent, useEffect } from "react";
interface TextEditorProps {
    isMobile: boolean;
    setText: React.Dispatch<React.SetStateAction<string>>;
    text: string;
}

const TextEditor: React.FC<TextEditorProps> = ({ text, setText, isMobile }) => {
    const [email, setEmail] = useState<string>("");
    const [internalText, setInternalText] = useState<string>(localStorage.getItem("savedText") ?? '');
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    const cursorPositionRef = useRef<{ start: number; end: number } | null>(null);

    const maxTextLength = 16000;

    const insertTag = (tagOpen: string, tagClose: string) => {
        const textArea = textAreaRef.current;
        if (textArea) {
            const selectionStart = textArea.selectionStart;
            const selectionEnd = textArea.selectionEnd;

            if (selectionStart !== null && selectionEnd !== null) {
                const beforeText = text.substring(0, selectionStart);
                const afterText = text.substring(selectionEnd);
                const selectedText = text.substring(selectionStart, selectionEnd);
                const newVisibleText = `${beforeText}${tagOpen}${selectedText}${tagClose}${afterText}`;

                let cursorPositionStart: number;
                let cursorPositionEnd: number;

                if (selectionStart === selectionEnd) {
                    cursorPositionStart = selectionStart + tagOpen.length;
                    cursorPositionEnd = cursorPositionStart;
                } else {
                    cursorPositionStart = selectionStart + tagOpen.length;
                    cursorPositionEnd = cursorPositionStart + selectedText.length;
                }

                cursorPositionRef.current = { start: cursorPositionStart, end: cursorPositionEnd };

                setInternalText(newVisibleText);
            }
        }
    };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };


    const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setInternalText(e.target.value);
    }

    const periodicTextSave = () => {
        setText(internalText);
        console.log(internalText);
    }

    useEffect(() => {
        if (cursorPositionRef.current && textAreaRef.current) {
            textAreaRef.current.focus();
            textAreaRef.current.setSelectionRange(
                cursorPositionRef.current.start,
                cursorPositionRef.current.end
            );
            cursorPositionRef.current = null;
        }
    }, [internalText]);

    return (
        <form>
            <div className="max-w-full min-w-72 dark:bg-gray-900 dark:text-white">
                <div className="max-w-lg mx-auto pt-10 px-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-black dark:text-white">
                            Email
                        </label>
                        <input
                            type="text"
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="Enter your email"
                            className="w-full p-2 mt-1 border-2 border-orange-600 dark:border-white rounded-md bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500"
                        />
                    </div>

                    {/* Flex Container for Formatting Buttons */}
                    <div className={`flex ${isMobile ? "flex-wrap" : "flex-row"} gap-1 mt-4`}>
                        <div
                            className="flex items-center p-3 justify-center h-8 w-8 mb-2 bg-orange-600 dark:bg-white dark:text-black rounded-md text-lg font-bold cursor-pointer"
                            onClick={() => insertTag("[b]", "[/b]")}
                        >
                            b
                        </div>
                        <div
                            className="flex items-center p-2 justify-center h-8 w-8 mb-2 bg-orange-600 dark:bg-white dark:text-black rounded-md text-lg italic cursor-pointer"
                            onClick={() => insertTag("[i]", "[/i]")}
                        >
                            i
                        </div>
                        <div
                            className="flex items-center p-3 justify-center h-8 w-8 mb-2 bg-orange-600 dark:bg-white dark:text-black rounded-md text-lg font-bold cursor-pointer"
                            onClick={() => insertTag("[spoiler]", "[/spoiler]")}
                        >
                            <div className="p-2 bg-dark dark:bg-black text-black rounded-sm w-3/4 h-3/4"></div>
                        </div>
                        <div
                            className="flex items-center p-3 justify-center h-8 w-8 mb-2 bg-orange-600 dark:bg-white dark:text-black rounded-md font-bold text-lg underline cursor-pointer"
                            onClick={() => insertTag("[u]", "[/u]")}
                        >
                            u
                        </div>
                        <div
                            className="flex items-center p-3 justify-center h-8 w-8 mb-2 bg-orange-600 dark:bg-white dark:text-black rounded-md font-bold text-lg overline cursor-pointer"
                            onClick={() => insertTag("[o]", "[/o]")}
                        >
                            o
                        </div>
                        <div
                            className="flex items-center p-3 justify-center h-8 w-8 mb-2 bg-orange-600 dark:bg-white dark:text-black rounded-md text-lg line-through cursor-pointer"
                            onClick={() => insertTag("[s]", "[/s]")}
                        >
                            S
                        </div>
                        <div
                            className="flex relative items-center p-3 justify-center h-8 w-8 mb-2 bg-orange-600 dark:bg-white dark:text-black rounded-md text-lg font-bold cursor-pointer"
                            onClick={() => insertTag("[sup]", "[/sup]")}
                        >
                            A<span className="absolute top-0 right-1 text-xs align-text-top">a</span>
                        </div>
                        <div
                            className="flex relative items-center p-3 justify-center h-8 w-8 mb-2 bg-orange-600 dark:bg-white dark:text-black rounded-md text-lg font-bold cursor-pointer"
                            onClick={() => insertTag("[sub]", "[/sub]")}
                        >
                            A<span className="absolute bottom-0 right-1 text-xs align-text-top">a</span>
                        </div>
                    </div>

                    {/* Textarea */}
                    <textarea
                        ref={textAreaRef}
                        value={internalText}
                        onChange={handleTextChange}
                        onBlur={periodicTextSave}
                        placeholder="Enter text here..."
                        maxLength={maxTextLength}
                        rows={8}
                        className="w-full p-2 border-2 border-orange-600 dark:border-white rounded-md bg-white dark:bg-gray-800 text-black dark:text-white resize-y"
                    />
                </div>
            </div>
        </form>

    );
};

export default TextEditor;
