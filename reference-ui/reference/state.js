import {List} from "../node_modules/immutable/dist/immutable";

const referenceState = {
    //see comments in mainReducer
    isLocked: false,
    isStarted: false,
    isEnded: false,
    isDebug: false,
    token: Date.now().toString(),
    lastInteractionTime: new Date(),
    questions: List()
};

