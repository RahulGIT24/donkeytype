import { useEffect, useMemo, useState } from "react";
import MainNav from "../components/navbars/MainNav";
import apiCall from "../utils/apiCall";
import { toast } from "sonner";
import TableHoc from "../components/TableHOC";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { Bars } from "react-loader-spinner";

const Leaderboard = () => {
  const [data, setData] = useState<Array<any>>([]);
  const [firstMode, setFirstMode] = useState("Single");
  const [mode, setMode] = useState("Words 10");
  const [loader, setLoader] = useState(true);
  const [limit, setLimit] = useState(10);
  const [disabled, setDisabled] = useState(false);

  const modeButtonConfig = useMemo(
    () => [
      {
        className: mode === "Words 10" && "bg-white text-zinc-900",
        funtion: () => toggleWordTimeMode({ mode: "Words 10" }),
        text: "Words 10",
      },
      {
        className: mode === "Words 25" && "bg-white text-zinc-900",
        funtion: () => toggleWordTimeMode({ mode: "Words 25" }),
        text: "Words 25",
      },
      {
        className: mode === "Words 50" && "bg-white text-zinc-900",
        funtion: () => toggleWordTimeMode({ mode: "Words 50" }),
        text: "Words 50",
      },
      {
        className: mode === "Words 100" && "bg-white text-zinc-900",
        funtion: () => toggleWordTimeMode({ mode: "Words 100" }),
        text: "Words 100",
      },
    ],
    [mode]
  );
  const timeButtonConfig = useMemo(
    () => [
      {
        className: mode === "Time 10" && "bg-white text-zinc-900",
        funtion: () => toggleWordTimeMode({ mode: "Time 10" }),
        text: "Time 10s",
      },
      {
        className: mode === "Time 30" && "bg-white text-zinc-900",
        funtion: () => toggleWordTimeMode({ mode: "Time 30" }),
        text: "Time 30s",
      },
      {
        className: mode === "Time 60" && "bg-white text-zinc-900",
        funtion: () => toggleWordTimeMode({ mode: "Time 60" }),
        text: "Time 60s",
      },
      {
        className: mode === "Time 120" && "bg-white text-zinc-900",
        funtion: () => toggleWordTimeMode({ mode: "Time 120" }),
        text: "Time 120s",
      },
    ],
    [mode]
  );

  const firstModeButtonConfig = useMemo(
    () => [
      {
        className:
          firstMode === "Single"
            ? "bg-white text-zinc-900"
            : "bg-transparent text-zinc-400",
        funtion: () => toggleMode({ mode: "Single" }),
        text: "Single",
      },
      {
        className:
          firstMode === "Multiplayer"
            ? "bg-white text-zinc-900"
            : "bg-transparent text-zinc-400",
        funtion: () => toggleMode({ mode: "Multiplayer" }),
        text: "Multiplayer",
      },
    ],
    [firstMode]
  );

  const columns = useMemo(
    () => [
      {
        Header: "Avatar",
        accessor: "profilePic",
        Cell: ({ value }: { value: string }) => (
          <img
            src={value}
            alt="Profile"
            className="border rounded-full flex justify-center items-center h-[50px]"
          />
        ),
      },
      {
        Header: "Username",
        accessor: "username",
      },
      {
        Header: "WPM",
        accessor: "wpm",
      },
      {
        Header: "Chars",
        accessor: "chars",
      },
      {
        Header: "Accuracy",
        accessor: "accuracy",
      },
      {
        Header: "Consistency",
        accessor: "consistency",
      },
      {
        Header: "View",
        accessor: "view",
        Cell: ({ value }: { value: string }) => (
          <a href={value}>
            <FontAwesomeIcon icon={faEye} />
          </a>
        ),
      },
    ],
    []
  );

  const mutliplayer_columns = useMemo(
    () => [
      {
        Header: "Avatar",
        accessor: "profilePic",
        Cell: ({ value }: { value: string }) => (
          <img
            src={value}
            alt="Profile"
            className="border rounded-full flex justify-center items-center h-[50px]"
          />
        ),
      },
      {
        Header: "Username",
        accessor: "username",
      },
      {
        Header: "Wins",
        accessor: "wins",
      },
      {
        Header: "WPM",
        accessor: "wpm",
      },

      {
        Header: "Accuracy",
        accessor: "accuracy",
      },
      {
        Header: "Consistency",
        accessor: "consistency",
      },
    ],
    []
  );

  const fetchLeaderBoard = async () => {
    try {
      const { data, status } = await apiCall({
        url:
          firstMode !== "Multiplayer"
            ? `/stats/single-player-leaderboard/${mode}/${limit}`
            : `/stats/multi-player-leaderboard/${mode}/${limit}`,
        method: "GET",
      });
      if (status == 200) {
        const formattedHistory = data.data.map((entry: any) => ({
          wpm: Math.round(entry.wpm),
          chars: entry.chars,
          consistency: Math.round(entry.consistency),
          wins: entry.wins,
          accuracy: Math.round(entry.accuracy),
          username: entry.user.username,
          profilePic: entry.user.profilePic,
          view: `http://${import.meta.env.VITE_FRONTEND_URl}/result/?id=${entry._id}`,
        }));
        console.log(data);
        setData(formattedHistory);
        if (data.count <= limit) {
          setDisabled(true);
        }
      } else {
        setData([]);
      }
    } catch (error) {
      console.log(error);
      toast.error("Can't fetch leaderboard");
    } finally {
      setLoader(false);
    }
  };

  const toggleMode = ({ mode }: { mode: string }) => {
    setFirstMode(mode);
    setMode("Words 10");
    setDisabled(false);
    setLimit(10);
  };
  function toggleWordTimeMode({ mode }: { mode: string }) {
    setMode(mode);
    setDisabled(false);
    setLimit(10);
  }

  useEffect(() => {
    fetchLeaderBoard();
  }, [mode, limit, firstMode]);
  return (
    <>
      <MainNav />
      <div className="flex justify-center h-full relative top-11 py-8 w-full flex-col">
        <div className="flex w-full">
          {firstModeButtonConfig.map((button, index) => (
            <button
              className={`w-full py-3  hover:bg-white hover:text-zinc-900 ${button.className}`}
              onClick={button.funtion}
              key={index}
            >
              {button.text}
            </button>
          ))}
        </div>
        {firstMode === "Multiplayer" ? (
          <>
            <div className="flex w-full mt-2">
              {modeButtonConfig.map((button, index) => (
                <button
                  key={index}
                  className={`w-full py-3 hover:bg-white hover:text-zinc-900 ${button.className}`}
                  onClick={button.funtion}
                >
                  {button.text}
                </button>
              ))}
            </div>
            <div className="flex w-full mt-2">
              {timeButtonConfig.map((button, index) => (
                <button
                  key={index}
                  className={`w-full py-3 hover:bg-white hover:text-zinc-900 ${button.className}`}
                  onClick={button.funtion}
                >
                  {button.text}
                </button>
              ))}
            </div>
            <div className="overflow-y-auto mt-10">
              {data && data.length > 0 && !loader ? (
                <>
                  <TableHoc columns={mutliplayer_columns} data={data} />
                  <div className="w-full flex justify-center items-center">
                    <button
                      className="text-2xl mx-6 text-center bg-zinc-800 mt-4 pb-1 cursor-pointer items-center w-full hover:bg-zinc-200 hover:text-zinc-800 transition ease-in-out duration-150"
                      disabled={disabled}
                      onClick={() => {
                        setLimit(limit + 10);
                      }}
                    >
                      Show More
                    </button>
                  </div>
                </>
              ) : (
                <div>
                  {loader ? (
                    <div className="flex justify-center items-center h-[45vh]">
                      <Bars
                        height="80"
                        width="80"
                        color="yellow"
                        ariaLabel="bars-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                      />
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-[45vh]">
                      <p className="text-3xl">No Leaderboard Stats Found</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex w-full mt-2">
              {modeButtonConfig.map((button, index) => (
                <button
                  key={index}
                  className={`w-full py-3 hover:bg-white hover:text-zinc-900 ${button.className}`}
                  onClick={button.funtion}
                >
                  {button.text}
                </button>
              ))}
            </div>
            <div className="flex w-full mt-2">
              {timeButtonConfig.map((button, index) => (
                <button
                  key={index}
                  className={`w-full py-3 hover:bg-white hover:text-zinc-900 ${button.className}`}
                  onClick={button.funtion}
                >
                  {button.text}
                </button>
              ))}
            </div>
            <div className="overflow-y-auto mt-10">
              {data && data.length > 0 && !loader ? (
                <>
                  <TableHoc columns={columns} data={data} />
                  <div className="w-full flex justify-center items-center">
                    <button
                      className="text-2xl mx-6 text-center bg-zinc-800 mt-4 pb-1 cursor-pointer items-center w-full hover:bg-zinc-200 hover:text-zinc-800 transition ease-in-out duration-150"
                      disabled={disabled}
                      onClick={() => {
                        setLimit(limit + 10);
                      }}
                    >
                      Show More
                    </button>
                  </div>
                </>
              ) : (
                <div>
                  {loader ? (
                    <div className="flex justify-center items-center h-[45vh]">
                      <Bars
                        height="80"
                        width="80"
                        color="yellow"
                        ariaLabel="bars-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                      />
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-[45vh]">
                      <p className="text-3xl">No Leaderboard Stats Found</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Leaderboard;
