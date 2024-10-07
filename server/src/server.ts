import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cron from "node-cron";

const PORT = process.env.PORT ?? 5000;

config();
const corsOptions = {
  origin: `${process.env.FRONTEND_URL}`,
  credentials: true,
};
const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));

// Routes
import userRouter from "./routes/user.routes";
import typeRouter from "./routes/type.routes";
import statRouter from "./routes/stats.routes";
import connectDB from "./db";
import { Room } from "./types/types";
import axios from "axios";
import { saveTestInDB } from "./utils/saveMultiplayerResults";

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

// Socket Connection for multiplayers
const rooms: { [key: string]: Room } = {};

// socket connection
io.on("connection", (socket: Socket) => {
  socket.on(
    "create-room",
    (roomId: string, mode: any, creator: string, userId: string) => {
      if (!rooms[roomId]) {
        rooms[roomId] = {
          roomId,
          users: [{ id: socket.id, username: creator, userId }],
          mode: mode,
        };
        socket.join(roomId);
        io.to(socket.id).emit("Room Created", roomId);
      } else {
        io.to(socket.id).emit("error", "Room Already Exist");
      }
    }
  );

  socket.on("join-room", (roomId: string, username: string, userId: string) => {
    const room = rooms[roomId];
    if (room && room.users.length < 2) {
      const userIndex = room.users.findIndex(
        (u) => u.id === socket.id || u.userId === userId
      );
      if (userIndex != -1) {
        io.to(socket.id).emit("error", "You can't join the same room");
        return;
      }
      room.users.push({ id: socket.id, username, userId });
      socket.join(roomId);
      io.to(roomId).emit("User Joined", roomId, room.mode);
    } else if (!room) {
      io.to(socket.id).emit("error", "Room Not Exist");
    } else {
      io.to(socket.id).emit("error", "Room is Full");
    }
  });

  socket.on("verify-room", (roomId: string) => {
    const room = rooms[roomId];
    if (room && room.users.length < 2) {
      socket.emit("Verfied", socket.id);
    } else {
      socket.emit("Not Verfied", socket.id);
    }
  });

  socket.on("leave-room", (roomId: string) => {
    const room = rooms[roomId];
    const userIndex = room.users.findIndex((u) => u.id === socket.id);
    if (userIndex != -1) {
      io.to(roomId).emit("User Left", socket.id);
    }
  });

  // destroy room when user creates new one
  socket.on("destroy-room", (roomId: string) => {
    console.log("destroy room ");
    const room = rooms[roomId];
    if (!room) return;
  });

  socket.on("complete-test", async(roomId: string, res: any) => {
    const room = rooms[roomId];
    if (!room) return;
    const userIndex = room.users.findIndex((u) => u.id === socket.id);
    room.users[userIndex].results = res;
    if(await saveTestInDB({users:room.users as any, roomId})){
      io.to(roomId).emit("test-completed");
      // delete rooms[roomId]
    }
  });

  // get room results based on id
  socket.on("give-results", (roomId: string) => {
    const room = rooms[roomId];
    if (!room) return;
    io.to(roomId).emit("Results", room.users);
  });

  socket.on("cleanup",(roomId:string)=>{
    const room = rooms[roomId];
    if (!room) return;
    delete rooms[roomId];
  })

  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      const room = rooms[roomId];
      const userIndex = room.users.findIndex((u) => u.id === socket.id);

      if (userIndex!=-1) {
        room.users[userIndex].results = {
          wpm: 0,
          raw: 0,
          accuracy: 0,
          consistency: 0,
          chars: `${0}/${0}/${0}/${0}`,
          mode: "",
        };
      }

      io.to(roomId).emit("User Left", socket.id);
    }
  });
});

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
cron.schedule("* * * * *", async () => {
  await hitAPi();
});

// httpServer.listen(process.env.SOCKET_PORT, () => {
//   console.log("Socket Port is listening on PORT", process.env.SOCKET_PORT);
// });
