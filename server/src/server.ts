import express from "express";
import { config } from "dotenv";
import cors from "cors";

const app = express();
config();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello from Donkeytype");
});

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
