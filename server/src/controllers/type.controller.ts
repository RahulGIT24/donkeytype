import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import axios from "axios";

export const getWords = asyncHandler(async (req, res) => {
  const { words } = req.query;
  if (!words) {
    res
      .status(404)
      .json(
        new ApiResponse(
          404,
          "Please Provide number of words"
        )
      );
  }
  const response = await axios.get(
    `https://random-word-api.herokuapp.com/word?number=${words}`
  );
  const result = response.data.join(' ');
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result
      )
    );
});
