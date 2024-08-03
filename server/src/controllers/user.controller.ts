import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import bcrypt from "bcrypt";

const generateAccessandRefreshToken = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (user == null) {
      throw new ApiError(
        401,
        "Something went wrong while generating access and refresh token"
      );
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateAccessToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      401,
      "Something went wrong while generating access and refresh token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, username, password } = req.body;
  if ([name, email, username, password].some((field) => field.trim() === "")) {
    res.status(400).json(new ApiError(400, "Please send all the data"));
  }
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    res
      .status(409)
      .json(
        new ApiError(409, "User with this email or username already registered")
      );
  }

  if (password.length < 8) {
    res
      .status(400)
      .json(
        new ApiError(400, "Passwords Length should be more than 8 characters")
      );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    username: username.toLowerCase(),
  });
  await user.save();
  if (!user) {
    res
      .status(500)
      .json(
        new ApiError(500, "Something went wrong while registering the user")
      );
  }
  return res
    .status(201)
    .json(new ApiResponse(200, "User registered Successfully"));
});

export { registerUser };
