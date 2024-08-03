import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { Request, Response, NextFunction } from "express";
import { DecodedToken } from "../types/types";

export const verifyJWT = asyncHandler(
  async (req: Request, _: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        throw new ApiError(401, "Unauthorized Access");
      }

      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as DecodedToken;

      const user = await User.findById(decodedToken._id).select(
        "-password -refreshToken"
      );

      if (!user) {
        throw new ApiError(401, "User not found");
      }

      req.user = user;
      next();
    } catch (error) {
      throw new ApiError(401, "Invalid access token");
    }
  }
);
