import { createSlice} from "@reduxjs/toolkit";


const initialState = {
  roomId: "",
  members: [],
  settings: {
    time: null,
    words: "",
  },
};

const multiplayerSlice = createSlice({
  name: "multiplayer",
  initialState,
  reducers: {
    setMultiplayerInfo: (state, action) => {
      state.roomId = action.payload.roomId;
      state.members = action.payload.members;
      state.settings = action.payload.settings;
    },
  },
});

export const { setMultiplayerInfo } = multiplayerSlice.actions;
export default multiplayerSlice.reducer;
