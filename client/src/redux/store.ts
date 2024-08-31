import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userSlice";
import typeSettingReducer from "./reducers/typeSettingSlice";
import statSlice from "./reducers/statSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    setting:typeSettingReducer,
    stats:statSlice
  },
});

export default store;
