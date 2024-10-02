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

export interface ITest {
  users: IUserResult[];
  roomId: string;
}

export interface IUserResult {
  wpm: string;
  raw: string;
  accuracy: string;
  consistency: string;
  chars: string;
  mode: string;
  opponent: string;
  userId?: string;
  multiplayer?: boolean;
  winner: string|null;
  roomId?: string;
  tie?: boolean;
  results?: any;
}