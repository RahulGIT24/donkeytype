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
import fs from "fs";
import path from "path";

const filePath = path.join(__dirname, "data", "words.json");
let wordsFromJSON: any = [];
fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }
  wordsFromJSON = JSON.parse(data);
});

const getWords = asyncHandler(async (req, res) => {
  const { words } = req.query;
  let mode: null | string = null;
  switch (Number(words)) {
    case 10:
      mode = "Words 10";
      break;
    case 25:
      mode = "Words 25";
      break;
    case 50:
      mode = "Words 50";
      break;
    case 100:
      mode = "Words 100";
      break;
  }

  if (!words) {
    res
      .status(404)
      .json(new ApiResponse(404, "Please Provide number of words"));
  }
  const shuffled = wordsFromJSON.sort(() => 0.5 - Math.random());
  const selectedWords = shuffled.slice(0, Number(words));
  const wordsString = selectedWords.join(" ");

  let totalLetters = 0;

  for (let word of selectedWords) {
    totalLetters += word.length;
  }

  let averageWordLength = totalLetters / selectedWords.length;

  const resutlObj = {
    text: wordsString,
    avgwordlength: Math.round(averageWordLength),
    mode,
  };
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
  const savedHistoryId = savedHistory.id;
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
    const newBest = new modelName({   
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
  return res.status(200).json(new ApiResponse(201, savedHistoryId));
});

export { startTest, getWords, completeTest };
