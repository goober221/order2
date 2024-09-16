import React from 'react';
import {useNavigate, useParams} from 'react-router-dom';

const Thread: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    return (
        <div>
            <h1>Thread Page</h1>
            <p>You are viewing thread ID: {id}</p>
            <button onClick={() => navigate(-1)}>Go back
            </button>
        </div>
    );
};

export default Thread;