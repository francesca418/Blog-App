import React from 'react'
import { useSelector } from 'react-redux'
import PostCard from '../PostCard'


const Posts = (groupId) => {
    const { homePosts, theme } = useSelector(state => state)

    return (
        <div className="posts">
            {
                homePosts.posts.filter((post) => (post.groupId === groupId.groupId && !post.isHidden)).map((post, i) => (
                    <PostCard key={i} post={post} theme={theme} groupId={groupId} />
                ))
            }

        </div>
    )
}

export default Posts
