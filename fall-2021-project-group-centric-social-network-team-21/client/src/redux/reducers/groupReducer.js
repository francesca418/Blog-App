import { GROUP_TYPES } from '../actions/groupAction'
import { EditData, DeleteData } from '../actions/globalTypes'

const initialState = {
    loading: false,
    groups: [],
    result: 0,
    page: 2
}

const groupReducer = (state = initialState, action) => {
    switch (action.type){
        case GROUP_TYPES.CREATE_GROUP:
            return {
                ...state,
                groups: [action.payload, ...state.groups]
            };
        case GROUP_TYPES.LOADING_GROUP:
            return {
                ...state,
                loading: action.payload
            };
        case GROUP_TYPES.GET_GROUPS:
            return {
                ...state,
                groups: action.payload.groups,
                result: action.payload.result,
                page: action.payload.page
            };
        case GROUP_TYPES.UPDATE_GROUP:
            return {
                ...state,
                groups: EditData(state.groups, action.payload._id, action.payload)
            };
        case GROUP_TYPES.DELETE_GROUP:
            return {
                ...state,
                groups: DeleteData(state.groups, action.payload._id)
            };
        default:
            return state;
    }
}

export default groupReducer