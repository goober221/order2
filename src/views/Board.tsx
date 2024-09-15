import {useEffect, useState} from 'react';
import ThreadCard from "../components/ThreadCard.tsx";
import {BoardData} from "../models/BoardData.ts";
import axios from "axios";

interface PageData {
    isMobile: boolean;
}

const Board:React.FC<PageData> = ({isMobile}) => {
    const [data, setData] = useState<BoardData | null >(null);
    const getNsfwMode = () => {
        return localStorage.getItem('nsfw') === "1";
    }

    const setNsfwModeAction = () => {
        const currentNsfw =  localStorage.getItem('nsfw') === "1";
        const newState = currentNsfw ? "0" : "1";
        setNsfwMode(newState === '1');
        console.log('nsfw mode new state: ' + newState)
        localStorage.setItem('nsfw', newState);
    }

    const [nsfwMode, setNsfwMode] = useState<boolean>(getNsfwMode());

    useEffect(() => {
        axios.get<BoardData>('/api/b/catalog.json')
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.log('Error fetching data from 2ch:', error);
            });
    }, []);

    return (
        <>
            <button className="fixed top-0 right-0" onClick={setNsfwModeAction}>NSFW</button>
            <div className="gap-4">
                <p>aaa</p>
                {data?.threads?.map((thread) => (
                    <ThreadCard isMobile={isMobile} key={thread.num} nsfwMode={nsfwMode} thread={thread}/>
                ))}
            </div>
        </>
    );
};

export default Board;