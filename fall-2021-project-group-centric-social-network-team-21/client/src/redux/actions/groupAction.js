import { GLOBALTYPES } from './globalTypes'
import { postDataAPI, getDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData'
import { createNotify, removeNotify } from './notifyAction'

export const GROUP_TYPES = {
    CREATE_GROUP: 'CREATE_GROUP',
    LOADING_GROUP: 'LOADING_GROUP',
    GET_GROUPS: 'GET_GROUPS',
    UPDATE_GROUP: 'UPDATE_GROUP',
    GET_GROUP: 'GET_GROUP',
    DELETE_GROUP: 'DELETE_GROUP'
}

function parseTags(tags) {
    return tags.split(',')
};

export const createGroup = ({name, privacy, tags, auth, socket}) => async (dispatch) => {
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })
        const parsedTags = parseTags(tags)
        const res = await postDataAPI('groups', { name, privacy, tags: parsedTags }, auth.token)
        dispatch({ 
            type: GROUP_TYPES.CREATE_GROUP, 
            payload: {...res.data.newGroup, creator: auth.user, admin: [auth.user], users: [auth.user]} 
        })
        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: false} })

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const getGroups = (token) => async (dispatch) => {
    try {
        dispatch({ type: GROUP_TYPES.LOADING_GROUP, payload: true })

        const res = await getDataAPI('groups', token)
        
        dispatch({
            type: GROUP_TYPES.GET_GROUPS,
            payload: {...res.data, page: 2}
        })

        dispatch({ type: GROUP_TYPES.LOADING_GROUP, payload: false })
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const addAdmin = ({auth, groupId, userId, socket}) => async (dispatch) => {
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })

        const res = await patchDataAPI(`admin/${groupId}`, { 
             userId
        }, auth.token)

        dispatch({ type: GROUP_TYPES.UPDATE_GROUP, payload: res.data.newGroup })

        // Notify
        const msg = {
            id: res.data.newGroup._id,
            text: 'made you a group admin',
            recipients: userId,
            url: `/group/${res.data.newGroup._id}`,
            name: res.data.newGroup.name
        }

        dispatch(createNotify({msg, auth, socket}))

        dispatch({ type: GLOBALTYPES.ALERT, payload: {success: res.data.msg} })

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const removeAdmin = ({auth, groupId, userId, socket}) => async (dispatch) => {
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })

        const res = await patchDataAPI(`removeAdmin/${groupId}`, { 
             userId
        }, auth.token)

        dispatch({ type: GROUP_TYPES.UPDATE_GROUP, payload: res.data.newGroup })

        // Notify
        const msg = {
            id: res.data.newGroup._id,
            text: 'removed you as group admin',
            recipients: userId,
            url: `/group/${res.data.newGroup._id}`,
            name: res.data.newGroup.name
        }

        dispatch(createNotify({msg, auth, socket}))

        dispatch({ type: GLOBALTYPES.ALERT, payload: {success: res.data.msg} })

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const updateGroup = ({groupData, groupId, auth}) => async (dispatch) => {

    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })

        const res = await patchDataAPI(`group/${groupId}`, { 
            groupData, 
        }, auth.token)

        dispatch({ type: GROUP_TYPES.UPDATE_GROUP, payload: res.data.groupData })

        dispatch({ type: GLOBALTYPES.ALERT, payload: {success: res.data.msg} })
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const getGroup = ({id, auth}) => async (dispatch) => {
    try {
        const res = await getDataAPI(`group/${id}`, auth.token)
        dispatch({ type: GROUP_TYPES.GET_GROUP, payload: res.data.group })
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const deleteGroup = ({group, auth, socket}) => async (dispatch) => {
    dispatch({ type: GROUP_TYPES.DELETE_GROUP, payload: group })

    try {
        const res = await deleteDataAPI(`post/${group._id}`, auth.token)

        // Notify
        const msg = {
            id: group._id,
            text: 'deleted a group.',
            recipients: res.data.newGroup.users,
            url: `/group/${group._id}`,
            name: group.name
        }
        dispatch(removeNotify({msg, auth, socket}))
        
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const joinGroup = ({group, auth, socket}) => async (dispatch) => {
    const newGroup = {...group, users: [...group.users, auth.user]}
    dispatch({ type: GROUP_TYPES.UPDATE_GROUP, payload: newGroup})

    //socket.emit('joinGroup', newGroup)

    try {
        await patchDataAPI(`group/${group._id}/join`, null, auth.token)
        
        // Notify
        const msg = {
            id: auth.user._id,
            text: 'joined your group.',
            recipients: newGroup.users,
            url: `/group/${group._id}`,
            name: newGroup.name
        }

        dispatch(createNotify({msg, auth, socket}))

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const leaveGroup = ({group, auth, socket}) => async (dispatch) => {

    const newGroup = {...group, users: group.users.filter((user) => (group.users.includes(auth.user._id)))}

    dispatch({ type: GROUP_TYPES.UPDATE_GROUP, payload: newGroup})

    //socket.emit('leaveGroup', newGroup)

    try {
        const res = await patchDataAPI(`group/${group._id}/leave`, null, auth.token)

        dispatch({ type: GROUP_TYPES.UPDATE_GROUP, payload: res.data.newGroup })

        // Notify
        const msg = {
            id: res.data.newGroup._id,
            text: 'removed you as group admin',
            recipients: newGroup.users,
            url: `/group/${res.data.newGroup._id}`,
            name: res.data.newGroup.name
        }
         dispatch(createNotify({msg, auth, socket}))

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const incrementDelete = ({groupId, auth}) => async (dispatch) => {
    try {
        await patchDataAPI(`incrementDelete/${groupId}`)

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const addRequest = ({auth, groupId, group, userId, socket}) => async (dispatch) => {
    const newGroup = {...group, users: [...group.users, auth.user]}

    dispatch({ type: GROUP_TYPES.UPDATE_GROUP, payload: newGroup})

    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })

        const res = await patchDataAPI(`addRequest/${groupId}`, { 
             userId
        }, auth.token)


        dispatch({ type: GROUP_TYPES.UPDATE_GROUP, payload: res.data.newGroup })

        // Notify
        const msg = {
            id: groupId,
            text: 'requested to join your group',
            recipients: newGroup.admins,
            url: `/group/${groupId}`,
            name: res.data.newGroup.name
        }

        dispatch(createNotify({msg, auth, socket}))

        dispatch({ type: GLOBALTYPES.ALERT, payload: {success: res.data.msg} })

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const addToGroup = ({group, auth, user, socket}) => async (dispatch) => {
    const newGroup = {...group, users: [...group.users, user._id]}
    dispatch({ type: GROUP_TYPES.UPDATE_GROUP, payload: newGroup})

    try {
        const res = await patchDataAPI(`group/${group._id}/add`, { 
            user
       }, auth.token)
        
        // Notify
        const msg = {
            id: auth.user._id,
            text: 'added you to their group.',
            recipients: user._id,
            url: `/group/${group._id}`,
            name: res.data.newGroup.name
        }

        dispatch(createNotify({msg, auth, socket}))

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const denyRequest = ({group, groupId, auth, user, socket}) => async (dispatch) => {
    const newGroup = {...group, users: [...group.users, user._id]}
    dispatch({ type: GROUP_TYPES.UPDATE_GROUP, payload: newGroup})

            // Notify
            const msg = {
                id: groupId,
                text: 'denied your request to join their group',
                recipients: [user],
                url: `/group/${groupId}`,
                name: group.name
            }
    
            dispatch(createNotify({msg, auth, socket}))
    try {
        const res = await patchDataAPI(`group/${group._id}/deny`, { 
            user
       }, auth.token)

        dispatch({ type: GLOBALTYPES.ALERT, payload: {success: res.data.msg} })

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const inviteUser = ({auth, groupId, group, userId, user, socket}) => async (dispatch) => {
    const newGroup = {...group, users: [...group.users, auth.user]}

    dispatch({ type: GROUP_TYPES.UPDATE_GROUP, payload: newGroup})

    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })

        const res = await patchDataAPI(`inviteUser/${groupId}`, { 
            id : user._id
        }, auth.token)


        dispatch({ type: GROUP_TYPES.UPDATE_GROUP, payload: res.data.newGroup })
        // Notify
        const msg = {
            id: groupId,
            text: 'invited you to a group',
            recipients: [user],
            url: `/group/${groupId}`,
            name: res.data.newGroup.name
        }

        dispatch(createNotify({msg, auth, socket}))

        dispatch({ type: GLOBALTYPES.ALERT, payload: {success: res.data.msg} })

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const rejectInvite = ({auth, groupId, group, userId, user, socket}) => async (dispatch) => {
    const newGroup = {...group, users: [...group.users, auth.user]}

    dispatch({ type: GROUP_TYPES.UPDATE_GROUP, payload: newGroup})

    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })

        const res = await patchDataAPI(`rejectInvite/${groupId}`, { 
            id : auth.user._id
        }, auth.token)


        dispatch({ type: GROUP_TYPES.UPDATE_GROUP, payload: res.data.newGroup })
        // Notify
        const msg = {
            id: groupId,
            text: 'rejected invitation to join your group',
            recipients: group.users,
            url: `/group/${groupId}`,
            name: res.data.newGroup.name
        }

        dispatch(createNotify({msg, auth, socket}))

        dispatch({ type: GLOBALTYPES.ALERT, payload: {success: res.data.msg} })

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}