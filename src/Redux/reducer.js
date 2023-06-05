import { EXERCISE } from "./actionsTypes";



const initialState = {
    exercise: []
};

export default function reducer (state = initialState, {type, payload}) {
switch(type) {
    case EXERCISE:
        return {
            ...state,
            exercise: [payload]
        }
        default:
        return { ...state, }
        }
}
