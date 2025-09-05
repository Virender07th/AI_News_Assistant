import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../Slice/authSlice";
import profileReducer from "../Slice/profileSlice";
import dashboarsReducer from "../Slice/dashboardSlice";
import newsSlice from "../Slice/newsSlice";
 
const rootReducer =combineReducers({
    auth:authReducer, 
    profile:profileReducer,
    dashboard:dashboarsReducer,
    news:newsSlice

})

export default rootReducer;