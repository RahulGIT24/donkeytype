import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
  
};

const userSlice: any = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser : (state,action )=>{
        const {name} = action.payload
    },
    resetUser :(state,action)=>{

    }
  },
});
export const {setUser, resetUser}  = userSlice.actions
export default userSlice.reducer;
