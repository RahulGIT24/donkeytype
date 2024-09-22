import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    history:null,
    userAverageStats:null,
    recentTestResults:null,
    opponentTestResults:null
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
        setRecentTestResults:(state,action)=>{
            state.recentTestResults = action.payload
        },
        setOpponentTestResults:(state,action)=>{
            state.opponentTestResults = action.payload
        },
        revertRecentTestResults:(state)=>{
            state.recentTestResults = null
            state.opponentTestResults = null
        },
    }
})

export const {setHistory,setUserAverageStats,setRecentTestResults,revertRecentTestResults,setOpponentTestResults} = statSlice.actions
export default statSlice.reducer