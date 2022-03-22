import { combineReducers } from "redux";
import friendsReducer from "./friends/slice.js";

const rootReducer = combineReducers({ friends: friendsReducer });

export default rootReducer;
