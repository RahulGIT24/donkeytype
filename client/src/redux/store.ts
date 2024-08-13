import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userSlice";
import typeSettingReducer from "./reducers/typeSettingSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    setting:typeSettingReducer
  },
});

export default store;
