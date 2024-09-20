import React, {useEffect, useState} from 'react';
import { useParams} from 'react-router-dom';
import axios from "axios";
import {ThreadDetailObj} from "../models/Thread.ts";
import PostCard from "../components/PostCard.tsx";

interface ThreadProps {
    isMobile: boolean;
    nsfwMode: boolean;
}

const Thread: React.FC<ThreadProps> = ({isMobile, nsfwMode}) => {
    const [data, setData] = useState<ThreadDetailObj | null>(null);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        axios
            .get<ThreadDetailObj>(`/api/b/res/${id}.json`)
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.log('Error fetching data from 2ch:', error);
            });
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="pt-14 w-full h-full bg-white dark:bg-gray-900 ">
            <h1>Thread Page</h1>
            {data?.threads[0].posts?.map((post) => {
                return (
                    <PostCard key={post.num} nsfwMode={nsfwMode} isMobile={isMobile} post={post}></PostCard>
                )
            })}
        </div>
    );
};

export default Thread;