import {useEffect, useState} from 'react';
import ThreadCard from "../components/ThreadCard.tsx";
import {BoardData} from "../models/BoardData.ts";
import axios from "axios";

const Board = () => {
    const [data, setData] = useState<BoardData | null>(null);

    useEffect(() => {
        axios.get<BoardData>('https://2ch.hk/b/catalog.json')
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <div>
            <div className="gap-2">
                {data?.threads.map((thread) => (
                    <ThreadCard key={thread.num} thread={thread}/>
                ))}
            </div>
        </div>
    );
};

export default Board;