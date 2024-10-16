import {
  FiftyWordsBest,
  HunderedTwentySecBest,
  HunderedWordsBest,
  SixtySecondsBest,
  TenSecBest,
  TenWordsBest,
  ThritySecondsBest,
  TwentyFiveWordsBest,
} from "../models/alltimebest.model";
import { History } from "../models/history.model";
import { User } from "../models/user.model";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import fs from "fs";
import path from "path";

const filePath = path.join(__dirname, "data", "words.json");
let wordsFromJSON: any = {};
fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }
  wordsFromJSON = JSON.parse(data);
});

const getWords = asyncHandler(async (req, res) => {
  const { words, mode, type } = req.query;
  if (!words) {
    res
      .status(404)
      .json(new ApiResponse(404, "Please Provide number of words or time"));
  }

  let wordList = [];
  let numbersList = [];
  let punctuationsList = [];

  if (type !== undefined && type !== null) {
    if (String(type).includes("numbers")) {
      numbersList = wordsFromJSON.numbers;
    }
    if (String(type).includes("punctuations")) {
      punctuationsList = wordsFromJSON.punctuations;
    }
  }

  wordList = wordsFromJSON.words;

  const totalWords = Number(words);
  const numberOfNumbers = String(type).includes("numbers")
    ? Math.floor(totalWords * 0.2)
    : 0;
  const numberOfPunctuations = String(type).includes("punctuations")
    ? Math.floor(totalWords * 0.1)
    : 0;
  const numberOfWords = totalWords - (numberOfNumbers + numberOfPunctuations);

  const selectedWords = wordList
    .sort(() => 0.5 - Math.random())
    .slice(0, numberOfWords);
  const selectedNumbers = numbersList
    .sort(() => 0.5 - Math.random())
    .slice(0, numberOfNumbers);
  const selectedPunctuations = punctuationsList
    .sort(() => 0.5 - Math.random())
    .slice(0, numberOfPunctuations);

  let finalSelection = [
    ...selectedWords,
    ...selectedNumbers,
    ...selectedPunctuations,
  ];

  finalSelection = finalSelection.sort(() => 0.5 - Math.random());

  const wordsString = finalSelection.join(" ");

  let totalLetters = 0;
  for (let word of finalSelection) {
    totalLetters += word.length;
  }

  let averageWordLength = totalLetters / finalSelection.length;

  const resultObj = {
    text: wordsString,
    avgwordlength: Math.round(averageWordLength),
    mode,
  };
  return res.status(200).json(new ApiResponse(200, resultObj));
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
  const { wpm, raw, accuracy, consistency, chars, mode,multiplayer,opponent,winner,roomId,tie } = req.body;
  // if(opponentResult){
  //   const {wpm,raw,accuracy,consistency,chars,mode,winner,_id,opponent,tie,roomId} = opponentResult
  //   const check = await History.findOne({roomId})
  //   const ooponentHistory = new History({
  //     wpm: wpm,
  //     raw: raw,
  //     accuracy: accuracy,
  //     consistency: consistency,
  //     chars,
  //     mode,
  //     multiplayer,
  //     user: userId,
  //     winner: winner ? winner : null,
  //     opponent: opponent ? opponent : null,
  //     roomId:roomId?roomId : null,
  //     tie
  //   });
  // }
  const history = new History({
    wpm: wpm,
    raw: raw,
    accuracy: accuracy,
    consistency: consistency,
    chars,
    mode,
    multiplayer,
    user: userId,
    winner: winner ? winner : null,
    opponent: opponent ? opponent : null,
    roomId:roomId?roomId : null,
    tie
  });
  const savedHistory = await history.save();
  const savedHistoryId = savedHistory.id;
  if (!savedHistory) {
    return res.status(400).json(new ApiResponse(400, "Can't save history"));
  }
  userExist.testCompleted = userExist.testCompleted + 1;
  await userExist.save();
  let modelName: any;
  if (mode == "Words 10") {
    modelName = TenWordsBest;
  } else if (mode == "Words 25") {
    modelName = TwentyFiveWordsBest;
  } else if (mode == "Words 50") {
    modelName = FiftyWordsBest;
  } else if (mode == "Words 100") {
    modelName = HunderedWordsBest;
  } else if (mode == "Time 10 S") {
    modelName = TenSecBest
  } else if (mode == "Time 30 S") {
    modelName = ThritySecondsBest
  } else if (mode == "Time 60 S") {
    modelName = SixtySecondsBest
  } else if (mode == "Time 120 S") {
    modelName = HunderedTwentySecBest
  }

  const bestExist = await modelName.findOne({ user: userId });
  if (!bestExist) {
    const newBest = new modelName({
      history: savedHistory._id,
      user: userId,
    });
    await newBest.save();
    return res.status(200).json(new ApiResponse(201, savedHistoryId));
  }
  const historyCheck = await History.findById(bestExist.history);
  if ((historyCheck?.wpm as number) < wpm) {
    bestExist.history = savedHistory._id;
    await bestExist.save();
  }
  return res.status(200).json(new ApiResponse(201, savedHistoryId));
});

export { startTest, getWords, completeTest };
