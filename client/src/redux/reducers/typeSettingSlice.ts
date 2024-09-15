import { createSlice } from "@reduxjs/toolkit";
import { ISetting } from "../../types/user";

const initialState: ISetting = {
  type:null,
  wordNumber: "10",
  time: null,
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
    },
    resetState:(state)=>{
      state.type = null;
      state.type=null,
      state.wordNumber= "10",
      state.time= null,
      state.currentMode="Words 10",
      state.typeOfText=[]
    }
  },
});
export const { setSetting,setCurrentMode,setTypeOfText,filterTypeOfText,resetState } = typeSlice.actions;
export default typeSlice.reducer;