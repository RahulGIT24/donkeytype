import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {};

const userSlice: any = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser : (state,action )=>{
            
    },
    resetUser :(state,action)=>{

    }
  },
});
export const {setUser, resetUser}  = userSlice.actions
export default userSlice.reducer;
