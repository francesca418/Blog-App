import { GLOBALTYPES } from '../actions/globalTypes'
import { getDataAPI } from '../../utils/fetchData'

export const SUGGES_TYPES = {
    LOADING: 'LOADING_SUGGES',
    GET_USERS: 'GET_USERS_SUGGES',
    GET_GROUPS: 'GET_GROUPS_SUGGES'
}

export const getSuggestions = (token) => async (dispatch) => {
    try {
        dispatch({ type: SUGGES_TYPES.LOADING, payload: true })
        
        const res = await getDataAPI('suggestionsGroup', token)
        dispatch({ type: SUGGES_TYPES.GET_GROUPS, payload: res.data })

        dispatch({ type: SUGGES_TYPES.LOADING, payload: false })
        
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}