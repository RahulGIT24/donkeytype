import { ObjectId } from "mongodb";
import { History } from "../models/history.model";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { PipelineStage } from "mongoose";

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
  const { limit } = req.query;
  const limitNumber = parseInt(limit as string, 10);

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

  const history = await History.find({ user: userId })
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
  const lasTenAverages = await History.aggregate<DocumentType>(avgLast10Pipeline);

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
    lastTenAverages:lasTenAverages[0]
  };

  return res.status(200).json(new ApiResponse(200, result));
});

const getResultStats = asyncHandler(async(req,res)=>{
  const {id} = req.body
  const user = req.user;
  if(!user || !user.id){
    return res.status(401).json(new ApiResponse(401, "Unauthorized Access"));
  }
  if (!ObjectId.isValid(id)) {
    return res.status(404).json(new ApiResponse(404, "Test Not found"));
  }
  const history = await History.findById(new ObjectId(id))
  if(!history){
    return res.status(404).json(new ApiResponse(404, "Test Not found"));
  }
  const userId= user.id
  if(history.user!=userId){
    return res.status(401).json(new ApiResponse(401, "Unauthorized Access"));
  }
  const stats = {
    wpm:Math.round(history.wpm),
    raw:Math.round(history.raw),
    accuracy:Math.round(history.accuracy),
    consistency:Math.round(history.consistency),
    mode:history.mode,
    chars:history.chars
  }
  return res.status(200).json(new ApiResponse(200, stats));
})

export { getHistory, getAverageStats,getResultStats };
