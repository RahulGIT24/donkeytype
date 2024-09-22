import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

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

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server Listening on port ", PORT);
    });
  })
  .catch((e) => {
    console.log("Database Error");
  });

app.use("/donkeyapi/v1/users", userRouter);
app.use("/donkeyapi/v1/type", typeRouter);
app.use("/donkeyapi/v1/stats", statRouter);

// Socket Connection for multiplayers
const rooms: { [key: string]: Room } = {};

// socket connection
io.on("connection", (socket: Socket) => {
  socket.on("create-room", (roomId: string, mode: any) => {
    if (!rooms[roomId]) {
      rooms[roomId] = { roomId, users: [socket.id], mode: mode };
      socket.join(roomId);
      io.to(socket.id).emit("Room Created", roomId);
    } else {
      io.to(socket.id).emit("error", "Room Already Exist");
    }
  });

  socket.on("join-room", (roomId: string) => {
    const room = rooms[roomId];
    if (room && room.users.length < 2) {
      room.users.push(socket.id);
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

  socket.on("leave-room",(roomId:string)=>{
    const room = rooms[roomId];
    const userIndex = room.users.indexOf(socket.id);
    if (userIndex != -1) {
      io.to(roomId).emit("User Left", socket.id);
      room.users.splice(userIndex, 1);
      console.log("User Left")
      if (room.users.length == 0) {
        delete rooms[roomId];
      }
    }
  })

  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      const room = rooms[roomId];
      const userIndex = room.users.indexOf(socket.id);
      if (userIndex != -1) {
        room.users.splice(userIndex, 1);
        io.to(roomId).emit("User Left", socket.id);
        console.log("User Left")
        if (room.users.length == 0) {
          delete rooms[roomId];
        }
      }
    }
  });
});

httpServer.listen(process.env.SOCKET_PORT, () => {
  console.log("Socket Port is listening on PORT", process.env.SOCKET_PORT);
});
