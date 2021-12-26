import { combineReducers } from 'redux'
import auth from './authReducer'
import alert from './alertReducer'
import theme from './themeReducer'
import profile from './profileReducer'
import status from './statusReducer'
import homePosts from './postReducer'
import homeGroups from './groupReducer'
import modal from './modalReducer'
import detailPost from './detailPostReducer'
import suggestions from './suggestionsReducer'
import socket from './socketReducer'
import notify from './notifyReducer'
import message from './messageReducer'
import online from './onlineReducer'
import peer from './peerReducer'


export default combineReducers({
    auth,
    alert,
    theme,
    profile,
    status,
    homePosts,
    homeGroups,
    modal,
    detailPost,
    suggestions,
    socket,
    notify,
    message,
    online,
    peer
})