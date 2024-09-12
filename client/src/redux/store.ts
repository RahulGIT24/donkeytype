import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userSlice";
import typeSettingReducer from "./reducers/typeSettingSlice";
import statSlice from "./reducers/statSlice";
import multiplayerSlice from "./reducers/multiplayerSlice"
const store = configureStore({
  reducer: {
    user: userReducer,
    setting:typeSettingReducer,
    stats:statSlice,
    multiplayer:multiplayerSlice,
  },
});

export default store;
