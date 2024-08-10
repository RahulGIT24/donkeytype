import mongoose, { Schema } from "mongoose";

export interface Words extends Document {
  history: mongoose.Schema.Types.ObjectId;
  user:mongoose.Schema.Types.ObjectId
}

const tenWordsSchema = new Schema<Words>({
  history: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "History",
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
});
const fiftyWordsSchema = new Schema<Words>({
  history: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "History",
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
});
const twentyFiveWordsSchema = new Schema<Words>({
  history: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "History",
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
});
const hunderedWordsSchema = new Schema<Words>({
  history: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "History",
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
});

export const TenWordsBest = mongoose.model<Words>("tenwords",tenWordsSchema)
export const TwentyFiveWordsBest = mongoose.model<Words>("twentyfivewords",twentyFiveWordsSchema)
export const FiftyWordsBest = mongoose.model<Words>("fiftywords",fiftyWordsSchema)
export const HunderedWordsBest = mongoose.model<Words>("hunderedwords",hunderedWordsSchema)

