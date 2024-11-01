import { Server, Socket } from "socket.io";
import { saveTestInDB } from "../utils/saveMultiplayerResults";
import { Room } from "../types/types";
import Redis from "ioredis";
import { createAdapter } from "@socket.io/redis-adapter";

const pubClient = new Redis({
  host: "localhost",
  port: 6379,
  username: "",
  password: "",
});
const subClient = pubClient.duplicate();

class SocketService {
  private _io: Server;
  private rooms: { [key: string]: Room } = {};

  constructor() {
    this._io = new Server({
      path: "/socket",
      cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
    this.subscribeToRoomEvents();
    this._io.adapter(createAdapter(pubClient,subClient));
  }

  private subscribeToRoomEvents() {
    subClient.subscribe("room-events");
    subClient.on("message", (channel, message) => {
      if (channel === "room-events") {
        const { event, roomId, data } = JSON.parse(message);
        switch (event) {
          case "create-room":
            this.rooms[roomId] = data;
            break;
          case "join-room":
            if (this.rooms[roomId]) {
              this.rooms[roomId].users.push(data.user);
            }
            break;
          case "leave-room":
            if (this.rooms[roomId]) {
              this.rooms[roomId].users = this.rooms[roomId].users.filter(
                (u) => u.id !== data.userId
              );
            }
            break;
          case "destroy-room":
            delete this.rooms[roomId];
            break;
        }
      }
    });
  }

  private publishRoomEvent(event: string, roomId: string, data: any) {
    pubClient.publish("room-events", JSON.stringify({ event, roomId, data }));
  }

  public init() {
    const io = this.io;
    io.on("connection", (socket: Socket) => {
      socket.on(
        "create-room",
        async (roomId: string, mode: any, creator: string, userId: string) => {
          if (!this.rooms[roomId]) {
            const room = {
              roomId,
              users: [{ id: socket.id, username: creator, userId }],
              mode: mode,
            };
            this.rooms[roomId] = room;
            socket.join(roomId);
            this.publishRoomEvent("create-room", roomId, room);
            io.to(socket.id).emit("Room Created", roomId);
          } else {
            io.to(socket.id).emit("error", "Room Already Exist");
          }
        }
      );

      socket.on(
        "join-room",
        (roomId: string, username: string, userId: string) => {
          const room = this.rooms[roomId];
          if (room && room.users.length < 2) {
            const userIndex = room.users.findIndex(
              (u) => u.id === socket.id || u.userId === userId
            );
            if (userIndex != -1) {
              io.to(socket.id).emit("error", "You can't join the same room");
              return;
            }
            const newUser = { id: socket.id, username, userId };
            room.users.push(newUser);
            room.isSaved = false;
            socket.join(roomId);
            this.publishRoomEvent("join-room", roomId, { user: newUser });
            io.to(roomId).emit("User Joined", roomId, room.mode);
          } else if (!room) {
            io.to(socket.id).emit("error", "Room Not Exist");
          } else {
            io.to(socket.id).emit("error", "Room is Full");
          }
        }
      );

      socket.on("verify-room", (roomId: string) => {
        const room = this.rooms[roomId];
        if (room && room.users.length < 2) {
          socket.emit("Verfied", socket.id);
        } else {
          socket.emit("Not Verfied", socket.id);
        }
      });

      socket.on("leave-room", (roomId: string) => {
        const room = this.rooms[roomId];
        if (room) {
          room.users = room.users.filter((user) => user.id !== socket.id);
          this.publishRoomEvent("leave-room", roomId, { userId: socket.id });
          io.to(roomId).emit("User Left", socket.id);
        }
      });

      // destroy room when user creates new one
      socket.on("destroy-room", (roomId: string) => {
        const room = this.rooms[roomId];
        if (!room) return;
        delete this.rooms[roomId];
        this.publishRoomEvent("destroy-room",roomId,{});
      });

      socket.on("complete-test", async (roomId: string, res: any) => {
        const room = this.rooms[roomId];
        if (!room) return;
        let userIndex = -1;
        if (room.users) {
          userIndex = room.users.findIndex((u) => u.id === socket.id);
        }

        const user = room.users[userIndex];
        if (room.isSaved) {
          return;
        }

        user.results = res;
        console.log(socket.id);
        console.log(user);

        const allResultsAvailable = room.users.every((u) => u.results);
        console.log(allResultsAvailable)
        if (allResultsAvailable) {
          const saveSuccess = await saveTestInDB({
            users: room.users as any,
            roomId,
          });
          if (saveSuccess) {
            room.isSaved = true;
            io.to(roomId).emit("test-completed");
          }
        }
      });

      // get room results based on id
      socket.on("give-results", (roomId: string) => {
        const room = this.rooms[roomId];
        if (!room) return;
        console.log(room.users)
        io.to(roomId).emit("Results", room.users);
      });

      socket.on("cleanup", (roomId: string) => {
        const room = this.rooms[roomId];
        if (!room) return;
        delete this.rooms[roomId];
      });

      socket.on("disconnect", () => {
        for (const roomId in this.rooms) {
          const room = this.rooms[roomId];
          let userIndex = -1;
          if (room && room.users) {
            userIndex = room.users.findIndex((u) => u.id === socket.id);
          }

          if (userIndex != -1) {
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
  }
  get io() {
    return this._io;
  }
}

export default SocketService;
