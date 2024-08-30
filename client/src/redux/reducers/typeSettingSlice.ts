import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  type:null,
  wordNumber: "10",
  time: 10,
  currentMode:"Words 10",
  typeOfText:[]
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

          case "time" : 
          state.time = action.payload.value;
          break;
      }
    },
    setCurrentMode:(state,action)=>{
      state.currentMode = action.payload
    },
    setTypeOfText:(state,action)=>{
      state.typeOfText = [...state.typeOfText, action.payload];
    },
    filterTypeOfText: (state, action) => {
      state.typeOfText = state.typeOfText.filter((item:string) => item !== action.payload);
    }
  },
});
export const { setSetting,setCurrentMode,setTypeOfText,filterTypeOfText } = typeSlice.actions;
export default typeSlice.reducer;