import {useEffect, useState} from 'react';
import ThreadCard from "../components/ThreadCard.tsx";
import {BoardData} from "../models/BoardData.ts";
import axios from "axios";

const Board = () => {
    const [data, setData] = useState<BoardData | null | any>(null);

    useEffect(() => {
        axios.get<BoardData>('/api/b/catalog.json')
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                setData(error)
                console.error('Error fetching data from 2ch:', error);
            });
    }, []);

    return (
            <div className="gap-2">
                {data?.threads?.map((thread: any) => (
                    <ThreadCard key={thread.num} thread={thread}/>
                ))}
                <p>{data ?? 'no error'}</p>
            </div>
    );
};

export default Board;