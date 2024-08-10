import { History } from "../models/history.model";
import { User } from "../models/user.model";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import axios from "axios";

const getWords = asyncHandler(async (req, res) => {
  const { words } = req.query;
  if (!words) {
    res
      .status(404)
      .json(new ApiResponse(404, "Please Provide number of words"));
  }
  const response = await axios.get(
    `https://random-word-api.herokuapp.com/word?number=${words}`
  );
  const result = response.data.join(" ");
  res.status(200).json(new ApiResponse(200, result));
});

const startTest = asyncHandler(async (req, res) => {
  const user = req.user;
  const userId = user._id;
  const userExist = await User.findById(userId);
  if (!userExist) {
    return res.status(404).json(new ApiResponse(404, "User not exist in DB"));
  }
  userExist.testStarted = userExist.testStarted + 1;
  await userExist.save();
  return res.status(200).json(new ApiResponse(200, "Test Started"));
});

const completeTest = asyncHandler(async (req, res) => {
  const user = req.user;
  const userId = user._id;
  const userExist = await User.findById(userId);
  if (!userExist) {
    return res.status(404).json(new ApiResponse(404, "User not exist in DB"));
  }
  const { wpm, raw, accuracy, consistency, chars, mode } = req.body;
  const history = new History({
        wpm,
        raw,
        accuracy,
        consistency,
        chars,
        mode,
    user: userId,
  });
  const savedHistory = await history.save();
  if (!savedHistory) {
    return res.status(400).json(new ApiResponse(400, "Can't save history"));
  }
  userExist.testCompleted = userExist.testCompleted + 1;
  await userExist.save({ validateBeforeSave: false });
  return res.status(200).json(new ApiResponse(201, "Test saved"));
});

export { startTest, getWords, completeTest };
