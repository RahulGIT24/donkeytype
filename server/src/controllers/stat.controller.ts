import { ObjectId } from "mongodb";
import { History } from "../models/history.model";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

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
  const pipeline = [
    {
      $match: {
        user: userObjectId,
      },
    },
    { $count: "total" },
  ];
  const result = await History.aggregate(pipeline);
  const total = result[0].total;
  const history = await History.find({ user: userId })
    .limit(limitNumber)
    .select("-_id -user -__v");
  return res
    .status(200)
    .json(new ApiResponse(200, { history, totalResults: total,totalResultFetched:history.length }));
});

export { getHistory };
