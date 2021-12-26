import React from 'react'
import { useSelector } from 'react-redux'

const CardFooter = ({group}) => {
    const { homePosts } = useSelector(state => state)

    function getHiddenPostCount() {
        let count = 0
        for (const post of homePosts.posts) {
            if (post.groupId === group._id && post.isHidden) {
                count += 1
            }
        }
        return count
    }

    function getFlaggedPostCount() {
        let count = 0 
        for (const post of homePosts.posts) {
            if (post.groupId === group._id && post.isFlagged) {
                count += 1
            }
        }
        return count
    }

    return (
        <div className="card_footer">
            <div className="d-flex justify-content-between">
                <h6 style={{padding: '0 25px', cursor: 'pointer'}}>
                    {group.users.length} members
                </h6>

                <h6 style={{padding: '0 25px', cursor: 'pointer'}}>
                    {group.posts.length} total posts 
                </h6>
                
                <h6 style={{padding: '0 25px', cursor: 'pointer'}}>
                    {group.deletedPosts.length} deleted posts
                </h6>

                { !homePosts.loading &&
                <h6 style={{padding: '0 25px', cursor: 'pointer'}}>
                    {getFlaggedPostCount()} flagged posts
                </h6>
                }
                { !homePosts.loading &&
                <h6 style={{padding: '0 25px', cursor: 'pointer'}}>
                {getHiddenPostCount()} hidden posts
                </h6>
                }
                
            </div>

        </div>
    )
}

export default CardFooter
