import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  time: "10",
};

const typeSlice: any = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSetting: (state, action) => {
      switch (action.payload.type) {
        case "time":
          state.time = action.payload.value;
          break;
      }
    },
  },
});
export const { setSetting } = typeSlice.actions;
export default typeSlice.reducer;
