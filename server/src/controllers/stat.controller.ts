import { ObjectId } from "mongodb";
import { History } from "../models/history.model";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { PipelineStage } from "mongoose";
import { User } from "../models/user.model";

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
  if (!user || !user.id) {
    return res.status(401).json(new ApiResponse(401, "Unauthorized Access"));
  }
  if (!ObjectId.isValid(id)) {
    return res.status(404).json(new ApiResponse(404, "Test Not found"));
  }
  const history = await History.findById(new ObjectId(id));
  if (!history) {
    return res.status(404).json(new ApiResponse(404, "Test Not found"));
  }
  const userId = user.id;
  if (history.user != userId) {
    return res.status(401).json(new ApiResponse(401, "Unauthorized Access"));
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
  console.log(req.params.mode);

  //this will put one user in the ARRAY again and again
  /* const result =  await History.find({mode:req.params.mode,opponent:null}).sort({ wpm: -1 }).limit(Number(req.params.limit)).populate('user','username email testCompleted profilePic name testStarted'); */

  const mode = req.params.mode; // Mode filter
  const page = parseInt(req.params.page) || 1; // Page number (default is 1)
  const limit = 10; // Limit documents per page
  const skip = (page - 1) * limit; // Number of documents to skip
  const result = await History.aggregate([
    // Match documents based on mode
    { $match: { mode: mode,opponent:null } },

    // Sort by 'wpm' in descending order
    { $sort: { wpm: -1 } },

    // Group by 'userId' to ensure unique users
    {
      $group: {
        _id: "$userId", // Group by 'userId'
        doc: { $first: "$$ROOT" }, // Keep the first document for each user
      },
    },

    // Replace the root document with the result of the grouping
    { $replaceRoot: { newRoot: "$doc" } },

    // Populate the 'userId' field and fetch only specific fields from 'user'
    {
      $lookup: {
        from: "users", // Collection to join with (User collection)
        localField: "user", // Field in History collection (e.g., 'userId')
        foreignField: "_id", // Field in User collection (usually '_id')
        as: "user", // Alias to store populated user information
      },
    },

    // Unwind the 'user' array to flatten it
    { $unwind: "$user" },

    // Project (include only specific fields from both 'History' and 'user')
    {
      $project: {
        wpm: 1,
        accuracy: 1,
        raw:1,
        chars:1,
        consistency:1,
        date: 1,
        "user._id": 1,
        "user.username": 1,
        "user.email": 1,
        "user.testStarted": 1,
        "user.testCompleted": 1,
        "user.profilePic": 1,
      },
    },

    // Pagination: Skip and limit the number of results
    { $skip: skip }, // Skip documents based on page
    { $limit: limit }, // Limit results to 10 per page
  ]);
  if (!result) {
    return res.status(401).json(new ApiResponse(404, "Not found"));
  }
  console.log(result);
  return res.status(200).json(new ApiResponse(200, result));
});

//to be made ^-^
const multiplayerPlayerLeaderBoard = asyncHandler(async (req, res) => {
  console.log(req.params.mode);

  const result = await History.find({ mode: req.params.mode, opponent: null })
    .sort({ wpm: -1 })
    .limit(Number(req.params.limit))
    .populate(
      "user",
      "username email testCompleted profilePic name testStarted"
    );
  if (!result) {
    return res.status(401).json(new ApiResponse(404, "Not found"));
  }
  console.log(result);
  return res.status(200).json(new ApiResponse(200, result));
});

export { getHistory, getAverageStats, getResultStats, singlePlayerLeaderBoard };

