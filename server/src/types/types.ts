import { User } from "../models/user.model";

export interface DecodedToken {
  _id: string;
}

declare module "express-serve-static-core" {
  export interface Request {
    user?: typeof User.prototype;
  }
}

interface SocketUser{
  id:string,
  username?:string,
  userId:string,
  results?:any
}

export interface Room{
  roomId:string,
  users:SocketUser[],
  mode:any
}