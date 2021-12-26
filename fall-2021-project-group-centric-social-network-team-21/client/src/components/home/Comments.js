/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import CommentDisplay from './comments/CommentDisplay'

const Comments = ({post}) => {
    const [comments, setComments] = useState([])
    const [showComments, setShowComments] = useState([])
    const [next, setNext] = useState(100000000)

    useEffect(() => {
        const newCm = post.comments.filter(cm => !cm.reply)
        setComments(newCm)
        setShowComments(newCm.slice(newCm.length - next))
    },[post.comments, next])

    return (
        <div className="comments">
            {
                showComments.map((comment, index) => (
                    <CommentDisplay key={index} comment={comment} post={post}
                     />
                )).reverse()
            }

        </div>
    )
}

export default Comments
