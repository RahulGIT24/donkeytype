import { useEffect, useRef, useState } from "react";
import MainNav from "../navbars/MainNav";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../socket/socket";
import {
  setMultiplayer,
  setSocketId,
  setSocketInstance,
} from "../../redux/reducers/multiplayerSlice";
import { Bars } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import apiCall from "../../utils/apiCall";

export default function MultiplayerResult() {
  const myResult = useSelector((state: any) => state.stats.recentTestResults);
  const roomId = useSelector((state:any)=>state.multiplayer.roomId)
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
  const allUsersPresent = useSelector((state:any)=>state.multiplayer.allUsersPresent)
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
    if (socketI) {
      setMultiplayer(false)
      socketI.emit("give-results", multiplayerinfo.roomId);
      if(allUsersPresent)
      socketI.on("Results", (users: any) => {
        const arr = users.filter((u: any) => u.userId !== user._id);
        const opp = arr[0];
        setOpponent({
          username: opp.username,
          results: opp.results,
          userId: opp.userId,
        });
      });
    }
  }, [socketI]);

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
      if (!opponent.results.raw) {
        toast.info("Opponent Timed out");
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
      socket.emit("cleanup",roomId)
    }
  }, [opponent, opponent?.results]);

  const submitResults = async () => {
    await apiCall({
      method: "POST",
      url: `/type/complete-test`,
      reqData: {
        wpm: myResult.wpm?myResult.wpm:0,
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

const ResultCard = ({
  user,
  stats,
  id,
}: {
  user: any;
  stats: any;
  id?: any;
}) => {
  return (
    <>
      <div
        className={`flex flex-col gap-5 hover:bg-opacity-30 duration-200 m-5 p-4 h-[66%] rounded-md w-[70%]`}
        id={id}
      >
        <div className="flex m-2 flex-wrap gap-2 justify-center">
          <div className="flex flex-col justify-center items-center">
            <img
              src="https://imgs.search.brave.com/g0-Hfj3-TW9Xz1aHsaW5ENDHDrmssNkyyXeigI4Rr14/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9iZWZv/cmVpZ29zb2x1dGlv/bnMuY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIxLzEyL2R1/bW15LXByb2ZpbGUt/cGljLTMwMHgzMDAt/MS5wbmc"
              className="invert rounded-full w-28"
            />
            <p className="font-semibold text-5xl mt-4 mb-7">{user.username}</p>
            {stats ? (
              <>
                <Stat title={"WPM"} value={stats.wpm} />
                <Stat title={"Raw WPM"} value={stats.raw} />
                <Stat title={"Consistency"} value={stats.consistency} />
                <Stat title={"Accuracy"} value={stats.accuracy} />
                <Stat title={"Chars"} value={stats.chars} />
                <Stat title={"Mode"} value={stats.mode} />
              </>
            ) : (
              <div className="flex flex-col items-center">
                <Bars
                  height="80"
                  width="80"
                  color="yellow"
                  ariaLabel="bars-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                  visible={true}
                />
                <p className="my-4 text-3xl">Waiting for Opponent's result</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const Stat = ({ title, value }: { title: string; value: string }) => {
  return (
    <>
      <div className="flex rounded-md my-4 justify-center items-center gap-4">
        <h1 className="text-3xl text-yellow-400">{title}:</h1>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </>
  );
};
