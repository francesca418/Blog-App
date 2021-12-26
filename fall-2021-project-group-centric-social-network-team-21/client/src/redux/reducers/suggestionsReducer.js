import { SUGGES_TYPES } from '../actions/suggestionsAction'

const initialState = {
    loading: false,
    groups: []
}


const suggestionsReducer = (state = initialState, action) => {
    switch (action.type){
        case SUGGES_TYPES.LOADING:
            return {
                ...state,
                loading: action.payload
            };
        case SUGGES_TYPES.GET_GROUPS:
            return {
                ...state,
                groups: action.payload.groups
            };
        default:
            return state;
    }
}

export default suggestionsReducer
