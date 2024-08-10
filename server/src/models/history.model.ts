import mongoose from "mongoose";

export interface history extends Document{
    wpm:number,
    raw:number,
    accuracy:number,
    consistency:number,
    chars:string,
    mode:string,
    date:Date,
    user:mongoose.Schema.Types.ObjectId
}

const schema = new mongoose.Schema<history>(
    {
        wpm:{
            type:Number,
            required:[true,"Provide word per minute"]
        },
        raw:{
            type:Number,
            required:[true,"Provide raw word per minute"]
        },
        accuracy:{
            type:Number,
            required:[true,"Provide accuracy"]
        },
        consistency:{
            type:Number,
            required:[true,"Provide consistency"]
        },
        mode:{
            type:String,
            required:[true,"Provide mode of typing"]
        },
        date:{
            type:Date,
            default:Date.now()
        },
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    }
)

export const History = mongoose.model<history>("History",schema)