import React, { useEffect, useState } from 'react'

import Status from '../../components/home/Status'
import Posts from '../../components/home/Posts'

import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import LoadIcon from '../../images/loading.gif'
import StatusModal from '../../components/StatusModal'
import { addAdmin, removeAdmin, inviteUser, leaveGroup, addRequest, addToGroup, denyRequest, rejectInvite } from '../../redux/actions/groupAction'
import {getDataAPI} from '../../utils/fetchData'
import { GLOBALTYPES} from '../../redux/actions/globalTypes'

let scroll = 0;

const Group = () => {
    const { id } = useParams()
    const { auth, status, homePosts, homeGroups, socket } = useSelector(state => state)
    const dispatch = useDispatch()

    const initState = {
        admin: '',
        delAdmin: '',
        approveRequest: '',
        denyReq: '',
        inviteReq: ''
    }
    const [groupData, setGroupData] = useState(initState)
    const { admin, delAdmin, approveRequest, denyReq, inviteReq } = groupData


    const handleInput = e => {
        const { name, value } = e.target
        setGroupData({ ...groupData, [name]:value })
    }

    const handleAddAdmin = async e => {
        e.preventDefault()

        const res = await getDataAPI(`search?username=${admin}`, auth.token)
        let p = res.data.users[0]._id
        let isAdmin = homeGroups.groups.filter((group) => (group.admins.includes(p) && (group._id === id)))
        let areYouIn = homeGroups.groups.filter((group) => (group.users.includes(auth.user._id) && (group._id === id)))
        let areYouAdmin = homeGroups.groups.filter((group) => (group.admins.includes(auth.user._id)))
        let isUser = homeGroups.groups.filter((group) => (group.users.includes(p) && (group._id === id)))

        if (areYouIn.length === 0) {
            dispatch({ type: GLOBALTYPES.ALERT, payload: {error: "You are not a part of this group"} })
        } else if (areYouAdmin.length === 0){
            dispatch({ type: GLOBALTYPES.ALERT, payload: {error: "Only group admins can add admins"} })
        } else if (isUser.length === 0) {
            dispatch({ type: GLOBALTYPES.ALERT, payload: {error: "Only members can be admins"} })
        } else if (isAdmin.length === 0) {
            dispatch(addAdmin({groupId: id, userId: res.data.users[0]._id, auth}))
        } else {
            dispatch({ type: GLOBALTYPES.ALERT, payload: {error: "User is already admin"} })
        }
    }

    const handleRemoveAdmin = async e => {
        e.preventDefault()

        const res1 = await getDataAPI(`search?username=${delAdmin}`, auth.token)

        let p = res1.data.users[0]._id
        let isAdmin = homeGroups.groups.filter((group) => (group.admins.includes(p) && (group._id === id)))
        let isCreator = homeGroups.groups.filter((group) => ((group.creator._id === p) && (group._id === id)))
        let areYouIn = homeGroups.groups.filter((group) => (group.users.includes(auth.user._id) && (group._id === id)))
        let areYouAdmin = homeGroups.groups.filter((group) => (group.admins.includes(auth.user._id)))
        let isUser = homeGroups.groups.filter((group) => (group.users.includes(p) && (group._id === id)))

        if (areYouIn.length === 0) {
            dispatch({ type: GLOBALTYPES.ALERT, payload: {error: "You are not a part of this group"} })
        } else if (areYouAdmin.length === 0){
            dispatch({ type: GLOBALTYPES.ALERT, payload: {error: "Only group admins can remove admins"} })
        } else if (isUser.length === 0) {
            dispatch({ type: GLOBALTYPES.ALERT, payload: {error: "Requested user is not in group"} })
        } else if (isAdmin.length === 0) {
            dispatch({ type: GLOBALTYPES.ALERT, payload: {error: "Requested user is not an admin"} })
        } else if (isCreator.length !== 0) {
            dispatch({ type: GLOBALTYPES.ALERT, payload: {error: "Cannot remove group creator"} })
        } else {
            dispatch(removeAdmin({groupId: id, userId: res1.data.users[0]._id, auth}))
        }
        
    }

    const handleJoinGroup = async e => {

        let areYouIn = homeGroups.groups.filter((group) => (group.users.includes(auth.user._id) && (group._id === id)))

        if (areYouIn.length !== 0) {
            dispatch({ type: GLOBALTYPES.ALERT, payload: {error: "You are already in this group"} })
        } else {
            for (const group of homeGroups.groups) {
                if(group._id === id) {
                    if (!group.joinRequests.includes(auth.user._id)) {
                        await dispatch(addRequest({auth, groupId: group._id, group: group, userId: auth.user._id, socket}))
                    } else {
                        dispatch({ type: GLOBALTYPES.ALERT, payload: {error: "You have already requested to join"} })
                    }
                }
            }
        }
    }

    const handleLeaveGroup = async e => {

        let areYouIn = homeGroups.groups.filter((group) => (group.users.includes(auth.user._id) && (group._id === id)))

        if (areYouIn.length === 0) {
            dispatch({ type: GLOBALTYPES.ALERT, payload: {error: "You are not a member"} })
        } else {
            for (const group of homeGroups.groups) {
                if(group._id === id) {
                    await dispatch(leaveGroup({group, auth, socket}))
                    dispatch({ type: GLOBALTYPES.ALERT, payload: {success: "You are now removed from the group"} })
                }
            }
        }
    }

    function getTheAdmins() {
        let adminsToShow = []
        adminsToShow.push('Group admins: ')
        for (const group of homeGroups.groups) {
            if (group._id === id) {
                for (const admin in group.admins){
                    let adminBoi = group.admins[admin]

                    let adminBoiPush = getDataAPI(`/user/${adminBoi}`, auth.token).then((res) =>
                        (res))
                        Promise.resolve(adminBoiPush).then((res) => {
                            localStorage.setItem(admin, res.data.user.username)
                        })

                    adminsToShow.push(localStorage.getItem(admin))
                    adminsToShow.push(',     ')
                } 
            }
        }
        return adminsToShow
    }

    function getReqs() {
        let requests = []
        requests.push('Pending requests: ')
        for (const group of homeGroups.groups) {
            if(group._id === id) {
                if(group.joinRequests.length === 0){
                    requests.push('No requests')
                } else {
                    for(const req in group.joinRequests) {

                        let reqBoi = group.joinRequests[req]

                        let requestUser = getDataAPI(`/user/${reqBoi}`, auth.token).then((res) =>(res))
                        Promise.resolve(requestUser).then((res) => {
                            localStorage.setItem('request' + req, res.data.user.username)
                        })

                    let reqNo = 'request' + req
                    requests.push(localStorage.getItem(reqNo))
                    requests.push(',     ')
                    }
                }
            }
        }
        return requests
    }

    const handleApproveRequest = async e => {
        const res = await getDataAPI(`search?username=${approveRequest}`, auth.token)
        let p = res.data.users[0]

        let areYouIn = homeGroups.groups.filter((group) => (group.users.includes(p._id) && (group._id === id)))

        if (areYouIn.length !== 0) {
            dispatch({ type: GLOBALTYPES.ALERT, payload: {error: "User already in group"} })
        } else {
            for (const group of homeGroups.groups) {
                if(group._id === id) {
                        await dispatch(addToGroup({auth, group: group, user: p, socket}))
                        dispatch({ type: GLOBALTYPES.ALERT, payload: {success: "User added to group"} })
                }
            }
        }
    }

    const handleDenyRequest = async e => {
        const res = await getDataAPI(`search?username=${denyReq}`, auth.token)
        let p = res.data.users[0]

        let areYouIn = homeGroups.groups.filter((group) => (group.users.includes(p._id) && (group._id === id)))

        if (areYouIn.length !== 0) {
            dispatch({ type: GLOBALTYPES.ALERT, payload: {error: "User was already added"} })
        } else {
            for (const group of homeGroups.groups) {
                if((group._id === id)) {
                        await dispatch(denyRequest({auth, groupId: group._id, group: group, user: p, socket}))
                        dispatch({ type: GLOBALTYPES.ALERT, payload: {success: "User request denied"} })
                } 
            }
        }
    }

    const handleInviteUser = async e => {
        const res = await getDataAPI(`search?username=${inviteReq}`, auth.token)
        let p = res.data.users[0]

        let areYouIn = homeGroups.groups.filter((group) => (group.users.includes(p._id) && (group._id === id)))
        let alreadyInvited = homeGroups.groups.filter((group) => (group.invitedUsers.includes(p._id) && (group._id === id)))

        if (areYouIn.length !== 0) {
            dispatch({ type: GLOBALTYPES.ALERT, payload: {error: "User already in group"} })
        } else if (alreadyInvited.length !== 0) {
            dispatch({ type: GLOBALTYPES.ALERT, payload: {error: "User already has outstanding invite"} })
        } else {
            for (const group of homeGroups.groups) {
                if(group._id === id) {
                        await dispatch(inviteUser({auth, groupId: id, group: group, userId: p._id, user: p, socket}))
                        dispatch({ type: GLOBALTYPES.ALERT, payload: {success: "User invited to group"} })
                }
            }
        }

    }

    const handleRejectInvite = async e => {
        //const res = await getDataAPI(`search?username=${auth}`, auth.token)
        let p = auth.user

        let areYouIn = homeGroups.groups.filter((group) => (group.users.includes(p._id) && (group._id === id)))
        let alreadyInvited = homeGroups.groups.filter((group) => (group.invitedUsers.includes(p._id) && (group._id === id)))

        if (areYouIn.length !== 0) {
            dispatch({ type: GLOBALTYPES.ALERT, payload: {error: "You are already in the group"} })
        } else if (alreadyInvited.length === 0) {
            dispatch({ type: GLOBALTYPES.ALERT, payload: {error: "You were not invited"} })
        } else {
            for (const group of homeGroups.groups) {
                if(group._id === id) {
                        await dispatch(rejectInvite({auth, groupId: id, group: group, userId: p._id, user: p, socket}))
                        dispatch({ type: GLOBALTYPES.ALERT, payload: {success: "You rejected the invite"} })
                }
            }
        }
    }


    window.addEventListener('scroll', () => {
        if(window.location.pathname === '/'){
            scroll = window.pageYOffset
            return scroll;
        }
    })

    useEffect(() => {
        setTimeout(() => {
            window.scrollTo({top: scroll, behavior: 'smooth'})
        }, 100)
    },[])

    return (
        <div className="home row mx-0">
            <div className="col-md-8">
            <div className="row">
            <div className="col-sm-8">
            {homeGroups.loading 
                    ? <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
                    : (homeGroups.groups.length > 0 && <h2>Group name: {homeGroups.groups.filter((group) => (group._id === id))[0].name}</h2>)}


            { !homePosts.loading && homePosts.posts.length > 0 &&
                <h6 style={{padding: '0 25px', cursor: 'pointer'}}>
                {getTheAdmins()} </h6>}

                { !homePosts.loading && homePosts.posts.length > 0 &&
                <h6 style={{padding: '0 25px', cursor: 'pointer'}}>
                {getReqs()} </h6>}

                </div>

                <div className="col-sm-4">


</div>
</div>
                <div className="row">
  
  

<div className="column">
            {!homeGroups.loading && homeGroups.groups.length > 0 && 
            homeGroups.groups.filter((group) => group._id === id)[0].admins.includes(auth.user._id) &&
                <div className="form-group">
                    <label htmlFor="admins"></label>
                    <div className="position-relative">
                        <input type="text" className="form-control" id="admin" size="15" placeholder= 'Add admin'
                        name="admin" value={admin} onChange={handleInput} />
                        <small className="text-danger position-absolute"
                        style={{top: '50%', right: '10px', transform: 'translateY(-50%)'}}>
                            {admin.length}/25
                        </small>
                    </div>
                </div>} 

                {/* { !homePosts.loading && homePosts.posts.length > 0 &&
                <h6 style={{padding: '0 25px', cursor: 'pointer'}}>
                {getTheMembers()} </h6>} */}

                {!homeGroups.loading && homeGroups.groups.length > 0 && 
            homeGroups.groups.filter((group) => group._id === id)[0].admins.includes(auth.user._id) &&
            <button className="btn btn-primary" type="submit" onClick = {handleAddAdmin}>Add</button>
        } 

</div>
<div className="column">
            {!homeGroups.loading && homeGroups.groups.length > 0 && 
            homeGroups.groups.filter((group) => group._id === id)[0].admins.includes(auth.user._id) &&

                <div className="form-group">
                    <label htmlFor="delAdmin"></label>
                    <div className="position-relative">
                        <input type="text" className="form-control" id="delAdmin" size="15" placeholder= 'Remove admin'
                        name="delAdmin" value={delAdmin} onChange={handleInput} />
                        <small className="text-danger position-absolute"
                        style={{top: '50%', right: '10px', transform: 'translateY(-50%)'}}>
                            {delAdmin.length}/25
                        </small>
                    </div>
                </div>}

            {
                !homeGroups.loading && homeGroups.groups.length > 0 && 
            homeGroups.groups.filter((group) => group._id === id)[0].admins.includes(auth.user._id) &&
            <button className="btn btn-primary btn-danger" type="submit" onClick = {handleRemoveAdmin}>Remove</button>
            }
</div>
<div className="column">

            {!homeGroups.loading && homeGroups.groups.length > 0 && 
            homeGroups.groups.filter((group) => group._id === id)[0].admins.includes(auth.user._id) &&

                <div className="form-group">
                    <label htmlFor="approveRequest"></label>
                    <div className="position-relative">
                        <input type="text" className="form-control" id="approveRequest" size="15" placeholder= 'Approve req'
                        name="approveRequest" value={approveRequest} onChange={handleInput} />
                        <small className="text-danger position-absolute"
                        style={{top: '50%', right: '10px', transform: 'translateY(-50%)'}}>
                            {approveRequest.length}/25
                        </small>
                    </div>
                </div>}

            {
                !homeGroups.loading && homeGroups.groups.length > 0 && 
            homeGroups.groups.filter((group) => group._id === id)[0].admins.includes(auth.user._id) &&
            <button className="btn btn-primary" type="submit" onClick = {handleApproveRequest}>Approve</button>
            }

</div>
<div className="column">

            {!homeGroups.loading && homeGroups.groups.length > 0 && 
            homeGroups.groups.filter((group) => group._id === id)[0].admins.includes(auth.user._id) &&

                <div className="form-group">
                    <label htmlFor="denyReq"></label>
                    <div className="position-relative">
                        <input type="text" className="form-control" id="denyReq" size="15" placeholder= 'Deny req'
                        name="denyReq" value={denyReq} onChange={handleInput} />
                        <small className="text-danger position-absolute"
                        style={{top: '50%', right: '10px', transform: 'translateY(-50%)'}}>
                            {denyReq.length}/25
                        </small>
                    </div>
                </div>}

            {
                !homeGroups.loading && homeGroups.groups.length > 0 && 
            homeGroups.groups.filter((group) => group._id === id)[0].admins.includes(auth.user._id) &&
            <button className="btn btn-primary btn-danger" type="submit" onClick = {handleDenyRequest}>Deny</button>
            }
          </div>  

</div>
            <br></br>
            <br></br>

                {!homeGroups.loading && homeGroups.groups.length > 0 && 
            homeGroups.groups.filter((group) => group._id === id)[0].users.includes(auth.user._id) &&
                <Status groupId={id}/>}
                {status && <StatusModal groupId={id}/>}

                {
                    homePosts.loading 
                    ? <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
                    : (homePosts.result === 0 && homePosts.posts.length === 0)
                        ? <h2 className="text-center">No Posts</h2>
                        : <Posts groupId={id}/>
                }
                
            </div>
            <div className="col-md-2">

            {(!homeGroups.loading && homeGroups.groups.length > 0 && 
            (
                (homeGroups.groups.filter((group) => group._id === id)[0].privacy) ||
                (homeGroups.groups.filter((group) => group._id === id)[0].invitedUsers.includes(auth.user._id) ||
                (homeGroups.groups.filter((group) => group._id === id)[0].users.includes(auth.user._id))))
                ) &&


            ((homeGroups.groups.filter((group) => group._id === id)[0].invitedUsers.includes(auth.user._id) &&
            (!homeGroups.groups.filter((group) => group._id === id)[0].joinRequests.includes(auth.user._id))) 
            ? 
            (<button className="btn btn-primary" type="submit" onClick = {handleJoinGroup} >Accept Invite</button>)
            :
            (<button className="btn btn-primary" type="submit" onClick = {handleJoinGroup} >Join</button>))
            }
                &nbsp; 
                {(!homeGroups.loading && homeGroups.groups.length > 0 && 
            (
                (homeGroups.groups.filter((group) => group._id === id)[0].privacy) ||
                (homeGroups.groups.filter((group) => group._id === id)[0].invitedUsers.includes(auth.user._id) ||
                (homeGroups.groups.filter((group) => group._id === id)[0].users.includes(auth.user._id))))
                ) &&

            ((homeGroups.groups.filter((group) => group._id === id)[0].invitedUsers.includes(auth.user._id) &&
            (!homeGroups.groups.filter((group) => group._id === id)[0].joinRequests.includes(auth.user._id))) 
            ? 
            (<button className="btn btn-primary btn-danger" type="submit" onClick = {handleRejectInvite} >Reject Invite</button>)
            :
            (<button className="btn btn-primary btn-danger" type="submit" onClick = {handleLeaveGroup}>Leave</button>))
            }
                

            {!homeGroups.loading && homeGroups.groups.length > 0 && 
            homeGroups.groups.filter((group) => group._id === id)[0].users.includes(auth.user._id) &&
                <div className="form-group">
                    <label htmlFor="inviteReq"></label>
                    <div className="position-relative">
                        <input type="text" className="form-control" id="inviteReq" size="15" placeholder= 'Invite user'
                        name="inviteReq" value={inviteReq} onChange={handleInput} />
                        <small className="text-danger position-absolute"
                        style={{top: '50%', right: '10px', transform: 'translateY(-50%)'}}>
                            {inviteReq.length}/25
                        </small>
                    </div>
                </div>} 

                {!homeGroups.loading && homeGroups.groups.length > 0 && 
            homeGroups.groups.filter((group) => group._id === id)[0].users.includes(auth.user._id) &&
            <button className="btn btn-primary" type="submit" onClick = {handleInviteUser}>Invite</button>
        } 
            </div>
        </div>
    )
}

export default Group
