import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  type:null,
  wordNumber: "10",
};


const typeSlice: any = createSlice({
  name: "setting",
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
