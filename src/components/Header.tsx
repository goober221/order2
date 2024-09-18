import '../App.css'
import React, {useEffect} from "react";

interface HeaderProps {
    isScrolled: boolean;
    loading: boolean;
    setNsfwMode: React.Dispatch<React.SetStateAction<boolean>>;
    setIsScrolled: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ setNsfwMode, isScrolled, setIsScrolled, loading}) => {
    const setNsfwModeAction = () => {
        const currentNsfw = localStorage.getItem('nsfw') === "1";
        const newState = currentNsfw ? "0" : "1";
        setNsfwMode(newState === '1');
        localStorage.setItem('nsfw', newState);
    }

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <div
                className={`flex gap-2 fixed w-full h-16 items-center justify-end transition-all duration-300 ${isScrolled || loading ? 'dark:bg-opacity-90 bg-opacity-90 dark:bg-gray-900 bg-orange-600' : 'bg-transparent'}`}>
                <p className={`text-3xl left-14 absolute ${isScrolled ? 'text-white' : 'text-orange-600 dark:text-white'}`}>/b</p>
                <div className={`gap-2 absolute flex w-full h-full items-center justify-end `}>
                    <button className={`text-sm ${isScrolled ? 'text-white' : 'text-orange-600 dark:text-white'}`}
                            onClick={setNsfwModeAction}>NSFW
                    </button>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                         stroke="currentColor"
                         className={` size-8 mr-3 dark:text-white ${isScrolled ? 'text-white' : 'text-orange-600 dark:text-white'}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                    </svg>
                </div>

            </div>
        </>
    );
};

export default Header