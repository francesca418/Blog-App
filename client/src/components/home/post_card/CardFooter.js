import React, { useState, useEffect } from 'react'
import Send from '../../../images/send.svg'
import LikeButton from '../../LikeButton'
import { useSelector, useDispatch } from 'react-redux'
import { likePost, unLikePost, flagPost, unflagPost } from '../../../redux/actions/postAction'
import ShareModal from '../../ShareModal'
import { BASE_URL } from '../../../utils/config'
import { GLOBALTYPES } from '../../../redux/actions/globalTypes'


const CardFooter = ({post}) => {
    const [isLike, setIsLike] = useState(false)
    const [loadLike, setLoadLike] = useState(false)

    const [isShare, setIsShare] = useState(false)

    const { auth, theme, socket, homeGroups } = useSelector(state => state)
    const dispatch = useDispatch()

    // Likes
    useEffect(() => {
        if(post.likes.find(like => like._id === auth.user._id)){
            setIsLike(true)
        }else{
            setIsLike(false)
        }
    }, [post.likes, auth.user._id])

    const handleLike = async () => {
        if(loadLike) return;
        
        setLoadLike(true)
        await dispatch(likePost({post, auth, socket}))
        setLoadLike(false)
    }

    const handleUnLike = async () => {
        if(loadLike) return;

        setLoadLike(true)
        await dispatch(unLikePost({post, auth, socket}))
        setLoadLike(false)
    }

    const handleFlagPost = async () => {
        dispatch(flagPost({post, auth}))
        dispatch({ type: GLOBALTYPES.ALERT, payload: {success: "You flagged this post for deletion."} })
    }

    const handleUnflagPost = async () => {
        let isAdmin = homeGroups.groups.filter((group) => (group.admins.includes(auth.user._id) && (group._id === post.groupId)))
        if (isAdmin.length !== 0) {
            dispatch(unflagPost({post, auth}))
            dispatch({ type: GLOBALTYPES.ALERT, payload: {success: "You unflagged this post for deletion."} })
        } else {
            dispatch({ type: GLOBALTYPES.ALERT, payload: {error: "Only group admins can unflag posts for deletion."} })
        }
    }

    return (
        <div className="card_footer">
            <div className="card_icon_menu">
                <div>
                    <LikeButton 
                    isLike={isLike}
                    handleLike={handleLike}
                    handleUnLike={handleUnLike}
                    />

                    <img src={Send} alt="Send" onClick={() => setIsShare(!isShare)} />
                </div>

                {
                    post.isFlagged 
                    ?  <i className="fas fa-bookmark text-info" 
                    onClick={handleUnflagPost}/>
                    :  <i className="far fa-bookmark"
                    onClick={handleFlagPost} />
                }
               
            </div>

            <div className="d-flex justify-content-between">
                <h6 style={{padding: '0 25px', cursor: 'pointer'}}>
                    {post.likes.length} likes
                </h6>
                
                <h6 style={{padding: '0 25px', cursor: 'pointer'}}>
                    {post.comments.length} comments
                </h6>
            </div>

            {
                isShare && <ShareModal url={`${BASE_URL}/post/${post._id}`} theme={theme} />
            }
        </div>
    )
}

export default CardFooter
