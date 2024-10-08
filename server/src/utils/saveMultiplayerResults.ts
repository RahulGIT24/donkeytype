import { History } from "../models/history.model";
import { ITest, IUserResult } from "../types/types";

const saveHistory = async ({
  wpm,
  raw,
  accuracy,
  consistency,
  chars,
  mode,
  opponent,
  userId,
  multiplayer,
  winner,
  roomId,
  tie,
}: IUserResult) => {
  const history = new History({
    wpm: wpm,
    raw: raw,
    accuracy: accuracy,
    consistency: consistency,
    chars,
    mode,
    multiplayer,
    user: userId,
    winner: winner ? winner : null,
    opponent: opponent ? opponent : null,
    roomId: roomId ? roomId : null,
    tie,
  });
  await history.save();
};

export const saveTestInDB = async ({ users, roomId }: ITest) => {
  try {
    if (users.length < 2) return;

    let winner = null;
    let tie = false;

    let user1S = 0, user2S = 0;

    // extracting user results  
    const userResults1 = users[0].results;
    const userResults2 = users[1].results;

    if(!userResults1 || !userResults2) {
        return;
    };
    console.log("Hello")

    if(userResults1.wpm>userResults2.wpm){
        user1S++;
    }else if(userResults1.wpm<userResults2.wpm){
        user2S++;
    }
    if(userResults1.accuracy>userResults2.accuracy){
        user1S++;
    }else if(userResults1.accuracy<userResults2.accuracy){
        user2S++;
    }
    if(userResults1.consistency>userResults2.consistency){
        user1S++;
    }else if(userResults1.consistency<userResults2.consistency){
        user2S++;
    }

    if(user1S == user2S){
        tie = true;
    }else if(user1S>user2S){
        winner = users[0].userId as string
    }else{
        winner = users[1].userId as string
    }

    // user 1
    await saveHistory({
      wpm: userResults1.wpm,
      raw: userResults1.raw,
      accuracy: userResults1.accuracy,
      consistency: userResults1.consistency,
      chars: userResults1.chars,
      mode: userResults1.mode?userResults1.mode:userResults2.mode,
      winner,
      userId: users[0].userId,
      tie,
      roomId,
      opponent: users[1].userId as string,
      multiplayer:true
    });
    // user 2
    await saveHistory({
      wpm: userResults2.wpm,
      raw: userResults2.raw,
      accuracy: userResults2.accuracy,
      consistency: userResults2.consistency,
      chars: userResults2.chars,
      mode: userResults1.mode?userResults1.mode:userResults2.mode,
      winner,
      userId: users[1].userId,
      tie,
      roomId,
      opponent: users[0].userId as string,
      multiplayer:true
    });
    return true;
  } catch (e) {
    return false;
  }
};