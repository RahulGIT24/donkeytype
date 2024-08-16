import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  wordNumber: "10",
};

const typeSlice: any = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSetting: (state, action) => {
      switch (action.payload.type) {
        case "number":
          state.wordNumber = action.payload.value;
          break;
      }
    },
  },
});
export const { setSetting } = typeSlice.actions;
export default typeSlice.reducer;
