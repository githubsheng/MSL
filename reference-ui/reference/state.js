import {List} from "../node_modules/immutable/dist/immutable";

const referenceState = {
    //see comments in mainReducer
    isLocked: false,
    lastInteractionTime: new Date(),
    pageInfo: {},
    questions: List()
};