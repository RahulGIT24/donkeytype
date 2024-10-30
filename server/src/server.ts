import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import cron from "node-cron";
import SocketService from "./socket/socket";

const PORT = process.env.PORT ?? 5000;

config();
const corsOptions = {
  origin: `${process.env.FRONTEND_URL}`,
  credentials: true,
};

const app = express();
const httpServer = createServer(app);
const socketService  = new SocketService();

app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));

// Routes
import userRouter from "./routes/user.routes";
import typeRouter from "./routes/type.routes";
import statRouter from "./routes/stats.routes";
import connectDB from "./db";
import axios from "axios";

socketService.io.attach(httpServer);

connectDB()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log("Server Listening on port ", PORT);
    });
  })
  .catch((e) => {
    console.log(e);
  });

app.use("/donkeyapi/v1/users", userRouter);
app.use("/donkeyapi/v1/type", typeRouter);
app.use("/donkeyapi/v1/stats", statRouter);
app.get("/donkeyapi/v1/health", (req, res) => {
  res.status(200).json({ message: "Health is Good" });
});

socketService.init()

// to keep the backend up on render
const hitAPi = async () => {
  try {
    const res = await axios.get(
      `${process.env.BACKEND_URL}/donkeyapi/v1/health`
    );
    console.log(res.data.message);
  } catch (error) {
    console.log(error);
  }
};
cron.schedule("*/5 * * * *", async () => {
  await hitAPi();
});
