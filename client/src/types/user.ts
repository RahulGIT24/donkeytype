export interface IUser {
  _id: string;
  name: string;
  username: string;
  testStarted: number | null;
  testCompleted: number | null;
  profilePic: string;
  createdAt: string;
}
export interface Multiplayer {
  roomId: string | null;
  members: [];
  settings: {
    time: null | string;
    words: null | string;
  };
  socketId: null | string;
  socketInstance:unknown,
  multiplayer:boolean
}
