import React from "react";
import PostCreate from "./PostCreate";
import PostList from "./PostList";

function App() {
    return (
        <div className="container">
            <h1 className="mb-3">Create Post</h1>
            <PostCreate />
            <hr />
            <h1>Posts</h1>
            <PostList />
        </div>
    )
}

export default App;