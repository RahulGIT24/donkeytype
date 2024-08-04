import { User } from "../models/user.model";

export interface DecodedToken {
  _id: string;
}

declare module "express-serve-static-core" {
  export interface Request {
    user?: typeof User.prototype;
  }
}