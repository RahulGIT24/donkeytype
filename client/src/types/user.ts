export interface IUser {
  _id: string;
  name: string;
  username: string;
  testStarted: number | null;
  testCompleted: number | null;
  profilePic: string;
  createdAt: string;
}
export interface IMultiplayer {
  roomId: string | null;
  members: [];
  settings: ISetting;
  socketId: null | string;
  socketInstance:unknown,
  multiplayer:boolean,
  allUsersPresent:boolean
}

export interface ISetting{
  type:string|null,
  wordNumber:string | null,
  time:string | null,
  currentMode: string | null,
  typeOfText:any
}