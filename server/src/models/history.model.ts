import mongoose from "mongoose";

export interface history extends Document{
    wpm:number,
    raw:number,
    accuracy:number,
    consistency:number,
    chars:string,
    mode:string,
    date:Date,
    user:mongoose.Schema.Types.ObjectId,
    opponent?:mongoose.Schema.Types.ObjectId,
    multiplayer:boolean,
    winner?:mongoose.Schema.Types.ObjectId
    roomId?:string
    tie?:boolean
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
        chars:{
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
        },
        opponent:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            default:null
        },
        winner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            default:null
        },
        roomId:{
            type:String,
            default:null
        },
        tie:{
            type:Boolean,
            default:false
        },
        multiplayer:{
            type:Boolean,
            default:false,
        }
    },{
        timestamps:true
    }
)

export const History = mongoose.model<history>("History",schema)