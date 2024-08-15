import { createSlice } from "@reduxjs/toolkit";
import { IUser } from "../../types/user";

const initialUser: IUser = {
  _id:"",
  name:"",
  username:"",
  testStarted:null,
  testCompleted:null,
  profilePic:"",
  createdAt:"",
}

const initialState = {
  user:initialUser,
  isAuthenticated:null
};

const userSlice: any = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser:(state,action)=>{
      state.user = action.payload
    },
    setAuth:(state,action)=>{
      state.isAuthenticated = action.payload
    },
    revertInitial:(state)=>{
      state.isAuthenticated=null;
      state.user=initialUser
    }
  }
});
export const {setUser, setAuth,revertInitial}  = userSlice.actions
export default userSlice.reducer;
