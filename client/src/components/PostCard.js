import React from 'react'
import CardHeader from './home/post_card/CardHeader'
import CardBody from './home/post_card/CardBody'
import CardFooter from './home/post_card/CardFooter'

import Comments from './home/Comments'
import InputComment from './home/InputComment'

const PostCard = ({post, theme, groupId}) => {
    return (
        <div className="card my-3"> 
            <CardHeader post={post} groupId = {groupId}/>
            <CardBody post={post} theme={theme} />
            <CardFooter post={post} />

            <Comments post={post} />
            <InputComment post={post} />
        </div>
    )
}

export default PostCard
