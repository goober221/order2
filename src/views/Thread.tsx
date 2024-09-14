import React from 'react';
import { useParams } from 'react-router-dom';

const Thread: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <div>
            <h1>Thread Page</h1>
            <p>You are viewing thread ID: {id}</p>
        </div>
    );
};

export default Thread;