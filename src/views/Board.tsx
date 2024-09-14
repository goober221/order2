import {useEffect, useState} from 'react';
import ThreadCard from "../components/ThreadCard.tsx";
import {BoardData} from "../models/BoardData.ts";
import axios from "axios";

const Board = () => {
    const [data, setData] = useState<BoardData | null >(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios.get<BoardData>('/api/b/catalog.json')
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                setError(error);
                console.log('Error fetching data from 2ch:', error);
            });
    }, []);

    return (
            <div className="gap-2">
                <p>aaa</p>
                {data?.threads?.map((thread) => (
                    <ThreadCard key={thread.num} thread={thread}/>
                ))}
                {error ? (<p>{error}</p>) : null}
            </div>
    );
};

export default Board;