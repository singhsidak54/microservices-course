import React, { useState } from "react";
import axios from "axios";

export default function CommentCreate({ postId }) {
    const [content, setContent] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
    
        await axios.post(`http://posts.com/posts/${postId}/comments`, {
            content
        });
    
        setContent('');
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <div className="form-group mb-3">
                    <label className="form-label" htmlFor="commentContent">Comment</label>
                    <input 
                        value={content} 
                        onChange={e => setContent(e.target.value)} 
                        className="form-control"
                        id="commentContent"
                    />
                </div>
                <button className="btn btn-primary mb-3">Submit</button>
            </form>
        </div>
    )
}