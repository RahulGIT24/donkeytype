import React, { useEffect, useState } from "react";
import MainNav from "../navbars/MainNav";
import { useSelector } from "react-redux";
import { UserCard } from "../../pages/UserDetails";

export default function MultiplayerResult() {
  const [recievedResult, setRecievedResult] = useState(null);
  const multiplayerinfo = useSelector((state: any) => state.multiplayer); //later combining it in a user result object wiht the result
  const user = useSelector((state: any) => state.user.user);
  const stats = useSelector((state: any) => state.stats);
  console.log(multiplayerinfo);
  const currUserRes = { user: user, stats: stats.recentTestResults };
  return (
    <>
      <MainNav />
      <div className=" flex justify-center items-center w-full h-full absolute text-white overflow-hidden">
        <div className="flex flex-1 justify-center items-center h-full gap-10">
          <ResultCard multiplayerinfo={currUserRes} />
          <hr className="w-screen fixed  rotate-90 border-none bg-yellow-500 h-[2px]" />
          {!recievedResult ? (
            <ResultCard multiplayerinfo={{ user: user ,stats:stats.opponentTestResults}} />
          ) : (
            <p>Opponent still playing</p>
          )}
        </div>
      </div>
    </>
  );
}

const ResultCard = ({ multiplayerinfo }: any) => {
  //const [stats, setStats] = useState<(string | number)[]>([]);
  console.log(multiplayerinfo);
 /*  useEffect(() => {
    if (!multiplayerinfo.stats) return;
    const valuesArray = Object.keys(multiplayerinfo.stats).map(
      (key: any) => multiplayerinfo.stats[key]
    );
    setStats(valuesArray); // Update state with the array
  }, []); */
  const stats= [['wpm', '60'], ['consistency', 30], ['acc', '45%'],['raw', '480']]
  return (
    <>
      <div className={`flex flex-col gap-5 hover:bg-green-400 hover:bg-opacity-30 duration-200 m-5 p-4 h-70% rounded-md border-4 hover:border-4 hover: border-green-400`}>
        <UserCard user={multiplayerinfo.user} />
        <div className="flex m-2 flex-wrap gap-2 justify-center">
          {stats
            ? stats.map((stat: any) => {
                return <Stat stat={stat} />;
              })
            : null}
        </div>
      </div>
    </>
  );
};

const Stat = ({ stat }: any) => {
  return (
    <>
      <div className="flex bg-zinc-900 flex-col rounded-md p-10 justify-center items-center gap-4">
        <h1 className="text-3xl text-yellow-400">{stat[0]}</h1>

        <p className="text-xl">{stat[1]}</p>
      </div>
    </>
  );
};
