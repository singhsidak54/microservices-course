import React, { useState } from "react";
import axios from 'axios';

export default function PostCreate() {
    const [title, setTitle] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
    
        await axios.post('http://localhost:4000/posts', {
            title
        });
    
        setTitle('');
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <div className="form-group mb-3">
                    <label className="form-label" htmlFor="postTitle">Title</label>
                    <input 
                        value={title} 
                        onChange={e => setTitle(e.target.value)} 
                        className="form-control" 
                        id="postTitle"
                    />
                </div>
                <button className="btn btn-primary mb-3">Submit</button>
            </form>
        </div>
    )
}