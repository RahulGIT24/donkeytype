import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    history:null,
    userAverageStats:null
};

const statSlice = createSlice({
    name: "stats",
    initialState,
    reducers:{
        setHistory:(state,action)=>{
            state.history = action.payload
        },
        setUserAverageStats:(state,action)=>{
            state.userAverageStats = action.payload
        },
    }
})

export const {setHistory,setUserAverageStats} = statSlice.actions
export default statSlice.reducer