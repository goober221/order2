import '../App.css'
import React, {useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";

interface HeaderProps {
    isScrolled: boolean;
    loading: boolean;
    setNsfwMode: React.Dispatch<React.SetStateAction<boolean>>;
    setIsScrolled: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ setNsfwMode, isScrolled, setIsScrolled, loading}) => {
    const location = useLocation();
    const navigate = useNavigate();

    const isBasePath = location.pathname === '/';

    const handleRedirectToBase = () => {
        navigate('/');
    };

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
                className={`flex gap-2 fixed top-0 w-full h-16 items-center justify-end transition-all duration-300 ${isScrolled || loading ? 'dark:bg-opacity-90 bg-opacity-90 dark:bg-gray-900 bg-orange-600' : 'bg-transparent'}`}>
                <div className={`gap-2 absolute flex w-full h-full items-center justify-end `}>
                    {!isBasePath && (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6 cursor-pointer"
                            onClick={handleRedirectToBase}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                            />
                        </svg>
                    )}
                    <span className={`text-sm ${isScrolled ? 'text-white' : 'text-orange-600 dark:text-white'}`}
                          onClick={setNsfwModeAction}>NSFW
                    </span>
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