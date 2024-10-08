import { User } from "../models/user.model";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import { mail } from "../utils/email";
import { DecodedToken } from "../types/types";
import { CookieOptions } from "express";

const generateAccessandRefreshToken = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (user == null) {
      throw new ApiResponse(
        401,
        "Something went wrong while generating access and refresh token"
      );
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiResponse(
      401,
      "Something went wrong while generating access and refresh token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, username, password } = req.body;
  if ([name, email, username, password].some((field) => field.trim() === "")) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Please send all the data"));
  }
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    return res
      .status(409)
      .json(
        new ApiResponse(
          409,
          "User with this email or username already registered"
        )
      );
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          "Passwords Length should be more than 8 characters"
        )
      );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verifyTokenExpiry = new Date();
  verifyTokenExpiry.setHours(verifyTokenExpiry.getHours() + 12);
  const verifyToken = jwt.sign(
    {
      email: email,
    },
    process.env.JWT_SECRET as string
  );

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    username: username.toLowerCase(),
    verifyToken,
    verifyTokenExpiry,
  });
  await user.save();

  const url = process.env.FRONTEND_URL + `/verifyToken/${verifyToken}`;

  if (!user) {
    return res
      .status(500)
      .json(
        new ApiResponse(500, "Something went wrong while registering the user")
      );
  }

  const mailed = await mail({ email: user.email, emailType: "verify", url });

  if (!mailed) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Can't send verification email"));
  }
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        "User registered Successfully. Please verify your email to get started"
      )
    );
});

const login = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Please provide all details"));
  }
  const user = await User.findOne({
    $or: [{ username: identifier }, { email: identifier }],
  });

  if (!user) {
    return res.status(404).json(new ApiResponse(404, "User not exist"));
  }

  if (user.isVerified === false) {
    const verifyTokenExpiry = new Date();
    verifyTokenExpiry.setHours(verifyTokenExpiry.getHours() + 12);
    const verifyToken = jwt.sign(
      {
        email: user.email,
      },
      process.env.JWT_SECRET as string
    );

    user.verifyToken = verifyToken;
    user.verifyTokenExpiry = verifyTokenExpiry;

    await user.save({ validateBeforeSave: true });
    let url = process.env.FRONTEND_URL + `/verifyToken/${verifyToken}`;
    const mailed = await mail({ email: user.email, url, emailType: "verify" });
    if (!mailed) {
      return res
        .status(400)
        .json(new ApiResponse(400, "Can't send verification email"));
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Verification email send. Please verify account before login"
        )
      );
  }

  const isCorrect = await user.passwordCompare(password);
  if (!isCorrect) {
    return res.status(401).json(new ApiResponse(401, "Invalid Credentials"));
  }

  const { accessToken, refreshToken } = await generateAccessandRefreshToken(
    user.id
  );

  const options: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, `Welcome Back ${accessToken}`));
});

const verifyToken = asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res
      .status(404)
      .json(new ApiResponse(404, "Please Provide the token"));
  }
  const user = await User.findOne({ verifyToken: token });
  if (!user || !user.verifyTokenExpiry) {
    return res.status(401).json(new ApiResponse(401, "Invalid Token"));
  }
  const date = new Date();
  if (date > user?.verifyTokenExpiry) {
    return res.status(401).json(new ApiResponse(401, "Token Expired"));
  }
  user.isVerified = true;
  user.verifyToken = "";
  user.verifyTokenExpiry = "";
  await user.save({ validateBeforeSave: true });
  return res.status(200).json(new ApiResponse(200, "User verified"));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(404).json(new ApiResponse(404, "Provide email"));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json(new ApiResponse(401, "User not exist"));
  }
  const forgotPasswordTokenExpiry = new Date();
  forgotPasswordTokenExpiry.setHours(
    forgotPasswordTokenExpiry.getMinutes() + 30
  );
  const forgotPasswordToken = jwt.sign(
    {
      email: email,
    },
    process.env.JWT_SECRET as string
  );
  user.forgotPasswordToken = forgotPasswordToken;
  user.forgotPasswordTokenExpiry = forgotPasswordTokenExpiry;
  await user.save();
  const url =
    process.env.FRONTEND_URL + `/change-password/${forgotPasswordToken}`;
  const mailed = await mail({ email: email, url, emailType: "forgotpassword" });
  if (mailed) {
    return res
      .status(200)
      .json(new ApiResponse(200, "Password Recovery Email Send"));
  }
  return res.status(400).json(new ApiResponse(400, "Can't send email"));
});

const changePassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res
      .status(404)
      .json(new ApiResponse(404, "Provide token or Password"));
  }
  const user = await User.findOne({ forgotPasswordToken: token });
  if (!user) {
    return res.status(401).json(new ApiResponse(401, "Session Expired"));
  }
  const currDate = new Date();
  if (currDate > user.forgotPasswordTokenExpiry) {
    user.forgotPasswordToken = "";
    user.forgotPasswordTokenExpiry = "";
    await user.save();
    return res.status(401).json(new ApiResponse(401, "Token expired"));
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.forgotPasswordToken = "";
  user.forgotPasswordTokenExpiry = "";
  await user.save();
  return res.status(200).json(new ApiResponse(200, "Password Updated"));
});

const refresh = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.body.refreshToken || req.cookies.refreshToken;
  if (!incomingRefreshToken) {
    return res
      .status(404)
      .json(new ApiResponse(404, "Refresh Token Not Found"));
  }

  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET as Secret
  ) as DecodedToken;

  const user = await User.findById(decodedToken?._id);

  if (!user) {
    return res.status(401).json(new ApiResponse(401, "Token Expired"));
  }

  if (incomingRefreshToken != user?.refreshToken) {
    return res.status(404).json(new ApiResponse(404, "Invalid Refresh Token"));
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  const { accessToken, refreshToken } = await generateAccessandRefreshToken(
    user?.id
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, "Access token refreshed"));
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options:CookieOptions = {
    httpOnly: true,
    secure: true, 
    sameSite: "none", 
    path: "/", 
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User logged Out"));
});

const getUser = asyncHandler(async (req, res) => {
  return res.status(200).send(new ApiResponse(200, req.user));
});

const profilePic = asyncHandler(async (req, res) => {
  const { pfp } = req.body;
  const userid = req.user._id;
  const user = await User.findByIdAndUpdate(userid, {
    profilePic: pfp,
    new: true,
  }).select(
    "_id  name username testStarted testCompleted profilePic createdAt"
  );
;

if(!user){
  return res.status(500).send(new ApiResponse(500, "Server error"));
}
return res.status(200).send(new ApiResponse(200, user));

});

export {
  registerUser,
  verifyToken,
  login,
  forgotPassword,
  changePassword,
  refresh,
  logoutUser,
  getUser,
  profilePic,
};
