import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
//import UserCard from "../components/user/UserCard";
import MainNav from "../components/navbars/MainNav";
import apiCall from "../utils/apiCall";
import TableHoc from "../components/TableHOC";
import { useNavigate } from "react-router-dom";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setHistory, setUserAverageStats } from "../redux/reducers/statSlice";
import convertToCustomFormat from "../utils/convertDate";
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
        <History />
        {/* <LeaderBoard /> */}
      </div>
    </>
  );
}

export function UserCard({
  user,
  joinedon = true,
}: {
  user: any;
  joinedon?: boolean;
}) {
  return (
    <>
      <div className="flex bg-zinc-800 p-4 rounded-md mx-2 group border border-transparent hover:border-yellow-500 duration-300 w-full h-[25vh]">
        <img
          src={user.profilePic}
          alt="loading"
          className=" bg-white w-40 h-40 rounded-full invert border-4 group-hover:border-blue-500 duration-300"
        />
        <div className="flex relative top-12 -right-10 flex-col gap-4 group-hover:text-yellow-500 duration-300">
          <p className="text-4xl">{user.username}</p>
          {joinedon && (
            <p>
              {"Joined On "} {convertToCustomFormat(user.createdAt)}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

//test detail
const TestDetails = () => {
  const user = useSelector((state: any) => state.user.user);
  return (
    <>
      <div className="flex bg-zinc-800 w-full h-[25vh]">
        <div className="flex p-4 h-52 flex-wrap text-2xl gap-64 justify-center items-center">
          {user && (
            <>
              <p className="p-4">Tests started :{user.testStarted}</p>
              <p className="p-4">Tests completed :{user.testCompleted}</p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

//user avg stats
const UserStats = () => {
  const userStats = useSelector((state: any) => state.stats.userAverageStats);
  const user = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      const { data } = await apiCall({
        method: "GET",
        url: `/stats/get-average-stats`,
      });
      dispatch(setUserAverageStats(data));
    })();
  }, []);
  const averages = userStats?.averages;
  const highestWpm = userStats?.highestWPM;
  const max = userStats?.max;
  const lastTenAverages = userStats?.lastTenAverages;

  return (
    <>
      {userStats && (
        <div className="flex bg-zinc-800 p-5 justify-center items-center w-full">
          <div className="w-full flex flex-col justify-center items-center">
            <div>
              {user && (
                <div className="">
                  <p className="text-zinc-300">tests started</p>
                  <p className="font-semibold text-5xl">{user.testStarted}</p>
                </div>
              )}
              {highestWpm && max && (
                <>
                  <div className="mt-6 ">
                    <p className="text-zinc-300">highest wpm</p>
                    <p className="font-semibold text-5xl">
                      {Math.round(highestWpm.wpm)}
                    </p>
                    <p>{highestWpm.mode}</p>
                  </div>
                  <div className="mt-6 ">
                    <p className="text-zinc-300">highest accuracy</p>
                    <p className="font-semibold text-5xl">
                      {Math.round(max.highestAccuracy)}
                    </p>
                  </div>
                  <div className="mt-6 ">
                    <p className="text-zinc-300">highest consistency</p>
                    <p className="font-semibold text-5xl">
                      {Math.round(max.highestConsistency)}
                    </p>
                  </div>
                  <div className="mt-6 ">
                    <p className="text-zinc-300">highest raw wpm</p>
                    <p className="font-semibold text-5xl">
                      {Math.round(max.highestRaw)}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="w-full flex flex-col -mt-4 justify-center items-center">
            <div>
              {user && (
                <div>
                  <p className="text-zinc-300">tests completed</p>
                  <p className="font-semibold text-5xl">{user.testCompleted}</p>
                </div>
              )}
              {lastTenAverages != null && (
                <>
                  <div className="mt-6 ">
                    <p className="text-zinc-300">average wpm</p>
                    <p className="font-semibold text-5xl">
                      {Math.round(lastTenAverages.averageWpm)}
                    </p>
                  </div>
                  <div className="mt-6 ">
                    <p className="text-zinc-300">average accuracy</p>
                    <p className="font-semibold text-5xl">
                      {Math.round(lastTenAverages.averageAccuracy)}
                    </p>
                  </div>
                  <div className="mt-6 ">
                    <p className="text-zinc-300">average consistency</p>
                    <p className="font-semibold text-5xl">
                      {Math.round(lastTenAverages.averageConsistency)}
                    </p>
                  </div>
                  <div className="mt-6 ">
                    <p className="text-zinc-300">average raw wpm</p>
                    <p className="font-semibold text-5xl">
                      {Math.round(lastTenAverages.averageRawpm)}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="w-full flex flex-col -mt-4 justify-center items-center">
            <div>
              {user && (
                <div>
                  <p className="text-zinc-300">Test Completion Rate</p>
                  <p className="font-semibold text-5xl">
                    {Math.round((user.testCompleted / user.testStarted) * 100)}{" "}
                    {"%"}
                  </p>
                </div>
              )}
              {averages != null && (
                <>
                  <div className="mt-6 ">
                    <p className="text-zinc-300">average wpm (last 10 tests)</p>
                    <p className="font-semibold text-5xl">
                      {Math.round(averages.averageWpm)}
                    </p>
                  </div>
                  <div className="mt-6 ">
                    <p className="text-zinc-300">
                      average accuracy (last 10 tests)
                    </p>
                    <p className="font-semibold text-5xl">
                      {Math.round(averages.averageAccuracy)}
                    </p>
                  </div>
                  <div className="mt-6 ">
                    <p className="text-zinc-300">
                      average consistency (last 10 tests)
                    </p>
                    <p className="font-semibold text-5xl">
                      {Math.round(averages.averageConsistency)}
                    </p>
                  </div>
                  <div className="mt-6 ">
                    <p className="text-zinc-300">
                      average raw wpm (last 10 tests)
                    </p>
                    <p className="font-semibold text-5xl">
                      {Math.round(averages.averageRawpm)}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const History = () => {
  const [limit, setLimit] = useState(5);
  const history = useSelector((state: any) => state.stats.history);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const columns = React.useMemo(
    () => [
      {
        Header: "wpm",
        accessor: "wpm",
      },
      {
        Header: "raw",
        accessor: "raw",
      },
      {
        Header: "accuracy",
        accessor: "accuracy",
      },
      {
        Header: "chars",
        accessor: "chars",
      },
      {
        Header: "mode",
        accessor: "mode",
      },
      {
        Header: "date",
        accessor: "createdAt",
      },
      {
        Header: "view",
        Cell: ({ row }: { row: any }) => (
          <>
            <FontAwesomeIcon
              icon={faEye}
              className="cursor-pointer"
              onClick={() => {
                navigate(`/result/?id=${row.original._id}`);
              }}
            />
          </>
        ),
      },
    ],
    [limit]
  );
  const [disabled, setDisabled] = useState(false);
  const [currentHistoryMode, setCurrentHistoryMode] = useState("NORMAL");
  const getHistory = async () => {
    const res = await apiCall({
      method: "GET",
      url: `/stats/get-history?limit=${limit}&mode=${currentHistoryMode}`,
    });
    if (res.data.totalResultFetched >= res.data.totalResults) {
      setDisabled(true);
    }
    dispatch(setHistory(res.data.history));
  };
  const loadMore = () => {
    setLimit(limit + 5);
  };
  useEffect(() => {
    getHistory();
  }, [limit, currentHistoryMode]);
  const toogleMode = () => {
    if (currentHistoryMode === "NORMAL") {
      setCurrentHistoryMode("MULTIPLAYER");
    } else {
      setCurrentHistoryMode("NORMAL");
    }
  };
  return (
    <>
      <div className="bg-zinc-800 pt-3">
        <h1 className="text-2xl text-center">History</h1>
        <div className="flex w-full my-3">
          <button
            className={`w-full p-3 ${
              currentHistoryMode === "NORMAL" && "bg-zinc-200 text-zinc-900"
            } hover:bg-white hover:text-zinc-900`}
            onClick={toogleMode}
          >
            Normal
          </button>
          <button
            className={`w-full p-3 ${
              currentHistoryMode === "MULTIPLAYER" &&
              "bg-zinc-200 text-zinc-900"
            } hover:bg-white hover:text-zinc-900`}
            onClick={toogleMode}
          >
            Multiplayer
          </button>
        </div>
        {history && history.length > 0 && (
          <TableHoc columns={columns} data={history} />
        )}
        <button
          className="text-2xl text-center bg-zinc-800 mt-4 pb-1 cursor-pointer items-center w-full hover:bg-zinc-200 hover:text-zinc-800 transition ease-in-out duration-150"
          onClick={loadMore}
          disabled={disabled}
        >
          Load More
        </button>
      </div>
    </>
  );
};

// const LeaderBoard = () => {
//   return (
//     <>
//       <div className=" bg-zinc-800">
//         <h1 className="text-2xl flex justify-center">Leaderboard</h1>
//       </div>
//     </>
//   );
// };
