import { History } from "../models/history.model";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { PipelineStage } from "mongoose";
import { User } from "../models/user.model";
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
import { ObjectId } from "mongodb";
import { ObjectId as BsonObjectId } from "bson";

interface DocumentType {
  user: ObjectId;
  accuracy: number;
  consistency: number;
  raw: number;
  wpm: number;
  mode: string;
}

const getHistory = asyncHandler(async (req, res) => {
  const user = req.user;
  const userId = user._id;
  const userObjectId = new ObjectId(userId);
  const { limit, mode } = req.query;
  const limitNumber = parseInt(limit as string, 10);
  const multiplayer = mode === "NORMAL" ? false : true;

  if (isNaN(limitNumber) || limitNumber <= 0) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Invalid limit parameter"));
  }

  const pipeline: PipelineStage[] = [
    {
      $match: {
        user: userObjectId,
      },
    },
    { $count: "total" },
  ];

  const result = await History.aggregate<{ total: number }>(pipeline);
  const total = result[0]?.total || 0;

  const history = await History.find({ user: userId, multiplayer: multiplayer })
    .sort({ createdAt: -1 })
    .limit(limitNumber)
    .select("-user -__v");

  return res.status(200).json(
    new ApiResponse(200, {
      history,
      totalResults: total,
      totalResultFetched: history.length,
    })
  );
});

const getAverageStats = asyncHandler(async (req, res) => {
  const user = req.user;
  const userId = user._id;
  const userObjectId = new ObjectId(userId);

  const avgpipeline: PipelineStage[] = [
    {
      $match: {
        user: userObjectId,
      },
    },
    {
      $group: {
        _id: null,
        averageAccuracy: { $avg: "$accuracy" },
        averageWpm: { $avg: "$wpm" },
        averageConsistency: { $avg: "$consistency" },
        averageRawpm: { $avg: "$raw" },
      },
    },
    {
      $project: {
        averageAccuracy: { $round: ["$averageAccuracy", 2] },
        averageWpm: { $round: ["$averageWpm", 2] },
        averageConsistency: { $round: ["$averageConsistency", 2] },
        averageRawpm: { $round: ["$averageRawpm", 2] },
      },
    },
  ];

  const avgLast10Pipeline: PipelineStage[] = [
    {
      $match: {
        user: userObjectId,
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $limit: 10,
    },
    {
      $group: {
        _id: null,
        averageAccuracy: { $avg: "$accuracy" },
        averageWpm: { $avg: "$wpm" },
        averageConsistency: { $avg: "$consistency" },
        averageRawpm: { $avg: "$raw" },
      },
    },
    {
      $project: {
        averageAccuracy: { $round: ["$averageAccuracy", 2] },
        averageWpm: { $round: ["$averageWpm", 2] },
        averageConsistency: { $round: ["$averageConsistency", 2] },
        averageRawpm: { $round: ["$averageRawpm", 2] },
      },
    },
  ];

  const highestwpmpipeline: PipelineStage[] = [
    {
      $match: { user: userObjectId },
    },
    {
      $sort: { wpm: -1 },
    },
    {
      $limit: 1,
    },
  ];

  const highestpipeline: PipelineStage[] = [
    {
      $match: { user: userObjectId },
    },
    {
      $group: {
        _id: null,
        highestAccuracy: { $max: "$accuracy" },
        highestConsistency: { $max: "$consistency" },
        highestRaw: { $max: "$raw" },
      },
    },
  ];

  const avg = await History.aggregate<DocumentType>(avgpipeline);
  const wpm = await History.aggregate<DocumentType>(highestwpmpipeline);
  const highest = await History.aggregate<DocumentType>(highestpipeline);
  const lasTenAverages = await History.aggregate<DocumentType>(
    avgLast10Pipeline
  );

  if (!avg.length || !wpm.length || !highest.length) {
    return res.status(404).json(new ApiResponse(404, "No data found"));
  }

  const result = {
    averages: avg[0],
    highestWPM: {
      wpm: wpm[0].wpm,
      mode: wpm[0].mode,
    },
    max: highest[0],
    lastTenAverages: lasTenAverages[0],
  };

  return res.status(200).json(new ApiResponse(200, result));
});

const getResultStats = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const user = req.user;
  const history = await History.findById(new ObjectId(id));
  if (!history) {
    return res.status(404).json(new ApiResponse(404, "Test Not found"));
  }

  const isMultiplayer = history.multiplayer;
  if (isMultiplayer) {
    const roomId = history.roomId;
    const opponentId = history.opponent;
    const opponent = await User.findById(opponentId);
    const opponentHistory = await History.findOne({
      roomId: roomId,
      multiplayer: true,
      user: opponentId,
    });
    if (opponentHistory) {
      const stats = {
        user1: {
          username: user?.username,
          profilePic: user?.profilePic,
        },
        user1Results: {
          wpm: Math.round(history.wpm),
          raw: Math.round(history.raw),
          accuracy: Math.round(history.accuracy),
          consistency: Math.round(history.consistency),
          mode: history.mode,
          chars: history.chars,
          multiplayer: history.multiplayer,
        },
        user2: {
          username: opponent?.username,
          profilePic: opponent?.profilePic,
        },
        user2Results: {
          wpm: Math.round(opponentHistory.wpm),
          raw: Math.round(opponentHistory.raw),
          accuracy: Math.round(opponentHistory.accuracy),
          consistency: Math.round(opponentHistory.consistency),
          mode: opponentHistory.mode,
          chars: opponentHistory.chars,
          multiplayer: opponentHistory.multiplayer,
        },
        winner: history.winner,
        tie: history.tie,
        multiplayer: true,
      };
      return res.status(200).json(new ApiResponse(200, stats));
    }
  }

  const stats = {
    wpm: Math.round(history.wpm),
    raw: Math.round(history.raw),
    accuracy: Math.round(history.accuracy),
    consistency: Math.round(history.consistency),
    mode: history.mode,
    chars: history.chars,
    multiplayer: history.multiplayer,
  };
  return res.status(200).json(new ApiResponse(200, stats));
});

const singlePlayerLeaderBoard = asyncHandler(async (req, res) => {
  const mode = req.params.mode;
  console.log(mode);
  const limit = req.params.limit || 10;
  console.log(limit);
  let results;
  let historyIds: Array<BsonObjectId> = [];

  switch (mode) {
    case "Words 10":
      const tenWordsBest = await TenWordsBest.find({})
        .select("history -_id")
        .limit(limit as number);
      historyIds = tenWordsBest.map(
        (doc) => new BsonObjectId(doc.history.toString())
      );
      break;

    case "Words 25":
      const twentyFiveWords = await TwentyFiveWordsBest.find({})
        .select("history -_id")
        .limit(limit as number);
      historyIds = twentyFiveWords.map(
        (doc) => new BsonObjectId(doc.history.toString())
      );
      break;
    case "Words 50":
      const fiftyWords = await FiftyWordsBest.find({})
        .select("history -_id")
        .limit(limit as number);
      historyIds = fiftyWords.map(
        (doc) => new BsonObjectId(doc.history.toString())
      );

    case "Words 100":
      const hunderedWords = await HunderedWordsBest.find({})
        .select("history -_id")
        .limit(limit as number);
      historyIds = hunderedWords.map(
        (doc) => new BsonObjectId(doc.history.toString())
      );
      break;
    case "Time 10":
      const tenSec = await TenSecBest.find({})
        .select("history -_id")
        .limit(limit as number);
      historyIds = tenSec.map(
        (doc) => new BsonObjectId(doc.history.toString())
      );

      break;
    case "Time 30":
      const twentyFiveSec = await ThritySecondsBest.find({})
        .select("history -_id")
        .limit(limit as number);
      historyIds = twentyFiveSec.map(
        (doc) => new BsonObjectId(doc.history.toString())
      );
      break;
    case "Time 60":
      const fiftySec = await SixtySecondsBest.find({})
        .select("history -_id")
        .limit(limit as number);
      historyIds = fiftySec.map(
        (doc) => new BsonObjectId(doc.history.toString())
      );
      break;
    case "Time 120":
      const hunderedSec = await HunderedTwentySecBest.find({})
        .select("history -_id")
        .limit(limit as number);
      historyIds = hunderedSec.map(
        (doc) => new BsonObjectId(doc.history.toString())
      );
      break;
  }

  const queryFilter = {
    _id: { $in: historyIds },
    opponent: null,
    multiplayer: false,
  };

  if (historyIds.length != 0) {
    const count = await History.countDocuments(queryFilter);
    const history = await History.find(queryFilter)
      .select("profilePic wpm chars consistency accuracy")
      .populate("user", "username profilePic")
      .limit(limit as number);
    results = { data: history, count };
    return res.status(200).json(new ApiResponse(200, results ?? {}));
  } else {
    return res
      .status(404)
      .json(new ApiResponse(200, "No Results for this mode"));
  }
});

//to be made ^-^
const multiplayerPlayerLeaderBoard = asyncHandler(async (req, res) => {
  const mode = req.params.mode;
  console.log(mode);
  const limit = req.params.limit || 10;
  console.log(limit);
  let results;
  let historyIds: Array<BsonObjectId> = [];

  switch (mode) {
    case "Words 10":
      const tenWordsBest = await TenWordsBest.find({})
        .select("history -_id")
        .limit(limit as number);
      historyIds = tenWordsBest.map(
        (doc) => new BsonObjectId(doc.history.toString())
      );
      break;

    case "Words 25":
      const twentyFiveWords = await TwentyFiveWordsBest.find({})
        .select("history -_id")
        .limit(limit as number);
      historyIds = twentyFiveWords.map(
        (doc) => new BsonObjectId(doc.history.toString())
      );
      break;
    case "Words 50":
      const fiftyWords = await FiftyWordsBest.find({})
        .select("history -_id")
        .limit(limit as number);
      historyIds = fiftyWords.map(
        (doc) => new BsonObjectId(doc.history.toString())
      );

    case "Words 100":
      const hunderedWords = await HunderedWordsBest.find({})
        .select("history -_id")
        .limit(limit as number);
      historyIds = hunderedWords.map(
        (doc) => new BsonObjectId(doc.history.toString())
      );
      break;
    case "Time 10":
      const tenSec = await TenSecBest.find({})
        .select("history -_id")
        .limit(limit as number);
      historyIds = tenSec.map(
        (doc) => new BsonObjectId(doc.history.toString())
      );

      break;
    case "Time 30":
      const twentyFiveSec = await ThritySecondsBest.find({})
        .select("history -_id")
        .limit(limit as number);
      historyIds = twentyFiveSec.map(
        (doc) => new BsonObjectId(doc.history.toString())
      );
      break;
    case "Time 60":
      const fiftySec = await SixtySecondsBest.find({})
        .select("history -_id")
        .limit(limit as number);
      historyIds = fiftySec.map(
        (doc) => new BsonObjectId(doc.history.toString())
      );
      break;
    case "Time 120":
      const hunderedSec = await HunderedTwentySecBest.find({})
        .select("history -_id")
        .limit(limit as number);
      historyIds = hunderedSec.map(
        (doc) => new BsonObjectId(doc.history.toString())
      );
      break;
  }

  /*   const queryFilter = {
    _id: { $in: historyIds },
    opponent: { $ne: null },
    //multiplayer: true,
  }; */

  if (historyIds.length != 0) {
    const result = await History.aggregate([
      {
        $match: {
          mode: mode,
          multiplayer: true,
          roomId: { $ne: null },
          winner: { $ne: null },
        },
      },
      {
        $group: {
          _id: { winner: "$winner", roomId: "$roomId" },
          doc: { $first: "$$ROOT" },
        },
      },

      {
        $group: {
          _id: "$_id.winner",
          wins: { $sum: 1 },
          wpm: { $sum: "$doc.wpm" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: { path: "$user", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 1,
          wins: 1,
          wpm: 1,
          "user.username": 1,
          "user.email": 1,
          "user._id": 1,
        },
      },
      {
        $sort: { wins: -1 },
      },
    ]);
    return res
      .status(200)
      .json(new ApiResponse(200, { data: result, count: result.length }));
  } else {
    return res
      .status(404)
      .json(new ApiResponse(200, "No Results for this mode"));
  }
});

export {
  getHistory,
  getAverageStats,
  getResultStats,
  singlePlayerLeaderBoard,
  multiplayerPlayerLeaderBoard,
};
