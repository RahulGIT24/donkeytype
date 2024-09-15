import { createSlice } from "@reduxjs/toolkit";
import { Multiplayer } from "../../types/user";
import { socket } from "../../socket/socket";

const initialState: Multiplayer = {
  roomId: null,
  members: [],
  settings: {
    time: null,
    words: "",
  },
  socketId: null,
  socketInstance: null,
  multiplayer: false,
};

const multiplayerSlice = createSlice({
  name: "multiplayer",
  initialState,
  reducers: {
    setRoomIdState: (state, action) => {
      state.roomId = action.payload;
    },
    setSocketInstance: (state, action) => {
      state.socketInstance = action.payload;
    },
    setSocketId: (state, action) => {
      state.socketId = action.payload;
    },
    setMultiplayer: (state, action) => {
      state.multiplayer = action.payload;
    },
    invalidateState: (state) => {
      state.members = [];
      state.settings = {
        time: null,
        words: "",
      };
      state.roomId = null;
    },
  },
});

export const {
  setRoomIdState,
  invalidateState,
  setSocketId,
  setSocketInstance,
  setMultiplayer,
} = multiplayerSlice.actions;

export const initializeSocket = () => (dispatch: any) => {
  socket.connect();
  socket.on("connect", () => {
    dispatch(setSocketId(socket.id));
    dispatch(setSocketInstance(socket));
  });
  return socket;
};

export default multiplayerSlice.reducer;
