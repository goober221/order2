import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
interface TextEditorProps {
    isMobile: boolean;
    setText: React.Dispatch<React.SetStateAction<string>>;
    text: string;
}

const TextEditor: React.FC<TextEditorProps> = ({ text, setText, isMobile }) => {
    const [email, setEmail] = useState<string>("");
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [visibleText, setVisibleText] = useState<string>(""); // Visible text with tags
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

    const maxTextLength = 16000;

    // Convert original text to visible text with BBCode-like tags
    const convertToVisibleText = (originalText: string) => {
        return (originalText ?? "")
            .replace(/<b>(.*?)<\/b>/g, "[b]$1[/b]")
            .replace(/<i>(.*?)<\/i>/g, "[i]$1[/i]")
            .replace(/<span class="spoiler">(.*?)<\/span>/g, "[spoiler]$1[/spoiler]");
    };

    // Convert visible text (BBCode-like tags) back to original HTML
    const convertToOriginalText = (visibleText: string) => {
        return visibleText
            .replace(/\[b\](.*?)\[\/b\]/g, "<b>$1</b>")
            .replace(/\[i\](.*?)\[\/i\]/g, "<i>$1</i>")
            .replace(/\[spoiler\](.*?)\[\/spoiler\]/g, '<span class="spoiler">$1</span>');
    };

    // Update visibleText when the original text changes
    useEffect(() => {
        setVisibleText(convertToVisibleText(text));
    }, [text]);

    // Handle changes in the textarea and update both visible and original text
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newVisibleText = e.target.value;
        setVisibleText(newVisibleText);

        // Convert visible text back to the original HTML format
        const updatedOriginalText = convertToOriginalText(newVisibleText);
        setText(updatedOriginalText);
    };

    // Insert BBCode-like tags at the caret position
    const insertTag = (tagOpen: string, tagClose: string) => {
        const textArea = textAreaRef.current;
        if (textArea) {
            const { selectionStart, selectionEnd } = textArea;
            if (selectionStart !== null && selectionEnd !== null) {
                const beforeText = visibleText.slice(0, selectionStart);
                const afterText = visibleText.slice(selectionEnd);
                const selectedText = visibleText.slice(selectionStart, selectionEnd);
                const newVisibleText = `${beforeText}${tagOpen}${selectedText}${tagClose}${afterText}`;

                // Update visible and original text
                setVisibleText(newVisibleText);
                setText(convertToOriginalText(newVisibleText));

                // Set the cursor position after inserting the tags
                textArea.focus();
                textArea.setSelectionRange(
                    selectionStart + tagOpen.length,
                    selectionEnd + tagOpen.length
                );
            }
        }
    };

    // Handle email input change
    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    // Swipe handler for mobile menu
    const handleSwipeMenu = useSwipeable({
        onSwipedLeft: () => setIsMenuOpen(false),
        onSwipedRight: () => setIsMenuOpen(true),
    });

    // Load saved text from local storage on mount
    useEffect(() => {
        const savedText = localStorage.getItem("savedText");
        if (savedText) {
            setText(JSON.parse(savedText));
        }
    }, [setText]);

    // // Handle post submission
    // const handlePost = () => {
    //     const postData: PostData = {
    //         board: "b",
    //         thread: "",
    //         op_mark: "",
    //         usercode: "",
    //         code: "",
    //         captcha_type: "",
    //         email: "",
    //         name: "",
    //         subject: "",
    //         icon: "",
    //         comment: text,
    //         file: [],
    //     };
    //
    //     console.log("Posting data:", postData);
    //     setText("");
    //     localStorage.removeItem("savedText");
    // };

    // Save text to local storage on change
    useEffect(() => {
        if (text) {
            localStorage.setItem("savedText", JSON.stringify(text));
        }
    }, [text]);

    return (
        <div className="dark:bg-gray-900 dark:text-white h-screen">
            <div className="max-w-lg mx-auto pt-10 px-4">
                <div className="mb-4">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-black dark:text-white"
                    >
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
                    {!email.includes("@") && (
                        <p className="text-sm text-red-500 mt-1">Invalid email format</p>
                    )}
                </div>

                <textarea
                    ref={textAreaRef}
                    value={visibleText}
                    onChange={handleTextChange}
                    placeholder="Enter text here..."
                    maxLength={maxTextLength}
                    rows={10}
                    className="w-full p-2 border-2 border-orange-600 dark:border-white rounded-md bg-white dark:bg-gray-800 text-black dark:text-white resize-y"
                />

                <div className={`flex ${isMobile ? "flex-col" : "flex-row"} mt-4`}>
                    <button
                        className="p-2 m-1 bg-orange-600 text-white rounded-md"
                        onClick={() => insertTag("[b]", "[/b]")}
                    >
                        Bold
                    </button>
                    <button
                        className="p-2 m-1 bg-green-500 text-white rounded-md"
                        onClick={() => insertTag("[i]", "[/i]")}
                    >
                        Italic
                    </button>
                    <button
                        className="p-2 m-1 bg-red-500 text-white rounded-md"
                        onClick={() => insertTag("[spoiler]", "[/spoiler]")}
                    >
                        Spoiler
                    </button>
                </div>

                {isMobile && (
                    <div
                        {...handleSwipeMenu}
                        className={`fixed top-0 right-0 h-full w-64 bg-gray-800 text-white p-4 transform ${
                            isMenuOpen ? "translate-x-0" : "translate-x-full"
                        } transition-transform`}
                    >
                        <h2 className="text-lg font-bold mb-4">Insert Tags</h2>
                        <button
                            className="w-full p-2 mb-2 bg-orange-600 rounded-md"
                            onClick={() => insertTag("[b]", "[/b]")}
                        >
                            Bold
                        </button>
                        <button
                            className="w-full p-2 mb-2 bg-green-500 rounded-md"
                            onClick={() => insertTag("[i]", "[/i]")}
                        >
                            Italic
                        </button>
                        <button
                            className="w-full p-2 mb-2 bg-red-500 rounded-md"
                            onClick={() => insertTag("[spoiler]", "[/spoiler]")}
                        >
                            Spoiler
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TextEditor;
