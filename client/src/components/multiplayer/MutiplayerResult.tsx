import { useEffect, useRef, useState } from "react";
import MainNav from "../navbars/MainNav";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../socket/socket";
import {
  setAllUsersPresent,
  setMultiplayer,
  setSocketId,
  setSocketInstance,
} from "../../redux/reducers/multiplayerSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import apiCall from "../../utils/apiCall";
import ResultCard from "./ResultCard";

export default function MultiplayerResult() {
  const myResult = useSelector((state: any) => state.stats.recentTestResults);
  const [opponent, setOpponent] = useState<any>(null);
  const winnerRef = useRef<any>();
  let myScore = 0;
  let opponentScore = 0;
  const navigate = useNavigate();

  useEffect(() => {
    if (multiplayerinfo.multiplayer === false) {
      navigate("/");
    }
  }, []);

  const multiplayerinfo = useSelector((state: any) => state.multiplayer);

  const user = useSelector((state: any) => state.user.user);
  const userLeft = useSelector((state: any) => state.multiplayer.userLeft);
  const socketI = useSelector((state: any) => state.multiplayer.socketInstance);
  const dispatch = useDispatch();

  useEffect(() => {
    if (multiplayerinfo.isMultiplayer) {
      if (!socketI) {
        socket.connect();
        dispatch(setSocketId(socket.id));
        dispatch(setSocketInstance(socket));
      }
    }
  }, [socketI]);

  useEffect(() => {
    if (socket) {
      socket.emit("give-results", multiplayerinfo.roomId);
      socket.on("Results", (users: any) => {
        const arr = users.filter((u: any) => u.userId !== user._id);
        const opp = arr[0];
        setOpponent({
          username: opp.username,
          results: opp.results,
          userId: opp.userId,
        });
      });
    }
  }, [socketI, socket]);

  // score calculator
  useEffect(() => {
    if (opponent && opponent.results) {
      if (myResult.wpm > opponent.results.wpm) {
        myScore++;
      } else if (myResult.wpm < opponent.results.wpm) {
        opponentScore++;
      }
      if (myResult.accuracy > opponent.results.accuracy) {
        myScore++;
      } else if (myResult.accuracy < opponent.results.accuracy) {
        opponentScore++;
      }
      if (myResult.consistency > opponent.results.consistency) {
        myScore++;
      } else if (myResult.consistency < opponent.results.consistency) {
        opponentScore++;
      }
      if (myScore === opponentScore) {
        toast.info("Tie");
      } else if (myScore > opponentScore) {
        document.querySelector("#me")?.classList.add("border-win");
        document.querySelector("#opponent")?.classList.add("border-loose");
        toast.info("You Won");
        winnerRef.current = user;
      } else {
        document.querySelector("#opponent")?.classList.add("border-win");
        document.querySelector("#me")?.classList.add("border-loose");
        toast.info("You Lost!");
        winnerRef.current = opponent;
      }
      submitResults();
      dispatch(setMultiplayer(false));
      dispatch(setAllUsersPresent(true))
    }
  }, [opponent, opponent?.results, userLeft]);



  const submitResults = async () => {
    await apiCall({
      method: "POST",
      url: `/type/complete-test`,
      reqData: {
        wpm: myResult.wpm ? myResult.wpm : 0,
        raw: myResult.raw,
        accuracy: myResult.accuracy,
        consistency: myResult.consistency,
        chars: myResult.chars,
        mode: myResult.mode,
        multiplayer: true,
        winner:
          winnerRef.current && winnerRef.current?.userId
            ? winnerRef.current.userId
            : null,
        opponent: opponent.userId,
        tie: winnerRef ? false : true,
        roomId: multiplayerinfo.roomId,
      },
    });
  };

  return (
    <>
      <MainNav />
      <div className=" flex justify-center items-center w-full h-full absolute text-white overflow-hidden">
        <div className="flex justify-center items-center h-[100%] w-[50%]">
          <ResultCard user={user} stats={myResult} id={"me"} />
        </div>
        <hr className="w-screen fixed  rotate-90 border-none bg-yellow-500 h-[2px]" />
        <div className="flex justify-center items-center h-screen w-[50%]">
          {opponent && (
            <ResultCard
              user={opponent}
              stats={opponent.results}
              id={"opponent"}
            />
          )}
        </div>
      </div>
    </>
  );
}
