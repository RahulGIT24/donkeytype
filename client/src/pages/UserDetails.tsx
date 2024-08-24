import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
//import UserCard from "../components/user/UserCard";
import MainNav from "../components/navbars/MainNav";
import apiCall from "../utils/apiCall";
export default function UserDetails() {
  const user = useSelector((state: any) => state.user.user);
  return (
    <>
      <MainNav />
      <div className="flex justify-center h-full relative top-11 p-8 w-full flex-col gap-4">
        <div className="flex justify-center w-full">
          <UserCard user={user} />
          <TestDetails />
        </div>
        <UserStats />
        <LeaderBoard/>
      </div>
    </>
  );
}

function UserCard({ user }: any) {
  return (
    <>
      <div className="flex bg-zinc-800 p-4 rounded-md m-2 group border border-transparent hover:border-yellow-500 duration-300 min-w-[500px] ">
        <img
          src={user.profilePic}
          alt="loading"
          className=" bg-white w-40 h-40 rounded-full invert border-4 group-hover:border-blue-500 duration-300"
        />
        <div className="flex relative top-12 -right-10 flex-col gap-4 group-hover:text-yellow-500 duration-300">
          <p className="text-4xl">{user.username}</p>
          <p>{user.createdAt}</p>
        </div>
      </div>
    </>
  );
}

//test detail
const TestDetails = () => {
  const [res,setRes]= useState<any>(null)
  useEffect(() => {
    (async () => {
      const { data } = await apiCall({
        method: "GET",
        url: `/stats/get-history?limit=10`,
      });
      setRes(data);
    })();
  }, []);
  console.log(res)
  return (
    <>
      <div className="flex bg-zinc-800 min-w-[500px]">
        <div className="flex p-4 h-52 flex-wrap text-2xl gap-64 justify-center items-center">
          <p className="p-4">Tests started :{res?.totalResults  |5}</p>
          <p className="p-4">Tests completed :5</p>
        </div>
      </div>
    </>
  );
};

//user avg stats
const UserStats = () => {
  const [res, setRes] = useState<any>(null);
  useEffect(() => {
    (async () => {
      const { data } = await apiCall({
        method: "GET",
        url: `/stats/get-average-stats`,
      });
      setRes(data);
    })();
  }, []);
  

  return (
    <>
      <div className="flex bg-zinc-800 ">
        <ul className=" flex justify-around w-full text-2xl p-3">
          <li>
            <h1 className="text-yellow-400">Avg</h1>
            <div className="flex justify-center text-xl flex-col items-center relative  -left-[70px] hover:text-yellow-400 duration-500">
              <p> accuracy :{res?.averages.averageAccuracy}</p>
              <p> wpm :{res?.averages.averageWpm}</p>
              <p> consistency :{res?.averages.averageConsistency}</p>
              <p> raw :{Math.round(res?.averages.averageRawpm)}</p>
            </div>
          </li>

          <li>
            <h1 className="text-yellow-400">Highest</h1>
            <div className="flex justify-center text-xl flex-col items-center relative  -left-[35px] hover:text-yellow-400 duration-500">
              <p> wpm :{Math.round(res?.highestWPM.wpm)}</p>
              <p> mode :{res?.highestWPM.mode}</p>
            </div>
          </li>
          <li>
            <h1 className="text-yellow-400">Max</h1>
            <div className="flex justify-center text-xl flex-col items-center relative  -left-[65px] hover:text-yellow-400 duration-500">
              <p> accuracy :{res?.max.highestAccuracy}%</p>
              <p> consistency :{res?.max.highestConsistency}%</p>
              <p> raw :{Math.round(res?.max.highestRaw)}</p>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
};

const LeaderBoard = () => {
  return (
    <>
      <div className=" bg-zinc-800">
        <h1 className="text-2xl flex justify-center">Leaderboard</h1>
      </div>
    </>
  );
};
