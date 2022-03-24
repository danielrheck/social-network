import { combineReducers } from "redux";
import friendsReducer from "./friends/slice.js";
import generalChatReducer from "./generalChat/slice.js";

const rootReducer = combineReducers({
    friends: friendsReducer,
    generalChatMessages: generalChatReducer,
});

export default rootReducer;
