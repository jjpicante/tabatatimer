import{
    EXERCISE
} from "./actionsTypes"

export const currentExercise = (exercise) => {
    return {
        type: EXERCISE,
        payload: exercise,
    }
}