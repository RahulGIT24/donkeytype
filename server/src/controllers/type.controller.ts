import {
  FiftyWordsBest,
  HunderedWordsBest,
  TenWordsBest,
  TwentyFiveWordsBest,
} from "../models/alltimebest.model";
import { History } from "../models/history.model";
import { User } from "../models/user.model";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import axios from "axios";

const getWords = asyncHandler(async (req, res) => {
  const { words } = req.query;
  let mode:null | string = null
  switch (Number(words)) {
    case 10:
      mode = "Words 10"
      break;
    case 25:
      mode = "Words 25"
      break;
    case 50:
      mode = "Words 50"
      break;
    case 100:
      mode = "Words 100"
      break;
  }
  if (!words) {
    res
      .status(404)
      .json(new ApiResponse(404, "Please Provide number of words"));
  }
  const response = await axios.get(
    `https://random-word-api.herokuapp.com/word?number=${words}`
  );
  const result = response.data.join(" ");
  let words_ = result.split(" ");
  let totalLetters = 0;

  for (let index = 0; index < words_.length; index++) {
      totalLetters += words_[index].length;
  }

let averageWordLength = totalLetters / words_.length;
  const resutlObj = {
    text:result,
    avgwordlength:Math.round(averageWordLength),
    mode
  }
  return res.status(200).json(new ApiResponse(200, resutlObj));
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
  let modelName: any;
  if (mode == "Words 10") {
    modelName = TenWordsBest;
  } else if (mode == "Words 25") {
    modelName = TwentyFiveWordsBest;
  } else if (mode == "Words 50") {
    modelName = FiftyWordsBest;
  } else if (mode == "Words 100") {
    modelName = HunderedWordsBest;
  }
  const bestExist = await modelName.findOne({ user: userId });
  if (!bestExist) {
    const newBest = new TenWordsBest({
      history: savedHistory._id,
      user: userId,
    });
    await newBest.save();
    return res.status(200).json(new ApiResponse(201, "Test saved"));
  }
  const historyCheck = await History.findById(bestExist.history);
  if ((historyCheck?.wpm as number) < wpm) {
    bestExist.history = savedHistory._id;
    await bestExist.save();
  }
  return res.status(200).json(new ApiResponse(201, "Test saved"));
});

export { startTest, getWords, completeTest };
