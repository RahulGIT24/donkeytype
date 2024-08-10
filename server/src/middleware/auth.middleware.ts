import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/user.model";
import { ApiResponse } from "../utils/ApiResponse";
import { Request, Response, NextFunction } from "express";
import { DecodedToken } from "../types/types";

export const verifyJWT = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        res.status(401).json(new ApiResponse(401, "Unauthorized Access"));
      }

      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as DecodedToken;

      const user = await User.findById(decodedToken._id).select(
        "-password -refreshToken"
      );

      if (!user) {
        res.status(401).json(new ApiResponse(401, "User not found"));
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json(new ApiResponse(401, "Invalid access token"));
    }
  }
);
