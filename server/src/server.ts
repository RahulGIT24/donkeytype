import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from 'cookie-parser';
config();
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));
//app.use(express.static(path.join(__dirname, '../../client/dist')));
const port = process.env.PORT || 5000;

// Routes
import userRouter from "./routes/user.routes";
import typeRouter from "./routes/type.routes";
import statRouter from "./routes/stats.routes";
import connectDB from "./db";

connectDB().then(() => {
  app.listen(port, () => {
    console.log("Server Listening on port ", port);
  });
}).catch((e)=>{
    console.log("Database Error")
})

app.use("/donkeyapi/v1/users", userRouter);
app.use("/donkeyapi/v1/type", typeRouter);
app.use("/donkeyapi/v1/stats", statRouter);
